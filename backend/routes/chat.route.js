import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

app.post("/message", protectRoute)
app.get("/messages/:userId/:otherUserId", protectRoute)
app.put("/messages/:messageId/read", protectRoute)

export default router