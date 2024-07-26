import { useEffect, useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import clsx from "clsx"

import Toggle from "@/ui/Toggle"

function OnboardingOptions({ setCreatorForm }) {
    const [isSubscriptionOn, setIsSubscriptionOn] = useState(false)
    const [subscriptionPlan, setSubscriptionPlan] = useState({
        name: "default",
        features: [],
        monthlyPrice: "",
        annualPrice: "",
        annualOffer: {
            amount: "0",
            basePrice: "",
        },
    })

    const [openAddFeatureDialog, setOpenAddFeatureDialog] = useState(false)
    const [newFeature, setNewFeature] = useState("")
    const [isHovered, setIsHovered] = useState(false)
    const [hoveredIndex, setHoveredIndex] = useState(null)

    const handleAddNewFeature = () => {
        if (newFeature.trim()) {
            setSubscriptionPlan((prev) => ({
                ...prev,
                features: [...prev.features, newFeature.trim()],
            }))
            setNewFeature("")
            setOpenAddFeatureDialog(false)
        }
    }

    const calculateAnnualPrice = () => {
        const monthly = parseInt(subscriptionPlan.monthlyPrice)
        if (!isNaN(monthly) && monthly >= 0) {
            const annual = monthly * 12
            setSubscriptionPlan((prev) => ({
                ...prev,
                annualPrice: annual,
                annualOffer: {
                    ...prev.annualOffer,
                    basePrice: annual,
                },
            }))
        } else {
            setSubscriptionPlan((prev) => ({
                ...prev,
                annualPrice: "",
                annualOffer: {
                    ...prev.annualOffer,
                    basePrice: "",
                },
            }))
        }
    }

    const calculateOfferPrice = () => {
        const { annualOffer } = subscriptionPlan
        const basePrice = parseInt(annualOffer.basePrice)
        const discountAmount = parseInt(annualOffer.amount)

        if (!isNaN(basePrice) && !isNaN(discountAmount) && discountAmount >= 0) {
            const finalPrice = Math.max(basePrice - discountAmount, 0)
            setSubscriptionPlan((prev) => ({
                ...prev,
                annualPrice: finalPrice,
            }))
        } else {
            setSubscriptionPlan((prev) => ({
                ...prev,
                annualPrice: basePrice,
            }))
        }
    }

    const handleMouseEnter = (index) => {
        setIsHovered(true)
        setHoveredIndex(index)
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        setHoveredIndex(null)
    }

    const handleRemove = (index) => {
        setSubscriptionPlan((prev) => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index),
        }))
    }

    useEffect(() => {
        calculateAnnualPrice()
    }, [subscriptionPlan.monthlyPrice])

    useEffect(() => {
        calculateOfferPrice()
    }, [subscriptionPlan.annualOffer.amount, subscriptionPlan.annualOffer.basePrice])

    useEffect(() => {
        setCreatorForm((prevState) => ({
            ...prevState,
            subscription: isSubscriptionOn,
            subscriptions: isSubscriptionOn ? [subscriptionPlan] : [],
        }))
    }, [isSubscriptionOn, subscriptionPlan])

    return (
        <div className="mt-4 flex flex-col gap-5 px-1">
            <div className="flex items-center justify-between gap-4">
                <span className="flex gap-2 text-xl font-medium text-gray-800">
                    Enable Subscriptions
                </span>
                <Toggle state={isSubscriptionOn} setState={setIsSubscriptionOn} />
            </div>
            {isSubscriptionOn && (
                <>
                    <hr />
                    <div className="flex flex-col justify-center gap-2">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <p className="font-medium">Subscription Features:</p>
                                <Dialog.Root
                                    open={openAddFeatureDialog}
                                    onOpenChange={setOpenAddFeatureDialog}>
                                    <Dialog.Trigger asChild>
                                        <button className="rounded-full border border-rose-100 bg-rose-50 px-4 py-1 font-medium leading-none text-rose-700 transition hover:bg-rose-100">
                                            Add Feature
                                        </button>
                                    </Dialog.Trigger>
                                    <Dialog.Portal>
                                        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30" />
                                        <Dialog.Content className="fixed inset-x-0 bottom-0 left-1/2 top-1/2 z-50 flex h-fit max-h-[85vh] w-11/12 -translate-x-1/2 -translate-y-1/2 transform flex-col gap-1 overflow-x-hidden overflow-y-scroll rounded bg-white px-6 py-6 sm:w-[90vw] sm:max-w-[475px]">
                                            <Dialog.Title className="text-lg font-semibold">
                                                Add Feature description
                                            </Dialog.Title>
                                            <Dialog.Description className="mb-2 text-sm text-gray-700">
                                                Enter your commitment to the subscribers
                                            </Dialog.Description>
                                            <input
                                                className="input"
                                                type="text"
                                                value={newFeature}
                                                placeholder="Eg: One Exclusive content every week"
                                                onChange={(e) => setNewFeature(e.target.value)}
                                            />
                                            <div className="mt-4 flex justify-end gap-2">
                                                <Dialog.Close asChild>
                                                    <button className="rounded-full border bg-gray-50 px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-100">
                                                        Cancel
                                                    </button>
                                                </Dialog.Close>
                                                <button
                                                    className="rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600"
                                                    onClick={handleAddNewFeature}>
                                                    Add
                                                </button>
                                            </div>
                                        </Dialog.Content>
                                    </Dialog.Portal>
                                </Dialog.Root>
                            </div>
                            <div className="grid-rows-auto grid grid-cols-2 gap-3">
                                {subscriptionPlan.features.length === 0 && (
                                    <span className="col-span-2 rounded-md border-2 px-3 py-2 text-base font-medium text-gray-500">
                                        No features/perks added
                                    </span>
                                )}
                                {subscriptionPlan.features.map((feature, index) => (
                                    <div
                                        className="relative overflow-hidden rounded-md border-2 px-3 py-2"
                                        key={index}
                                        onMouseEnter={() => handleMouseEnter(index)}
                                        onMouseLeave={() => handleMouseLeave()}>
                                        <span className="text-base font-medium">{feature}</span>
                                        {isHovered && hoveredIndex === index && (
                                            <div className="absolute left-1/2 top-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 transform items-center justify-center bg-black/20 backdrop-blur-sm">
                                                <button
                                                    className="h-fit rounded-full bg-red-100 px-2 text-sm font-medium text-red-800"
                                                    onClick={() => handleRemove(index)}>
                                                    Remove
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4 flex flex-col justify-center gap-4 py-2">
                            <label className="flex items-center justify-between gap-4">
                                <span className="font-medium">Monthly Price (₹):</span>
                                <input
                                    type="number"
                                    className="on-input"
                                    value={subscriptionPlan.monthlyPrice}
                                    onChange={(e) =>
                                        setSubscriptionPlan((prev) => ({
                                            ...prev,
                                            monthlyPrice: e.target.value,
                                        }))
                                    }
                                    min="0"
                                />
                            </label>
                            <label className="flex items-center justify-between gap-4">
                                <span className="font-medium">Annual Discount Amount (₹):</span>
                                <input
                                    type="number"
                                    className="on-input"
                                    value={subscriptionPlan.annualOffer.amount}
                                    onChange={(e) =>
                                        setSubscriptionPlan((prev) => ({
                                            ...prev,
                                            annualOffer: {
                                                ...prev.annualOffer,
                                                amount: e.target.value, // Ensure 'amount' is updated here
                                            },
                                        }))
                                    }
                                    min="0"
                                />
                            </label>
                            <hr className="mb-1.5 mt-1.5" />
                            <div className="flex flex-1 flex-row items-start justify-start gap-3">
                                {subscriptionPlan.monthlyPrice && (
                                    <div className="w-1/2 rounded-xl border-2 px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium capitalize text-gray-800">
                                                Monthly Plan
                                            </span>
                                            <span className="mt-1 text-3xl font-semibold tracking-tight">
                                                ₹{subscriptionPlan.monthlyPrice}
                                            </span>
                                            <span className="text-xs font-medium leading-3 text-gray-500">
                                                per month
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {subscriptionPlan.annualPrice && (
                                    <div className="flex w-1/2 flex-col items-end">
                                        <div className="w-full rounded-xl">
                                            <div
                                                className={clsx(
                                                    "flex flex-col rounded-t-xl border-2 px-4 py-3",
                                                    {
                                                        "border-b-0":
                                                            parseInt(
                                                                subscriptionPlan.annualOffer
                                                                    ?.amount,
                                                            ) > 0,
                                                        "!rounded-b-xl border-b-2":
                                                            !subscriptionPlan.annualOffer ||
                                                            parseInt(
                                                                subscriptionPlan.annualOffer
                                                                    .amount,
                                                            ) <= 0,
                                                    },
                                                )}>
                                                <span className="text-sm font-medium capitalize text-gray-800">
                                                    Annual Plan
                                                </span>
                                                <span className="mt-1 text-3xl font-semibold tracking-tight">
                                                    ₹{subscriptionPlan.annualPrice}
                                                </span>
                                                <span className="text-xs font-medium leading-3 text-gray-500">
                                                    per year
                                                </span>
                                            </div>
                                            {subscriptionPlan.annualOffer &&
                                                parseInt(subscriptionPlan.annualOffer.amount) >
                                                    0 && (
                                                    <div className="flex items-center gap-1 rounded-b-xl border-2 border-t bg-gray-50 px-3 py-0.5">
                                                        <span className="text-xs font-medium">
                                                            Discount
                                                        </span>
                                                        <span className="text-sm font-semibold text-green-500">
                                                            ₹
                                                            {
                                                                subscriptionPlan.annualOffer
                                                                    .amount
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default OnboardingOptions
