import { Outlet } from "react-router-dom"
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime"

import { creatorInfo } from "@/signals/creator"
import axiosInstance from "@/axios"

import DashboardNavbar from "@/components/Dashboard/Navbar"

export const fetchCreatorInfo = async () => {
    try {
        const response = await axiosInstance.get("/creator/dashboard/auth/info")
        creatorInfo.value = response.data
        console.log(response.data)
    } catch (error) {
        console.error("Error fetching creator info:", error)
    }
}

function DashboardLayout() {
    useSignals()

    useSignalEffect(() => {
        fetchCreatorInfo()
    })

    return (
        <>
            <DashboardNavbar />
            <Outlet />
        </>
    )
}

export default DashboardLayout
