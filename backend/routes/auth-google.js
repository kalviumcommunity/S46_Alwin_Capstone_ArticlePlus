var express = require("express")
const { OAuth2Client } = require("google-auth-library")
var uap = require("ua-parser-js")

const { generateToken } = require("../helpers/generateToken")
const User = require("../models/user")

var router = express.Router()

async function getUserData(access_token) {
    const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`,
    )

    return response.json()
}

router.get("/", async function (req, res, next) {
    const code = req.query.code

    try {
        const redirectURL = `${process.env.API_URL}/auth/google`
        const oAuth2Client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            redirectURL,
        )
        const googleResponse = await oAuth2Client.getToken(code)
        await oAuth2Client.setCredentials(googleResponse.tokens)

        const userInfo = await getUserData(
            oAuth2Client.credentials.access_token,
        )

        let user = await User.findOne({ email: userInfo.email })

        if (!user) {
            // Create a new user in the database
            const newUser = new User({
                name: userInfo.name,
                email: userInfo.email,
                verified: userInfo.email_verified,
                provider: "google",
                picture: userInfo.picture,
            })
            user = await newUser.save()
        }

        const { accessToken, refreshToken } = await generateToken(
            user._id.toString(),
        )

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

        const refreshTokenId =
            user.refreshTokens[user.refreshTokens.length - 1]._id.toString()

        res.cookie("accessToken", accessToken, {
            maxAge: 15 * 60 * 1000, // Cookie expires in 15 minutes
            secure: true,
            sameSite: "strict",
        })
        res.cookie("refreshToken", refreshToken, {
            maxAge: 3600000 * 24 * 30, // Cookie expires in 30 days
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        })
        res.cookie("refreshTokenId", refreshTokenId, {
            maxAge: 3600000 * 24 * 30, // Cookie expires in 30 days
            secure: true,
            sameSite: "strict",
        })
        res.redirect(
            303,
            `${process.env.FRONTEND_URL}/auth/google?status=success`,
        )
    } catch (err) {
        console.error("Error logging in with OAuth2 user", err)
        res.redirect(
            303,
            `${process.env.FRONTEND_URL}/auth/google?status=failed`,
        )
    }
})

router.post("/request", async function (req, res, next) {
    const redirectURL = `${process.env.API_URL}/auth/google`

    const oAuth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        redirectURL,
    )

    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: "https://www.googleapis.com/auth/userinfo.profile email openid ",
        prompt: "consent",
    })

    res.json({ url: authorizeUrl })
})

module.exports = router
