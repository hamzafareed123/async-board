import express from "express";
import { protectedRoute } from "../../middlewares/auth-middleware";
import { createRoom, deleteRoom, joinRoom, getRoomMembers } from "./room-controller";


const router = express.Router();

router.use(protectedRoute)


router.post("/", createRoom);
router.delete("/:room_id", deleteRoom);
router.get("/join/:code", joinRoom);
router.get("/:room_id/members", getRoomMembers);

export default router;