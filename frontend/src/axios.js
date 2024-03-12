import axios from "axios"
import { getCookie, setCookie } from "./helpers/cookies"

const accessToken = getCookie("accessToken")
const refreshToken = getCookie("refreshToken")

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { Authorization: `Bearer ${accessToken}` },
})

export default instance
