import express from "express"
import { protectedRoute } from "../../middlewares/auth-middleware";
import { createElement, getElements, updateElement, deleteElement } from "./element-controller";
import { isEditorOrAbove, isMember } from "../../middlewares/room-middleware";
import { validateRequest } from '../../middlewares/validation-middleware';
import { createElementSchema } from "./element-validator";
import { Limiter } from "../../middlewares/rateLimiter-middleware";


const router = express.Router();

router.use(Limiter);
router.use(protectedRoute);
router.post(
    "/:room_id/elements",
    isMember,
    isEditorOrAbove,
    validateRequest(createElementSchema),
    createElement
)

router.get("/:room_id/elements", isMember, getElements)
router.put(
    "/:room_id/elements/:element_id",
    isMember,
    isEditorOrAbove,
    updateElement
)

router.delete(
    "/:room_id/elements/:element_id",
    isMember,
    isEditorOrAbove,
    deleteElement
)


export default router;