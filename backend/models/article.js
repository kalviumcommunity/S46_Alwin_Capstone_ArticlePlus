const mongoose = require("mongoose")

// Content block schema
const contentBlockSchema = new mongoose.Schema({
    type: { type: String, required: true },
    text: { type: String },
    url: { type: String },
    caption: { type: String },
    comment: { type: String },
    author: { type: String },
    items: { type: [String], default: undefined },
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
    status: { type: String, required: true, enum: ["draft", "published", "for-review"] },
    title: {
        type: String,
        required: function () {
            if (this.status === "published" || this.status === "for-review") return true
        },
    },
    image: { type: String },
    subtitle: { type: String },
    author: authorSchema,
    timestamp: {
        type: String,
        required: true,
        default: new Date().toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        }),
    },
    category: { type: String },
    content: [contentBlockSchema],
})

const Article = mongoose.model("article", articleSchema)

module.exports = Article
