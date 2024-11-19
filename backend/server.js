import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import chatRoutes from "./routes/chats.route.js"
import notificationRoutes from "./routes/notification.route.js";
import connectionRoutes from "./routes/connection.route.js";
import { connectDB } from "./lib/db.js";
import { log } from "console";
import { Server } from "socket.io";
import chat from "./models/chats.model.js";


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

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

const server = app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	connectDB();
});

const io = new Server(server, {
	pingTimeout: 60000,
	cors: {
	  origin: "http://localhost:5173",
	  // credentials: true,
	},
  });

  io.on("connection", (socket) => {
	console.log("User connected:", socket.id);
  
	// Join a specific chat room
	socket.on("joinChat", ({ userId, otherUserId }) => {
	  const roomId = [userId, otherUserId].sort().join("_"); // Unique room identifier
	  socket.join(roomId);
	  console.log(`User ${userId} joined room ${roomId}`);
	});
  
	// Handle sending messages
	socket.on("sendMessage", async (messageData) => {
		const { senderId, receiverId, content } = messageData;
	  
		try {
		  const message = new chat({ senderId, receiverId, content });
		  await message.save();
	  
		  const roomId = [senderId, receiverId].sort().join("_");
		  io.to(roomId).emit("receiveMessage", message); // Emit to the specific room
		} catch (error) {
		  console.error("Error sending message:", error);
		}
	  });
	  

  
	// Handle disconnection
	socket.on("disconnect", () => {
	  console.log("User disconnected:", socket.id);
	});
  });
  