const mongoose = require("mongoose")

// Content block schema
const contentBlockSchema = new mongoose.Schema({
    type: { type: String, required: true, enum: ["paragraph", "image", "quote"] },
    text: { type: String },
    content: { type: String },
    url: { type: String },
    caption: { type: String },
    credits: { type: String },
    ref: { type: String },
})

const authorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    id: { type: String, required: true },
    type: { type: String, required: true, enum: ["individual", "organization"] },
    organization: {
        name: {
            type: String,
            required: function () {
                return this.type === "organization"
            },
        },
        id: {
            type: String,
            required: function () {
                return this.type === "organization"
            },
        },
    },
})

// Article schema
const articleSchema = new mongoose.Schema({
    flags: {
        status: {
            type: String,
            required: true,
            enum: ["draft", "published", "for-review"],
            default: "draft",
        },
        access: { type: String, required: true, enum: ["all", "subscribers"], default: "all" },
        creator: { type: String, required: true },
        author: {
            userRef: { type: String, required: true },
            type: { type: String, required: true, enum: ["individual", "organization"] },
        },
        slugHash: { type: String, required: true },
    },
    display: { type: String, required: true, enum: ["header", "square"], default: "header" },
    flow: { type: String, required: true, enum: ["default", "reverse"], default: "default" },
    slug: {
        type: String,
        required: function () {
            return this.status === "published" || this.status === "for-review"
        },
    },
    category: {
        type: String,
        required: true,
        default: "category-of-article",
        enum: [
            "category-of-article",
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
        ],
    },
    title: {
        type: String,
        default: "Here goes your title for the article",
        required: function () {
            if (this.status === "published" || this.status === "for-review") return true
        },
    },
    image: {
        url: {
            type: String,
            required: true,
            default:
                "https://placehold.co/960x1400/fafafa/222222/svg?text=Image+Goes+Here&font=Lato",
        },
    },
    subtitle: { type: String, default: "Write what is the short summary/hook for the article" },
    author: authorSchema,
    datestamp: {
        type: String,
        required: true,
        default: new Date().toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        }),
    },
    content: [contentBlockSchema],
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now, required: true },
})

const Article = mongoose.model("article", articleSchema)

module.exports = Article
