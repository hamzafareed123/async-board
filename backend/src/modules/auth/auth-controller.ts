import { Request, Response, NextFunction } from "express";
import { IForgotPasswordDTO, ILoginDTO, IOTPDTO, IResetPasswordDTO, ISignUPDTO, IUpdateProfileDTO } from "../../types/auth-types";
import { authServices } from "./auth-services";
import { SUCCESS_MESSAGE } from "../../constants/success-message";
import { OutputHandler } from "../../middlewares/outputHandler-middleware";
import { STATUS_CODE } from "../../constants/status-codes";
import { generateRefreshToken } from "../../utils/generateToken";
import { ENV } from "../../config/env";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";


export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body as ISignUPDTO;

        const newUser = await authServices.signUp(userData);

        const userId = newUser.user.id;
        await generateRefreshToken(String(userId), res);

        (res as any).result = {
            data: newUser,
            message: SUCCESS_MESSAGE.USER_CREATED
        };

        OutputHandler(STATUS_CODE.CREATED, req, res, next);
    } catch (error) {
        next(error);
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body as ILoginDTO;



        const authResponse = await authServices.login(userData);

        const userId = authResponse.user.id;
        await generateRefreshToken(String(userId), res);

        (res as any).result = {
            data: authResponse,
            message: SUCCESS_MESSAGE.LOGIN_SUCCESSFUL
        };

        OutputHandler(STATUS_CODE.OK, req, res, next);
    } catch (error) {
        next(error);
    }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const token = req.cookies?.refreshToken;

        await authServices.logout(token);

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: ENV.isProduction
        });

        (res as any).result = {
            data: null,
            message: SUCCESS_MESSAGE.LOGOUT_SUCCESSFUL
        }
        OutputHandler(STATUS_CODE.OK, req, res, next)
    } catch (error) {
        next(error);
    }
}

export const forgotPassoword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data: IForgotPasswordDTO = req.body;

        const userId = await authServices.forgotPassword(data);

        console.log("userid", userId);

        (res as any).result = { data: userId, message: SUCCESS_MESSAGE.OTP_SENT };
        OutputHandler(STATUS_CODE.OK, req, res, next);
    } catch (error) {
        next(error);
    }
}

export const getAuthUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        (res as any).result = {
            data: user,
            message: SUCCESS_MESSAGE.AUTH_USER_FETCHED,
        };

        OutputHandler(STATUS_CODE.OK, req, res, next);
    } catch (error) {
        next(error);
    }
}

export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const data: IOTPDTO = req.body;

        const resetToken = await authServices.verifyOtp(data);

        (res as any).result = {
            data: resetToken,
            message: SUCCESS_MESSAGE.OTP_VERIFIED,
        };

        OutputHandler(STATUS_CODE.OK, req, res, next);
    } catch (error) {
        next(error)
    }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const data: IResetPasswordDTO = req.body;

        await authServices.resetPassword(data);

        (res as any).result = { data: null, message: SUCCESS_MESSAGE.PASSWORD_RESET_SUCCESS }

        OutputHandler(STATUS_CODE.OK, req, res, next)
    } catch (error) {
        next(error)
    }
}

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {


        const userId = (req.user as any).id
        const { fullName, cursorColor } = req.body;

        const file = req.file;

        let avatarUrl: string | undefined

        if (file) {
            avatarUrl = await uploadToCloudinary(file.buffer, "asyncboard/avatars");
            console.log("avatarUrl from cloudinary:", avatarUrl);
        }

        const updatedProfile = await authServices.updateProfile(userId, { fullName, avatarUrl, cursorColor });


        (res as any).result = { data: updatedProfile, message: SUCCESS_MESSAGE.PROFILE_UPDATED }

        OutputHandler(STATUS_CODE.OK, req, res, next)
    } catch (error) {
        next(error)
    }
}

export const refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const token = req.cookies.refreshToken;

        const { accessToken } = await authServices.refreshToken(token);

        (res as any).result = {
            data: { accessToken: accessToken },
            message: SUCCESS_MESSAGE.REFRESH_TOKEN,
        };
        OutputHandler(STATUS_CODE.OK, req, res, next);
    } catch (error) {
        next(error)
    }
};