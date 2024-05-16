import React, { useCallback, useContext } from "react"

import { PlaygroundArticleContext } from "./Playground"

function AddContentButton({ label, type }) {
    const { article, setArticle } = useContext(PlaygroundArticleContext)

    const handleAddElement = () => {
        console.log("Adding element")
        const prevContent = article.content || []
        let newElement

        switch (type) {
            case "content-paragraph":
                console.log("Adding paragraph")
                newElement = {
                    type: "paragraph",
                    text: `Select [${prevContent.length + 1}] Paragraph content and start editing`,
                }
                break
            case "content-image":
                newElement = {
                    type: "image",
                    url: `https://placehold.co/600x400/fafafa/222222/svg?font=Lato&text=Upload+in+[${prevContent.length + 1}]+Image`,
                    caption: `Select [${prevContent.length + 1}] Image caption and start editing`,
                    credits: `Select [${prevContent.length + 1}] Image credits and start editing`,
                }
                break
            case "content-quote":
                newElement = {
                    type: "quote",
                    content: `Select [${prevContent.length + 1}] Quote content and start editing`,
                    ref: `Select [${prevContent.length + 1}] Quote reference and start editing`,
                }
                break
            default:
                return
        }

        setArticle({
            ...article,
            content: [...prevContent, newElement],
        })
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
