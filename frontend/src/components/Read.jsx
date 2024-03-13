import React, { useEffect } from "react"
import { userExists } from "@/signals/user"
import { useSignals } from "@preact/signals-react/runtime"
import { setCookie } from "@/helpers/cookies"
import axios from "@/axios"

function Read() {
    useSignals()

    const handleLogout = () => {
        setCookie("accessToken", null)
        setCookie("refreshToken", null)
        userExists.value = false
    }

    useEffect(() => {
        axios
            .get("auth/")
            .then((res) => console.log(res))
            .catch((err) => console.log(err))
    })

    return (
        <div className="container flex-col">
            <span>Hello, Readers👋</span>
            <button
                className="bg-red-500 py-2 px-6 font-semibold text-white rounded-full w-fit"
                onClick={handleLogout}
            >
                Log out
            </button>
        </div>
    )
}

export default Read
