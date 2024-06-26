const express = require("express")

const { asyncHandler } = require("../middlewares/asyncHandler")
const User = require("../models/user")

const router = express.Router()

const handleRemoveRefreshToken = async (req, res) => {
    const { refreshTokenId, isCurrentSession } = req.body

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

        if (isCurrentSession) {
            res.cookie("accessToken", "null", {
                domain: process.env.COOKIE_DOMAIN,
                httpOnly: true,
                secure: true,
            })
            res.cookie("refreshToken", "null", {
                domain: process.env.COOKIE_DOMAIN,
                httpOnly: true,
                secure: true,
            })
            res.cookie("refreshTokenId", "null", {
                domain: process.env.COOKIE_DOMAIN,
                httpOnly: true,
                secure: true,
            })
        }

        res.status(200).json({ message: "Session removed successfully" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

router.post("/remove", asyncHandler(handleRemoveRefreshToken))

module.exports = router
