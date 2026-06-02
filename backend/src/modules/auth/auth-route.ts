import express from "express";
import { signUpSchema } from "./auth-validator";
import {signUp} from "./auth-controller";
import { validateRequest } from "../../middlewares/validation-middleware";


const router = express.Router();

router.post("/signup",validateRequest(signUpSchema),signUp)

export default router;