const express = require("express")

const asyncHandler = require("../middlewares/asyncHandler")
const { verifyToken } = require("../middlewares/verifyToken")
const router = require("./auth")

const { getCreatorOnboard } = require("../controllers/creatorController")

router.use(asyncHandler(verifyToken))

router.post("/onboarding", asyncHandler(getCreatorOnboard))

module.exports = router
