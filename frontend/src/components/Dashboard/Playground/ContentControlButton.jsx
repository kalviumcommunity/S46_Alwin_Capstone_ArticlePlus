import React, { useRef } from "react"

function ContentControlButton({ type, selectedType, className, label, onSelect, ...rest }) {
    const isSelected = selectedType === type
    const baseClasses =
        "capitalize w-full flex-1 rounded-l px-3 py-2 text-sm font-medium hover:bg-black hover:text-white"
    const selectedClasses = "!bg-rose-500 text-white"
    const unselectedClasses = "bg-white"
    const mergedClasses = `${baseClasses} ${
        isSelected ? selectedClasses : unselectedClasses
    } ${className || ""}`

    const fileInputRef = useRef(null)

    const handleUploadDialog = () => {
        fileInputRef.current.click()
        onSelect(type)
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

        console.log(selectedType)

        setIsLoading(true)
        axiosInstance
            .post(`/article/addimage/${selectionRef}`, formData, {
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

    const handleRemoveElement = (e) => {
        console.log("Removed element", type)
        if (type === selectedType) {
            onSelect(null)
        }
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
                        className={`${baseClasses} overflow-hidden rounded border !px-2.5 !py-1.5 !text-start`}
                        onClick={() => onSelect(type)}
                        {...rest}>
                        <input
                            className="label mt-1.5 cursor-pointer file:mb-1.5 file:mr-2 file:flex file:cursor-pointer file:flex-col file:rounded file:border-0 file:bg-rose-500 file:text-white"
                            ref={fileInputRef}
                            type="file"
                            for={type}
                            accept="image/*"
                            onChange={handleFileUpload}
                        />
                    </button>
                    <div className="flex flex-col gap-1.5">
                        <ContentControlButton
                            label="Caption"
                            type={`${type}-caption`}
                            onSelect={onSelect}
                        />
                        <ContentControlButton
                            label="Credits"
                            type={`${type}-credits`}
                            onSelect={onSelect}
                        />
                    </div>
                </div>
            ) : type.endsWith("quote") ? (
                <div className="flex w-full flex-col gap-2 rounded border bg-white px-2.5 pb-3 pt-2 text-sm font-medium  capitalize">
                    <div className="flex w-full items-center justify-between">
                        <span className="pl-1">{label}</span>
                        <button
                            className="group rounded border bg-white px-1.5 py-1.5 hover:bg-red-500"
                            c>
                            <img
                                className="h-5 w-5 group-hover:invert"
                                src="/assets/icons/close.svg"
                                alt=""
                            />
                        </button>
                    </div>{" "}
                    <div className="flex flex-col gap-1.5">
                        <ContentControlButton
                            label="Content"
                            type={`${type}-content`}
                            onSelect={onSelect}
                        />
                        <ContentControlButton
                            label="Reference"
                            type={`${type}-ref`}
                            onSelect={onSelect}
                        />
                    </div>
                </div>
            ) : (
                <div className="flex rounded border bg-white">
                    <button
                        className={`${mergedClasses} text-start`}
                        onClick={() => onSelect(type)}
                        {...rest}>
                        {label}
                    </button>
                    <button
                        className="group rounded-r border-l bg-white px-1.5 hover:bg-red-500"
                        onClick={handleRemoveElement}>
                        <img
                            className="h-5 w-5 group-hover:invert"
                            src="/assets/icons/close.svg"
                            alt=""
                        />
                    </button>
                </div>
            )}
        </div>
    )
}

export default ContentControlButton
