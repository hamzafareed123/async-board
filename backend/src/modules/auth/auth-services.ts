import { ISignUPDTO } from "../../types/auth-types";
import { customError } from "../../utils/custom-error";
import { authRepository } from "./auth-repositories";
import { ERROR_MESSAGE } from "../../constants/error-message"
import { STATUS_CODE } from "../../constants/status-codes";
import bcrypt from "bcrypt";

export const authServices = {
    async signUp(userData: ISignUPDTO) {

        const { fullName, email, password } = userData;

        const user = await authRepository.findUserByEmail(email);

        if (user) {

            throw new customError(ERROR_MESSAGE.USER_ALREADY_EXIST, STATUS_CODE.CONFLICT)
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await authRepository.signUp({
            fullName,
            email,
            password: hashedPassword
        })

        return newUser;
    }
}