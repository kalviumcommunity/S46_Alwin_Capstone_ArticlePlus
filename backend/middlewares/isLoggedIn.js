const { verifyToken } = require("../middlewares/verifyToken")

const isLoggedIn = (req, res, next) => {
    const accessToken = req.headers.authorization?.split(" ")[1]

    if (!accessToken) {
        req.isUserLoggedIn = false
        return next()
    }

    // Define a custom callback for verifyToken to set req.isUserLoggedIn and req.userId
    verifyToken(req, res, (err) => {
        if (err) {
            req.isUserLoggedIn = false
            return next()
        }

        req.isUserLoggedIn = true
        req.userId = req.userId // Ensure userId is set
        return next()
    })
}

module.exports = { isLoggedIn }
