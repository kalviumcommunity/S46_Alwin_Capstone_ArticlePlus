import { useEffect } from "react"
import { Outlet, redirect } from "react-router-dom"
import { useSignals } from "@preact/signals-react/runtime"

import { isUserCreator } from "@/signals/creator"

import DashboardSubNav from "@/components/Dashboard/Nav"

function DashboardLayout() {
    useSignals()

    useEffect(() => {
        if (!isUserCreator.value) {
            redirect("/onboarding")
        }
    }, [])

    return (
        <div className="mb-10 flex flex-col gap-2">
            <DashboardSubNav />
            <Outlet />
        </div>
    )
}

export default DashboardLayout
