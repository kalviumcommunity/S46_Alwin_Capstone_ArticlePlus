const express = require("express")

const router = express.Router()

const { asyncHandler } = require("../middlewares/asyncHandler")
const { verifyToken } = require("../middlewares/verifyToken")
const {
    sendVerificationEmail,
    confirmOtpForVerification,
    getSubscriptions,
} = require("../controllers/userController")

router.use(asyncHandler(verifyToken))

router.get("/verify", asyncHandler(sendVerificationEmail))
router.post("/verify", asyncHandler(confirmOtpForVerification))

router.get("/subscriptions", asyncHandler(getSubscriptions))

module.exports = router
