import React from "react"
import { Navigate, Outlet, Route, Routes } from "react-router-dom"

import AuthGoogle from "@/pages/AuthGoogle"
import Login from "@/pages/Login"
import Signup from "@/pages/Signup"
import Hero from "@/components/Hero"
import Navbar from "@/components/Navbar"

const GuestLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}

function GuestRoutes() {
    return (
        <Routes>
            <Route path="/" element={<GuestLayout />}>
                <Route index element={<Hero />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth/google" element={<AuthGoogle />} />
                <Route path="*" element={<Navigate to="/" replace={true} />} />
            </Route>
        </Routes>
    )
}

export default GuestRoutes
