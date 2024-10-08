import { Navigate, Outlet, Route, Routes } from "react-router-dom"

import Article from "@/pages/Article"
import AuthGoogle from "@/pages/AuthGoogle"
import AuthorFromCreator from "@/pages/AuthorFromCreator"
import Creator from "@/pages/Creator"
import Explore from "@/pages/Explore"
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
                <Route
                    index
                    element={
                        <>
                            <Hero />
                            <Explore isLoggedIn={false} />
                        </>
                    }
                />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth/google" element={<AuthGoogle />} />
                <Route path="article/:slug" element={<Article />} />
                <Route path="creator/:id" element={<Creator />} />
                <Route path="creator/:id/:author" element={<AuthorFromCreator />} />
                <Route path="*" element={<Navigate to="/" replace={true} />} />
            </Route>
        </Routes>
    )
}

export default GuestRoutes
