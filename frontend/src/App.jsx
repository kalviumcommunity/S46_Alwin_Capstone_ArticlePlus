import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import Hero from "./components/Hero"
import Navbar from "./components/Navbar"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Footer from "./components/Footer"
import "./App.css"
import Read from "./components/Read"
function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Root />,
            children: [
                {
                    index: true,
                    element: <Hero />,
                },
                {
                    path: "/login",
                    element: <Login />,
                },
                {
                    path: "/signup",
                    element: <Signup />,
                },
                {
                    path: "/read",
                    element: <Read />,
                },
            ],
        },
    ])

    function Root() {
        return (
            <>
                <Navbar />
                <Outlet />
                <Footer />
            </>
        )
    }

    return <RouterProvider router={router} />
}

export default App
