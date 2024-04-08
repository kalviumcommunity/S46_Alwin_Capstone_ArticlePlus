import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime"
import * as Tabs from "@radix-ui/react-tabs"

import { userDetails } from "@/signals/user"
import { randomGradient } from "@/utils/ui/randomGradient"

import ChangePassword from "@/components/ChangePassword"
import { Session } from "@/components/Session"

function Account() {
    useSignals()
    const location = useLocation()

    const [user, setUser] = useState(userDetails.value)
    const [gradient, setGradient] = useState("")
    const [activeTab, setActiveTab] = useState("account")

    useSignalEffect(() => {
        randomGradient(setGradient)
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
                style={{ background: gradient }}>
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
                            <span className="text-sm leading-4 text-gray-800 opacity-90">
                                {user.email}
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 font-medium">0 active subscriptions</div>
                </div>
            </div>
            <Tabs.Root
                className="flex flex-col gap-4 divide-x py-2 sm:flex-row sm:gap-0 sm:px-8 sm:py-10 lg:px-16"
                value={activeTab}
                onValueChange={setActiveTab}>
                <Tabs.List
                    className="sticky top-12 flex flex-1 flex-row items-start gap-2 border-b bg-white px-2 py-2 pb-0 pt-3 sm:mr-2 sm:max-w-56 sm:flex-col sm:border-0 sm:px-4 sm:py-0"
                    aria-label="manage your account">
                    <Tabs.Trigger
                        className="w-fit rounded border border-white px-4 py-2 text-start text-sm font-medium text-gray-600 hover:bg-gray-50 sm:w-full sm:text-base [&[data-state='active']]:border-0 [&[data-state='active']]:border-b-2 [&[data-state='active']]:border-gray-800 [&[data-state='active']]:text-black sm:[&[data-state='active']]:border sm:[&[data-state='active']]:border-gray-200"
                        value="account"
                        asChild>
                        <Link to="/account">Account</Link>
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        className="w-fit rounded border border-white px-4 py-2 text-start text-sm font-medium text-gray-600 hover:bg-gray-50 sm:w-full sm:text-base [&[data-state='active']]:border-0 [&[data-state='active']]:border-b-2 [&[data-state='active']]:border-gray-800 [&[data-state='active']]:text-black sm:[&[data-state='active']]:border sm:[&[data-state='active']]:border-gray-200"
                        value="subscriptions"
                        asChild>
                        <Link to="/account/subscriptions">Subscriptions and payments</Link>
                    </Tabs.Trigger>
                </Tabs.List>
                <div className="flex-auto px-4 sm:pl-4">
                    <Tabs.Content value="account" className="flex flex-col gap-2">
                        <div className="my-2 flex flex-col gap-2 sm:mx-4">
                            <span className="text-2xl font-semibold">Authentication</span>
                            <div className="grid auto-cols-auto divide-y">
                                <div className="flex flex-1 items-center gap-4 py-4 sm:gap-0">
                                    <span className="text-base font-medium sm:flex-1">
                                        Login method:
                                    </span>
                                    <div className="flex gap-4 sm:flex-1 sm:gap-0">
                                        {user.provider === "google" && (
                                            <div className="flex items-center gap-2 rounded-full border px-6 py-1 font-medium text-gray-700">
                                                <img
                                                    className="h-5 w-5"
                                                    src="assets/icons/google.svg"
                                                    alt=""
                                                />
                                                <span>Google oauth</span>
                                            </div>
                                        )}
                                        {user.provider === "email" && (
                                            <span className="flex rounded-full border px-6 py-1 text-center font-medium leading-5 text-gray-700">
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
                            </div>
                        </div>
                        <div className="my-2 flex flex-col gap-3 sm:mx-4">
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
                        <div className="my-2 flex flex-col gap-2 sm:mx-4">
                            <span className="mb-2 text-2xl font-semibold">Subscriptions</span>
                        </div>
                    </Tabs.Content>
                </div>
            </Tabs.Root>
        </div>
    )
}

export default Account
