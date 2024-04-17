const router = require("express").Router()

const articleRouter = require("./article")
const authRouter = require("./auth")
const sessionRouter = require("./session")
const creatorRouter = require("./creator")
const userRouter = require("./user")

router.use("/article", articleRouter)
router.use("/auth", authRouter)
router.use("/session", sessionRouter)
router.use("/creator", creatorRouter)
router.use("/user", userRouter)

module.exports = router
