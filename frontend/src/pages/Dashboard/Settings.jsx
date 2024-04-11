import { useEffect, useState } from "react"

import axiosInstance from "@/axios"

function DashboardSettings() {
    const [creatorInfo, setCreatorInfo] = useState(null)

    useEffect(() => {
        axiosInstance.get("/creator/auth/info").then((response) => {
            setCreatorInfo(response.data)
        })
    }, [])

    return (
        <div className="wrapper flex-col gap-5">
            <h1 className="text-2xl font-semibold">Settings</h1>
            <div>
                {creatorInfo && (
                    <div className="flex flex-col gap-5 rounded border px-10 py-6">
                        <div className="flex items-center gap-4">
                            <img
                                className="h-16 w-16 rounded-full object-cover"
                                src={creatorInfo.displayPicture}
                                alt=""
                            />
                            <div className="flex flex-1 flex-col">
                                <p className="text-xl font-semibold leading-7">
                                    {creatorInfo.name}
                                </p>
                                <span className="text-sm leading-4 text-gray-700">
                                    @{creatorInfo.id}
                                </span>
                            </div>
                            <div className="flex flex-1 flex-col font-medium">
                                <span>{creatorInfo.followers} followers</span>
                                <span>10 subscribers</span>
                            </div>
                        </div>
                        <span className="lg:w-2/3">{creatorInfo.description}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DashboardSettings
