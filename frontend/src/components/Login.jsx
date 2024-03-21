import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useSignals } from "@preact/signals-react/runtime"
import axiosInstance from "@/axios"
import { userExists } from "@/signals/user"
import Loader from "@/components/Loader"
import { useState } from "react"

function Login() {
    useSignals()

    const [isLoading, setIsLoading] = useState(false)
    const [actionStatus, setActionStatus] = useState("")

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm()

    const handleLogin = (payload) => {
        setIsLoading(true)
        setActionStatus("")

        axiosInstance
            .post("auth/login", payload)
            .then((res) => {
                userExists.value = true
            })
            .catch((error) => {
                if (error.response.data) {
                    setActionStatus(error.response.data)
                } else {
                    setActionStatus({ message: "Sorry, an error occurred" })
                }
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
        handleLogin(data)
    }

    const handleGoogleLogin = () => {
        window.open(`${import.meta.env.VITE_API_URL}/auth/google/`, "_self")
    }

    return (
        <div className="sm:py-26 mx-4 flex flex-col items-center gap-4 border-b pb-16 pt-10 sm:mx-16 sm:gap-6">
            <div className="flex w-full flex-col gap-3 sm:w-96">
                <h1 className="mb-2 mr-auto text-4xl font-semibold">Login</h1>
                {isLoading ? (
                    <Loader />
                ) : actionStatus ? (
                    <>
                        <div className="mb-10 mt-8 flex flex-col items-start">
                            <span className="text-base font-medium underline decoration-rose-500 decoration-wavy">
                                {actionStatus.email}
                            </span>
                            <p className="mt-2 text-lg font-normal text-gray-700">
                                {actionStatus.message}
                            </p>
                            <button
                                className="mt-4 rounded-full bg-rose-500 px-6 py-1 font-semibold text-white"
                                onClick={resetState}>
                                Login again
                            </button>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-start gap-4 py-1">
                            <span className="text-base">
                                Doesn't have an accout?&nbsp;
                                <Link
                                    className="font-semibold text-blue-700 underline"
                                    to="/signup">
                                    Signup
                                </Link>
                            </span>
                        </div>
                    </>
                ) : (
                    <>
                        <form
                            className="flex flex-col gap-3"
                            onSubmit={handleSubmit(onSubmit)}>
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
                                <label
                                    className="font-medium"
                                    htmlFor="password">
                                    Password
                                </label>
                                <input
                                    className={`input ${errors.password ? "border-red-500" : ""}`}
                                    type="password"
                                    autoComplete="current-password"
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
                            <div className="my-3">
                                <button
                                    type="submit"
                                    className="w-full rounded-full border-2 border-black bg-rose-500 px-4 py-2 font-semibold text-white underline decoration-white decoration-wavy">
                                    Login
                                </button>
                            </div>
                        </form>
                        <hr className="my-2" />
                        <div>
                            <span
                                className="flex justify-center gap-2 rounded-full border-2 border-black px-4 py-2 font-semibold shadow hover:cursor-pointer"
                                onClick={handleGoogleLogin}>
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                                    alt=""
                                />{" "}
                                Login with Google
                            </span>
                        </div>
                        <div className="flex justify-center gap-4 py-1">
                            <span className="text-base">
                                Doesn't have an accout?&nbsp;
                                <Link
                                    className="font-semibold text-blue-700 underline"
                                    to="/signup">
                                    Signup
                                </Link>
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Login
