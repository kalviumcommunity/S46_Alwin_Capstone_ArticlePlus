import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import axiosInstance from "@/axios"

import ArticlesTable from "@/components/Dashboard/ArticlesTable"

function RecentArticlesActivity() {
    const [isLoading, setIsLoading] = useState(true)
    const [articles, setArticles] = useState([])

    const fetchArticles = async () => {
        try {
            const response = await axiosInstance.post("creator/articles", { recent: true })
            setArticles(response.data.articles)
            setIsLoading(false)
        } catch (error) {
            console.error("Error fetching articles:", error)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchArticles()
    }, [])

    return (
        <div className="flex flex-col sm:gap-4 lg:w-fit">
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">Recent articles activity</h1>
                <Link
                    className="h-fit rounded-full border bg-gray-50 px-3 py-1 text-center text-sm font-medium leading-none text-black"
                    to="articles">
                    View all Articles
                </Link>
            </div>
            <ArticlesTable articles={articles} loading={isLoading} isDashboard={true} />
        </div>
    )
}

export default RecentArticlesActivity
