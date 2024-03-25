require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")

const { connectDB, isDBConnected } = require("./db")
const logger = require("./middlewares/requestLogger")
const apiRoutes = require("./routes")

const app = express()
const port = process.env.PORT || 3000

// Connect to the database
connectDB()

// Middleware
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        optionsSuccessStatus: 200,
        credentials: true,
    }),
)
app.use(cookieParser())
app.use(express.json())
app.use(logger)

// Routes
app.get("/db-status", (req, res) => {
    res.json({
        "📦 Database connection status": isDBConnected() ? "✅ Connected" : "❌ Not connected",
    })
})
app.use("/", apiRoutes)

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})
