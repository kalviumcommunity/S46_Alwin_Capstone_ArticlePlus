import { useRef } from "react"

import axiosInstance from "@/axios"

const SelectButton = ({
    label,
    type,
    selectedType,
    onSelect,
    className,
    article,
    handleArticleDBUpdate,
    ...rest
}) => {
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
        axiosInstance
            .post("/article/addimage", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                console.log("Image uploaded successfully")
            })
            .catch((error) => {
                console.error("Error uploading image:", error)
            })
            .finally(() => {
                handleArticleDBUpdate()
            })
    }

    return (
        <>
            {type === "header-image-upload" ? (
                <button
                    className={`${mergedClasses} overflow-hidden !px-3 !py-2 !text-start`}
                    onClick={handleUploadDialog}
                    {...rest}>
                    Upload Image
                    <input
                        className="mt-1.5 cursor-pointer file:mr-2 file:cursor-pointer file:rounded file:border-0 file:bg-rose-500 file:text-white"
                        ref={fileInputRef}
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

export default SelectButton
