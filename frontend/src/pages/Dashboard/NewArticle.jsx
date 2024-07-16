import { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useSignals } from "@preact/signals-react/runtime"

import { newArticleId } from "@/signals/articles"
import axiosInstance from "@/axios"

import Loader from "@/ui/Loader"

function NewArticle() {
    useSignals()

    const location = useLocation()

    const [actionConfirmation, setActionConfirmation] = useState(false)
    const [articleId, setArticleId] = useState("")

    const handleRefresh = (event) => {
        event.preventDefault()
    }

    useEffect(() => {
        window.addEventListener("beforeunload", handleRefresh)

        return () => {
            window.removeEventListener("beforeunload", handleRefresh)
        }
    }, [])

    useEffect(() => {
        if (actionConfirmation && newArticleId.value === "") {
            axiosInstance.post("article/create").then((res) => {
                setArticleId(res.data._id)
            })
        }
    }, [actionConfirmation])

    useEffect(() => {
        const isFromDashboardRoute = location.state?.fromDashboard || false
        setActionConfirmation(isFromDashboardRoute)
    }, [location.state])

    return (
        <div>
            <h1 className="mt-8 border-b px-8 pb-5 text-2xl font-semibold">
                New article{" "}
                <span className="text-sm font-normal">
                    {articleId !== "" && `#${articleId}`}
                </span>
            </h1>
            <div className="m-2 flex h-[50vh] w-full flex-col items-center justify-center gap-3 border bg-gray-100 p-2">
                {actionConfirmation ? (
                    <>
                        {articleId ? (
                            <Navigate
                                to={`/dashboard/editor/${articleId}`}
                                replace={true}
                                state={{ isArticleNew: true }}
                            />
                        ) : (
                            <Loader />
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-3">
                        <button
                            className="flex h-fit w-fit items-center gap-2 rounded-full bg-rose-500 py-1.5 pl-2 pr-3 font-medium leading-5 text-white"
                            onClick={() => setActionConfirmation(!actionConfirmation)}>
                            <img src="/assets/icons/add-circle.svg" alt="" />
                            New article
                        </button>
                        <p className="text-sm text-gray-800">Draft new article now in editor</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NewArticle
