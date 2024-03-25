const express = require("express")

const asyncHandler = require("../middlewares/asyncHandler")
const { verifyToken } = require("../middlewares/verifyToken")

const { signup } = require("../controllers/registrationController")
const { login } = require("../controllers/loginController")
const {
    getUserDetails,
    resetPassword,
    refreshAccessToken,
} = require("../controllers/authController")
const {
    googleOauthCallback,
    generateGoogleOauthLink,
} = require("../controllers/googleOauthController")

const router = express.Router()

router.post("/signup", asyncHandler(signup))
router.post("/login", asyncHandler(login))

router.get("/", verifyToken, asyncHandler(getUserDetails))
router.patch("/reset-password", verifyToken, asyncHandler(resetPassword))

router.post("/refresh", asyncHandler(refreshAccessToken))

router.post("/google/redirect", asyncHandler(generateGoogleOauthLink))
router.get("/google/callback", asyncHandler(googleOauthCallback))

module.exports = router
