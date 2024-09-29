const express = require("express")

const initMulter = require("../lib/multer")

const { verifyToken } = require("../middlewares/verifyToken")
const { asyncHandler } = require("../middlewares/asyncHandler")

const {
    createNewArticle,
    addArticleImage,
    updateArticle,
    accessArticle,
    getArticleSettings,
    updateArticleSettings,
    allowAccessArticle,
    deleteArticle,
    updateArticleCategory,
} = require("../controllers/articleController")

const Article = require("../models/article")
const Creator = require("../models/creator")
const User = require("../models/user")

const { isLoggedIn } = require("../middlewares/isLoggedIn")

const router = express.Router()
const upload = initMulter()

router.get("/:slug", isLoggedIn, async (req, res) => {
    try {
        // Fetch the article based on slug and published status
        const article = await Article.findOne({
            slug: req.params.slug,
            "flags.status": "published",
        }).lean()

        if (!article) {
            return res.status(404).json({ message: "Article not found" })
        }

        // Destructure and extract nested fields from article flags
        const {
            flags: { access: accessType, creator: creatorId },
            ...articleObject
        } = article

        // Construct article preview for restricted content display
        const articlePreview = {
            title: article.title,
            subtitle: article.subtitle,
            datePublished: article.datePublished,
            author: article.author,
            image: article.image?.url,
            accessType,
        }

        // If accessType is 'all', return the full article
        if (accessType === "all") {
            return res.json({ message: "Article fetched successfully", article: articleObject })
        }

        // If the user is not logged in, show only the preview
        if (!req.isUserLoggedIn) {
            return res.status(403).json({
                message: "Please log in to view this article",
                articlePreview,
            })
        }

        // Fetch user details and check their subscriptions
        const user = await User.findById(req.userId, { "actions.subscriptions": 1 }).lean()
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        // Check if the user is subscribed to the article's creator
        const isSubscribed = user.actions.subscriptions.some(
            (sub) => sub.creatorRefId.toString() === creatorId.toString(),
        )

        if (isSubscribed) {
            return res.json({ message: "Article fetched successfully", article: articleObject })
        }

        // Fetch the creator's details to validate article-specific access rules
        const creator = await Creator.findById(creatorId).lean()
        if (!creator) {
            return res.status(404).json({ message: "Creator not found" })
        }

        // Check if the creator has an article-specific subscription
        if (creator.subscription && creator.subscriptions.length > 0) {
            const hasAccess = user.actions.subscriptions.some((sub) => {
                return (
                    sub.creatorRefId.toString() === creatorId.toString() &&
                    creator.subscriptions.some((plan) => plan.name === sub.plan)
                )
            })

            if (hasAccess) {
                return res.json({
                    message: "Article fetched successfully",
                    article: articleObject,
                })
            }
        }

        // If no access is granted, show the preview and request a subscription
        return res.status(403).json({
            message: "Subscribe to access the full article",
            articlePreview,
        })
    } catch (err) {
        // Handle errors
        console.error(err) // Log error for debugging purposes
        res.status(500).json({ message: "Internal server error", error: err.message })
    }
})

const checkEditorAuthorization = async (req, res, next) => {
    const userId = req.userId

    try {
        const article = await Article.findById(req.params.id)

        if (!article) {
            return res.status(404).json({ message: "Article not found" })
        }

        const creator = await Creator.findById(article.flags.creator)

        if (!creator) {
            return res.status(404).json({ message: "Creator not found" })
        }

        const isAuthorized = creator.contributors.some(
            (contributor) =>
                contributor.userRef === userId &&
                (contributor.role === "owner" ||
                    contributor.role === "author" ||
                    contributor.role === "editor"),
        )

        if (!isAuthorized) {
            return res
                .status(403)
                .json({ message: "You are not authorized to access this route" })
        }

        next()
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Verify token for all routes that are protected
router.use(asyncHandler(verifyToken))

router.post("/create", asyncHandler(createNewArticle))

router.get(
    "/editor/:id/access",
    asyncHandler(checkEditorAuthorization),
    asyncHandler(allowAccessArticle),
)

router.get(
    "/editor/:id/content",
    asyncHandler(checkEditorAuthorization),
    asyncHandler(accessArticle),
)
router.patch(
    "/editor/:id/content",
    asyncHandler(checkEditorAuthorization),
    asyncHandler(updateArticle),
)

router.patch(
    "/editor/:id/category",
    asyncHandler(checkEditorAuthorization),
    asyncHandler(updateArticleCategory),
)

router.get(
    "/editor/:id/settings",
    asyncHandler(checkEditorAuthorization),
    asyncHandler(getArticleSettings),
)
router.patch(
    "/editor/:id/settings",
    asyncHandler(checkEditorAuthorization),
    asyncHandler(updateArticleSettings),
)

router.post(
    "/editor/addimage/:id/:ref",
    asyncHandler(checkEditorAuthorization),
    upload.single("articleImage"),
    asyncHandler(addArticleImage),
)

router.delete(
    "/editor/:id",
    asyncHandler(checkEditorAuthorization),
    asyncHandler(deleteArticle),
)

module.exports = router
