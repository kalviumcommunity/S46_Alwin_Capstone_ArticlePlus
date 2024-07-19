import React, { useContext, useEffect, useRef } from "react"
import clsx from "clsx"

import Loader from "@/ui/Loader"
import ArticleDetails from "./ArticleDetails"
import { LoadingContext, PlaygroundArticleContext, SelectedElementContext } from "./Playground"

function ArticlePreview() {
    const { isLoading } = useContext(LoadingContext)
    const { article, setArticle } = useContext(PlaygroundArticleContext)
    const { selectedElementType: selectedElement } = useContext(SelectedElementContext)

    const categoryRef = useRef(null)
    const titleRef = useRef(null)
    const subTitleRef = useRef(null)

    const elementRefs = useRef([])

    const handleHeaderEditable = (e, type) => {
        const newContent = e.currentTarget.textContent
        setArticle((prevArticle) => ({
            ...prevArticle,
            [type]: newContent,
        }))

        const selection = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(e.currentTarget)
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
    }

    const handleContentEditable = (e, type, index) => {
        const newContent = e.currentTarget.textContent
        handleEditElement(type, newContent, index)

        const selection = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(e.currentTarget)
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
    }

    const handlePaste = (e, type) => {
        e.preventDefault()
        const text = e.clipboardData.getData("text/plain")
        const selection = window.getSelection()
        const range = selection.getRangeAt(0)
        range.deleteContents()
        const textNode = document.createTextNode(text)
        range.insertNode(textNode)
        range.setStartAfter(textNode)
        range.setEndAfter(textNode)
        selection.removeAllRanges()
        selection.addRange(range)

        // Triggering the handleHeaderEditable function to update the state
        handleHeaderEditable(e, type)
    }

    const handleEditElement = (type, value, index) => {
        const updatedContent = article.content.map((block, i) =>
            i === index ? { ...block, [type.split("-")[1]]: value } : block,
        )

        setArticle((prevArticle) => ({
            ...prevArticle,
            content: updatedContent,
        }))
    }

    const setDataSelected = () => {
        if (selectedElement?.startsWith("header")) {
            const refMap = {
                "header-title": titleRef,
                "header-subtitle": subTitleRef,
            }
            const selectedRef = refMap[selectedElement]
            if (selectedRef?.current) {
                selectedRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
                selectedRef.current.focus()
                return selectedElement.replace("header-", "").replace("-", " ")
            }
        } else if (selectedElement?.startsWith("content")) {
            console.log(selectedElement)
            const index = selectedElement.split("-")[1]
            const elementRef = elementRefs.current[index]?.element
            if (elementRef) {
                console.log(elementRef)
                elementRef.scrollIntoView({ behavior: "smooth", block: "center" })
                elementRef.focus()
                return `Content ${parseInt(index) + 1}`
            }
        }
        return ""
    }

    if (article) {
        return (
            <div
                className={clsx(
                    "font-body relative flex w-full flex-col items-center",
                    isLoading && "overflow-hidden",
                )}>
                {isLoading && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80">
                        <Loader />
                    </div>
                )}
                {article.display === "header" ? (
                    <div
                        className={clsx(
                            "flex flex-col items-center justify-center gap-10 border-b px-4 py-8 sm:gap-10 md:flex-row md:px-16 lg:px-32",
                            article.flow === "reverse" ? "md:flex-row" : "md:flex-row-reverse",
                        )}>
                        <div className="flex max-w-[90vw] flex-auto flex-col text-center sm:max-w-lg">
                            <ArticleDetails
                                categoryRef={categoryRef}
                                titleRef={titleRef}
                                subTitleRef={subTitleRef}
                                handleHeaderEditable={handleHeaderEditable}
                                handlePaste={handlePaste}
                                setDataSelected={setDataSelected}
                            />
                        </div>
                        <img
                            className="w-full flex-1 md:w-1/3"
                            src={article.image?.url}
                            alt={article?.title}
                            loading="lazy"
                        />
                    </div>
                ) : (
                    <div className="grid h-3/4 grid-cols-2 items-center justify-center overflow-clip border-b">
                        <div
                            className={clsx(
                                "flex max-w-[90vw] flex-1 flex-col px-16 text-center sm:max-w-lg",
                                article.flow === "reverse" && "order-1",
                            )}>
                            <ArticleDetails
                                categoryRef={categoryRef}
                                titleRef={titleRef}
                                subTitleRef={subTitleRef}
                                article={article}
                                selectedElement={selectedElement}
                                handleHeaderEditable={handleHeaderEditable}
                                setDataSelected={setDataSelected}
                            />
                        </div>
                        <div className="flex items-center justify-center overflow-hidden">
                            <img
                                className="h-full w-full object-cover"
                                src={article.image?.url}
                                alt={article?.title}
                                loading="lazy"
                            />
                        </div>
                    </div>
                )}
                <div className="flex w-full max-w-xl flex-col px-5 pt-12">
                    {article.content.map((block, index) => (
                        <div key={index} className="relative mb-6">
                            {block.type === "paragraph" && (
                                <p
                                    ref={(el) =>
                                        (elementRefs.current[index] = {
                                            index,
                                            type: "paragraph",
                                            element: el,
                                            text: block.text,
                                        })
                                    }
                                    className={clsx(
                                        "font-serif text-base leading-relaxed text-black",
                                        selectedElement === `content-${index}-${block.type}` &&
                                            "highlight top-0 outline-dotted outline-2 outline-red-500",
                                    )}
                                    data-selected={setDataSelected(selectedElement)}
                                    contentEditable={
                                        selectedElement === `content-${index}-${block.type}`
                                    }
                                    onInput={(e) =>
                                        handleContentEditable(e, "paragraph-text", index)
                                    }
                                    suppressContentEditableWarning>
                                    {block.text}
                                </p>
                            )}
                            {block.type === "image" && (
                                <div
                                    ref={(el) =>
                                        (elementRefs.current[index] = {
                                            index: index,
                                            type: "image",
                                            element: el,
                                            url: block.url,
                                            caption: block?.caption,
                                            credits: block?.credits,
                                        })
                                    }
                                    className="space-y-2">
                                    <img
                                        className="h-full"
                                        src={block.url}
                                        alt={block?.caption}
                                        loading="lazy"
                                    />
                                    <div className="flex flex-col gap-1 leading-5">
                                        <span
                                            className={clsx(
                                                "relative text-sm",
                                                selectedElement ===
                                                    `content-${index}-${block.type}-caption` &&
                                                    "highlight top-0 outline-dotted outline-2 outline-red-500",
                                            )}
                                            data-selected={setDataSelected(selectedElement)}
                                            contentEditable={
                                                selectedElement ===
                                                `content-${index}-${block.type}-caption`
                                            }
                                            onInput={(e) =>
                                                handleContentEditable(e, "image-caption", index)
                                            }
                                            suppressContentEditableWarning>
                                            {block?.caption}
                                        </span>
                                        <span
                                            className={clsx(
                                                "relative text-xs text-gray-500",
                                                selectedElement ===
                                                    `content-${index}-${block.type}-credits` &&
                                                    "highlight top-0 outline-dotted outline-2 outline-red-500",
                                            )}
                                            data-selected={setDataSelected(selectedElement)}
                                            contentEditable={
                                                selectedElement ===
                                                `content-${index}-${block.type}-credits`
                                            }
                                            onInput={(e) =>
                                                handleContentEditable(e, "image-credits", index)
                                            }
                                            suppressContentEditableWarning>
                                            {block?.credits}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {block.type === "quote" && (
                                <blockquote
                                    ref={(el) =>
                                        (elementRefs.current[index] = {
                                            index: index,
                                            type: "quote",
                                            element: el,
                                            content: block.content,
                                            ref: block.ref,
                                        })
                                    }
                                    className="relative mb-5 mt-3 flex flex-col gap-2 px-4">
                                    <svg
                                        className="absolute -start-2 -top-4 size-14"
                                        width="14"
                                        height="14"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true">
                                        <path
                                            d="M7.39762 10.3C7.39762 11.0733 7.14888 11.7 6.6514 12.18C6.15392 12.6333 5.52552 12.86 4.76621 12.86C3.84979 12.86 3.09047 12.5533 2.48825 11.94C1.91222 11.3266 1.62421 10.4467 1.62421 9.29999C1.62421 8.07332 1.96459 6.87332 2.64535 5.69999C3.35231 4.49999 4.33418 3.55332 5.59098 2.85999L6.4943 4.25999C5.81354 4.73999 5.26369 5.27332 4.84476 5.85999C4.45201 6.44666 4.19017 7.12666 4.05926 7.89999C4.29491 7.79332 4.56983 7.73999 4.88403 7.73999C5.61716 7.73999 6.21938 7.97999 6.69067 8.45999C7.16197 8.93999 7.39762 9.55333 7.39762 10.3ZM14.6242 10.3C14.6242 11.0733 14.3755 11.7 13.878 12.18C13.3805 12.6333 12.7521 12.86 11.9928 12.86C11.0764 12.86 10.3171 12.5533 9.71484 11.94C9.13881 11.3266 8.85079 10.4467 8.85079 9.29999C8.85079 8.07332 9.19117 6.87332 9.87194 5.69999C10.5789 4.49999 11.5608 3.55332 12.8176 2.85999L13.7209 4.25999C13.0401 4.73999 12.4903 5.27332 12.0713 5.85999C11.6786 6.44666 11.4168 7.12666 11.2858 7.89999C11.5215 7.79332 11.7964 7.73999 12.1106 7.73999C12.8437 7.73999 13.446 7.97999 13.9173 8.45999C14.3886 8.93999 14.6242 9.55333 14.6242 10.3Z"
                                            fill="#eeeeee"></path>
                                    </svg>
                                    <div className="relative z-10 mt-2">
                                        <p
                                            className={clsx(
                                                "text-lg font-normal italic text-gray-900",
                                                selectedElement ===
                                                    `content-${index}-${block.type}-content` &&
                                                    "highlight top-0 outline-dotted outline-2 outline-red-500",
                                            )}
                                            data-selected={setDataSelected(selectedElement)}
                                            contentEditable={
                                                selectedElement ===
                                                `content-${index}-${block.type}-content`
                                            }
                                            onInput={(e) =>
                                                handleContentEditable(e, "quote-content", index)
                                            }
                                            suppressContentEditableWarning>
                                            {block.content}
                                        </p>
                                    </div>
                                    <div className="relative">
                                        <p
                                            className={clsx(
                                                "text-base font-semibold",
                                                selectedElement ===
                                                    `content-${index}-${block.type}-ref` &&
                                                    "highlight top-0 outline-dotted outline-2 outline-red-500",
                                            )}
                                            data-selected={setDataSelected(selectedElement)}
                                            contentEditable={
                                                selectedElement ===
                                                `content-${index}-${block.type}-ref`
                                            }
                                            onInput={(e) =>
                                                handleContentEditable(e, "quote-ref", index)
                                            }
                                            suppressContentEditableWarning>
                                            {block.ref}
                                        </p>
                                    </div>
                                </blockquote>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className={"font-body relative flex w-full flex-col items-center"}>
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80">
                <Loader />
            </div>
        </div>
    )
}

export default ArticlePreview
