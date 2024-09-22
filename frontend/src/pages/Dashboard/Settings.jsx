import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useSignalEffect } from "@preact/signals-react"
import * as Dialog from "@radix-ui/react-dialog"
import * as Tabs from "@radix-ui/react-tabs"
import clsx from "clsx"

import { creatorInfo } from "@/signals/creator"
import axiosInstance from "@/axios"

import { fetchCreatorInfo } from "@/pages/Dashboard/Layout"
import Billing from "@/components/Dashboard/Billing"
import Team from "@/components/Dashboard/Team"

function DashboardSettings() {
    const location = useLocation()

    const [creatorDetails, setCreatorDetails] = useState(null)
    const [user, setUser] = useState(null)
    const [activeTab, setActiveTab] = useState(window.innerWidth > 640 ? "general" : "")

    useSignalEffect(() => {
        setCreatorDetails(creatorInfo.value)
        setUser(creatorInfo.value.user)
    })

    useEffect(() => {
        if (window.innerWidth > 640 && activeTab === "") {
            setActiveTab("general")
        }
    }, [activeTab, location.pathname])

    useEffect(() => {
        console.log(creatorDetails)
    }, [creatorDetails])

    const handleEditDescription = () => {
        const description = prompt("Enter description")
        if (description) {
            axiosInstance
                .post(`creator/dashboard/contributor/description`, {
                    description,
                })
                .then((res) => {
                    fetchCreatorInfo()
                })
                .catch((err) => {
                    console.error(err)
                    alert("Failed to update description. Please try again.")
                })
        }
    }

    return (
        <div className="mb-8 flex flex-col sm:gap-6">
            <h1 className="mt-8 border-b px-4 pb-5 text-2xl font-semibold sm:px-8">Settings</h1>
            <Tabs.Root
                className="flex flex-col gap-4 px-4 py-2 sm:flex-row sm:gap-0 sm:px-8 md:divide-x"
                value={activeTab}
                onValueChange={setActiveTab}>
                <Tabs.List
                    className={`mt-4 flex h-72 flex-col sm:mt-0 sm:max-w-48 sm:flex-1 sm:gap-1 sm:pr-5 ${
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
                                ) : creatorDetails.type === "organization" ? (
                                    <div className="flex flex-col overflow-hidden rounded border">
                                        <div className="flex flex-col items-center gap-4 border-b px-4 py-4 text-sm text-gray-800 sm:flex-row sm:gap-1.5 sm:px-8 sm:py-3">
                                            <span>
                                                You are {user.role} of the{" "}
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
                                        <div className="flex flex-col gap-5 px-6 py-6 sm:px-10">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    className="h-14 w-14 rounded-full object-cover"
                                                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${creatorDetails.user.name}`}
                                                    alt=""
                                                />
                                                <div className="flex flex-1 flex-col gap-1">
                                                    <div className="flex items-center gap-3">
                                                        <p className="text-xl font-semibold leading-7">
                                                            {creatorDetails.user.name}
                                                        </p>
                                                        <span
                                                            className={clsx(
                                                                "flex w-fit items-center gap-1 rounded-full border px-3 text-sm font-medium capitalize",
                                                                {
                                                                    "border-yellow-300 bg-yellow-50":
                                                                        user?.role === "owner",
                                                                    "border-blue-200 bg-blue-50":
                                                                        user?.role !== "owner",
                                                                },
                                                            )}>
                                                            {user?.role === "owner" ? (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    className="h-4 w-4 fill-yellow-500 text-yellow-500">
                                                                    <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
                                                                    <path d="M5 21h14" />
                                                                </svg>
                                                            ) : (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    className="h-4 w-4 fill-blue-500 text-blue-500">
                                                                    <path d="M12 20h9" />
                                                                    <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
                                                                    <path d="m15 5 3 3" />
                                                                </svg>
                                                            )}
                                                            {creatorDetails.user.role}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm leading-4 text-gray-700">
                                                        @{creatorDetails.user.id}
                                                    </span>
                                                </div>

                                                <button
                                                    className="h-fit rounded-full border bg-rose-500 px-4 py-1 text-sm font-medium text-white hover:bg-rose-600"
                                                    onClick={() => handleEditDescription()}>
                                                    Edit profile description
                                                </button>
                                            </div>
                                            <span className="flex justify-between gap-1">
                                                <span className="lg:w-2/3">
                                                    {user?.description}
                                                </span>
                                            </span>
                                        </div>
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
