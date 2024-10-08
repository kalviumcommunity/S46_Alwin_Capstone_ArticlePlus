import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { randomGradient } from "@/helpers/ui/randomGradient"

function Highlight({ article }) {
    return (
        <Link
            to={`/article/${article.slug}`}
            className="flex"
            style={{ background: randomGradient() }}>
            <div className="group flex flex-col justify-between gap-8 border-b border-gray-50 bg-gradient-to-t from-white to-transparent px-4 pb-10 pt-16 hover:cursor-pointer sm:flex-row sm:gap-4">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-4">
                        <span className="font-serif text-3xl font-medium group-hover:underline group-hover:underline-offset-4 sm:text-2xl lg:text-3xl">
                            {article.title}
                        </span>
                        <span className="line-clamp-4 font-serif text-base font-normal text-gray-700">
                            {article.subtitle}
                        </span>
                    </div>
                    {article.author.type === "individual" ? (
                        <>
                            <Link
                                className="text-sm font-semibold leading-4 hover:underline"
                                to={`/creator/${article.author.id}`}>
                                <span>{article.author.name}</span>
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-1.5 ">
                            <Link
                                to={`/creator/${article.author.organization.id}`}
                                className="text-sm font-semibold leading-4 hover:underline">
                                {article.author.organization.name}
                            </Link>
                            <span>•</span>
                            <Link
                                className="text-sm font-semibold leading-4 hover:underline"
                                to={`/creator/${article.author.organization.id}/${article.author.id}`}>
                                <span>{article.author.name}</span>
                            </Link>
                        </div>
                    )}
                </div>
                <img
                    className="aspect-[4/3] w-2/3 object-cover sm:w-1/2"
                    src={article.image.url}
                    alt={article.image.caption}
                    loading="lazy"
                />
            </div>
        </Link>
    )
}

export default Highlight
