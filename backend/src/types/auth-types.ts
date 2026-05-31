export interface IUser {
    fullName: string;
    email: string;
    password: string;
    profilePic?: string;
    otp?: string;
    otpExpiry?: Date;
    provider?: string;
    googleId?: string;
}

export interface ISignUPDTO{
    fullName:string;
    email:string;
    password:string;
}

export interface ILoginDTO{
    email:string;
    password:string;
}

export interface IAuthResponse{
    user:IUser;
    accessToken:string;
}