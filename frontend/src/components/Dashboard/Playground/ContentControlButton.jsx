import React, { useCallback, useContext, useRef } from "react"
import clsx from "clsx"

import axiosInstance from "@/axios"

import { LoadingContext, PlaygroundArticleContext, SelectedElementContext } from "./Playground"

function ContentControlButton({ type, label, handleArticleDBUpdate, ...rest }) {
    const { setIsLoading } = useContext(LoadingContext)
    const { article, setArticle } = useContext(PlaygroundArticleContext)
    const { selectedElementType, setSelectedElementType } = useContext(SelectedElementContext)

    const isSelected = selectedElementType === type
    const baseClasses =
        "capitalize w-full flex-1 rounded-l px-3 py-2 text-sm font-medium hover:bg-black hover:text-white"
    const mergedClasses = clsx(baseClasses, {
        "!bg-rose-500 text-white": isSelected,
        "bg-white": !isSelected,
    })

    const fileInputRef = useRef(null)

    const handleSelectElement = () => {
        setSelectedElementType(type)
    }

    const handleUploadDialog = useCallback(
        (event) => {
            if (event.target !== fileInputRef.current) {
                fileInputRef.current.click()
                setSelectedElementType(type)
            }
        },
        [setSelectedElementType, type],
    )

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

        setIsLoading(true)
        try {
            await axiosInstance.post(
                `/article/editor/addimage/${article._id}/${type}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                },
            )
            console.log("Image uploaded successfully")
            handleArticleDBUpdate()
        } catch (error) {
            console.error("Error uploading image:", error)
        } finally {
            setIsLoading(false)
            fileInputRef.current.value = null
        }
    }

    const handleRemoveElement = useCallback(() => {
        console.log("Removed element", type)
        const elementParams = type.split("-")
        const index = parseInt(elementParams[1])

        setArticle((prevArticle) => {
            let contentKey = elementParams[3]

            if (contentKey) {
                return {
                    ...prevArticle,
                    content: prevArticle.content.map((item, i) => {
                        if (i === index) {
                            const { [contentKey]: removedKey, ...rest } = item
                            return rest
                        }
                        return item
                    }),
                }
            } else {
                return {
                    ...prevArticle,
                    content: prevArticle.content.filter((_, i) => i !== index),
                }
            }
        })

        setSelectedElementType(null)
    }, [setArticle, setSelectedElementType, type])

    return (
        <div>
            {type.endsWith("image") ? (
                <div className="flex w-full flex-col gap-2 rounded border bg-white px-2.5 pb-3 pt-2 text-sm font-medium capitalize">
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
                        className={clsx(
                            baseClasses,
                            "flex overflow-hidden rounded border !px-2.5 !py-1.5 !text-start",
                        )}
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
                <div className="flex w-full flex-col gap-2 rounded border bg-white px-2.5 pb-3 pt-2 text-sm font-medium capitalize">
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
                    <div className="flex flex-col gap-1.5">
                        <ContentControlButton label="Content" type={`${type}-content`} />
                        <ContentControlButton label="Reference" type={`${type}-ref`} />
                    </div>
                </div>
            ) : (
                <div className="flex overflow-hidden rounded border bg-white">
                    <button
                        className={clsx(mergedClasses, "text-start")}
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
