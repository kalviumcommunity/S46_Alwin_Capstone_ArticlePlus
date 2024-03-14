import React, { useEffect } from "react"
import { userDetails } from "@/signals/user"
import { useSignals } from "@preact/signals-react/runtime"
import axiosInstance from "@/axios"

function Read() {
    useSignals()

    useEffect(() => {
        axiosInstance.get("auth").then((res) => (userDetails.value = res.data))
    }, [])

    return (
        <div className="container flex-col">
            <span>Hello, Readers👋</span>
        </div>
    )
}

export default Read
