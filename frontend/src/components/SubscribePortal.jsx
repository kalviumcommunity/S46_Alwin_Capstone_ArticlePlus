import { useEffect, useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"

function SelectedSubscriptionSection({
    selectedSubscription,
    selectedPaymentType,
    setSelectedPaymentType,
}) {
    const handleGoBack = () => {
        setSelectedPaymentType(null)
    }

    const getNextBillingDate = (subscriptionType) => {
        const today = new Date()
        if (subscriptionType === "monthly") {
            const nextMonth = new Date(
                today.getFullYear(),
                today.getMonth() + 1,
                today.getDate(),
            )
            return nextMonth.toLocaleDateString()
        } else {
            const nextYear = new Date(
                today.getFullYear() + 1,
                today.getMonth(),
                today.getDate(),
            )
            return nextYear.toLocaleDateString()
        }
    }

    return (
        <div className="mb-14 flex flex-col gap-4 sm:mb-0">
            <hr className="mt-2" />
            <div className="flex flex-col">
                <span className="mb-1 text-sm font-medium text-gray-700">Selected plan:</span>
                <span className="text-xl font-semibold">
                    {selectedPaymentType.type === "monthly" ? "Monthly Plan" : "Yearly Plan"}
                </span>
                <span className="text-lg font-medium">
                    {selectedPaymentType.type === "monthly"
                        ? `₹${selectedPaymentType.price}/month`
                        : `₹${selectedPaymentType.price}/year (Save ₹${selectedPaymentType.discount})`}
                </span>
            </div>
            <div className="grid-rows-auto grid grid-cols-2 gap-3">
                {selectedSubscription.features.map((feature, index) => (
                    <div className="flex rounded-md border-2 px-3 py-2" key={index}>
                        <span className="text-base font-medium">{feature}</span>
                    </div>
                ))}
            </div>
            <hr className="mt-2" />
            <div className="mt-1 flex flex-col gap-2">
                <span className="text-lg font-semibold">Payment Details</span>
                <div className="flex flex-col gap-1">
                    <span className="text-base font-medium">
                        You will be charged ₹{selectedPaymentType.price}/
                        {selectedPaymentType.type} for this subscription.
                    </span>
                    <span className="text-sm text-gray-500">
                        Your payment method will be charged automatically on the same day every{" "}
                        {selectedPaymentType.type === "monthly" ? "month" : "year"}.
                    </span>
                    <div className="mt-1 flex flex-row items-end gap-1 text-sm">
                        <span className="w-fit text-gray-500">Next billing date:</span>
                        <span className="font-medium">
                            {getNextBillingDate(selectedPaymentType.type)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="fixed inset-x-0 bottom-0 z-50 flex bg-white px-6 py-3 sm:relative sm:p-0">
                <button
                    className="flex h-9 w-fit items-center justify-center gap-2 rounded-full border-2 py-1 pl-5 pr-5 text-base font-medium"
                    onClick={handleGoBack}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.75}
                        stroke="currentColor"
                        className="h-5 w-5">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                        />
                    </svg>
                    Go Back
                </button>
                <button className="ml-auto h-9 w-fit gap-3 rounded-full border bg-rose-500 px-6 py-1 pr-5 font-medium text-white hover:bg-rose-600">
                    Subscribe Now
                </button>
            </div>
        </div>
    )
}

function SubscribePortal({ details }) {
    const [selectedSubscription, setSelectedSubscription] = useState(null)
    const [selectedPaymentType, setSelectedPaymentType] = useState(null)

    useEffect(() => {
        if (details.subscriptions.length > 0) {
            setSelectedSubscription(details.subscriptions[0])
        }
    }, [details])

    const handlePaymentTypeSelect = (pricing) => {
        setSelectedPaymentType(pricing)
    }

    return (
        <Dialog.Portal>
            <Dialog.Overlay className="absolute inset-0 z-40 h-full w-screen bg-black/50 opacity-100" />
            <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 flex h-fit max-h-[85vh] w-full flex-col gap-2 overflow-x-hidden overflow-y-scroll rounded-sm bg-white px-6 py-6 sm:left-1/2 sm:top-1/2 sm:w-[90vw] sm:max-w-[475px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:transform">
                <Dialog.Title className="mb-2 flex flex-col gap-2 text-lg font-medium">
                    Subscribe to
                    <div className="flex items-center gap-3">
                        <img className="h-16 rounded-full border" src={details.icon} alt="" />
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

                {selectedSubscription && !selectedPaymentType && (
                    <>
                        <span className="text-lg font-medium text-gray-700">
                            Access to exclusive content
                        </span>
                        <div className="grid-rows-auto grid grid-cols-2 gap-3">
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
                                {selectedSubscription.pricing.map((pricing, index) => (
                                    <div
                                        className="flex flex-1 flex-col justify-between rounded-xl border-2 px-4 py-3"
                                        onClick={() => handlePaymentTypeSelect(pricing)}
                                        key={index}>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium capitalize text-gray-800">
                                                {pricing.type}
                                            </span>
                                            <span className="mt-1 text-base">
                                                <span className="text-2xl font-semibold">
                                                    ₹{pricing.price}
                                                </span>
                                                /{pricing.type}
                                            </span>
                                            {pricing.type === "yearly" && (
                                                <span className="text-sm font-semibold text-green-500">
                                                    Save ₹{pricing.discount}
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
                            By subscribing you are agreeing to creators terms and conditions
                        </span>
                    </>
                )}

                {selectedSubscription && selectedPaymentType && (
                    <SelectedSubscriptionSection
                        selectedSubscription={selectedSubscription}
                        selectedPaymentType={selectedPaymentType}
                        setSelectedPaymentType={setSelectedPaymentType}
                    />
                )}
            </Dialog.Content>
            <Dialog.Close asChild aria-label="close" className="z-50 hover:cursor-pointer">
                <img
                    src="/assets/icons/close.svg"
                    className="fixed right-5 top-5 rounded-full bg-white p-1.5 shadow-lg sm:right-5 sm:top-5"
                />
            </Dialog.Close>
        </Dialog.Portal>
    )
}

export default SubscribePortal
