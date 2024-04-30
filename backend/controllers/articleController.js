const Article = require("../models/article")
const User = require("../models/user")
const Creator = require("../models/creator")

const createNewArticle = async (req, res) => {
    const { userId } = req

    if (!userId) {
        return res.status(400).json({ success: false, message: "Invalid request" })
    }

    let user = await User.findById(userId)

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" })
    }

    let creator = await Creator.findById(user.creatorId)

    if (!creator) {
        return res.status(404).json({ success: false, message: "Creator not found" })
    }

    const author = {}

    if (creator.type === "organization") {
        const contributor = creator.contributors.find(
            (contributor) => contributor.userRef === userId,
        )

        if (!contributor) {
            return res.status(403).json({ success: false, message: "Invalid request" })
        }

        author.name = contributor.name
        author.id = contributor.id
        author.type = creator.type
        author.organization = {
            name: creator.name,
            id: creator.id,
        }
    } else {
        author.name = creator.name
        author.id = creator.id
        author.type = creator.type
    }

    console.log(author)

    let article = await Article.create({ status: "draft", author: author })

    res.status(200).json(article)
}

module.exports = { createNewArticle }
