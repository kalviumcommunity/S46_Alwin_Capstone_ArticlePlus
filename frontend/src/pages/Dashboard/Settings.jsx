import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import * as Tabs from "@radix-ui/react-tabs"

import { userDetails } from "@/signals/user"
import axiosInstance from "@/axios"

import Authors from "@/components/Dashboard/Authors"
import Billing from "@/components/Dashboard/Billing"
import Team from "@/components/Dashboard/Team"

function DashboardSettings() {
    const location = useLocation()

    const [creatorInfo, setCreatorInfo] = useState(null)
    const [activeTab, setActiveTab] = useState(window.innerWidth > 640 ? "general" : "")

    useEffect(() => {
        axiosInstance.get("/creator/auth/info").then((response) => {
            setCreatorInfo(response.data)
        })
    }, [])

    useEffect(() => {
        if (window.innerWidth > 640 && activeTab === "") {
            setActiveTab("general")
        }
    }, [activeTab, location.pathname])

    return (
        <div className="mb-8 flex flex-col sm:gap-6">
            <h1 className="mt-8 border-b px-4 pb-5 text-2xl font-semibold sm:px-8">Settings</h1>
            <Tabs.Root
                className="flex flex-col gap-4 px-4 py-2 sm:flex-row sm:gap-0 sm:px-8 md:divide-x"
                value={activeTab}
                onValueChange={setActiveTab}>
                <Tabs.List
                    className={`mt-4 flex flex-col sm:mt-0 sm:max-w-48 sm:flex-1 sm:gap-1 sm:pr-5 ${
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
                </Tabs.List>
                <div
                    className={`${activeTab === "" && window.innerWidth < 640 ? "hidden" : "flex"} mt-2 w-fit items-center rounded-full border py-1.5 pl-3 pr-6 hover:cursor-pointer sm:hidden`}
                    onClick={() => setActiveTab("")}>
                    <img src="/assets/icons/arrow-left.svg" className="h-6" alt="" />
                    <p className="font-medium capitalize">{activeTab}</p>
                </div>
                <div className="flex-auto sm:pl-6">
                    <Tabs.Content value="general" className="flex flex-col gap-2">
                        {creatorInfo && (
                            <>
                                {creatorInfo.type === "individual" ? (
                                    <div className="flex flex-col gap-5 rounded border px-6 py-6 sm:px-10">
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
                                                <span>
                                                    {creatorInfo.subscribers} subscribers
                                                </span>
                                            </div>
                                        </div>
                                        <span className="lg:w-2/3">
                                            {creatorInfo.description}
                                        </span>
                                    </div>
                                ) : creatorInfo.type === "organization" &&
                                  creatorInfo.owner === userDetails.value.id ? (
                                    <div className="flex flex-col overflow-hidden rounded border">
                                        <span className="flex items-center gap-1.5 border-b px-6 py-3 text-sm text-gray-800 sm:px-10">
                                            Your are owner of the{" "}
                                            <Link
                                                to="/organization/new-yorker"
                                                className="font-medium underline">
                                                {creatorInfo.name}
                                            </Link>{" "}
                                            organization
                                            <Link
                                                to="/dashboard/organization-settings"
                                                className="ml-auto rounded-full bg-rose-100 px-6 py-1 font-medium text-rose-800">
                                                Go to organization settings
                                            </Link>
                                        </span>
                                        <div className="flex flex-col gap-5 px-6 py-6 sm:px-10"></div>
                                    </div>
                                ) : null}
                            </>
                        )}
                    </Tabs.Content>
                    <Tabs.Content value="billing">
                        <Billing />
                    </Tabs.Content>
                    <Tabs.Content value="team">
                        <Team />
                    </Tabs.Content>
                </div>
            </Tabs.Root>
        </div>
    )
}

export default DashboardSettings
