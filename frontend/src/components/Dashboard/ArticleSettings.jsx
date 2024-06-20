import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

import axiosInstance from "@/axios"

import Loader from "@/components/ui/Loader"

function ArticleSettings({ articleId }) {
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(true)
    const [article, setArticle] = useState(null)
    const [accessLevel, setAccessLevel] = useState("all")

    const getArticleSettings = () => {
        axiosInstance
            .get(`article/editor/${articleId}/settings`)
            .then((res) => {
                setArticle(res.data)
                setAccessLevel(res.data.access)
            })
            .catch((err) => {
                console.error(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const handleSaveAsDraft = () => {
        setIsLoading(true)
        axiosInstance
            .patch(`article/editor/${articleId}/settings`, {
                status: "draft",
                access: accessLevel,
            })
            .then((res) => {
                console.log("Saved as draft")
                navigate(`/dashboard/articles`)
            })
            .catch((err) => {
                console.error(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const handlePublish = () => {
        setIsLoading(true)
        axiosInstance
            .patch(`article/editor/${articleId}/settings`, {
                status: "published",
                access: accessLevel,
            })
            .then((res) => {
                console.log("Published")
                navigate(`/dashboard/articles`)
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
        <div className="flex gap-4 p-8">
            <div className="flex w-1/4 flex-col gap-4 rounded border bg-white p-3 pb-5">
                <div
                    className="h-48 w-full overflow-hidden rounded border"
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
                    <p className="mt-2 text-xs font-normal text-gray-500">
                        {article?.datestamp}
                    </p>
                    <div className="mt-3 flex flex-col gap-1">
                        <span className="font-medium">Article status:</span>
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
            <div className="relative flex w-3/4 flex-col rounded border p-6">
                <h2 className="text-xl font-medium">Article settings</h2>
                <hr className="mt-4" />
                <div className="mt-4">
                    <div className="flex items-center gap-4">
                        <span className="font-medium">Access for</span>
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                                <div className="flex w-36 flex-shrink-0 justify-center">
                                    <button className="flex w-full items-center justify-between gap-1 rounded border bg-white py-1 pl-4 pr-2">
                                        <span className="capitalize">{accessLevel}</span>
                                        <img
                                            className="h-4 w-4"
                                            src="/assets/icons/arrow-down.svg"
                                            alt=""
                                        />
                                    </button>
                                </div>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Portal>
                                <DropdownMenu.Content
                                    className="w-36 divide-y rounded-md border-2 bg-white p-1 text-sm"
                                    sideOffset={5}>
                                    <DropdownMenu.Item
                                        className="flex gap-2 rounded-sm px-2 py-1 hover:cursor-pointer hover:bg-gray-100"
                                        onSelect={() => setAccessLevel("all")}>
                                        All
                                    </DropdownMenu.Item>
                                    <DropdownMenu.Item
                                        className="flex items-center justify-between gap-2 rounded-sm px-2 py-1 hover:cursor-pointer hover:bg-gray-100"
                                        onSelect={() => setAccessLevel("subscribers")}>
                                        Subscribers
                                        <span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="h-5 text-green-500">
                                                <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                                                <path d="M8 8h8" />
                                                <path d="M8 12h8" />
                                                <path d="m13 17-5-1h1a4 4 0 0 0 0-8" />
                                            </svg>
                                        </span>
                                    </DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                    </div>
                </div>
                <div className="mt-auto flex w-full justify-end gap-2 border-t pt-4">
                    <button
                        className="rounded-full border px-5 py-1 font-medium text-gray-800 hover:bg-gray-100"
                        onClick={handleSaveAsDraft}>
                        Save as draft
                    </button>
                    <button
                        className="w-fit rounded-full border bg-green-500 px-5 py-1 font-medium text-white hover:bg-green-600"
                        onClick={handlePublish}>
                        Publish
                    </button>
                </div>
                {isLoading && (
                    <div className="absolute right-0 top-0 z-50 flex h-full w-full items-center justify-center bg-white/80 backdrop-blur-[2px]">
                        <Loader />
                    </div>
                )}
            </div>
        </div>
    )
}

export default ArticleSettings
