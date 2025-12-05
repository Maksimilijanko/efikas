import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "../util/apiConstants";
import { secureStoreService } from "../services/secureStoreService";
import { SECURE_STORE_KEYS } from "../util/secureStoreKeys";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// --- REQUEST INTERCEPTOR ---
axiosInstance.interceptors.request.use(
    async (config) => {
        const authResponseString = await secureStoreService.getItemAsync(
            SECURE_STORE_KEYS.authenticationResponseKey
        );
        // console.log("Raw auth string:", authResponseString);
        let token: string | null = null;

        if (authResponseString) {
            const authResponse = JSON.parse(authResponseString);
            token = authResponse.token;
        }

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);



// --- RESPONSE INTERCEPTOR ---
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            console.warn("Unauthorized (401) — token možda ne postoji ili je istekao.");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
