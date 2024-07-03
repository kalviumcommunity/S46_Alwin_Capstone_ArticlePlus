const express = require("express")
const { verifyToken } = require("../middlewares/verifyToken")
const User = require("../models/user") // Adjust the path as needed
const Article = require("../models/article") // Adjust the path as needed

const router = express.Router()

const isLoggedIn = (req, res, next) => {
    const accessToken = req.headers.authorization?.split(" ")[1]

    if (!accessToken) {
        req.isUserLoggedIn = false
        return next()
    }

    // Define a custom callback for verifyToken to set req.isUserLoggedIn and req.userId
    verifyToken(req, res, (err) => {
        if (err) {
            req.isUserLoggedIn = false
            return next()
        }

        req.isUserLoggedIn = true
        req.userId = req.userId // Ensure userId is set
        return next()
    })
}

const exploreArticles = async (req, res) => {
    const isUserLoggedIn = req.isUserLoggedIn
    const page = parseInt(req.query.page, 10) || 1 // Default to page 1
    const pageSize = 8

    try {
        let articlesQuery = {
            "flags.status": "published",
            "flags.access": "all",
        }

        if (isUserLoggedIn) {
            const userId = req.userId
            const user = await User.findById(userId).lean()

            if (!user) {
                return res.status(404).json({ message: "User not found" })
            }

            // Extract the list of subscriptions and following creators
            const subscribedCreatorIds = user.actions.subscriptions.map(
                (subscription) => subscription.creatorId,
            )

            const followingCreatorIds = user.actions.following.map(
                (following) => following.creatorId,
            )

            const creatorIds = [...new Set([...subscribedCreatorIds, ...followingCreatorIds])]

            // Construct query for articles
            articlesQuery = {
                "flags.status": "published",
                $or: [{ "flags.access": "all" }, { "flags.creator": { $in: creatorIds } }],
            }
        }

        const totalArticles = await Article.countDocuments(articlesQuery)

        const recentArticles = await Article.find(articlesQuery)
            .sort({ datestamp: -1 }) // Sort by most recent
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .lean()
            .select("-__v -_id -flags -content")

        const moreArticlesExist = page * pageSize < totalArticles

        res.json({
            articles: recentArticles,
            page,
            moreArticlesExist,
        })
    } catch (error) {
        console.error("Error serving explore articles:", error)
        res.status(500).json({ message: "Error serving explore articles" })
    }
}

router.get("/explore", isLoggedIn, exploreArticles)

module.exports = router
