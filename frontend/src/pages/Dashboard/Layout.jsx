import { Outlet } from "react-router-dom"
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime"

import { creatorInfo } from "@/signals/creator"
import axiosInstance from "@/axios"

import DashboardNavbar from "@/components/Dashboard/Navbar"

function DashboardLayout() {
    useSignals()

    useSignalEffect(() => {
        axiosInstance.get("/creator/auth/info").then((response) => {
            creatorInfo.value = response.data
            console.log(response.data)
        })
    })

    return (
        <>
            <DashboardNavbar />
            <Outlet />
        </>
    )
}

export default DashboardLayout
