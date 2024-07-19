const { getStorage, getDownloadURL } = require("firebase-admin/storage")
const Joi = require("joi")

const Creator = require("../models/creator")
const User = require("../models/user")
const Article = require("../models/article")

const { convertToWebp } = require("../lib/sharp")

const storage = getStorage()

const creatorDetailsSchema = Joi.object({
    id: Joi.string().required().trim(),
    name: Joi.string().required().trim(),
    displayPicture: Joi.any(),
    description: Joi.string()
        .required()
        .trim()
        .replace(/\s{2,}/g, " "),
    type: Joi.string().required().valid("individual", "organization"),
    subscription: Joi.boolean().required(),
    subscriptions: Joi.any(),
})

const convertDisplayNameToId = (name) => {
    return name
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s/g, "-")
}

const onboardCreator = async (req, res) => {
    const { userId } = req
    const { id, name, description, type, subscription, subscriptions } = req.body
    const displayPictureFile = req.file

    const creatorDetails = {
        id,
        name,
        displayPicture: null,
        description,
        type,
        subscription,
        subscriptions: subscriptions ? JSON.parse(subscriptions) : null,
    }

    const { error } = await creatorDetailsSchema.validate(creatorDetails, {
        abortEarly: false,
    })

    if (error) {
        return res
            .status(400)
            .json({ invalidInput: error.details.map((detail) => detail.message) })
    }

    creatorDetails.subscription = creatorDetails.subscription === "true"

    if (!creatorDetails.subscription) {
        delete creatorDetails.subscriptions
    }

    // Check if ID is unique
    const existingCreator = await Creator.findOne({ id })
    if (existingCreator) {
        return res.status(400).json({ status: "failed", message: "ID already in use" })
    }

    const user = await User.findById(userId)
    if (user.creator) {
        return res.json({ status: "failed", message: "User is already a creator" })
    }

    const ownerId = convertDisplayNameToId(user.name)

    creatorDetails.contributors = [
        {
            name: user.name,
            id: ownerId,
            role: "owner",
            userRef: user._id.toString(),
        },
    ]

    try {
        const webpDisplayPictureFile = await convertToWebp(displayPictureFile, 80, 1920, 1920)

        const imageRef = storage.bucket().file(`creators/${id}/${id}-dp.jpg`)
        const blobStream = imageRef.createWriteStream({
            metadata: {
                contentType: "image/webp",
            },
        })

        blobStream.on("error", (err) => {
            return res.status(500).send("Error uploading file")
        })

        blobStream.on("finish", async () => {
            const displayPictureUrl = await getDownloadURL(imageRef)

            creatorDetails.displayPicture = displayPictureUrl
            creatorDetails.owner = userId

            try {
                const newCreator = await new Creator(creatorDetails).save()
                await User.findByIdAndUpdate(userId, {
                    creator: true,
                    creatorId: newCreator._id.toString(),
                })

                return res.json({ onboarding: "success" })
            } catch (e) {
                return res
                    .status(500)
                    .json({ status: "failed", message: "Error saving creator details" })
            }
        })

        blobStream.end(webpDisplayPictureFile)
    } catch (e) {
        return res
            .status(500)
            .json({ status: "failed", message: "Error processing display picture" })
    }
}

const authCreatorInfo = async (req, res) => {
    const { userId } = req

    const user = await User.findById(userId)

    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    if (!user.creator) {
        return res.status(403).json({ message: "User is not a creator" })
    }

    const creator = await Creator.findOne(
        { contributors: { $elemMatch: { userRef: userId } } },
        { contributors: { $elemMatch: { userRef: userId } }, __v: 0 },
    )

    if (!creator) {
        return res.status(404).json({ message: "Creator not found" })
    }

    const creatorDetails = creator.toObject()

    creatorDetails.user = creatorDetails.contributors[0]

    delete creatorDetails.contributors

    return res.json(creatorDetails)
}

const getCreatorArticles = async (req, res) => {
    const { page = 1, recent = false } = req.body
    const userId = req.userId
    const limit = 10
    const skip = (parseInt(page, 10) - 1) * limit

    try {
        // Fetch user and creator information
        const user = await User.findById(userId)
        if (!user) {
            throw new Error("User not found")
        }

        const creator = await Creator.findById(user.creatorId)
        if (!creator) {
            throw new Error("Creator not found")
        }

        // Check if the user is authorized (contributor)
        const isContributor = creator.contributors.some(
            (contributor) => contributor.userRef === userId,
        )
        if (!isContributor) {
            return res
                .status(403)
                .json({ message: "You are not authorized to access these articles" })
        }

        // Build query based on creator type
        let query
        if (creator.type === "individual") {
            query = { "flags.creator": creator._id }
        } else if (creator.type === "organization") {
            query = { "flags.author.userRef": userId }
        } else {
            return res.status(400).json({ message: "Invalid creator type" })
        }

        // Retrieve articles based on query, skip, limit, and projection
        let articlesQuery = Article.find(query)
            .skip(skip)
            .limit(limit)
            .select("-content -slug -flow -display -category -flags.slugHash -subtitle")
            .sort({ createdAt: -1 })

        // If recent flag is true, sort by date descending to get the most recent 4 articles
        if (recent) {
            articlesQuery = articlesQuery.sort({ createdAt: -1 }).limit(4)
        }

        const articles = await articlesQuery
        const total = await Article.countDocuments(query)

        res.json({ articles, total })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Server Error" })
    }
}

