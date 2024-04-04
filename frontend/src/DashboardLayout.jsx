import { Outlet } from "react-router-dom"

function DashboardLayout() {
    return (
        <div className="mb-10 flex flex-col gap-2">
            <div className="wrapper flex gap-2 border-b py-2.5 font-semibold">
                <span>Dashboard</span>
            </div>
            <Outlet />
        </div>
    )
}

export default DashboardLayout
