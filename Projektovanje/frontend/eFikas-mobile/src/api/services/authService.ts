import { AuthenticationResponse, LoginRequest, RegisterRequest } from "@/src/types/types";
import axiosInstance from "../axiosInstance";
import { API_URLS } from "@/src/util/apiConstants";
import { AxiosResponse } from "axios";
import { register } from "module";

export const authService = {

  // Google OAuth Authentication
  googleLogin: async (googleToken: string): Promise<AxiosResponse> => {
    const response = await axiosInstance.post<AuthenticationResponse>(API_URLS.auth.googleLogin, { googleToken });
    return response;
  },

  login: async (loginRequest: LoginRequest): Promise<AxiosResponse> => {
    const response = await axiosInstance.post<string>(API_URLS.auth.login, loginRequest);
    return response;
  },

  register: async (registerRequest: RegisterRequest): Promise<AxiosResponse> => {
    console.log("REG REQ: ", registerRequest);

    const response = await axiosInstance.post<string>(API_URLS.auth.register, registerRequest);
    return response;
  },
}; 