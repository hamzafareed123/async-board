import { User } from "../../models/auth-model";
import { IOTPDTO, ISignUPDTO } from "../../types/auth-types";
import RefreshToken from '../../models/refreshToken-model';
import crypto from "crypto";
import bcrypt from "bcrypt";
import { IUser } from './../../types/auth-types';


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
        return await User.findOne({ email });
    },

    async findUserById(id:string){
        return await User.findById(id).select("-password");
    },

    async deleteRefreshToken(token: string) {
        await RefreshToken.deleteOne({ token });
    },

    async generateOTP(userId: string): Promise<string> {
        const otp = crypto.randomInt(100000, 999999).toString();
        const hashOtp = await bcrypt.hash(otp, 10);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

        await User.findByIdAndUpdate(userId, { otp: hashOtp, otpExpiry }, { new: true });
        return otp;
    },

    async findUserByOtp(otp: string) {

        // TODO 
        return await User.findOne({
            otpExpiry: { $gt: new Date() },
        });
    }
}