import express from "express";
import {
    signUpSchema,
    signInSchema,
    forgotPasswordSchema,
    verifyOtpSchema,
    resetPasswordSchema,
    updateProfileSchema
} from './auth-validator';
import {
    signUp,
    login,
    logout,
    forgotPassoword,
    getAuthUser,
    verifyOTP,
    resetPassword,
    updateProfile
} from "./auth-controller";
import { validateRequest } from "../../middlewares/validation-middleware";
import { protectedRoute } from "../../middlewares/auth-middleware";
import { upload } from "../../config/multer";
import { Limiter } from "../../middlewares/rateLimiter-middleware";


const router = express.Router();

router.use(Limiter);
router.post("/signup", validateRequest(signUpSchema), signUp);
router.post("/login", validateRequest(signInSchema), login);
router.post("/logout", logout)
router.post("/forgot-password", validateRequest(forgotPasswordSchema), forgotPassoword);
router.post("/verify-otp", validateRequest(verifyOtpSchema), verifyOTP);
router.post("/reset-password", validateRequest(resetPasswordSchema), resetPassword);
router.get("/auth-user", protectedRoute, getAuthUser)
router.patch(
    "/update-profile",
    protectedRoute,
    upload.single("avatar"),
    validateRequest(updateProfileSchema),
    updateProfile
)



export default router;