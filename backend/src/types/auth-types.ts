import moongoose from "mongoose";

export interface IUser {
    id: moongoose.Types.ObjectId;
    fullName: string;
    email: string;
    profilePic?: string;
    cursorColor?: string;
    provider?: string;
    googleId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISignUPDTO {
    fullName: string;
    email: string;
    password: string;
}

export interface ILoginDTO {
    email: string;
    password: string;
}

export interface IAuthResponse {
    user: IUser;
    accessToken: string;
}

export interface IRefreshToken {
    userId: moongoose.Types.ObjectId;
    token: string;
    createdAt: Date;
}

export interface IForgotPasswordDTO {
    email: string;
}

export interface IOTPDTO {
    userId: string;
    otp: string;
}

export interface IResetPasswordDTO {
    resetToken: string;
    password: string;
    confirmPassword: string;
}

export interface IUpdateProfileDTO {
    fullName?: string;
    avatarUrl?: string;
    cursorColor?: string;
}