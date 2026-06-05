import { IAuthResponse, ISignUPDTO,ILoginDTO, IForgotPasswordDTO, IOTPDTO } from "../../types/auth-types";
import { customError } from "../../utils/custom-error";
import { authRepository } from "./auth-repositories";
import { ERROR_MESSAGE } from "../../constants/error-message"
import { STATUS_CODE } from "../../constants/status-codes";
import bcrypt from "bcrypt";
import { sendWelcomeEmail } from "../../email/sendWelcomeEmail";
import { generateToken } from "../../utils/generateToken";
import { ENV } from "../../config/env";
import {mapUser} from "../../utils/mapUser";
import { sendOTPEmail } from './../../email/sendOTPEmail';


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

    async login(userData:ILoginDTO):Promise<IAuthResponse>{
        const {email,password}= userData;

        const existingUser = await authRepository.findUserByEmail(email);

        if(!existingUser){
            throw new customError(
                ERROR_MESSAGE.INVALID_CREDENTIALS,
                STATUS_CODE.UNAUTHORIZED
            )
        }

        const isPasswordValid= await bcrypt.compare(password,existingUser.password);

        if(!isPasswordValid){
            throw new customError(
                ERROR_MESSAGE.INVALID_CREDENTIALS,
                STATUS_CODE.UNAUTHORIZED
            )
        }

        const accessToken= generateToken(
            existingUser._id.toString(),
            ENV.ACCESS_TOKEN_SECRET_KEY,
            "15m"
        );

        return {
            user: mapUser(existingUser),
            accessToken
        };
    },

    async logout(token:string){
        if(!token){
            throw new customError(
                ERROR_MESSAGE.INVALID_TOKEN,
                STATUS_CODE.BAD_REQUEST
            )
        }

        await authRepository.deleteRefreshToken(token);
    },

    async forgotPassword(data:IForgotPasswordDTO):Promise<void>{
        const {email} = data;

        const user = await authRepository.findUserByEmail(email);

        if(!user){
            throw new customError(ERROR_MESSAGE.USER_NOT_FOUND,STATUS_CODE.NOT_FOUND)
        }

        const otp = await authRepository.generateOTP(user._id.toString())

        await sendOTPEmail(email,otp).catch((error)=>{
            console.log("Error sending OTP email:",error);
        })
    },

    async verifyOtp(opt:IOTPDTO){

        // TODO 
        const user = await authRepository.findUserByOtp(opt.otp)

        if (!user || !user.otp) {
            throw new customError(
                ERROR_MESSAGE.INVALID_OR_EXPIRED_OTP,
                STATUS_CODE.BAD_REQUEST,
            );
        }

        const isValidOtp = await bcrypt.compare(opt.otp, user.otp);

        if (!isValidOtp) {
            throw new customError(
                ERROR_MESSAGE.INVALID_OR_EXPIRED_OTP,
                STATUS_CODE.BAD_REQUEST,
            );
        }

        const resetToken= generateToken(user.id,ENV.OTP_SECRET_KEY,"15m")

        return {resetToken};
    }
};