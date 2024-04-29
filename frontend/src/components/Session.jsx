import { useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"

import { userDetailsUpdate } from "@/signals/user"
import { getCookie } from "@/helpers/cookies"
import axiosInstance from "@/axios"

import Loader from "@/components/ui/Loader"

export function Session({ session }) {
    const [loader, setLoader] = useState(false)
    const [actionStatus, setActionStatus] = useState()
    const [timeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)

    const removeSession = (refreshTokenId, isCurrenSession) => {
        axiosInstance
            .post("session/remove", { refreshTokenId, isCurrenSession })
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
            if (confirmLogout)
                removeSession(refreshTokenId, currentRefreshTokenId === refreshTokenId)
            else setLoader(false)
        } else {
            removeSession(refreshTokenId)
        }
    }

    const handleDoneRemoveAccess = () => {
        userDetailsUpdate.value += 1
    }

    return (
        <div className="grid w-full auto-rows-auto grid-cols-2 items-center gap-y-3 px-2 py-5 md:grid-cols-4 md:gap-0 lg:grid-cols-3 lg:py-3">
            <div className="col-span-2 lg:col-span-1">
                <span>{session.deviceInfo.deviceMetadata}</span>
                {session._id === getCookie("refreshTokenId") && (
                    <span className="flex items-center gap-1 text-sm font-normal text-gray-700">
                        <img className="h-4 w-4" src="/assets/icons/current-tick.svg" alt="" />
                        Your current session
                    </span>
                )}
            </div>
            <span className="flex flex-col text-sm text-gray-800">
                <span className="font-semibold md:hidden">First login</span>
                <div className="flex flex-col items-start gap-0">
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
            <div className="flex justify-end md:col-start-4 md:col-end-5 lg:col-start-3 lg:col-end-4 lg:justify-start">
                <Dialog.Root>
                    <Dialog.Trigger className="w-fit rounded-full bg-red-50 px-5 py-1 font-medium text-red-500 hover:bg-red-500 hover:text-white">
                        Log out
                    </Dialog.Trigger>
                    <Dialog.Portal>
                        <Dialog.Overlay className="absolute inset-0 z-40 h-full w-screen bg-black/50 opacity-100" />
                        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[85vh] w-[90vw] max-w-[475px] -translate-x-1/2 -translate-y-1/2 transform  flex-col gap-3 bg-white px-6 py-8 sm:px-8">
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
                                        The device may still access to the account for max 15
                                        minutes after log out.
                                    </Dialog.Description>
                                    <div className="flex flex-col gap-4">
                                        <div>
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
                                        <div className="flex flex-col items-start gap-0">
                                            <span className="text-sm font-medium">
                                                First login
                                            </span>
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <span className="text-base font-normal">
                                                    {new Date(session.createdAt).toLocaleString(
                                                        "en-US",
                                                        {
                                                            timeZone: timeZone,
                                                            dateStyle: "long",
                                                            timeStyle: "short",
                                                        },
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        className="ml-auto w-fit  rounded-full bg-red-500 px-5 py-1 font-medium text-white hover:bg-red-600"
                                        onClick={() => handleSessionLogout(session._id)}>
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
