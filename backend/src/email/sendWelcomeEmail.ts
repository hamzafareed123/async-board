import {transporter} from "./transporter"
import {ENV} from "../config/env"
import {sendWelcomeEmailTemplate} from "./sendWelcomeEmailTemplate"

export const sendWelcomeEmail = async (email:string, userName:string):Promise<void>=>{
    await transporter.sendMail({
        from:`Sync Board <${ENV.GMAIL_USER}>`,
        to:email,
        subject:"WELCOME TO SYNC BOARD",
        html:sendWelcomeEmailTemplate(email, userName)
    })
}