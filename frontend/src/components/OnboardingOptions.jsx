import { useEffect, useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import clsx from "clsx"

import Toggle from "@/ui/Toggle"

function OnboardingOptions({ setCreatorForm }) {
    const [isSubscriptionOn, setIsSubscriptionOn] = useState(false)
    const [subscriptionPlan, setSubscriptionPlan] = useState({
        name: "Default",
        features: [],
        monthly: {
            price: "",
        },
        annual: {
            price: "",
            basePrice: "",
            discount: {
                amount: "0",
            },
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
        const monthly = parseInt(subscriptionPlan.monthly.price)
        if (!isNaN(monthly) && monthly >= 0) {
            const basePrice = monthly * 12
            const discountAmount = parseInt(subscriptionPlan.annual.discount.amount) || 0
            const finalPrice = Math.max(basePrice - discountAmount, 0)
            setSubscriptionPlan((prev) => ({
                ...prev,
                annual: {
                    ...prev.annual,
                    basePrice,
                    price: finalPrice,
                },
            }))
        } else {
            setSubscriptionPlan((prev) => ({
                ...prev,
                annual: { ...prev.annual, basePrice: "", price: "" },
            }))
        }
    }

    const handleDiscountChange = (e) => {
        const newDiscountAmount = parseInt(e.target.value)
        const basePrice = parseInt(subscriptionPlan.annual.basePrice)

        if (!isNaN(newDiscountAmount) && !isNaN(basePrice)) {
            if (newDiscountAmount >= 0 && newDiscountAmount < basePrice) {
                const finalPrice = basePrice - newDiscountAmount
                setSubscriptionPlan((prev) => ({
                    ...prev,
                    annual: {
                        ...prev.annual,
                        price: finalPrice,
                        discount: { amount: newDiscountAmount },
                    },
                }))
            }
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
    }, [subscriptionPlan.monthly.price, subscriptionPlan.annual.discount.amount])

    useEffect(() => {
        setCreatorForm((prevState) => ({
            ...prevState,
            subscription: isSubscriptionOn,
            subscriptions: isSubscriptionOn ? [subscriptionPlan] : [],
        }))
    }, [isSubscriptionOn, subscriptionPlan, setCreatorForm])

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
                                        onMouseLeave={handleMouseLeave}>
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
                                    value={subscriptionPlan.monthly.price}
                                    onChange={(e) =>
                                        setSubscriptionPlan((prev) => ({
                                            ...prev,
                                            monthly: {
                                                ...prev.monthly,
                                                price: Number(e.target.value),
                                            },
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
                                    value={subscriptionPlan.annual.discount.amount}
                                    onChange={handleDiscountChange}
                                    min="0"
                                    max={subscriptionPlan.annual.basePrice - 1}
                                />
                            </label>
                            <hr className="mb-1.5 mt-1.5" />
                            <div className="flex flex-1 flex-row items-start justify-start gap-3">
                                {/* Monthly Plan Display */}
                                {subscriptionPlan.monthly.price && (
                                    <div className="w-1/2 rounded-xl border-2 px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className="text-base font-medium">
                                                Monthly Plan
                                            </span>
                                            <p className="text-xl font-semibold">
                                                ₹{subscriptionPlan.monthly.price}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {/* Annual Plan Display */}
                                {subscriptionPlan.annual.price && (
                                    <div className="w-1/2 rounded-xl border-2 px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className="text-base font-medium">
                                                Annual Plan
                                            </span>
                                            <p className="text-xl font-semibold">
                                                ₹{subscriptionPlan.annual.price}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                (Base price: ₹
                                                {subscriptionPlan.annual.basePrice})
                                            </p>
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
