import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import axiosInstance from "@/axios"

import Loader from "@/ui/Loader"

function ArticleOverview() {
    const { articleId } = useParams()

    const [isLoading, setIsLoading] = useState(true)
    const [article, setArticle] = useState(null)

    const getArticleSettings = () => {
        axiosInstance
            .get(`article/editor/${articleId}/settings`)
            .then((res) => {
                setArticle(res.data)
                console.log(res.data)
            })
            .catch((err) => {
                console.error(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    useEffect(() => {
        getArticleSettings()
    }, [])

    return (
        <div>
            <h1 className="mt-8 border-b px-8 pb-5 text-2xl font-semibold">
                Article
                <span className="ml-1.5 text-sm font-normal">#{articleId}</span>
            </h1>
            <div className="flex w-screen flex-col px-8 py-6">
                {isLoading ? (
                    <div className="flex h-72 w-full items-center justify-center rounded border">
                        <Loader />
                    </div>
                ) : (
                    <>
                        <div className="flex w-full gap-4 rounded rounded-b-none border bg-white p-4">
                            <div
                                className="h-48 w-full max-w-96 overflow-hidden rounded border"
                                style={{
                                    backgroundImage: `url('${article?.image}')`,
                                    backgroundSize: "cover",
                                }}>
                                <img
                                    className="h-full w-full object-contain"
                                    src={`${article?.image}`}
                                    style={{ backdropFilter: "blur(50px)" }}
                                />
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="line-clamp-2 font-serif text-xl font-medium">
                                    {article?.title}
                                </span>
                                <span className="mt-1 line-clamp-2 text-sm italic text-gray-800">
                                    {article?.subtitle}
                                </span>
                                <di className="mt-2 flex items-center gap-2">
                                    {article?.author?.type === "organization" && (
                                        <Link
                                            to={`/creator/${article?.author?.organization?.id}/${article?.author?.id}`}
                                            className="w-fit rounded-sm font-medium hover:underline">
                                            {article?.author?.name}
                                        </Link>
                                    )}
                                    <p className="text-xs font-normal text-gray-500">
                                        {article?.datePublished}
                                    </p>
                                </di>
                                <div className="mt-3 flex items-center gap-2">
                                    <span className="text-sm">Status:</span>
                                    {article?.status === "draft" && (
                                        <span className="w-fit rounded-sm border border-red-200 bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                            Draft
                                        </span>
                                    )}
                                    {article?.status === "published" && (
                                        <span className="w-fit rounded-sm border border-green-200 bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                            Published
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full items-center justify-end gap-4 rounded-b border border-t-0 bg-white p-3">
                            <span className="text-sm">
                                To update content or change settings{" "}
                            </span>
                            <Link
                                to={`/dashboard/editor/${articleId}`}
                                className="w-fit rounded-full border bg-green-500 px-6 py-1 text-center font-medium text-white hover:bg-green-600">
                                Go to editor
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ArticleOverview
