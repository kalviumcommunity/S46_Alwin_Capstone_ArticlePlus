import axiosInstance from "@/axios"

import { fetchCreatorInfo } from "@/pages/Dashboard/Layout"

import Loader from "@/ui/Loader"

function RequestsTable({ requests, loading }) {
    const onRequestUpdate = () => {
        fetchCreatorInfo()
    }

    const handleApprove = async (userRef) => {
        try {
            await axiosInstance.post("/creator/dashboard/invite/approve", {
                requestUserRef: userRef,
            })
            onRequestUpdate()
        } catch (error) {
            console.error("Error approving request:", error)
        }
    }

    const handleDeny = async (userRef) => {
        try {
            await axiosInstance.post("/creator/dashboard/invite/deny", {
                requestUserRef: userRef,
            })
            onRequestUpdate()
        } catch (error) {
            console.error("Error denying request:", error)
        }
    }

    return (
        <div className="mt-6 flex w-full flex-col divide-y overflow-x-scroll rounded border text-sm lg:w-fit">
            <div className="flex w-fit items-end gap-2 font-medium text-gray-900">
                <span className="w-28 flex-shrink-0 px-4 py-2 leading-4">Invite code</span>
                <span className="w-40 flex-shrink-0 px-4 py-2">Name</span>
                <span className="w-64 flex-shrink-0 px-4 py-2">Email</span>
                <span className="w-28 flex-shrink-0 px-4 py-2">Role</span>
                <span className="w-48 flex-shrink-0 px-4 py-2">Actions</span>
            </div>

            {loading && (
                <div className="relative h-52 w-full overflow-hidden">
                    <div className="absolute right-0 top-0 z-50 flex h-full w-full items-center justify-center bg-white/80 backdrop-blur-[2px]">
                        <Loader />
                    </div>
                </div>
            )}

            {!loading && requests.length === 0 && (
                <div className="flex w-full flex-col items-center justify-center gap-2.5 px-4 py-24 sm:px-0">
                    <span className="text-base font-medium leading-5">
                        No join requests at the moment
                    </span>
                </div>
            )}

            {requests?.map((request, index) => (
                <div
                    className="flex w-fit items-center gap-2 hover:cursor-pointer hover:bg-gray-50"
                    key={index}>
                    <div className="w-28 flex-shrink-0 px-4 py-3">{request.inviteCode}</div>

                    <div className="flex w-40 flex-shrink-0 items-center gap-2 px-4 py-3">
                        <img
                            src={
                                request.displayPicture ||
                                `https://api.dicebear.com/7.x/initials/svg?seed=${request.name}`
                            }
                            className="h-6 w-6  rounded-full"
                            alt=""
                        />
                        <span className="line-clamp-2">{request.name}</span>
                    </div>

                    <div className="w-64 flex-shrink-0 px-4 py-3">
                        <span className="line-clamp-1">{request.email}</span>
                    </div>

                    <div className="w-28 flex-shrink-0 px-4 py-3 capitalize">
                        {request.role}
                    </div>

                    <div className="flex w-48 flex-shrink-0 px-4 py-3">
                        <button
                            className="mr-2 h-fit rounded bg-green-500 px-4 py-1 text-sm font-medium text-white hover:bg-green-600"
                            onClick={() => handleApprove(request.userRef)}>
                            Allow
                        </button>
                        <button
                            className="h-fit rounded bg-red-100 px-4 py-1 text-sm font-medium text-red-600 hover:bg-red-200 hover:text-red-700"
                            onClick={() => handleDeny(request.userRef)}>
                            Deny
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default RequestsTable
