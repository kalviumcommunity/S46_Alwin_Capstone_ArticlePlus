import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import * as Tabs from "@radix-ui/react-tabs"

import { randomGradient } from "@/utils/ui/randomGradient"

import { ArticleList } from "@/components/ArticleList"

import { articles } from "@/data/articles"
import { creators } from "@/data/creators"

function Creator() {
    const { creator: id, contributor } = useParams()

    const [gradient, setGradient] = useState("")
    const [creator, setCreator] = useState()

    useEffect(() => {
        randomGradient(setGradient)
        if (id) {
            console.log(id)
            setCreator(creators.find((creator) => creator.id === id))
        } else {
            console.log(contributor)
            setCreator(creators.find((creator) => creator.id === contributor))
        }
    }, [])

    if (creator) {
        return (
            <div>
                <div className="pt-16 w-full justify-end" style={{ background: gradient }}>
                    <div className="flex flex-col gap-4 bg-gradient-to-t from-white from-40% to-transparent">
                        <img
                            className="h-20 w-fit rounded-full mx-4 sm:mx-8 lg:mx-16 shadow"
                            src={creator.image}
                            alt=""
                        />
                        <div className="flex flex-col sm:flex-row pb-6 gap-6 lg:gap-8 px-4 sm:px-8 lg:px-16">
                            <div className="flex">
                                <div className="w-max  flex flex-col">
                                    <div className="flex gap-2 items-center">
                                        <h1 className="text-2xl font-bold w-max">
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
                            <div className="flex flex-col gap-4 justify-end">
                                <span className="lg:w-2/3 pt-1">{creator.description}</span>
                                {creator.type === "individual" ? (
                                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                                        <button className="w-fit bg-blue-500 py-1.5 px-8 text-base border-black rounded-full text-white font-medium">
                                            Be a member
                                        </button>
                                        <span className="font-medium text-sm">
                                            Starting at $10 /per month
                                        </span>
                                    </div>
                                ) : (
                                    <div>
                                        <span className="text-gray-700 flex gap-3 items-center">
                                            Organisation
                                            <Link
                                                to={`/organisation/${creator.organisation.id}`}
                                                className="bg-white shadow-sm py-1 pl-1 pr-3.5 rounded-full border flex items-center gap-2 hover:cursor-pointer hover:underline font-medium text-black">
                                                <img
                                                    className="h-8 w-8 rounded-full"
                                                    src={creator.organisation.icon}
                                                    alt=""
                                                />
                                                {creator.organisation.name}
                                            </Link>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sm:px-8 lg:px-16 pt-2 pb-20">
                    {creator.type === "individual" && (
                        <Tabs.Root
                            className="flex flex-col gap-2"
                            defaultValue="for-subscribers">
                            <Tabs.List
                                className="flex flex-1 flex-row items-center gap-1 border-b sticky top-12 lg:top-14 pt-1 bg-white z-50"
                                aria-label="Creator tabs">
                                <Tabs.Trigger className="creator-tab" value="for-subscribers">
                                    For subscribers
                                </Tabs.Trigger>
                                <Tabs.Trigger className="creator-tab" value="for-members">
                                    For members
                                </Tabs.Trigger>
                            </Tabs.List>
                            <Tabs.Content
                                className="flex flex-col gap-8 pt-6 px-4 lg:w-2/3"
                                value="for-subscribers">
                                {articles.map((article, index) => (
                                    <ArticleList article={article} key={index} />
                                ))}
                            </Tabs.Content>
                            <Tabs.Content value="for-members"></Tabs.Content>
                        </Tabs.Root>
                    )}
                    {creator.type === "organisation" && (
                        <>
                            <hr />
                            <div className="flex flex-col gap-8 pt-6 px-4 lg:w-2/3">
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
