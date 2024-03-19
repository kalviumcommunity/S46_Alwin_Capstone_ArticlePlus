const router = require("express").Router()
const articleRouter = require("./routes/article")
const authRouter = require("./routes/auth")
const authGoogleRouter = require("./routes/auth-google")
const sessionRouter = require("./routes/session")

router.use("/article", articleRouter)
router.use("/auth/google", authGoogleRouter)
router.use("/auth", authRouter)
router.use("/auth", authRouter)
router.use("/session", sessionRouter)

module.exports = router
