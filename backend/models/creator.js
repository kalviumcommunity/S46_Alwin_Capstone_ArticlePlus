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
            code: { type: String },
            token: { type: String },
        },
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
                name: { type: String, required: true, default: "default" },
                features: [{ type: String, required: true }],
                monthlyPrice: { type: Number, required: true },
                annualPrice: { type: Number, required: true },
                annualOffer: {
                    amount: { type: Number, required: true },
                    basePrice: { type: Number, required: true },
                },
            },
        ],
        required: function () {
            return this.subscription
        },
    },
})

CreatorSchema.index({ "invite.code": 1 }, { unique: true })

const Creator = mongoose.model("creators", CreatorSchema)

module.exports = Creator
