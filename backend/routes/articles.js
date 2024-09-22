const express = require("express")
const Joi = require("joi")

const User = require("../models/user")
const Article = require("../models/article")

const { isLoggedIn } = require("../middlewares/isLoggedIn")

const router = express.Router()

const categorySchema = Joi.string()
    .valid(
        "technology",
        "health",
        "business-and-finance",
        "science",
        "politics",
        "arts-and-culture",
        "travel",
        "environment",
        "education",
        "sports",
    )
    .required()

const exploreArticles = async (req, res) => {
    const isUserLoggedIn = req.isUserLoggedIn
    const page = parseInt(req.query.page, 10) || 1 // Default to page 1
    const pageSize = 8

    const category = req.query.category

    try {
        let articlesQuery = {
            "flags.status": "published",
        }

        // Validate category if provided
        if (category) {
            const { error } = categorySchema.validate(category)
            if (error) {
                return res.status(400).json({ message: "Invalid category" })
            }
            articlesQuery.category = category
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
                ...articlesQuery, // Include the existing query conditions
                $or: [
                    { "flags.access": "all" },
                    {
                        "flags.access": "subscribers",
                        "flags.creator": { $in: subscribedCreatorIds },
                    },
                    { "flags.creator": { $in: followingCreatorIds } },
                ],
            }
        } else {
            articlesQuery["flags.access"] = "all"
        }

        const totalArticles = await Article.countDocuments(articlesQuery)

        const recentArticles = await Article.find(articlesQuery)
            .sort({ publishedAt: -1 })
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

const suggestSimilarArticles = async (req, res) => {
    const isUserLoggedIn = req.isUserLoggedIn
    const currentArticleSlug = req.query.slug
    const currentArticleCategory = req.query.category

    // Validate the category
    const { error } = categorySchema.validate(currentArticleCategory)
    if (error) {
        return res.status(400).json({ message: "Invalid category" })
    }

    try {
        let articlesQuery = {
            "flags.status": "published",
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

            // Update query for articles
            articlesQuery = {
                "flags.status": "published",
                $or: [
                    { "flags.access": "all" },
                    {
                        "flags.access": "subscribers",
                        "flags.creator": { $in: subscribedCreatorIds },
                    },
                    { "flags.creator": { $in: followingCreatorIds } },
                ],
            }
        } else {
            articlesQuery["flags.access"] = "all"
        }

        const suggestedArticles = []

        // Fetch up to 2 articles from the specified category excluding the current article
        let sameCategoryArticles = await Article.find({
            ...articlesQuery,
            category: currentArticleCategory,
            slug: { $ne: currentArticleSlug },
        })
            .sort({ publishedAt: -1 })
            .limit(2)
            .lean()
            .select("-content -flow -display -category -__v -flags")

        suggestedArticles.push(...sameCategoryArticles)

        // Calculate remaining articles needed
        const remainingNeeded = 3 - sameCategoryArticles.length

        // Fetch additional random articles if needed
        if (remainingNeeded > 0) {
            const excludeSlugs = sameCategoryArticles
                .map((a) => a.slug)
                .concat(currentArticleSlug)
            const randomArticles = await Article.aggregate([
                { $match: { ...articlesQuery, slug: { $nin: excludeSlugs } } },
                { $sample: { size: remainingNeeded } },
                {
                    $project: {
                        __v: 0,
                        flags: 0,
                        content: 0,
                        flow: 0,
                        display: 0,
                        category: 0,
                    },
                },
            ])

            suggestedArticles.push(...randomArticles)
        }

        res.json({
            suggestedArticles,
        })
    } catch (error) {
        console.error("Error serving suggested articles:", error)
        res.status(500).json({ message: "Error serving suggested articles" })
    }
}

const getFollowingArticles = async (req, res) => {
    const isUserLoggedIn = req.isUserLoggedIn
    const page = parseInt(req.query.page, 10) || 1 // Default to page 1
    const pageSize = 8

    try {
        if (isUserLoggedIn) {
            const userId = req.userId
            const user = await User.findById(userId).lean()

            if (!user) {
                return res.status(404).json({ message: "User not found" })
            }

            // Extract the list of following creators
            const followingCreatorRefIds = user.actions.following.map(
                (following) => following.creatorRefId,
            )

            // Query for following creators' articles
            const followingArticlesQuery = {
                "flags.status": "published",
                "flags.creator": { $in: followingCreatorRefIds },
                "flags.access": "all",
            }

            const totalFollowingArticles = await Article.countDocuments(followingArticlesQuery)

            const followingArticles = await Article.find(followingArticlesQuery)
                .sort({ publishedAt: -1 })
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .select("-__v -_id -flags -content")
                .lean()

            const moreFollowingArticlesExist = page * pageSize < totalFollowingArticles

            res.json({
                articles: followingArticles,
                page,
                moreArticlesExist: moreFollowingArticlesExist,
            })
        } else {
            // If user is not logged in, show only public articles
            res.status(401).json({
                message: "User must be logged in to view following articles",
            })
        }
    } catch (error) {
        console.error("Error serving following articles:", error)
        res.status(500).json({ message: "Error serving following articles" })
    }
}

const getSubscribedArticles = async (req, res) => {
    const isUserLoggedIn = req.isUserLoggedIn
    const page = parseInt(req.query.page, 10) || 1 // Default to page 1
    const pageSize = 8

    try {
        if (isUserLoggedIn) {
            const userId = req.userId
            const user = await User.findById(userId).lean()

            if (!user) {
                return res.status(404).json({ message: "User not found" })
            }

            // Extract the list of subscribed creators
            const subscribedCreatorRefIds = user.actions.subscriptions.map(
                (subscription) => subscription.creatorRefId,
            )

            // Query for subscribed creators' articles
            const subscribedArticlesQuery = {
                "flags.status": "published",
                "flags.creator": { $in: subscribedCreatorRefIds },
                "flags.access": "subscribers",
            }

            const totalSubscribedArticles =
                await Article.countDocuments(subscribedArticlesQuery)

            const subscribedArticles = await Article.find(subscribedArticlesQuery)
                .sort({ publishedAt: -1 })
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .lean()
                .select("-__v -_id -flags -content")

            const moreSubscribedArticlesExist = page * pageSize < totalSubscribedArticles

            res.json({
                articles: subscribedArticles,
                page,
                moreArticlesExist: moreSubscribedArticlesExist,
            })
        } else {
            // If user is not logged in, show only public articles
            res.status(401).json({
                message: "User must be logged in to view subscribed articles",
            })
        }
    } catch (error) {
        console.error("Error serving subscribed articles:", error)
        res.status(500).json({ message: "Error serving subscribed articles" })
    }
}

router.get("/explore", isLoggedIn, exploreArticles)
router.get("/suggested/similar", isLoggedIn, suggestSimilarArticles)

router.get("/following", isLoggedIn, getFollowingArticles)
router.get("/subscriptions", isLoggedIn, getSubscribedArticles)

module.exports = router
