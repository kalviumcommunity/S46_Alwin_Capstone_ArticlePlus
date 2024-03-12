const express = require("express")
const Article = require("../models/article")
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

module.exports = router
