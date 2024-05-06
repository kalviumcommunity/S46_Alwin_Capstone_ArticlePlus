import { useEffect, useState } from "react"
import { Link, useLocation, useParams } from "react-router-dom"

import axiosInstance from "@/axios"

import Playground from "@/components/Dashboard/Playground"

function EditorPage() {
    const location = useLocation()

    const { articleId } = useParams()
    const [isArticleNew, setIsArticleNew] = useState(false)
    const [isArticleAccessible, setIsArticleAccessible] = useState(false)

    useEffect(() => {
        axiosInstance
            .get(`article/${articleId}`)
            .then((res) => {
                console.log(res)
                setIsArticleAccessible(true)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    useEffect(() => {
        const isArticleNew = location.state?.isArticleNew || false
        setIsArticleNew(isArticleNew)
    }, [location.state])

    return (
        <div className="">
            <h1 className="mt-8 border-b px-8 pb-5 text-2xl font-semibold">
                Editor for {isArticleNew ? "new article" : "article"}{" "}
                <span className="text-sm font-normal">#{articleId}</span>
            </h1>
            {isArticleAccessible ? (
                <Playground articleId={articleId} />
            ) : (
                <div className="m-2 flex h-[50vh] w-full flex-col items-center justify-center gap-3 border bg-gray-100 p-2">
                    <div className="flex flex-col items-center gap-3">
                        <p className="text-xl font-semibold">
                            You don't have access to this article.
                        </p>
                        <Link
                            to="/dashboard"
                            className="flex h-fit w-fit items-center gap-2 rounded-full bg-rose-500 px-5 py-1.5 font-medium leading-5 text-white">
                            Back to dashboard
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EditorPage
