import React, { useEffect, useRef, useState } from "react"
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime"

import { creatorInfo } from "@/signals/creator"
import useKeyPress from "@/helpers/hooks/useKeyPress"
import axiosInstance from "@/axios"

import ArticlePreview from "./ArticlePreview"

const SelectButton = ({ label, type, selectedType, onSelect, className, ...rest }) => {
    const isSelected = selectedType === type
    const baseClasses =
        "select-btn w-full flex-1 rounded border px-4 py-1.5 text-sm font-medium hover:bg-black hover:text-white"
    const selectedClasses = "!bg-rose-500 text-white"
    const unselectedClasses = "bg-white"

    const mergedClasses = `${baseClasses} ${isSelected ? selectedClasses : unselectedClasses} ${className || ""}`

    const fileInputRef = useRef(null)

    const handleUploadDialog = () => {
        fileInputRef.current.click()
    }

    const handleFileUpload = async (event) => {}

    return (
        <>
            {type === "header-image-upload" ? (
                <button
                    className={`${mergedClasses} overflow-hidden !px-3 !py-2 !text-start`}
                    onClick={handleUploadDialog}
                    {...rest}>
                    Upload Image
                    <input
                        ref={fileInputRef}
                        className="mt-1.5 cursor-pointer file:mr-2 file:cursor-pointer file:rounded file:border-0 file:bg-rose-500 file:text-white"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                    />
                    {/* {imageUrl && <img src={imageUrl} alt="Uploaded" />} */}
                </button>
            ) : (
                <button className={mergedClasses} onClick={() => onSelect(type)} {...rest}>
                    {label}
                </button>
            )}
        </>
    )
}

function Editor({ articleFromDB }) {
    useSignals()

    const isEscPressed = useKeyPress("Escape")

    const [isFullscreen, setIsFullscreen] = useState(false)
    const [selectedLayout, setSelectedLayout] = useState("default")
    const [selectedElementType, setSelectedElementType] = useState(null)

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
        category: "tag for article",
        image: {
            url: "https://placehold.co/960x1400/fafafa/222222/svg?text=Image+Goes+Here&font=Lato",
            caption: "Placeholder caption or description",
            credit: "Placeholder credit",
        },
        content: [],
        ...articleFromDB,
    })

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen)
    }

    const handleSelectElement = (type) => {
        setSelectedElementType(type)
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

    useEffect(() => {
        if (isFullscreen && isEscPressed) {
            setIsFullscreen(false)
        }
    }, [isEscPressed])

    useSignalEffect(() => {
        setArticle((prevArticle) => ({ ...prevArticle, ...articleFromDB }))
    }, [articleFromDB])

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
                        <ArticlePreview
                            article={article}
                            selectedElement={selectedElementType}
                            setArticle={setArticle}
                        />
                    </div>
                </div>
                <div className="editor-actions flex h-full w-1/5 flex-col gap-2 overflow-x-hidden overflow-y-scroll">
                    <div className="flex flex-col gap-1.5">
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

                        <div>
                            <button className="flex w-full items-center justify-center gap-2 rounded border bg-green-500 p-2 text-sm font-medium text-white hover:bg-green-600">
                                <img
                                    className="h-5 w-5"
                                    src="/assets/icons/cloud-upload.svg"
                                    alt=""
                                />{" "}
                                Save as draft
                            </button>
                            <div className="mt-2 flex items-center justify-end gap-2  text-sm font-medium">
                                <span>Status</span>
                                <span className="flex items-center rounded border bg-white px-2 py-0.5">
                                    <span className="mr-1 text-green-500">⦿</span>
                                    Saved
                                </span>
                            </div>
                        </div>
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
                                <SelectButton
                                    label="Title"
                                    type="header-title"
                                    selectedType={selectedElementType}
                                    onSelect={handleSelectElement}
                                />
                                <SelectButton
                                    label="Tag"
                                    type="header-tag"
                                    selectedType={selectedElementType}
                                    onSelect={handleSelectElement}
                                />
                            </div>
                            <SelectButton
                                label="Subtitle"
                                type="header-subtitle"
                                selectedType={selectedElementType}
                                onSelect={handleSelectElement}
                            />
                            <div className="flex flex-col gap-2 rounded border bg-white p-2">
                                Image
                                <div className="flex flex-col gap-2">
                                    <SelectButton
                                        label="Upload image"
                                        type="header-image-upload"
                                        selectedType={selectedElementType}
                                        onSelect={handleSelectElement}
                                    />
                                    <div className="flex gap-1.5">
                                        <SelectButton
                                            label="Caption"
                                            type="header-image-caption"
                                            selectedType={selectedElementType}
                                            onSelect={handleSelectElement}
                                        />
                                        <SelectButton
                                            label="Credits"
                                            type="header-image-credits"
                                            selectedType={selectedElementType}
                                            onSelect={handleSelectElement}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="border-gray-300" />
                    <div className="mt-1 flex flex-col gap-2 text-sm font-semibold">
                        <span>Content</span>
                        <div className="flex flex-col gap-1.5">
                            <SelectButton
                                label="Paragraph"
                                type="content-paragraph"
                                selectedType={selectedElementType}
                                onSelect={handleSelectElement}
                            />
                            <SelectButton
                                label="Image"
                                type="content-image"
                                selectedType={selectedElementType}
                                onSelect={handleSelectElement}
                            />
                            <SelectButton
                                label="Quote"
                                type="content-quote"
                                selectedType={selectedElementType}
                                onSelect={handleSelectElement}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Editor
