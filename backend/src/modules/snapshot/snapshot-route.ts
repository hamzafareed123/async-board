import express from "express"
import { Limiter } from "../../middlewares/rateLimiter-middleware";
import { protectedRoute } from "../../middlewares/auth-middleware";
import { isEditorOrAbove, isMember } from "../../middlewares/room-middleware";
import { createSnapshot,getSnapshot, updateSnapshot } from "./snapshot-controller";

const router = express.Router();


router.use(Limiter)
router.use(protectedRoute);


router.post("/:room_id",isMember,isEditorOrAbove,createSnapshot);
router.get("/:room_id",isMember,getSnapshot)
router.put("/:room_id/:snapshot_id/restore",isMember,isEditorOrAbove,updateSnapshot)


export default router;
