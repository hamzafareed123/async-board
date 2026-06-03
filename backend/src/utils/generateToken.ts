import jwt,{SignOptions} from "jsonwebtoken";
import {Response} from "express";
import {ENV} from "../config/env"
import RefreshToken from "../models/refreshToken-model"

export const generateToken =(
    userId:string,
    SECRET_KEY:string,
    expiresIn:SignOptions["expiresIn"]
):string=>{
    return jwt.sign({userId},SECRET_KEY,{expiresIn})
}


export const generateRefreshToken = async(
    userId:string,
    res:Response
)=>{

    const token = jwt.sign({userId},ENV.REFRESH_TOKEN_SECRET_KEY,{expiresIn:"7d"})

    await RefreshToken.create({userId,token})
    res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: ENV.isProduction,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    return token;
}
