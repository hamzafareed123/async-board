import mongoose, { Document, Schema } from "mongoose";
import { IRefreshToken } from "../types/auth-types";

export interface IRefreshTokenDocument extends IRefreshToken, Document { }

const refreshTokenSchema = new Schema<IRefreshTokenDocument>(
    {
        userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
        token: { type: String, required: true }
    },
    { timestamps: true }
)

const RefreshToken = mongoose.model<IRefreshTokenDocument>("RefreshToken", refreshTokenSchema);
export default RefreshToken;