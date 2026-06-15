import express from "express";
import { protectedRoute } from "../../middlewares/auth-middleware";
import { createRoom, deleteRoom } from "./room-controller";


const router = express.Router();

router.use(protectedRoute)


router.post("/", createRoom)
router.delete("/:room_id", deleteRoom)

export default router;