// Async error handler middleware
const asyncHandler = (handler) => (req, res, next) =>
    handler(req, res, next).catch((err) => {
        // Extract a concise part of the stack trace
        const stackLines = err.stack.split("\n")
        const conciseStack = stackLines.slice(0, 3).join("\n")

        console.error({
            message: "Async Handler Error",
            error: err.message,
            stack: conciseStack,
            urlAndMethod: req.originalUrl,
            method: req.method,
        })
        res.status(500).json({ error: "Internal Server Error" })
    })

module.exports = { asyncHandler }
