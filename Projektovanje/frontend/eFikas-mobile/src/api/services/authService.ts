import { AuthenticationResponse, LoginRequest } from "@/src/types/types";
import axiosInstance from "../axiosInstance";
import { API_AUTH_GOOGLE_LOGIN_URL } from "@/src/util/apiConstants";

export const authService = {

  // Google OAuth Authentication
  googleLogin: async (googleToken: string): Promise<AuthenticationResponse> => {
    const response = await axiosInstance.post<AuthenticationResponse>(API_AUTH_GOOGLE_LOGIN_URL, { googleToken });
    return response.data;
  },

  login: async (loginRequest: LoginRequest): Promise<string> => {
    const response = await axiosInstance.post<string>(API_AUTH_GOOGLE_LOGIN_URL, loginRequest);
    return response.data;
  },
}; 