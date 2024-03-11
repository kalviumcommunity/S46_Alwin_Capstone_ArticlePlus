const express = require("express")
const app = express()
const port = 3000

const { startDB, isConnected } = require("./db")

startDB()

app.get("/", (req, res) => {
    res.json({
        "📦 Database connection status": isConnected()
            ? "✅ Connected"
            : "❌ Not connected",
    })
})

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})
