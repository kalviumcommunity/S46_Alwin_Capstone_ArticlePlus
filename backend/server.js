require("dotenv").config()
const express = require("express")
const cors = require("cors")

const { startDB, isConnected } = require("./db")

const article = require("./routes/article")
const auth = require("./routes/auth")

const app = express()
const port = 3000

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        optionsSuccessStatus: 200,
        credentials: true,
    }),
)

app.use(express.json())

// Logging request and response time
app.use((req, res, next) => {
    const start = Date.now()
    const logRequest = `[${new Date().toISOString()}] ${req.method} ${
        req.originalUrl
    }`

    res.on("finish", () => {
        const duration = Date.now() - start
        console.log(`${logRequest} - ${duration}ms`)
    })

    next()
})

startDB()

app.get("/", (req, res) => {
    res.json({
        "📦 Database connection status": isConnected()
            ? "✅ Connected"
            : "❌ Not connected",
    })
})

app.use("/article", article)
app.use("/auth", auth)

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})
