import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import * as Dialog from "@radix-ui/react-dialog"
import * as Tabs from "@radix-ui/react-tabs"

import { randomGradient } from "@/utils/ui/randomGradient"

import { ArticleList } from "@/components/ArticleList"
import ForSubscribers from "@/components/ForSubscribers"
import SubscribePortal from "@/components/SubscribePortal"

import { articles as allArticles } from "@/data/articles"
import { creators } from "@/data/creators"

function Creator() {
    const { creator: id, contributor } = useParams()

    const [gradient, setGradient] = useState("")
    const [creator, setCreator] = useState()
    const [articles, setArticles] = useState()
    const [isFollowing, setIsFollowing] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(false)

    useEffect(() => {
        randomGradient(setGradient)
        const creatorId = id || contributor
        setCreator(creators.find((creator) => creator.id === creatorId))
        setArticles(allArticles.filter((article) => article.author.id === creatorId))
    }, [id, contributor])

    const handleFollow = () => {
        setIsFollowing(!isFollowing)
    }

    const handleSubscribe = () => {
        setIsSubscribed(!isSubscribed)
    }

    if (creator && articles) {
        return (
            <div>
                <div className="w-full justify-end pt-16" style={{ background: gradient }}>
                    <div className="flex flex-col gap-4 bg-gradient-to-t from-white from-40% to-transparent">
                        <img
                            className="mx-4 h-20 w-fit rounded-full shadow sm:mx-8 lg:mx-16"
                            src={creator.image}
                            alt=""
                        />
                        <div className="flex flex-col gap-6 px-4 pb-6 sm:flex-row sm:px-8 lg:gap-8 lg:px-16">
                            <div className="flex">
                                <div className="flex  w-max flex-col">
                                    <div className="flex items-center gap-2">
                                        <h1 className="w-max text-2xl font-bold">
                                            {creator.name}
                                        </h1>
                                        {creator.verified && (
                                            <img
                                                className="h-5 w-5"
                                                src="/assets/icons/verified.svg"
                                                alt=""
                                            />
                                        )}
                                    </div>
                                    <span>{creator.followers} followers</span>
                                </div>
                            </div>
                            <div className="flex flex-col justify-end gap-3">
                                {creator.organization && (
                                    <span className="flex items-center gap-3 text-base font-medium">
                                        Organization
                                        <Link
                                            to={`/organization/${creator.organization.id}`}
                                            className="flex items-center gap-2 rounded-full border bg-white py-1 pl-1 pr-3.5 font-medium text-black shadow-sm hover:cursor-pointer hover:underline">
                                            <img
                                                className="h-8 w-8 rounded-full"
                                                src={creator.organization.icon}
                                                alt=""
                                            />
                                            {creator.organization.name}
                                        </Link>
                                    </span>
                                )}
                                <span className="pt-1 lg:w-2/3">{creator.description}</span>
                                <div className="flex gap-2">
                                    <button
                                        className={`flex h-9 min-w-28 items-center justify-center gap-3 rounded-full border px-6 py-1 pr-5 text-base font-medium ${
                                            isFollowing
                                                ? "border-gray-300 bg-white text-black hover:bg-gray-100"
                                                : "border-black bg-black text-white hover:bg-gray-900"
                                        }`}
                                        onClick={handleFollow}>
                                        {isFollowing ? (
                                            "Following"
                                        ) : isFollowing === false ? (
                                            "Follow"
                                        ) : (
                                            <div className="px-2">
                                                <svg
                                                    aria-hidden="true"
                                                    className="h-5 w-5 animate-spin fill-white text-gray-500"
                                                    viewBox="0 0 100 101"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                        fill="currentFill"
                                                    />
                                                </svg>
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        )}
                                    </button>
                                    {creator.subscription && (
                                        <div className="flex flex-col gap-3 md:flex-row md:items-center">
                                            <Dialog.Root>
                                                <Dialog.Trigger asChild>
                                                    <button
                                                        className={`flex h-9 w-fit min-w-28 items-center justify-center rounded-full border px-6 py-1 pr-5 text-base font-medium ${
                                                            isSubscribed === true
                                                                ? "border-gray-300 hover:bg-gray-100"
                                                                : isSubscribed === false
                                                                  ? "border-red-100 bg-red-100 text-red-700"
                                                                  : "bg-white text-black"
                                                        }`}
                                                        onClick={handleSubscribe}>
                                                        {isSubscribed ? (
                                                            "Subscribed"
                                                        ) : isSubscribed === false ? (
                                                            "Subscribe"
                                                        ) : (
                                                            <>
                                                                <svg
                                                                    aria-hidden="true"
                                                                    className="h-5 w-5 animate-spin fill-gray-500 text-gray-200"
                                                                    viewBox="0 0 100 101"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                                        fill="currentColor"
                                                                    />
                                                                    <path
                                                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                                        fill="currentFill"
                                                                    />
                                                                </svg>
                                                                <span className="sr-only">
                                                                    Loading...
                                                                </span>
                                                            </>
                                                        )}
                                                    </button>
                                                </Dialog.Trigger>
                                                <SubscribePortal details={creator} />
                                            </Dialog.Root>
                                            <span className="text-sm font-medium leading-4">
                                                Starting at ₹
                                                {creator.subscriptions[0].pricing[0].price}
                                                /per month
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pb-20 pt-2 sm:px-8 lg:px-16">
                    {creator.type === "individual" && (
                        <Tabs.Root className="flex flex-col gap-2" defaultValue="for-followers">
                            <Tabs.List
                                className="sticky top-12 z-40 flex flex-1 flex-row items-center gap-1 border-b bg-white pt-1 lg:top-14"
                                aria-label="creator tabs">
                                <Tabs.Trigger className="creator-tab" value="for-followers">
                                    For followers
                                </Tabs.Trigger>
                                <Tabs.Trigger className="creator-tab" value="for-subscribers">
                                    For subscribers
                                </Tabs.Trigger>
                            </Tabs.List>
                            <Tabs.Content
                                className="flex flex-col gap-8 px-4 pt-6 transition-none data-[state='inactive']:hidden lg:w-2/3"
                                value="for-followers">
                                {articles.map((article, index) => (
                                    <ArticleList article={article} key={index} />
                                ))}
                            </Tabs.Content>
                            <Tabs.Content value="for-subscribers">
                                <ForSubscribers creator={creator} articles={articles} />
                            </Tabs.Content>
                        </Tabs.Root>
                    )}
                    {creator.type === "organization" && (
                        <>
                            <hr />
                            <div className="flex flex-col gap-8 px-4 pt-6 lg:w-2/3">
                                {articles.map((article, index) => (
                                    <ArticleList article={article} key={index} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        )
    }
}

export default Creator
