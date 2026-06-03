import { ENV } from "../config/env";
import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
    service:"Gmail",
    auth:{
        user:ENV.GMAIL_USER,
        pass:ENV.GMAIL_USER_PASSWORD
    }
})