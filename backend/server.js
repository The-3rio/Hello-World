import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import connectionRoutes from "./routes/connection.route.js";
import chatRoutes from "./routes/chat.route.js"
import { connectDB } from "./lib/db.js";
// import Message from "./models/chatModel.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();
if (process.env.NODE_ENV !== "production") {
	app.use(cors({origin: "http://localhost:5173",credentials: true,}));
}

app.use(express.json({ limit: "5mb" })); // parse JSON request bodies
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/connections", connectionRoutes);
app.use("/api/v1/chats", chatRoutes);
// Route to send a new message
app.post("/messages", async (req, res) => {
	const { senderId, receiverId, content } = req.body;
	try {
	  const message = new Message({ senderId, receiverId, content });
	  await message.save();
	  res.status(201).json({ message: "Message sent successfully", data: message });
	} catch (error) {
	  res.status(500).json({ error: "Error sending message" });
	}
  });
// Route to get all messages between two users
app.get("/messages/:userId/:otherUserId", async (req, res) => {
	const { userId, otherUserId } = req.params;
	try {
	  const messages = await Message.find({
		$or: [
		  { senderId: userId, receiverId: otherUserId },
		  { senderId: otherUserId, receiverId: userId },
		],
	  }).sort("timestamp");
	  res.status(200).json({ messages });
	} catch (error) {
	  res.status(500).json({ error: "Error retrieving messages" });
	}
  });
  
  // Route to mark a message as read
  app.put("/messages/:messageId/read", async (req, res) => {
	const { messageId } = req.params;
	try {
	  const message = await Message.findByIdAndUpdate(
		messageId,
		{ read: true },
		{ new: true }
	  );
	  if (message) {
		res.status(200).json({ message: "Message marked as read", data: message });
	  } else {
		res.status(404).json({ error: "Message not found" });
	  }
	} catch (error) {
	  res.status(500).json({ error: "Error updating message status" });
	}
  });  


if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	connectDB();
});
