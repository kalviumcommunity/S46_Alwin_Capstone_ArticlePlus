export const ArticleCard = ({ article }) => {
    return (
        <div className="group flex h-fit flex-col gap-3 hover:cursor-pointer">
            <img
                className="w-full aspect-[4/3] rounded-sm object-cover"
                src={article.image}
                alt=""
            />
            <div className="flex flex-col justify-center gap-2">
                <span className="font-serif text-lg font-semibold leading-6 group-hover:underline group-hover:underline-offset-4">
                    {article.title}
                </span>
                <span className="line-clamp-4 text-sm font-normal text-gray-600 font-serif f">
                    {article.subtitle}
                </span>
                <div className="mt-2 flex items-end justify-between">
                    <span className="text-sm font-semibold leading-4">
                        {article.author.name}
                    </span>
                    <span className="text-sm leading-4 text-gray-500">
                        {article.views} views
                    </span>
                </div>
            </div>
        </div>
    )
}
