const { getStorage, getDownloadURL } = require("firebase-admin/storage")
const Joi = require("joi")

const Creator = require("../models/creator")
const User = require("../models/user")

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

    const user = await User.findById(userId)
    if (user.creator) {
        return res.json({ status: "failed", message: "User is already a creator" })
    }

    const imageRef = storage.bucket().file(`creators/${id}/${id}-dp.jpg`)
    const blobStream = imageRef.createWriteStream({
        metadata: {
            contentType: displayPictureFile.mimetype,
        },
    })

    blobStream.on("error", (err) => {
        return res.status(500).send("Error uploading file")
    })

    blobStream.on("finish", async () => {
        const displayPictureUrl = await getDownloadURL(imageRef)

        creatorDetails.displayPicture = displayPictureUrl
        creatorDetails.owner = userId

        const newCreator = await Creator(creatorDetails).save()

        await User.findByIdAndUpdate(userId, { creator: true, creatorId: newCreator.id })

        return res.json({ onboarding: "success" })
    })

    blobStream.end(displayPictureFile.buffer)
}

const settingsCreatorInfo = async (req, res) => {
    const { userId } = req

    const user = await User.findById(userId)

    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    if (!user.creator) {
        return res.status(403).json({ message: "User is not a creator" })
    }

    const creator = await Creator.findOne({ owner: userId })
    if (!creator) {
        return res.status(404).json({ message: "Creator not found" })
    }

    return res.json(creator)
}

module.exports = { onboardCreator, settingsCreatorInfo }