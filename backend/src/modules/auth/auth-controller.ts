import { Request, Response, NextFunction } from "express";
import { ISignUPDTO } from "../../types/auth-types";
import { authServices } from "./auth-services";
import { SUCCESS_MESSAGE } from "../../constants/success-message";
import { OutputHandler } from "../../middlewares/outputHandler-middleware";
import { STATUS_CODE } from "../../constants/status-codes";

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body as ISignUPDTO;

        const newUser = await authServices.signUp(userData);

        (res as any).result = {
            data: { newUser },
            message: SUCCESS_MESSAGE.USER_CREATED
        };

        OutputHandler(STATUS_CODE.CREATED, req, res, next);
    } catch (error) {
        next(error);
    }
}