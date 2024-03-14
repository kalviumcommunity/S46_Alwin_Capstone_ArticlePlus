var express = require("express")
const passport = require("passport")

var router = express.Router()

router.get(
    "/",
    passport.authenticate("google", { scope: ["profile", "email"] }),
)

router.get(
    "/redirect",
    passport.authenticate("google", {
        successRedirect: process.env.FRONTEND_URL,
        failureRedirect: `${process.env.FRONTEND_URL}/failed`,
    }),
)

module.exports = router
