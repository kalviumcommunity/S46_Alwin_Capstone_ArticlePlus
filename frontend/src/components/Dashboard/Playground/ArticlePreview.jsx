import React, { useEffect, useRef } from "react"
import { ToyBrick } from "lucide-react"

import Loader from "@/components/ui/Loader"

import ArticleDetails from "./ArticleDetails"

function ArticlePreview({ article, selectedElement, setArticle, isLoading }) {
    const categoryRef = useRef(null)
    const titleRef = useRef(null)
    const subTitleRef = useRef(null)

    const elementRefs = useRef([])

    const handleContentEditable = (e, key, index = null, type = null) => {
        let newContent = e.currentTarget.textContent
        handleEditElement(key, index, type, newContent)

        const selection = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(e.currentTarget)
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
    }

    const handleEditElement = (key, index, type, value) => {
        if (key === "content") {
            if (type === "text") {
                setArticle({
                    ...article,
                    content: article.content.map((block, i) =>
                        i === index ? { ...block, text: value } : block,
                    ),
                })
                return
            }
        }
        setArticle({ ...article, [key]: value })
    }

    const setDataSelected = (selectedElement) => {
        console.log(selectedElement)
        if (selectedElement === "header-title") {
            titleRef.current.focus()
            return "Header Title"
        } else if (selectedElement === "header-category") {
            categoryRef.current.focus()
            return "Header Category"
        } else if (selectedElement === "header-subtitle") {
            subTitleRef.current.focus()
            return "Header Subtitle"
        } else if (selectedElement?.startsWith("content")) {
            const index = selectedElement.split("-")[1]
            const elementRef = elementRefs.current[index]?.element
            if (elementRef) {
                elementRef.focus()
                return `Content ${parseInt(index) + 1}`
            }
        }
        return ""
    }

    return (
        <div className={`font-body relative w-full ${isLoading && "overflow-hidden"}`}>
            {isLoading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80">
                    <Loader />
                </div>
            )}
            <div className="flex flex-col">
                {article.display === "header" ? (
                    <div
                        className={`flex flex-col items-center justify-center gap-10 border-b px-4 py-8 sm:gap-10 md:flex-row md:px-16 lg:px-32 ${article.flow === "reverse" ? "md:flex-row" : "md:flex-row-reverse"}`}>
                        <div className="flex max-w-[90vw] flex-col text-center sm:max-w-lg">
                            <ArticleDetails
                                categoryRef={categoryRef}
                                titleRef={titleRef}
                                subTitleRef={subTitleRef}
                                article={article}
                                selectedElement={selectedElement}
                                handleContentEditable={handleContentEditable}
                                setDataSelected={setDataSelected}
                            />
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
                            className={`flex max-w-[90vw] flex-1 flex-col px-16 text-center sm:max-w-lg ${article.flow === "reverse" && "order-1"}`}>
                            <ArticleDetails
                                categoryRef={categoryRef}
                                titleRef={titleRef}
                                subTitleRef={subTitleRef}
                                article={article}
                                selectedElement={selectedElement}
                                handleContentEditable={handleContentEditable}
                                setDataSelected={setDataSelected}
                            />
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
                <div className="flex justify-center">
                    <div className="flex w-full max-w-lg flex-col px-5 pt-12">
                        {article.content.map((block, index) => (
                            <div key={index} className="relative mb-6">
                                {block.type === "text" && (
                                    <p
                                        ref={(el) =>
                                            (elementRefs.current[index] = {
                                                index,
                                                type: "text",
                                                element: el,
                                                text: block.text,
                                            })
                                        }
                                        className={`font-serif text-base leading-relaxed text-black ${selectedElement === `content-${index}-${block.type}` && `highlight top-0 outline-dotted outline-2 outline-red-500`}`}
                                        data-selected={setDataSelected(selectedElement)}
                                        contentEditable={
                                            selectedElement === `content-${index}-${block.type}`
                                        }
                                        onInput={(e) =>
                                            handleContentEditable(
                                                e,
                                                "content",
                                                index,
                                                block.type,
                                            )
                                        }>
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
                                                credit: block?.credit,
                                            })
                                        }
                                        className="space-y-2">
                                        <img
                                            className="h-full"
                                            src={block.url}
                                            alt={block?.caption}
                                            loading="lazy"
                                        />
                                        <div className="space-x-2 text-sm leading-5">
                                            <span>{block?.caption}</span>
                                            <span className="text-gray-500">
                                                {block?.credit}
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
                                                text: block.text,
                                                reference: block.reference,
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
                                            <p className="text-lg font-normal text-gray-900">
                                                <em>{block.text}</em>
                                            </p>
                                        </div>
                                        {block?.reference && (
                                            <div className="text-base font-semibold">
                                                {block.reference}
                                            </div>
                                        )}
                                    </blockquote>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ArticlePreview
