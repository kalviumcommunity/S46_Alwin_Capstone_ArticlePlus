import { Link } from "react-router-dom"

function DashboardHome() {
    return (
        <div className="wrapper flex-col gap-6 py-6 lg:flex-row">
            <div className="flex flex-col gap-3 lg:w-2/3">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold">Recent articles activity</h1>
                    <Link
                        to="articles"
                        className="h-fit rounded-full border bg-gray-100 px-3 py-0.5 text-sm font-medium text-black">
                        View all Articles
                    </Link>
                </div>
                <div className="flex flex-col divide-y overflow-hidden rounded-sm">
                    <div className="flex gap-2 bg-black font-medium text-white">
                        <span className="w-3/5 px-4 py-2">Article</span>
                        <span className="flex-1 px-4 py-2">Reads</span>
                        <span className="flex-1 px-4 py-2">Impressions</span>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 hover:cursor-pointer hover:bg-gray-100">
                        <div className="flex w-3/5 items-center justify-start gap-2 px-4 py-3">
                            <img
                                className="h-10 w-20 object-cover"
                                src="https://source.unsplash.com/random"
                                alt=""
                            />
                            <span>Lorem Ipsum is simply dummy text ...</span>
                        </div>
                        <span className="flex-1 px-4 py-3">234</span>
                        <span className="flex-1 px-4 py-3">810</span>
                    </div>
                </div>
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
                <div className="cols grid auto-rows-auto grid-cols-3 gap-1 rounded-sm border-2 p-5 font-normal text-gray-700">
                    <span className="col-span-2 font-medium">Followers</span>
                    <span className="text-center font-semibold text-black">100</span>

                    <span className="col-span-2 font-medium">Subscribers</span>
                    <span className="text-center font-semibold text-black">30</span>

                    <span className="col-span-2 font-medium">Views in last 1 month</span>
                    <span className="text-center font-semibold text-black">482</span>
                </div>
            </div>
        </div>
    )
}

export default DashboardHome
