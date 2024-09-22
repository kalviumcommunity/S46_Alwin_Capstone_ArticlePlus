import React, { useCallback, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import { randomGradient } from "@/helpers/ui/randomGradient"
import axiosInstance from "@/axios"

import ArticleList from "@/components/ArticleList"

import Loader from "@/ui/Loader"

function AuthorFromCreator() {
    const { id, author: authorId } = useParams()

    const [loading, setLoading] = useState(true)
    const [author, setAuthor] = useState(null)
    const [organization, setOrganization] = useState(null)
    const [articles, setArticles] = useState([])

    const fetchAuthorWithArticles = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get(`/creator/profile/${id}/${authorId}`)
            console.log(data)
            setAuthor(data.creator)
            setOrganization(data.organization)
            setArticles(data.articles)
        } catch (error) {
            console.error("Error fetching author profile:", error)
            alert("Failed to load author profile. Please refresh the page.")
        } finally {
            setLoading(false)
        }
    }, [id, authorId])

    useEffect(() => {
        fetchAuthorWithArticles()
    }, [])

    if (loading) return <Loader />

    return (
        <div>
            <div className="w-full justify-end pt-16" style={{ background: randomGradient() }}>
                <div className="flex flex-col gap-4 bg-gradient-to-t from-white from-40% to-transparent">
                    {author && (
                        <>
                            <div className="relative mx-4 flex w-fit flex-col sm:mx-8 lg:mx-16">
                                <img
                                    className="h-20 w-fit rounded-full shadow"
                                    src={
                                        author.displayPicture ||
                                        `https://api.dicebear.com/7.x/initials/svg?seed=${author.name}`
                                    }
                                    alt={`${author.name}'s profile`}
                                />
                            </div>
                            <div className="flex flex-col gap-6 px-4 pb-8 sm:flex-row sm:px-8 lg:gap-10 lg:px-16">
                                <div className="flex w-max flex-col gap-0.5">
                                    <div className="flex items-center gap-2">
                                        <h1 className="w-max text-2xl font-bold">
                                            {author.name}
                                        </h1>
                                        {author.verified && (
                                            <img
                                                className="h-5 w-5"
                                                src="/assets/icons/verified.svg"
                                                alt="Verified"
                                            />
                                        )}
                                    </div>
                                    <p>
                                        <span className="font-medium">
                                            {author.articles.total}
                                        </span>{" "}
                                        articles
                                    </p>
                                </div>
                                <div className="relative flex flex-col justify-end gap-3 sm:mt-0">
                                    <span className="-top-9 -mb-1 flex h-fit w-fit items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-0.5 text-sm font-medium text-black backdrop-blur sm:absolute">
                                        <img
                                            src={`/assets/icons/organization.svg`}
                                            alt="organization"
                                            className="h-4 w-4"
                                        />
                                        Author for organization
                                    </span>
                                    <span className="mt-1 lg:w-2/3">
                                        {organization.description}
                                    </span>
                                    <hr className="my-1.5" />
                                    <div className="mt- 2 flex  h-fit w-fit items-center gap-3">
                                        <span className="text-base font-medium">
                                            Organization
                                        </span>
                                        <Link
                                            className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-1 py-1 pr-4 font-medium leading-4 text-black backdrop-blur"
                                            to={`/creator/${organization.id}`}>
                                            <img
                                                src={organization.displayPicture}
                                                alt=""
                                                className="h-8 w-8 rounded-full"
                                            />
                                            <span>{organization.name}</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="pb-20 pt-2 sm:px-8 lg:px-16">
                <hr />
                <div className="flex flex-col gap-8 px-4 pt-8 lg:w-2/3">
                    {articles?.map((article) => (
                        <ArticleList article={article} key={article.slug} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AuthorFromCreator
