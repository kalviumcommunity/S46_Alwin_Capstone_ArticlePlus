import { Link } from "react-router-dom"

export const ArticleList = ({ article }) => {
    return (
        <Link
            to={`/article/${article.slug}`}
            className="group flex w-full flex-row-reverse items-center gap-5 hover:cursor-pointer lg:flex-row lg:gap-8">
            <div
                className="flex h-fit w-40 items-center justify-center lg:w-96"
                style={{
                    backgroundImage: `url(${article.image.url})`,
                    backgroundSize: "cover",
                }}>
                <img
                    className={`${article.image.bg ? "object-cover" : "object-contain"} w-full rounded-sm lg:h-44`}
                    style={{ backdropFilter: "blur(50px)" }}
                    src={article.image.url}
                    loading="lazy"
                    alt={article.image.caption}
                />
            </div>
            <div className="flex w-full flex-col justify-center gap-1">
                <span className="font-serif text-sm uppercase text-rose-500">
                    {article.category}
                </span>
                <span className="font-serif text-lg font-semibold leading-6 group-hover:underline group-hover:underline-offset-4">
                    {article.title}
                </span>
                <span className="mt-2 line-clamp-4 font-serif text-sm font-normal text-gray-800">
                    {article.subtitle}
                </span>
                <div className="mt-1 flex items-center justify-between">
                    {article.author.type === "individual" ? (
                        <>
                            <span className="text-sm font-semibold leading-4">
                                {article.author.name}
                            </span>
                            <span className="text-sm leading-4 text-gray-800">
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
