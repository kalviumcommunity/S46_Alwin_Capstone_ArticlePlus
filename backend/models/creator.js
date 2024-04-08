const mongoose = require("mongoose")

const CreatorSchema = new mongoose.Schema({
    owner: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    picture: { type: String, required: true },
    followers: { type: Number, required: true, default: 0 },
    articles: {
        total: { type: Number, required: true, default: 0 },
        free: { type: Number, required: true, default: 0 },
        subscription: { type: Number, required: true, default: 0 },
    },
    verified: { type: Boolean, required: true, default: false },
    description: { type: String, required: true },
    type: { type: String, required: true, enum: ["individual", "organization"] },
    subscription: { type: Boolean, required: true },
    contributors: [{ type: Array }],
    subscriptions: {
        type: [
            {
                name: { type: String, required: true },
                features: [{ type: String, required: true }],
                pricing: [
                    {
                        plan: { type: String, required: true },
                        type: {
                            type: String,
                            required: true,
                            enum: ["monthly", "yearly"],
                        },
                        price: { type: Number, required: true },
                        actualPrice: { type: Number },
                        discount: { type: Number },
                    },
                ],
            },
        ],
        default: function () {
            return this.subscription ? [] : undefined
        },
    },
})

const Creator = mongoose.model("creators", CreatorSchema)

module.exports = Creator
