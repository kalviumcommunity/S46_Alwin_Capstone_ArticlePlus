import { Routes, Route, Outlet, Navigate } from "react-router-dom"
import { useSignals } from "@preact/signals-react/runtime"
import Hero from "@/components/Hero"
import Navbar from "@/components/Navbar"
import Login from "@/components/Login"
import Signup from "@/components/Signup"
import Footer from "@/components/Footer"
import Read from "@/components/Read"
import { userExists } from "@/signals/user"
import "./App.css"

function Layout() {
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
                <Route index element={<Hero />} />
                {userExists.value === true ? (
                    <>
                        <Route
                            path="login"
                            element={<Navigate to="/read" replace={true} />}
                        />
                        <Route
                            path="signup"
                            element={<Navigate to="/read" replace={true} />}
                        />
                        <Route path="read" element={<Read />} />
                    </>
                ) : (
                    <>
                        <Route path="signup" element={<Signup />} />
                        <Route path="login" element={<Login />} />
                        <Route
                            path="read"
                            element={<Navigate to="/login" replace={true} />}
                        />
                    </>
                )}
            </Route>
        </Routes>
    )
}

export default App
