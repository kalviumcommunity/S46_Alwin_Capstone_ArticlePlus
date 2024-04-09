const Creator = require("../models/creator")
const User = require("../models/user")

const getCreatorOnboard = async (req, res) => {
    try {
        const { userId } = req
        const payload = req.body

        const user = await User.findById(userId)
        if (user.creator) {
            return res.json({ status: "failed", message: "User is already a creator" })
        }

        const newCreator = await Creator({
            ...payload,
            picture: "placeholder-link",
            owner: userId,
        }).save()

        await User.findByIdAndUpdate(userId, { creator: true, creatorId: newCreator.id })

        return res.json({ onboarding: "success", details: newCreator })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

module.exports = {
    getCreatorOnboard,
}
