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

module.exports = { onboardCreator, authCreatorInfo, getCreatorArticles }
