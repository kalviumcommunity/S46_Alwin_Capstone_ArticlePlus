import { useState } from "react"
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime"

import { creatorInfo } from "@/signals/creator"

function DashboardAnalytics() {
    useSignals()

    const [creatorAnalytics, setCreatorAnalytics] = useState(false)

    useSignalEffect(() => {
        if (creatorInfo.value) {
            setCreatorAnalytics(creatorInfo.value)
        }
    })

    return (
        <div className="mb-8 flex flex-col gap-6">
            <h1 className="mt-8 border-b px-8 pb-5 text-2xl font-semibold">Analytics</h1>
            <div className="px-6">
                {creatorAnalytics && (
                    <div className="flex w-full flex-col gap-3 border p-5 sm:w-96">
                        <div className="flex w-full">
                            <span className="w-4/5">Followers</span>
                            <span className="w-1/5 text-center font-medium">
                                {creatorAnalytics.followers}
                            </span>
                        </div>
                        <div className="flex w-full">
                            <span className="w-4/5">Subscribers</span>
                            <span className="w-1/5 text-center font-medium">
                                {creatorAnalytics.subscribers}
                            </span>
                        </div>
                        <div className="flex w-full">
                            <span className="w-4/5">Views in last 1 month</span>
                            <span className="w-1/5 text-center font-medium">482</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DashboardAnalytics
