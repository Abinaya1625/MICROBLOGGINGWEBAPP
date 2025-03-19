import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import user from "./routes/UserRoutes.js";
import post from "./routes/PostRoutes.js";
import news from "./routes/NewsRoutes.js";
import message from "./routes/messageRoute.js";
import requestRoutes from "./routes/connectRoute.js";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors"; // Ensure CORS is handled

dotenv.config();

const app = express();
const server = createServer(app); // Create an HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (adjust for security in production)
    methods: ["GET", "POST"],
  },
});

// Middleware to handle JSON and form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS globally

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

// Connect to MongoDB
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("✅ Database connected successfully.");
    server.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection error:", error.message);
    process.exit(1);
  });

// Serve static files
app.use("/api/uploads", express.static("./uploads"));

// API routes
app.use("/api/user", user);
app.use("/api/post", post);
app.use("/api/news", news);
app.use("/api/message", message);
app.use("/api/request", requestRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("⚠️ Unhandled error:", err.message);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  socket.on("chatMessage", (data) => {
    console.log(`📩 Message received: ${data}`);
    io.emit("chatMessage", data);
  });

  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

export default app;
