import express from "express"
import { Limiter } from "../../middlewares/rateLimiter-middleware";
import { protectedRoute } from "../../middlewares/auth-middleware";
import { isEditorOrAbove, isMember, isOwner } from "../../middlewares/room-middleware";
import { createSnapshot, getSnapshot, restoreSnapshot } from "./snapshot-controller";

const router = express.Router();


router.use(Limiter)
router.use(protectedRoute);


router.post("/:room_id", isMember, isEditorOrAbove, createSnapshot);
router.get("/:room_id", isMember, getSnapshot)
router.post("/:room_id/:snapshot_id/restore", isMember, isOwner, restoreSnapshot)


export default router;
