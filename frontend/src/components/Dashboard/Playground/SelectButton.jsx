import { useCallback, useContext, useRef, useState } from "react"

import axiosInstance from "@/axios"

import { LoadingContext, PlaygroundArticleContext, SelectedElementContext } from "./Playground"

const RegularButton = ({ label, type, ...rest }) => {
    const { selectedElementType, setSelectedElementType } = useContext(SelectedElementContext)

    const isSelected = selectedElementType === type
    const baseClasses =
        "capitalize w-full flex-1 rounded border px-4 py-1.5 text-sm font-medium hover:bg-black hover:text-white"
    const buttonClasses = `${baseClasses} ${isSelected ? "!bg-rose-500 text-white" : "bg-white"}`

    const handleSelectElement = () => setSelectedElementType(type)

    return (
        <button className={buttonClasses} onClick={handleSelectElement} {...rest}>
            {label}
        </button>
    )
}

const FileUploadButton = ({ type, handleArticleDBUpdate, selectionRef, ...rest }) => {
    const { setIsLoading } = useContext(LoadingContext)
    const { article } = useContext(PlaygroundArticleContext)
    const { setSelectedElementType } = useContext(SelectedElementContext)

    const [filename, setFilename] = useState("")

    const fileInputRef = useRef(null)

    const baseClasses =
        "capitalize w-full flex-1 rounded border px-4 py-1.5 text-sm font-medium hover:bg-black hover:text-white"

    const handleSelectElement = useCallback(() => {
        setSelectedElementType(type)
        fileInputRef.current?.click()
    }, [setSelectedElementType, type])

    const handleFileUpload = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        setFilename(file.name)

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
                `/article/editor/addimage/${article._id}/${selectionRef}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                },
            )
            console.log("Image uploaded successfully")
        } catch (error) {
            console.error("Error uploading image:", error)
            setFilename("") // Reset filename on error
        } finally {
            handleArticleDBUpdate()
            setIsLoading(false)
        }
    }

    return (
        <button
            className={`${baseClasses} overflow-hidden !px-2.5 !py-1.5 !text-start`}
            onClick={handleSelectElement}
            {...rest}>
            <span className="label mb-1.5 mr-2 mt-1.5 flex w-fit  cursor-pointer flex-col rounded border-0 bg-rose-500 px-1.5 py-0.5 text-sm text-white">
                Choose file
            </span>
            <span className="truncate" title={filename}>
                {filename || "No file chosen"}
            </span>
            <input
                className="hidden"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
            />
        </button>
    )
}

const SelectButton = (props) => {
    if (props.type === "header-image-upload") {
        return <FileUploadButton {...props} />
    }
    return <RegularButton {...props} />
}

export default SelectButton
