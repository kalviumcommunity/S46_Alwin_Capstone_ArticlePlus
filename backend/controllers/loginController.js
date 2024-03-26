const bcrypt = require("bcrypt")
var uap = require("ua-parser-js")

const User = require("../models/user")
const { generateToken } = require("../helpers/generateToken")

const login = async (req, res) => {
    const { email, password } = req.body

    // Check if the user exists
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(400).json({
            email,
            message: "This email isn't registered with an account. Try another or sign up",
        })
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return res
            .status(400)
            .json({ email, message: "Invalid credentials for the given email" })
    }

    const { accessToken, refreshToken } = await generateToken(user._id.toString())

    const userAgent = uap(req.headers["user-agent"])
    const deviceMetadata = `${userAgent.browser.name}, ${userAgent.os.name} ${userAgent.os.version}`

    const refreshTokenObj = {
        token: refreshToken,
        deviceInfo: {
            userAgent: userAgent.ua,
            deviceMetadata,
        },
    }

    user.refreshTokens.push(refreshTokenObj)

    await user.save()

    const refreshTokenId = user.refreshTokens[user.refreshTokens.length - 1]._id.toString()

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

    res.status(200).json({
        message: "Login successfully",
    })
}

module.exports = { login }
