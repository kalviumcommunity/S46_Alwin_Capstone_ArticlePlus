const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

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
    newUser.refreshToken = refreshToken

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

    user.refreshToken = refreshToken
    await user.save()

    res.status(200).json({ accessToken, refreshToken })
}

// Middleware to verify the access token
const verifyToken = (req, res, next) => {
    const accessToken = req.headers.authorization?.split(" ")[1]

    if (!accessToken) {
        return res.status(401).json({ message: "No access token provided" })
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
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
        return res.status(400).json({ message: "New passwords do not match" })
    }

    const user = await User.findById(userId)

    // Check if the old password is correct
    const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
    )
    if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: "Invalid current password" })
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10)
    const hashedNewPassword = await bcrypt.hash(newPassword, salt)

    // Update the user's password
    user.password = hashedNewPassword
    await user.save()

    res.status(200).json({ message: "Password reset successful" })
})

const handleAccessTokenRefresh = async (req, res) => {
    const { refreshToken } = req.body

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        )

        // Check if the refresh token is valid
        const user = await User.findOne({ _id: decoded.userId })
        if (user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token" })
        }

        // Generate a new access token
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_LIFE,
            },
        )

        res.status(200).json({ accessToken })
    } catch (error) {
        res.status(403).json({ message: "Invalid refresh token" })
    }
}

const handleLogOut = async (req, res) => {
    const userId = req.userId

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { refreshToken: null },
        { new: true },
    )

    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" })
    }

    // Send a success response
    res.status(200).json({ message: "Logout successful" })
}

const handleAuthUserStatus = async (req, res) => {
    const userId = req.userId

    const user = await User.findById(userId).select("-password -refreshToken")

    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    const { name, email, creator, verifed, provider, picture } = user
    res.status(200).json({ name, email, creator, verifed, provider, picture })
}

router.post("/signup", asyncHandler(handleSignup))
router.post("/login", asyncHandler(handleLogin))
router.patch("/reset-password", verifyToken, handleResetPassword)

router.post("/refresh", asyncHandler(handleAccessTokenRefresh))
router.post("/logout", verifyToken, asyncHandler(handleLogOut))

router.get("/", verifyToken, asyncHandler(handleAuthUserStatus))

module.exports = router
