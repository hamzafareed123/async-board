import express from "express";
import { signUpSchema, signInSchema, forgotPasswordSchema } from './auth-validator';
import { signUp, login, logout, forgotPassoword } from "./auth-controller";
import { validateRequest } from "../../middlewares/validation-middleware";


const router = express.Router();

router.post("/signup", validateRequest(signUpSchema), signUp);
router.post("/login", validateRequest(signInSchema), login);
router.post("/logout", logout)
router.post("/forgot-password", validateRequest(forgotPasswordSchema), forgotPassoword)

export default router;