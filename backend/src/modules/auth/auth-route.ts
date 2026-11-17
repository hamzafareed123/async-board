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
    updateProfile,
    refreshToken
} from "./auth-controller";
import { validateRequest } from "../../middlewares/validation-middleware";
import { protectedRoute } from "../../middlewares/auth-middleware";
import { upload } from "../../config/multer";
import { Limiter, loginLimiter, passwordRecoveryLimiter } from "../../middlewares/rateLimiter-middleware";


const router = express.Router();

router.use(Limiter);
router.post("/signup", validateRequest(signUpSchema), signUp);
router.post("/login", loginLimiter, validateRequest(signInSchema), login);
router.post("/logout", logout)
router.post("/forgot-password", passwordRecoveryLimiter, validateRequest(forgotPasswordSchema), forgotPassoword);
router.post("/verify-otp", passwordRecoveryLimiter, validateRequest(verifyOtpSchema), verifyOTP);
router.post("/reset-password", passwordRecoveryLimiter, validateRequest(resetPasswordSchema), resetPassword);
router.get("/auth-user", protectedRoute, getAuthUser)
router.patch(
    "/update-profile",
    protectedRoute,
    upload.single("avatar"),
    validateRequest(updateProfileSchema),
    updateProfile
)
router.post("/refresh-token",refreshToken)



export default router;
