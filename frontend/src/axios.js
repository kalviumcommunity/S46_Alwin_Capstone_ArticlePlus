import axios from "axios"
import { getCookie, setCookie } from "./helpers/cookies"
import { userExists } from "./signals/user"

let accessToken = getCookie("accessToken")
let refreshToken = getCookie("refreshToken")

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

const forceLogoutUser = () => {
    userExists.value = false
    setCookie("accessToken", null)
    setCookie("refreshToken", null)
}

instance.interceptors.request.use(
    (config) => {
        accessToken = getCookie("accessToken")
        refreshToken = getCookie("refreshToken")
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
                const response = await instance.post("/auth/refresh", {
                    refreshToken,
                })

                const newAccessToken = response.data.accessToken
                setCookie("accessToken", newAccessToken)

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
