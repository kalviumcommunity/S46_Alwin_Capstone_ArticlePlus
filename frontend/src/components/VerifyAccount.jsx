import { useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"

import axiosInstance from "@/axios"

import Loader from "@/components/ui/Loader"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/OtpInput"

function VerifyAccount() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [verficationStatus, setVerficationStatus] = useState(null)
    const [sendEmailStatus, setSendEmailStatus] = useState(null)
    const [inputActive, setInputActive] = useState(false)
    const [loader, setLoader] = useState(false)
    const [verificationCodeJwt, setVerificationCodeJwt] = useState("")

    const handleOTPSubmit = (otp) => {
        setLoader(true)
        axiosInstance
            .post("user/verify", { token: verificationCodeJwt, otp })
            .then((res) => setVerficationStatus(res.data))
            .catch((err) => {
                setVerficationStatus(err.response.data)
            })
            .finally(() => setLoader(false))
    }

    const sendVerificationCode = () => {
        setInputActive(true)
        axiosInstance
            .get("user/verify")
            .then((res) => {
                setVerificationCodeJwt(res.data.token)
                setSendEmailStatus(res.data)
            })
            .catch((err) => {
                console.error(err)
                sendEmailStatus(err.response.data)
            })
    }

    const handleTryAgain = () => {
        setVerficationStatus(null)
        setInputActive(false)
        setLoader(false)
    }

    return (
        <Dialog.Root open={isDialogOpen} onOpenChange={() => setIsDialogOpen(!isDialogOpen)}>
            <div className="flex-1">
                <Dialog.Trigger className="w-fit rounded-full bg-rose-500 px-6 py-1 font-medium leading-5 text-white">
                    Verify account
                </Dialog.Trigger>
            </div>
            <Dialog.Portal>
                <Dialog.Overlay className="absolute inset-0 z-40 h-full w-screen bg-black/50 opacity-100" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[85vh] w-[90vw] max-w-[475px] -translate-x-1/2 -translate-y-1/2 transform flex-col  justify-center gap-3 bg-white px-8 pb-10 pt-14 sm:px-12">
                    {loader ? (
                        <div className="-mb-10">
                            <Loader />
                        </div>
                    ) : (
                        <>
                            <Dialog.Title className="text-lg font-semibold">
                                Verify account and email
                            </Dialog.Title>
                            <Dialog.Description className="text-base text-gray-700">
                                Verify your account and email address by entering the 6 digit
                                code
                            </Dialog.Description>

                            {verficationStatus === null && (
                                <>
                                    {inputActive ? (
                                        <div className="mb-4 mt-1 flex flex-col gap-2">
                                            <label htmlFor="otp-input" className="font-medium">
                                                Enter 6-digit PIN:
                                            </label>
                                            <InputOTP
                                                maxLength={6}
                                                onComplete={handleOTPSubmit}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                            {sendEmailStatus && sendEmailStatus.success && (
                                                <span className="mt-1 text-sm text-green-600">
                                                    {sendEmailStatus.message}
                                                </span>
                                            )}
                                            {sendEmailStatus && !sendEmailStatus.success && (
                                                <span className="text-xs text-red-500">
                                                    {sendEmailStatus.message}
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex">
                                            <button
                                                className="ml-auto rounded-full bg-black px-5 py-1 text-sm font-medium text-white"
                                                onClick={sendVerificationCode}>
                                                Send code
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                            {verficationStatus && (
                                <div className="flex flex-col items-start justify-center">
                                    <div className="my-6 mt-2 flex flex-col items-start gap-1">
                                        <span className="text-base font-medium">
                                            {verficationStatus.message}
                                        </span>
                                    </div>
                                    {verficationStatus.success === true ? (
                                        <button
                                            className="ml-auto rounded-full bg-black px-5 py-1 text-sm font-medium text-white"
                                            onClick={() => setIsDialogOpen(false)}>
                                            Done
                                        </button>
                                    ) : (
                                        <button
                                            className="ml-auto rounded-full bg-black px-5 py-1 text-sm font-medium text-white"
                                            onClick={handleTryAgain}>
                                            Try again
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                    <Dialog.Close asChild>
                        <img
                            src="/assets/icons/close.svg"
                            className="fixed right-4 top-4 rounded-full border-2 bg-white p-1 hover:cursor-pointer sm:right-8 sm:top-6"
                        />
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default VerifyAccount
