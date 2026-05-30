import dotenv from "dotenv";

dotenv.config();

export const ENV = {
    PORT: parseInt(process.env.PORT || "8000", 10),
    MONGO_URL: process.env.MONGO_URL as string,
    isProduction: process.env.isProduction === "true"
}