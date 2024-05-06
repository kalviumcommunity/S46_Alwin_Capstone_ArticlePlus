const multer = require("multer")
const inMemoryStorage = multer.memoryStorage()

const initMulter = () => {
    return multer({
        storage: inMemoryStorage,
    })
}

module.exports = initMulter
