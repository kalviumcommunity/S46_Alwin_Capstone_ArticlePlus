import React from "react"
import { Navigate, Route, Routes } from "react-router-dom"

import AuthGoogle from "@/pages/AuthGoogle"
import Login from "@/pages/Login"
import Signup from "@/pages/Signup"
import Hero from "@/components/Hero"

function GuestRoutes() {
    return (
        <Routes>
            <Route index element={<Hero />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/google" element={<AuthGoogle />} />
            <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes>
    )
}

export default GuestRoutes
