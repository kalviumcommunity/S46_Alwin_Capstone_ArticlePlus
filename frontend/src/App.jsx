import React from "react"
import { Navigate, Outlet, Route, Routes } from "react-router-dom"
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime"

import { isUserCreator } from "@/signals/creator"
import { userDetails, userDetailsUpdate, userExists } from "@/signals/user"
import axiosInstance from "@/axios"

import Account from "@/pages/Account"
import Article from "@/pages/Article"
import AuthGoogle from "@/pages/AuthGoogle"
import Creator from "@/pages/Creator"
import Login from "@/pages/Login"
import OnboardingCreator from "@/pages/OnboardingCreator"
import Organization from "@/pages/Organization"
import Read from "@/pages/Read"
import Signup from "@/pages/Signup"
import Footer from "@/components/Footer"
import Hero from "@/components/Hero"
import Navbar from "@/components/Navbar"
import SuspenseLoader from "@/components/SuspenseLoader"

import DashboardLayout from "@/DashboardLayout"

import "./App.css"

const DashboardHome = React.lazy(() => import("@/pages/DashboardHome"))

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
                        <Route path="/account/subscriptions" element={<Account />} />
                        <Route path="/:slug" element={<Article />} />
                        <Route path="/creator/:creator" element={<Creator />} />
                        <Route path="/organization/:id/:contributor" element={<Creator />} />
                        <Route path="/organization/:id" element={<Organization />} />
                        {isUserCreator.value ? (
                            <>
                                <Route path="/dashboard" element={<DashboardLayout />}>
                                    <Route
                                        index
                                        element={
                                            <React.Suspense fallback={<SuspenseLoader />}>
                                                <DashboardHome />
                                            </React.Suspense>
                                        }
                                    />
                                </Route>
                                <Route
                                    path="/onboarding"
                                    element={<Navigate to="/dashboard" replace={true} />}
                                />
                            </>
                        ) : (
                            <>
                                <Route path="/onboarding" element={<OnboardingCreator />} />
                                <Route
                                    path="/dashboard"
                                    element={<Navigate to="/onboarding" replace={true} />}
                                />
                            </>
                        )}
                        <Route path="/read" element={<Navigate to="/" replace={true} />} />
                        <Route path="/login" element={<Navigate to="/read" replace={true} />} />
                        <Route
                            path="/signup"
                            element={<Navigate to="/read" replace={true} />}
                        />
                        <Route
                            path="auth/google"
                            element={<Navigate to="/" replace={true} />}
                        />
                        <Route path="*" element={<Navigate to="/" replace={true} />} />
                    </>
                ) : (
                    <>
                        <Route index element={<Hero />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/auth/google" element={<AuthGoogle />} />
                        <Route path="/read" element={<Navigate to="/login" replace={true} />} />
                        <Route path="*" element={<Navigate to="/" replace={true} />} />
                    </>
                )}
            </Route>
        </Routes>
    )
}

export default App
