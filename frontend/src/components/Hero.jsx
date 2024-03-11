import React from "react"
import { Link } from "react-router-dom"

function Hero() {
    return (
        <div className="flex flex-col mx-4 py-20 gap-4 sm:mx-16 sm:gap-6 sm:py-28">
            <h1 className="text-4xl font-bold font-poppins sm:text-6xl sm:w-2/3">
                Understand what's happening in the world
            </h1>
            <div className="flex gap-1">
                <Link
                    to="/read"
                    className="font-semibold px-6 py-1 bg-rose-500 text-white"
                >
                    Read
                </Link>
                <Link
                    to="/signup"
                    className="font-semibold px-6 py-1 underline decoration-wavy decoration-rose-500"
                >
                    Signup
                </Link>
            </div>
        </div>
    )
}

export default Hero
