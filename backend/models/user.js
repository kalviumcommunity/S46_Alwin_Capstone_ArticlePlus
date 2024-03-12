const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    creator: { type: Boolean, default: false },
    refreshToken: { type: String },
    verifed: { type: Boolean, required: true, default: false },
})

const User = mongoose.model("users", userSchema)

module.exports = User
