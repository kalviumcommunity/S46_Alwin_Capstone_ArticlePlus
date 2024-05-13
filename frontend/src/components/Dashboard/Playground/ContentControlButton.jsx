import React, { useContext, useRef } from "react"

import axiosInstance from "@/axios"

import { PlaygroundArticleContext, SelectedElementContext } from "./Playground"

function ContentControlButton({ type, label, ...rest }) {
    const { article, setArticle } = useContext(PlaygroundArticleContext)
    const { selectedElementType, setSelectedElementType } = useContext(SelectedElementContext)

    const isSelected = selectedElementType === type
    const baseClasses =
        "capitalize w-full flex-1 rounded-l px-3 py-2 text-sm font-medium hover:bg-black hover:text-white"
    const selectedClasses = "!bg-rose-500 text-white"
    const unselectedClasses = "bg-white"
    const mergedClasses = `${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`

    const handleSelectElement = () => {
        setSelectedElementType(type)
    }

    const fileInputRef = useRef(null)

    const handleUploadDialog = (event) => {
        if (event.target !== fileInputRef.current) {
            fileInputRef.current.click()
            setSelectedElementType(type)
        }
    }

    const handleFileUpload = async (event) => {
        const file = event.target.files[0]
        const maxFileSize = 5 * 1024 * 1024 // 5MB

        if (file.size > maxFileSize) {
            alert("File size exceeds the maximum limit of 5MB.")
            return
        }

        const formData = new FormData()
        formData.append("articleImage", file)
        formData.append("articleId", article._id)

        console.log(selectedElementType)

        setIsLoading(true)
        axiosInstance
            .post(`/article/addimage/${type}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(() => {
                console.log("Image uploaded successfully")
            })
            .catch((error) => {
                console.error("Error uploading image:", error)
            })
            .then(() => {
                handleArticleDBUpdate()
                setIsLoading(false)
                fileInputRef.current.value = null
            })
    }

    const handleRemoveElement = () => {
        console.log("Removed element", type)
        const elementParams = type.split("-")

        if (elementParams[0] === "content") {
            const index = parseInt(elementParams[1])

            if (elementParams[2] === "quote") {
                if (elementParams[3] === "content") {
                    setArticle((prevArticle) => ({
                        ...prevArticle,
                        content: prevArticle.content.map((item, i) => {
                            if (i === parseInt(elementParams[1])) {
                                const { content, ...rest } = item
                                return rest
                            }
                            return item
                        }),
                    }))
                } else if (elementParams[3] === "ref") {
                    setArticle((prevArticle) => ({
                        ...prevArticle,
                        content: prevArticle.content.map((item, i) => {
                            if (i === parseInt(elementParams[1])) {
                                const { reference, ...rest } = item
                                return rest
                            }
                            return item
                        }),
                    }))
                } else {
                    setArticle((prevArticle) => ({
                        ...prevArticle,
                        content: prevArticle.content.filter((item, i) => i !== index),
                    }))
                }
            } else if (elementParams[2] === "image") {
                if (elementParams[3] === "caption") {
                    setArticle((prevArticle) => ({
                        ...prevArticle,
                        content: prevArticle.content.map((item, i) => {
                            if (i === parseInt(elementParams[1])) {
                                const { caption, ...rest } = item
                                return rest
                            }
                            return item
                        }),
                    }))
                } else if (elementParams[3] === "credits") {
                    setArticle((prevArticle) => ({
                        ...prevArticle,
                        content: prevArticle.content.map((item, i) => {
                            if (i === parseInt(elementParams[1])) {
                                const { credit, ...rest } = item
                                return rest
                            }
                            return item
                        }),
                    }))
                } else {
                    setArticle((prevArticle) => ({
                        ...prevArticle,
                        content: prevArticle.content.filter((item, i) => i !== index),
                    }))
                }
            } else {
                setArticle((prevArticle) => ({
                    ...prevArticle,
                    content: prevArticle.content.filter((item, i) => i !== index),
                }))
            }
        }

        setSelectedElementType(null)
    }

    return (
        <div>
            {type.endsWith("image") ? (
                <div className="flex w-full flex-col gap-2 rounded border bg-white px-2.5 pb-3 pt-2 text-sm font-medium  capitalize">
                    <div className="flex w-full items-center justify-between">
                        <span className="pl-1">{label}</span>
                        <button
                            className="group rounded border bg-white px-1.5 py-1.5 hover:bg-red-500"
                            onClick={handleRemoveElement}>
                            <img
                                className="h-5 w-5 group-hover:invert"
                                src="/assets/icons/close.svg"
                                alt=""
                            />
                        </button>
                    </div>
                    <button
                        className={`${baseClasses} flex overflow-hidden rounded border !px-2.5 !py-1.5 !text-start`}
                        onClick={handleUploadDialog}>
                        <input
                            className="label mt-1.5 w-fit cursor-pointer file:mb-1.5 file:mr-2 file:flex file:cursor-pointer file:flex-col file:rounded file:border-0 file:bg-rose-500 file:text-white"
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                        />
                    </button>
                    <div className="flex flex-col gap-1.5">
                        <ContentControlButton label="Caption" type={`${type}-caption`} />
                        <ContentControlButton label="Credits" type={`${type}-credits`} />
                    </div>
                </div>
            ) : type.endsWith("quote") ? (
                <div className="flex w-full flex-col gap-2 rounded border bg-white px-2.5 pb-3 pt-2 text-sm font-medium  capitalize">
                    <div className="flex w-full items-center justify-between">
                        <span className="pl-1">{label}</span>
                        <button
                            className="group rounded border bg-white px-1.5 py-1.5 hover:bg-red-500"
                            onClick={handleRemoveElement}>
                            <img
                                className="h-5 w-5 group-hover:invert"
                                src="/assets/icons/close.svg"
                                alt=""
                            />
                        </button>
                    </div>{" "}
                    <div className="flex flex-col gap-1.5">
                        <ContentControlButton label="Content" type={`${type}-content`} />
                        <ContentControlButton label="Reference" type={`${type}-ref`} />
                    </div>
                </div>
            ) : (
                <div className="flex overflow-hidden rounded border bg-white">
                    <button
                        className={`${mergedClasses} text-start`}
                        onClick={handleSelectElement}
                        {...rest}>
                        {label}
                    </button>
                    {type === selectedElementType && (
                        <button
                            className="group rounded-r border-l bg-white px-1.5 hover:bg-red-500"
                            onClick={handleRemoveElement}>
                            <img
                                className="h-5 w-5 group-hover:invert"
                                src="/assets/icons/close.svg"
                                alt=""
                            />
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export default ContentControlButton
