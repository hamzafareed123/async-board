import {Schema, model, Document} from "mongoose";
import {IUser} from "../types/auth-types";

export interface IUserDocument extends IUser,Document{}

const userSchema = new Schema<IUserDocument>(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    profilePic: {
      type: String,
    },

    otp: {
      type: String,
      default: null,
    },

    otpExpiry: {
      type: Date,
      default: null,
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    googleId: {
      type: String,
    },
  },
  { timestamps: true },
);

export const User = model<IUserDocument>("User", userSchema);