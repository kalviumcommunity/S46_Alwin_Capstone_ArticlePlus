const express = require("express")
const Article = require("../models/article")
const { createNewArticle } = require("../controllers/articleController")

const { verifyToken } = require("../middlewares/verifyToken")
const { asyncHandler } = require("../middlewares/asyncHandler")

const router = express.Router()

// GET all articles
router.get("/", async (req, res) => {
    try {
        const articles = await Article.find()
        res.json(articles)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post("/create", verifyToken, asyncHandler(createNewArticle))

module.exports = router
