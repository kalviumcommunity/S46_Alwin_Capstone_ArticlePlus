const sharp = require("sharp")

const convertToWebp = async (file, quality = 90, width = 2160, height = 2160) => {
    return await sharp(file.buffer)
        .resize(width, height, {
            fit: sharp.fit.inside,
            withoutEnlargement: true,
        })
        .webp({ quality })
        .toBuffer()
}

module.exports = { convertToWebp }
