const express = require("express")

const router = express.Router()

const { asyncHandler } = require("../middlewares/asyncHandler")
const { verifyToken } = require("../middlewares/verifyToken")
const {
    sendVerificationEmail,
    confirmOtpForVerification,
} = require("../controllers/userController")

router.get("/verify", verifyToken, asyncHandler(sendVerificationEmail))
router.post("/verify", verifyToken, asyncHandler(confirmOtpForVerification))

router.get("/following", asyncHandler(verifyToken))
router.get("/subscriptions", asyncHandler(verifyToken))

router.get("/subscribed/articles", asyncHandler(verifyToken))

module.exports = router
