import { io } from "socket.io-client";

const socket = io("http://localhost:8002");

socket.on("connect", () => {
  console.log(`✅ Connected to server: ${socket.id}`);
  socket.emit("chatMessage", "Hello from test client!");
});

socket.on("chatMessage", (data) => {
  console.log("📩 New message:", data);
});

socket.on("disconnect", () => {
  console.log("🔴 Disconnected from server");
});
