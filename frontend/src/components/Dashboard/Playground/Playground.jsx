import { createContext, useCallback, useEffect, useRef, useState } from "react"
import { useSignals } from "@preact/signals-react/runtime"
import clsx from "clsx"
import { toast, Toaster } from "sonner"
import { z } from "zod"

import useKeyPress from "@/helpers/hooks/useKeyPress"
import axiosInstance from "@/axios"

import ToastAlert from "@/components/ui/ToastAlert"

import AddContentButton from "./AddContentButton"
import ArticlePreview from "./ArticlePreview"
import ContentControlButton from "./ContentControlButton"
import SelectButton from "./SelectButton"

export const LoadingContext = createContext()
export const PlaygroundArticleContext = createContext()
export const SelectedElementContext = createContext()
export const SelectedElementRefContext = createContext()

const contentBlockSchema = z.object({
    type: z.enum(["paragraph", "image", "quote"]),
    text: z.string().optional(),
    content: z.string().optional(),
    url: z.string().optional(),
    caption: z.string().optional(),
    credits: z.string().optional(),
    ref: z.string().optional(),
})

const authorSchema = z.object({
    name: z.string(),
    id: z.string(),
    type: z.enum(["individual", "organization"]),
    organization: z
        .object({
            name: z.string().optional(),
            id: z.string().optional(),
        })
        .optional(),
})

const articleSchema = z.object({
    display: z.enum(["header", "square"]),
    flow: z.enum(["default", "reverse"]),
    slug: z.string(),
    category: z.string().min(1, "Category is required"),
    title: z.string().min(1, "Title is required"),
    image: z.object({
        url: z.string(),
    }),
    subtitle: z.string().min(1, "Subtitle is required"),
    author: authorSchema,
    datestamp: z.string(),
    content: z.array(contentBlockSchema),
})

function Playground({ articleId }) {
    useSignals()

    const isEscPressed = useKeyPress("Escape")
    const selectedElementRef = useRef(null)

    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [initialLoad, setInitialLoad] = useState(true)
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
            .get(`article/editor/${articleId}/content`)
            .then((res) => {
                setArticle(res.data)
                setSavedArticle(res.data)
                console.log(res.data)
            })
            .catch((err) => {
                console.error(err)
            })
            .finally(() => {
                setIsLoading(false)
                setInitialLoad(false)
            })
    }, [articleId])

    const updateArticle = () => {
        if (validateArticle()) {
            setIsLoading(true)
            axiosInstance
                .patch(`article/editor/${articleId}/content`, article)
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
    }

    const handleArticleDBUpdate = () => {
        getArticle()
    }

    const handleSave = () => {
        updateArticle()
        setSelectedElementType(null)
    }

    const validateArticle = () => {
        const validation = articleSchema.safeParse(article)
        console.log(validation)
        console.log("validation running")
        if (!validation.success) {
            console.log("validation failed")
            toast.custom((t) => <ToastAlert message="Article is missing required fields" />)
            console.log(validation.error.errors)
            return false
        }
        return true
    }

    useEffect(() => {
        if (!initialLoad) {
            updateArticle()
        }
    }, [selectedElementType, selectedLayout, initialLoad])

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

        const isEqual =
            JSON.stringify(deepCopy(article)) === JSON.stringify(deepCopy(savedArticle))

        setIsSaved(isEqual)
    }, [article, savedArticle])
    const handleCategoryChange = async (event) => {
        const newCategory = event.target.value
        setSelectedCategory(newCategory)

        try {
            setIsLoading(true)
            await axiosInstance.patch(`article/editor/${article._id}/category`, {
                category: newCategory,
            })
            setArticle((prevArticle) => ({
                ...prevArticle,
                category: newCategory,
            }))
            toast.success("Category updated successfully")
        } catch (error) {
            console.error("Error updating category:", error)
            toast.error("Failed to update category")
        } finally {
            setIsLoading(false)
        }
    }

    const [selectedCategory, setSelectedCategory] = useState(article?.category || "")

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
                                            <button
                                                className="flex flex-auto items-center justify-center rounded border bg-green-500 px-3 py-2 text-sm font-medium leading-none text-white hover:bg-green-600 lg:gap-2"
                                                onClick={handleSave}>
                                                <img
                                                    className="h-5 w-5"
                                                    src="/assets/icons/cloud-upload.svg"
                                                    alt=""
                                                />
                                                <span className="line-clamp-1 w-fit">
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
                                            <div className="flex items-center gap-2 rounded border bg-white px-3.5 py-1.5">
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
                                            <div className="flex items-center gap-2 rounded border bg-white px-3.5 py-1.5">
                                                <p>Category:</p>
                                                <select
                                                    className="w-full flex-1 rounded border bg-white px-2 py-1 text-sm font-medium"
                                                    value={selectedCategory}
                                                    onChange={handleCategoryChange}>
                                                    <option
                                                        value="category-of-article"
                                                        disabled>
                                                        Select
                                                    </option>
                                                    <option value="technology">
                                                        Technology
                                                    </option>
                                                    <option value="health">Health</option>
                                                    <option value="business-&-finance">
                                                        Business & Finance
                                                    </option>
                                                    <option value="science">Science</option>
                                                    <option value="politics">Politics</option>
                                                    <option value="arts-&-culture">
                                                        Arts & Culture
                                                    </option>
                                                    <option value="travel">Travel</option>
                                                    <option value="environment">
                                                        Environment
                                                    </option>
                                                    <option value="education">Education</option>
                                                    <option value="sports">Sports</option>
                                                </select>
                                            </div>
                                            <div className="flex gap-1.5">
                                                <SelectButton
                                                    label="Title"
                                                    type="header-title"
                                                />
                                                <SelectButton
                                                    label="Subtitle"
                                                    type="header-subtitle"
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2 rounded border bg-white p-2.5">
                                                Upload Header Image
                                                <div className="flex flex-col gap-2">
                                                    <SelectButton
                                                        label="Upload header image"
                                                        type="header-image-upload"
                                                        selectionRef="header-image"
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
                                                        {...(content.type === "image" && {
                                                            handleArticleDBUpdate,
                                                        })}
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
                        <Toaster richColors position="top-center" />
                    </SelectedElementRefContext.Provider>
                </SelectedElementContext.Provider>
            </PlaygroundArticleContext.Provider>
        </LoadingContext.Provider>
    )
}

export default Playground
