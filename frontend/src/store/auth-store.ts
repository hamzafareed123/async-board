import { create } from "zustand";
import { authServices } from "../services/auth-services";

import type {
    ILoginDTO,
    IUser,
    IRegisterDTO,
    IForgotPasswordDTO,
    IResetPasswordDTO,
    IUpdateProfileDTO,
    IVerifyOtpDTO,
} from "../types/auth-types";

interface IAuthStore {
    authUser: IUser | null;
    accessToken: string | null;
    isCheckingAuth: boolean;
    isLoading: boolean;

    checkAuth: () => Promise<void>;
    setUser: (user: IUser) => void;
    setToken: (token: string) => void;

    login: (data: ILoginDTO) => Promise<void>;
    signup: (data: IRegisterDTO) => Promise<void>;
    logout: () => Promise<void>;

    forgotPassword: (data: IForgotPasswordDTO) => Promise<void>;
    verifyOTP: (data: IVerifyOtpDTO) => Promise<void>;
    resetPassword: (data: IResetPasswordDTO) => Promise<void>;
    updateProfile: (data: IUpdateProfileDTO) => Promise<void>;
}

export const useAuthStore = create<IAuthStore>((set) => ({
    authUser: null,
    accessToken: localStorage.getItem("accessToken"),
    isCheckingAuth: true,
    isLoading: false,

    checkAuth: async () => {
        try {
            set({ isCheckingAuth: true })
            const response = await authServices.authUser();
            set({ authUser: response.data });
        } catch {
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });

        }
    },

    setUser: (user) => set({ authUser: user }),

    setToken: (token) => {
        localStorage.setItem("accessToken", token);
        set({ accessToken: token });
    },

    login: async (data) => {
        set({ isLoading: true });

        try {
            const response = await authServices.login(data);

            localStorage.setItem("accessToken", response.accessToken);

            set({
                authUser: response.user,
                accessToken: response.accessToken,
            });
        } finally {
            set({ isLoading: false });
        }
    },

    signup: async (data) => {
        set({ isLoading: true });

        try {
            const response = await authServices.signup(data);

            localStorage.setItem("accessToken", response.accessToken);

            set({
                authUser: response.user,
                accessToken: response.accessToken,
            });
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        try {
            await authServices.logout();
        } finally {
            localStorage.removeItem("accessToken");
            set({
                authUser: null,
                accessToken: null,
            });
        }
    },

    forgotPassword: async (data) => {
        set({ isLoading: true });

        try {
            await authServices.forgotPassword(data);
        } finally {
            set({ isLoading: false });
        }
    },

    verifyOTP: async (data) => {
        set({ isLoading: true });

        try {
            await authServices.verifyOTP(data);
        } finally {
            set({ isLoading: false });
        }
    },

    resetPassword: async (data) => {
        set({ isLoading: true });

        try {
            return await authServices.resetPassword(data);
        } finally {
            set({ isLoading: false });
        }
    },

    updateProfile: async (data) => {
        set({ isLoading: true });

        try {
            const response = await authServices.updateProfile(data);

            set({
                authUser: response.user,
            });
        } finally {
            set({ isLoading: false });
        }
    },
}));