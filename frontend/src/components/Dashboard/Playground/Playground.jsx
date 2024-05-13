import { createContext, useEffect, useRef, useState } from "react"
import { useSignals } from "@preact/signals-react/runtime"

import useKeyPress from "@/helpers/hooks/useKeyPress"
import axiosInstance from "@/axios"

import AddContentButton from "./AddContentButton"
import ArticlePreview from "./ArticlePreview"
import ContentControlButton from "./ContentControlButton"
import SelectButton from "./SelectButton"

export const PlaygroundArticleContext = createContext()
export const SelectedElementContext = createContext()
export const SelectedElementRefContext = createContext()

function Playground({ articleId }) {
    useSignals()

    const isEscPressed = useKeyPress("Escape")

    const selectedElementRef = useRef(null)

    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [selectedLayout, setSelectedLayout] = useState("default")
    const [selectedElementType, setSelectedElementType] = useState(null)

    const [article, setArticle] = useState({
        title: "Here goes your title for the article",
        subtitle: "Write what is the short summary/hook for the article",
        display: "header",
        flow: "default",
        slug: "here-goes-your-title-for-the-article",
        author: {
            name: "",
            id: "",
            type: "",
            organization: {
                name: "",
                id: "",
            },
        },
        timestamp: new Date().toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        }),
        category: "tag-for-article",
        image: {
            url: "https://placehold.co/960x1400/fafafa/222222/svg?text=Image+Goes+Here&font=Lato",
        },
        content: [],
    })

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen)
    }

    const handleLayoutChange = (event) => {
        const { value } = event.target
        setSelectedLayout(value)

        const layoutOptions = {
            default: { display: "header", flow: "default" },
            "default-reverse": { display: "header", flow: "reverse" },
            square: { display: "square", flow: "default" },
            "square-reverse": { display: "square", flow: "reverse" },
        }

        const { display, flow } = layoutOptions[value] || {}

        setArticle((prevArticle) => ({
            ...prevArticle,
            display,
            flow,
        }))
    }

    const getArticle = () => {
        setIsLoading(true)
        axiosInstance
            .get(`article/${articleId}`)
            .then((res) => {
                setArticle((prevArticle) => ({
                    ...prevArticle,
                    ...res.data,
                }))
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const handleArticleDBUpdate = () => {
        getArticle()
    }

    useEffect(() => {
        getArticle()
    }, [articleId])

    useEffect(() => {
        if (isFullscreen && isEscPressed) {
            setIsFullscreen(false)
        }
    }, [isEscPressed])

    useEffect(() => {
        // console.log(article)
    }, [article])

    return (
        <PlaygroundArticleContext.Provider value={{ article, setArticle }}>
            <SelectedElementContext.Provider
                value={{ selectedElementType, setSelectedElementType }}>
                <SelectedElementRefContext.Provider
                    value={{ selectedElementRef, setSelectedElementType }}>
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
                                <div
                                    className="flex h-full overflow-y-scroll rounded border bg-white"
                                    id="article-preview">
                                    <ArticlePreview isLoading={isLoading} />
                                </div>
                            </div>
                            <div className="flex h-full w-1/5 flex-col gap-2 overflow-x-hidden overflow-y-scroll pr-2.5">
                                <div className="sticky top-0 flex flex-col gap-1.5 border-b border-gray-300 bg-gray-100">
                                    <div className="flex w-full gap-2">
                                        <button className="flex flex-auto items-center justify-center rounded border bg-green-500 px-3 py-2 text-sm font-medium leading-none text-white hover:bg-green-600 lg:gap-2">
                                            <img
                                                className="h-5 w-5"
                                                src="/assets/icons/cloud-upload.svg"
                                                alt=""
                                            />{" "}
                                            <span className="line-clamp-1 w-fit">
                                                Save as draft
                                            </span>
                                        </button>
                                        <button
                                            className="flex justify-center rounded border bg-white p-2 hover:bg-slate-50"
                                            onClick={toggleFullscreen}>
                                            <img
                                                className="h-5 w-5"
                                                src={`/assets/icons/${
                                                    isFullscreen
                                                        ? "close-fullscreen"
                                                        : "fullscreen"
                                                }.svg`}
                                                alt=""
                                            />
                                        </button>
                                    </div>
                                    <div className="mt-0.5 flex justify-between gap-2 px-1 pb-2 text-sm">
                                        <div className="flex flex-col items-end justify-center gap-0.5 text-sm font-medium">
                                            <span>Status</span>
                                        </div>
                                        <span className="flex items-center rounded border bg-white px-2 py-0.5">
                                            <span className="mr-1 text-green-500">⦿</span>
                                            Saved
                                        </span>
                                    </div>
                                </div>
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
                                                <option value="default-reverse">
                                                    Default reverse
                                                </option>
                                                <option value="square">Square</option>
                                                <option value="square-reverse">
                                                    Square reverse
                                                </option>
                                            </select>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <SelectButton label="Title" type="header-title" />
                                            <SelectButton label="Tag" type="header-category" />
                                        </div>
                                        <SelectButton label="Subtitle" type="header-subtitle" />
                                        <div className="flex flex-col gap-2 rounded border bg-white p-2.5">
                                            Upload Header Image
                                            <div className="flex flex-col gap-2">
                                                <SelectButton
                                                    label="Upload header image"
                                                    type="header-image-upload"
                                                    setIsLoading={setIsLoading}
                                                    handleArticleDBUpdate={
                                                        handleArticleDBUpdate
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr className="border-gray-300" />
                                <div className="mt-1 flex flex-col gap-2 text-sm font-semibold">
                                    <span>Add Content</span>
                                    <div className="flex gap-1.5 overflow-x-auto">
                                        <AddContentButton
                                            label="Paragraph"
                                            type="content-paragraph"
                                        />
                                        <AddContentButton label="Image" type="content-image" />
                                        <AddContentButton label="Quote" type="content-quote" />
                                    </div>
                                </div>
                                <hr className="border-gray-300" />
                                <div className="mt-1 flex flex-col gap-2 text-sm font-semibold">
                                    <span>
                                        Content Map
                                        <br />
                                        <span className="text-xs font-normal">
                                            (Select an element to edit)
                                        </span>
                                    </span>
                                    <div className="mb-4 flex flex-col gap-1.5">
                                        {article.content.map((content, index) => (
                                            <div key={index}>
                                                <ContentControlButton
                                                    label={`[${index + 1}] ${content.type}`}
                                                    type={`content-${index}-${content.type}`}
                                                />
                                            </div>
                                        ))}
                                        {article.content.length === 0 && (
                                            <div className="mb-3 flex items-center justify-center gap-1 rounded px-1 py-2 text-sm  font-normal text-gray-800">
                                                Add an element by selecting it from the list
                                                above
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SelectedElementRefContext.Provider>
            </SelectedElementContext.Provider>
        </PlaygroundArticleContext.Provider>
    )
}

export default Playground
