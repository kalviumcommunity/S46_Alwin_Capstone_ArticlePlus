const express = require("express")

const asyncHandler = require("../middlewares/asyncHandler")
const User = require("../models/user")

const router = express.Router()

const handleRemoveRefreshToken = async (req, res) => {
    const { refreshTokenId } = req.body

    try {
        const user = await User.findOne({
            "refreshTokens._id": refreshTokenId,
        })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        user.refreshTokens = user.refreshTokens.filter(
            (token) => token._id.toString() !== refreshTokenId,
        )
        await user.save()

        res.status(200).json({ message: "Refresh token removed successfully" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

router.post("/remove", asyncHandler(handleRemoveRefreshToken))

module.exports = router
