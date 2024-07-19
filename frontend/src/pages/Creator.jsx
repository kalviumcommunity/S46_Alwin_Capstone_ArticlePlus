import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import * as Dialog from "@radix-ui/react-dialog"
import { toast, Toaster } from "sonner"

import { randomGradient } from "@/helpers/ui/randomGradient"
import axiosInstance from "@/axios"

import CreatorContent from "@/components/CreatorContent"

import Loader from "@/ui/Loader"

function Creator() {
    const { creator: id } = useParams()
    const [creator, setCreator] = useState(null)
    const [isFollowing, setIsFollowing] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [loading, setLoading] = useState(true)

    const fetchCreatorProfile = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get(`/creator/profile/${id}`)
            setCreator(data.creator)
            setIsFollowing(data.isFollowing)
            setIsSubscribed(data.isSubscribed)
        } catch (error) {
            console.error("Error fetching creator profile:", error)
            alert("Failed to load creator profile. Please refresh the page.")
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        fetchCreatorProfile()
    }, [fetchCreatorProfile])

    const handleSubscribe = () => setIsSubscribed((prev) => !prev)

    if (loading) return <Loader />

    return (
        <div>
            <div className="w-full justify-end pt-16" style={{ background: randomGradient() }}>
                <div className="flex flex-col gap-4 bg-gradient-to-t from-white from-40% to-transparent">
                    {creator && (
                        <>
                            <img
                                className="mx-4 h-20 w-fit rounded-full shadow sm:mx-8 lg:mx-16"
                                src={creator.displayPicture}
                                alt={`${creator.name}'s profile`}
                            />
                            <div className="flex flex-col gap-6 px-4 pb-8 sm:flex-row sm:px-8 lg:gap-8 lg:px-16">
                                <div className="flex w-max flex-col">
                                    <div className="flex items-center gap-2">
                                        <h1 className="w-max text-2xl font-bold">
                                            {creator.name}
                                        </h1>
                                        {creator.verified && (
                                            <img
                                                className="h-5 w-5"
                                                src="/assets/icons/verified.svg"
                                                alt="Verified"
                                            />
                                        )}
                                    </div>
                                    <p>
                                        <span className="font-medium">
                                            {creator.articles.total}
                                        </span>{" "}
                                        articles
                                    </p>
                                </div>
                                <div className="flex flex-col justify-end gap-3">
                                    <span className="mt-1 lg:w-2/3">{creator.description}</span>
                                    <div className="flex gap-2">
                                        <FollowButton
                                            setCreator={setCreator}
                                            isFollowing={isFollowing}
                                            setIsFollowing={setIsFollowing}
                                        />
                                        {creator.subscription && (
                                            <SubscribeSection
                                                creator={creator}
                                                isSubscribed={isSubscribed}
                                                handleSubscribe={handleSubscribe}
                                            />
                                        )}
                                    </div>
                                    <hr className="mt-1.5" />
                                    <div className="flex items-center gap-4">
                                        <p>
                                            <span className="font-medium">
                                                {creator.followers}
                                            </span>{" "}
                                            followers
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                {creator.subscribers}
                                            </span>{" "}
                                            subscribers
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {creator && <CreatorContent creator={creator} isSubscribed={isSubscribed} />}
            <Toaster richColors position="top-center" closeButton />
        </div>
    )
}

function FollowButton({ setCreator, isFollowing, setIsFollowing }) {
    const { creator: id } = useParams()

    const handleFollow = async () => {
        try {
            const { data } = await axiosInstance.post(`/creator/${id}/follow`)
            setIsFollowing(data.isFollowing)
            toast.success(data.message)
            if (data.isFollowing) {
                toast.success(data.message)
                setCreator((prev) => ({
                    ...prev,
                    followers: prev.followers + 1,
                }))
            } else {
                toast.info(data.message)
                setCreator((prev) => ({
                    ...prev,
                    followers: prev.followers - 1,
                }))
            }
        } catch (error) {
            console.error("Error toggling follow status:", error)
            alert("Failed to update follow status. Please try again.")
        }
    }

    return (
        <button
            className={`flex h-9 min-w-28 items-center justify-center gap-3 rounded-full border px-6 py-1 pr-5 text-center text-base font-medium ${
                isFollowing
                    ? "border-gray-300 bg-white text-black hover:bg-gray-100"
                    : "border-black bg-black text-white hover:bg-gray-900"
            }`}
            onClick={handleFollow}>
            {isFollowing ? "Following" : "Follow"}
        </button>
    )
}

function SubscribeSection({ creator, isSubscribed, handleSubscribe }) {
    const defaultSubscription = creator.subscriptions[0]
    return (
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <Dialog.Root>
                <Dialog.Trigger asChild>
                    <button
                        className={`flex h-9 w-fit min-w-28 items-center justify-center rounded-full border px-6 py-1 pr-5 text-base font-medium ${
                            isSubscribed
                                ? "border-gray-300 hover:bg-gray-100"
                                : "border-red-100 bg-red-100 text-red-700"
                        }`}
                        onClick={handleSubscribe}>
                        {isSubscribed ? "Subscribed" : "Subscribe"}
                    </button>
                </Dialog.Trigger>
                {/* <SubscribePortal details={creator} /> */}
            </Dialog.Root>
            <span className="text-sm font-medium leading-4">
                Starting at ₹{defaultSubscription.monthlyPrice}/per month
            </span>
        </div>
    )
}

export default Creator
