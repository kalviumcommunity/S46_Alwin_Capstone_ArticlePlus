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

async function generateResizedImages(displayPictureFile, id, creatorDetails) {
    try {
        const mediumBuffer = await convertToWebp(displayPictureFile, 80, 400, 400)
        const smallBuffer = await convertToWebp(displayPictureFile, 80, 200, 200)

        const mediumImageRef = storage.bucket().file(`creators/${id}/${id}-dp-medium.jpg`)
        const smallImageRef = storage.bucket().file(`creators/${id}/${id}-dp-small.jpg`)

        await uploadImage(mediumImageRef, mediumBuffer)
        await uploadImage(smallImageRef, smallBuffer)

        const mediumDisplayPictureUrl = await getDownloadURL(mediumImageRef)
        const smallDisplayPictureUrl = await getDownloadURL(smallImageRef)

        // Updating creator details with medium and small image URLs in the database
        await Creator.findOneAndUpdate(
            { id },
            {
                "displayPicture.medium": mediumDisplayPictureUrl,
                "displayPicture.small": smallDisplayPictureUrl,
            },
        )
    } catch (err) {
        console.error("Error generating resized images:", err)
    }
}

async function uploadImage(imageRef, buffer) {
    const stream = imageRef.createWriteStream({
        metadata: {
            contentType: "image/webp",
        },
    })

    return new Promise((resolve, reject) => {
        stream.on("error", reject)
        stream.on("finish", resolve)
        stream.end(buffer)
    })
}

