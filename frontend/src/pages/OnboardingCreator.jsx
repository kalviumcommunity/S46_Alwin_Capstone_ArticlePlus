import { useState } from "react"

import OnboardingOptions from "@/components/OnboardingOptions"

function OnboardingCreator() {
    const [step, setStep] = useState(1)
    const [creatorType, setCreatorType] = useState("")
    const [displayName, setDisplayName] = useState("")
    const [profilePicture, setProfilePicture] = useState(null)
    const [creatorId, setCreatorId] = useState("")
    const [contributors, setContributors] = useState([])
    const [suggestedCreatorId, setSuggestedCreatorId] = useState("")
    const [errors, setErrors] = useState({})

    const handleCreatorTypeChange = (event) => {
        setCreatorType(event.target.value)
    }

    const handleDisplayNameChange = (event) => {
        const { value } = event.target
        if (value === "" || /^[a-zA-Z0-9\s]+$/.test(value)) {
            setDisplayName(value)
            setErrors((prevErrors) => ({ ...prevErrors, displayName: "" }))
            const id = value.replace(/\s+/g, "-").toLowerCase()
            setSuggestedCreatorId(id)
            setCreatorId(id)
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                displayName: "Display name should only contain letters, spaces, and numbers.",
            }))
        }
    }

    const handleProfilePictureChange = (event) => {
        setProfilePicture(event.target.files[0])
    }

    const handleCreatorIdChange = (event) => {
        const value = event.target.value
        const id = value.replace(/\s+/g, "-").toLowerCase()
        if (/^[a-z0-9\s\-]+$/.test(id)) {
            setCreatorId(id)
            setErrors((prevErrors) => ({ ...prevErrors, creatorId: "" }))
        } else if (value === "") {
            setCreatorId(id)
            setErrors((prevErrors) => ({
                ...prevErrors,
                creatorId: "Please enter a valid creator id",
            }))
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                creatorId: "Id should only contain letters, numbers, and hyphens.",
            }))
        }
    }

    const handleContributorChange = (event, index) => {
        const updatedContributors = [...contributors]
        updatedContributors[index] = event.target.value
        setContributors(updatedContributors)
    }

    const handleAddContributor = () => {
        setContributors([...contributors, ""])
    }

    const handleNextStep = (event) => {
        event.preventDefault()
        if (step === 1) {
            if (!creatorType) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    creatorType: "Please select a creator type.",
                }))
                return
            }
            if (!displayName) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    displayName: "Please enter a display name.",
                }))
                return
            }
        } else if (step === 2) {
            if (!profilePicture) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    profilePicture: "Please upload a profile picture.",
                }))
                return
            }

            if (creatorId == "") {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    creatorId: "Please enter a valid creator id.",
                }))
                return
            }
        }
        setStep(step + 1)
    }

    const handlePrevStep = () => {
        setStep(step - 1)
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <div className="mb-5">
                            <label className="mb-2 block font-semibold">Creator Type:</label>
                            <div className="font-medium text-gray-700">
                                <label className="mr-4 hover:cursor-pointer">
                                    <input
                                        type="radio"
                                        value="individual"
                                        checked={creatorType === "individual"}
                                        onChange={handleCreatorTypeChange}
                                        className="mr-1"
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
                            {errors.creatorType && (
                                <p className="mt-2 text-sm font-medium text-red-500">
                                    {errors.creatorType}
                                </p>
                            )}
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
                                placeholder={
                                    creatorType === "organization"
                                        ? "Eg: New Yorker"
                                        : "Eg: John Doe"
                                }
                                className="input w-full"
                            />
                            {errors.displayName && (
                                <p className="mt-2 text-sm font-medium text-red-500">
                                    {errors.displayName}
                                </p>
                            )}
                        </div>
                    </>
                )

            case 2:
                return (
                    <>
                        <div className="mb-4">
                            <label
                                htmlFor="profilePicture"
                                className="mb-2 block font-semibold">
                                Profile Picture:
                            </label>
                            <input
                                type="file"
                                id="profilePicture"
                                onChange={handleProfilePictureChange}
                                accept="image/*"
                                className="w-full rounded-xl border-2 px-3 py-2 file:mr-3 file:rounded-full file:border-0 file:bg-rose-50 file:px-4 file:py-1 file:text-sm file:font-semibold file:text-rose-700 hover:file:bg-rose-100"
                            />
                            {errors.profilePicture && (
                                <p className="mt-2 text-sm font-medium text-red-500">
                                    {errors.profilePicture}
                                </p>
                            )}
                        </div>
                        <div className="mb-4 flex flex-col">
                            <label htmlFor="creatorId" className="mb-2 block font-semibold">
                                Creator ID:
                            </label>
                            <input
                                type="text"
                                id="creatorId"
                                value={creatorId}
                                onChange={handleCreatorIdChange}
                                className="input bg-white"
                                placeholder="Eg: new-yorker"
                                aria-describedby="creatorId-helper"
                            />
                            {errors.creatorId && (
                                <p className="mt-2 text-sm font-medium text-red-500">
                                    {errors.creatorId}
                                </p>
                            )}

                            {suggestedCreatorId && (
                                <p className="mt-2 text-sm text-gray-700">
                                    The suggested Creator ID is{" "}
                                    <span className="font-semibold text-rose-500">
                                        {suggestedCreatorId}
                                    </span>
                                    . You can update it manually if needed.
                                </p>
                            )}
                            {suggestedCreatorId !== creatorId && (
                                <span
                                    className="ml-auto mt-1 w-fit rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 hover:cursor-pointer"
                                    onClick={() => setCreatorId(suggestedCreatorId)}>
                                    Use suggested Id
                                </span>
                            )}
                            <div className="mt-5 flex flex-col">
                                <span className="font-medium">
                                    This will be your profile link.
                                </span>
                                <div className="mt-2 flex items-center rounded-full border-2 bg-white px-3 py-1.5">
                                    <div className="flex flex-shrink-0 items-center rounded-full border bg-gray-100 px-3 py-1.5">
                                        <img
                                            src="/assets/icons/lock.svg"
                                            className="h-4 w-4"
                                            alt=""
                                        />
                                    </div>
                                    <span className="w-full whitespace-normal break-all px-2 text-sm font-medium leading-4">
                                        articleplus.alwinsunil.in/
                                        {creatorType === "organization"
                                            ? "organization"
                                            : "creator"}
                                        /{creatorId || suggestedCreatorId}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {creatorType === "organization" && (
                            <div className="mb-4">
                                <label className="mb-2 block font-semibold">
                                    Contributors:
                                </label>
                                {contributors.map((contributor, index) => (
                                    <div key={index} className="mb-2 flex items-center">
                                        <input
                                            type="text"
                                            value={contributor}
                                            onChange={(event) =>
                                                handleContributorChange(event, index)
                                            }
                                            className="input w-full"
                                            placeholder={`Contributor ${index + 1}`}
                                        />
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddContributor}
                                    className="mt-2 rounded-full bg-rose-500 px-4 py-2 font-medium text-white">
                                    Add Contributor
                                </button>
                            </div>
                        )}
                    </>
                )

            case 3:
                return <OnboardingOptions creatorType={creatorType} />
        }
    }

    return (
        <div className="wrapper flex flex-col items-center">
            <div className="my-12 flex w-full flex-col gap-1 sm:w-1/2 lg:w-1/3">
                <div className="mb-4 flex items-center font-medium text-gray-800">
                    <div
                        className={`mr-2 flex h-8 w-8 items-center justify-center rounded-full ${
                            step === 1 ? "bg-rose-500 text-white" : "bg-gray-100"
                        }`}>
                        1
                    </div>
                    <div
                        className={`mr-2 flex h-8 w-8 items-center justify-center rounded-full ${
                            step === 2 ? "bg-rose-500 text-white" : "bg-gray-100"
                        }`}>
                        2
                    </div>
                    <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            step === 3 ? "bg-rose-500 text-white" : "bg-gray-100"
                        }`}>
                        3
                    </div>
                </div>
                <p className="mb-3 text-3xl font-bold">Onboarding Creator</p>
                <form onSubmit={handleNextStep} className="flex flex-col">
                    {renderStep()}
                    <div className="mt-7 flex justify-between">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={handlePrevStep}
                                className="rounded-full border bg-gray-100 px-6 py-1.5 font-medium text-black">
                                Back
                            </button>
                        )}
                        <button
                            type="submit"
                            className="ml-auto rounded-full bg-rose-500 px-6 py-1.5 font-medium text-white">
                            {step === 3 ? "Submit" : "Next"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default OnboardingCreator
