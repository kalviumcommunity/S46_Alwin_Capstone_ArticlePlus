const mongoose = require("mongoose")

// Define the content block schema separately
const contentBlockSchema = new mongoose.Schema({
    type: { type: String, required: true },
    text: { type: String },
    url: { type: String },
    caption: { type: String },
    comment: { type: String },
    author: { type: String },
    items: { type: [String], default: undefined },
})

// Define the article schema
const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String },
    subtitle: { type: String },
    author: { type: String, required: true },
    timestamp: { type: String, required: true },
    category: { type: String },
    content: [contentBlockSchema],
})

const Article = mongoose.model("article", articleSchema)

module.exports = Article
