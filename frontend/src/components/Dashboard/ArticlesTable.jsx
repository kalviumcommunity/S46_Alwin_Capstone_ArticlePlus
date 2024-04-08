import { Link } from "react-router-dom"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

function ArticlesTable({ articles }) {
    return (
        <div className="flex w-full flex-col divide-y overflow-x-scroll rounded border text-sm">
            <div className="flex w-fit gap-2 font-medium text-gray-900">
                <span className="w-48 flex-shrink-0 px-4 py-2 md:w-96">Article</span>
                <span className="w-32 flex-shrink-0 px-4 py-2">Author</span>
                <span className="w-32 flex-shrink-0 px-4 py-2">Status</span>
                <span className="w-32 flex-shrink-0 px-4 py-2">Visibility</span>
                <span className="w-32 flex-shrink-0 px-4 py-2">Date</span>
                <span className="w-32 flex-shrink-0 px-4 py-2">Views</span>
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
                        <span className="h-fit w-fit rounded border border-green-200 bg-green-100 px-3 font-medium text-green-600">
                            {article.status}
                        </span>
                    </div>
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <div className="flex w-32 flex-shrink-0">
                                <button className="flex items-center gap-1 rounded border bg-white py-1 pl-4 pr-2">
                                    <span>{article.visibility}</span>
                                    <img
                                        className="h-4 w-4"
                                        src="/assets/icons/arrow-down.svg"
                                        alt=""
                                    />
                                </button>
                            </div>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                className="w-32 rounded-md border-2 bg-white p-1 text-sm"
                                sideOffset={5}>
                                <DropdownMenu.Item className="flex gap-2 rounded-sm px-2 py-1 hover:cursor-pointer hover:bg-gray-100">
                                    Public
                                </DropdownMenu.Item>
                                <DropdownMenu.Item className="flex gap-2 rounded-sm px-2 py-1 hover:cursor-pointer hover:bg-gray-100">
                                    Unlisted
                                </DropdownMenu.Item>
                                <DropdownMenu.Item className="flex gap-2 rounded-sm px-2 py-1 hover:cursor-pointer hover:bg-gray-100">
                                    Review
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                    <span className="w-32 flex-shrink-0 px-4 py-2">{article.date}</span>
                    <span className="w-32 flex-shrink-0 px-4 py-2">{article.views}</span>
                </div>
            ))}
        </div>
    )
}

export default ArticlesTable
