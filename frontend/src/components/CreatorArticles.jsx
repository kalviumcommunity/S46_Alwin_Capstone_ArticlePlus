import ArticleList from "@/components/ArticleList"

import Loader from "@/ui/Loader"

function CreatorArticles({
    articles,
    moreArticlesExist,
    loading,
    loadMoreArticles,
    activeTab,
    isSubscribed,
}) {
    return (
        <div className="flex flex-col gap-6">
            {loading && articles.length === 0 ? (
                <Loader />
            ) : articles.length === 0 && isSubscribed ? (
                <div className="mt-6 flex flex-col items-start">
                    <span className="text-transpar bg-gradient-to-br from-rose-400 to-rose-600 bg-clip-text pt-1 text-3xl font-extrabold uppercase leading-none text-transparent">
                        Sorry,
                    </span>
                    <p className="text-gray-700">
                        Creator has not published any articles{" "}
                        <span className="font-medium text-black">
                            for {activeTab === "for-followers" ? "followers" : "subscribers"}
                        </span>
                    </p>
                </div>
            ) : (
                articles.map((article) => <ArticleList article={article} key={article.id} />)
            )}
            {!loading && activeTab === "for-subscribers" && !isSubscribed && (
                <div className="mt-6 flex flex-col items-start gap-1">
                    <span className="text-transpar bg-gradient-to-br from-rose-400 to-rose-600 bg-clip-text pt-1 text-3xl font-extrabold uppercase leading-none text-transparent">
                        Subscribe,
                    </span>
                    <p className="text-gray-700">
                        to access articles{" "}
                        <span className="font-medium text-black">for subscribers </span>
                    </p>
                </div>
            )}
            {moreArticlesExist && (
                <button
                    className="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                    onClick={loadMoreArticles}
                    disabled={loading}>
                    Load More
                </button>
            )}
            {loading && articles.length > 0 && <Loader />}
        </div>
    )
}

export default CreatorArticles
