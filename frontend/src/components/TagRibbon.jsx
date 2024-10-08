import React from "react"
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import clsx from "clsx"

import { convertCategoryFormat } from "@/helpers/ui/convertCategoryFormat"

function TagRibbon({ isLoggedIn }) {
    const location = useLocation()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const currentCategory = searchParams.get("category")

    const isForYouPage = location.pathname.includes("/foryou")

    const categories = [
        "technology",
        "health",
        "business-and-finance",
        "science",
        "politics",
        "arts-and-culture",
        "travel",
        "environment",
        "education",
        "sports",
    ]

    const handleRemoveCategory = () => {
        navigate(`/`)
    }

    return (
        <div
            className={clsx(
                "sticky z-50 flex justify-start overflow-x-scroll border bg-white text-sm font-medium sm:overflow-auto",
                {
                    "!overflow-hidden border-t py-2.5 sm:border-0 sm:p-0": isForYouPage,
                    "border-y px-4 py-2.5 sm:px-8 sm:py-3 lg:px-16": !isForYouPage,
                    "top-14": isLoggedIn,
                    "top-12": !isLoggedIn,
                },
            )}>
            {isLoggedIn && (
                <div
                    className={clsx(
                        "left-1/2 top-4 z-10 m-auto flex w-auto items-center justify-center gap-2 sm:fixed sm:flex sm:w-1/2 sm:-translate-x-1/2 sm:transform",
                        { "mr-3": !isForYouPage },
                    )}>
                    <Link
                        to="/"
                        className={clsx(
                            "flex items-center gap-1.5 rounded-full border px-4 hover:cursor-pointer hover:bg-gray-50",
                            {
                                "border-rose-200 bg-rose-50 text-rose-500":
                                    location.pathname === "/",
                            },
                        )}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4">
                            <path d="m10.065 12.493-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.15a1.07 1.07 0 0 1 .691-1.265l13.504-4.44" />
                            <path d="m13.56 11.747 4.332-.924" />
                            <path d="m16 21-3.105-6.21" />
                            <path d="M16.485 5.94a2 2 0 0 1 1.455-2.425l1.09-.272a1 1 0 0 1 1.212.727l1.515 6.06a1 1 0 0 1-.727 1.213l-1.09.272a2 2 0 0 1-2.425-1.455z" />
                            <path d="m6.158 8.633 1.114 4.456" />
                            <path d="m8 21 3.105-6.21" />
                            <circle cx="12" cy="13" r="2" />
                        </svg>
                        <span className="pt-[0.1rem] text-base font-semibold">Explore</span>
                    </Link>
                    <Link
                        to="/foryou"
                        className={clsx(
                            "flex items-center gap-1.5 rounded-full border px-4 hover:cursor-pointer hover:bg-gray-50",
                            {
                                "border-rose-200 bg-rose-50 text-rose-500": isForYouPage,
                            },
                        )}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 scale-x-[-1]">
                            <path d="M4 11a9 9 0 0 1 9 9" />
                            <path d="M4 4a16 16 0 0 1 16 16" />
                            <circle cx="5" cy="19" r="1" />
                        </svg>
                        <span className="whitespace-nowrap pt-[0.1rem] text-base font-semibold">
                            For you
                        </span>
                    </Link>
                </div>
            )}
            {!isForYouPage && (
                <div className="flex items-center justify-center border-l pl-3 sm:ml-0 sm:border-0 sm:pl-0">
                    {currentCategory && (
                        <button
                            className="flex items-center justify-center gap-2 rounded-full border border-rose-200 bg-red-500 py-0.5 pl-3 pr-2.5 text-xs font-medium text-red-50 sm:mr-2"
                            onClick={handleRemoveCategory}>
                            Remove
                        </button>
                    )}
                    {categories.map((category) => (
                        <Link
                            key={category}
                            className={clsx("tag", {
                                "text-rose-600 underline decoration-wavy":
                                    location.search === `?category=${category}`,
                            })}
                            to={`/?category=${category}`}>
                            {convertCategoryFormat(category)}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default TagRibbon
