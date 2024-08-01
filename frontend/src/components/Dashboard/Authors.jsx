import React, { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"

import axiosInstance from "@/axios"

import Loader from "@/ui/Loader"

function Authors() {
    const [creatorDetails, setCreatorDetails] = useState(null)
    const [isOwner, setIsOwner] = useState(false)
    const [authors, setAuthors] = useState([])
    const [loading, setLoading] = useState(true)

    const handleAuthorAccess = async (author, status) => {
        const authorId = author.id
        const authorName = author.name
        const organizationName = creatorDetails.name

        let confirmMessage = ""

        if (status === "delete") {
            confirmMessage = `This will remove all access to ${authorName} from ${organizationName}. Are you sure you want to proceed?`
        } else if (status === "pause") {
            confirmMessage = `Are you sure you want to pause access for ${authorName}?`
        } else if (status === "active") {
            confirmMessage = `Are you sure you want to resume access for ${authorName}?`
        }

        const isConfirmed = window.confirm(confirmMessage)

        if (isConfirmed) {
            try {
                setLoading(true)
                const response = await axiosInstance.post(
                    `/creator/dashboard/author/${authorId}/access`,
                    {
                        updateStatus: status,
                    },
                )
                console.log(response.data)
                toast.success(response.data.message)

                // Re-fetch authors data
                await fetchAuthors()
            } catch (error) {
                console.error("Error updating access:", error)
                toast.error("Failed to update access")
            } finally {
                setLoading(false)
            }
        }
    }

    const fetchAuthors = async () => {
        try {
            const response = await axiosInstance.get("/creator/dashboard/authors")
            setCreatorDetails(response.data.creator)
            setAuthors(response.data.authors)
            setIsOwner(response.data.owner)
        } catch (error) {
            console.error("Error fetching authors:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAuthors()
    }, [])

    if (loading) {
        return <Loader />
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold">Authors</h2>
            {authors.length > 0 && (
                <div className="mt-6 flex w-full flex-col divide-y overflow-x-scroll rounded border text-sm lg:w-fit">
                    <div className="flex w-fit items-end gap-2 font-medium text-gray-900">
                        <span className="w-36 flex-shrink-0 px-4 py-2">Id</span>
                        <span className="w-72 flex-shrink-0 px-4 py-2">Name</span>
                        <span className="w-24 flex-shrink-0 px-4 py-2">Role</span>
                        {isOwner && (
                            <span className="w-80 flex-shrink-0 px-4 py-2">Actions</span>
                        )}
                    </div>

                    {loading && (
                        <div className="relative h-52 w-full overflow-hidden">
                            <div className="absolute right-0 top-0 z-50 flex h-full w-full items-center justify-center bg-white/80 backdrop-blur-[2px]">
                                <Loader />
                            </div>
                        </div>
                    )}

                    {!loading && authors.length === 0 && (
                        <div className="flex w-full flex-col items-center justify-center gap-2.5 px-4 py-24 sm:px-0">
                            <span className="text-base font-medium leading-5">
                                No authors are part of this organization
                            </span>
                        </div>
                    )}

                    {authors?.map((author, index) => (
                        <div className="flex w-fit items-center gap-2" key={index}>
                            <div
                                className="w-36 flex-shrink-0 truncate px-4 py-3"
                                title={author.id}>
                                {author.id}
                            </div>

                            <div className="flex w-72 flex-shrink-0 items-center gap-2 px-4 py-3">
                                <img
                                    src={
                                        author.displayPicture ||
                                        `https://api.dicebear.com/7.x/initials/svg?seed=${author.name}`
                                    }
                                    className="h-6 w-6  rounded-full"
                                    alt=""
                                />
                                <span className="line-clamp-2">{author.name}</span>
                            </div>

                            <div className="w-24 flex-shrink-0 px-4 py-3 capitalize">
                                {author.role}
                            </div>
                            {isOwner && author.role == "owner" && (
                                <div className="w-80 flex-shrink-0 px-4 py-3 capitalize text-gray-500">
                                    No actions available
                                </div>
                            )}

                            {isOwner && author.role != "owner" && (
                                <div className="flex w-80 flex-shrink-0 gap-2 px-4 py-3 capitalize">
                                    {author.status === "active" ? (
                                        <button
                                            className="rounded border border-orange-200 bg-orange-50 px-3 py-0.5 font-medium text-orange-500"
                                            onClick={() => handleAuthorAccess(author, "pause")}>
                                            Pause access
                                        </button>
                                    ) : (
                                        <button
                                            className="rounded border border-green-200 bg-green-50 px-3 py-0.5 font-medium text-green-500"
                                            onClick={() =>
                                                handleAuthorAccess(author, "active")
                                            }>
                                            Resume access
                                        </button>
                                    )}
                                    <button
                                        className="rounded border border-red-200 bg-red-50 px-3 py-0.5 font-medium text-red-500"
                                        onClick={() => handleAuthorAccess(author, "delete")}>
                                        Remove author
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Authors
