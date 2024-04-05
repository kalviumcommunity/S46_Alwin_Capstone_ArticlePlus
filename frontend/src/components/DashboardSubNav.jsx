import { Link, useLocation } from "react-router-dom"

function DashboardSubNav() {
    const currentPath = useLocation().pathname

    const navLinks = [
        { path: "/dashboard", label: "Dashboard" },
        { path: "/dashboard/articles", label: "Articles" },
        { path: "/dashboard/analytics", label: "Analytics" },
        { path: "/dashboard/settings", label: "Settings" },
    ]

    return (
        <nav className="flex items-center overflow-x-scroll border-b px-4 pt-2 text-sm text-gray-600 sm:overflow-auto sm:px-8 lg:px-14">
            {navLinks.map((link, index) => (
                <Link
                    key={index}
                    to={link.path}
                    className={`${
                        currentPath === link.path
                            ? "border-b-2 border-gray-800 font-medium text-gray-900 hover:border-gray-800"
                            : "font-medium text-gray-500 hover:text-gray-900"
                    } rounded-t-sm border-b-2 border-white px-3 pb-1.5 pt-2 hover:border-gray-100 hover:bg-gray-100 sm:pb-2`}>
                    {link.label}
                </Link>
            ))}
        </nav>
    )
}

export default DashboardSubNav
