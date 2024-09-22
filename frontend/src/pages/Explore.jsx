import React, { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

import axiosInstance from "@/axios"

import { ArticleCard } from "@/components/ArticleCard"
import Highlight from "@/components/Highlight"
import TagRibbon from "@/components/TagRibbon"

import Loader from "@/ui/Loader"

const renderArticleSet = (articleSubset, index) => {
    const firstArticleSet = articleSubset.slice(0, 4)
    const highlightArticle = articleSubset[4]
    const secondArticleSet = articleSubset.slice(5, 8)

    return (
        <div key={index} className="flex-col py-4">
            {firstArticleSet.length > 0 && (
                <div className="wrapper flex flex-col gap-3 py-8">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {firstArticleSet.map((article, idx) => (
                            <ArticleCard key={idx} article={article} />
                        ))}
                    </div>
                </div>
            )}
            {highlightArticle && (
                <div className="flex flex-col gap-2 py-6">
                    <div className="grid grid-cols-1 divide-x">
                        <Highlight key={4} article={highlightArticle} />
                    </div>
                </div>
            )}
            {secondArticleSet.length > 0 && (
                <div className="wrapper flex flex-col gap-3 py-6">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
                        {secondArticleSet.map((article, idx) => (
                            <ArticleCard key={idx} article={article} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

function Explore({ isLoggedIn }) {
    const [searchParams] = useSearchParams()

    const [articles, setArticles] = useState([])
    const [articleSets, setArticleSets] = useState([])
    const [moreArticlesExist, setMoreArticlesExist] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [category, setCategory] = useState(null)

    const fetchArticles = useCallback(
        async (currentPage) => {
            setIsLoading(true)
            try {
                const response = await axiosInstance.get("/articles/explore", {
                    params: {
                        page: currentPage,
                        ...(category && { category }),
                    },
                })
                const data = response.data
                setArticles((prevArticles) => {
                    const updatedArticles =
                        currentPage === 1 ? data.articles : [...prevArticles, ...data.articles]
                    const sets = []
                    for (let i = 0; i < updatedArticles.length; i += 8) {
                        sets.push(updatedArticles.slice(i, i + 8))
                    }
                    setArticleSets(sets)
                    return updatedArticles
                })
                setMoreArticlesExist(data.moreArticlesExist)
                setIsLoading(false)
            } catch (error) {
                console.error("Error fetching articles:", error)
                setIsLoading(false)
            }
        },
        [category],
    )

    useEffect(() => {
        const newCategory = searchParams.get("category")
        if (newCategory !== category) {
            setCategory(newCategory)
            setArticles([])
            setArticleSets([])
            setPage(1)
            setMoreArticlesExist(true)
        }
    }, [searchParams, category])

    useEffect(() => {
        fetchArticles(page)
    }, [page, category, fetchArticles])

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 2 &&
                moreArticlesExist &&
                !isLoading
            ) {
                setPage((prevPage) => prevPage + 1)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [moreArticlesExist, isLoading])

    return (
        <>
            <TagRibbon isLoggedIn={isLoggedIn} />

            {isLoading ? (
                <Loader />
            ) : (
                articleSets.map((articleSubset, index) =>
                    renderArticleSet(articleSubset, index),
                )
            )}

            {!isLoading && articles.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-4 px-4 py-28 sm:gap-6 sm:px-0">
                    <div className="relative flex justify-center">
                        <img
                            className="h-52 rounded-full"
                            src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3pqOGVrMGUyNnNiY3JqZzlqYzJwNGE2OW5kdzM2c2N6NGZ0YzNtOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VFqT7OwzErUIxC7Nt7/giphy.webp"
                            alt="Giphy"
                        />
                        <p className="absolute bottom-2 text-xs text-gray-200/70">
                            via{" "}
                            <a
                                className="font-medium text-white underline"
                                href="https://giphy.com/gifs/VFqT7OwzErUIxC7Nt7"
                                target="_blank"
                                rel="noreferrer">
                                {" "}
                                GIPHY
                            </a>
                        </p>
                    </div>
                    <div className="flex flex-col items-center sm:items-center">
                        <span className="bg-gradient-to-br from-rose-400 to-rose-600 bg-clip-text text-3xl font-extrabold uppercase leading-none text-transparent">
                            No articles found
                        </span>
                        <span className="mt-1.5 text-base font-medium leading-none">
                            Remove the filter or try another category
                        </span>
                    </div>
                </div>
            )}

            {!moreArticlesExist && (
                <div className="z-10 -m-[1px] flex items-center justify-start gap-3 border-y border-rose-200 bg-rose-50 px-6 py-3 sm:items-center sm:gap-4 sm:px-8 lg:px-16">
                    <div className="relative flex w-fit flex-col items-center gap-1">
                        <img
                            className="h-16 rounded-full"
                            src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDMzdzZlaXp6YXBsdGg2bHgzZTQyamtoZnRrNGVkcjl3ZGFhdHg2ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1ZDysdjIWUkXwSEWDv/giphy.webp"
                            alt="Giphy"
                        />
                        <p className="absolute bottom-2 text-xs text-gray-200">
                            via{" "}
                            <a
                                className="font-medium text-white underline"
                                href="https://giphy.com/gifs/1ZDysdjIWUkXwSEWDv"
                                target="_blank"
                                rel="noreferrer">
                                {" "}
                                GIPHY
                            </a>
                        </p>
                    </div>
                    <span className="text-base font-medium leading-5">
                        You have explored all the articles!
                    </span>
                </div>
            )}
        </>
    )
}

export default Explore
