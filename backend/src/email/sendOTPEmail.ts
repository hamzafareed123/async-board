import {transporter} from "../email/transporter";
import {ENV} from "../config/env";
import {otpEmailTemplate} from "../email/otpEmailTemplate";

export const sendOTPEmail = async (email:string,otp:string):Promise<void>=>{

   await  transporter.sendMail({
        from:`Sync Board <${ENV.GMAIL_USER}>`,
        to:email,
        subject:"OTP FOR PASSWORD RESET",
        html:otpEmailTemplate(otp)
    })
}

