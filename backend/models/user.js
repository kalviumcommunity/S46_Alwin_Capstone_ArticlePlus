const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        function() {
            return this.provider === "email"
        },
    },
    refreshToken: { type: String },
    verified: { type: Boolean, required: true, default: false },
    provider: { type: String, required: true, default: "email" },
    picture: { type: String },
    creator: { type: Boolean, default: false },
})

const User = mongoose.model("users", userSchema)

module.exports = User
