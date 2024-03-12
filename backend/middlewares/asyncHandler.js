// Async error handler middleware
const asyncHandler = (handler) => (req, res, next) =>
    handler(req, res, next).catch((err) => {
        console.error("Async Handler Error:", err.message)
        res.status(500).json({ error: "Internal Server Error" })
    })

module.exports = asyncHandler
