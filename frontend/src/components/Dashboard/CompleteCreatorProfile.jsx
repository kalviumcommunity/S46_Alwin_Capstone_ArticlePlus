import { useEffect, useState } from "react"
import { useSignals } from "@preact/signals-react/runtime"
import clsx from "clsx"

import { creatorInfo } from "@/signals/creator"
import axiosInstance from "@/axios"

import { fetchCreatorInfo } from "@/pages/Dashboard/Layout"

function CompleteCreatorProfile() {
    useSignals()

    const [creatorDetails, setCreatorDetails] = useState(creatorInfo.value)

    useEffect(() => {
        setCreatorDetails(creatorInfo.value)
    }, [creatorInfo.value])

    const handleUpdateID = async () => {
        const newID = window.prompt("Enter a new ID:")
        if (newID && newID !== creatorDetails.user?.id) {
            try {
                await axiosInstance.post(`/creator/dashboard/contributor/id`, { id: newID })
                alert("ID updated successfully")
                fetchCreatorInfo()
            } catch (error) {
                console.error("Failed to update ID:", error)
                alert(error.response.data.message || "Failed to update ID. Please try again.")
            }
        }
    }

    const handleAddDescription = async () => {
        const newDescription = window.prompt("Enter your description:")
        if (newDescription) {
            try {
                await axiosInstance.post("/creator/dashboard/contributor/description", {
                    description: newDescription,
                })
                alert("Description updated successfully")
                fetchCreatorInfo()
            } catch (error) {
                console.error("Failed to add description:", error)
                alert("Failed to add description. Please try again.")
            }
        }
    }

    const handleActivate = async () => {
        try {
            await axiosInstance.post("/creator/dashboard/contributor/activate")
            alert("Contributor activated successfully")
            fetchCreatorInfo()
        } catch (error) {
            console.error("Failed to activate contributor:", error)
            alert(
                error.response.data.message ||
                    "Failed to activate contributor. Please try again.",
            )
        }
    }

    return (
        <div className="flex flex-col justify-center p-8">
            <h1 className="text-2xl font-semibold">Welcome to the dashboard!</h1>
            <p className="text-sm text-gray-600">
                Before you can start using the dashboard, you need to complete your profile.
            </p>
            <div className="mt-6 flex gap-4 rounded border p-4 sm:px-6">
                <img
                    className="h-14 w-14 rounded-full object-cover"
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${creatorDetails.user?.name}`}
                    alt=""
                />
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <p className="text-xl font-semibold leading-7">
                            {creatorDetails.user?.name}
                        </p>
                        {creatorDetails.user?.id && (
                            <span className="text-base leading-4 text-gray-500">
                                @{creatorDetails.user?.id}
                            </span>
                        )}
                    </div>
                    <span
                        className={clsx(
                            "flex w-fit items-center gap-1 rounded-full border px-3 text-sm font-medium capitalize",
                            {
                                "border-yellow-300 bg-yellow-50":
                                    creatorDetails.user?.role === "owner",
                                "border-blue-200 bg-blue-50":
                                    creatorDetails.user?.role !== "owner",
                            },
                        )}>
                        {creatorDetails.user?.role}
                    </span>
                </div>
            </div>
            <div className="mt-3 rounded border sm:px-6">
                <div className="mb-3 mt-6 flex flex-col px-2">
                    <div className="flex items-center gap-5 ">
                        <span className="font-medium leading-4">Set your ID</span>
                        <button
                            onClick={handleUpdateID}
                            className="rounded-full bg-rose-500 px-4 py-0.5 text-sm font-medium text-white hover:bg-rose-600">
                            {creatorDetails.user?.id ? "Update ID" : "Set an ID"}
                        </button>
                    </div>
                    {creatorDetails.user?.id && (
                        <span className="mt-4 text-sm text-gray-600">
                            Your page will be at{" "}
                            <span className="font-medium text-black underline">
                                articleplus.alwinsunil.in/{creatorDetails.id}/
                                {creatorDetails.user?.id}
                            </span>
                        </span>
                    )}
                    <span className="mb-2 mt-4 flex w-fit gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-1 text-sm font-medium text-red-700">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4" />
                            <path d="M12 8h.01" />
                        </svg>
                        You cannot change your ID after you have created your profile.
                    </span>
                </div>
                <hr />
                <div className="my-6 flex flex-col gap-2">
                    <div className="flex items-center gap-5 px-2">
                        <span className="font-medium leading-4">
                            {creatorDetails.user?.description
                                ? "Update description"
                                : "Add description to your profile"}
                        </span>
                        <button
                            onClick={handleAddDescription}
                            className="rounded-full bg-rose-500 px-4 py-0.5 text-sm font-medium text-white hover:bg-rose-600">
                            {creatorDetails.user?.description
                                ? "Update description"
                                : "Add description"}
                        </button>
                    </div>
                    {creatorDetails.user?.description && (
                        <span className="mt-2 w-fit rounded border bg-gray-50 px-2 py-1 text-gray-700 lg:w-2/3">
                            {creatorDetails.user?.description}
                        </span>
                    )}
                </div>
            </div>
            <div className="mt-3 flex items-center justify-center gap-3 rounded border py-4 sm:px-6">
                <span className="font-medium">Activate your author profile</span>
                <button
                    className="flex w-fit items-center gap-2 rounded-full bg-green-500 py-1.5 pl-2 pr-4 font-medium leading-5 text-white hover:bg-green-600"
                    onClick={handleActivate}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                        <path d="m9 11 3 3L22 4" />
                    </svg>
                    Activate
                </button>
            </div>
        </div>
    )
}

export default CompleteCreatorProfile
