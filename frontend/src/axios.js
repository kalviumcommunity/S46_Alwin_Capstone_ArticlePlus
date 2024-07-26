import axios from "axios"

import { getCookie, setCookie } from "./helpers/cookies"
import { userExists } from "./signals/user"

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

let alertShown = false
const alertTimeout = 3000 // Time in ms to reset alertShown state

const forceLogoutUser = () => {
    userExists.value = false
    const refreshTokenId = getCookie("refreshTokenId")
    instance
        .post("session/remove", { refreshTokenId, isCurrentSession: true })
        .then((res) => {
            if (!alertShown) {
                alert("Your session has expired. Please login again.")
                alertShown = true
                setTimeout(() => {
                    alertShown = false
                }, alertTimeout)
            }
        })
        .catch((err) => console.error(err)) // Fixed typo from `console.lerr` to `console.error`
}

instance.interceptors.request.use(
    (config) => {
        const accessToken = getCookie("accessToken")
        config.withCredentials = true
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => Promise.reject(error),
)

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        // Check if the error status is 401 and the request is retryable
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true // Mark the request as retried
            try {
                const response = await instance.post("/auth/refresh", null, {
                    withCredentials: true,
                })
                const newAccessToken = response.data.accessToken
                setCookie("accessToken", newAccessToken)
                userExists.value = true
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                return instance(originalRequest) // Retry the original request with a new token
            } catch (refreshError) {
                forceLogoutUser() // Log out the user if token refresh fails
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    },
)

export default instance
