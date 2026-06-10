import { User } from "../../models/auth-model";
import { IOTPDTO, ISignUPDTO } from "../../types/auth-types";
import RefreshToken from '../../models/refreshToken-model';
import crypto from "crypto";
import bcrypt from "bcrypt";
import { IUser } from './../../types/auth-types';
import redis from "../../config/redis";


export const authRepository = {
    async createUser(userData: ISignUPDTO) {
        const user = await User.create(userData);
        return {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    },

    async findUserByEmail(email: string) {
        return await User.findOne({ email }).select("-password");
    },

    async findUserById(id: string) {
        return await User.findById(id).select("-password");
    },

    async deleteRefreshToken(token: string) {
        await RefreshToken.deleteOne({ token });
    },

    async generateOTP(userId: string): Promise<string> {
        const otp = crypto.randomInt(100000, 999999).toString();
        const hashOtp = await bcrypt.hash(otp, 10);

        await redis.set(`otp:${userId}`, hashOtp, "EX", 600);
        return otp;
    },

    async getOtpHash(userId: string): Promise<string | null> {
        return await redis.get(`otp:${userId}`);
    },

    async deleteOtp(userId: string): Promise<void> {
        await redis.del(`otp:${userId}`)
    },

    async resetPassword(userId:string,hashedPassword:string):Promise<void>{
        await User.findByIdAndUpdate(userId,{
            password:hashedPassword
        })
    }
}