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

function DashboardArticles() {
    return (
        <div className="wrapper">
            <div className="flex flex-col gap-5">
                <h1 className="text-2xl font-semibold">Articles activity</h1>
                <ArticlesTable articles={articles} />
                <div className="ml-auto flex flex-col items-center gap-4 text-sm sm:flex-row">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-700">Rows per page:</span>
                            <select className="rounded border px-2 py-1">
                                <option>10</option>
                                <option>20</option>
                                <option>50</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-700">Page of</span>
                            <span className="font-medium">1 of 10</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-1 rounded border py-1 pl-2 pr-3 font-medium hover:bg-gray-50">
                            <img src="/assets/icons/arrow-left.svg" alt="" />
                            Previous Page
                        </button>
                        <button className="flex items-center gap-1 rounded border py-1 pl-4 pr-1 font-medium hover:bg-gray-50">
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