const onboardCreator = async (req, res) => {
    const { userId } = req
    const { id, name, description, type, subscription, subscriptions } = req.body
    const displayPictureFile = req.file

    const creatorDetails = {
        id,
        name,
        displayPicture: {
            large: null,
        },
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

            creatorDetails.displayPicture.large = displayPictureUrl
            creatorDetails.owner = userId

            try {
                const newCreator = await new Creator(creatorDetails).save()
                await User.findByIdAndUpdate(userId, {
                    creator: true,
                    creatorId: newCreator._id.toString(),
                })

                generateResizedImages(displayPictureFile, id, creatorDetails)

                return res.json({ onboarding: "success" })
            } catch (e) {
                console.log(e)
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

const joinOrganization = async (req, res) => {
    const userId = req.userId
    const { inviteCode } = req.body

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const creator = await Creator.findOne({ "invite.code": inviteCode })
        if (!creator) {
            return res.status(404).json({ message: "Not a valid creator invite code" })
        }

        // Check if the user is already a contributor to the creator
        const isContributor = creator.contributors.some(
            (contributor) => contributor.userRef === userId,
        )

        if (isContributor) {
            return res
                .status(400)
                .json({ message: `Your already a contributor to ${creator.name}` })
        }

        // Check if the user has already sent a join request
        const existingRequest = creator.joinRequests.find(
            (request) => request.userRef === userId,
        )

        if (existingRequest) {
            return res.status(400).json({ message: "Join request already sent" })
        }

        // Add the join request
        creator.joinRequests.push({
            inviteCode,
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            userRef: user._id.toString(),
            displayPicture: user?.displayPicture,
            createdAt: new Date(),
            role: "author",
        })

        await creator.save()

        return res.json({
            success: true,
            message: "Join request sent successfully",
            creatorName: creator.name,
        })
    } catch (error) {
        console.error("Error in joinOrganization:", error)
        return res.status(500).json({ message: "Internal server error" })
    }
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
        const creator = await Creator.findOne({ id: id }).select(
            "-contributors -joinRequests -owner -v -_id",
        )

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

        let displayPicture = creator.displayPicture.large
        if (creator.displayPicture.small) {
            displayPicture = creator.displayPicture.small
        }

        const creatorProfile = {
            ...creator.toObject(),
            displayPicture,
        }

        return res.json({ creator: creatorProfile, isFollowing, isSubscribed })
    } catch (error) {
        console.error("Error fetching creator profile:", error)
        return res.status(500).json({ message: "Failed to fetch creator profile" })
    }
}

const getContributorWithArticles = async (req, res) => {
    try {
        const { id, contributorId } = req.params
        const { page = 1, pageSize = 10 } = req.query // Default values for pagination
        const isLoggedIn = req.isUserLoggedIn

        // Check if page and pageSize are numbers and positive integers
        const currentPage = Math.max(parseInt(page, 10), 1)
        const currentPageSize = Math.max(parseInt(pageSize, 10), 1)

        const creator = await Creator.findOne({ id })

        if (!creator) {
            return res.status(404).json({ message: "Creator not found" })
        }

        const contributor = creator.contributors.find(
            (contributor) => contributor.userRef === contributorId,
        )

        if (!contributor) {
            return res.status(404).json({ message: "Contributor not found" })
        }

        let isSubscribed = false

        if (isLoggedIn) {
            const userId = req.userId

            const user = await User.findOne({ id: userId }).select("action.subscriptions")

            if (user) {
                // Check if the user is subscribed to the creator
                isSubscribed = user.action.subscriptions.some(
                    (subscription) => subscription.id === creator._id.toString(),
                )
            }
        }

        const queryConditions = {
            "flags.creator": creator._id,
            "flags.status": "published",
            "flags.author.userRef": contributor.userRef,
        }

        // If not subscribed, only include free articles
        if (!isSubscribed) {
            queryConditions["flags.access"] = "all"
        }

        // Query for the articles by the creator or contributor, with pagination
        const [creatorArticles, totalArticles] = await Promise.all([
            Article.find(queryConditions)
                .sort({ publishedAt: -1 })
                .skip((currentPage - 1) * currentPageSize)
                .limit(currentPageSize)
                .select("-__v -_id -flags -content")
                .lean(),
            Article.countDocuments(queryConditions),
        ])

        const creatorProfile = {
            type: "contributor",
            displayPicture: contributor.displayPicture,
            name: contributor.name,
            description: contributor.description,
            articles: {
                free: 0,
                subscription: 0,
                total: totalArticles,
            },
        }

        const organization = {
            id: creator.id,
            type: "organization",
            displayPicture: creator.displayPicture.small
                ? creator.displayPicture.small
                : creator.displayPicture.large,
            name: creator.name,
            description: creator.description,
            articles: {
                free: creator.articles.free,
                subscription: creator.articles.subscription,
                total: creator.articles.total,
            },
        }

        // Determine if there are more articles to fetch
        const moreArticlesExist = currentPage * currentPageSize < totalArticles

        res.json({
            creator: creatorProfile,
            organization: organization,
            articles: creatorArticles,
            page: currentPage,
            moreArticlesExist,
            isSubscribed,
        })
    } catch (error) {
        console.error(error)
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
            success: true,
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
    if (!req.isUserLoggedIn) {
        return res.status(401).json({ message: "Login required" })
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
            success: true,
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

const subscribeCreator = async (req, res) => {
    const { id } = req.params
    const { userId, isUserLoggedIn } = req
    const { plan } = req.body

    if (!isUserLoggedIn) {
        return res.status(401).json({ message: "Login required" })
    }

    const user = await User.findById(userId)
    if (!user) {
        return res.status(401).json({ message: "User not found" })
    }

    if (!plan || !["monthly", "annual"].includes(plan)) {
        return res.status(400).json({ success: false, message: "Invalid subscription plan" })
    }

    try {
        const [user, creator] = await Promise.all([
            User.findById(userId),
            Creator.findOne({ id }),
        ])

        if (!user) {
            return res
                .status(200)
                .json({ success: false, message: "User not found", requireLogin: true })
        }

        if (!creator) {
            return res.status(404).json({ success: false, message: "Creator not found" })
        }

        const isAlreadySubscribed = user.actions.subscriptions.some(
            (subscription) => subscription.creatorId === id,
        )

        if (isAlreadySubscribed) {
            return res
                .status(400)
                .json({ success: false, message: "Already subscribed to this creator" })
        }

        const subscriptionPlan = creator.subscriptions[0]

        if (!subscriptionPlan) {
            return res
                .status(400)
                .json({ success: false, message: "Subscription plan not found" })
        }

        const planDetails = subscriptionPlan[plan]

        if (!planDetails) {
            return res
                .status(400)
                .json({ success: false, message: "Selected plan not available" })
        }

        user.actions.subscriptions.push({
            creatorRefId: creator._id.toString(),
            creatorId: creator.id,
            creatorName: creator.name,
            createdAt: new Date(),
            plan: plan,
            autoRenew: plan === "monthly",
        })
        creator.subscribers++

        await Promise.all([user.save(), creator.save()])

        return res.json({
            success: true,
            isSubscribed: true,
            message: `Subscribed to ${creator.name}`,
            plan: {
                name: subscriptionPlan.name,
                type: plan,
                price: planDetails.price,
                features: subscriptionPlan.features,
            },
        })
    } catch (error) {
        console.error("Error in subscribeCreator:", error)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

const unsubscribeCreator = async (req, res) => {
    const { id } = req.params
    const { userId, isUserLoggedIn } = req

    if (!isUserLoggedIn) {
        return res
            .status(200)
            .json({ success: false, message: "Login required", requireLogin: true })
    }

    try {
        const [user, creator] = await Promise.all([
            User.findById(userId),
            Creator.findOne({ id }),
        ])

        if (!user) {
            return res
                .status(200)
                .json({ success: false, message: "User not found", requireLogin: true })
        }

        if (!creator) {
            return res.status(404).json({ success: false, message: "Creator not found" })
        }

        const subscriptionIndex = user.actions.subscriptions.findIndex(
            (subscription) => subscription.creatorId === id,
        )

        if (subscriptionIndex === -1) {
            return res
                .status(400)
                .json({ success: false, message: "Not subscribed to this creator" })
        }

        user.actions.subscriptions.splice(subscriptionIndex, 1)
        creator.subscribers = Math.max(0, creator.subscribers - 1)

        await Promise.all([user.save(), creator.save()])

        return res.json({
            success: true,
            isSubscribed: false,
            message: `Unsubscribed from ${creator.name}`,
        })
    } catch (error) {
        console.error("Error in unsubscribeCreator:", error)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

module.exports = {
    onboardCreator,
    joinOrganization,
    getCreatorArticles,
    getCreatorProfile,
    getContributorWithArticles,
    getForFollowerArticles,
    getForSubscriberArticles,
    toggleFollow,
    subscribeCreator,
    unsubscribeCreator,
}
