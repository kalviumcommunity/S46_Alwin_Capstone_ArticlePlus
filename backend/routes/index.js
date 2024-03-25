const router = require("express").Router()
const articleRouter = require("./article")
const authRouter = require("./auth")
const sessionRouter = require("./session")

router.use("/article", articleRouter)
router.use("/auth", authRouter)
router.use("/session", sessionRouter)

module.exports = router
