import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import clsx from "clsx"

import { convertCategoryFormat } from "@/helpers/ui/convertCategoryFormat"
import axiosInstance from "@/axios"

import { ArticleCard } from "@/components/ArticleCard"

import Loader from "@/ui/Loader"

function Article() {
    const { slug } = useParams()

    const [article, setArticle] = useState(null)
    const [articlePreview, setArticlePreview] = useState(null)
    const [errorMessage, setErrorMessage] = useState("")
    const [suggestedArticles, setSuggestedArticles] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchSuggestedArticles = async (slug, category) => {
        try {
            const response = await axiosInstance.get(
                `articles/suggested/similar?slug=${slug}&category=${category}`,
            )
            setSuggestedArticles(response.data.suggestedArticles)
        } catch (error) {
            console.error("Error fetching suggested articles:", error)
        }
    }

    useEffect(() => {
        const fetchArticle = () => {
            setIsLoading(true)
            axiosInstance
                .get(`/article/${slug}`)
                .then((response) => {
                    const { articlePreview, article, message, category } = response.data

                    if (articlePreview) {
                        setArticlePreview(articlePreview)
                        setErrorMessage(message)
                    } else {
                        setArticle(article)
                    }

                    return fetchSuggestedArticles(article.slug, category || "technology")
                })
                .catch(handleError)
                .finally(() => setIsLoading(false))
        }

        window.scrollTo(0, 0)
        fetchArticle()
    }, [slug])

    const handleError = (error) => {
        const { response } = error
        if (response) {
            if (response.status === 404) {
                setErrorMessage("Article not found")
            } else if (response.status === 403) {
                const { articlePreview, message } = response.data
                setArticlePreview(articlePreview)
                setErrorMessage(message)
            } else {
                setErrorMessage("An error occurred while fetching the article")
            }
        } else {
            setErrorMessage("An error occurred while fetching the article")
        }
        console.error("Error fetching article:", error)
    }

    if (isLoading) {
        return (
            <div className="font-body relative mb-10 flex w-full flex-col items-center">
                <Loader />
            </div>
        )
    }

    if (errorMessage) {
        return (
            <div className="font-body relative my-32 mb-40 flex h-full w-full flex-col items-center">
                <h1>{errorMessage}</h1>
                {articlePreview && (
                    <div>
                        <h2>{articlePreview.title}</h2>
                        <p>{articlePreview.subtitle}</p>
                        <p>{articlePreview.datePublished}</p>
                        <img src={articlePreview.image} alt={articlePreview.title} />
                    </div>
                )}
            </div>
        )
    }

    if (article) {
        return (
            <div className="flex flex-col">
                {article.display === "header" ? (
                    <div
                        className={clsx(
                            "flex flex-col items-center justify-center gap-10 border-b px-4 py-8 sm:gap-10 md:flex-row md:px-16 lg:px-32",
                            article.flow === "reverse" ? "md:flex-row" : "md:flex-row-reverse",
                        )}>
                        <div className="flex max-w-[90vw] flex-auto flex-col text-center sm:max-w-lg">
                            <Link
                                className="mb-2 font-serif uppercase text-rose-500 hover:underline"
                                to={`/?category=${article.category}`}>
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
                                <p className="mt-0.5 text-sm font-normal text-gray-500">
                                    {article.datePublished}
                                </p>
                            </div>
                        </div>
                        <img
                            className="w-full flex-1 md:w-1/3"
                            src={article.image?.url}
                            alt={article?.title}
                            loading="lazy"
                        />
                    </div>
                ) : (
                    <div className="mt-6 grid items-center justify-center gap-10 overflow-clip border-b sm:mt-0 sm:h-[28rem] sm:grid-cols-2 sm:gap-0">
                        <div
                            className={clsx(
                                "m-auto flex max-w-[90vw] flex-1 flex-col text-center sm:px-16",
                                article.flow === "reverse" && "order-1",
                            )}>
                            <Link
                                className="mb-2 font-serif uppercase text-rose-500 hover:underline"
                                to={`/?category=${article.category}`}>
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
                                <p className="mt-0.5 text-sm font-normal text-gray-500">
                                    {article.datePublished}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center overflow-hidden">
                            <img
                                className="h-full w-full object-cover"
                                src={article.image?.url}
                                alt={article?.title}
                                loading="lazy"
                            />
                        </div>
                    </div>
                )}
                <div className="m-auto flex w-full max-w-xl flex-col px-5 pb-10 pt-12">
                    {article.content.map((block, index) => (
                        <div key={index} className="relative mb-6">
                            {block.type === "paragraph" && (
                                <p className="font-serif text-lg leading-relaxed text-black">
                                    {block.text}
                                </p>
                            )}
                            {block.type === "image" && (
                                <div className="space-y-2">
                                    <img
                                        className="h-full"
                                        src={block.url}
                                        alt={block?.caption}
                                        loading="lazy"
                                    />
                                    <div className="flex flex-col gap-1 leading-5">
                                        {block?.caption && (
                                            <span className="text-base">{block.caption}</span>
                                        )}
                                        {block?.credits && (
                                            <span className="text-sm text-gray-500">
                                                {block.credits}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                            {block.type === "quote" && (
                                <blockquote className="relative mb-5 mt-3 flex flex-col gap-2 px-4">
                                    <svg
                                        className="absolute -start-2 -top-4 size-14"
                                        width="14"
                                        height="14"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true">
                                        <path
                                            d="M7.39762 10.3C7.39762 11.0733 7.14888 11.7 6.6514 12.18C6.15392 12.6333 5.52552 12.86 4.76621 12.86C3.84979 12.86 3.09047 12.5533 2.48825 11.94C1.91222 11.3266 1.62421 10.4467 1.62421 9.29999C1.62421 8.07332 1.96459 6.87332 2.64535 5.69999C3.35231 4.49999 4.33418 3.55332 5.59098 2.85999L6.4943 4.25999C5.81354 4.73999 5.26369 5.27332 4.84476 5.85999C4.45201 6.44666 4.19017 7.12666 4.05926 7.89999C4.29491 7.79332 4.56983 7.73999 4.88403 7.73999C5.61716 7.73999 6.21938 7.97999 6.69067 8.45999C7.16197 8.93999 7.39762 9.55333 7.39762 10.3ZM14.6242 10.3C14.6242 11.0733 14.3755 11.7 13.878 12.18C13.3805 12.6333 12.7521 12.86 11.9928 12.86C11.0764 12.86 10.3171 12.5533 9.71484 11.94C9.13881 11.3266 8.85079 10.4467 8.85079 9.29999C8.85079 8.07332 9.19117 6.87332 9.87194 5.69999C10.5789 4.49999 11.5608 3.55332 12.8176 2.85999L13.7209 4.25999C13.0401 4.73999 12.4903 5.27332 12.0713 5.85999C11.6786 6.44666 11.4168 7.12666 11.2858 7.89999C11.5215 7.79332 11.7964 7.73999 12.1106 7.73999C12.8437 7.73999 13.446 7.97999 13.9173 8.45999C14.3886 8.93999 14.6242 9.55333 14.6242 10.3Z"
                                            fill="#eeeeee"></path>
                                    </svg>
                                    <div className="relative z-10 mt-2">
                                        <p className="text-xl font-normal italic text-gray-900">
                                            {block.content}
                                        </p>
                                    </div>
                                    <div className="relative">
                                        <p className="text-lg font-semibold">{block.ref}</p>
                                    </div>
                                </blockquote>
                            )}
                        </div>
                    ))}
                </div>

                {suggestedArticles.length > 0 && (
                    <>
                        <hr />
                        <div className="wrapper flex flex-col gap-5 pb-14 pt-10">
                            <h2 className="font-serif text-2xl font-semibold">
                                Suggested Articles
                            </h2>
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
                                {suggestedArticles.map((suggestedArticle, idx) => (
                                    <ArticleCard key={idx} article={suggestedArticle} />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        )
    }

    return (
        <div className="font-body relative mb-10 flex w-full flex-col items-center">
            <Loader />
        </div>
    )
}

export default Article
