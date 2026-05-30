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