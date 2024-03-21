import * as Dialog from "@radix-ui/react-dialog"
import { useForm } from "react-hook-form"
import axiosInstance from "@/axios"
import { useState } from "react"
import Loader from "./Loader"

function ChangePassword() {
    const [resetStatus, setResetStatus] = useState()
    const [loader, setLoader] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm()

    const onSubmit = (data) => {
        setLoader(true)
        axiosInstance
            .patch("auth/reset-password", data)
            .then((res) => {
                setResetStatus(res.data)
            })
            .catch((err) => setResetStatus(err.response.data))
            .finally(() => setLoader(false))
    }

    const handleTryAgain = () => {
        setResetStatus()
        setLoader(false)
        reset()
    }

    return (
        <Dialog.Root>
            <div className="flex-1">
                <Dialog.Trigger className="w-fit rounded-full bg-black px-6 py-1 font-medium leading-5 text-white">
                    Change password
                </Dialog.Trigger>
            </div>
            <Dialog.Portal>
                <Dialog.Overlay className="absolute inset-0 z-40 h-full w-screen bg-black/50 opacity-100" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[85vh] w-[90vw] max-w-[475px] -translate-x-1/2 -translate-y-1/2 transform  flex-col gap-3 rounded-sm bg-white px-6 py-10 sm:px-8">
                    {loader ? (
                        <div className="-mb-10">
                            <Loader />
                        </div>
                    ) : resetStatus ? (
                        <div className="-mb-1 flex min-h-36 flex-col items-start justify-center">
                            <Dialog.Title className="text-lg font-semibold">
                                Change password
                            </Dialog.Title>
                            <div className="my-6 mt-4 flex flex-col items-start gap-1">
                                <span className="text-3xl">
                                    {resetStatus.icon}
                                </span>
                                <span className="text-base font-medium">
                                    {resetStatus.message}
                                </span>
                            </div>
                            {resetStatus.success === true ? (
                                <button className="ml-auto mt-4 rounded-full bg-rose-500 px-6 py-1 font-semibold text-white">
                                    Done
                                </button>
                            ) : (
                                <button
                                    className="ml-auto rounded-full border bg-black px-6 py-1 font-semibold text-white"
                                    onClick={handleTryAgain}>
                                    Try again
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <Dialog.Title className="text-lg font-semibold">
                                Change password
                            </Dialog.Title>
                            <Dialog.Description className="text-sm text-gray-700">
                                Choose a strong password and don't reuse it for
                                other accounts.
                            </Dialog.Description>
                            <form
                                className="flex flex-col gap-3"
                                onSubmit={handleSubmit(onSubmit)}>
                                <div className="flex flex-col gap-1">
                                    <label
                                        className="font-medium"
                                        htmlFor="password">
                                        Current password
                                    </label>
                                    <input
                                        className={`input ${errors.currentPassword ? "border-red-500" : ""}`}
                                        type="password"
                                        autoComplete="password"
                                        {...register("currentPassword", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 8,
                                                message:
                                                    "Password must be at least 8 characters long",
                                            },
                                        })}
                                    />
                                    {errors.currentPassword && (
                                        <span className="text-sm text-red-500">
                                            {errors.currentPassword.message}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label
                                        className="font-medium"
                                        htmlFor="password">
                                        New password
                                    </label>
                                    <input
                                        className={`input ${errors.newPassword ? "border-red-500" : ""}`}
                                        type="password"
                                        autoComplete="new-password"
                                        {...register("newPassword", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 8,
                                                message:
                                                    "Password must be at least 8 characters long",
                                            },
                                        })}
                                    />
                                    {errors.newPassword && (
                                        <span className="text-sm text-red-500">
                                            {errors.newPassword.message}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label
                                        className="font-medium"
                                        htmlFor="confirmPassword">
                                        Confirm new password
                                    </label>
                                    <input
                                        className={`input ${errors.confirmNewPassword ? "border-red-500" : ""}`}
                                        type="password"
                                        autoComplete="new-password"
                                        {...register("confirmNewPassword", {
                                            required:
                                                "Please confirm your password",
                                            validate: (value) =>
                                                value ===
                                                    watch("newPassword") ||
                                                "Passwords do not match",
                                        })}
                                    />
                                    {errors.confirmNewPassword && (
                                        <span className="text-sm text-red-500">
                                            {errors.confirmNewPassword.message}
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="ml-auto w-fit rounded-full bg-rose-500 px-6 py-1 font-semibold text-white ">
                                    Update password
                                </button>
                            </form>
                        </>
                    )}
                    <Dialog.Close asChild>
                        <img
                            src="/assets/icons/close.svg"
                            className="fixed right-4 top-4 rounded-full border-2 bg-white p-1 hover:cursor-pointer sm:right-5 sm:top-5"
                        />
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default ChangePassword
