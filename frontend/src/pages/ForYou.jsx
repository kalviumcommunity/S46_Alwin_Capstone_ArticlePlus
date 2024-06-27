import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import * as Tabs from "@radix-ui/react-tabs"

import TagRibbion from "@/components/TagRibbion"

function ForYou() {
    const location = useLocation()

    const [activeTab, setActiveTab] = useState("following")

    useEffect(() => {
        if (location.pathname.includes("/foryou/subscriptions")) {
            setActiveTab("subscriptions")
        } else {
            setActiveTab("following")
        }
    }, [location.pathname])

    return (
        <>
            <TagRibbion isLoggedin={true} />
            <div className="flex-col border-t pb-10 pt-4">
                <Tabs.Root
                    className="wrapper flex divide-x py-6"
                    value={activeTab}
                    onValueChange={setActiveTab}>
                    <Tabs.List
                        className="sticky top-12 flex flex-row items-end gap-1 border-b bg-white px-2 py-2 pb-0 pt-3 sm:mr-3 sm:w-60 sm:flex-col sm:items-start sm:gap-2 sm:border-0 sm:py-0 sm:pl-2"
                        aria-label="manage your account">
                        <Tabs.Trigger
                            className="w-fit border border-white px-4 py-2 text-start text-sm font-medium text-gray-500 hover:bg-gray-50 sm:w-full sm:rounded sm:text-base [&[data-state='active']]:border-0 [&[data-state='active']]:border-b-2 [&[data-state='active']]:border-gray-800 [&[data-state='active']]:text-black sm:[&[data-state='active']]:border sm:[&[data-state='active']]:border-gray-200"
                            value="following"
                            asChild>
                            <Link to="/foryou">Following</Link>
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            className="w-fit border border-white px-4 py-2 text-start text-sm font-medium text-gray-500 hover:bg-gray-50 sm:w-full sm:rounded sm:text-base [&[data-state='active']]:border-0 [&[data-state='active']]:border-b-2 [&[data-state='active']]:border-gray-800 [&[data-state='active']]:text-black sm:[&[data-state='active']]:border sm:[&[data-state='active']]:border-gray-200"
                            value="subscriptions"
                            asChild>
                            <Link to="/foryou/subscriptions">Subscriptions</Link>
                        </Tabs.Trigger>
                    </Tabs.List>
                    <div className="flex w-full flex-row px-4 sm:pl-4">
                        <Tabs.Content value="account" className="flex flex-col gap-2">
                            <div className="my-2 flex flex-col gap-2 sm:mx-2">
                                <span className="text-2xl font-semibold">Authentication</span>
                                <div className="grid auto-cols-auto divide-y"></div>
                            </div>
                        </Tabs.Content>
                        <Tabs.Content value="subscriptions" asChild>
                            <div className="my-2 flex w-full gap-2 sm:mx-2">
                                <div className="mb-2 flex h-fit w-full items-center justify-between gap-2">
                                    <span className="text-2xl font-semibold">
                                        Subscriptions
                                    </span>
                                    <Link
                                        className="flex h-fit items-center gap-1 rounded-full bg-rose-500 px-5 py-1 pr-4 text-sm font-medium text-white"
                                        to="/account/subscriptions">
                                        Manage subscriptions
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-5 w-5">
                                            <path d="M7 7h10v10" />
                                            <path d="M7 17 17 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </Tabs.Content>
                    </div>
                </Tabs.Root>
            </div>
        </>
    )
}

export default ForYou
