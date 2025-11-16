import { io } from "socket.io-client";

export default defineNuxtPlugin(() => {
  const socket = io("https://api.tnsolve.com", {
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
