import React from "react"

function AddContentButton({ label, type, article, setArticle }) {
    const handleAddElement = () => {
        console.log("Adding element")
        if (type === "content-paragraph") {
            console.log("Adding paragraph")
            const prevContent = article.content || []
            setArticle({
                ...article,
                content: [
                    ...prevContent,
                    {
                        type: "text",
                        text: `Select [${prevContent.length + 1}] Text content and start editing`,
                    },
                ],
            })
        } else if (type === "content-image") {
            const prevContent = article.content || []
            setArticle({
                ...article,
                content: [
                    ...prevContent,
                    {
                        type: "image",
                        url: `Upload image by selecting [${prevContent.length + 1}] Image`,
                    },
                ],
            })
        } else if (type === "content-quote") {
            const prevContent = article.content || []
            setArticle({
                ...article,
                content: [
                    ...prevContent,
                    {
                        type: "quote",
                        text: `Select [${prevContent.length + 1}] Quote content and start editing`,
                        reference: `Select [${prevContent.length + 1}] Quote reference and start editing`,
                    },
                ],
            })
        }
    }

    return (
        <button
            className="w-full flex-1 rounded border bg-white px-4 py-1.5 text-sm font-medium hover:bg-black hover:text-white"
            onClick={handleAddElement}>
            {label}
        </button>
    )
}

export default AddContentButton
