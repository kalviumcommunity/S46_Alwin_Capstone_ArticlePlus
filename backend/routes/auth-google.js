var express = require("express")
const passport = require("passport")
const { generateToken } = require("../helpers/generateToken")
const User = require("../models/user")

var router = express.Router()

router.get(
    "/",
    passport.authenticate("google", { scope: ["profile", "email"] }),
)

router.get(
    "/callback",
    passport.authenticate("google", {
        failureRedirect: `${process.env.FRONTEND_URL}/auth/google`,
    }),
    (req, res) => {
        req.session.userId = req.user
        res.redirect(`${process.env.FRONTEND_URL}/auth/google`)
    },
)

router.get("/status", async (req, res) => {
    if (req.session.userId) {
        const user = await User.findById(req.session.userId)

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        const { accessToken, refreshToken } = await generateToken(
            req.session.userId,
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

        res.json({
            isAuthenticated: true,
            accessToken,
            refreshToken,
            refreshTokenId,
        })
    } else {
        res.json({ isAuthenticated: false })
    }
})

module.exports = router
