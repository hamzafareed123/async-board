import express from "express";
import { protectedRoute } from "../../middlewares/auth-middleware";
import { createRoom, deleteRoom, joinRoom, getRoomMembers,getUserRooms } from "./room-controller";
import { isMember, isOwner } from "../../middlewares/room-middleware";
import { Limiter } from "../../middlewares/rateLimiter-middleware";


const router = express.Router();

router.use(protectedRoute)
router.use(Limiter);

router.post("/", createRoom);
router.delete("/:room_id", isOwner, deleteRoom);
router.get("/join/:code", joinRoom);
router.get("/:room_id/members", isMember, getRoomMembers);
router.get("/", getUserRooms);

export default router;