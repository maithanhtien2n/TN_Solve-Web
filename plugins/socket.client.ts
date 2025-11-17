import { io } from "socket.io-client";

export default defineNuxtPlugin(() => {
  const socket = io(import.meta.env.VITE_API_URL, {
    transports: ["websocket"],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    // console.log("✅ Socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
  });

  return { provide: { socket } };
});
