import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useSignalEffect } from "@preact/signals-react"

import { creatorInfo } from "@/signals/creator"
import axiosInstance from "@/axios"

import RequestsTable from "@/components/Dashboard/RequestTable"

import Loader from "@/ui/Loader"

const InviteCodeTimer = ({ expiryTime, onExpire }) => {
    const [timeRemaining, setTimeRemaining] = useState(null)

    useEffect(() => {
        if (!expiryTime) return

        const calculateTimeRemaining = () => {
            const now = new Date().getTime()
            const distance = expiryTime - now

            if (distance <= 0) {
                onExpire()
                return null
            }

            return {
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            }
        }

        const interval = setInterval(() => {
            setTimeRemaining(calculateTimeRemaining())
        }, 1000)

        return () => clearInterval(interval)
    }, [expiryTime, onExpire])

    if (!timeRemaining) return null

    return (
        <span className="ml-4 text-sm font-medium text-gray-700">
            Code expires in{" "}
            <span className="font-semibold text-rose-500">
                {timeRemaining.minutes} min {timeRemaining.seconds} sec
            </span>
        </span>
    )
}

function JoinRequests() {
    const [inviteCode, setInviteCode] = useState(null)
    const [loading, setLoading] = useState(true)
    const [expiryTime, setExpiryTime] = useState(null)
    const [joinRequests, setJoinRequests] = useState(null)
    const [error, setError] = useState(null)

    const fetchInviteCode = useCallback(async () => {
        try {
            const response = await axiosInstance.get("/creator/dashboard/invite-code")
            if (response.data.invite) {
                setInviteCode(response.data.invite.code)
                setExpiryTime(new Date(response.data.invite.expiresAt).getTime())
            }
        } catch (error) {
            console.error("Error fetching invite code:", error)
            setError("Failed to fetch invite code. Please try again.")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchInviteCode()
    }, [fetchInviteCode])

    useSignalEffect(() => {
        if (creatorInfo.value) {
            setJoinRequests(creatorInfo.value.joinRequests)
        }
    })

    const generateInviteCode = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await axiosInstance.post("/creator/dashboard/invite-code/generate")
            if (response.data.code) {
                setInviteCode(response.data.code)
                setExpiryTime(new Date(response.data.expiresAt).getTime())
            }
        } catch (error) {
            console.error("Error generating invite code:", error)
            setError("Failed to generate invite code. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = () => {
        if (inviteCode) {
            navigator.clipboard.writeText(inviteCode)
            alert("Invite code copied to clipboard!")
        }
    }

    const handleExpire = useCallback(() => {
        setInviteCode(null)
        setExpiryTime(null)
    }, [])

    const memoizedRequestsTable = useMemo(
        () => <RequestsTable requests={joinRequests} loading={!joinRequests} />,
        [joinRequests],
    )

    return (
        <div className="flex flex-col gap-4 rounded border px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold">Add people to your organization</h2>
                <p className="text-sm text-gray-500">
                    You can add people to your organization by sharing the invite code
                </p>
            </div>
            <div className="flex h-fit flex-col justify-center gap-2">
                {loading ? (
                    <div className="relative h-52 w-full overflow-hidden">
                        <div className="absolute right-0 top-0 z-50 flex h-full w-full items-center justify-center bg-white/80 backdrop-blur-[2px]">
                            <Loader />
                        </div>
                    </div>
                ) : inviteCode ? (
                    <>
                        <div className="flex h-fit items-center gap-2">
                            <span className="w-fit rounded border bg-gray-50 px-4 py-1 text-2xl font-medium">
                                {inviteCode}
                            </span>
                            <button
                                className="h-fit rounded-md bg-rose-500 px-2 py-0.5 text-xs font-medium text-white"
                                onClick={copyToClipboard}>
                                Copy
                            </button>
                            <InviteCodeTimer expiryTime={expiryTime} onExpire={handleExpire} />
                        </div>
                    </>
                ) : (
                    <button
                        className="h-fit w-fit rounded-md bg-green-500 px-2 py-0.5 font-medium text-white"
                        onClick={generateInviteCode}>
                        Generate Invite Code
                    </button>
                )}
                <span className="text-xs">*Valid for only 5 minutes once generated</span>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <hr className="my-2" />
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold">Join requests</h2>
                <span className="text-sm text-gray-500">
                    Allow people to add them to your Organization{" "}
                    <i className="text-gray-700">(Only role available for now is Author)</i>
                </span>
                <div className="w-full">{memoizedRequestsTable}</div>
            </div>
        </div>
    )
}

export default JoinRequests
