import { v2 as cloudinary } from "cloudinary"
import { ENV } from "./env"

cloudinary.config({
    cloud_name: ENV.CLOUD_NAME,
    api_key: ENV.CLOUD_API_KEY,
    api_secret:"LDi_RI8Kurj0LWl6J2T7IwHvXUs"
})

export default cloudinary;