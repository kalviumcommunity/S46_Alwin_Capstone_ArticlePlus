import { Link } from "react-router-dom"

export const ArticleList = ({ article }) => {
    return (
        <Link
            to={`/${article.slug}`}
            className="group flex items-center gap-5 lg:gap-8 hover:cursor-pointer w-full flex-row-reverse lg:flex-row">
            <div
                className="flex items-center justify-center w-40 h-fit lg:w-96"
                style={{
                    backgroundImage: `url(${article.image.url})`,
                    backgroundSize: "cover",
                }}>
                <img
                    className={`${article.image.bg ? "object-cover" : "object-contain"} lg:h-44 w-full rounded-sm`}
                    style={{ backdropFilter: "blur(50px)" }}
                    src={article.image.url}
                    loading="lazy"
                    alt={article.image.caption}
                />
            </div>
            <div className="flex flex-col justify-center gap-1 w-full">
                <span className="text-rose-500 uppercase font-serif text-sm">
                    {article.category}
                </span>
                <span className="font-serif text-lg font-semibold leading-6 group-hover:underline group-hover:underline-offset-4">
                    {article.title}
                </span>
                <span className="line-clamp-4 text-sm font-normal text-gray-600 font-serif mt-2">
                    {article.subtitle}
                </span>
                <div className="mt-1 flex items-center justify-between">
                    {article.author.type === "individual" ? (
                        <>
                            <span className="text-sm font-semibold leading-4">
                                {article.author.name}
                            </span>
                            <span className="text-sm leading-4 text-gray-500">
                                {article.views} views
                            </span>
                        </>
                    ) : (
                        <span className="text-sm font-semibold">
                            {article.author.organization.name} • {article.author.name}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}
