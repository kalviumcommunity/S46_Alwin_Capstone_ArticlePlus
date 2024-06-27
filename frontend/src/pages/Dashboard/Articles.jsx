import { useEffect, useState } from "react"

import axiosInstance from "@/axios"

import ArticlesTable from "@/components/Dashboard/ArticlesTable"

function DashboardArticles() {
    const [isLoading, setIsLoading] = useState(true)
    const [articles, setArticles] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const fetchArticles = async (pageNumber) => {
        setIsLoading(true)
        try {
            const response = await axiosInstance.post("creator/articles", { page: pageNumber })
            setArticles(response.data.articles)
            setTotalPages(Math.ceil(response.data.total / 10))
        } catch (error) {
            console.error("Error fetching articles:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchArticles(page)
    }, [page])

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1)
        }
    }

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1)
        }
    }

    return (
        <div className="mb-8 flex flex-col gap-6">
            <h1 className="mt-8 border-b px-8 pb-5 text-2xl font-semibold">
                Articles activity
            </h1>
            <div className="mb-12 flex flex-col justify-end gap-4 px-6 sm:w-fit sm:px-8">
                <ArticlesTable articles={articles} loading={isLoading} />
                <div className="flex flex-col items-center gap-4 text-sm sm:flex-row sm:gap-5">
                    <div className="flex w-full gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-700">Rows per page:</span>
                            <div className="font-medium">10</div>
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                            <span className="text-gray-700">Page of</span>
                            <span className="font-medium">
                                {page} of {totalPages}
                            </span>
                        </div>
                    </div>
                    <div className="ml-auto flex min-w-fit gap-3">
                        <button
                            className={`flex w-fit items-center gap-1 rounded border py-1 pl-2 pr-3 font-medium hover:bg-gray-50 ${page === 1 ? "cursor-not-allowed opacity-50" : ""}`}
                            onClick={handlePreviousPage}
                            disabled={page === 1}>
                            <img src="/assets/icons/arrow-left.svg" alt="" />
                            Previous Page
                        </button>
                        <button
                            className={`flex w-fit items-center gap-1 rounded border py-1 pl-4 pr-1 font-medium hover:bg-gray-50 ${page === totalPages ? "cursor-not-allowed opacity-50" : ""}`}
                            onClick={handleNextPage}
                            disabled={page === totalPages}>
                            Next Page
                            <img src="/assets/icons/arrow-right.svg" alt="" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardArticles
