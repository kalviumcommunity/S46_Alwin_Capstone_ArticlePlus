import { useCallback, useEffect, useState } from "react"
import * as Tabs from "@radix-ui/react-tabs"

import axiosInstance from "@/axios"

import ArticleList from "@/components/ArticleList"
import CreatorArticles from "@/components/CreatorArticles"

function CreatorContent({ creator, isSubscribed }) {
    const [activeTab, setActiveTab] = useState("for-followers")

    const [articlesState, setArticlesState] = useState({
        "for-followers": { articles: [], page: 1, moreArticlesExist: false, loaded: false },
        "for-subscribers": { articles: [], page: 1, moreArticlesExist: false, loaded: false },
    })
    const [loading, setLoading] = useState(false)

    const fetchArticles = useCallback(
        async (tab, page) => {
            const endpoint = `creator/${creator.id}/articles/${tab}`

            setLoading(true)
            try {
                const { data } = await axiosInstance.get(endpoint, {
                    params: { page },
                })

                setArticlesState((prevState) => ({
                    ...prevState,
                    [tab]: {
                        articles: [...prevState[tab].articles, ...data.articles],
                        page,
                        moreArticlesExist: data.moreArticlesExist,
                        loaded: true,
                    },
                }))
            } catch (error) {
                console.error("Error fetching creator articles:", error)
            } finally {
                setLoading(false)
            }
        },
        [creator.id],
    )

    useEffect(() => {
        if (!articlesState[activeTab].loaded) {
            fetchArticles(activeTab, 1)
        }
    }, [activeTab, fetchArticles])

    const loadMoreArticles = () => {
        const nextPage = articlesState[activeTab].page + 1
        fetchArticles(activeTab, nextPage)
    }

    const { articles, moreArticlesExist } = articlesState[activeTab]

    const handleTabChange = (value) => {
        setActiveTab(value)
    }

    if (creator.subscriptions.length === 1) {
        return (
            <div className="pb-20 pt-2 sm:px-8 lg:px-16">
                <Tabs.Root className="flex flex-col gap-2" defaultValue={activeTab}>
                    <Tabs.List
                        className="sticky top-12 z-30 flex flex-1 flex-row items-center gap-1 border-b bg-white pt-1 lg:top-14"
                        aria-label="creator tabs">
                        <Tabs.Trigger
                            className="creator-tab"
                            value="for-followers"
                            onClick={() => handleTabChange("for-followers")}>
                            For followers ({creator.articles.free})
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            className="creator-tab"
                            value="for-subscribers"
                            onClick={() => handleTabChange("for-subscribers")}>
                            For subscribers ({creator.articles.subscription})
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content
                        className="flex flex-col gap-8 p-4 pt-6 transition-none data-[state='inactive']:hidden lg:w-2/3"
                        value="for-followers">
                        <CreatorArticles
                            articles={articles}
                            moreArticlesExist={moreArticlesExist}
                            loading={loading}
                            loadMoreArticles={loadMoreArticles}
                            activeTab={activeTab}
                            isSubscribed={isSubscribed}
                        />
                    </Tabs.Content>
                    <Tabs.Content
                        value="for-subscribers"
                        className="flex flex-col gap-8 p-4 pt-6 transition-none data-[state='inactive']:hidden lg:w-2/3">
                        <CreatorArticles
                            articles={articles}
                            moreArticlesExist={moreArticlesExist}
                            loading={loading}
                            loadMoreArticles={loadMoreArticles}
                            activeTab={activeTab}
                            isSubscribed={isSubscribed}
                        />
                    </Tabs.Content>
                </Tabs.Root>
            </div>
        )
    }

    return (
        <div className="pb-20 pt-2 sm:px-8 lg:px-16">
            <hr />
            <div className="flex flex-col gap-8 px-4 pt-6 lg:w-2/3">
                {articles?.map((article) => (
                    <ArticleList article={article} key={article.slug} />
                ))}
            </div>
        </div>
    )
}

export default CreatorContent
