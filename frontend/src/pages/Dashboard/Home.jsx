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
        <div className="wrapper flex-col gap-6 py-6 lg:flex-row">
            <div className="flex flex-col gap-6 sm:gap-4 lg:w-2/3">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold">Recent articles activity</h1>
                    <Link
                        to="articles"
                        className="h-fit rounded-full border bg-gray-100 px-3 py-1 text-center text-sm font-medium leading-none text-black">
                        View all Articles
                    </Link>
                </div>
                <ArticlesTable articles={articles} />
            </div>
            <div className="flex flex-col gap-3 rounded-sm lg:w-1/3">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold">Creator analytics</h1>
                    <Link
                        to="analytics"
                        className="h-fit rounded-full border bg-gray-100 px-3 py-0.5 text-sm font-medium text-black">
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
    )
}

export default DashboardHome
