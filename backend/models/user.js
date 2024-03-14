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
    creator: { type: Boolean, default: false },
    refreshToken: { type: String },
    verified: { type: Boolean, required: true, default: false },
    provider: { type: String, required: true, default: "email" },
})

const User = mongoose.model("users", userSchema)

module.exports = User
