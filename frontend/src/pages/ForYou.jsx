import React, { useCallback, useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import * as Tabs from "@radix-ui/react-tabs"

import axiosInstance from "@/axios"

import { ArticleCard } from "@/components/ArticleCard"
import TagRibbon from "@/components/TagRibbon"

import Loader from "@/ui/Loader"

function ForYou() {
    const location = useLocation()

    const [activeTab, setActiveTab] = useState("following")
    const [articles, setArticles] = useState({ following: [], subscriptions: [] })
    const [page, setPage] = useState({ following: 1, subscriptions: 1 })
    const [moreArticlesExist, setMoreArticlesExist] = useState({
        following: true,
        subscriptions: true,
    })
    const [isLoading, setIsLoading] = useState({ following: false, subscriptions: false })
    const [error, setError] = useState(null)

    useEffect(() => {
        if (location.pathname.includes("/foryou/subscriptions")) {
            setActiveTab("subscriptions")
        } else {
            setActiveTab("following")
        }
    }, [location.pathname])

    const fetchArticles = useCallback(
        async (currentPage, tab) => {
            if (isLoading[tab] || !moreArticlesExist[tab] || error) {
                return
            }
            setIsLoading((prev) => ({ ...prev, [tab]: true }))
            try {
                const endpoint =
                    tab === "following" ? "/articles/following" : "/articles/subscriptions"
                const response = await axiosInstance.get(endpoint, {
                    params: { page: currentPage },
                })
                const data = response.data
                setArticles((prevArticles) => ({
                    ...prevArticles,
                    [tab]:
                        currentPage === 1
                            ? data.articles
                            : [...prevArticles[tab], ...data.articles],
                }))
                setMoreArticlesExist((prev) => ({ ...prev, [tab]: data.moreArticlesExist }))
            } catch (error) {
                console.error(`Error fetching ${tab} articles:`, error)
                setError(`Error fetching ${tab} articles.`)
                alert("Error fetching articles. Please refresh the page.")
            } finally {
                setIsLoading((prev) => ({ ...prev, [tab]: false }))
            }
        },
        [isLoading, moreArticlesExist, error],
    )

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 2 &&
                !isLoading[activeTab] &&
                moreArticlesExist[activeTab] &&
                !error
            ) {
                setPage((prevPage) => ({ ...prevPage, [activeTab]: prevPage[activeTab] + 1 }))
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [isLoading, moreArticlesExist, activeTab, error])

    useEffect(() => {
        fetchArticles(page[activeTab], activeTab)
    }, [activeTab, fetchArticles, page])

    const handleTabChange = (newTab) => {
        setActiveTab(newTab)
        if (articles[newTab].length === 0 && !isLoading[newTab] && !error) {
            setPage((prevPage) => ({ ...prevPage, [newTab]: 1 }))
            fetchArticles(1, newTab)
        }
    }

    const renderArticles = (tab) => (
        <div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {articles[tab].map((article, index) => (
                    <ArticleCard key={index} article={article} />
                ))}
            </div>
            {isLoading[tab] && <Loader />}
            {articles[tab].length === 0 && !isLoading[tab] && !error && (
                <div className="flex flex-col items-center justify-center gap-5 px-4 py-24 sm:px-0">
                    <div className="relative flex justify-center rounded-full border">
                        <img
                            className="h-40 rounded-full"
                            src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdngyMTBremF6cXZkbm5vYXZ3M3MxNTVmeHg5amhnOTV0cDRoZWRubSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JoJGxeheao5mQaSiBK/giphy.webp"
                            alt="Giphy"
                        />
                        <p className="absolute -right-1 bottom-1 flex flex-col items-end text-xs leading-none text-gray-400">
                            via{" "}
                            <a
                                className="font-medium text-gray-700 underline"
                                href="https://giphy.com/gifs/bored-nothing-much-JoJGxeheao5mQaSiBK"
                                target="_blank"
                                rel="noreferrer">
                                {" "}
                                GIPHY
                            </a>
                        </p>
                    </div>
                    {activeTab === "subscriptions" ? (
                        <span className="text-base font-medium leading-none">
                            No articles from creators your subscribed to
                        </span>
                    ) : (
                        <span className="text-base font-medium leading-none">
                            No articles from creators your following
                        </span>
                    )}
                </div>
            )}
        </div>
    )

    return (
        <>
            <TagRibbon isLoggedIn={true} />
            <div className="flex-col pb-10 sm:border-t sm:pt-4">
                <Tabs.Root
                    className="wrapper flex py-2 sm:divide-x sm:py-6"
                    value={activeTab}
                    onValueChange={handleTabChange}>
                    <Tabs.List
                        className="sticky top-12 flex flex-row items-end gap-1 border-b bg-white pb-0 sm:mr-3 sm:w-60 sm:flex-col sm:items-start sm:gap-2 sm:border-0 sm:px-2 sm:py-0 sm:pl-2"
                        aria-label="manage your account">
                        <Tabs.Trigger
                            className="w-fit border border-white px-4 py-2 text-start text-sm font-medium text-gray-500 hover:bg-gray-50 sm:w-full sm:rounded sm:text-base [&[data-state='active']]:border-0 [&[data-state='active']]:border-b-2 [&[data-state='active']]:border-gray-800 [&[data-state='active']]:text-black sm:[&[data-state='active']]:border sm:[&[data-state='active']]:border-gray-200"
                            value="following"
                            asChild>
                            <Link to="/foryou">Following</Link>
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            className="w-fit border border-white px-4 py-2 text-start text-sm font-medium text-gray-500 hover:bg-gray-50 sm:w-full sm:rounded sm:text-base [&[data-state='active']]:border-0 [&[data-state='active']]:border-b-2 [&[data-state='active']]:border-gray-800 [&[data-state='active']]:text-black sm:[&[data-state='active']]:border sm:[&[data-state='active']]:border-gray-200"
                            value="subscriptions"
                            asChild>
                            <Link to="/foryou/subscriptions">Subscriptions</Link>
                        </Tabs.Trigger>
                    </Tabs.List>
                    <div className="flex-rows flex w-full px-2 sm:px-4 sm:pl-4">
                        <Tabs.Content value="following" className="w-full">
                            <div className="flex flex-col sm:px-2">
                                <span className="pb-5 text-xl font-semibold sm:pt-0 sm:text-2xl">
                                    Following
                                </span>
                                {renderArticles("following")}
                            </div>
                        </Tabs.Content>
                        <Tabs.Content value="subscriptions" className="w-full">
                            <div className="pn-5 flex w-full justify-between gap-2 pt-4 sm:pt-0">
                                <span className="text-xl font-semibold sm:text-2xl">
                                    Subscriptions
                                </span>
                                <Link
                                    className="flex h-fit items-center gap-1 rounded-full bg-rose-500 px-5 py-1 pr-4 text-sm font-medium text-white"
                                    to="/account/subscriptions">
                                    Manage subscriptions
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
                                        className="h-5 w-5">
                                        <path d="M7 7h10v10" />
                                        <path d="M7 17 17 7" />
                                    </svg>
                                </Link>
                            </div>
                            {renderArticles("subscriptions")}
                        </Tabs.Content>
                    </div>
                </Tabs.Root>
            </div>
        </>
    )
}

export default ForYou
