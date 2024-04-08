import { useState } from "react"
import { redirect } from "react-router-dom"
import imageCompression from "browser-image-compression"

import { creatorInfo, isUserCreator } from "@/signals/creator"
import axiosInstance from "@/axios"

import OnboardingOptions from "@/components/OnboardingOptions"

function OnboardingCreator() {
    const [step, setStep] = useState(1)
    const [suggestedCreatorId, setSuggestedCreatorId] = useState("")

    const [creatorForm, setCreatorForm] = useState({
        id: "",
        name: "",
        picture: "",
        description: "",
        type: "",
        subscription: false,
        subscriptions: [],
    })

    const [errors, setErrors] = useState({})

    const handleCreatorTypeChange = (event) => {
        setCreatorForm((prevState) => ({
            ...prevState,
            type: event.target.value,
        }))
    }

    const handleDisplayNameChange = (event) => {
        const { value } = event.target
        const trimmedValue = value.trim()

        // Check if the trimmed value is empty or if the input value is empty
        if (trimmedValue === "" || value === "") {
            setCreatorForm((prevState) => ({
                ...prevState,
                name: "",
                id: "",
            }))
            setSuggestedCreatorId("")
            setErrors((prevErrors) => ({
                ...prevErrors,
                displayName: "Display name cannot contain trailing spaces.",
            }))
            return
        }

        // Check if the value contains only allowed characters
        if (/^[a-zA-Z0-9\s]+$/.test(value)) {
            setErrors((prevErrors) => ({ ...prevErrors, displayName: "" }))
            const id = value.replace(/\s+/g, "-").toLowerCase()
            setSuggestedCreatorId(id)
            setCreatorForm((prevState) => ({
                ...prevState,
                name: value,
                id: id,
            }))
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                displayName: "Display name should only contain letters, spaces, and numbers.",
            }))
        }
    }

    const handleDescriptionChange = (event) => {
        setCreatorForm((prevState) => ({
            ...prevState,
            description: event.target.value,
        }))
    }

    const handleProfilePictureChange = async (event) => {
        const imageFile = event.target.files[0]
        console.log("originalFile instanceof Blob", imageFile instanceof Blob)
        console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`)

        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        }
        try {
            const compressedFile = await imageCompression(imageFile, options)
            console.log("compressedFile instanceof Blob", compressedFile instanceof Blob)
            console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`)

            setCreatorForm((prevState) => ({
                ...prevState,
                picture: compressedFile,
            }))
        } catch (error) {
            console.log(error)
        }
    }

    const handleCreatorIdChange = (event) => {
        const value = event.target.value
        const id = value.replace(/\s+/g, "-").toLowerCase()
        if (/^[a-z0-9\s\-]+$/.test(id)) {
            setCreatorForm((prevState) => ({
                ...prevState,
                id: id,
            }))
            setErrors((prevErrors) => ({ ...prevErrors, creatorId: "" }))
        } else if (value === "") {
            setCreatorForm((prevState) => ({
                ...prevState,
                id: id,
            }))
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

    const onboardCreator = () => {
        axiosInstance
            .post("/creator/onboarding", creatorForm)
            .then((response) => {
                isUserCreator.value = true
                creatorInfo.value = response.data
                redirect("/dashboard")
                console.log("successfully onboarded")
            })
            .catch((error) => {
                console.error(error)
                console.log("failed to onboard")
            })
    }

    const handleNextStep = (event) => {
        event.preventDefault()

        if (step < 1 || step > 3) return

        if (step === 1) {
            if (!creatorForm.type) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    creatorType: "Please select a creator type.",
                }))
                return
            }
            if (!creatorForm.name) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    displayName: "Please enter a display name.",
                }))
                return
            }
            if (!creatorForm.description) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    description: "Please enter a description.",
                }))
                return
            }
            setStep(step + 1)
        } else if (step === 2) {
            if (!creatorForm.picture) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    profilePicture: "Please upload a profile picture.",
                }))
                return
            }
            if (!creatorForm.id.match(/^[a-z0-9\-]+$/)) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    creatorId: "Please enter a valid creator ID.",
                }))
                return
            }
            setStep(step + 1)
        } else if (step === 3) {
            onboardCreator()
        }
    }

    const handlePrevStep = () => {
        setStep(step - 1)
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
                <div className="flex flex-col">
                    {step === 1 && (
                        <>
                            <div className="mb-5">
                                <label className="mb-2 block font-semibold">
                                    Creator Type:
                                </label>
                                <div className="font-medium text-gray-700">
                                    <label className="mr-4 hover:cursor-pointer">
                                        <input
                                            type="radio"
                                            value="individual"
                                            checked={creatorForm.type === "individual"}
                                            onChange={handleCreatorTypeChange}
                                            className="mr-1"
                                        />
                                        Individual
                                    </label>
                                    <label className="hover:cursor-pointer">
                                        <input
                                            type="radio"
                                            value="organization"
                                            checked={creatorForm.type === "organization"}
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
                                <label
                                    htmlFor="displayName"
                                    className="mb-2 block font-semibold">
                                    Display Name:
                                </label>
                                <input
                                    type="text"
                                    id="displayName"
                                    value={creatorForm.name}
                                    onChange={handleDisplayNameChange}
                                    placeholder={
                                        creatorForm.type === "organization"
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
                            <div className="mb-4">
                                <label
                                    htmlFor="description"
                                    className="mb-2 block font-semibold">
                                    Description:
                                </label>
                                <textarea
                                    rows={4}
                                    type="text"
                                    id="description"
                                    value={creatorForm.description}
                                    onChange={handleDescriptionChange}
                                    placeholder={
                                        creatorForm.type === "organization"
                                            ? "The New Yorker is an American weekly magazine featuring journalism, commentary, criticism, essays, fiction, satire, cartoons, and poetry."
                                            : "John Doe is an investigative journalist uncovering stories that matter."
                                    }
                                    className="input w-full"
                                />
                                {errors.description && (
                                    <p className="mt-2 text-sm font-medium text-red-500">
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <div className="mb-4">
                                <label
                                    htmlFor="profilePicture"
                                    className="mb-2 block font-semibold">
                                    Profile Picture:
                                </label>
                                <input
                                    type="file"
                                    className="w-full rounded-xl border-2 px-3 py-2 file:mr-3 file:rounded-full file:border-0 file:bg-rose-50 file:px-4 file:py-1 file:text-sm file:font-semibold file:text-rose-700 hover:file:bg-rose-100"
                                    id="profilePicture"
                                    onChange={handleProfilePictureChange}
                                    accept="image/*"
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
                                    value={creatorForm.id}
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
                                {suggestedCreatorId !== creatorForm.id && (
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
                                                className="h-4 w-4"
                                                src="/assets/icons/lock.svg"
                                                alt=""
                                            />
                                        </div>
                                        <span className="w-full whitespace-normal break-all px-2 text-sm font-medium leading-4">
                                            articleplus.alwinsunil.in/
                                            {creatorForm.type === "organization"
                                                ? "organization"
                                                : "creator"}
                                            /{creatorForm.id || suggestedCreatorId}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <OnboardingOptions
                            creatorType={creatorForm.type}
                            setCreatorForm={setCreatorForm}
                        />
                    )}

                    <div className="mt-7 flex justify-between">
                        {step > 1 && (
                            <button
                                className="rounded-full border bg-gray-100 px-6 py-1.5 font-medium text-black"
                                type="button"
                                onClick={handlePrevStep}>
                                Back
                            </button>
                        )}
                        <button
                            className="ml-auto rounded-full bg-rose-500 px-6 py-1.5 font-medium text-white"
                            onClick={handleNextStep}>
                            {step === 3 ? "Submit" : "Next"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OnboardingCreator
