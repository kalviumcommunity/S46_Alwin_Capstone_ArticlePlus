import { useEffect, useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { toast } from "sonner"

import axiosInstance from "@/axios"

// Utility functions remain the same
const formatDate = (date) => {
    const options = { day: "2-digit", month: "short", year: "numeric" }
    return new Intl.DateTimeFormat("en-GB", options).format(date)
}

const getNextBillingDate = (type) => {
    const today = new Date()
    const nextDate = new Date(today)
    nextDate.setMonth(today.getMonth() + (type === "monthly" ? 1 : 12))
    return formatDate(nextDate)
}

function SubscriptionDetails({
    creator,
    subscription,
    paymentType,
    onChangePaymentType,
    handleSubscribe,
}) {
    const isMonthly = paymentType === "monthly"

    const handleSubscribeCreator = () => {
        console.log(paymentType)
        axiosInstance
            .post(`/creator/${creator.id}/subscribe`, {
                plan: paymentType,
                price: isMonthly ? subscription.monthly.price : subscription.annual.price,
            })
            .then((response) => {
                console.log(response)
                handleSubscribe()
            })
            .catch((error) => {
                console.error(error)
                toast.error("Failed to subscribe to creator. Please try again.")
            })
    }

    return (
        <div className="mb-14 flex flex-col gap-4 sm:mb-0">
            <hr className="mt-2" />
            <div className="flex flex-col">
                <span className="mb-1 text-sm font-medium text-gray-700">Selected plan:</span>
                <span className="text-xl font-medium">
                    {isMonthly ? "Monthly Plan" : "Yearly Plan"}
                </span>
                <div className="flex items-center justify-between gap-2 text-lg font-medium">
                    <div className="flex items-center gap-1.5">
                        <span className="text-3xl font-semibold tracking-tight">
                            ₹
                            {isMonthly ? subscription.monthly.price : subscription.annual.price}
                        </span>
                        <span className="text-base text-gray-600">
                            per {isMonthly ? "month" : "year"}
                        </span>
                    </div>
                    {!isMonthly && subscription.annual.discount.amount > 0 && (
                        <span className="rounded-full border border-green-100 bg-green-100 px-4 text-sm font-medium text-green-700">
                            Save ₹{subscription.annual.discount.amount}
                        </span>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {subscription.features.map((feature, index) => (
                    <div className="flex rounded-md border-2 px-3 py-2" key={index}>
                        <span className="text-base font-medium">{feature}</span>
                    </div>
                ))}
            </div>
            <hr className="mt-2" />
            <div className="mb-1 mt-1 flex flex-col gap-2">
                <span className="text-lg font-semibold">Payment Details</span>
                <div className="flex flex-col gap-1">
                    <span className="text-base font-medium">
                        You will be charged ₹
                        {isMonthly
                            ? `${subscription.monthly.price} per month `
                            : `${subscription.annual.price} `}
                        for this subscription.
                    </span>
                    {isMonthly ? (
                        <span className="text-sm text-gray-500">
                            Your will be charged automatically every month, you can cancel
                            anytime.
                        </span>
                    ) : (
                        <span className="text-sm text-gray-500">
                            This is a one-time payment for a year of subscription.
                        </span>
                    )}
                    <div className="mt-1 flex items-end gap-1 text-sm">
                        <span className="w-fit text-gray-500">
                            {isMonthly ? "Next billing date:" : "Subscription ends on:"}
                        </span>
                        <span className="font-medium">
                            {getNextBillingDate(isMonthly ? "monthly" : "annual")}
                        </span>
                    </div>
                    {!isMonthly && (
                        <span className="text-sm text-gray-500">
                            This will not auto-renew. You will need to subscribe again after a
                            year.
                        </span>
                    )}
                </div>
            </div>
            <div className="fixed inset-x-0 bottom-0 z-50 flex bg-white px-6 py-3 sm:relative sm:p-0">
                <button
                    className="flex h-9 w-fit items-center justify-center gap-1 rounded-full border py-1 pl-3 pr-4 text-base font-medium hover:bg-gray-50"
                    onClick={() => onChangePaymentType(null)}>
                    <img className="h-5" src="/assets/icons/arrow-left.svg" alt="Go Back" />
                    Go Back
                </button>
                <button
                    onClick={handleSubscribeCreator}
                    className="ml-auto h-9 w-fit gap-3 rounded-full border bg-rose-500 px-6 py-1 pr-5 font-medium text-white hover:bg-rose-600">
                    Subscribe Now
                </button>
            </div>
        </div>
    )
}

function SubscribePortal({ details, handleSubscribe }) {
    const [selectedSubscription, setSelectedSubscription] = useState(null)
    const [selectedPaymentType, setSelectedPaymentType] = useState(null)

    console.log(details)

    useEffect(() => {
        if (details.subscriptions.length) {
            setSelectedSubscription(details.subscriptions[0])
        }
    }, [details])

    const handlePaymentTypeSelect = (type) => {
        setSelectedPaymentType(type)
    }

    return (
        <Dialog.Portal>
            <Dialog.Overlay className="absolute inset-0 z-40 h-full w-screen bg-black/50 opacity-100" />
            <Dialog.Content
                className="fixed inset-x-0 bottom-0 z-50 flex h-fit max-h-[85vh] w-full flex-col gap-2 overflow-auto rounded bg-white px-6 py-6 sm:left-1/2 sm:top-1/2 sm:w-[90vw] sm:max-w-[475px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:transform"
                aria-describedby="subscribe-dialog-description">
                <Dialog.Description className="sr-only">
                    Subscribe to {details.name}
                </Dialog.Description>
                <Dialog.Title className="mb-3 flex flex-col gap-2 text-lg font-medium">
                    Subscribe to
                    <div className="flex items-center gap-3">
                        <img
                            className="h-16 rounded-full border"
                            src={details.displayPicture}
                            alt={details.name}
                        />
                        <div className="flex flex-col gap-1">
                            <span className="text-2xl font-semibold text-black">
                                {details.name}
                            </span>
                            <div className="flex gap-3 font-medium">
                                <span className="text-base leading-4 text-gray-700">
                                    {details.subscribers} subscribers
                                </span>
                            </div>
                        </div>
                    </div>
                </Dialog.Title>

                {!selectedPaymentType && selectedSubscription && (
                    <>
                        <span className="text-lg font-medium text-gray-700">
                            Access to exclusive content
                        </span>
                        <div className="grid grid-cols-2 gap-3">
                            {selectedSubscription.features.map((feature, index) => (
                                <div className="flex rounded-md border-2 px-3 py-2" key={index}>
                                    <span className="text-base font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                        <hr className="mt-3" />
                        <div className="mt-2 flex flex-col gap-2">
                            <span className="text-lg font-medium text-gray-700">
                                Choose your subscription plan
                            </span>
                            <div className="flex gap-3">
                                {["monthly", "annual"].map((plan) => (
                                    <div
                                        key={plan}
                                        className="flex flex-1 cursor-pointer flex-col justify-between rounded-xl border-2 px-4 py-3"
                                        onClick={() => handlePaymentTypeSelect(plan)}>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium capitalize text-gray-800">
                                                {plan === "monthly" ? "Monthly" : "Yearly"} Plan
                                            </span>
                                            <span className="mt-1 text-base">
                                                <span className="text-2xl font-semibold">
                                                    ₹
                                                    {plan === "monthly"
                                                        ? selectedSubscription.monthly.price
                                                        : selectedSubscription.annual.price}
                                                </span>{" "}
                                                <span className="text-sm font-medium text-gray-500">
                                                    per {plan === "monthly" ? "month" : "year"}
                                                </span>
                                            </span>
                                            {plan === "annual" &&
                                                selectedSubscription.annual.discount.amount >
                                                    0 && (
                                                    <span className="text-sm font-semibold text-green-500">
                                                        Save ₹
                                                        {
                                                            selectedSubscription.annual.discount
                                                                .amount
                                                        }
                                                    </span>
                                                )}
                                        </div>
                                        <button className="mt-2 rounded-full bg-rose-500 p-1 font-semibold text-white">
                                            Select plan
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <span className="mt-2 text-xs text-gray-700">
                            By subscribing you are agreeing to creator's terms and conditions
                        </span>
                    </>
                )}

                {selectedSubscription && selectedPaymentType && (
                    <SubscriptionDetails
                        creator={details}
                        subscription={selectedSubscription}
                        paymentType={selectedPaymentType}
                        onChangePaymentType={setSelectedPaymentType}
                        handleSubscribe={handleSubscribe}
                    />
                )}
            </Dialog.Content>
            <Dialog.Close asChild aria-label="close" className="z-50 hover:cursor-pointer">
                <img
                    src="/assets/icons/close.svg"
                    className="fixed right-5 top-5 rounded-full bg-white p-1.5 shadow-lg"
                    alt="Close"
                />
            </Dialog.Close>
        </Dialog.Portal>
    )
}

export default SubscribePortal
