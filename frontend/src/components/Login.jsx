import React from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { setCookie } from "../helpers/cookies"
import { userExists } from "../signals/user"
import axios from "../axios"

function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const handleLogin = (payload) => {
        axios
            .post("auth/login", payload)
            .then((res) => {
                const data = res.data
                setCookie("accessToken", data.accessToken, 0.041)
                setCookie("refreshToken", data.refreshToken, 1)
                userExists.value = true
            })
            .catch((error) => console.log("Login error:", error))
    }

    const onSubmit = (data) => {
        handleLogin(data)
    }

    return (
        <div className="flex flex-col items-center mx-4 pt-10 pb-16  gap-4 border-b sm:mx-16 sm:py-26 sm:gap-6">
            <div className="flex flex-col gap-3 sm:w-96">
                <h1 className="text-4xl font-semibold mr-auto mb-2">Login</h1>
                <form
                    className="flex flex-col gap-3"
                    onSubmit={handleSubmit(onSubmit)}
                >
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
                            className="w-full px-4 py-2 font-semibold border-2 border-black bg-rose-500 text-white underline decoration-white decoration-wavy rounded-full"
                        >
                            Login
                        </button>
                    </div>
                </form>
                <hr className="my-2" />
                <div>
                    <span className="flex gap-2 border-2 border-black font-semibold shadow px-4 py-2 justify-center hover:cursor-pointer rounded-full">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                            alt=""
                        />{" "}
                        Login with Google
                    </span>
                </div>
                <div className="flex gap-4 justify-center py-1">
                    <span className="text-base">
                        Doesn't have an accout?&nbsp;
                        <Link
                            className="font-semibold underline text-blue-700"
                            to="/signup"
                        >
                            Signup
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Login
