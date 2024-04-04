import { ArticleList } from "./ArticleList"

function ForSubscribers({ articles }) {
    const subscriberArticles = articles.filter((article) => article.paywall === true)

    return (
        <div className="flex flex-col gap-8 px-4 pt-6 lg:w-2/3">
            {subscriberArticles.map((article, index) => (
                <ArticleList article={article} key={index} />
            ))}
        </div>
    )
}

export default ForSubscribers
