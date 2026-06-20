import express from "express";
import { protectedRoute } from "../../middlewares/auth-middleware";
import { createRoom, deleteRoom, joinRoom, getRoomMembers } from "./room-controller";
import { isMember, isOwner } from "../../middlewares/room-middleware";


const router = express.Router();

router.use(protectedRoute)


router.post("/", createRoom);
router.delete("/:room_id",isOwner, deleteRoom);
router.get("/join/:code", joinRoom);
router.get("/:room_id/members",isMember, getRoomMembers);

export default router;