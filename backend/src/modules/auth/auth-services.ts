import {
    IAuthResponse,
    ISignUPDTO,
    ILoginDTO,
    IForgotPasswordDTO,
    IOTPDTO,
    IResetPasswordDTO,
    IUpdateProfileDTO,
    IUser
} from "../../types/auth-types";
import { customError } from "../../utils/custom-error";
import { authRepository } from "./auth-repositories";
import { ERROR_MESSAGE } from "../../constants/error-message"
import { STATUS_CODE } from "../../constants/status-codes";
import bcrypt from "bcrypt";
import { sendWelcomeEmail } from "../../email/sendWelcomeEmail";
import { generateToken } from "../../utils/generateToken";
import { ENV } from "../../config/env";
import { mapUser } from "../../utils/mapUser";
import { sendOTPEmail } from './../../email/sendOTPEmail';
import redis from "../../config/redis";
import jwt from 'jsonwebtoken';


export const authServices = {
    async signUp(userData: ISignUPDTO): Promise<IAuthResponse> {
        const { fullName, email, password } = userData;

        const existingUser = await authRepository.findUserByEmail(email);

        if (existingUser) {
            throw new customError(
                ERROR_MESSAGE.USER_ALREADY_EXIST,
                STATUS_CODE.CONFLICT
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = await authRepository.createUser({
            fullName,
            email,
            password: hashedPassword,
        });

        const accessToken = generateToken(
            newUser.id.toString(),
            ENV.ACCESS_TOKEN_SECRET_KEY,
            "15m"
        )


        sendWelcomeEmail(email, fullName).catch((error) => {
            console.error("Error sending welcome email:", error);
        });

        return {
            user: newUser,
            accessToken
        }
    },

    async login(userData: ILoginDTO): Promise<IAuthResponse> {
        const { email, password } = userData;

        const existingUser = await authRepository.findUserByEmail(email);

        if (!existingUser) {
            throw new customError(
                ERROR_MESSAGE.INVALID_CREDENTIALS,
                STATUS_CODE.UNAUTHORIZED
            )
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            throw new customError(
                ERROR_MESSAGE.INVALID_CREDENTIALS,
                STATUS_CODE.UNAUTHORIZED
            )
        }

        const accessToken = generateToken(
            existingUser._id.toString(),
            ENV.ACCESS_TOKEN_SECRET_KEY,
            "15m"
        );

        return {
            user: mapUser(existingUser),
            accessToken
        };
    },

    async logout(token: string) {
        if (!token) {
            throw new customError(
                ERROR_MESSAGE.INVALID_TOKEN,
                STATUS_CODE.BAD_REQUEST
            )
        }

        await authRepository.deleteRefreshToken(token);
    },

    async forgotPassword(data: IForgotPasswordDTO): Promise<{ userId: string }> {
        const { email } = data;



        const user = await authRepository.findUserByEmail(email);

        if (!user) {
            return { userId: "" };
        }

        const otp = await authRepository.generateOTP(user._id.toString())

        await sendOTPEmail(email, otp).catch((error) => {
            console.log("Error sending OTP email:", error);
        })

        return { userId: user._id.toString() };
    },

    async verifyOtp(data: IOTPDTO) {

        const { userId, otp } = data;

        const storedHash = await authRepository.getOtpHash(userId);

        if (!storedHash) {
            throw new customError(
                ERROR_MESSAGE.INVALID_OR_EXPIRED_OTP,
                STATUS_CODE.BAD_REQUEST
            );
        }

        const isValidOtp = await bcrypt.compare(otp, storedHash);

        if (!isValidOtp) {
            throw new customError(
                ERROR_MESSAGE.INVALID_OR_EXPIRED_OTP,
                STATUS_CODE.BAD_REQUEST,
            );
        }

        await authRepository.deleteOtp(userId);


        const resetToken = generateToken(userId, ENV.RESET_TOKEN_SECRET_KEY, "15m")

        return { resetToken };
    },

    async resetPassword(data: IResetPasswordDTO) {

        const { resetToken, password, confirmPassword } = data

        if (password !== confirmPassword) {
            throw new customError(ERROR_MESSAGE.CONFIRM_PASS_NOT_MATCH, STATUS_CODE.BAD_REQUEST)
        }

        const alreadyUsedToken = await redis.get(`used_reset_token:${resetToken}`)

        if (alreadyUsedToken) {
            throw new customError(ERROR_MESSAGE.INVALID_OR_EXPIRED_OTP, STATUS_CODE.UNAUTHORIZED);
        }

        let decode: { userId: string };

        try {
            decode = jwt.verify(resetToken, ENV.RESET_TOKEN_SECRET_KEY) as { userId: string };

        } catch (error) {
            throw new customError(ERROR_MESSAGE.INVALID_OR_EXPIRED_OTP, STATUS_CODE.UNAUTHORIZED)
        }

        const user = await authRepository.findUserById(decode.userId);
        if (!user) {
            throw new customError(ERROR_MESSAGE.USERID_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await authRepository.resetPassword(user.id.toString(), hashedPassword);
        await redis.set(`used_reset_token:${resetToken}`, "used", "EX", 900)
    },

    async updateProfile(userId: string, data: IUpdateProfileDTO) {
        const updatedProfile = await authRepository.updateProfile(userId, data);

        if (!updatedProfile) {
            throw new customError(ERROR_MESSAGE.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }

        return { user: mapUser(updatedProfile) };
    }

};