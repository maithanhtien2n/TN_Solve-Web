import { io } from "socket.io-client";

export default defineNuxtPlugin(() => {
  const socket = io(import.meta.env.VITE_API_URL, {
    // 1. Cho phép polling để kết nối ban đầu dễ dàng hơn qua firewall Windows
    transports: ["polling", "websocket"],

    // 2. Ép hệ thống nâng cấp lên websocket ngay khi có thể
    upgrade: true,

    // 3. Giúp duy trì trạng thái websocket cho các lần kết nối sau
    rememberUpgrade: true,

    reconnectionAttempts: 10, // Tăng thêm số lần thử nếu server bận
    reconnectionDelay: 2000, // Tăng độ trễ giữa các lần reconnect để tránh spam server
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  // Theo dõi xem socket đang dùng phương thức nào (polling hay websocket)
  socket.on("connect_error", (err) => {
    console.error("❌ Socket connection error:", err.message);
  });

  socket.io.on("reconnect_attempt", () => {
    console.log("🔄 Reconnecting...");
  });

  return { provide: { socket } };
});
