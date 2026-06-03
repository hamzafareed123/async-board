import dotenv from "dotenv";

dotenv.config();

export const ENV = {
    PORT: parseInt(process.env.PORT || "8000", 10),
    MONGO_URL: process.env.MONGO_URL as string,
    isProduction: process.env.isProduction === "true",
    GMAIL_USER:process.env.GMAIL_USER as string,
    GMAIL_USER_PASSWORD:process.env.GMAIL_USER_PASSWORD as string,
    ACCESS_TOKEN_SECRET_KEY:process.env.ACCESS_TOKEN_SECRET_KEY as string,
    REFRESH_TOKEN_SECRET_KEY:process.env.REFRESH_TOKEN_SECRET_KEY as string
}