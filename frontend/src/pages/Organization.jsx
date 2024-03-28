import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import * as Tabs from "@radix-ui/react-tabs"

import { randomGradient } from "@/utils/ui/randomGradient"

import { ArticleList } from "@/components/ArticleList"

import { articles as allArticles } from "@/data/articles"
import { organizations } from "@/data/organizations"

function Organization() {
    const { id } = useParams()

    const [gradient, setGradient] = useState("")
    const [organization, setOrgansisation] = useState()
    const [articles, setArticles] = useState()

    useEffect(() => {
        randomGradient(setGradient)
        setOrgansisation(organizations.find((organization) => organization.id === id))
        setArticles(
            allArticles.filter(
                (article) =>
                    article.author.type === "organization" &&
                    article.author.organization.id === id,
            ),
        )
    }, [id])

    if (organization && articles) {
        return (
            <div>
                <div className="pt-16 w-full justify-end" style={{ background: gradient }}>
                    <div className="flex flex-col gap-4 bg-gradient-to-t from-white from-40% to-transparent">
                        <img
                            className="h-20 w-fit rounded-full mx-4 sm:mx-8 lg:mx-16 shadow"
                            src={organization.image}
                            alt=""
                        />
                        <div className="flex flex-col sm:flex-row pb-6 gap-6 lg:gap-8 px-4 sm:px-8 lg:px-16">
                            <div className="flex">
                                <div className="w-max  flex flex-col">
                                    <div className="flex gap-2 items-center">
                                        <h1 className="text-2xl font-bold w-max">
                                            {organization.name}
                                        </h1>
                                        {organization.verified && (
                                            <img
                                                className="h-5 w-5"
                                                src="/assets/icons/verified.svg"
                                                alt=""
                                            />
                                        )}
                                    </div>
                                    <span>{organization.followers} followers</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 justify-end">
                                <span className="lg:w-2/3 pt-1">
                                    {organization.description}
                                </span>
                                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                                    <button className="w-fit bg-blue-500 py-1.5 px-8 text-base border-black rounded-full text-white font-medium">
                                        Be a member
                                    </button>
                                    <span className="font-medium text-sm">
                                        Starting at $10 /per month
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sm:px-8 lg:px-16 pt-2 pb-20">
                    <Tabs.Root className="flex flex-col gap-2" defaultValue="for-subscribers">
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
                </div>
            </div>
        )
    }
}

export default Organization
