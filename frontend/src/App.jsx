import { Routes, Route, Outlet, Navigate } from "react-router-dom"
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime"
import { userExists, userDetails, userDetailsUpdate } from "@/signals/user"
import Hero from "@/components/Hero"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Login from "@/components/Login"
import Signup from "@/components/Signup"
import Read from "@/components/Read"
import AuthGoogle from "@/components/AuthGoogle"
import Account from "@/components/Account"
import axiosInstance from "@/axios"
import "./App.css"

function Layout() {
    useSignals()

    useSignalEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const res = await axiosInstance.get("auth")
                userDetails.value = res.data
            } catch (error) {
                console.error("Error fetching user details:", error)
            }
        }

        if (userExists.value) {
            fetchUserDetails()
        }

        if (userDetailsUpdate.value > 0) {
            const unsubscribe = userDetailsUpdate.subscribe(fetchUserDetails)
            return unsubscribe
        }
    }, [])

    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    )
}

function App() {
    useSignals()

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {userExists.value === true ? (
                    <>
                        <Route index element={<Read />} />
                        <Route path="/account" element={<Account />} />
                        <Route
                            path="read"
                            element={<Navigate to="/" replace={true} />}
                        />
                        <Route
                            path="login"
                            element={<Navigate to="/read" replace={true} />}
                        />
                        <Route
                            path="signup"
                            element={<Navigate to="/read" replace={true} />}
                        />
                        <Route
                            path="auth/google"
                            element={<Navigate to="/" replace={true} />}
                        />
                    </>
                ) : (
                    <>
                        <Route index element={<Hero />} />
                        <Route path="signup" element={<Signup />} />
                        <Route path="login" element={<Login />} />
                        <Route path="auth/google" element={<AuthGoogle />} />
                        <Route
                            path="read"
                            element={<Navigate to="/login" replace={true} />}
                        />
                        <Route
                            path="*"
                            element={<Navigate to="/" replace={true} />}
                        />
                    </>
                )}
            </Route>
        </Routes>
    )
}

export default App
