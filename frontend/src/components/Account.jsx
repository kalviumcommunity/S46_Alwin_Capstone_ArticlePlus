import { userDetails } from "@/signals/user"
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime"
import { useState } from "react"
import * as Tabs from "@radix-ui/react-tabs"
import ChangePassword from "@/components/ChangePassword"

function Account() {
    useSignals()

    const [user, setUser] = useState(userDetails.value)
    const [gradient, setGradient] = useState("")

    useSignalEffect(() => {
        randomGradient()
        setUser(userDetails.value)
    })

    const randomGradient = () => {
        const colors = [
            "#FFEFD5",
            "#E9F5DB",
            "#D5F5E3",
            "#E0FFFF",
            "#FAFAD2",
            "#FFF5EE",
            "#F0F8FF",
            "#F5F5DC",
        ]
        const randomColor1 = colors[Math.floor(Math.random() * colors.length)]
        const randomColor2 = colors[Math.floor(Math.random() * colors.length)]
        const randomGradient = `linear-gradient(to right, ${randomColor1}, ${randomColor2})`
        setGradient(randomGradient)
    }

    return (
        <div className="flex flex-col pt-0">
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
                            <span className="text-xl font-semibold leading-7">
                                {user.name}
                            </span>
                            <span className="text-sm leading-4 text-gray-800 opacity-90">
                                {user.email}
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 font-medium">
                        0 active memberships
                    </div>
                </div>
            </div>
            <Tabs.Root
                className="flex divide-x py-10 sm:px-16"
                defaultValue="tab1">
                <Tabs.List
                    className="gap mr-3 flex max-w-56 flex-1 flex-col items-start"
                    aria-label="Manage your account">
                    <Tabs.Trigger
                        className="w-full px-4 py-2 text-start font-medium text-gray-500 hover:bg-slate-50 [&[data-state='active']]:text-black"
                        value="tab1">
                        Account
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        className="w-full px-4 py-2 text-start font-medium text-gray-500 hover:bg-slate-50 [&[data-state='active']]:text-black"
                        value="tab2">
                        Purchases and memberships
                    </Tabs.Trigger>
                </Tabs.List>
                <div className="flex-auto pl-4" z>
                    <Tabs.Content value="tab1">
                        <div className="mx-4 my-2 flex flex-col gap-3">
                            <span className="mb-2 text-2xl font-semibold">
                                Authentication
                            </span>
                            <div className="grid auto-cols-auto divide-y">
                                <div className="flex flex-1 py-4">
                                    <span className="flex-1 text-base font-medium">
                                        Login method:
                                    </span>
                                    <div className="flex flex-1 gap-4">
                                        {user.provider === "google" && (
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <img
                                                    className="h-5 w-5"
                                                    src="assets/icons/google.svg"
                                                    alt=""
                                                />
                                                <span>Google oauth</span>
                                            </div>
                                        )}
                                        {user.provider === "email" && (
                                            <div className="flex text-gray-700">
                                                <span>Email & Password</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {user.provider === "email" && (
                                    <div className="flex flex-1 items-center py-4">
                                        <span className="flex-1 text-base font-medium">
                                            Password:
                                        </span>
                                        <ChangePassword />
                                    </div>
                                )}
                            </div>
                        </div>
                    </Tabs.Content>
                    <Tabs.Content value="tab2">
                        <div className=" mx-4 my-2 flex flex-col gap-2">
                            <span className="mb-2 text-2xl font-semibold">
                                Memberships
                            </span>
                        </div>
                    </Tabs.Content>
                </div>
            </Tabs.Root>
        </div>
    )
}

export default Account
