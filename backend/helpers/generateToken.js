require("dotenv").config()

const jwt = require("jsonwebtoken")

const generateToken = async (userId) => {
    try {
        const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_LIFE,
            algorithm: process.env.JWT_ALGORITHM,
        })

        const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_LIFE,
            algorithm: process.env.JWT_ALGORITHM,
        })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new Error("Failed to generate tokens")
    }
}

module.exports = { generateToken }
