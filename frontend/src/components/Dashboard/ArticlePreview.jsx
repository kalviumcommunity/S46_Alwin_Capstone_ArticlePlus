import React, { useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"

import { convertCategoryFormat } from "@/utils/ui/convertCategoryFormat"

function ControlledLink({
    to,
    reference,
    children,
    className,
    dataSelected,
    handleOnInput,
    isContentEditable,
}) {
    const navigate = useNavigate()

    const handleClick = (event) => {
        event.preventDefault()
        const confirmed = window.confirm(
            "Are you sure you want to leave this page? This article won't be saved.",
        )
        if (confirmed) navigate(to)
    }

    return (
        <Link
            ref={reference}
            to={to}
            onClick={handleClick}
            className={className}
            data-selected={dataSelected}
            contentEditable={isContentEditable}
            onInput={handleOnInput}>
            {children}
        </Link>
    )
}

function ArticlePreview({ article, selectedElement, setArticle }) {
    const tagRef = useRef(null)
    const titleRef = useRef(null)
    const subTitleRef = useRef(null)

    const handleContentEditable = (e, key) => {
        const newContent = e.currentTarget.textContent
        handleEditElement(key, newContent)

        const selection = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(e.currentTarget)
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
    }

    const handleEditElement = (key, value) => {
        setArticle({ ...article, [key]: value })
    }

    const setDataSelected = (selectedElement) => {
        if (selectedElement === "header-title") {
            titleRef.current.focus()
            return "Header Title"
        } else if (selectedElement === "header-tag") {
            tagRef.current.focus()
            return "Header Tag"
        } else if (selectedElement === "header-subtitle") {
            subTitleRef.current.focus()
            return "Header Subtitle"
        }
        return ""
    }

    useEffect(() => {
        console.log(selectedElement)
    }, [selectedElement])

    return (
        <div className="font-body w-full">
            <div className="flex flex-col">
                {article.display === "header" ? (
                    <div
                        className={`flex flex-col items-center justify-center gap-10 border-b px-4 py-8 sm:gap-10 md:flex-row md:px-16 lg:px-32 ${article.flow === "reverse" ? "md:flex-row" : "md:flex-row-reverse"}`}>
                        <div className="flex flex-col text-center">
                            {article.category ? (
                                <ControlledLink
                                    className="mb-2 font-serif text-sm uppercase text-rose-500 hover:underline"
                                    to={`/?tag=${article.category}`}>
                                    {convertCategoryFormat(article.category)}
                                </ControlledLink>
                            ) : null}
                            <h1
                                ref={titleRef}
                                className="mb-4 font-serif text-3xl font-semibold">
                                {article.title}
                            </h1>
                            <p ref={subTitleRef} className="mb-4 text-sm italic text-gray-800">
                                {article.subtitle}
                            </p>
                            {article.author && (
                                <div className="flex flex-col items-center">
                                    {article.author.type === "individual" ? (
                                        <ControlledLink
                                            to={`/creator/${article.author.id}`}
                                            className="text-xs font-semibold text-gray-800 hover:underline">
                                            {article.author.name}
                                        </ControlledLink>
                                    ) : (
                                        <>
                                            {article.author.organization && (
                                                <div className="flex items-center gap-1.5 ">
                                                    <ControlledLink
                                                        to={`/organization/${article.author.organization.id}`}
                                                        className="text-xs font-semibold leading-4 hover:underline">
                                                        {article.author.organization.name}
                                                    </ControlledLink>
                                                    <span>•</span>
                                                    <ControlledLink
                                                        className="text-xs font-semibold leading-4 hover:underline"
                                                        to={`/organization/${article.author.organization.id}/${article.author.id}`}>
                                                        <span>{article.author.name}</span>
                                                    </ControlledLink>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    <p className="mt-0.5 text-xs font-normal text-gray-500">
                                        {article.timestamp}
                                    </p>
                                </div>
                            )}
                        </div>
                        <img
                            className="w-full md:w-1/3"
                            src={article.image.url}
                            alt={article.image.caption}
                            loading="lazy"
                        />
                    </div>
                ) : (
                    <div className="grid h-2/3 grid-cols-2 items-center justify-center border-b">
                        <div
                            className={`flex flex-1 flex-col px-16 text-center ${article.flow === "reverse" && "order-1"}`}>
                            <ControlledLink
                                reference={tagRef}
                                handleOnInput={(e) => handleContentEditable(e, "category")}
                                isContentEditable={selectedElement === "header-tag"}
                                dataSelected={setDataSelected(selectedElement)}
                                className={`relative mb-2 font-serif text-sm uppercase text-rose-500 hover:underline ${selectedElement === "header-tag" && `highlight absolute top-0 outline-dotted outline-2 outline-red-500`}`}
                                to={`/?tag=${article.category}`}>
                                {convertCategoryFormat(article.category)}
                            </ControlledLink>
                            <h1
                                ref={titleRef}
                                onInput={(e) => handleContentEditable(e, "title")}
                                contentEditable={selectedElement === "header-title"}
                                data-selected={setDataSelected(selectedElement)}
                                className={`relative mb-4 font-serif text-3xl font-semibold ${selectedElement === "header-title" && `highlight absolute top-0 outline-dotted outline-2 outline-red-500`}`}>
                                {article.title}
                            </h1>
                            <p
                                ref={subTitleRef}
                                onInput={(e) => handleContentEditable(e, "subtitle")}
                                contentEditable={selectedElement === "header-subtitle"}
                                data-selected={setDataSelected(selectedElement)}
                                className={`relative mb-4 text-sm italic text-gray-800 ${selectedElement === "header-subtitle" && `highlight absolute top-0 outline-dotted outline-2 outline-red-500`}`}>
                                {article.subtitle}
                            </p>
                            {article.author && (
                                <div className="flex flex-col items-center">
                                    {article.author.type === "individual" ? (
                                        <ControlledLink
                                            to={`/creator/${article.author.id}`}
                                            className="text-xs font-semibold text-gray-800 hover:underline">
                                            {article.author.name}
                                        </ControlledLink>
                                    ) : (
                                        <div className="flex items-center gap-1.5 ">
                                            <ControlledLink
                                                to={`/organization/${article.author.organization.id}`}
                                                className="text-xs font-semibold leading-4 hover:underline">
                                                {article.author.organization.name}
                                            </ControlledLink>
                                            <span>•</span>
                                            <ControlledLink
                                                className="text-xs font-semibold leading-4 hover:underline"
                                                to={`/organization/${article.author.organization.id}/${article.author.id}`}>
                                                <span>{article.author.name}</span>
                                            </ControlledLink>
                                        </div>
                                    )}
                                    <p className="mt-0.5 text-xs font-normal text-gray-500">
                                        {article.timestamp}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="flex h-[80vh] items-center justify-center overflow-hidden">
                            <img
                                className="h-full w-full object-cover"
                                src={article.image.url}
                                alt={article.image.caption}
                                loading="lazy"
                            />
                        </div>
                    </div>
                )}
                <div className="space-x-2 px-4 pt-3 text-xs md:px-16 lg:px-32">
                    <span>{article.image.caption}</span>
                    <span className="text-gray-500">{article.image.credit}</span>
                </div>
            </div>
        </div>
    )
}

export default ArticlePreview
