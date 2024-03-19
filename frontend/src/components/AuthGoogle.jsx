import { useEffect, useState } from "react"
import axiosInstance from "@/axios"
import { userExists } from "@/signals/user"
import { setCookie } from "@/helpers/cookies"
import { Link } from "react-router-dom"
import Loader from "@/components/Loader"

function AuthGoogle() {
    const [loader, setLoader] = useState(true)

    useEffect(() => {
        axiosInstance
            .get("/auth/google/status", { withCredentials: true })
            .then((res) => {
                const { isAuthenticated, accessToken, refreshToken } = res.data
                if (isAuthenticated) {
                    setCookie("accessToken", accessToken, 0.041)
                    setCookie("refreshToken", refreshToken, 1)
                    userExists.value = true
                } else {
                    userExists.value = false
                    setLoader(false)
                }
            })
            .catch((error) => {
                console.error("Error checking authentication status:", error)
            })
    }, [])

    return (
        <div>
            {loader ? (
                <Loader />
            ) : (
                <div className="mx-4 flex flex-col items-center gap-4 py-20 sm:mx-16 sm:gap-6 sm:pb-32 sm:pt-20">
                    <div className="border-red rounded-sm border-2 border-gray-100 px-6 py-10 sm:px-10">
                        <div className="flex flex-col gap-2 sm:w-96">
                            <div className="flex flex-col gap-1">
                                <img
                                    className="mb-1 h-8 w-8"
                                    src="/assets/icons/google.svg"
                                    alt=""
                                />
                                <span className="text-2xl font-medium">
                                    Authentication with Google failed
                                </span>
                                <span className="font-normal text-gray-700">
                                    Please try again
                                </span>
                            </div>
                            <div className="mt-2">
                                <Link
                                    to="/login"
                                    className="rounded-full bg-rose-500 px-6 py-1  font-semibold text-white">
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-6 py-1 font-semibold underline decoration-rose-500">
                                    Signup
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AuthGoogle
