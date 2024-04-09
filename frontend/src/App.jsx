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
import DashboardLayout from "@/pages/Dashboard/Layout"
import Login from "@/pages/Login"
import OnboardingCreator from "@/pages/OnboardingCreator"
import Organization from "@/pages/Organization"
import Read from "@/pages/Read"
import Signup from "@/pages/Signup"
import Footer from "@/components/Footer"
import Hero from "@/components/Hero"
import Navbar from "@/components/Navbar"
import SuspenseLoader from "@/components/ui/SuspenseLoader"

const DashboardHome = React.lazy(() => import("@/pages/Dashboard/Home"))
const DashboardArticles = React.lazy(() => import("@/pages/Dashboard/Articles"))
const DashboardAnalytics = React.lazy(() => import("@/pages/Dashboard/Analytics"))
const DashboardSettings = React.lazy(() => import("@/pages/Dashboard/Settings"))

const SuspenseHandler = ({ component }) => {
    return <React.Suspense fallback={<SuspenseLoader />}>{component}</React.Suspense>
}

function Layout() {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    )
}

const fetchUserDetails = async () => {
    try {
        const response = await axiosInstance.get("auth")
        userDetails.value = response.data
        isUserCreator.value = response.data.creator
    } catch (error) {
        console.error(error)
    }
}

function App() {
    useSignals()

    useSignalEffect(() => {
        if (userExists.value) {
            fetchUserDetails()
        }

        if (userDetailsUpdate.value > 0) {
            const unsubscribe = userDetailsUpdate.subscribe(fetchUserDetails)
            return unsubscribe
        }
    })

    return (
        <div className="w-[100vw] sm:w-[calc(100vw-1rem)] 2xl:max-w-screen-2xl">
            <Routes>
                <Route path="/" element={<Layout />}>
                    {userExists.value ? (
                        <>
                            <Route index element={<Read />} />
                            <Route path="/account" element={<Account />} />
                            <Route path="/account/subscriptions" element={<Account />} />
                            <Route path="/article/:slug" element={<Article />} />
                            <Route path="/creator/:creator" element={<Creator />} />
                            <Route
                                path="/organization/:id/:contributor"
                                element={<Creator />}
                            />
                            <Route path="/organization/:id" element={<Organization />} />
                            {isUserCreator.value ? (
                                <>
                                    <Route path="/dashboard" element={<DashboardLayout />}>
                                        <Route
                                            index
                                            element={
                                                <SuspenseHandler
                                                    component={<DashboardHome />}
                                                />
                                            }
                                        />
                                        <Route
                                            path="articles"
                                            element={
                                                <SuspenseHandler
                                                    component={<DashboardArticles />}
                                                />
                                            }
                                        />
                                        <Route
                                            path="analytics"
                                            element={
                                                <SuspenseHandler
                                                    component={<DashboardAnalytics />}
                                                />
                                            }
                                        />
                                        <Route
                                            path="settings"
                                            element={
                                                <SuspenseHandler
                                                    component={<DashboardSettings />}
                                                />
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
                                    <Route path="/dashboard" element={<Navigate to="/" />} />
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <Route index element={<Hero />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/auth/google" element={<AuthGoogle />} />
                        </>
                    )}
                </Route>
            </Routes>
        </div>
    )
}

export default App
