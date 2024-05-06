import { convertCategoryFormat } from "@/helpers/ui/convertCategoryFormat"

import ControlledLink from "./ControlledLink"

function ArticleDetails({
    tagRef,
    titleRef,
    subTitleRef,
    article,
    selectedElement,
    handleContentEditable,
    setDataSelected,
}) {
    return (
        <>
            <span
                ref={tagRef}
                onInput={(e) => handleContentEditable(e, "category")}
                contentEditable={selectedElement === "header-tag"}
                aria-rowspan={1}
                data-selected={setDataSelected(selectedElement)}
                className={`relative mb-2 font-serif text-sm uppercase text-rose-500 hover:underline ${selectedElement === "header-tag" && `highlight absolute top-0 outline-dotted outline-2 outline-red-500`}`}>
                {convertCategoryFormat(article.category.replace(/(\r\n|\n|\r)/gm, ""))}
            </span>
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
        </>
    )
}

export default ArticleDetails
