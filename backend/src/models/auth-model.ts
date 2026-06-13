import { Schema, model, Document } from "mongoose";
import { IUser } from "../types/auth-types";


export interface IUserDocument extends Document {
  fullName: string;
  email: string;
  password: string;
  profilePic?: string;
  role: "user" | "admin";
  provider: "local" | "google";
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}



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