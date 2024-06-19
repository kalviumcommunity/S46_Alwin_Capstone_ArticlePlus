import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { useSignalEffect } from "@preact/signals-react"
import * as Tabs from "@radix-ui/react-tabs"

import { creatorInfo } from "@/signals/creator"

import Authors from "@/components/Dashboard/Authors"
import Billing from "@/components/Dashboard/Billing"
import Team from "@/components/Dashboard/Team"

function OrganizationSettings() {
    const location = useLocation()

    const [creatorDetails, setCreatorDetails] = useState(null)
    const [activeTab, setActiveTab] = useState(window.innerWidth > 640 ? "general" : "")

    useSignalEffect(() => {
        if (creatorInfo.value) {
            setCreatorDetails(creatorInfo.value)
        }
    })

    useEffect(() => {
        if (window.innerWidth > 640 && activeTab === "") {
            setActiveTab("general")
        }
    }, [activeTab, location.pathname])

    if (creatorInfo.value && creatorInfo.value.type === "individual") {
        return (
            <div>
                <h1 className="text-2xl font-semibold">Organization Settings</h1>
                <p className="text-gray-500">
                    You need to be logged in as an organization to access this page.
                </p>
            </div>
        )
    }

    return (
        <div className="mb-8 flex flex-col sm:gap-6">
            <h1 className="mt-8 border-b px-4 pb-5 text-2xl font-semibold sm:px-8">
                Organization Settings
            </h1>
            <Tabs.Root
                className="flex flex-col gap-4 px-4 py-2 sm:flex-row sm:gap-0 sm:px-8 md:divide-x"
                value={activeTab}
                onValueChange={setActiveTab}>
                <Tabs.List
                    className={`mt-4 flex h-72 flex-col sm:mt-0 sm:w-max sm:max-w-48 sm:flex-1 sm:gap-1 sm:pr-5 ${
                        activeTab !== "" && window.innerWidth < 640 ? "hidden" : ""
                    }`}>
                    <Tabs.Trigger
                        className="border border-white px-3 py-3 text-start text-sm hover:bg-gray-50 sm:w-full sm:rounded sm:px-4 sm:py-2 sm:text-base sm:text-gray-500 [&[data-state='active']]:font-medium [&[data-state='active']]:text-black sm:[&[data-state='active']]:border sm:[&[data-state='active']]:border-gray-200"
                        value="general">
                        General
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        className="border border-white px-3 py-3 text-start text-sm hover:bg-gray-50 sm:w-full sm:rounded sm:px-4 sm:py-2 sm:text-base sm:text-gray-500 [&[data-state='active']]:font-medium [&[data-state='active']]:text-black sm:[&[data-state='active']]:border sm:[&[data-state='active']]:border-gray-200"
                        value="billing">
                        Billing
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        className="border border-white px-3 py-3 text-start text-sm hover:bg-gray-50 sm:w-full sm:rounded sm:px-4 sm:py-2 sm:text-base sm:text-gray-500 [&[data-state='active']]:font-medium [&[data-state='active']]:text-black sm:[&[data-state='active']]:border sm:[&[data-state='active']]:border-gray-200"
                        value="team">
                        Team
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        className="border border-white px-3 py-3 text-start text-sm hover:bg-gray-50 sm:w-full sm:rounded sm:px-4 sm:py-2 sm:text-base sm:text-gray-500 [&[data-state='active']]:font-medium [&[data-state='active']]:text-black sm:[&[data-state='active']]:border sm:[&[data-state='active']]:border-gray-200"
                        value="authors">
                        Authors
                    </Tabs.Trigger>
                </Tabs.List>
                <div
                    className={`${activeTab === "" && window.innerWidth < 640 ? "hidden" : "flex"} mt-2 w-fit items-center rounded-full border py-1.5 pl-3 pr-6 hover:cursor-pointer sm:hidden`}
                    onClick={() => setActiveTab("")}>
                    <img src="/assets/icons/arrow-left.svg" className="h-6" alt="" />
                    <p className="font-medium capitalize">{activeTab}</p>
                </div>
                <div className="flex-auto sm:w-min sm:pl-6">
                    <Tabs.Content value="general" className="flex flex-col gap-2">
                        {creatorDetails && (
                            <div className="flex flex-col gap-5 rounded border px-6 py-6 sm:px-10">
                                <div className="flex items-center gap-4">
                                    <img
                                        className="h-16 w-16 rounded-full object-cover"
                                        src={creatorDetails.displayPicture}
                                        alt=""
                                    />
                                    <div className="flex flex-1 flex-col">
                                        <p className="text-xl font-semibold leading-7">
                                            {creatorDetails.name}
                                        </p>
                                        <span className="text-sm leading-4 text-gray-700">
                                            @{creatorDetails.id}
                                        </span>
                                    </div>
                                    <div className="flex flex-1 flex-col font-medium">
                                        <span>{creatorDetails.followers} followers</span>
                                        <span>{creatorDetails.subscribers} subscribers</span>
                                    </div>
                                </div>
                                <span className="lg:w-2/3">{creatorDetails.description}</span>
                            </div>
                        )}
                    </Tabs.Content>
                    <Tabs.Content value="billing">
                        <Billing />
                    </Tabs.Content>
                    <Tabs.Content value="team">
                        <Team />
                    </Tabs.Content>
                    <Tabs.Content value="authors">
                        <Authors />
                    </Tabs.Content>
                </div>
            </Tabs.Root>
        </div>
    )
}

export default OrganizationSettings
