import { createContext, useCallback, useEffect, useRef, useState } from "react"
import { useSignals } from "@preact/signals-react/runtime"
import clsx from "clsx"

import useKeyPress from "@/helpers/hooks/useKeyPress"
import axiosInstance from "@/axios"

import AddContentButton from "./AddContentButton"
import ArticlePreview from "./ArticlePreview"
import ContentControlButton from "./ContentControlButton"
import SelectButton from "./SelectButton"

export const LoadingContext = createContext()
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

    const [article, setArticle] = useState(null)

    const [savedArticle, setSavedArticle] = useState(null)
    const [isSaved, setIsSaved] = useState(true)

    const toggleFullscreen = useCallback(() => {
        setIsFullscreen((prev) => !prev)
    }, [])

    const handleLayoutChange = useCallback((event) => {
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
    }, [])

    const getArticle = useCallback(() => {
        setIsLoading(true)
        axiosInstance
            .get(`article/${articleId}`)
            .then((res) => {
                setArticle(res.data)
                setSavedArticle(res.data)
            })
            .catch((err) => {
                console.error(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [articleId])

    const updateArticle = () => {
        setIsLoading(true)
        axiosInstance
            .patch(`article/${articleId}`, article)
            .then((res) => {
                setArticle(res.data.article)
                setSavedArticle(res.data.article)
            })
            .catch((err) => {
                console.error(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const handleArticleDBUpdate = () => {
        getArticle()
    }

    const handleSave = () => {
        updateArticle()
    }

    useEffect(() => {
        updateArticle()
    }, [selectedElementType, selectedLayout])

    useEffect(() => {
        getArticle()
    }, [articleId, getArticle])

    useEffect(() => {
        if (isFullscreen && isEscPressed) {
            setIsFullscreen(false)
        }
    }, [isFullscreen, isEscPressed])

    useEffect(() => {
        if (!article || !savedArticle) return

        const deepCopy = (obj) => JSON.parse(JSON.stringify(obj))

        const sortObjectKeys = (obj) => {
            const sortedObj = [obj].sort((a, b) => a.order - b.order)
            return sortedObj[0]
        }

        const sortedArticle = sortObjectKeys(deepCopy(article))
        const sortedSavedArticle = sortObjectKeys(deepCopy(savedArticle))

        const isEqual = JSON.stringify(sortedArticle) === JSON.stringify(sortedSavedArticle)

        setIsSaved(isEqual)
    }, [article, savedArticle])

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            <PlaygroundArticleContext.Provider value={{ article, setArticle }}>
                <SelectedElementContext.Provider
                    value={{ selectedElementType, setSelectedElementType }}>
                    <SelectedElementRefContext.Provider value={{ selectedElementRef }}>
                        <div
                            className={clsx("flex bg-white", {
                                "fixed left-0 top-0 z-50 h-screen w-screen": isFullscreen,
                                "h-[calc(100vh-6rem)]": !isFullscreen,
                            })}>
                            <div className="m-2 flex w-full gap-3 border bg-gray-100 p-2">
                                <div className="flex w-4/5 flex-col gap-2">
                                    <div className="flex w-full gap-1">
                                        <span className="w-full rounded border bg-white px-4 py-1.5 text-xs">
                                            {`${import.meta.env.VITE_API_URL}/article/${article?.slug}`}
                                        </span>
                                    </div>
                                    <div
                                        className="flex h-full overflow-y-scroll rounded border bg-white"
                                        id="article-preview">
                                        <ArticlePreview />
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
                                                />
                                                <span
                                                    className="line-clamp-1 w-fit"
                                                    onClick={handleSave}>
                                                    Save as draft
                                                </span>
                                            </button>
                                            <button
                                                className="flex justify-center rounded border bg-white p-2 hover:bg-slate-50"
                                                onClick={toggleFullscreen}>
                                                <img
                                                    className="h-5 w-5"
                                                    src={`/assets/icons/${isFullscreen ? "close-fullscreen" : "fullscreen"}.svg`}
                                                    alt=""
                                                />
                                            </button>
                                        </div>
                                        <div className="mt-0.5 flex justify-between gap-2 px-1 pb-2 text-sm">
                                            <div className="flex flex-col items-end justify-center gap-0.5 text-sm font-medium">
                                                <span>Status</span>
                                            </div>
                                            <span className="flex items-center rounded border bg-white px-2 py-0.5">
                                                <span
                                                    className={`mr-1 ${isSaved ? "text-green-500" : "text-red-500"}`}>
                                                    ⦿
                                                </span>
                                                {isSaved ? "Saved" : "To be saved"}
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
                                                <SelectButton
                                                    label="Title"
                                                    type="header-title"
                                                />
                                                <SelectButton
                                                    label="Tag"
                                                    type="header-category"
                                                />
                                            </div>
                                            <SelectButton
                                                label="Subtitle"
                                                type="header-subtitle"
                                            />
                                            <div className="flex flex-col gap-2 rounded border bg-white p-2.5">
                                                Upload Header Image
                                                <div className="flex flex-col gap-2">
                                                    <SelectButton
                                                        label="Upload header image"
                                                        type="header-image-upload"
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
                                            <AddContentButton
                                                label="Image"
                                                type="content-image"
                                            />
                                            <AddContentButton
                                                label="Quote"
                                                type="content-quote"
                                            />
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
                                            {article?.content.map((content, index) => (
                                                <div key={index}>
                                                    <ContentControlButton
                                                        label={`[${index + 1}] ${content.type}`}
                                                        type={`content-${index}-${content.type}`}
                                                    />
                                                </div>
                                            ))}
                                            {article?.content.length === 0 && (
                                                <div className="mb-3 flex items-center justify-center gap-1 rounded px-1 py-2 text-sm font-normal text-gray-800">
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
        </LoadingContext.Provider>
    )
}

export default Playground
