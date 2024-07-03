import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useSignals } from "@preact/signals-react/runtime"

import axiosInstance from "@/axios"

import { ArticleCard } from "@/components/ArticleCard"
import Highlight from "@/components/Highlight"
import TagRibbion from "@/components/TagRibbion"

function Explore({ isLoggedin }) {
    useSignals()
    const [searchParams] = useSearchParams()
    const [articles, setArticles] = useState([])
    const [page, setPage] = useState(1)
    const [moreArticlesExist, setMoreArticlesExist] = useState(true)

    const fetchArticles = async (page) => {
        try {
            const response = await axiosInstance.get(`/articles/explore?page=${page}`)
            const data = response.data
            console.log(data)
            setArticles((prevArticles) => [...prevArticles, ...data.articles])
            setMoreArticlesExist(data.moreArticlesExist)
        } catch (error) {
            console.error("Error fetching articles:", error)
        }
    }

    useEffect(() => {
        fetchArticles(page)
    }, [page])

    useEffect(() => {
        const tag = searchParams.get("tag")
        console.log(tag)
    }, [searchParams])

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 2 &&
                moreArticlesExist
            ) {
                setPage((prevPage) => prevPage + 1)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [moreArticlesExist])

    const firstArticleSet = articles.slice(0, 4)
    const highlightArticle = articles[4]
    const secondArticleSet = articles.slice(5, 8)

    return (
        <>
            <TagRibbion isLoggedin={isLoggedin} />
            <div className="flex-col py-4">
                {firstArticleSet.length > 0 && (
                    <div className="wrapper flex flex-col gap-3 py-8">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {firstArticleSet.map((article, index) => (
                                <ArticleCard article={article} key={index} />
                            ))}
                        </div>
                    </div>
                )}
                {highlightArticle && (
                    <div className="flex flex-col gap-2 py-6">
                        <div className="grid grid-cols-1 divide-x ">
                            <Highlight article={highlightArticle} key={4} />
                        </div>
                    </div>
                )}
                {secondArticleSet.length > 0 && (
                    <div className="wrapper flex flex-col gap-3 py-6">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
                            {secondArticleSet.map((article, index) => (
                                <ArticleCard key={index} article={article} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
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
                                href="https://giphy.com/gifs/reactionseditor-reaction-26u4lOMA8JKSnL9Uk"
                                target="_blank"
                                rel="noreferrer">
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
