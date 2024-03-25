require("dotenv").config()
const jwt = require("jsonwebtoken")

// Middleware to verify the access token
const verifyToken = async (req, res, next) => {
    const accessToken = req.headers.authorization?.split(" ")[1]

    if (!accessToken) {
        return res.status(401).json({ message: "No access token provided" })
    }

    try {
        const decoded = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, {
            algorithms: [process.env.JWT_ALGORITHM],
        })
        req.userId = decoded.userId
        next()
    } catch (error) {
        res.status(401).json({ message: "Invalid access token" })
    }
}

module.exports = { verifyToken }
