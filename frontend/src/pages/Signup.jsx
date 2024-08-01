import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { useSignals } from "@preact/signals-react/runtime"

import { userExists } from "@/signals/user"
import axiosInstance from "@/axios"

import Loader from "@/ui/Loader"

function Signup() {
    useSignals()

    const [isLoading, setIsLoading] = useState(false)
    const [actionStatus, setActionStatus] = useState("")

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm()

    const handleSignup = (payload) => {
        setIsLoading(true)
        setActionStatus("")

        axiosInstance
            .post("auth/signup", payload)
            .then((res) => {
                userExists.value = true
            })
            .catch((error) => {
                setActionStatus(error.response.data)
                console.error(error)
            })
            .finally(() => {
                setIsLoading(false)
                reset()
            })
    }

    const resetState = () => {
        setActionStatus("")
        reset()
    }

    const onSubmit = (data) => {
        handleSignup(data)
    }

    const handleGoogleSignup = () => {
        axiosInstance
            .get("/auth/google/redirect")
            .then((res) => (window.location.href = res.data.url))
            .catch((error) => {
                console.error("Error checking authentication status:", error)
            })
    }

    return (
        <div className="sm:py-26 mx-4 flex flex-col items-center gap-4 pb-16 pt-10 sm:mx-16 sm:gap-6">
            <div className="flex flex-col gap-3 sm:w-96">
                <h1 className="mb-2 mr-auto text-4xl font-semibold">Signup</h1>
                {isLoading ? (
                    <Loader />
                ) : actionStatus ? (
                    <>
                        <div className="mb-10 mt-8 flex flex-col items-start gap-1">
                            <span className="text-base font-medium underline decoration-rose-500 decoration-wavy">
                                {actionStatus.email}
                            </span>
                            <p className="mt-2 text-lg font-normal text-gray-700">
                                {actionStatus.message}
                            </p>
                            <button
                                className="mt-4 rounded-full bg-rose-500 px-6 py-1 font-semibold text-white"
                                onClick={resetState}>
                                Signup again
                            </button>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-start gap-4 py-2">
                            <span className="text-base">
                                Already have an account?&nbsp;
                                <Link
                                    className="font-semibold text-blue-700 underline"
                                    to="/login">
                                    Login
                                </Link>
                            </span>
                        </div>
                    </>
                ) : (
                    <>
                        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-1">
                                <label className="font-medium" htmlFor="name">
                                    Full name
                                </label>
                                <input
                                    className={`input ${errors.name ? "border-red-500" : ""}`}
                                    type="text"
                                    {...register("name", {
                                        required: "Full name is required",
                                    })}
                                />
                                {errors.fullname && (
                                    <span className="text-sm text-red-500">
                                        {errors.fullname.message}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="font-medium" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    className={`input ${errors.email ? "border-red-500" : ""}`}
                                    type="email"
                                    autoComplete="username"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address",
                                        },
                                    })}
                                />
                                {errors.email && (
                                    <span className="text-sm text-red-500">
                                        {errors.email.message}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="font-medium" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    className={`input ${errors.password ? "border-red-500" : ""}`}
                                    type="password"
                                    autoComplete="new-password"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 8,
                                            message:
                                                "Password must be at least 8 characters long",
                                        },
                                    })}
                                />
                                {errors.password && (
                                    <span className="text-sm text-red-500">
                                        {errors.password.message}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="font-medium" htmlFor="confirmPassword">
                                    Confirm Password
                                </label>
                                <input
                                    className={`input ${errors.confirmPassword ? "border-red-500" : ""}`}
                                    type="password"
                                    autoComplete="new-password"
                                    {...register("confirmPassword", {
                                        required: "Please confirm your password",
                                        validate: (value) =>
                                            value === watch("password") ||
                                            "Passwords do not match",
                                    })}
                                />
                                {errors.confirmPassword && (
                                    <span className="text-sm text-red-500">
                                        {errors.confirmPassword.message}
                                    </span>
                                )}
                            </div>
                            <div className="my-3">
                                <button
                                    type="submit"
                                    className="w-full rounded-full border-2 border-black bg-rose-500 px-4 py-2 font-semibold text-white">
                                    Signup
                                </button>
                            </div>
                        </form>
                        <hr className="my-2" />
                        <div>
                            <span
                                className="flex justify-center gap-2 rounded-full border-2 border-black px-4 py-2 font-semibold shadow hover:cursor-pointer"
                                onClick={handleGoogleSignup}>
                                <img src="/assets/icons/google.svg" alt="" />
                                Sign up with Google
                            </span>
                        </div>
                        <div className="flex justify-center gap-4 py-2">
                            <span className="text-base">
                                Already have an account?&nbsp;
                                <Link
                                    className="font-semibold text-blue-700 underline"
                                    to="/login">
                                    Login
                                </Link>
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Signup
