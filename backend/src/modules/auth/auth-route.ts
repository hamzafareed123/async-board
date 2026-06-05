import express from "express";
import { signUpSchema, signInSchema, forgotPasswordSchema, verifyOtpSchema } from './auth-validator';
import { signUp, login, logout, forgotPassoword, getAuthUser, verifyOTP } from "./auth-controller";
import { validateRequest } from "../../middlewares/validation-middleware";
import { protectedRoute } from "../../middlewares/auth-middleware";


const router = express.Router();

router.post("/signup", validateRequest(signUpSchema), signUp);
router.post("/login", validateRequest(signInSchema), login);
router.post("/logout", logout)
router.post("/forgot-password", validateRequest(forgotPasswordSchema), forgotPassoword);
router.post("/verify-otp", validateRequest(verifyOtpSchema), verifyOTP);
router.get("/auth-user", protectedRoute, getAuthUser)


export default router;