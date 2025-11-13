import { AuthenticationResponse, LoginRequest, RegisterRequest } from "@/src/types/types";
import axiosInstance from "../axiosInstance";
import { API_URLS } from "@/src/util/apiConstants";

export const authService = {

  // Google OAuth Authentication
  googleLogin: async (googleToken: string): Promise<AuthenticationResponse> => {
    const response = await axiosInstance.post<AuthenticationResponse>(API_URLS.auth.googleLogin, { googleToken });
    return response.data;
  },

  login: async (loginRequest: LoginRequest): Promise<string> => {
    const response = await axiosInstance.post<string>(API_URLS.auth.login, loginRequest);
    return response.data;
  },

  register: async (registerRequest: RegisterRequest): Promise<string> => {
    const response = await axiosInstance.post<string>(API_URLS.auth.register, registerRequest);
    return response.data;
  }
}; 