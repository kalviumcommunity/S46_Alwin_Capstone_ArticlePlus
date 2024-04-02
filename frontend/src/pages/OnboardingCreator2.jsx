import React, { useState } from "react"

function OnboardingCreator() {
    const [step, setStep] = useState(1)
    const [creatorType, setCreatorType] = useState("")
    const [displayName, setDisplayName] = useState("")
    const [profilePicture, setProfilePicture] = useState(null)
    const [creatorId, setCreatorId] = useState("")
    const [contributors, setContributors] = useState([])

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
                                className="w-full rounded-xl border-2 px-3 py-2 file:mr-3 file:rounded-full file:border-0 file:bg-rose-50 file:px-4 file:py-1 file:text-sm file:font-semibold file:text-rose-700 hover:file:bg-rose-100"
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
                return (
                    <>
                        <p>Info</p>
                        {creatorType === "individual" && <p>Pricing for Individual</p>}
                        {creatorType === "organization" && <p>Pricing for Organization</p>}
                    </>
                )
            default:
                return null
        }
    }

    return (
        <div className="wrapper flex flex-col items-center">
            <div className="my-10 flex w-full flex-col gap-1 sm:w-1/2 lg:w-1/3">
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
                <p className="mb-4 text-3xl font-bold">Onboarding Creator</p>
                <form onSubmit={handleNextStep} className="mt-4 flex flex-col">
                    {renderStep()}
                    <div className="mt-4 flex justify-between">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={handlePrevStep}
                                className="rounded-full bg-gray-300 px-4 py-2 font-medium text-gray-700">
                                Back
                            </button>
                        )}
                        <button
                            type="submit"
                            className="ml-auto rounded-full bg-rose-500 px-6 py-2 font-medium text-white">
                            {step === 3 ? "Submit" : "Next"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default OnboardingCreator
