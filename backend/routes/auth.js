const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
var uap = require("ua-parser-js")

const asyncHandler = require("../middlewares/asyncHandler")
const { generateToken } = require("../helpers/generateToken")
const User = require("../models/user")

const router = express.Router()

const handleSignup = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" })
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return res.status(400).json({ message: "Email already exists" })
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create a new user
    const newUser = new User({ name, email, password: hashedPassword })

    const { accessToken, refreshToken } = await generateToken(
        newUser._id.toString(),
    )

    const userAgent = uap(req.headers["user-agent"])
    const deviceMetadata = `${userAgent.browser.name}, ${userAgent.os.name} ${userAgent.os.version}`

    newUser.refreshTokens.push({
        token: refreshToken,
        deviceInfo: { userAgent: userAgent.ua, deviceMetadata },
    })

    await newUser.save()

    res.status(201).json({
        message: "User created successfully",
        accessToken,
        refreshToken,
    })
}

// Login a user
const handleLogin = async (req, res) => {
    const { email, password } = req.body

    // Check if the user exists
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials" })
    }

    const { accessToken, refreshToken } = await generateToken(
        user._id.toString(),
    )

    const userAgent = uap(req.headers["user-agent"])
    const deviceMetadata = `${userAgent.browser.name}, ${userAgent.os.name} ${userAgent.cpu.architecture}`

    user.refreshTokens.push({
        token: refreshToken,
        deviceInfo: { userAgent: userAgent.ua, deviceMetadata },
    })

    await user.save()

    res.status(200).json({ accessToken, refreshToken })
}

// Middleware to verify the access token
const verifyToken = async (req, res, next) => {
    const accessToken = req.headers.authorization?.split(" ")[1]

    if (!accessToken) {
        return res.status(401).json({ message: "No access token provided" })
    }

    try {
        const decoded = await jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET,
            { algorithms: [process.env.JWT_ALGORITHM] },
        )
        req.userId = decoded.userId
        next()
    } catch (error) {
        res.status(401).json({ message: "Invalid access token" })
    }
}

const handleResetPassword = asyncHandler(async (req, res) => {
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
    const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
    )
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
})

const handleAccessTokenRefresh = async (req, res) => {
    const { refreshToken } = req.body

    try {
        const decoded = await jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            { algorithms: [process.env.JWT_ALGORITHM] },
        )

        // Check if the refresh token is valid
        const user = await User.findOne({ _id: decoded.userId })
        const refreshTokenObj = user.refreshTokens.find(
            (token) => token.token === refreshToken,
        )
        if (!refreshTokenObj) {
            return res.status(403).json({ message: "Invalid refresh token" })
        }

        // Generate a new access token
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_LIFE,
                algorithm: process.env.JWT_ALGORITHM,
            },
        )

        res.status(200).json({ accessToken })
    } catch (error) {
        res.status(403).json({ message: "Invalid refresh token" })
    }
}

const handleLogOut = async (req, res) => {
    const userId = req.userId
    const { refreshToken } = req.body

    const user = await User.findById(userId)
    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    const refreshTokenObj = user.refreshTokens.find(
        (token) => token.token === refreshToken,
    )
    if (!refreshTokenObj) {
        return res.status(403).json({ message: "Invalid refresh token" })
    }

    // Remove the refresh token from the user's list of refresh tokens
    user.refreshTokens = user.refreshTokens.filter(
        (token) => token.token !== refreshToken,
    )

    await user.save()

    // Send a success response
    res.status(200).json({ message: "Logout successful" })
}

const handleAuthUserStatus = async (req, res) => {
    const userId = req.userId

    const user = await User.findById(userId).select(
        "-password -refreshTokens.token -refreshTokens.deviceInfo.userAgent",
    )

    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    const { name, email, creator, verified, provider, picture, refreshTokens } =
        user
    res.status(200).json({
        name,
        email,
        creator,
        verified,
        provider,
        picture,
        refreshTokens,
    })
}

router.post("/signup", asyncHandler(handleSignup))
router.post("/login", asyncHandler(handleLogin))
router.patch("/reset-password", verifyToken, asyncHandler(handleResetPassword))

router.post("/refresh", asyncHandler(handleAccessTokenRefresh))
router.post("/logout", verifyToken, asyncHandler(handleLogOut))

router.get("/", verifyToken, asyncHandler(handleAuthUserStatus))

module.exports = router
