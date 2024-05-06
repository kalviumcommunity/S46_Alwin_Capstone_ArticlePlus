export const convertCategoryFormat = (tag) => {
    const words = tag.split("-")
    const capitalizedTag = words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    return capitalizedTag
}
