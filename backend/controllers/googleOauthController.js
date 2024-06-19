const { OAuth2Client } = require("google-auth-library")
const uap = require("ua-parser-js")

const User = require("../models/user")
const { generateToken } = require("../helpers/generateToken")

const redirectURL = `${process.env.API_URL}/auth/google/callback`
const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectURL,
)

const generateGoogleOauthLink = async (req, res) => {
    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: "https://www.googleapis.com/auth/userinfo.profile email openid",
    })

    res.json({ url: authorizeUrl })
}

const getUserData = async (accessToken) => {
    const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`,
    )

    return response.json()
}

const googleOauthCallback = async (req, res) => {
    const { code } = req.query

    try {
        const { tokens } = await oAuth2Client.getToken(code)
        oAuth2Client.setCredentials(tokens)

        const { email, name, picture } = await getUserData(
            oAuth2Client.credentials.access_token,
        )

        let user = await User.findOne({ email })

        if (!user) {
            user = await User.create({
                name,
                email,
                provider: "google",
                displayPicture: picture,
            })
        }

        const { accessToken, refreshToken } = await generateToken(user._id.toString())

        const userAgent = uap(req.headers["user-agent"])
        const deviceMetadata = `${userAgent.browser.name}, ${userAgent.os.name} ${userAgent.os.version}`

        user.refreshTokens.push({
            token: refreshToken,
            deviceInfo: {
                userAgent: userAgent.ua,
                deviceMetadata,
            },
        })

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

        res.redirect(303, `${process.env.FRONTEND_URL}/auth/google?status=success`)
    } catch (error) {
        console.error("Error logging in with OAuth2 user", error)
        res.redirect(303, `${process.env.FRONTEND_URL}/auth/google?status=failed`)
    }
}

module.exports = { generateGoogleOauthLink, googleOauthCallback }
