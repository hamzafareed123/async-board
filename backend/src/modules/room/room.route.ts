import express from "express";
import { protectedRoute } from "../../middlewares/auth-middleware";
import { createRoom, deleteRoom, joinRoom, getRoomMembers, getUserRooms, getRoomById, getEditorInviteCode } from "./room-controller";
import { isMember, isOwner } from "../../middlewares/room-middleware";
import { Limiter } from "../../middlewares/rateLimiter-middleware";


const router = express.Router();

router.use(protectedRoute)
router.use(Limiter);

router.post("/", createRoom);
router.delete("/:room_id", isMember, isOwner, deleteRoom);
router.get("/join/:code", joinRoom);
router.get("/:room_id/members", isMember, getRoomMembers);
router.post("/:room_id/editor-invite", isMember, isOwner, getEditorInviteCode);
router.get("/", getUserRooms);
router.get("/:room_id", isMember, getRoomById)

export default router;
