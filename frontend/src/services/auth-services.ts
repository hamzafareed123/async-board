import { apiClient } from "../config/axios";
import type { IAuthResponse, IForgotPasswordDTO, ILoginDTO, IRegisterDTO, IResetPasswordDTO, IUpdateProfileDTO, IVerifyOtpDTO } from "../types/auth-types";

export const authServices = {
    signup: async (credential: IRegisterDTO): Promise<IAuthResponse> => {
        const response = await apiClient.post("/api/auth/signup", credential)
        return response.data.data;
    },
    login: async (credential: ILoginDTO): Promise<IAuthResponse> => {
        const response = await apiClient.post("/api/auth/login", credential)
        return response.data.data;
    },

    logout: async () => {
        const response = await apiClient.post("/api/auth/logout")
        return response.data
    },

    forgotPassword: async (credential: IForgotPasswordDTO) => {
        const response = await apiClient.post("/api/auth/forgot-password", credential)
        return response.data;
    },

    verifyOTP: async (credential: IVerifyOtpDTO) => {
        const response = await apiClient.post("/api/auth/verify-otp", credential)
        return response.data
    },

    resetPassword: async (credential: IResetPasswordDTO) => {
        const response = await apiClient.post("/api/auth/reset-password", credential)
        return response.data
    },

    authUser: async () => {
        const response = await apiClient.get("/api/auth/auth-user")
        console.log("data",response.data)
        return response.data
    },

    updateProfile: async (data: IUpdateProfileDTO) => {
        const formData = new FormData();
        if (data.fullName) formData.append("fullName", data.fullName);
        if (data.cursorColor) formData.append("cursorColor", data.cursorColor);
        if (data.avatar) formData.append("avatar", data.avatar);

        const response = await apiClient.patch("/api/auth/update-profile", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data.data;
    }

}