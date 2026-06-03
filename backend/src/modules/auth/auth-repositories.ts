import { User } from "../../models/auth-model";
import { ISignUPDTO } from "../../types/auth-types";

export const authRepository = {
    async createUser(userData:ISignUPDTO) {
        const user =  await User.create(userData);
        return {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            createdAt:user.createdAt,
            updatedAt:user.updatedAt
        }
    },

    async findUserByEmail(email:string){
        return await User.findOne({ email });
    }
}