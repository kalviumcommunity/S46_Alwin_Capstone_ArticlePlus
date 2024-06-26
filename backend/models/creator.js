const mongoose = require("mongoose")

const CreatorSchema = new mongoose.Schema({
    owner: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    displayPicture: { type: String, required: true },
    followers: { type: Number, required: true, default: 0 },
    subscribers: { type: Number, required: true, default: 0 },
    articles: {
        total: { type: Number, required: true, default: 0 },
        free: { type: Number, required: true, default: 0 },
        subscription: { type: Number, required: true, default: 0 },
    },
    verified: { type: Boolean, required: true, default: false },
    description: { type: String, required: true },
    type: { type: String, required: true, enum: ["individual", "organization"] },
    subscription: { type: Boolean, required: true },
    contributors: {
        type: [
            {
                name: { type: String, required: true },
                id: { type: String, required: true },
                role: { type: String, required: true, enum: ["owner", "author", "editor"] },
                userRef: { type: String, required: true },
            },
        ],
    },
    subscriptions: {
        type: [
            {
                name: { type: String, required: true, default: "default" },
                features: [{ type: String, required: true }],
                monthlyPrice: { type: Number, required: true },
                annualPrice: { type: Number, required: true },
                sellingPrice: { type: Number, required: true },
                offer: { type: { type: String }, value: { type: Number } },
            },
        ],
        required: function () {
            return this.subscription
        },
    },
})

const Creator = mongoose.model("creators", CreatorSchema)

module.exports = Creator
