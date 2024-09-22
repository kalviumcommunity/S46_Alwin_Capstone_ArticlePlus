const crypto = require("crypto")
const jwt = require("jsonwebtoken")

const SECRET_KEY = process.env.OTP_SECRET

const generateInviteCode = () => {
    return crypto.randomBytes(4).toString("hex")
}

const generateInviteToken = async (code) => {
    const token = jwt.sign({ code }, SECRET_KEY, { expiresIn: "5m" })
    const decoded = jwt.decode(token)

    return {
        code,
        token,
        expiresAt: decoded.exp * 1000,
    }
}

const isTokenExpired = (token) => {
    try {
        jwt.verify(token, SECRET_KEY)
        return false
    } catch (error) {
        return true
    }
}

const getInviteToken = async (creator) => {
    if (!creator.invite || !creator.invite.token) {
        return null
    }

    const token = creator.invite.token
    if (isTokenExpired(token)) {
        return null
    }

    const decoded = jwt.decode(token)
    return { code: decoded.code, token, expiresAt: decoded.exp * 1000 }
}

module.exports = {
    generateInviteCode,
    generateInviteToken,
    isTokenExpired,
    getInviteToken,
}
