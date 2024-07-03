import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import { convertCategoryFormat } from "@/helpers/ui/convertCategoryFormat"
import axiosInstance from "@/axios"

import Loader from "@/components/ui/Loader"

function Article({ data }) {
    const { slug } = useParams()

    const [article, setArticle] = useState()
    const [articleNotFound, setArticleNotFound] = useState(false)

    useEffect(() => {
        window.scrollTo(0, 0)
        axiosInstance
            .get(`/article/${slug}`)
            .then((response) => {
                setArticle(response.data)
            })
            .catch((error) => {
                setArticleNotFound(true)
                console.error("Error fetching article:", error)
            })
    }, [slug])

    if (article && article.display === "header") {
        return (
            <div className="flex flex-col">
                <div
                    className={`flex flex-col items-center justify-center gap-10 border-b px-4 py-8 sm:gap-10 md:flex-row md:px-16 lg:px-32 ${article.header === "reverse" ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    <div className="flex flex-col text-center">
                        <Link
                            className="mb-2 font-serif uppercase text-rose-500 hover:underline"
                            to={`/?tag=${article.category}`}>
                            {convertCategoryFormat(article.category)}
                        </Link>
                        <h1 className="mb-4 font-serif text-4xl font-semibold">
                            {article.title}
                        </h1>
                        <p className="mb-4 text-base italic text-gray-800">
                            {article.subtitle}
                        </p>
                        <div className="flex flex-col items-center">
                            {article.author.type === "individual" ? (
                                <Link
                                    to={`/creator/${article.author.id}`}
                                    className="text-sm font-semibold text-gray-800 hover:underline">
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
                            <p className="mt-0.5 text-sm font-normal text-gray-500">
                                {article.datestamp}
                            </p>
                        </div>
                    </div>
                    <img
                        className="w-full md:w-1/3"
                        src={article.image.url}
                        alt={article.title}
                        loading="lazy"
                    />
                </div>
                <div className="m-auto flex max-w-xl flex-col px-5 pt-12">
                    {article.content.map((block, index) => (
                        <div key={index} className="mb-6">
                            {block.type === "paragraph" && (
                                <p className="font-serif text-lg leading-relaxed text-black">
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
                                    <div className="space-x-2 text-sm leading-5">
                                        <span>{block.caption}</span>
                                        <span className="text-gray-500">{block?.credit}</span>
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
                <div className="grid h-2/3 grid-cols-2 items-center justify-center border-b">
                    <div className="flex flex-1 flex-col px-16 text-center">
                        <Link
                            to={`/?tag=${article.category}`}
                            className="mb-2 font-serif uppercase text-rose-500 hover:underline">
                            {convertCategoryFormat(article.category)}
                        </Link>
                        <h1 className="mb-4 font-serif text-4xl font-semibold">
                            {article.title}
                        </h1>
                        <p className="mb-4 text-base italic text-gray-800">
                            {article.subtitle}
                        </p>
                        <div className="flex flex-col items-center">
                            {article.author.type === "individual" ? (
                                <Link
                                    to={`/creator/${article.author.id}`}
                                    className="text-sm font-semibold text-gray-800 hover:underline">
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
                            <p className="mt-0.5 text-sm font-normal text-gray-500">
                                {article.datestamp}
                            </p>
                        </div>
                    </div>
                    <div className="flex h-[80vh] items-center justify-center overflow-hidden">
                        <img
                            className="h-full w-full object-cover"
                            src={article.image.url}
                            alt={article.title}
                            loading="lazy"
                        />
                    </div>
                </div>

                <div className="m-auto flex max-w-xl flex-col px-5 pt-12">
                    {article.content.map((block, index) => (
                        <div key={index} className="mb-6">
                            {block.type === "paragraph" && (
                                <p className="font-serif text-lg leading-relaxed text-black">
                                    {block.text}
                                </p>
                            )}
                            {block.type === "img" && (
                                <div className="space-y-2">
                                    <img
                                        className="h-full"
                                        src={block.url}
                                        alt={block?.caption}
                                        loading="lazy"
                                    />
                                    <div className="space-x-2 text-sm leading-5">
                                        <span>{block?.caption}</span>
                                        <span className="text-gray-500">{block?.credit}</span>
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
