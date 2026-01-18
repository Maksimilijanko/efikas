import { AuthenticationResponse, LoginRequest, OtpSendRequest, OtpVerifyRequest, RegisterRequest, ResetPasswordRequest } from "@/src/types/types";
import { API_URLS } from "@/src/util/apiConstants";
import { AxiosResponse } from "axios";
import axiosInstance from "../axiosInstance";

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

  requestOtp: async (sendOtpRequest: OtpSendRequest): Promise<AxiosResponse> => {
	const response = await axiosInstance.post<void>(API_URLS.auth.requestOtp, sendOtpRequest);
	return response;
  },

  verifyOtp: async (verifyOtpRequest: OtpVerifyRequest): Promise<AxiosResponse> => {
	const response = await axiosInstance.post<void>(API_URLS.auth.verifyOtp, verifyOtpRequest);
	return response;
  },

  resetPassword: async (request: ResetPasswordRequest): Promise<AxiosResponse> => {
	const response = await axiosInstance.put<void>(API_URLS.profile.resetPassword, request);
	return response;
  }
}; 