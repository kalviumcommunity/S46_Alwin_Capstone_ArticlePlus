import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime"

import { newArticleId } from "@/signals/articles"
import axiosInstance from "@/axios"

import Editor from "@/components/Dashboard/Editor"

function NewArticle() {
    useSignals()

    const location = useLocation()

    const [actionConfirmation, setActionConfirmation] = useState(false)
    const [articleFromDB, setArticleFromDB] = useState(null)

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
                newArticleId.value = res.data._id
                setArticleFromDB(res.data)
            })
        }
    }, [actionConfirmation])

    useEffect(() => {
        const isFromDashboardRoute = location.state?.fromDashboard || false
        setActionConfirmation(isFromDashboardRoute)
    }, [location.state])

    return (
        <div className="">
            <h1 className="mt-8 border-b px-8 pb-5 text-2xl font-semibold">
                New article{" "}
                <span className="text-sm font-normal">
                    {newArticleId.value !== "" && `#${newArticleId.value}`}
                </span>
            </h1>
            {actionConfirmation ? (
                <Editor articleFromDB={articleFromDB} />
            ) : (
                <div className="m-2 flex h-[50vh] w-full flex-col items-center justify-center gap-3 border bg-gray-100 p-2">
                    <div className="flex flex-col items-center gap-3">
                        <button
                            className="flex h-fit w-fit items-center gap-2 rounded-full bg-rose-500 py-1.5 pl-2 pr-3 font-medium leading-5 text-white"
                            onClick={() => setActionConfirmation(!actionConfirmation)}>
                            <img src="/assets/icons/add-circle.svg" alt="" />
                            New article
                        </button>
                        <p className="text-sm text-gray-800">Draft new article now in editor</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default NewArticle
