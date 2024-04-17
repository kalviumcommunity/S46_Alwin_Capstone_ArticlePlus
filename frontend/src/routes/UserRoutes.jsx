import React from "react"
import { Navigate, Outlet, Route, Routes } from "react-router-dom"
import { useSignals } from "@preact/signals-react/runtime"

import { isUserCreator } from "@/signals/creator"

import Account from "@/pages/Account"
import Article from "@/pages/Article"
import Creator from "@/pages/Creator"
import DashboardLayout from "@/pages/Dashboard/Layout"
import NewArticle from "@/pages/Dashboard/NewArticle"
import OnboardingCreator from "@/pages/OnboardingCreator"
import Organization from "@/pages/Organization"
import Read from "@/pages/Read"
import Navbar from "@/components/Navbar"
import SuspenseLoader from "@/components/ui/SuspenseLoader"

const DashboardHome = React.lazy(() => import("@/pages/Dashboard/Home"))
const DashboardArticles = React.lazy(() => import("@/pages/Dashboard/Articles"))
const DashboardAnalytics = React.lazy(() => import("@/pages/Dashboard/Analytics"))
const DashboardSettings = React.lazy(() => import("@/pages/Dashboard/Settings"))

const SuspenseHandler = ({ component }) => {
    return <React.Suspense fallback={<SuspenseLoader />}>{component}</React.Suspense>
}

const UserLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}

function UserRoutes() {
    useSignals()

    return (
        <Routes>
            <Route path="/" element={<UserLayout />}>
                <Route index element={<Read isLoggedin={true} />} />
                <Route path="account" element={<Account />} />
                <Route path="account/subscriptions" element={<Account />} />
                <Route path="article/:slug" element={<Article />} />
                <Route path="creator/:creator" element={<Creator />} />
                <Route path="organization/:id/:contributor" element={<Creator />} />
                <Route path="organization/:id" element={<Organization />} />
                {isUserCreator.value === false && (
                    <>
                        <Route path="/onboarding" element={<OnboardingCreator />} />
                        <Route path="/dashboard" element={<Navigate to="/onboarding" />} />
                    </>
                )}
            </Route>

            {isUserCreator.value === true && (
                <>
                    <Route path="/dashboard" element={<DashboardLayout />}>
                        <Route
                            index
                            element={<SuspenseHandler component={<DashboardHome />} />}
                        />
                        <Route
                            path="articles"
                            element={<SuspenseHandler component={<DashboardArticles />} />}
                        />
                        <Route
                            path="analytics"
                            element={<SuspenseHandler component={<DashboardAnalytics />} />}
                        />
                        <Route
                            path="settings"
                            element={<SuspenseHandler component={<DashboardSettings />} />}
                        />
                        <Route
                            path="new-article"
                            element={<SuspenseHandler component={<NewArticle />} />}
                        />
                    </Route>
                    <Route path="/onboarding" element={<Navigate to="/dashboard" />} />
                </>
            )}

            {isUserCreator.value !== "loading" && (
                <Route path="*" element={<Navigate to="/" replace={true} />} />
            )}
        </Routes>
    )
}

export default UserRoutes
