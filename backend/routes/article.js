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
} = require("../controllers/articleController")

const Creator = require("../models/creator")
const Article = require("../models/article")

const router = express.Router()
const upload = initMulter()

// GET all articles
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

        return res.json({ access: true })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

router.post("/create", verifyToken, asyncHandler(createNewArticle))
router.get("/editor/:id/access", verifyToken, asyncHandler(checkEditorAuthorization))

router.get("/editor/:id/content", verifyToken, asyncHandler(accessArticle))
router.patch("/editor/:id/content", verifyToken, asyncHandler(updateArticle))

router.get("/editor/:id/settings", verifyToken, asyncHandler(getArticleSettings))
router.patch("/editor/:id/settings", verifyToken, asyncHandler(updateArticleSettings))
router.post(
    "/addimage/:ref",
    verifyToken,
    upload.single("articleImage"),
    asyncHandler(addArticleImage),
)

module.exports = router
