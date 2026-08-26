import { v2 as cloudinary } from "cloudinary"
import { ENV } from "./env"

cloudinary.config({
    cloud_name: ENV.CLOUD_NAME,
    api_key: "135329536928664",
    api_secret: ENV.CLOUD_API_SECRET
})

export default cloudinary;