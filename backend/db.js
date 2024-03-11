require("dotenv").config()
const mongoose = require("mongoose")

const startDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("📦 Connected to mongoDB")
        return "📦 Connected to mongoDB"
    } catch (err) {
        console.error("❌ Error connecting to mongoDB:", err.message)
    }
}

const stopDB = async () => {
    try {
        await mongoose.disconnect()
        console.log("📦 Disconnected from mongoDB")
        return "📦 Disconnected from mongoDB"
    } catch (err) {
        console.error("❌ Error disconnecting from mongoDB:", err.message)
    }
}

const isConnected = () => {
    return mongoose.connection.readyState === 1
}

module.exports = { startDB, stopDB, isConnected }
