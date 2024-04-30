import { Link } from "react-router-dom"

import ArticlesTable from "@/components/Dashboard/ArticlesTable"

const articles = [
    {
        id: 1,
        img: "https://source.unsplash.com/random",
        title: "Lorem Ipsum is simply dummy text",
        authorId: "alwin",
        date: "20 Aug, 2023",
        status: "Published",
        visibility: "Public",
        views: 100,
    },
]

function DashboardHome() {
    return (
        <div className="flex flex-col gap-6 p-8">
            <div className="flex flex-col gap-7 lg:flex-row">
                <div className="flex flex-col gap-4 sm:gap-3 lg:w-3/5">
                    <h1 className="text-2xl font-semibold">Create</h1>
                    <div className="flex flex-col gap-4 rounded border px-6 py-6 font-normal sm:flex-row sm:items-center sm:px-8">
                        <Link
                            to="new-article"
                            state={{ fromDashboard: true }}
                            className="flex w-fit items-center gap-2 rounded-full bg-rose-500 py-1.5 pl-2 pr-3 font-medium leading-5 text-white">
                            <img src="/assets/icons/add-circle.svg" alt="" /> New article
                        </Link>
                        <p className="text-sm text-gray-600">Draft new article now in editor</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 rounded-sm lg:w-2/5">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-semibold">Creator analytics</h1>
                        <Link
                            className="h-fit rounded-full border bg-gray-50 px-3 py-0.5 text-sm font-medium text-black"
                            to="analytics">
                            View analytics
                        </Link>
                    </div>
                    <div className="cols grid auto-rows-auto grid-cols-3 gap-1 rounded border p-5 font-normal text-gray-700">
                        <span className="col-span-2">Followers</span>
                        <span className="text-center font-medium text-black">100</span>

                        <span className="col-span-2">Subscribers</span>
                        <span className="text-center font-medium text-black">30</span>

                        <span className="col-span-2">Views in last 1 month</span>
                        <span className="text-center font-medium text-black">482</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:gap-4 lg:w-fit">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold">Recent articles activity</h1>
                    <Link
                        className="h-fit rounded-full border bg-gray-50 px-3 py-1 text-center text-sm font-medium leading-none text-black"
                        to="articles">
                        View all Articles
                    </Link>
                </div>
                <ArticlesTable articles={articles} />
            </div>
        </div>
    )
}

export default DashboardHome
