import React, { useState } from "react"

function Editor() {
    const [isFullscreen, setIsFullscreen] = useState(false)

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen)
    }

    return (
        <div
            className={`flex ${
                isFullscreen
                    ? "fixed left-0 top-0 z-50 h-screen w-screen"
                    : "h-[calc(100vh-6rem)] rounded border"
            }`}>
            <div className="flex w-full gap-4 bg-gray-100 p-3">
                <div className="flex w-4/5 flex-col gap-2">
                    <div className="flex w-full">
                        <span className="w-full rounded border bg-white px-4 py-1.5 text-sm text-gray-700">
                            http://localhost:5173/article/the-next-targets-for-the-group-that-overturned-roe
                        </span>
                    </div>
                    <div className="h-full rounded border bg-white"></div>
                </div>
                <div className="flex w-1/5 flex-col gap-2">
                    <div className="flex gap-2">
                        <button
                            className="flex w-full justify-center rounded border bg-white p-2 hover:bg-slate-50"
                            onClick={toggleFullscreen}>
                            <img
                                className="h-5"
                                src={`/assets/icons/${
                                    isFullscreen ? "close-fullscreen" : "fullscreen"
                                }.svg`}
                                alt=""
                            />
                        </button>
                    </div>
                    <hr />
                    <button className="w-full rounded border bg-white px-4 py-1.5 text-sm font-medium">
                        Title
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Editor
