const express = require("express")

const initMulter = require("../lib/multer")

const { asyncHandler } = require("../middlewares/asyncHandler")
const { verifyToken } = require("../middlewares/verifyToken")

const { onboardCreator, authCreatorInfo } = require("../controllers/creatorController")

const router = express.Router()
const upload = initMulter()

router.use(asyncHandler(verifyToken))

router.post("/onboarding", upload.single("displayPicture"), asyncHandler(onboardCreator))
router.get("/auth/info", asyncHandler(authCreatorInfo))

module.exports = router
