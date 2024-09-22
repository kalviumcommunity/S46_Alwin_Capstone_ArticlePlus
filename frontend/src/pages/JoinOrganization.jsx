import React, { useState } from "react"
import { Link } from "react-router-dom"

import axiosInstance from "@/axios"

const defaultMessage = { active: false, success: false, message: "" }

function JoinOrganization() {
    const [inviteCode, setInviteCode] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState(defaultMessage)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage(defaultMessage)

        try {
            const response = await axiosInstance.post("/creator/onboarding/join-organization", {
                inviteCode,
            })
            setMessage({
                active: true,
                success: true,
                message: `Request sent to ${response.data.creatorName}. You will have access to their dashboard once they approve.`,
            })
        } catch (error) {
            setMessage({
                active: true,
                success: false,
                message:
                    error.response?.data?.message || "An error occurred. Please try again.",
            })
        } finally {
            setIsLoading(false)
            setInviteCode("")
        }
    }

    return (
        <div className="wrapper flex flex-col items-center">
            <div className="my-12 flex w-full flex-col gap-1 sm:w-1/2 lg:w-1/3">
                <h1 className="mb-3 text-3xl font-bold">Join Organization</h1>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <label htmlFor="inviteCode" className="mb-2 block font-medium">
                        Enter your organization's invite code:
                    </label>
                    <input
                        type="text"
                        id="inviteCode"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        placeholder="Enter invite code here"
                        className="input w-full"
                        required
                    />
                    <span className="mt-2 text-xs font-normal text-gray-700">
                        You can reach out to your organization's admin to get the invite code.
                    </span>
                    <button
                        type="submit"
                        className="ml-auto mt-4 w-fit rounded-full bg-rose-500 px-6 py-1.5 font-medium text-white"
                        disabled={isLoading}>
                        {isLoading ? "Joining..." : "Join"}
                    </button>
                </form>
                {message.active && (
                    <div
                        className={`mt-4 rounded border p-4 text-base font-medium ${
                            message.success
                                ? "border-green-100 bg-green-50 text-green-700"
                                : "border-red-100 bg-red-50 text-red-700"
                        }`}>
                        {message.message}
                    </div>
                )}

                <div className="mt-6 flex w-full flex-col justify-center">
                    <hr className="mb-8 w-full" />
                    <div className="flex flex-col items-center">
                        <p className="text-sm">New creator or organization?</p>
                        <Link
                            to="/onboarding"
                            className="text-sm font-semibold text-rose-500 underline decoration-wavy">
                            Become a creator
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JoinOrganization
