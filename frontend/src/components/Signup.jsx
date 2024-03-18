import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useSignals } from "@preact/signals-react/runtime"
import { userExists } from "@/signals/user"
import { setCookie } from "@/helpers/cookies"
import axiosInstance from "@/axios"

function Signup() {
    useSignals()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const handleSignup = (payload) => {
        axiosInstance
            .post("auth/signup", payload)
            .then((res) => {
                const data = res.data
                setCookie("accessToken", data.accessToken, 0.041)
                setCookie("refreshToken", data.refreshToken, 1)
                userExists.value = true
            })
            .catch((error) => console.error("Signup error:", error))
    }

    const onSubmit = (data) => {
        handleSignup(data)
    }

    const handleGoogleSignup = () => {
        window.open(`${import.meta.env.VITE_API_URL}/auth/google/`, "_self")
    }

    return (
        <div className="sm:py-26 mx-4 flex flex-col items-center gap-4  border-b pb-16 pt-10 sm:mx-16 sm:gap-6">
            <div className="flex flex-col gap-3 sm:w-96">
                <h1 className="mb-2 mr-auto text-4xl font-semibold">Signup</h1>
                <form
                    className="flex flex-col gap-3"
                    onSubmit={handleSubmit(onSubmit)}>
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
                        <label
                            className="font-medium"
                            htmlFor="confirmPassword">
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
                            className="w-full rounded-full border-2 border-black bg-rose-500 px-4 py-2 font-semibold text-white underline decoration-white decoration-wavy">
                            Signup
                        </button>
                    </div>
                </form>
                <hr className="my-2" />
                <div>
                    <span
                        className="flex justify-center gap-2 rounded-full border-2 border-black px-4 py-2 font-semibold shadow hover:cursor-pointer"
                        onClick={handleGoogleSignup}>
                        <img src="/assets/icons/google.svg" alt="" /> Sign up
                        with Google
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
            </div>
        </div>
    )
}

export default Signup