const getCreatorProfile = async (req, res) => {
    const { id } = req.params
    const isLoggedIn = req.isUserLoggedIn

    try {
        const creator = await Creator.findOne({ id: id }).select("-contributors")

        if (!creator) {
            return res.status(404).json({ message: "Creator not found" })
        }

        // Default values for isFollowing and isSubscribed
        let isFollowing = false
        let isSubscribed = false

        if (isLoggedIn) {
            const loggedInUser = await User.findOne({ _id: req.userId })

            if (!loggedInUser) {
                return res.status(404).json({ message: "Logged-in user not found" })
            }

            // Check if the creator ID is in the logged-in user's following or subscribed lists
            isFollowing = loggedInUser.actions.following.some(
                (follow) => follow.creatorId === id,
            )
            isSubscribed = loggedInUser.actions.subscriptions.some(
                (subscription) => subscription.creatorId === id,
            )
        }

        // Return the creator profile with the appropriate flags
        return res.json({ creator, isFollowing, isSubscribed })
    } catch (error) {
        console.error("Error fetching creator profile:", error)
        return res.status(500).json({ message: "Failed to fetch creator profile" })
    }
}

const getForFollowerArticles = async (req, res) => {
    const { id } = req.params
    const page = parseInt(req.query.page, 10) || 1 // Default to page 1
    const pageSize = 8

    try {
        const creator = await Creator.findOne({ id }).select("-contributors")

        if (!creator) {
            return res.status(404).json({ message: "Creator not found" })
        }

        const creatorArticles = await Article.find({
            "flags.creator": creator._id,
            "flags.status": "published",
            "flags.access": "all",
        })
            .sort({ publishedAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .select("-__v -_id -flags -content")
            .lean()

        const totalArticles = await Article.countDocuments({
            "flags.creator": creator._id,
            "flags.status": "published",
            "flags.access": "all",
        })

        const moreArticlesExist = page * pageSize < totalArticles

        res.json({
            articles: creatorArticles,
            page,
            moreArticlesExist,
        })
    } catch (error) {
        console.error("Error serving creator articles:", error)
        res.status(500).json({ message: "Error serving creator articles" })
    }
}

const getForSubscriberArticles = async (req, res) => {
    if (!req.isLoggedIn) {
        return res.status(401).json({ message: "Not Authorized" })
    }

    const { id } = req.params
    const page = parseInt(req.query.page, 10) || 1 // Default to page 1
    const pageSize = 8
    const userId = req.userId

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }

        const isSubscribed = user.actions.subscriptions.some((sub) => sub.creatorId === id)
        if (!isSubscribed) {
            return res.status(403).json({ message: "User not subscribed to this creator" })
        }

        const creator = await Creator.findOne({ id }).select("-contributors")
        if (!creator) {
            return res.status(404).json({ message: "Creator not found" })
        }

        const creatorArticles = await Article.find({
            "flags.creator": creator._id,
            "flags.status": "published",
            "flags.access": "subscribers",
        })
            .sort({ publishedAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .select("-__v -_id -flags -content")
            .lean()

        const totalArticles = await Article.countDocuments({
            "flags.creator": creator._id,
            "flags.status": "published",
            "flags.access": "subscribers",
        })

        const moreArticlesExist = page * pageSize < totalArticles

        res.json({
            articles: creatorArticles,
            page,
            moreArticlesExist,
        })
    } catch (error) {
        console.error("Error serving creator articles:", error)
        res.status(500).json({ message: "Error serving creator articles" })
    }
}

const toggleFollow = async (req, res) => {
    const { id } = req.params
    const userId = req.userId
    const isUserLoggedIn = req.isUserLoggedIn

    if (!isUserLoggedIn) {
        return res.status(401).json({ message: "Login required" })
    }

    const user = await User.findById(userId)
    if (!user) {
        return res.status(401).json({ message: "User not found" })
    }

    const creator = await Creator.findOne({ id })
    if (!creator) {
        return res.status(404).json({ message: "Creator not found" })
    }

    // Check if the user is already following the creator
    const followingIndex = user.actions.following.findIndex(
        (following) => following.creatorId === id,
    )

    let isFollowing = false
    let message = ""

    if (followingIndex !== -1) {
        // If following, remove the creator from the following list
        user.actions.following.splice(followingIndex, 1)
        creator.followers--
        message = `Unfollowed ${creator.name}`
    } else {
        user.actions.following.push({
            creatorRefId: creator._id.toString(),
            creatorId: creator.id,
            creatorName: creator.name,
            createdAt: new Date(),
        })
        creator.followers++
        isFollowing = true
        message = `Following ${creator.name}`
    }

    // Save the updated documents
    await user.save()
    await creator.save()

    return res.json({ success: true, isFollowing, message })
}

module.exports = {
    onboardCreator,
    authCreatorInfo,
    getCreatorArticles,
    getCreatorProfile,
    getForFollowerArticles,
    getForSubscriberArticles,
    toggleFollow,
}
