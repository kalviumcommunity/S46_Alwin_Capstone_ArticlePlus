import { useEffect, useRef } from "react"

import axiosInstance from "@/axios"

const SelectButton = ({
    setIsLoading,
    label,
    type,
    selectedType,
    onSelect,
    className,
    article,
    handleArticleDBUpdate,
    selectionRef,
    ...rest
}) => {
    const isSelected = selectedType === type
    const baseClasses =
        "capitalize w-full flex-1 rounded border px-4 py-1.5 text-sm font-medium hover:bg-black hover:text-white"
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

    return (
        <>
            {type === "header-image-upload" ? (
                <button
                    className={`${baseClasses} overflow-hidden !px-2.5 !py-1.5 !text-start`}
                    onClick={handleUploadDialog}
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
            ) : (
                <button className={mergedClasses} onClick={() => onSelect(type)} {...rest}>
                    {label}
                </button>
            )}
        </>
    )
}

export default SelectButton
