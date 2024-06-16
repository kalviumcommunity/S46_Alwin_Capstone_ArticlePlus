import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useSignalEffect } from "@preact/signals-react"
import * as Dialog from "@radix-ui/react-dialog"
import * as Tabs from "@radix-ui/react-tabs"

import { creatorInfo } from "@/signals/creator"
import { userDetails } from "@/signals/user"

import Billing from "@/components/Dashboard/Billing"
import Team from "@/components/Dashboard/Team"

function DashboardSettings() {
    const location = useLocation()

    const [creatorDetails, setCreatorDetails] = useState(null)
    const [activeTab, setActiveTab] = useState(window.innerWidth > 640 ? "general" : "")

    useSignalEffect(() => {
        setCreatorDetails(creatorInfo.value)
        console.log(creatorInfo.value)
    })

    useEffect(() => {
        if (window.innerWidth > 640 && activeTab === "") {
            setActiveTab("general")
        }
    }, [activeTab, location.pathname])

    useEffect(() => {
        console.log(creatorDetails)
    }, [creatorDetails])

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
                    {creatorDetails && creatorDetails.type === "individual" && (
                        <>
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
                        </>
                    )}
                </Tabs.List>
                <div
                    className={`${activeTab === "" && window.innerWidth < 640 ? "hidden" : "flex"} mt-2 w-fit items-center rounded-full border py-1.5 pl-3 pr-6 hover:cursor-pointer sm:hidden`}
                    onClick={() => setActiveTab("")}>
                    <img src="/assets/icons/arrow-left.svg" className="h-6" alt="" />
                    <p className="font-medium capitalize">{activeTab}</p>
                </div>
                <div className="flex-auto sm:pl-6">
                    <Tabs.Content value="general" className="flex flex-col gap-2">
                        {creatorDetails && (
                            <>
                                {creatorDetails.type === "individual" ? (
                                    <div className="flex flex-col gap-5 rounded border px-6 py-6 sm:px-10">
                                        <div className="flex items-center gap-4">
                                            <img
                                                className="h-14 w-14 rounded-full object-cover"
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
                                                <span>
                                                    {creatorDetails.followers} followers
                                                </span>
                                                <span>
                                                    {creatorDetails.subscribers} subscribers
                                                </span>
                                            </div>
                                        </div>
                                        <span className="lg:w-2/3">
                                            {creatorDetails.description}
                                        </span>

                                        <Dialog.Root>
                                            <Dialog.Trigger asChild>
                                                <div className="mt-auto flex w-full justify-start gap-2 border-t pt-4">
                                                    <button className="rounded-full border bg-rose-500 px-4 py-1 text-sm font-medium text-white hover:bg-rose-600">
                                                        Edit profile
                                                    </button>
                                                </div>
                                            </Dialog.Trigger>
                                            <Dialog.Portal>
                                                <Dialog.Overlay className="absolute inset-0 z-40 h-full w-screen bg-black/50 opacity-100" />
                                                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex w-full max-w-[450px] -translate-x-1/2 -translate-y-1/2 transform flex-col gap-2 bg-white px-8 py-10">
                                                    <Dialog.Title className="text-2xl font-semibold">
                                                        Edit profile
                                                    </Dialog.Title>
                                                    <Dialog.Description className="flex flex-col gap-1 text-gray-700">
                                                        Make changes to your profile here.
                                                        <span className="text-sm">
                                                            (Leave it blank to not update)
                                                        </span>
                                                    </Dialog.Description>
                                                    <fieldset className="mt-3 flex flex-col gap-1.5">
                                                        <label
                                                            className="font-medium text-black/75"
                                                            htmlFor="name">
                                                            Name
                                                        </label>
                                                        <input className="input" id="name" />
                                                    </fieldset>

                                                    <fieldset className="mt-3 flex flex-col gap-1.5">
                                                        <label
                                                            className="font-medium text-black/75"
                                                            htmlFor="username">
                                                            Username
                                                        </label>
                                                        <input
                                                            className="input"
                                                            id="username"
                                                        />
                                                    </fieldset>

                                                    <fieldset className="mt-3 flex flex-col gap-1.5">
                                                        <label
                                                            className="font-medium text-black/75"
                                                            htmlFor="username">
                                                            Bio
                                                        </label>
                                                        <textarea
                                                            rows={4}
                                                            type="text"
                                                            id="description"
                                                            className="input w-full"
                                                        />
                                                    </fieldset>

                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            marginTop: 25,
                                                            justifyContent: "flex-end",
                                                        }}>
                                                        <Dialog.Close asChild>
                                                            <button className="rounded-full bg-black px-5 py-1 text-sm font-medium text-white">
                                                                Save changes
                                                            </button>
                                                        </Dialog.Close>
                                                    </div>
                                                    <Dialog.Close asChild>
                                                        <img
                                                            src="/assets/icons/close.svg"
                                                            className="fixed right-4 top-4 rounded-full border-2 bg-white p-1 hover:cursor-pointer sm:right-8 sm:top-6"
                                                            aria-label="Close"
                                                        />
                                                    </Dialog.Close>
                                                </Dialog.Content>
                                            </Dialog.Portal>
                                        </Dialog.Root>
                                    </div>
                                ) : creatorDetails.type === "organization" &&
                                  creatorDetails.owner === userDetails.value.id ? (
                                    <div className="flex flex-col overflow-hidden rounded border">
                                        <div className="flex flex-col items-center gap-4 border-b px-4 py-4 text-sm text-gray-800 sm:flex-row sm:gap-1.5 sm:px-8 sm:py-3">
                                            <span>
                                                Your are owner of the{" "}
                                                <Link
                                                    to="/organization/new-yorker"
                                                    className="font-medium underline">
                                                    {creatorDetails.name}
                                                </Link>{" "}
                                                organization
                                            </span>
                                            <Link
                                                to="/dashboard/organization-settings"
                                                className="ml-auto rounded-full bg-rose-100 px-6 py-1 font-medium text-rose-800">
                                                Go to organization settings
                                            </Link>
                                        </div>
                                        <div className="flex flex-col gap-5 px-6 py-6 sm:px-10"></div>
                                    </div>
                                ) : null}
                            </>
                        )}
                    </Tabs.Content>
                    {creatorDetails && creatorDetails.type === "individual" && (
                        <>
                            <Tabs.Content value="billing">
                                <Billing />
                            </Tabs.Content>
                            <Tabs.Content value="team">
                                <Team />
                            </Tabs.Content>
                        </>
                    )}
                </div>
            </Tabs.Root>
        </div>
    )
}

export default DashboardSettings
