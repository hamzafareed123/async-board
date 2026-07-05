export interface IUser {
    id: string;
    fullName: string;
    email: string;
    profilePic?: string;
    cursorColor?: string;
    provider?: string;
    googleId?: string;
    createdAt: Date;
    updatedAt: Date;
}


export interface ILoginDTO {
    email: string;
    password: string
}


export interface IRegisterDTO {
    fullName: string;
    email: string;
    password: string;

}


export interface IAuthResponse {
    user: IUser;
    accessToken: string;
}


export interface IForgotPasswordDTO {
    email: string;
}

export interface IVerifyOtpDTO {
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
    cursorColor?: string;
}