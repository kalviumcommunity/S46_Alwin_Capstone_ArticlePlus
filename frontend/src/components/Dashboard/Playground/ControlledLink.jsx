import React from "react"
import { Link, useNavigate } from "react-router-dom"

function ControlledLink({ to, reference, children, className }) {
    const navigate = useNavigate()

    const handleClick = (event) => {
        event.preventDefault()
        const confirmed = window.confirm(
            "Are you sure you want to leave this page? This article won't be saved.",
        )
        if (confirmed) navigate(to)
    }

    return (
        <Link ref={reference} to={to} onClick={handleClick} className={className}>
            {children}
        </Link>
    )
}

export default ControlledLink
