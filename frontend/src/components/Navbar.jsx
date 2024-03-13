import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"

function Navbar() {
    const [scrolled, setScrolled] = useState(false)

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

    return (
        <div
            className={`flex flex-row sticky top-0 bg-white ${
                scrolled ? "px-4 py-4 sm:px-12 border" : "px-4 py-6 sm:px-16"
            }`}
            id="navbar"
        >
            <Link to="/" className="flex gap-4 items-center">
                <>
                    <img className="h-6" src="./logo.svg" alt="" />
                    <span className="text-2xl font-semibold leading-6 font-serif pt-[0.1rem]">
                        Article+
                    </span>
                </>
            </Link>
        </div>
    )
}

export default Navbar
