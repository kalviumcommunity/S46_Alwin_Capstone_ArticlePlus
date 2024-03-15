const router = require("express").Router()
const articleRouter = require("./routes/article")
const authRouter = require("./routes/auth")
const authGoogleRouter = require("./routes/auth-google")

router.use("/article", articleRouter)
router.use("/auth/google", authGoogleRouter)
router.use("/auth", authRouter)

module.exports = router
