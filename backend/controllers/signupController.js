const bcrypt = require("bcrypt")
var uap = require("ua-parser-js")

const User = require("../models/user")
const { generateToken } = require("../helpers/generateToken")

const signup = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" })
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return res.status(400).json({
            email,
            message: "This email linked to an existing account. Log in or use another.",
        })
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create a new user
    const newUser = new User({ name, email, password: hashedPassword })

    const { accessToken, refreshToken } = await generateToken(newUser._id.toString())

    const userAgent = uap(req.headers["user-agent"])
    const deviceMetadata = `${userAgent.browser.name}, ${userAgent.os.name} ${userAgent.os.version}`

    const refreshTokenObj = {
        token: refreshToken,
        deviceInfo: { userAgent: userAgent.ua, deviceMetadata },
    }

    newUser.refreshTokens.push(refreshTokenObj)

    await newUser.save()

    const refreshTokenId =
        newUser.refreshTokens[newUser.refreshTokens.length - 1]._id.toString()

    res.cookie("accessToken", accessToken, {
        maxAge: process.env.ACCESS_TOKEN_COOKIE_AGE,
        domain: process.env.COOKIE_DOMAIN,
        secure: true,
    })
    res.cookie("refreshToken", refreshToken, {
        maxAge: process.env.REFRESH_TOKEN_COOKIE_AGE,
        domain: process.env.COOKIE_DOMAIN,
        httpOnly: true,
        secure: true,
    })
    res.cookie("refreshTokenId", refreshTokenId, {
        maxAge: process.env.REFRESH_TOKEN_COOKIE_AGE,
        domain: process.env.COOKIE_DOMAIN,
        secure: true,
    })

    res.status(201).json({
        message: "User created successfully",
    })
}

module.exports = { signup }
