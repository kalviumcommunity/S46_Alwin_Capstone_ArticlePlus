const crypto = require("crypto")
const { getStorage, getDownloadURL } = require("firebase-admin/storage")

const Article = require("../models/article")
const User = require("../models/user")
const Creator = require("../models/creator")

const { convertToWebp } = require("../lib/sharp")

const storage = getStorage()

// Helper function to generate a random 4-character hash
const generateSlugHash = () => {
    let hash
    do {
        hash = crypto.randomBytes(4).toString("hex") // Generate 8-character hash
    } while (hash.includes("-")) // Check if hash contains '-'

    return hash
}

// Helper function to upload an image to storage and get the download URL
const uploadImageToStorage = (imageFile, imagePath) => {
    return new Promise((resolve, reject) => {
        const imageRef = storage.bucket().file(imagePath)
        const blobStream = imageRef.createWriteStream({
            metadata: {
                contentType: "image/webp",
            },
        })

        blobStream.on("error", (err) => {
            console.error("Error uploading file:", err)
            resolve({ error: "Error uploading file" })
        })

        blobStream.on("finish", async () => {
            try {
                const url = await getDownloadURL(imageRef)
                resolve({ url })
            } catch (err) {
                console.error("Error getting download URL:", err)
                resolve({ error: "Error getting download URL" })
            }
        })

        blobStream.end(imageFile)
    })
}

