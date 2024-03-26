const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("📦 Connected to mongoDB")
    } catch (err) {
        console.error("❌ Error connecting to mongoDB:", err.message)
        process.exit(1)
    }
}

const disconnectDB = async () => {
    try {
        await mongoose.connection.close()
        console.log("📦 Disconnected from mongoDB")
    } catch (err) {
        console.error("❌ Error disconnecting from mongoDB:", err.message)
    }
}

const isDBConnected = () => {
    return mongoose.connection.readyState === 1
}

module.exports = { connectDB, disconnectDB, isDBConnected }
