import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import { convertCategoryFormat } from "@/utils/ui/convertCategoryFormat"

import Loader from "@/components/Loader"

import { articles } from "@/data/articles"

function Article() {
    const { slug } = useParams()

    const [article, setArticle] = useState()

    useEffect(() => {
        window.scrollTo(0, 0)
        setArticle(articles.find((article) => article.slug === slug))
    }, [slug])

    if (article && article.display === "header") {
        return (
            <div className="flex flex-col">
                <div
                    className={`flex flex-col items-center justify-center gap-10 py-8 px-4 border-b sm:gap-10 md:px-16 lg:px-32 md:flex-row ${article.header === "reverse" ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    <div className="flex flex-col text-center">
                        <Link
                            to={`/?tag=${article.category}`}
                            className="hover:underline text-rose-500 uppercase font-serif mb-2">
                            {convertCategoryFormat(article.category)}
                        </Link>
                        <h1 className="text-4xl font-semibold mb-4 font-serif">
                            {article.title}
                        </h1>
                        <p className="text-base text-gray-800 mb-4 italic">
                            {article.subtitle}
                        </p>
                        <div className="flex flex-col items-center">
                            {article.author.type === "individual" ? (
                                <Link
                                    to={`/creator/${article.author.id}`}
                                    className="text-gray-800 text-sm font-semibold hover:underline">
                                    {article.author.name}
                                </Link>
                            ) : (
                                <div className="flex items-center gap-1.5 ">
                                    <Link
                                        to={`/organization/${article.author.organization.id}`}
                                        className="text-sm font-semibold leading-4 hover:underline">
                                        {article.author.organization.name}
                                    </Link>
                                    <span>•</span>
                                    <Link
                                        className="text-sm font-semibold leading-4 hover:underline"
                                        to={`/organization/${article.author.organization.id}/${article.author.id}`}>
                                        <span>{article.author.name}</span>
                                    </Link>
                                </div>
                            )}
                            <p className="text-gray-500 text-sm mt-0.5 font-normal">
                                {article.timestamp}
                            </p>
                        </div>
                    </div>
                    <img
                        className="w-full rounded-sm md:w-1/3"
                        src={article.image.url}
                        alt={article.image.caption}
                        loading="lazy"
                    />
                </div>

                <div className="px-4 space-x-2 pt-3 text-sm md:px-16 lg:px-32">
                    <span>{article.image.caption}</span>
                    <span className="text-gray-500">{article.image.credit}</span>
                </div>

                <div className="flex flex-col max-w-xl m-auto pt-12 px-5">
                    {article.content.map((block, index) => (
                        <div key={index} className="mb-6">
                            {block.type === "text" && (
                                <p className="text-black leading-relaxed font-serif text-lg">
                                    {block.text}
                                </p>
                            )}
                            {block.type === "img" && (
                                <div className="space-y-2">
                                    <img
                                        className="h-full"
                                        src={block.url}
                                        alt={block.caption}
                                        loading="lazy"
                                    />
                                    <div className="space-x-2 leading-5 text-sm">
                                        <span>{block.caption}</span>
                                        <span className="text-gray-500">{block.credit}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (article && article.display === "square") {
        return (
            <div className="flex flex-col">
                <div className="grid grid-cols-2 h-2/3 items-center justify-center border-b">
                    <div className="flex flex-1 flex-col text-center px-16">
                        <Link
                            to={`/?tag=${article.category}`}
                            className="hover:underline text-rose-500 uppercase font-serif mb-2">
                            {convertCategoryFormat(article.category)}
                        </Link>
                        <h1 className="text-4xl font-semibold mb-4 font-serif">
                            {article.title}
                        </h1>
                        <p className="text-base text-gray-800 mb-4 italic">
                            {article.subtitle}
                        </p>
                        <div className="flex flex-col items-center">
                            {article.author.type === "individual" ? (
                                <Link
                                    to={`/creator/${article.author.id}`}
                                    className="text-gray-800 text-sm font-semibold hover:underline">
                                    {article.author.name}
                                </Link>
                            ) : (
                                <div className="flex items-center gap-1.5 ">
                                    <Link
                                        to={`/organization/${article.author.organization.id}`}
                                        className="text-sm font-semibold leading-4 hover:underline">
                                        {article.author.organization.name}
                                    </Link>
                                    <span>•</span>
                                    <Link
                                        className="text-sm font-semibold leading-4 hover:underline"
                                        to={`/organization/${article.author.organization.id}/${article.author.id}`}>
                                        <span>{article.author.name}</span>
                                    </Link>
                                </div>
                            )}
                            <p className="text-gray-500 text-sm mt-0.5 font-normal">
                                {article.timestamp}
                            </p>
                        </div>
                    </div>
                    <div className="h-[80vh] rounded-sm overflow-hidden flex items-center justify-center">
                        <img
                            className="w-full object-cover h-full"
                            src={article.image.url}
                            alt={article.image.caption}
                            loading="lazy"
                        />
                    </div>
                </div>

                <div className="px-4 space-x-2 pt-3 text-sm md:px-16 lg:px-32">
                    <span>{article.image.caption}</span>
                    <span className="text-gray-500">{article.image.credit}</span>
                </div>

                <div className="flex flex-col max-w-xl m-auto pt-12 px-5">
                    {article.content.map((block, index) => (
                        <div key={index} className="mb-6">
                            {block.type === "text" && (
                                <p className="text-black leading-relaxed font-serif text-lg">
                                    {block.text}
                                </p>
                            )}
                            {block.type === "img" && (
                                <div className="space-y-2">
                                    <img
                                        className="h-full"
                                        src={block.url}
                                        alt={block.caption}
                                        loading="lazy"
                                    />
                                    <div className="space-x-2 leading-5 text-sm">
                                        <span>{block.caption}</span>
                                        <span className="text-gray-500">{block.credit}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div>
            <Loader />
        </div>
    )
}

export default Article
