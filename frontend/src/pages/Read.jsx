import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useSignals } from "@preact/signals-react/runtime"

import { ArticleCard } from "@/components/ArticleCard"
import Highlight from "@/components/Highlight"
import TagRibbion from "@/components/TagRibbion"

import { articles } from "@/data/articles"

function Read({ isLoggedin }) {
    useSignals()
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const tag = searchParams.get("tag")
        console.log(tag)
    }, [searchParams])

    return (
        <>
            <TagRibbion isLoggedin={isLoggedin} />
            <div className="flex-col pb-10">
                <div className="wrapper flex flex-col gap-3 py-6">
                    <span className="mb-1 font-serif text-2xl font-semibold">Latest</span>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {articles.map((article, index) => (
                            <ArticleCard article={article} key={index} />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-2 py-6">
                    <div className="grid grid-cols-1 divide-x ">
                        {articles &&
                            [articles[3]].map((article, index) => (
                                <Highlight article={article} key={index} />
                            ))}
                    </div>
                </div>
                <div className="wrapper flex flex-col gap-3 py-6">
                    <span className="mb-1 font-serif text-2xl font-semibold">Technology</span>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
                        {articles.slice(0, 3).map((article, index) => (
                            <ArticleCard key={index} article={article} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Read
