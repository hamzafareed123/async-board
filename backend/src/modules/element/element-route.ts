import express from "express"
import { protectedRoute } from "../../middlewares/auth-middleware";
import { createElement, getElements } from "./element-controller";
import { isEditorOrAbove, isMember } from "../../middlewares/room-middleware";
import { validateRequest } from '../../middlewares/validation-middleware';
import { createElementSchema } from "./element-validator";


const router = express.Router();

router.use(protectedRoute);
router.post(
    "/:room_id/elements",
    isEditorOrAbove,
    validateRequest(createElementSchema),
    createElement
)

router.get("/:room_id/elements", isMember, getElements)


export default router;