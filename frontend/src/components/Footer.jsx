function Footer() {
    return (
        <div className="mt-auto flex flex-col">
            <div className="flex flex-col gap-8 border-t px-4 pb-10 pt-10 text-sm sm:flex-row sm:px-8 sm:pb-14 sm:pt-16 lg:px-16">
                <div className="flex flex-col gap-6 sm:w-1/2">
                    <span className="font-semibold">For readers</span>
                    <div className="grid grid-cols-2 gap-3 text-gray-700">
                        <p>Home</p>
                        <p>Latest</p>
                        <p>Trending</p>
                        <p>Highlight</p>
                    </div>
                </div>
                <div className="flex flex-col gap-6 sm:w-1/4">
                    <span className="font-semibold">For creators</span>
                    <div className="grid grid-cols-2 gap-3 text-gray-700 sm:grid-cols-1">
                        <p>Account</p>
                        <p>Dashboard</p>
                    </div>
                </div>
                <div className="flex flex-col gap-6 sm:w-1/4">
                    <span className="font-semibold">Links</span>
                    <div className="grid grid-cols-2 gap-3 text-gray-700 sm:grid-cols-1">
                        <p>About us</p>
                        <p>Contact</p>
                    </div>
                </div>
            </div>
            <div className="z-40 flex flex-col gap-3 px-4 py-6 pb-8 sm:flex-row sm:items-end sm:px-8 sm:pb-14 md:gap-0 lg:px-16">
                <div className="flex flex-wrap items-end gap-2 sm:flex-1">
                    <div className="flex items-center gap-3">
                        <img className="h-5 w-fit" src="/logo.svg" alt="" />
                        <span className="pt-[0.1rem] font-serif text-2xl font-bold leading-6">
                            Article+
                        </span>
                    </div>
                    <span className="text-sm">Discover articles. Publish articles</span>
                </div>
                <span className="text-sm sm:flex-1">
                    Created by{" "}
                    <a
                        className="font-medium text-rose-500"
                        href="http://alwinsunil.in"
                        target="_blank"
                        rel="noopener noreferrer">
                        Alwin Sunil
                    </a>
                </span>
            </div>
        </div>
    )
}

export default Footer
