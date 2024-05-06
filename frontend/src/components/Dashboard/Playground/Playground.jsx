import React from "react"

import ArticlePreview from "./ArticlePreview"
import SelectButton from "./SelectButton"
import usePlaygroundLogic from "./usePlaygroundLogic"

function Playground({ articleId }) {
    const {
        isFullscreen,
        article,
        selectedElementType,
        setArticle,
        toggleFullscreen,
        selectedLayout,
        handleLayoutChange,
        handleArticleDBUpdate,
        handleSelectElement,
    } = usePlaygroundLogic({ articleId })

    return (
        <div
            className={`flex bg-white ${
                isFullscreen
                    ? "fixed left-0 top-0 z-50 h-screen w-screen"
                    : "h-[calc(100vh-6rem)]"
            }`}>
            <div className="m-2 flex w-full gap-3 border bg-gray-100 p-2">
                <div className="flex w-4/5 flex-col gap-2">
                    <div className="flex w-full gap-1">
                        <span className="w-full rounded border bg-white px-4 py-1.5 text-xs">
                            {`${import.meta.env.VITE_API_URL}/article/${article.slug}`}
                        </span>
                    </div>
                    <div className="flex h-full overflow-y-scroll rounded border bg-white">
                        <ArticlePreview
                            article={article}
                            selectedElement={selectedElementType}
                            setArticle={setArticle}
                        />
                    </div>
                </div>
                <div className="flex h-full w-1/5 flex-col gap-2 overflow-x-hidden overflow-y-scroll pr-2.5">
                    <div className="sticky top-0 flex flex-col gap-1.5 border-b border-gray-300 bg-gray-100">
                        <button
                            className="flex w-full justify-center rounded border bg-white p-2 hover:bg-slate-50"
                            onClick={toggleFullscreen}>
                            <img
                                className="h-5"
                                src={`/assets/icons/${
                                    isFullscreen ? "close-fullscreen" : "fullscreen"
                                }.svg`}
                                alt=""
                            />
                        </button>
                        <button className="flex w-full items-center justify-center gap-1 rounded border bg-green-500 px-4 py-2 text-sm font-medium leading-none text-white hover:bg-green-600">
                            <img
                                className="h-5 w-5"
                                src="/assets/icons/cloud-upload.svg"
                                alt=""
                            />{" "}
                            Save as draft
                        </button>
                        <div className="mt-0.5 flex justify-between gap-2 px-1 pb-2 text-sm">
                            <div className="flex flex-col items-end justify-center gap-0.5 text-sm font-medium">
                                <span>Status</span>
                            </div>
                            <span className="flex items-center rounded border bg-white px-2 py-0.5">
                                <span className="mr-1 text-green-500">⦿</span>
                                Saved
                            </span>
                        </div>
                    </div>
                    <div className="mt-1 flex flex-col gap-2 text-sm font-semibold">
                        <span>Header</span>
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 rounded border bg-white px-4 py-2">
                                <p>Layout:</p>
                                <select
                                    name="layout"
                                    className="w-full flex-1 rounded border bg-white px-2 py-1 text-sm font-medium"
                                    value={selectedLayout}
                                    onChange={handleLayoutChange}>
                                    <option value="default">Default</option>
                                    <option value="default-reverse">Default reverse</option>
                                    <option value="square">Square</option>
                                    <option value="square-reverse">Square reverse</option>
                                </select>
                            </div>
                            <div className="flex gap-1.5">
                                <SelectButton
                                    label="Title"
                                    type="header-title"
                                    selectedType={selectedElementType}
                                    onSelect={handleSelectElement}
                                />
                                <SelectButton
                                    label="Tag"
                                    type="header-tag"
                                    selectedType={selectedElementType}
                                    onSelect={handleSelectElement}
                                />
                            </div>
                            <SelectButton
                                label="Subtitle"
                                type="header-subtitle"
                                selectedType={selectedElementType}
                                onSelect={handleSelectElement}
                            />
                            <div className="flex flex-col gap-2 rounded border bg-white p-2">
                                Image
                                <div className="flex flex-col gap-2">
                                    <SelectButton
                                        label="Upload image"
                                        type="header-image-upload"
                                        article={article}
                                        selectedType={selectedElementType}
                                        onSelect={handleSelectElement}
                                        handleArticleDBUpdate={handleArticleDBUpdate}
                                    />
                                    <div className="flex gap-1.5">
                                        <SelectButton
                                            label="Caption"
                                            type="header-image-caption"
                                            selectedType={selectedElementType}
                                            onSelect={handleSelectElement}
                                        />
                                        <SelectButton
                                            label="Credits"
                                            type="header-image-credits"
                                            selectedType={selectedElementType}
                                            onSelect={handleSelectElement}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="border-gray-300" />
                    <div className="mt-1 flex flex-col gap-2 text-sm font-semibold">
                        <span>Content</span>
                        <div className="flex flex-col gap-1.5">
                            <SelectButton
                                label="Paragraph"
                                type="content-paragraph"
                                selectedType={selectedElementType}
                                onSelect={handleSelectElement}
                            />
                            <SelectButton
                                label="Image"
                                type="content-image"
                                selectedType={selectedElementType}
                                onSelect={handleSelectElement}
                            />
                            <SelectButton
                                label="Quote"
                                type="content-quote"
                                selectedType={selectedElementType}
                                onSelect={handleSelectElement}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Playground
