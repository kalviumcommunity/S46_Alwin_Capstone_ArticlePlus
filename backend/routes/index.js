const router = require("express").Router()

const articleRouter = require("./article")
const authRouter = require("./auth")
const sessionRouter = require("./session")
const creatorRouter = require("./creator")

router.use("/article", articleRouter)
router.use("/auth", authRouter)
router.use("/session", sessionRouter)
router.use("/creator", creatorRouter)

module.exports = router
