import {rateLimit} from "express-rate-limit";
import { ERROR_MESSAGE } from "../constants/error-message";


export const Limiter = rateLimit({
    windowMs:1*60*1000,
    max:200,
    message:ERROR_MESSAGE.TOO_MANY_REQUEST
})

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: ERROR_MESSAGE.TOO_MANY_REQUEST,
});

export const passwordRecoveryLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 6,
    standardHeaders: true,
    legacyHeaders: false,
    message: ERROR_MESSAGE.TOO_MANY_REQUEST,
});
