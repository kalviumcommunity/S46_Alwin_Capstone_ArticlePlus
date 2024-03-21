import { useEffect, useState } from "react"
import Loader from "@/components/Loader"
import { Link, useSearchParams } from "react-router-dom"
import { userExists } from "@/signals/user"

function AuthGoogle() {
    const [loader, setLoader] = useState(true)
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const status = searchParams.get("status")
        if (status === "success") {
            userExists.value = true
        } else {
            setLoader(false)
        }
    }, [searchParams])

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
