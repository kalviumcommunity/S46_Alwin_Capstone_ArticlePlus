const express = require("express")

const router = express.Router()

const asyncHandler = require("../middlewares/asyncHandler")
const { verifyToken } = require("../middlewares/verifyToken")
const {
    sendVerificationEmail,
    confirmOtpForVerification,
} = require("../controllers/userController")

router.get("/verify", verifyToken, asyncHandler(sendVerificationEmail))
router.post("/verify", verifyToken, asyncHandler(confirmOtpForVerification))

module.exports = router
