const mongoose = require("mongoose")

const CreatorSchema = new mongoose.Schema({
    owner: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    displayPicture: {
        large: { type: String, required: true },
        medium: { type: String },
        small: { type: String },
    },
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
    invite: {
        type: {
            code: { type: String, required: true, unique: true },
            token: { type: String, required: true },
        },
        required: false,
    },
    subscription: { type: Boolean, required: true },
    contributors: {
        type: [
            {
                name: { type: String, required: true },
                id: {
                    type: String,
                    required: function () {
                        return this.role === "active"
                    },
                },
                role: { type: String, required: true, enum: ["owner", "author", "editor"] },
                userRef: { type: String, required: true },
                displayPicture: { type: String },
                description: { type: String },
                status: { type: String, enum: ["active", "paused", "approved"] },
            },
        ],
    },
    joinRequests: {
        type: [
            {
                inviteCode: { type: String, required: true },
                email: { type: String, required: true },
                id: { type: String, required: true },
                name: { type: String, required: true },
                userRef: { type: String, required: true },
                displayPicture: { type: String },
                createdAt: { type: Date, default: Date.now },
                role: {
                    type: String,
                    required: true,
                    enum: ["author"],
                    default: "author",
                },
            },
        ],
    },
    subscriptions: {
        type: [
            {
                name: { type: String, required: true },
                features: [{ type: String, required: true }],
                monthly: {
                    price: { type: Number, required: true },
                },
                annual: {
                    price: { type: Number, required: true },
                    basePrice: { type: Number, required: true },
                    discount: {
                        amount: { type: Number, required: true },
                    },
                },
            },
        ],
        required: function () {
            return this.subscription === true
        },
        validate: {
            validator: function (subscriptions) {
                if (this.subscription === false) return true
                return subscriptions.length > 0
            },
            message: "At least one subscription type is required",
        },
    },
})

const Creator = mongoose.model("creators", CreatorSchema)

module.exports = Creator
