import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "../util/apiConstants";
import { secureStoreService } from "../services/secureStoreService";
import { SECURE_STORE_KEYS } from "../util/secureStoreKeys";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
	// Ivan: Ovo sam zakomentarisao zbog multipart/form-data problema, forsirao ga je globalno u svim zahtjevima pa override-ovao multipart/form-data Content-Type
    // headers: {
    //     "Content-Type": "application/json",
    // },
    withCredentials: true,
});

// --- REQUEST INTERCEPTOR ---
axiosInstance.interceptors.request.use(
    async (config) => {
		console.log("=== AXIOS REQUEST ===", {
			url: config.url,
			method: config.method,
			headers: config.headers,
			hasFormData: config.data instanceof FormData,
		});

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

		// Ivan: Anđela, ovo je pravilo problem - Axios je stavljao application/json po default-u u zahtjev, a nije multipart/form-data
		if (config.data instanceof FormData) {
			config.headers['Content-Type'] = 'multipart/form-data';
		}

        return config;
    },
    (error) => Promise.reject(error)
);



// --- RESPONSE INTERCEPTOR ---
axiosInstance.interceptors.response.use(
    async (response) => {
		console.log("=== AXIOS RESPONSE ===", {
			url: response.config.url,
			status: response.status,
			data: response.data,
			headers: response.headers,
		});
		return response
	},
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            console.warn("Unauthorized (401) — token možda ne postoji ili je istekao.");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
