import { useCallback, useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime"
import * as Tabs from "@radix-ui/react-tabs"
import { toast } from "sonner"

import { isUserCreator } from "@/signals/creator"
import { userDetails } from "@/signals/user"
import { randomGradient } from "@/helpers/ui/randomGradient"
import axiosInstance from "@/axios"

import ChangePassword from "@/components/ChangePassword"
import { Session } from "@/components/Session"
import VerifyAccount from "@/components/VerifyAccount"

function Account() {
    useSignals()
    const location = useLocation()

    const [user, setUser] = useState(userDetails.value)
    const [activeTab, setActiveTab] = useState("account")

    useSignalEffect(() => {
        setUser(userDetails.value)
    })

    useEffect(() => {
        if (location.pathname.includes("/account/subscriptions")) {
            setActiveTab("subscriptions")
        } else {
            setActiveTab("account")
        }
    }, [location.pathname])

    return (
        <div className="flex flex-col pb-10 pt-0">
            <div
                className="flex items-end gap-4 border-b pt-16 backdrop-saturate-150"
                style={{ background: randomGradient() }}>
                <div className="flex w-full flex-col gap-4 bg-gradient-to-t from-white via-white to-transparent px-4 py-4 sm:flex-row sm:items-center sm:px-16">
                    <div className="flex flex-1 flex-row items-center gap-3">
                        {user.picture ? (
                            <img
                                className="h-14 w-14 rounded-full"
                                src={`${user.picture}`}
                                alt=""
                            />
                        ) : (
                            <img
                                className="h-14 w-14 rounded-full"
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                                alt=""
                            />
                        )}
                        <div className="flex flex-col">
                            <span className="text-xl font-semibold leading-7">{user.name}</span>
                            <span className="text-sm leading-4 text-gray-700">
                                {user.email}
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 font-medium  ">0 active subscriptions</div>
                </div>
            </div>
            <Tabs.Root
                className="flex flex-col gap-4 divide-x py-2 sm:flex-row sm:gap-0 sm:px-8 sm:py-10 lg:px-16"
                value={activeTab}
                onValueChange={setActiveTab}>
                <Tabs.List
                    className="sticky top-12 flex flex-1 flex-row items-end gap-1 border-b bg-white px-2 py-2 pb-0 pt-3 sm:mr-2 sm:max-w-56 sm:flex-col sm:items-start sm:gap-2 sm:border-0 sm:py-0 sm:pr-4"
                    aria-label="manage your account">
                    <Tabs.Trigger
                        className="w-fit border border-white px-4 py-2 text-start text-sm font-medium text-gray-500 hover:bg-gray-50 sm:w-full sm:rounded sm:text-base [&[data-state='active']]:border-0 [&[data-state='active']]:border-b-2 [&[data-state='active']]:border-gray-800 [&[data-state='active']]:text-black sm:[&[data-state='active']]:border sm:[&[data-state='active']]:border-gray-200"
                        value="account"
                        asChild>
                        <Link to="/account">Account</Link>
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        className="border border-white px-4 py-2 text-start text-sm font-medium text-gray-500 hover:bg-gray-50 sm:w-fit sm:rounded sm:text-base [&[data-state='active']]:border-0 [&[data-state='active']]:border-b-2 [&[data-state='active']]:border-gray-800 [&[data-state='active']]:text-black sm:[&[data-state='active']]:border sm:[&[data-state='active']]:border-gray-200"
                        value="subscriptions"
                        asChild>
                        <Link to="/account/subscriptions">Subscriptions & payments</Link>
                    </Tabs.Trigger>
                    {isUserCreator.value && (
                        <Link
                            className="w-full px-4 py-2 text-start text-sm font-medium text-gray-500 hover:bg-black hover:text-white sm:rounded sm:text-base"
                            to="/dashboard">
                            Creator Dashboard
                        </Link>
                    )}
                </Tabs.List>
                <div className="flex-auto px-4 sm:pl-4">
                    <Tabs.Content value="account" className="flex flex-col gap-2">
                        <div className="my-2 flex flex-col gap-2 sm:mx-3">
                            <span className="text-2xl font-semibold">Authentication</span>
                            <div className="grid auto-cols-auto divide-y">
                                <div className="flex flex-1 items-center gap-4 py-4 sm:gap-0">
                                    <span className="text-base font-medium sm:flex-1">
                                        Login method:
                                    </span>
                                    <div className="flex gap-4 sm:flex-1 sm:gap-0">
                                        {user.provider === "google" && (
                                            <div className="flex items-center gap-2 rounded-full border px-6 py-1 font-normal text-gray-800">
                                                <img
                                                    className="h-5 w-5"
                                                    src="assets/icons/google.svg"
                                                    alt=""
                                                />
                                                <span>Google oauth</span>
                                            </div>
                                        )}
                                        {user.provider === "email" && (
                                            <span className="flex rounded-full border px-6 py-1 text-center font-normal leading-5 text-gray-800">
                                                Email & Password
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {user.provider === "email" && (
                                    <div className="flex items-center gap-4 py-4 sm:flex-1 sm:gap-0">
                                        <span className="text-base font-medium sm:flex-1">
                                            Password:
                                        </span>
                                        <ChangePassword />
                                    </div>
                                )}
                                <div className="flex flex-1 items-center gap-4 py-4 sm:gap-0">
                                    <span className="text-base font-medium sm:flex-1">
                                        Account status:
                                    </span>
                                    <div className="flex gap-4 sm:flex-1 sm:gap-0">
                                        {user.verified ? (
                                            <div className="flex items-center gap-2 rounded-full border px-6 py-1 font-normal text-gray-800">
                                                <img
                                                    className="h-5 w-5"
                                                    src="assets/icons/verified-email.svg"
                                                    alt=""
                                                />
                                                <span>Verified</span>
                                            </div>
                                        ) : (
                                            <VerifyAccount />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="my-2 flex flex-col gap-2 sm:mx-3">
                            <span className="text-2xl font-semibold">Your devices</span>
                            <div className="grid auto-cols-auto divide-y">
                                <div className="hidden w-full grid-rows-1 px-2 py-3 text-base font-semibold md:grid md:grid-cols-4 lg:grid-cols-3">
                                    <span className="md:col-span-2 lg:col-span-1">Device</span>
                                    <span>First login</span>
                                    <span></span>
                                </div>
                                {user.refreshTokens &&
                                    user.refreshTokens.map((session) => (
                                        <Session session={session} key={session._id} />
                                    ))}
                            </div>
                            <span className="text-sm">*OS version maynot be accurate</span>
                        </div>
                    </Tabs.Content>
                    <Tabs.Content value="subscriptions">
                        <Subscriptions />
                    </Tabs.Content>
                </div>
            </Tabs.Root>
        </div>
    )
}

const Subscriptions = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [subscriptions, setSubscriptions] = useState([])

    // Fetch subscriptions when the component is mounted.
    const getSubscriptions = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await axiosInstance.get("user/subscriptions")
            console.log(response.data)
            setSubscriptions(response.data.subscriptions)
        } catch (error) {
            console.error("Error fetching subscriptions:", error)
            setError("Failed to fetch subscriptions. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }, [])

    const handleUnsubscribe = async (id, plan, createdAt) => {
        const startDate = new Date(createdAt)
        let endDate

        if (plan === "annual") {
            endDate = new Date(startDate)
            endDate.setFullYear(startDate.getFullYear() + 1)
        } else if (plan === "monthly") {
            endDate = new Date(startDate)
            endDate.setMonth(startDate.getMonth() + 1)
        }

        const formattedEndDate = endDate.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        })

        const confirmationMessage = `You have a ${plan} plan. Your subscription will remain active until ${formattedEndDate}. Type 'YES' to unsubscribe`
        const confirmation = window.prompt(confirmationMessage)

        if (confirmation.toLowerCase() === "yes") {
            try {
                const response = await axiosInstance.post(`creator/${id}/unsubscribe`)
                toast.success(response.data.message + ". You will not be charged any further.")

                setSubscriptions((prevSubscriptions) =>
                    prevSubscriptions.filter((subscription) => subscription.creatorId !== id),
                )
            } catch (error) {
                console.error("Error unsubscribing:", error)
                toast.error("Failed to unsubscribe. Please try again.")
            }
        } else {
            toast.info("Unsubscribing cancelled")
        }
    }

    useEffect(() => {
        getSubscriptions()
    }, [getSubscriptions])

    if (isLoading) {
        return <div className="text-center">Loading subscriptions...</div>
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>
    }

    return (
        <div className="my-2 flex flex-col gap-2 sm:mx-3">
            <span className="mb-2 text-2xl font-semibold">Subscriptions</span>
            <div>
                {subscriptions && subscriptions.length > 0 ? (
                    <div className="flex h-96 flex-col gap-4 overflow-y-scroll rounded border">
                        {subscriptions.map((subscription, index) => (
                            <div key={index} className="border-b bg-white px-6 py-4">
                                <div className="b flex flex-col gap-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <Link
                                            to={`/creator/{}`}
                                            className="flex w-fit items-center gap-2 rounded-full border p-1 pr-5">
                                            <img
                                                className="h-8 w-8 rounded-full"
                                                src={subscription.displayPicture.small}
                                                alt={`${subscription.creatorName}'s profile`}
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-xl font-semibold leading-7">
                                                    {subscription.creatorName}
                                                </span>
                                            </div>
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleUnsubscribe(
                                                    subscription.creatorId,
                                                    subscription.plan,
                                                    subscription.createdAt,
                                                )
                                            }
                                            className="flex h-fit w-fit items-center justify-center rounded-full border border-red-500 px-4 py-0.5 text-base font-medium text-red-600 hover:bg-red-50">
                                            Unsubscribe
                                        </button>
                                    </div>

                                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                        <div className="text-sm text-gray-600">
                                            Plan:{" "}
                                            <span className="font-medium capitalize text-black">
                                                {subscription.plan}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Subscribed on:{" "}
                                            <span className="font-medium text-black">
                                                {new Date(
                                                    subscription.createdAt,
                                                ).toLocaleDateString("en-GB", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex h-96 flex-col items-center justify-center gap-4 overflow-y-scroll rounded border">
                        <div className="flex flex-col bg-white px-6 py-4 text-center">
                            <span className="bg-gradient-to-br from-rose-400 to-rose-600 bg-clip-text pt-1 text-3xl font-extrabold uppercase leading-none text-transparent">
                                No subscriptions
                            </span>
                            <span className="mt-1 text-gray-700">
                                You are not subscribed to any creators.
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Account
