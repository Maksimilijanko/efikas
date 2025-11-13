import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "../util/apiConstants";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// --- TODO: uncomment when backend gets implemented --- 
// // Axios request interceptor - for JWT in Authorization header
// axiosInstance.interceptors.request.use(
//     (config) => {
//         const token = tokenService.getAccessToken();
//         if (token && config.headers) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }

//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// // Axios response interceptor - for redirection in case of 401 e.g.
// axiosInstance.interceptors.response.use(
//     (response) => response,
//     async (error: AxiosError) => {
//         if (error.response?.status === 401 && !error.config?._retry) {
//             // Prevent infinite loop
//             (error.config as any)._retry = true;

//             try {
//                 // Attempt to refresh access token
//                 const res = await axios.get(
//                     API_AUTH_REFRESH_URL,
//                     {},
//                 );
//                 console.log(res);
//                 const newToken = res.data.accessToken;
//                 tokenService.setAccessToken(newToken);

//                 // Retry the original request with new token
//                 if (error.config?.headers) {
//                     error.config.headers.Authorization = `Bearer ${newToken}`;
//                 }

//                 return axiosInstance(error.config!);
//             } catch (refreshError) {
//                 // Refresh token expired or invalid -> force logout
//                 tokenService.setAccessToken("");
//                 // Optionally redirect to login page here
//                 return Promise.reject(refreshError);
//             }
//         }

//         return Promise.reject(error);
//     }
// );

export default axiosInstance;