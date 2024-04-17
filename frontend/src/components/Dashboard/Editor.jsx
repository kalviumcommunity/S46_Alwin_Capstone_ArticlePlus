import React, { useEffect, useState } from "react"

import useKeyPress from "@/helpers/hooks/useKeyPress"

function Editor() {
    const [isFullscreen, setIsFullscreen] = useState(false)
    const isEscPressed = useKeyPress("Escape")

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen)
    }

    useEffect(() => {
        if (isFullscreen && isEscPressed) {
            setIsFullscreen(false)
        }
    }, [isEscPressed])

    return (
        <div
            className={`flex bg-white ${
                isFullscreen
                    ? "fixed left-0 top-0 z-50 h-screen w-screen"
                    : "h-[calc(100vh-6rem)]"
            }`}>
            <div className="m-2 flex w-full gap-3 border bg-gray-100 p-2">
                <div className="flex w-4/5 flex-col gap-2">
                    <div className="flex w-full">
                        <span className="w-full rounded border bg-white px-4 py-1.5 text-xs">
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
