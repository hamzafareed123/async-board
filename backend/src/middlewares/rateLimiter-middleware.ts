import {rateLimit} from "express-rate-limit";
import { ERROR_MESSAGE } from "../constants/error-message";


export const Limiter = rateLimit({
    windowMs:1*60*1000,
    max:200,
    message:ERROR_MESSAGE.TOO_MANY_REQUEST
})