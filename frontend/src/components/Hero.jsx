import { userExists } from "@/signals/user"
import React from "react"
import { Link } from "react-router-dom"

function Hero() {
    return (
        <div className="mx-4 flex flex-col gap-4 py-20 sm:mx-16 sm:gap-6 sm:py-28">
            <h1 className="font-poppins text-4xl font-bold sm:w-full sm:text-6xl sm:leading-[1.1] xl:w-2/3 xl:leading-none">
                Understand what's happening in the world
            </h1>
            <div className="flex gap-1">
                <Link
                    to="/read"
                    className="rounded-full bg-rose-500 px-6 py-1 font-semibold text-white"
                >
                    Read
                </Link>
                <Link
                    to="/signup"
                    className="px-6 py-1 font-semibold underline decoration-rose-500 decoration-wavy"
                >
                    Signup
                </Link>
            </div>
        </div>
    )
}

export default Hero
