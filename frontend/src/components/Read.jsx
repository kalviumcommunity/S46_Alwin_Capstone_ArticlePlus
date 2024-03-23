import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useSignals } from "@preact/signals-react/runtime"
import { ArticleCard } from "@/components/ArticleCard"
import TagRibbion from "@/components/TagRibbion"

function Read() {
    useSignals()
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const tag = searchParams.get("tag")
        console.log(tag)
    }, [searchParams])

    const articles = [
        {
            id: "139823",
            title: "UNITED STATES SUES APPLE",
            image: "https://cdn.vox-cdn.com/uploads/chorus_asset/file/25345077/STK468_APPLE_ANTITRUST_CVIRGINIA_F.jpg",
            subtitle:
                "The Department of Justice claims Apple has maintained an illegal monopoly over the smartphone market by locking in customers and making experiences worse for rival products.",
            author: { name: "Lauren Finer", id: "lauren-feiner" },
            timestamp: new Date().toISOString,
            category: "tech",
            views: "2.1k",
        },
        {
            id: "139824",
            title: "Neuralink video shows patient using brain implant to play chess on laptop",
            image: "https://cdn.vox-cdn.com/uploads/chorus_asset/file/24935258/Neuralink_N1.jpg",
            subtitle:
                "The company’s first human patient said the technology has changed his life but that ‘there’s still a lot of work to be done.",
            author: { name: "Jon Porter", id: "jon-porter" },
            timestamp: new Date().toISOString,
            category: "tech",
            views: "2.3k",
        },
        {
            id: "139824",
            title: "The Brutal Conditions Facing Palestinian Prisoners",
            image: "https://media.newyorker.com/photos/65fa0e35d0259d12e777d4b9/master/w_1920,c_limit/Chotiner-Israeli-Prisons.jpg",
            subtitle:
                "Since the attacks of October 7th, Israel has held thousands of people from Gaza and the West Bank in detention camps and prisons.",
            author: { name: "Isaac Chotiner", id: "isaac-chotiner" },
            timestamp: new Date().toISOString,
            category: "tech",
            views: "2k",
        },
        {
            id: "139824",
            title: "The Terrifying A.I. Scam That Uses Your Loved One’s Voice",
            image: "https://media.newyorker.com/photos/65e905af927c257730936c5b/master/w_1920,c_limit/NewYorker_AIVoice_final.jpg",
            subtitle:
                "A Brooklyn couple got a call from relatives who were being held ransom. Their voices—like many others these days—had been cloned.",
            author: { name: "Charles Bethea", id: "charles-bethea" },
            timestamp: new Date().toISOString,
            category: "tech",
            views: "2k",
        },
    ]

    const tech = [
        {
            id: "139823",
            title: "UNITED STATES SUES APPLE",
            image: "https://cdn.vox-cdn.com/uploads/chorus_asset/file/25345077/STK468_APPLE_ANTITRUST_CVIRGINIA_F.jpg",
            subtitle:
                "The Department of Justice claims Apple has maintained an illegal monopoly over the smartphone market by locking in customers and making experiences worse for rival products.",
            author: { name: "Lauren Finer", id: "lauren-feiner" },
            timestamp: new Date().toISOString,
            category: "tech",
            views: "2.1k",
        },
        {
            id: "139824",
            title: "The Terrifying A.I. Scam That Uses Your Loved One’s Voice",
            image: "https://media.newyorker.com/photos/65e905af927c257730936c5b/master/w_1920,c_limit/NewYorker_AIVoice_final.jpg",
            subtitle:
                "A Brooklyn couple got a call from relatives who were being held ransom. Their voices—like many others these days—had been cloned.",
            author: { name: "Charles Bethea", id: "charles-bethea" },
            timestamp: new Date().toISOString,
            category: "tech",
            views: "2k",
        },
    ]

    const highlight = [
        {
            id: "139823",
            title: "The Crime Rings Stealing Everything from Purses to Power Tools",
            image: "https://media.newyorker.com/photos/65f2135ebf04e4ed39ab6b01/master/w_1920,c_limit/r43943.png",
            subtitle:
                "In Los Angeles, a task force of detectives is battling organized retail theft, in which boosted goods often end up for sale online—or commingled on store shelves with legitimate items.",
            author: { name: "Lauren Finer", id: "lauren-feiner" },
            timestamp: new Date().toISOString,
            category: "tech",
            views: "2.1k",
        },
    ]

    return (
        <>
            <TagRibbion />
            <div className="wrapper flex-col pb-10">
                <div className="flex flex-col gap-3 py-6">
                    <span className="font-serif text-xl font-normal">
                        Latest
                    </span>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {articles.map((article) => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-2 py-6">
                    <div className="grid grid-cols-1 divide-x ">
                        {highlight.map((article) => (
                            <div className="group flex h-fit flex-col gap-6 bg-gray-50 px-6 py-10 hover:cursor-pointer md:py-4 lg:flex-row">
                                <img
                                    className="aspect-[4/3] w-1/2 rounded-sm object-cover sm:w-1/3 xl:w-1/2"
                                    src={article.image}
                                    alt=""
                                />
                                <div className="flex flex-col justify-center gap-2 px-6 text-center">
                                    <span className="font-serif text-3xl font-medium group-hover:underline group-hover:underline-offset-4 sm:text-2xl lg:text-3xl">
                                        {article.title}
                                    </span>
                                    <span className="line-clamp-4 text-sm font-normal text-gray-500">
                                        {article.subtitle}
                                    </span>
                                    <span className="text-sm font-semibold leading-4">
                                        {article.author.name}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-3 py-6">
                    <span className="font-serif text-xl font-normal">Tech</span>
                    <div className="grid grid-cols-2 gap-6">
                        {tech.map((article) => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Read
