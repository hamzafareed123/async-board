import { NextFunction, Request, Response } from "express";
import { STATUS_CODE } from "../constants/status-codes";
import { ERROR_MESSAGE } from "../constants/error-message";
import { customError } from "../utils/custom-error";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import { authRepository } from "../modules/auth/auth-repositories";
import { IUser } from "../types/auth-types";
import { mapUser } from "../utils/mapUser";
import { User } from "../models/auth-model";


declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

export const protectedRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            throw new customError(ERROR_MESSAGE.UNAUTHORIZED, STATUS_CODE.UNAUTHORIZED)
        }

        const decode = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET_KEY) as ({
            userId: string;
        })

        const user = await authRepository.findUserById(decode.userId);


        if (!user) {
            throw new customError(ERROR_MESSAGE.UNAUTHORIZED, STATUS_CODE.UNAUTHORIZED);
        }

        req.user = mapUser(user)

        next();
    } catch (err) {
        next(err);
    }
}