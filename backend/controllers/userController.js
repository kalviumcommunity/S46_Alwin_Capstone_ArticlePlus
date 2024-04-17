require("dotenv").config()

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const { resend } = require("../services/resend")
const User = require("../models/user")

function generatePin() {
    // Generate a cryptographically secure random number
    const randomNumber = crypto.randomInt(100000, 1000000)
    // Convert the number to a string and pad with leading zeros if necessary
    const otp = randomNumber.toString().padStart(6, "0")
    return otp
}

const generateVerificationToken = async (userId, otp) => {
    return await jwt.sign({ userId, otp }, process.env.OTP_SECRET, {
        expiresIn: "5m",
        algorithm: process.env.JWT_ALGORITHM,
    })
}

const sendVerificationEmail = async (req, res) => {
    const userId = req.userId

    if (!userId) {
        return res.status(400).json({ success: false, message: "Invalid request" })
    }

    const user = await User.findById(userId)
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" })
    }

    if (user.verified) {
        return res.status(400).json({ success: false, message: "User already verified" })
    }

    const otp = generatePin()
    const token = await generateVerificationToken(userId, otp)

    const { error } = await resend.emails.send({
        from: process.env.SUPPORT_EMAIL,
        to: [user.email],
        subject: "Verify your Article plus account",
        html: `<div>Hello <b>${user.name}</b>,<br>One-time password (OTP) to verify your <a href="https://articleplus.alwinsunil.in" target="_blank" rel="noopener noreferrer">Article Plus</a> account is <b>${otp}</b>.<br>Thanks</div><br>This email was intended for ${user.email}. From Article Plus.<br>If you don't have an account with us, please reply to this email with subject as "Unauthorized usage of email"`,
    })

    if (error) {
        return res
            .status(400)
            .json({ success: false, message: "Error sending verification email" })
    }

    return res
        .status(200)
        .json({ success: true, token: token, message: "Verification email sent" })
}

const confirmOtpForVerification = async (req, res) => {
    const { token, otp: enteredOtp } = req.body
    if (!token || !enteredOtp) {
        return res.status(400).json({ success: false, message: "Invalid request" })
    }

    let payload
    try {
        payload = jwt.verify(token, process.env.OTP_SECRET)
    } catch (error) {
        return res.status(400).json({ success: false, message: "OTP has expired" })
    }

    const user = await User.findById(payload.userId)
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" })
    }

    if (enteredOtp !== payload.otp) {
        return res.status(400).json({ success: false, message: "Invalid OTP" })
    }

    user.verified = true
    await user.save()

    res.status(200).json({ success: true, message: "User verified successfully" })
}

module.exports = {
    sendVerificationEmail,
    confirmOtpForVerification,
}
