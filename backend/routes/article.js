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
        const article = await Article.findOne({
            slug: req.params.slug,
            "flags.status": "published",
        }).lean()

        if (!article) {
            return res.status(404).json({ message: "Article not found" })
        }

        const { flags, ...articleObject } = article
        const { access: accessType, creator: creatorId } = flags

        articleObject.accessType = accessType

        const articlePreview = {
            title: article.title,
            subtitle: article.subtitle,
            datestamp: article.datestamp,
            author: article.author,
            image: article.image.url,
            accessType,
        }

        if (accessType === "all") {
            return res.json({ message: "Article fetched successfully", article: articleObject })
        }

        if (!req.isUserLoggedIn) {
            return res.status(403).json({
                message: "Please log in to view this article",
                articlePreview,
            })
        }

        const user = await User.findById(req.userId, { "actions.subscriptions": 1 })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const isSubscribed = user.actions.subscriptions.some(
            (sub) => sub.creatorId.toString() === creatorId.toString(),
        )

        if (isSubscribed) {
            return res.json({ message: "Article fetched successfully", article: articleObject })
        } else {
            return res.status(403).json({
                message: "Subscribe to access article",
                articlePreview,
            })
        }
    } catch (err) {
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
router.use(asyncHandler(checkEditorAuthorization))

router.post("/create", asyncHandler(createNewArticle))

router.get("/editor/:id/access", asyncHandler(allowAccessArticle))

router.get("/editor/:id/content", asyncHandler(accessArticle))
router.patch("/editor/:id/content", asyncHandler(updateArticle))

router.patch("/editor/:id/category", asyncHandler(updateArticleCategory))

router.get("/editor/:id/settings", asyncHandler(getArticleSettings))
router.patch("/editor/:id/settings", asyncHandler(updateArticleSettings))

router.post("/addimage/:id/:ref", upload.single("articleImage"), asyncHandler(addArticleImage))

router.delete("/editor/:id", asyncHandler(deleteArticle))

module.exports = router
