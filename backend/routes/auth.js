const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const asyncHandler = require("../middlewares/asyncHandler")
const User = require("../models/user")

const router = express.Router()

const generateToken = async (userId) => {
    try {
        const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "60m",
        })

        const refreshToken = jwt.sign(
            { userId },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" },
        )

        return { accessToken, refreshToken }
    } catch (error) {
        throw new Error("Failed to generate tokens")
    }
}

const handleSignup = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body

    console.log(name, email, password, confirmPassword)

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

    const { accessToken, refreshToken } = await generateToken(newUser)
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

    const { accessToken, refreshToken } = await generateToken(user)

    await User.findOneAndUpdate(
        { _id: user._id },
        { refreshToken: refreshToken },
        { new: true },
    )

    res.status(200).json({ accessToken, refreshToken })
}

// Refresh the access token
const handleAccessTokenRefresh = async (req, res) => {
    const { refreshToken } = req.body

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

    // Check if the refresh token is valid
    const user = await User.findOne({ _id: decoded.userId })
    if (!user) {
        return res.status(401).json({ message: "Invalid refresh token" })
    }

    // Generate a new access token
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "60m",
    })

    res.status(200).json({ accessToken })
}

// Middleware to verify the access token
const verifyToken = (req, res, next) => {
    const accessToken = req.headers.authorization?.split(" ")[1]

    if (!accessToken) {
        return res.status(401).json({ message: "No access token provided" })
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
        req.userId = decoded.userId
        next()
    } catch (error) {
        res.status(403).json({ message: "Invalid access token" })
    }
}

router.post("/signup", asyncHandler(handleSignup))
router.post("/login", asyncHandler(handleLogin))

router.post("/refresh", asyncHandler(handleAccessTokenRefresh))

router.get("/user", verifyToken, (req, res) => {
    res.status(200).json({ message: "Access granted" })
})

module.exports = router
