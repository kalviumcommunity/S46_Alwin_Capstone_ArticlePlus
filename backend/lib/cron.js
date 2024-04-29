const { CronJob } = require("cron")
const User = require("../models/user")

const cleanupRefreshTokens = async () => {
    try {
        // Get all users
        const users = await User.find({})

        for (const user of users) {
            // Filter out expired refresh tokens
            user.refreshTokens = user.refreshTokens.filter((token) => {
                const expirationDate = new Date(
                    token.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000,
                ) // 30 days in milliseconds
                const currentDate = new Date()

                // Keep the token if it's not expired
                return currentDate <= expirationDate
            })

            // Save the updated user document
            await user.save()
        }

        console.log("Refresh token cleanup completed")
    } catch (err) {
        console.error("Error cleaning up refresh tokens:", err)
    }
}

// Cron job which runs every day at midnight (Indian Standard Time)
const cleanupRefreshTokensJob = new CronJob(
    "0 0 * * *",
    cleanupRefreshTokens,
    null,
    true,
    "Asia/Kolkata",
)

cleanupRefreshTokensJob.start()
