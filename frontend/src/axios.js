import axios from "axios"

import { getCookie, setCookie } from "./helpers/cookies"
import { userExists } from "./signals/user"

let accessToken = getCookie("accessToken")

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

const forceLogoutUser = () => {
    userExists.value = false
    setCookie("accessToken", null)
    setCookie("refreshToken", null)
    setCookie("refreshTokenId", null)
}

instance.interceptors.request.use(
    (config) => {
        accessToken = getCookie("accessToken")
        config.withCredentials = true
        config.headers.Authorization = `Bearer ${accessToken}`
        return config
    },
    (error) => Promise.reject(error),
)

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const response = await instance.post("/auth/refresh")

                const newAccessToken = response.data.accessToken

                userExists.value = true

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

                return axios(originalRequest)
            } catch (error) {
                forceLogoutUser()
                return Promise.reject(error)
            }
        } else if (error.response.status === 403) {
            forceLogoutUser()
            alert("Your session has expired. Please login again.")
        }

        return Promise.reject(error)
    },
)

export default instance
