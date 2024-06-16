import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useSignalEffect } from "@preact/signals-react"
import { useSignals } from "@preact/signals-react/runtime"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

import { isUserCreator } from "@/signals/creator"
import { userDetails, userExists } from "@/signals/user"
import { getCookie, setCookie } from "@/helpers/cookies"
import axiosInstance from "@/axios"

function Navbar() {
    useSignals()

    const [scrolled, setScrolled] = useState(false)
    const [user, setUser] = useState()

    useSignalEffect(() => setUser(userDetails.value))

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 0
            setScrolled(isScrolled)
        }

        window.addEventListener("scroll", handleScroll)

        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    const handleLogout = () => {
        const refreshTokenId = getCookie("refreshTokenId")
        axiosInstance
            .post("session/remove", { refreshTokenId })
            .then((res) => {
                setCookie("accessToken", null)
                setCookie("refreshToken", null)
                setCookie("refreshTokenId", null)
                userExists.value = false
            })
            .catch((err) => console.error(err))
    }

    return (
        <div
            className={`sticky top-0 z-40 flex flex-row items-center justify-between bg-white sm:min-h-12 ${userExists.value ? "pb-3 pt-3" : "pb-4 pt-5"} ${
                scrolled ? "px-4 !pb-3 !pt-3 sm:px-6 lg:px-12" : "px-4 py-3 sm:px-8 lg:px-16"
            }`}
            id="navbar">
            <Link to="/" className="flex items-center gap-2">
                <img className="h-5 w-fit" src="/logo.svg" alt="" />
                <span className="pt-[0.1rem] font-serif text-2xl font-bold leading-6">
                    Article
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
    )
}

export default Navbar
