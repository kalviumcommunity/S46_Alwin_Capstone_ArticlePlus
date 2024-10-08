import { useContext } from "react"
import clsx from "clsx"

import { convertCategoryFormat } from "@/helpers/ui/convertCategoryFormat"

import ControlledLink from "./ControlledLink"
import { PlaygroundArticleContext, SelectedElementContext } from "./Playground"

function ArticleDetails({
    titleRef,
    subTitleRef,
    handleHeaderEditable,
    handlePaste,
    setDataSelected,
}) {
    const { article } = useContext(PlaygroundArticleContext)
    const { selectedElementType: selectedElement } = useContext(SelectedElementContext)

    const isSelected = (type) => selectedElement === type

    return (
        <>
            <span className="relative mb-1 font-serif text-sm uppercase text-rose-500 hover:underline">
                {convertCategoryFormat(article.category.replace(/(\r\n|\n|\r)/gm, ""))}
            </span>
            <h1
                ref={titleRef}
                onInput={(e) => handleHeaderEditable(e, "title")}
                contentEditable={isSelected("header-title")}
                onPaste={(e) => handlePaste(e, "title")}
                data-selected={setDataSelected(selectedElement)}
                className={clsx(
                    "relative mb-2 font-serif text-3xl font-semibold",
                    isSelected("header-title") &&
                        "highlight absolute top-0 outline-dotted outline-2 outline-red-500",
                )}
                suppressContentEditableWarning>
                {article.title}
            </h1>
            <p
                ref={subTitleRef}
                onInput={(e) => handleHeaderEditable(e, "subtitle")}
                contentEditable={isSelected("header-subtitle")}
                onPaste={(e) => handlePaste(e, "subtitle")}
                data-selected={setDataSelected(selectedElement)}
                className={clsx(
                    "relative mb-3 text-sm italic text-gray-800",
                    isSelected("header-subtitle") &&
                        "highlight absolute top-0 outline-dotted outline-2 outline-red-500",
                )}
                suppressContentEditableWarning>
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
                        <div className="flex items-center gap-1.5">
                            <ControlledLink
                                to={`/creator/${article.author.organization.id}`}
                                className="text-xs font-semibold leading-4 hover:underline">
                                {article.author.organization.name}
                            </ControlledLink>
                            <span>•</span>
                            <ControlledLink
                                className="text-xs font-semibold leading-4 hover:underline"
                                to={`/creator/${article.author.organization.id}/${article.author.id}`}>
                                {article.author.name}
                            </ControlledLink>
                        </div>
                    )}
                    <p className="mt-0.5 text-xs font-normal text-gray-500">
                        {article.datePublished}
                    </p>
                </div>
            )}
        </>
    )
}

export default ArticleDetails
