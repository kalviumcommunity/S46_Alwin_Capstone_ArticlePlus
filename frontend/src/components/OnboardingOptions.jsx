import { useEffect, useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"

import Toggle from "@/ui/Toggle"

function OnboardingOptions({ setCreatorForm }) {
    const [isSubscriptionOn, setIsSubscriptionOn] = useState(false)

    const [features, setFeatures] = useState([])
    const [monthlyPrice, setMonthlyPrice] = useState("")
    const [annualPrice, setAnnualPrice] = useState("")
    const [sellingPrice, setSellingPrice] = useState("")
    const [offer, setOffer] = useState({ type: "amount", value: "" })
    const [subscriptionDetails, setSubscriptionDetails] = useState(null)

    const [openAddFeatureDialog, setOpenAddFeatureDialog] = useState(false)
    const [newFeature, setNewFeature] = useState("")
    const [isHovered, setIsHovered] = useState(false)
    const [hoveredIndex, setHoveredIndex] = useState(null)

    const handleAddNewFeature = () => {
        if (newFeature.trim()) {
            setFeatures([...features, newFeature.trim()])
            setNewFeature("")
            setOpenAddFeatureDialog(false)
        }
    }

    const calculateAnnualPrice = () => {
        if (monthlyPrice) {
            const monthly = parseInt(monthlyPrice)
            setAnnualPrice(monthly * 12)
        } else {
            setAnnualPrice("")
        }
    }

    const calculateSellingPrice = () => {
        if (annualPrice) {
            let offerAmount = 0
            if (offer.type === "amount" && offer.value) {
                offerAmount = parseInt(offer.value)
                if (isNaN(offerAmount) || offerAmount < 0) {
                    setSellingPrice("")
                    return
                }
            } else if (offer.type === "percentage" && offer.value) {
                const offerPercentage = parseInt(offer.value)
                if (isNaN(offerPercentage) || offerPercentage < 0 || offerPercentage > 100) {
                    setSellingPrice("")
                    return
                }
                offerAmount = annualPrice * (offerPercentage / 100)
            }

            setSellingPrice(annualPrice - offerAmount)
        } else {
            setSellingPrice("")
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
        const updatedFeatures = [...features]
        updatedFeatures.splice(index, 1)
        setFeatures(updatedFeatures)
    }

    useEffect(() => {
        calculateAnnualPrice()
        calculateSellingPrice()
    }, [monthlyPrice, offer])

    useEffect(() => {
        if (isSubscriptionOn) {
            setSubscriptionDetails([
                {
                    features,
                    monthlyPrice,
                    annualPrice,
                    sellingPrice,
                    offer,
                },
            ])
        }

        setCreatorForm((prevState) => ({
            ...prevState,
            subscription: isSubscriptionOn,
            subscriptions: isSubscriptionOn ? JSON.stringify(subscriptionDetails) : [],
        }))
    }, [isSubscriptionOn, features, monthlyPrice, annualPrice, sellingPrice, offer])

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
                                {features.length === 0 && (
                                    <span className="col-span-2 rounded-md border-2 px-3 py-2 text-base font-medium text-gray-500">
                                        No features/perks added
                                    </span>
                                )}
                                {features.map((feature, index) => (
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
                        <div className="mt-4 flex flex-col gap-3 py-2">
                            <label className="flex items-center justify-between gap-4">
                                <span className="font-medium">Monthly Price (₹):</span>
                                <input
                                    type="number"
                                    className="on-input"
                                    value={monthlyPrice}
                                    onChange={(e) => setMonthlyPrice(parseInt(e.target.value))}
                                />
                            </label>
                            <label className="flex flex-col gap-1">
                                <span className="font-medium">
                                    Annual subscription Discount:
                                </span>
                                <div className="flex gap-3">
                                    <select
                                        value={offer.type}
                                        className="on-input w-fit"
                                        onChange={(e) =>
                                            setOffer({ ...offer, type: e.target.value })
                                        }>
                                        <option value="amount">Amount</option>
                                        <option value="percentage">Percentage</option>
                                    </select>
                                    {offer.type === "amount" && (
                                        <input
                                            type="number"
                                            className="on-input"
                                            value={offer.value}
                                            onChange={(e) =>
                                                setOffer({
                                                    ...offer,
                                                    value: e.target.value,
                                                })
                                            }
                                        />
                                    )}
                                    {offer.type === "percentage" && (
                                        <input
                                            type="number"
                                            className="on-input"
                                            value={offer.value}
                                            onChange={(e) =>
                                                setOffer({
                                                    ...offer,
                                                    value: parseInt(e.target.value),
                                                })
                                            }
                                            min="0"
                                            max="100"
                                        />
                                    )}
                                </div>
                            </label>
                            <div className="flex flex-col items-end">
                                {annualPrice && (
                                    <div className="mt-2">
                                        <span className="font-medium">Annual Price: </span>
                                        <span className="text-2xl font-semibold">
                                            ₹ {annualPrice}
                                        </span>
                                    </div>
                                )}
                                {offer.value && (
                                    <div>
                                        <span className="font-medium">Selling Price: </span>
                                        <span className="text-2xl font-semibold">
                                            ₹ {sellingPrice}
                                        </span>
                                    </div>
                                )}

                                {offer.value && (
                                    <div className="mt-1">
                                        <span className="font-medium">Save: </span>
                                        {offer.type === "amount" && (
                                            <span className="font-semibold">
                                                ₹ {offer.value}
                                            </span>
                                        )}
                                        {offer.type === "percentage" && (
                                            <span className="font-semibold">
                                                {offer.value}% off
                                            </span>
                                        )}
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
