import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { send, Messages, MarkMessage } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/message", protectRoute, send)
router.get("/messages/:userId/:otherUserId", protectRoute, Messages)
router.put("/messages/:messageId/read", protectRoute, MarkMessage)

export default router;