import { effect, signal } from "@preact/signals-react"
import { getCookie } from "@/helpers/cookies"

const isUserLoggedIn = () => {
    const accessToken = getCookie("accessToken")
    const refreshToken = getCookie("refreshToken")

    if (accessToken === null && refreshToken === null) return false
    if (accessToken === "null" && refreshToken === "null") return false

    return true
}

export const userExists = signal(isUserLoggedIn())
export const userDetails = signal({})

effect(() => {
    userExists.value = isUserLoggedIn()

    if (!userExists.value) {
        userDetails.value = {}
    }
})
