import { Outlet } from "react-router-dom"
import { useSignals } from "@preact/signals-react/runtime"

import DashboardNavbar from "@/components/Dashboard/Navbar"

function DashboardLayout() {
    useSignals()

    return (
        <>
            <DashboardNavbar />
            <Outlet />
        </>
    )
}

export default DashboardLayout
