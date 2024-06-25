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
} = require("../controllers/articleController")

const Creator = require("../models/creator")
const Article = require("../models/article")

const router = express.Router()
const upload = initMulter()

router.get("/:id", async (req, res) => {
    try {
        const article = await Article.findById(req.params.id)

        if (!article) {
            return res.status(404).json({ message: "Article not found" })
        }

        res.json(article)
    } catch (err) {
        res.status(500).json({ message: err.message })
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

router.post("/create", verifyToken, asyncHandler(createNewArticle))
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
    "/addimage/:id/:ref",
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
