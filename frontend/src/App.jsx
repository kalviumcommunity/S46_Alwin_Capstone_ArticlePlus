import { useSignalEffect, useSignals } from "@preact/signals-react/runtime"

import { isUserCreator } from "@/signals/creator"
import { userDetails, userDetailsUpdate, userExists } from "@/signals/user"
import axiosInstance from "@/axios"

import Footer from "@/components/Footer"

import GuestRoutes from "@/routes/GuestRoutes"
import UserRoutes from "@/routes/UserRoutes"

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
        <div className="flex min-h-screen w-[100vw] flex-col sm:w-[calc(100vw-1rem)] 2xl:max-w-[1920px]">
            {userExists.value ? <UserRoutes /> : <GuestRoutes />}
            <Footer />
        </div>
    )
}

export default App
