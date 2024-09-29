const express = require("express")

const initMulter = require("../lib/multer")

const { asyncHandler } = require("../middlewares/asyncHandler")
const { verifyToken } = require("../middlewares/verifyToken")

const {
    onboardCreator,
    getCreatorArticles,
    getCreatorProfile,
    getContributorWithArticles,
    getForFollowerArticles,
    getForSubscriberArticles,
    toggleFollow,
    subscribeCreator,
    joinOrganization,
    unsubscribeCreator,
} = require("../controllers/creatorController")
const {
    authCreatorInfo,
    updateContributorDescription,
    updateContributorID,
    activateContributor,
    getCreatorInviteCode,
    generateAndReturnInviteCode,
    approveJoinRequest,
    denyJoinRequest,
    getOrganizationAuthors,
    updateAuthorAccess,
} = require("../controllers/creatorDashboardController")

const { isLoggedIn } = require("../middlewares/isLoggedIn")

const router = express.Router()
const upload = initMulter()

router.post("/articles", asyncHandler(getCreatorArticles))

router.get("/profile/:id", isLoggedIn, asyncHandler(getCreatorProfile))

// Get contributor profile of organization
router.get("/profile/:id/:contributorId", isLoggedIn, asyncHandler(getContributorWithArticles))

router.get("/:id/articles/for-followers", isLoggedIn, asyncHandler(getForFollowerArticles))
router.get("/:id/articles/for-subscribers", isLoggedIn, asyncHandler(getForSubscriberArticles))

router.post("/:id/follow", isLoggedIn, asyncHandler(toggleFollow))
router.post("/:id/subscribe", isLoggedIn, asyncHandler(subscribeCreator))

router.post("/:id/unsubscribe", isLoggedIn, asyncHandler(unsubscribeCreator))

router.use(asyncHandler(verifyToken))

router.post("/onboarding", upload.single("displayPicture"), asyncHandler(onboardCreator))
router.post("/onboarding/join-organization", asyncHandler(joinOrganization))

router.get("/dashboard/auth/info", asyncHandler(authCreatorInfo))
router.get("/dashboard/invite-code", asyncHandler(getCreatorInviteCode))
router.post("/dashboard/invite-code/generate", asyncHandler(generateAndReturnInviteCode))
router.post("/dashboard/invite/approve", asyncHandler(approveJoinRequest))
router.post("/dashboard/invite/deny", asyncHandler(denyJoinRequest))
router.get("/dashboard/authors", asyncHandler(getOrganizationAuthors))
router.post("/dashboard/author/:id/access", asyncHandler(updateAuthorAccess))

router.post("/dashboard/contributor/description", asyncHandler(updateContributorDescription))
router.post("/dashboard/contributor/id", asyncHandler(updateContributorID))
router.post("/dashboard/contributor/activate", asyncHandler(activateContributor))

module.exports = router
