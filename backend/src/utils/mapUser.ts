import { IUserDocument } from "../models/auth-model";

import {IUser} from "../types/auth-types"

export const mapUser = (user: IUserDocument): IUser => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  profilePic:user.profilePic,
  cursorColor:user.cursorColor,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});