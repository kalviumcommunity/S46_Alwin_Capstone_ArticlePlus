import { userDetails, userDetailsUpdate } from "@/signals/user"
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime"
import { useState } from "react"
import * as Tabs from "@radix-ui/react-tabs"
import * as Dialog from "@radix-ui/react-dialog"
import ChangePassword from "@/components/ChangePassword"
import axiosInstance from "@/axios"
import { getCookie } from "@/helpers/cookies"
import Loader from "./Loader"

function Session({ session }) {
    const [loader, setLoader] = useState(false)
    const [actionStatus, setActionStatus] = useState()
    const [timeZone] = useState(
        Intl.DateTimeFormat().resolvedOptions().timeZone,
    )

    const removeSession = (refreshTokenId) => {
        axiosInstance
            .patch("session/remove", { refreshTokenId })
            .then((res) => setActionStatus(res.data))
            .catch((err) => setActionStatus(err.response.data))
            .finally(() => setLoader(false))
    }

    const handleSessionLogout = (refreshTokenId) => {
        setLoader(true)
        const currentRefreshTokenId = getCookie("refreshTokenId")
        if (currentRefreshTokenId === refreshTokenId) {
            const confirmLogout = confirm(
                "This session is your current device. Are you sure you want to log out?",
            )
            if (confirmLogout) removeSession(refreshTokenId)
            else setLoader(false)
        } else {
            removeSession(refreshTokenId)
        }
    }

    const handleDoneRemoveAccess = () => {
        userDetailsUpdate.value += 1
    }

    return (
        <div className="grid w-full auto-rows-auto grid-cols-2 items-center gap-2 px-2 py-5 md:grid-cols-4 md:gap-0 lg:grid-cols-3 lg:py-3">
            <div className="col-span-2 lg:col-span-1">
                <span>{session.deviceInfo.deviceMetadata}</span>
                {session._id === getCookie("refreshTokenId") && (
                    <span className="flex items-center gap-1 text-sm font-normal text-gray-700">
                        <img
                            className="h-4 w-4"
                            src="/assets/icons/current-tick.svg"
                            alt=""
                        />
                        Your current session
                    </span>
                )}
            </div>
            <span className="flex flex-col text-sm text-gray-800">
                <span className="font-medium md:hidden">First login</span>
                <div className="flex items-center gap-2 md:flex-col md:items-start md:gap-0">
                    <span className="text-base font-normal">
                        {new Date(session.createdAt).toLocaleString("en-US", {
                            timeZone: timeZone,
                            dateStyle: "long",
                        })}
                    </span>
                    <span className="text-sm">
                        {new Date(session.createdAt).toLocaleString("en-US", {
                            timeZone: timeZone,
                            timeStyle: "short",
                        })}
                    </span>
                </div>
            </span>
            <div className="mt-auto flex justify-end sm:mt-0 lg:justify-start">
                <Dialog.Root>
                    <Dialog.Trigger className="w-fit rounded-full bg-red-50 px-5 py-1 font-medium text-red-500 hover:bg-red-500 hover:text-white">
                        Log out
                    </Dialog.Trigger>
                    <Dialog.Portal>
                        <Dialog.Overlay className="absolute inset-0 z-40 h-full w-screen bg-black/50 opacity-100" />
                        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[85vh] w-[90vw] max-w-[475px] -translate-x-1/2 -translate-y-1/2 transform  flex-col gap-3 rounded-sm bg-white px-6 py-8 sm:px-8">
                            {loader ? (
                                <div className="-mb-20 -mt-10">
                                    <Loader />
                                </div>
                            ) : actionStatus ? (
                                <div className="-mb-1 flex min-h-36 flex-col items-start justify-center">
                                    <Dialog.Title className="text-lg font-semibold">
                                        Remove access
                                    </Dialog.Title>
                                    <div className="my-6 mt-4 flex flex-col items-start gap-1">
                                        <span className="text-base text-gray-700">
                                            {actionStatus.message}
                                        </span>
                                    </div>
                                    <Dialog.Close
                                        className="ml-auto mt-4 rounded-full bg-rose-500 px-6 py-1 font-semibold text-white"
                                        onClick={handleDoneRemoveAccess}>
                                        Done
                                    </Dialog.Close>
                                    <Dialog.Close asChild>
                                        <img
                                            src="/assets/icons/close.svg"
                                            className="fixed right-4 top-4 rounded-full border-2 bg-white p-1 hover:cursor-pointer sm:right-5 sm:top-5"
                                        />
                                    </Dialog.Close>
                                </div>
                            ) : (
                                <>
                                    <Dialog.Title className="text-lg font-semibold">
                                        Remove access
                                    </Dialog.Title>
                                    <Dialog.Description className="text-sm text-gray-700">
                                        The device may still access to the
                                        account for max 15 minutes after log
                                        out.
                                    </Dialog.Description>
                                    <div className="flex flex-col gap-4">
                                        <div className="col-span-2 lg:col-span-1">
                                            <span>
                                                {
                                                    session.deviceInfo
                                                        .deviceMetadata
                                                }
                                            </span>
                                            {session._id ===
                                                getCookie("refreshTokenId") && (
                                                <span className="flex items-center gap-1 text-sm font-normal text-gray-700">
                                                    <img
                                                        className="h-4 w-4"
                                                        src="/assets/icons/current-tick.svg"
                                                        alt=""
                                                    />
                                                    Your current session
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-start gap-0">
                                            <span className="text-sm font-medium">
                                                First login
                                            </span>
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <span className="text-base font-normal">
                                                    {new Date(
                                                        session.createdAt,
                                                    ).toLocaleString("en-US", {
                                                        timeZone: timeZone,
                                                        dateStyle: "long",
                                                        timeStyle: "short",
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        className="ml-auto w-fit  rounded-full bg-red-500 px-5 py-1 font-medium text-white hover:bg-red-600"
                                        onClick={() =>
                                            handleSessionLogout(session._id)
                                        }>
                                        Log out
                                    </button>
                                    <Dialog.Close asChild>
                                        <img
                                            src="/assets/icons/close.svg"
                                            className="fixed right-4 top-4 rounded-full border-2 bg-white p-1 hover:cursor-pointer sm:right-5 sm:top-5"
                                        />
                                    </Dialog.Close>
                                </>
                            )}
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
            </div>
        </div>
    )
}

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
                className="flex flex-col gap-2 divide-x py-2 sm:flex-row sm:gap-0 sm:px-8 sm:py-10 lg:px-16"
                defaultValue="tab1">
                <Tabs.List
                    className="flex flex-1 flex-row items-start gap-2 px-2 py-2 sm:mr-2 sm:max-w-56 sm:flex-col sm:px-4 sm:py-0"
                    aria-label="Manage your account">
                    <Tabs.Trigger
                        className="w-fit border-b-2 border-white px-4 py-2 text-start text-sm font-medium text-gray-500 hover:bg-slate-50 sm:w-full sm:text-base [&[data-state='active']]:border-b-2 [&[data-state='active']]:border-gray-200 [&[data-state='active']]:bg-gray-50 [&[data-state='active']]:text-black"
                        value="tab1">
                        Account
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        className="w-fit border-b-2 border-white  px-4 py-2 text-start text-sm font-medium text-gray-500 hover:bg-slate-50 sm:w-full sm:text-base [&[data-state='active']]:border-b-2 [&[data-state='active']]:bg-gray-50 [&[data-state='active']]:text-black"
                        value="tab2">
                        Purchases and memberships
                    </Tabs.Trigger>
                </Tabs.List>
                <div className="flex-auto px-4 sm:pl-4">
                    <Tabs.Content value="tab1" className="flex flex-col gap-2">
                        <div className="my-2 flex flex-col gap-3 sm:mx-4">
                            <span className="text-2xl font-semibold">
                                Authentication
                            </span>
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
                            <span className="text-2xl font-semibold">
                                Your devices
                            </span>
                            <div className="grid auto-cols-auto divide-y">
                                <div className="hidden w-full grid-rows-1 px-2 py-3 text-base font-semibold md:grid md:grid-cols-4 lg:grid-cols-3">
                                    <span className="md:col-span-2 lg:col-span-1">
                                        Device
                                    </span>
                                    <span>First login</span>
                                    <span></span>
                                </div>
                                {user.refreshTokens &&
                                    user.refreshTokens.map((session) => (
                                        <Session
                                            session={session}
                                            key={session._id}
                                        />
                                    ))}
                            </div>
                            <span className="text-sm">
                                *OS version maynot be accurate
                            </span>
                        </div>
                    </Tabs.Content>
                    <Tabs.Content value="tab2">
                        <div className="my-2 flex flex-col gap-2 sm:mx-4">
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
