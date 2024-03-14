require("dotenv").config()
const express = require("express")
const cors = require("cors")
const session = require("express-session")
const passport = require("passport")

const { startDB } = require("./db")
require("./lib/passport")

const logger = require("./middlewares/requestLogger")
const apiRoutes = require("./api")

const app = express()
const port = process.env.PORT || 3000

// Start the database connection
startDB()

// Middleware
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        optionsSuccessStatus: 200,
        credentials: true,
    }),
)
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    }),
)
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())
app.use(logger)

// Routes
app.get("/db-status", (req, res) => {
    const isConnected = require("./db").isConnected()
    res.json({
        "📦 Database connection status": isConnected
            ? "✅ Connected"
            : "❌ Not connected",
    })
})
app.use("/", apiRoutes)

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})
