import React, { useContext } from "react"
import { doc } from "prettier"

import { PlaygroundArticleContext } from "./Playground"

function AddContentButton({ label, type }) {
    const { article, setArticle } = useContext(PlaygroundArticleContext)

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
                        type: "paragraph",
                        text: `Select [${prevContent.length + 1}] Paragraph content and start editing`,
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
                        url: `https://placehold.co/600x400/fafafa/222222/svg?font=Lato&text=Upload+in+[${prevContent.length + 1}]+Image`,
                        alt: `Select [${prevContent.length + 1}] Image alt text and start editing`,
                        caption: `Select [${prevContent.length + 1}] Image caption and start editing`,
                        credit: `Select [${prevContent.length + 1}] Image credits and start editing`,
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
                        content: `Select [${prevContent.length + 1}] Quote content and start editing`,
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
