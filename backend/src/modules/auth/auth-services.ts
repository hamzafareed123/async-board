import { IAuthResponse, ISignUPDTO } from "../../types/auth-types";
import { customError } from "../../utils/custom-error";
import { authRepository } from "./auth-repositories";
import { ERROR_MESSAGE } from "../../constants/error-message"
import { STATUS_CODE } from "../../constants/status-codes";
import bcrypt from "bcrypt";
import { sendWelcomeEmail } from "../../email/sendWelcomeEmail";
import { generateToken} from "../../utils/generateToken";
import {ENV} from "../../config/env";


export const authServices = {
    async signUp(userData: ISignUPDTO):Promise<IAuthResponse> {
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
            newUser._id.toString(),
            ENV.ACCESS_TOKEN_SECRET_KEY,
            "15m"
        )


        sendWelcomeEmail(email, fullName).catch((error) => {
            console.error("Error sending welcome email:", error);
        });

      return {
        user:newUser,
        accessToken
      }
    },
};