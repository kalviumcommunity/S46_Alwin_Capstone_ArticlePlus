const express = require("express")

const initMulter = require("../lib/multer")

const { asyncHandler } = require("../middlewares/asyncHandler")
const { verifyToken } = require("../middlewares/verifyToken")

const {
    onboardCreator,
    authCreatorInfo,
    getCreatorArticles,
    getCreatorProfile,
    getForFollowerArticles,
    getForSubscriberArticles,
    toggleFollow,
} = require("../controllers/creatorController")
const { isLoggedIn } = require("../middlewares/isLoggedIn")

const router = express.Router()
const upload = initMulter()

router.use(asyncHandler(verifyToken))

router.post("/onboarding", upload.single("displayPicture"), asyncHandler(onboardCreator))
router.get("/auth/info", asyncHandler(authCreatorInfo))

router.post("/articles", asyncHandler(getCreatorArticles))

router.get("/profile/:id", isLoggedIn, asyncHandler(getCreatorProfile))

router.get("/:id/articles/for-followers", isLoggedIn, asyncHandler(getForFollowerArticles))
router.get("/:id/articles/for-subscribers", isLoggedIn, asyncHandler(getForSubscriberArticles))

router.post("/:id/follow", isLoggedIn, asyncHandler(toggleFollow))

module.exports = router
