const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const User = require("../models/user")

const getUserDetails = async (req, res) => {
    const userId = req.userId

    const user = await User.findById(userId)
        .select("-password -refreshTokens.token -refreshTokens.deviceInfo.userAgent")
        .populate({
            path: "refreshTokens",
            options: { createdAt: { _id: -1 } },
        })

    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    const { name, email, creator, verified, provider, picture, refreshTokens } = user
    res.status(200).json({
        id: user._id,
        name,
        email,
        creator,
        verified,
        provider,
        picture,
        refreshTokens,
    })
}

const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken

    try {
        const decoded = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, {
            algorithms: [process.env.JWT_ALGORITHM],
        })

        // Check if the refresh token is valid
        const user = await User.findOne({ _id: decoded.userId })
        const refreshTokenObj = user.refreshTokens.find((token) => token.token === refreshToken)
        if (!refreshTokenObj) {
            return res.status(403).json({ message: "Invalid refresh token" })
        }

        // Generate a new access token
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_LIFE,
            algorithm: process.env.JWT_ALGORITHM,
        })

        res.cookie("accessToken", accessToken, {
            maxAge: process.env.ACCESS_TOKEN_COOKIE_AGE,
            domain: process.env.COOKIE_DOMAIN,
            secure: true,
        })

        res.status(200).json({ accessToken })
    } catch (error) {
        res.status(403).json({ message: "Invalid refresh token" })
    }
}

const resetPassword = async (req, res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body
    const userId = req.userId

    // Check if new password and confirm new password match
    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({
            success: false,
            icon: "🚫",
            message: "New passwords do not match",
        })
    }

    const user = await User.findById(userId)

    if (!user) {
        res.status(404).json({
            success: false,
            icon: "🚫",
            message: "User not found",
        })
    }

    // Check if the old password is correct
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
        return res.status(400).json({
            success: false,
            icon: "❌",
            message: "Invalid current password",
        })
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10)
    const hashedNewPassword = await bcrypt.hash(newPassword, salt)

    // Update the user's password
    user.password = hashedNewPassword
    await user.save()

    res.status(400).json({
        success: true,
        icon: "✅",
        message: "Successfully changed password",
    })
}

module.exports = { getUserDetails, refreshAccessToken, resetPassword }
