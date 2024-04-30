const express = require("express")
const multer = require("multer")

const router = express.Router()

const { asyncHandler } = require("../middlewares/asyncHandler")
const { verifyToken } = require("../middlewares/verifyToken")

const { onboardCreator, authCreatorInfo } = require("../controllers/creatorController")

const inMemoryStorage = multer.memoryStorage()
const upload = multer({ inMemoryStorage })

router.use(asyncHandler(verifyToken))

router.post("/onboarding", upload.single("displayPicture"), asyncHandler(onboardCreator))
router.get("/auth/info", asyncHandler(authCreatorInfo))

module.exports = router
