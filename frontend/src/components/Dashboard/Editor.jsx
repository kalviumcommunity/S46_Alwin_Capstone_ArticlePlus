import React, { useEffect, useState } from "react"
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime"

import { creatorInfo } from "@/signals/creator"
import { userDetails } from "@/signals/user"
import useKeyPress from "@/helpers/hooks/useKeyPress"

import ArticlePreview from "./ArticlePreview"

function Editor() {
    useSignals()

    const isEscPressed = useKeyPress("Escape")
    const [isFullscreen, setIsFullscreen] = useState(false)

    const [article, setArticle] = useState({
        title: "Here goes your title for the article",
        subtitle: "Write what is teh short summary/hook for the article",
        display: "header",
        flow: "default",
        slug: "here-goes-your-title-for-the-article",
        author: {
            name: "",
            id: "",
            type: "",
        },
        timestamp: new Date().toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        }),
        category: "tag for article",
        image: {
            url: "https://placehold.co/960x1400/fafafa/222222/svg?text=Image+Goes+Here&font=Lato",
            caption: "Placeholder caption or description",
            credit: "Placeholder credit",
        },
        content: [],
    })

    const [selectedContentType, setSelectedContentType] = useState(null)

    const [selectedLayout, setSelectedLayout] = useState("default")

    const handleContentTypeChange = (type) => {
        setSelectedContentType(type)
    }

    const handleLayoutChange = (event) => {
        setSelectedLayout(event.target.value)
        if (event.target.value === "default") {
            setArticle((prevArticle) => {
                return {
                    ...prevArticle,
                    display: "header",
                    flow: "default",
                }
            })
        } else if (event.target.value === "default-reverse") {
            setArticle((prevArticle) => {
                return {
                    ...prevArticle,
                    display: "header",
                    flow: "reverse",
                }
            })
        } else if (event.target.value === "square") {
            setArticle((prevArticle) => {
                return {
                    ...prevArticle,
                    display: "square",
                    flow: "default",
                }
            })
        } else if (event.target.value === "square-reverse") {
            setArticle((prevArticle) => {
                return {
                    ...prevArticle,
                    display: "square",
                    flow: "reverse",
                }
            })
        }
    }

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen)
    }

    useEffect(() => {
        if (isFullscreen && isEscPressed) {
            setIsFullscreen(false)
        }
    }, [isEscPressed])

    useSignalEffect(() => {
        const getAuthorDetails = () => {
            setArticle((prevArticle) => {
                const { name, id, type } = creatorInfo.value
                return {
                    ...prevArticle,
                    author: {
                        name,
                        id,
                        type,
                    },
                }
            })
        }
        getAuthorDetails()
    }, [])

    return (
        <div
            className={`flex bg-white ${
                isFullscreen
                    ? "fixed left-0 top-0 z-50 h-screen w-screen"
                    : "h-[calc(100vh-6rem)]"
            }`}>
            <div className="m-2 flex w-full gap-3 border bg-gray-100 p-2">
                <div className="flex w-4/5 flex-col gap-2">
                    <div className="flex w-full gap-1">
                        <span className="w-full rounded border bg-white px-4 py-1.5 text-xs">
                            {`${import.meta.env.VITE_API_URL}/article/${article.slug}`}
                        </span>
                    </div>
                    <div className="flex h-full overflow-y-scroll rounded border bg-white">
                        <ArticlePreview article={article} />
                    </div>
                </div>
                <div className="flex w-1/5 flex-col gap-2">
                    <div className="flex gap-2">
                        <button
                            className="flex w-full justify-center rounded border bg-white p-2 hover:bg-slate-50"
                            onClick={toggleFullscreen}>
                            <img
                                className="h-5"
                                src={`/assets/icons/${
                                    isFullscreen ? "close-fullscreen" : "fullscreen"
                                }.svg`}
                                alt=""
                            />
                        </button>
                    </div>
                    <hr className="border-gray-300" />
                    <div className="mt-1 flex flex-col gap-2 text-sm font-semibold">
                        <span>Header</span>
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 rounded border bg-white px-4 py-2">
                                <p>Layout:</p>
                                <select
                                    name="layout"
                                    className="w-full flex-1 rounded border bg-white px-2 py-1 text-sm font-medium"
                                    value={selectedLayout}
                                    onChange={handleLayoutChange}>
                                    <option value="default">Default</option>
                                    <option value="default-reverse">Default reverse</option>
                                    <option value="square">Square</option>
                                    <option value="square-reverse">Square reverse</option>
                                </select>
                            </div>
                            <div className="flex gap-1.5">
                                <button className="w-full flex-auto rounded border bg-white px-4 py-1.5 text-sm font-medium">
                                    Title
                                </button>
                                <button className="w-full flex-1 rounded border bg-white px-4 py-1.5 text-sm font-medium">
                                    Tag
                                </button>
                            </div>
                            <button className="w-full flex-1 rounded border bg-white px-4 py-1.5 text-sm font-medium">
                                Description
                            </button>
                            <div className="flex flex-col gap-2 rounded border bg-white p-2">
                                Image
                                <div className="flex flex-col gap-2">
                                    <button className="w-full flex-1 rounded border bg-white px-4 py-1.5 text-sm font-medium">
                                        Upload image
                                    </button>
                                    <div className="flex gap-1.5">
                                        <button className="w-full flex-1 rounded border bg-white px-4 py-1.5 text-sm font-medium">
                                            Caption
                                        </button>
                                        <button className="w-full flex-1 rounded border bg-white px-4 py-1.5 text-sm font-medium">
                                            Credits
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="border-gray-300" />
                    <div className="mt-1 flex flex-col gap-2 text-sm font-semibold">
                        <span>Content</span>
                        <div className="flex flex-col gap-1.5">
                            <button className="w-full flex-1 rounded border bg-white px-4 py-1.5 text-sm font-medium">
                                Paragraph
                            </button>
                            <button className="w-full flex-1 rounded border bg-white px-4 py-1.5 text-sm font-medium">
                                Image
                            </button>
                            <button className="w-full flex-1 rounded border bg-white px-4 py-1.5 text-sm font-medium">
                                Quote
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Editor
