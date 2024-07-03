const express = require("express")

const router = express.Router()

const { asyncHandler } = require("../middlewares/asyncHandler")
const { verifyToken } = require("../middlewares/verifyToken")
const {
    sendVerificationEmail,
    confirmOtpForVerification,
    followCreator,
    subscribeCreator,
} = require("../controllers/userController")

router.use(asyncHandler(verifyToken))

router.get("/verify", asyncHandler(sendVerificationEmail))
router.post("/verify", asyncHandler(confirmOtpForVerification))

router.get("/following")
router.get("/subscriptions")

router.get("/following/articles")
router.get("/subscriptions/articles")

router.post("/follow/:id", asyncHandler(followCreator))
router.get("/subscribe/:id", asyncHandler(subscribeCreator))

module.exports = router
