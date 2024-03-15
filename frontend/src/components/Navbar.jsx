import { useState, useEffect } from "react"
import { useSignals } from "@preact/signals-react/runtime"
import { useSignalEffect } from "@preact/signals-react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { Link } from "react-router-dom"
import { setCookie } from "@/helpers/cookies"
import { userDetails, userExists } from "@/signals/user"
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
        axiosInstance
            .post("auth/logout")
            .then((res) => {
                setCookie("accessToken", null)
                setCookie("refreshToken", null)
                userExists.value = false
            })
            .catch((err) => console.error(err))
    }

    return (
        <div
            className={`sticky top-0 flex flex-row justify-between bg-white ${
                scrolled ? "border px-4 py-4 sm:px-12" : "px-4 py-6 sm:px-16"
            }`}
            id="navbar"
        >
            <Link to="/" className="flex items-center gap-3">
                <>
                    <img className="h-6" src="./logo.svg" alt="" />
                    <span className="pt-[0.1rem] font-serif text-2xl font-semibold leading-6">
                        Article+
                    </span>
                </>
            </Link>
            {user && user.name && (
                <div>
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <div className="flex items-center gap-2 rounded-full border p-1 pr-4 hover:cursor-pointer hover:bg-gray-50 ">
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
                                <span className="font-medium">{user.name}</span>
                            </div>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                className="DropdownMenuContent min-w-48 rounded-md border-2"
                                align="end"
                                sideOffset={5}
                            >
                                <DropdownMenu.Item className="DropdownMenuItem">
                                    Account & Settings
                                </DropdownMenu.Item>
                                <DropdownMenu.Separator className="mx-1 h-px bg-gray-100" />
                                <DropdownMenu.Item
                                    className="DropdownMenuItem bg-red-500 font-semibold text-white hover:bg-red-600"
                                    onClick={handleLogout}
                                >
                                    Log out
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>
            )}
        </div>
    )
}

export default Navbar
