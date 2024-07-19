import { Link } from "react-router-dom"

import Loader from "../../ui/Loader"

function ArticlesTable({ articles, loading, isDashboard = false }) {
    return (
        <div className="flex w-full flex-col divide-y overflow-x-scroll rounded border text-sm">
            {/* Table Header */}
            <div className="flex w-fit gap-2 font-medium text-gray-900">
                <span className="w-48 flex-shrink-0 px-4 py-2 md:w-96">Article</span>
                <span className="w-32 flex-shrink-0 px-4 py-2">Author</span>
                <span className="w-32 flex-shrink-0 px-4 py-2">Status</span>
                <span className="w-32 flex-shrink-0 px-4 py-2">Access for</span>
                <span className="w-40 flex-shrink-0 px-4 py-2">Date</span>
            </div>

            {loading && (
                <div className="relative h-52 w-full overflow-hidden">
                    <div className="absolute right-0 top-0 z-50 flex h-full w-full items-center justify-center bg-white/80 backdrop-blur-[2px]">
                        <Loader />
                    </div>
                </div>
            )}

            {!loading && articles.length === 0 && (
                <div className="flex w-full flex-col items-center justify-center gap-2.5 px-4 py-24 sm:px-0">
                    <span className="text-base font-medium leading-5">
                        You haven't created any articles yet
                    </span>
                    {!isDashboard && (
                        <div className="flex w-fit items-center gap-2 rounded-full border bg-white px-1 py-1 pr-5 font-medium leading-5 text-gray-800">
                            <Link
                                to="/dashboard"
                                className="flex h-fit w-fit items-center gap-2 rounded-full bg-rose-500 px-4 py-1.5 font-medium leading-5 text-white">
                                Go to dashboard
                            </Link>
                            <span className="font-medium">to create your first article</span>
                        </div>
                    )}
                </div>
            )}

            {/* Articles List */}
            {articles?.map((article, index) => (
                <Link
                    to={`/dashboard/article/${article?._id}`}
                    className="flex w-fit items-center gap-2 hover:cursor-pointer hover:bg-gray-50"
                    key={index}>
                    {/* Article Title and Image */}
                    <div className="flex w-48 flex-shrink-0 items-center justify-start gap-2 px-4 py-3 md:w-96">
                        <img
                            className="h-10 w-20 object-cover"
                            src={article?.image?.url}
                            alt=""
                        />
                        <span className="line-clamp-2">{article?.title}</span>
                    </div>

                    {/* Author Link */}
                    <Link
                        className="line-clamp-1 w-32 flex-shrink-0 px-4 leading-4 hover:underline"
                        to={`/dashboard/team/${article?.author?.id}`}>
                        @{article?.author?.id}
                    </Link>

                    {/* Article Status */}
                    <div className="w-32 flex-shrink-0 px-4 py-2">
                        {article?.flags?.status === "draft" && (
                            <span className="w-fit rounded-sm border border-red-200 bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                Draft
                            </span>
                        )}
                        {article?.flags?.status === "published" && (
                            <span className="w-fit rounded-sm border border-green-200 bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                Published
                            </span>
                        )}
                    </div>

                    {/* Article Access */}
                    <div className="w-32 flex-shrink-0 px-4 py-2">
                        <span className="h-fit w-fit rounded border bg-white px-3 py-0.5 capitalize">
                            {article?.flags?.access}
                        </span>
                    </div>

                    <span className="w-40 flex-shrink-0 px-4 py-2">
                        {article?.datePublished}
                    </span>
                </Link>
            ))}
        </div>
    )
}

export default ArticlesTable
