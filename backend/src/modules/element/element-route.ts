import express from "express"
import { protectedRoute } from "../../middlewares/auth-middleware";
import { createElement } from "./element-controller";
import { isEditorOrAbove } from "../../middlewares/room-middleware";


const router = express.Router();


router.use(protectedRoute);


router.post("/:room_id/elements",isEditorOrAbove,createElement)


export default router;