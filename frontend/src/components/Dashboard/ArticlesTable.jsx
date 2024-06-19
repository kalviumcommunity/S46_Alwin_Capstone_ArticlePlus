import { Link } from "react-router-dom"

function ArticlesTable({ articles }) {
    return (
        <div className="flex w-full flex-col divide-y overflow-x-scroll rounded border text-sm">
            <div className="flex w-fit gap-2 font-medium text-gray-900">
                <span className="w-48 flex-shrink-0 px-4 py-2 md:w-96">Article</span>
                <span className="w-32 flex-shrink-0 px-4 py-2">Author</span>
                <span className="w-32 flex-shrink-0 px-4 py-2">Status</span>
                <span className="w-32 flex-shrink-0 px-4 py-2">Visibility</span>
                <span className="w-32 flex-shrink-0 px-4 py-2">Date</span>
            </div>
            {articles.map((article, index) => (
                <div
                    className="flex w-fit items-center gap-2 hover:cursor-pointer hover:bg-gray-50"
                    key={index}>
                    <div className="flex w-48 flex-shrink-0 items-center justify-start gap-2 px-4 py-3 md:w-96">
                        <img className="h-10 w-20 object-cover" src={article.img} alt="" />
                        <span className="line-clamp-2">{article.title}</span>
                    </div>
                    <Link
                        className="line-clamp-1 w-32 flex-shrink-0 px-4 leading-4 hover:cursor-pointer hover:underline"
                        to="/dashboard/team/alwin">
                        @{article.authorId}
                    </Link>
                    <div className="w-32 flex-shrink-0 px-4 py-2">
                        <span className="h-fit w-fit rounded border border-green-200 bg-green-100 px-3 py-0.5 font-medium text-green-600">
                            {article.status}
                        </span>
                    </div>
                    <div className="w-32 flex-shrink-0 px-4 py-2">
                        <span className="h-fit w-fit rounded border bg-white px-3 py-0.5">
                            {article.visibility}
                        </span>
                    </div>
                    <span className="w-32 flex-shrink-0 px-4 py-2">{article.date}</span>
                </div>
            ))}
        </div>
    )
}

export default ArticlesTable
