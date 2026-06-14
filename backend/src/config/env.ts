import dotenv from "dotenv";

dotenv.config();

export const ENV = {
    PORT: parseInt(process.env.PORT || "8000", 10),
    MONGO_URL: process.env.MONGO_URL as string,
    isProduction: process.env.isProduction === "true",
    GMAIL_USER: process.env.GMAIL_USER as string,
    GMAIL_USER_PASSWORD: process.env.GMAIL_USER_PASSWORD as string,
    ACCESS_TOKEN_SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY as string,
    REFRESH_TOKEN_SECRET_KEY: process.env.REFRESH_TOKEN_SECRET_KEY as string,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: parseInt(process.env.REDIS_PORT || "6379"),
    RESET_TOKEN_SECRET_KEY: process.env.RESET_TOKEN_SECRET_KEY as string,
    CLOUD_NAME: process.env.CLOUD_NAME as string,
    CLOUD_API_KEY: process.env.CLOUD_API_KEY as string,
    CLOUD_API_SECRET: process.env.CLOUD_API_SECRET as string,
    SERVER_URL:process.env.SERVER_URL as string
}