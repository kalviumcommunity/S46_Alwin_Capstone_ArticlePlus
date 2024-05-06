const express = require("express")

const initMulter = require("../lib/multer")

const { verifyToken } = require("../middlewares/verifyToken")
const { asyncHandler } = require("../middlewares/asyncHandler")

const { createNewArticle, addArticleImage } = require("../controllers/articleController")

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

router.post("/create", verifyToken, asyncHandler(createNewArticle))
router.post(
    "/addimage",
    verifyToken,
    upload.single("articleImage"),
    asyncHandler(addArticleImage),
)

module.exports = router
