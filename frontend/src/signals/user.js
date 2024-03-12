import { signal } from "@preact/signals-react"
import { getCookie } from "../helpers/cookies"

const isUserLoggedIn = () => {
    const accessToken = getCookie("accessToken")
    const refreshToken = getCookie("refreshToken")

    return accessToken !== "null" && refreshToken !== "null"
}

export const userExists = signal(isUserLoggedIn())
