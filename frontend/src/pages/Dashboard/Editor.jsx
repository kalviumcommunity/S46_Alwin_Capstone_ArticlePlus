import React, { useEffect, useState } from "react"
import { Link, useLocation, useParams } from "react-router-dom"
import clsx from "clsx"

import axiosInstance from "@/axios"

import ArticleSettings from "@/components/Dashboard/ArticleSettings"
import Playground from "@/components/Dashboard/Playground"

import Loader from "@/ui/Loader"

export const EditorActiveTabContext = React.createContext()

function Editor() {
    const location = useLocation()

    const { articleId } = useParams()

    const [isLoading, setIsLoading] = useState(true)
    const [isArticleNew, setIsArticleNew] = useState(false)
    const [isArticleAccessible, setIsArticleAccessible] = useState(false)
    const [activeTab, setActiveTab] = useState("compose")

    useEffect(() => {
        let isMounted = true
        axiosInstance
            .get(`article/editor/${articleId}/access`)
            .then((res) => {
                if (isMounted) {
                    setIsArticleAccessible(true)
                }
            })
            .catch((err) => {
                console.error(err)
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoading(false)
                }
            })

        return () => {
            isMounted = false
        }
    }, [articleId])

    useEffect(() => {
        const isArticleNew = location.state?.isArticleNew || false
        setIsArticleNew(isArticleNew)
    }, [location.state])

    const handleTabSwitch = (tab) => {
        setActiveTab(tab)
    }

    return (
        <EditorActiveTabContext.Provider value={{ setActiveTab }}>
            <div>
                <h1 className="mt-8 border-b px-8 pb-5 text-2xl font-semibold">
                    Editor for {isArticleNew ? "new article" : "article"}{" "}
                    <Link
                        to={`/dashboard/article/${articleId}`}
                        className="ml-1 text-sm font-normal underline">
                        #{articleId}
                    </Link>
                </h1>

                {isArticleAccessible ? (
                    <>
                        <div className="mb-1 mt-3 flex flex-col gap-1 border-b px-8 pb-3">
                            <div className="flex w-full gap-2">
                                <button
                                    className={clsx(
                                        "relative w-full rounded border px-2 py-2 text-center text-sm font-medium",
                                        activeTab === "compose"
                                            ? "bg-white text-rose-600"
                                            : "bg-gray-50 text-gray-600",
                                    )}
                                    onClick={() => handleTabSwitch("compose")}>
                                    <span
                                        className={clsx(
                                            "mr-2 rounded px-2 py-0.5",
                                            activeTab === "compose"
                                                ? "bg-rose-50"
                                                : "bg-gray-50",
                                        )}>
                                        1
                                    </span>
                                    Compose
                                </button>
                                <button
                                    className={clsx(
                                        "relative w-full rounded border px-2 py-2 text-center text-sm font-medium",
                                        activeTab === "settings"
                                            ? "bg-white text-rose-600"
                                            : "bg-gray-50 text-gray-600",
                                    )}
                                    onClick={() => handleTabSwitch("settings")}>
                                    <span
                                        className={clsx(
                                            "mr-2 rounded px-2 py-0.5",
                                            activeTab === "settings"
                                                ? "bg-rose-50"
                                                : "bg-gray-50",
                                        )}>
                                        2
                                    </span>
                                    Settings
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <div
                                    className={clsx(
                                        "h-2 w-full rounded border",
                                        activeTab === "compose" ? "bg-green-500" : "bg-gray-50",
                                    )}></div>
                                <div
                                    className={clsx(
                                        "h-2 w-full rounded border",
                                        activeTab === "settings"
                                            ? "bg-green-500"
                                            : "bg-gray-50",
                                    )}></div>
                            </div>
                        </div>
                        {activeTab === "compose" ? (
                            <Playground articleId={articleId} />
                        ) : (
                            <ArticleSettings articleId={articleId} />
                        )}
                    </>
                ) : (
                    <div className="m-2 flex h-[50vh] w-full flex-col items-center justify-center gap-3 border bg-gray-100 p-2">
                        {isLoading ? (
                            <Loader />
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <p className="text-center text-xl font-semibold">
                                    You don't have access to this article <br /> or it doesn't
                                    exist.
                                </p>
                                <Link
                                    to="/dashboard"
                                    className="flex h-fit w-fit items-center gap-2 rounded-full bg-rose-500 px-5 py-1.5 font-medium leading-5 text-white">
                                    Back to dashboard
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </EditorActiveTabContext.Provider>
    )
}

export default Editor
