import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { randomGradient } from "@/utils/ui/randomGradient"

function Highlight({ article }) {
    const [gradient, setGradient] = useState("")

    useEffect(() => {
        randomGradient(setGradient)
    }, [])

    return (
        <Link to={`/${article.slug}`} className="flex" style={{ background: gradient }}>
            <div className="group hover:cursor-pointer flex flex-col sm:flex-row gap-4 px-4 bg-gradient-to-t from-white to-transparent pt-20 pb-10">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-4">
                        <span className="font-serif text-3xl font-medium group-hover:underline group-hover:underline-offset-4 sm:text-2xl lg:text-3xl">
                            {article.title}
                        </span>
                        <span className="font-serif line-clamp-4 text-base font-normal text-gray-700">
                            {article.subtitle}
                        </span>
                    </div>
                    {article.author.type === "individual" ? (
                        <>
                            <span className="text-base font-semibold leading-4">
                                {article.author.name}
                            </span>
                            <span className="text-base leading-4 text-gray-500">
                                {article.views} views
                            </span>
                        </>
                    ) : (
                        <div className="flex items-center gap-1.5 ">
                            <Link
                                to={`/organisation/${article.author.organisation.id}`}
                                className="text-sm font-semibold leading-4 hover:underline">
                                {article.author.organisation.name}
                            </Link>
                            <span>•</span>
                            <Link
                                className="text-sm font-semibold leading-4 hover:underline"
                                to={`/organisation/${article.author.organisation.id}/${article.author.id}`}>
                                <span>{article.author.name}</span>
                            </Link>
                        </div>
                    )}
                </div>
                <img
                    className="aspect-[4/3] rounded-sm object-cover w-2/3 sm:w-1/2"
                    src={article.image.url}
                    alt={article.image.caption}
                    loading="lazy"
                />
            </div>
        </Link>
    )
}

export default Highlight
