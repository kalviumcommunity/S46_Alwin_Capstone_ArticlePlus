import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useSignalEffect } from "@preact/signals-react"
import { useSignals } from "@preact/signals-react/runtime"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

import { creatorInfo, isUserCreator } from "@/signals/creator"
import { userDetails, userExists } from "@/signals/user"
import { getCookie } from "@/helpers/cookies"
import axiosInstance from "@/axios"

function useLogic() {
    useSignals()

    const { pathname: currentPath } = useLocation()

    const [user, setUser] = useState()
    const [isSubNavActive, setIsSubNavActive] = useState(true)
    const [creator, setCreator] = useState()

    useSignalEffect(() => setCreator(creatorInfo.value))

    const navLinks = [
        { path: "/dashboard", label: "Dashboard" },
        { path: "/dashboard/articles", label: "Articles" },
        { path: "/dashboard/analytics", label: "Analytics" },
        { path: "/dashboard/settings", label: "Settings" },
        creatorInfo.value.type === "organization" && {
            path: "/dashboard/organization-settings",
            label: "Organization Settings",
        },
    ]

    const linksWithoutSubNav = ["/dashboard/editor", "/dashboard/new-article"]

    useSignalEffect(() => setUser(userDetails.value))

    useEffect(() => {
        setIsSubNavActive(true)
        for (const link of navLinks) {
            if (currentPath === link.path) {
                setIsSubNavActive(true)
                break
            }
        }
        for (const link of linksWithoutSubNav) {
            if (currentPath.includes(link)) {
                setIsSubNavActive(false)
                break
            }
        }
    }, [currentPath])

    const handleLogout = () => {
        const refreshTokenId = getCookie("refreshTokenId")
        axiosInstance
            .post("session/remove", { refreshTokenId, isCurrentSession: true })
            .then((res) => {
                userExists.value = false
            })
            .catch((err) => console.error(err))
    }

    return { user, creator, isSubNavActive, navLinks, currentPath, handleLogout }
}

function DashboardNavbar() {
    const { user, creator, isSubNavActive, navLinks, currentPath, handleLogout } = useLogic()

    return (
        <nav className="sticky top-0 z-40 flex flex-col bg-white">
            <div
                className={`flex flex-row items-center justify-between px-5 ${isSubNavActive ? `pb-1 pt-3` : `border-b pb-2.5 pt-3`} sm:px-8`}>
                <Link to="/" className="flex items-center gap-2">
                    <img className="h-5 w-fit" src="/logo.svg" alt="" />
                    <span className="pt-[0.1rem] font-serif text-xl font-bold leading-6">
                        Article +
                    </span>
                </Link>
                {user && user.name && (
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <div className="flex items-center gap-2 rounded-full border hover:cursor-pointer hover:bg-gray-50 ">
                                {user.picture ? (
                                    <img
                                        className="h-8 w-8 rounded-full"
                                        src={`${user.picture}`}
                                        alt=""
                                    />
                                ) : (
                                    <img
                                        className="h-8 w-8 rounded-full"
                                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                                        alt=""
                                    />
                                )}
                            </div>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                className="z-50 w-64 min-w-52 rounded-md border-2 bg-white"
                                align="end"
                                sideOffset={5}>
                                <div className="mx-3 my-2 flex flex-col px-2 py-1">
                                    <span className="font-medium">{user.name}</span>
                                    <span className="truncate text-sm text-gray-600">
                                        {user.email}
                                    </span>
                                </div>
                                <DropdownMenu.Separator className="mx-1 h-px bg-gray-100" />
                                {(user && user.creator) || (user && isUserCreator.value) ? (
                                    <Link to="/dashboard">
                                        <DropdownMenu.Item className="dropdown-item text-black hover:bg-black hover:text-white">
                                            Dashboard
                                        </DropdownMenu.Item>
                                    </Link>
                                ) : (
                                    <Link to="/onboarding">
                                        <DropdownMenu.Item className="dropdown-item text-black hover:bg-black hover:text-white">
                                            Become a Creator 🔦
                                        </DropdownMenu.Item>
                                    </Link>
                                )}
                                <Link to="/account">
                                    <DropdownMenu.Item className="dropdown-item mb-0">
                                        Account & Settings
                                    </DropdownMenu.Item>
                                </Link>
                                <DropdownMenu.Separator className="mx-1 h-px bg-gray-100" />
                                <DropdownMenu.Item
                                    className="dropdown-item bg-red-100 font-semibold text-red-500 hover:bg-red-500 hover:text-white"
                                    onClick={handleLogout}>
                                    Log out
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                )}
            </div>
            {isSubNavActive && (
                <>
                    <div className="flex items-center gap-2 overflow-x-scroll border-b px-4 text-sm text-gray-600 sm:overflow-auto sm:px-6">
                        {navLinks.map((link, index) => (
                            <Link
                                key={index}
                                to={link.path}
                                className={`${
                                    currentPath === link.path
                                        ? "group border-b-2 border-gray-800 font-medium text-gray-900 hover:border-gray-800"
                                        : "group border-white font-medium text-gray-500 hover:text-gray-900"
                                } border-b-2 py-1`}>
                                <div className="rounded px-3 py-1.5 group-hover:bg-gray-100">
                                    {link.label}
                                </div>
                            </Link>
                        ))}
                    </div>
                    {creator?.type === "organization" && creator?.user?.role !== "owner" && (
                        <div className="flex justify-center gap-1 border-b border-yellow-200 bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-700 sm:overflow-auto sm:px-6">
                            Your account is managed by
                            <Link
                                to="/dashboard/organization-settings"
                                className="text-yellow-700 underline">
                                your organization
                            </Link>
                        </div>
                    )}
                </>
            )}
        </nav>
    )
}

export default DashboardNavbar
