import { Outlet } from "react-router-dom"

import DashboardSubNav from "@/components/Dashboard/Nav"

function DashboardLayout() {
    return (
        <div className="mb-10 flex flex-col gap-2">
            <DashboardSubNav />
            <Outlet />
        </div>
    )
}

export default DashboardLayout
