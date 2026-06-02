import { User } from "../../models/auth-model";
import { ISignUPDTO } from "../../types/auth-types";

export const authRepository = {
    async signUp(userData:ISignUPDTO){
        return await User.create(userData);
    },

    async findUserByEmail(email:string){
        return await User.findOne({ email });
    }
}