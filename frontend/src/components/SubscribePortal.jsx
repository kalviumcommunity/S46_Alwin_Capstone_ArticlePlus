import { useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"

function SubscribePortal({ details }) {
    const [selectedPlan, setSelectedPlan] = useState(null)

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan)
    }

    const handleGoBack = () => {
        setSelectedPlan(null)
    }

    return (
        <Dialog.Portal>
            <Dialog.Overlay className="absolute inset-0 z-40 h-full w-screen bg-black/50 opacity-100" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[85vh] w-[90vw] max-w-[475px] -translate-x-1/2 -translate-y-1/2 transform flex-col gap-2 overflow-x-hidden overflow-y-scroll rounded-sm bg-white px-4 py-8  sm:p-8">
                <Dialog.Title className="mb-2 flex flex-col gap-2 text-lg font-medium text-gray-700">
                    Subscribe to
                    <div className="flex items-center gap-3">
                        <img
                            className="h-16 rounded-full border p-2"
                            src="https://api.dicebear.com/5.x/adventurer/svg"
                            alt=""
                        />
                        <div className="flex flex-col">
                            <span className="text-2xl font-semibold text-black">
                                creator.name
                            </span>
                            <span className="text-base leading-4 text-gray-500">
                                creator.num
                            </span>
                        </div>
                    </div>
                </Dialog.Title>

                {!selectedPlan && (
                    <>
                        <span className="text-lg font-medium">Access to exclusive content</span>
                        <div className="grid-rows-auto grid grid-cols-2 gap-3">
                            <div className="flex rounded-md border-2 px-3 py-2">
                                <span className="text-base font-semibold">
                                    One new post every week
                                </span>
                            </div>
                            <div className="flex rounded-md border-2 p-2 px-3">
                                <span className="text-base font-semibold">
                                    Ad free experience
                                </span>
                            </div>
                        </div>
                        <hr className="mt-2" />
                        <div className="mt-4 flex flex-col gap-2">
                            <span className="text-lg font-medium">
                                Choose your subscription plan
                            </span>
                            <div className="flex gap-3">
                                <div
                                    className="flex flex-1 flex-col justify-between rounded-xl border-2 px-4 py-3"
                                    onClick={() => handlePlanSelect("monthly")}>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-800">
                                            Monthly
                                        </span>
                                        <span className="mt-1 text-base">
                                            <span className="text-2xl font-semibold">$10</span>
                                            /month
                                        </span>
                                    </div>
                                    <button className="mt-2 rounded-full bg-rose-500 p-1 font-semibold text-white">
                                        Select plan
                                    </button>
                                </div>
                                <div
                                    className="flex flex-1 flex-col justify-between rounded-xl border-2 px-4 py-3"
                                    onClick={() => handlePlanSelect("yearly")}>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-800">
                                            Yearly
                                        </span>
                                        <span className="mt-1 text-base">
                                            <span className="text-2xl font-semibold">$100</span>
                                            /year
                                        </span>
                                    </div>
                                    <span className="mb-1 text-sm font-medium text-green-600">
                                        save $20
                                    </span>
                                    <button className="mt-2 rounded-full bg-rose-500 p-1 font-semibold text-white">
                                        Select plan
                                    </button>
                                </div>
                            </div>
                        </div>
                        <span className="mt-2 text-xs text-gray-700">
                            By subscribing you are agreeing to creators terms and conditions
                        </span>
                    </>
                )}

                {selectedPlan && (
                    <div className="flex flex-col gap-4">
                        <hr className="mt-2" />
                        <div className="flex flex-col">
                            <span className="mb-2 text-sm font-medium text-gray-700">
                                Selected plan:
                            </span>
                            <span className="text-xl font-semibold">
                                {selectedPlan === "monthly" ? "Monthly Plan" : "Yearly Plan"}
                            </span>
                            <span className="text-lg font-medium">
                                {selectedPlan === "monthly"
                                    ? "$10/month"
                                    : "$100/year (Save $20)"}
                            </span>
                            {selectedPlan === "yearly" && (
                                <span className="text-sm text-gray-500">
                                    Payment will be taken on this day every year
                                </span>
                            )}
                        </div>
                        <div className="grid-rows-auto grid grid-cols-2 gap-3">
                            <div className="flex rounded-md border-2 px-3 py-2">
                                <span className="text-base font-semibold">
                                    One new post every week
                                </span>
                            </div>
                            <div className="flex rounded-md border-2 p-2 px-3">
                                <span className="text-base font-semibold">
                                    Ad free experience
                                </span>
                            </div>
                        </div>
                        <hr className="mt-2" />
                        <div className="mt-1 flex flex-col gap-2">
                            <span className="text-lg font-medium">Payment Details</span>
                            <div className="flex flex-col gap-1">
                                <span className="text-base font-medium">
                                    You will be charged{" "}
                                    {selectedPlan === "monthly" ? "$10/month" : "$100/year"} for
                                    this subscription.
                                </span>
                                <span className="text-sm text-gray-500">
                                    Your payment method will be charged automatically on the
                                    same day every{" "}
                                    {selectedPlan === "monthly" ? "month" : "year"}.
                                </span>
                            </div>
                        </div>
                        <div className="flex">
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
                )}
            </Dialog.Content>
            <Dialog.Close asChild>
                <img
                    src="/assets/icons/close.svg"
                    className="fixed right-4 top-4 rounded-full border-2 bg-white p-1 hover:cursor-pointer sm:right-5 sm:top-5"
                />
            </Dialog.Close>
        </Dialog.Portal>
    )
}

export default SubscribePortal
