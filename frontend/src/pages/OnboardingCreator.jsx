import React, { useState } from "react"

function OnboardingCreator() {
    const [creatorType, setCreatorType] = useState("")
    const [displayName, setDisplayName] = useState("")
    const [profilePicture, setProfilePicture] = useState(null)
    const [creatorId, setCreatorId] = useState("")

    const handleCreatorTypeChange = (event) => {
        setCreatorType(event.target.value)
    }

    const handleDisplayNameChange = (event) => {
        setDisplayName(event.target.value)
    }

    const handleProfilePictureChange = (event) => {
        setProfilePicture(event.target.files[0])
    }

    const handleCreatorIdChange = (event) => {
        setCreatorId(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log("Creator Type:", creatorType)
        console.log("Display Name:", displayName)
        console.log("Profile Picture:", profilePicture)
        console.log("Creator ID:", creatorId)
    }

    return (
        <div className="wrapper flex flex-col items-center">
            <div className="my-10 w-full sm:w-1/2 lg:w-1/3">
                <p className="mb-4 text-3xl font-bold">Onboarding Creator</p>
                <form onSubmit={handleSubmit} className="mt-4 flex flex-col">
                    <div className="mb-4">
                        <label className="mb-2 block font-semibold">Creator Type:</label>
                        <div className="font-medium text-gray-700">
                            <label className="mr-4 hover:cursor-pointer">
                                <input
                                    type="radio"
                                    value="individual"
                                    checked={creatorType === "individual"}
                                    onChange={handleCreatorTypeChange}
                                    className="mr-1 text-rose-500 focus:ring-rose-500"
                                />
                                Individual
                            </label>
                            <label className="hover:cursor-pointer">
                                <input
                                    type="radio"
                                    value="organization"
                                    checked={creatorType === "organization"}
                                    onChange={handleCreatorTypeChange}
                                    className="mr-1"
                                />
                                Organization
                            </label>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="displayName" className="mb-2 block font-semibold">
                            Display Name:
                        </label>
                        <input
                            type="text"
                            id="displayName"
                            value={displayName}
                            onChange={handleDisplayNameChange}
                            className="input w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="profilePicture" className="mb-2 block font-semibold">
                            Profile Picture:
                        </label>
                        <input
                            type="file"
                            id="profilePicture"
                            onChange={handleProfilePictureChange}
                            className="w-full rounded-xl border-2 px-2 py-2 file:mr-3 file:rounded-full file:border-0 file:bg-rose-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-rose-700 hover:file:bg-rose-100"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="creatorId" className="mb-2 block font-semibold">
                            Creator ID:
                        </label>
                        <input
                            type="text"
                            id="creatorId"
                            value={creatorId}
                            onChange={handleCreatorIdChange}
                            className="input"
                        />
                    </div>
                    <button
                        type="submit"
                        className="ml-auto rounded-full bg-rose-500 px-6 py-2 font-medium text-white">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}

export default OnboardingCreator
