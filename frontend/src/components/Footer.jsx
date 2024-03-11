import React from "react"

function Footer() {
    return (
        <div className="flex flex-col">
            <div className="flex flex-col border-t mx-4 py-10 gap-8 sm:mx-16 sm:flex-row">
                <div className="flex flex-col gap-3 sm:flex-auto">
                    <span className="font-semibold">For readers</span>
                    <div className="grid grid-cols-2 gap-2 text-gray-700">
                        <p>Home</p>
                        <p>Latest</p>
                        <p>Trending</p>
                        <p>Highlight</p>
                    </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-1">
                    <span className="font-semibold">For creators</span>
                    <div className="grid grid-cols-2 gap-2 text-gray-700 sm:grid-cols-1">
                        <p>Account</p>
                        <p>Dashboard</p>
                    </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-1">
                    <span className="font-semibold">Links</span>
                    <div className="grid grid-cols-2 gap-2 text-gray-700 sm:grid-cols-1">
                        <p>About us</p>
                        <p>Contact</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col border-t px-4 py-6 gap-3 sm:px-16 sm:flex-row sm:items-end">
                <div className="flex flex-wrap gap-2 sm:flex-1 items-end">
                    <div className="flex gap-3 items-center">
                        <img className="h-5" src="./logo.svg" alt="" />
                        <span className="text-xl font-semibold leading-6 font-serif pt-[0.1rem]">
                            Article+
                        </span>
                    </div>
                    <span className="text-sm">
                        Discover articles. Publish articles
                    </span>
                </div>
                <span className="text-sm sm:flex-1">
                    Created by{" "}
                    <a
                        className="font-medium underline"
                        href="http://alwinsunil.in"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Alwin Sunil
                    </a>
                </span>
            </div>
        </div>
    )
}

export default Footer
