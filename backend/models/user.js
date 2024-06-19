const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: function () {
            return this.provider === "email"
        },
    },
    refreshTokens: [
        {
            token: { type: String, required: true },
            deviceInfo: {
                userAgent: { type: String, required: true },
                deviceMetadata: { type: String, required: true },
            },
            createdAt: { type: Date, required: true, default: Date.now },
        },
    ],
    verified: { type: Boolean, required: true, default: false },
    provider: { type: String, required: true, default: "email", enum: ["email", "google"] },
    displayPicture: { type: String },
    creator: { type: Boolean, default: false },
    creatorId: {
        type: String,
        required: function () {
            return this.creator === true
        },
    },
})

const User = mongoose.model("users", userSchema)

module.exports = User