const createNewArticle = async (req, res) => {
    const { userId } = req

    if (!userId) {
        return res.status(400).json({ success: false, message: "Invalid request" })
    }

    try {
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        const creator = await Creator.findById(user.creatorId)

        if (!creator) {
            return res.status(404).json({ success: false, message: "Creator not found" })
        }

        let author = {}

        const contributor = creator.contributors.find(
            (contributor) => contributor.userRef === userId,
        )

        if (!contributor) {
            return res.status(403).json({ success: false, message: "Invalid request" })
        }

        if (creator.type === "organization") {
            author = {
                name: contributor.name,
                id: contributor.id,
                type: creator.type,
                organization: {
                    name: creator.name,
                    id: creator.id,
                },
            }
        } else {
            author = {
                name: creator.name,
                id: creator.id,
                type: creator.type,
            }
        }

        const defaultTitle = "Here goes your title for the article"
        const slugHash = generateSlugHash(defaultTitle)
        const slug = `${defaultTitle
            .replace(/[^a-zA-Z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .toLowerCase()}-${slugHash}`

        const newArticle = {
            flags: {
                creator: creator._id.toString(),
                author: {
                    userRef: contributor.userRef,
                    type: creator.type,
                },
                slugHash: slugHash,
            },
            slug: slug,
            author: author,
        }

        const article = await Article.create(newArticle)

        res.status(200).json(article)
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

const allowAccessArticle = async (req, res) => {
    return res.json({ access: true })
}

const accessArticle = async (req, res) => {
    const { id } = req.params

    try {
        const article = await Article.findById(id).select("-flags")

        if (!article) {
            return res.status(404).json({ message: "Article not found" })
        }

        res.json(article)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const updateArticle = async (req, res) => {
    const { id } = req.params
    const newArticleData = { ...req.body }

    if (newArticleData.flags) {
        delete newArticleData.flags
    }

    try {
        let article = await Article.findByIdAndUpdate(
            id,
            { ...newArticleData, status: "draft" },
            { new: true, runValidators: true },
        )

        const slugHash = article.flags.slugHash
        const slug = `${article.title
            .replace(/[^a-zA-Z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .toLowerCase()}-${slugHash}`

        article.slug = slug

        await article.save()

        if (!article) {
            return res.status(404).json({ success: false, message: "Article not found" })
        }

        return res.json({ success: true, article })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

const updateArticleCategory = async (req, res) => {
    const { id } = req.params
    const newCategory = req.body.category

    try {
        const article = await Article.findById(id)

        if (!article) {
            return res.status(404).json({ message: "Article not found" })
        }

        article.category = newCategory

        await article.save()

        res.json({ success: true, message: "Article category updated" })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

const getArticleSettings = async (req, res) => {
    const { id } = req.params

    try {
        const article = await Article.findById(id)

        const articleSettings = {}

        articleSettings.title = article.title
        articleSettings.subtitle = article.subtitle
        articleSettings.datePublished = article.datePublished
        articleSettings.image = article.image.url

        if (article.flags) {
            articleSettings.access = article.flags.access
            articleSettings.status = article.flags.status
        }

        if (!article) {
            return res.status(404).json({ message: "Article not found" })
        }

        res.json(articleSettings)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const validateArticleForPublishing = (article) => {
    const checks = [
        {
            condition:
                article.content.length > 0 &&
                article.content.some((block) => block.type !== undefined),
            message: "At least one content block should exist in an article to publish.",
        },
        {
            condition:
                article.image.url !==
                "https://placehold.co/960x1400/fafafa/222222/svg?text=Image+Goes+Here&font=Lato",
            message: "Article must have an header image to publish (not default)",
        },
        {
            condition: article.title !== "Here goes your title for the article",
            message: "Article must have a title to publish (not default text)",
        },
        {
            condition:
                article.subtitle !== "Write what is the short summary/hook for the article",
            message: "Article must have a subtitle to publish (not default text)",
        },
        {
            condition: article.category !== "category-of-article",
            message: "Article must have a valid category to publish (not default)",
        },
    ]

    for (const check of checks) {
        if (!check.condition) {
            return { isValid: false, message: check.message }
        }
    }

    return { isValid: true }
}

const updateArticleSettings = async (req, res) => {
    const { id } = req.params
    const { status, access } = req.body

    try {
        const article = await Article.findById(id)

        if (!article) {
            return res.status(404).json({ message: "Article not found" })
        }

        const updates = {}
        let responseMessage = ""

        // Handle status change
        if (status && article.flags.status !== status) {
            if (article.flags.status === "published") {
                // Article is currently published, so we need to decrement counts if status changes to draft
                const decrementFields = { "articles.total": -1 }

                if (article.flags.access === "all") {
                    decrementFields["articles.free"] = -1
                } else if (article.flags.access === "subscribers") {
                    decrementFields["articles.subscription"] = -1
                }

                await Creator.findOneAndUpdate(
                    { _id: article.flags.creator },
                    { $inc: decrementFields },
                )
            }

            updates["flags.status"] = status

            if (status === "published") {
                // Article is being published
                const validationResult = validateArticleForPublishing(article)
                if (!validationResult.isValid) {
                    return res.status(400).json({
                        success: false,
                        message: validationResult.message,
                    })
                }
                updates.datePublished = new Date().toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                })
                updates.publishedAt = new Date()

                // Update creator's article counts when published
                const incrementFields = { "articles.total": 1 }

                if (article.flags.access === "all") {
                    incrementFields["articles.free"] = 1
                } else if (article.flags.access === "subscribers") {
                    incrementFields["articles.subscription"] = 1
                }

                await Creator.findOneAndUpdate(
                    { _id: article.flags.creator },
                    { $inc: incrementFields },
                )
            }

            responseMessage +=
                status === "published" ? "Article published. " : "Article saved as draft. "
        }

        // Handle access change
        if (access && article.flags.access !== access) {
            const updateFields = {}
            const currentAccess = article.flags.access

            // Update access for new access level
            if (access === "all") {
                updateFields["articles.free"] = 1 // Increment free count
            } else if (access === "subscribers") {
                updateFields["articles.subscription"] = 1 // Increment subscription count
            }

            // Update access for old access level
            if (currentAccess === "all") {
                updateFields["articles.free"] = (updateFields["articles.free"] || 0) - 1 // Decrement free count
            } else if (currentAccess === "subscribers") {
                updateFields["articles.subscription"] =
                    (updateFields["articles.subscription"] || 0) - 1 // Decrement subscription count
            }

            await Creator.findOneAndUpdate(
                { id: article.flags.creator },
                { $inc: updateFields },
            )

            updates["flags.access"] = access
            responseMessage += `Access updated to ${access === "all" ? "all" : "subscribers"}. `
        }

        if (Object.keys(updates).length === 0) {
            return res.json({ success: true, message: "No changes to settings to be made." })
        }

        await Article.findByIdAndUpdate(id, updates, { new: true })

        res.json({ success: true, message: responseMessage.trim() })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

const addArticleImage = async (req, res) => {
    const { articleId } = req.body
    const { ref } = req.params
    const articleImageFile = req.file

    try {
        const article = await Article.findById(articleId)
        if (!article) {
            return res.status(404).json({ error: "Article not found" })
        }

        const creator = await Creator.findOne({ "contributors.id": article.author.id })
        if (!creator) {
            return res
                .status(403)
                .json({ error: "You are not authorized to update this article's image." })
        }

        const webpArticleImageFile = await convertToWebp(articleImageFile)

        const uploadResult = await uploadImageToStorage(
            webpArticleImageFile,
            `article/${articleId}/${ref}`,
        )
        if (uploadResult.error) {
            return res.status(500).json({ error: uploadResult.error })
        }

        if (ref === "header-image") {
            article.image = { url: uploadResult.url, caption: "", credit: "" }
        } else {
            const [prefix, index, type] = ref.split("-")
            if (prefix === "content" && type === "image" && !isNaN(parseInt(index))) {
                const contentIndex = parseInt(index)
                if (
                    contentIndex >= 0 &&
                    contentIndex < article.content.length &&
                    article.content[contentIndex].type === "image"
                ) {
                    article.content[contentIndex].url = uploadResult.url
                } else {
                    return res
                        .status(400)
                        .json({ error: "Invalid content reference or content type mismatch." })
                }
            } else {
                return res.status(400).json({ error: "Invalid reference format." })
            }
        }

        await article.save()
        return res.json({ success: true, imageUrl: uploadResult.url })
    } catch (error) {
        console.error(error)
        return res
            .status(500)
            .json({ error: "An error occurred while updating the article image." })
    }
}

const deleteArticle = async (req, res) => {
    const { id } = req.params

    try {
        const article = await Article.findById(id)

        if (!article) {
            return res.status(404).json({ message: "Article not found" })
        }

        if (article.flags.status === "published") {
            const updateFields = {
                "articles.total": -1,
            }

            // Determining the category of the article
            if (article.flags.access === "all") {
                updateFields["articles.free"] = -1
            } else if (article.flags.access === "subscribers") {
                updateFields["articles.subscription"] = -1
            }

            // Updating the creator's article counts
            await Creator.findOneAndUpdate(
                { id: article.flags.creator },
                { $inc: updateFields },
            )
        }

        await Article.findByIdAndDelete(id)

        res.json({ success: true, message: "Article deleted" })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

module.exports = {
    createNewArticle,
    allowAccessArticle,
    accessArticle,
    updateArticle,
    updateArticleCategory,
    getArticleSettings,
    updateArticleSettings,
    addArticleImage,
    deleteArticle,
}
