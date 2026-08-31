import api from "./axios";

export const websiteChatService = {
  // [2026-08-31] 45s -> 190s — khớp backend vừa nới lên 180s (Hana phân tích
  // ảnh cần hơn 30s cũ), tầng ngoài luôn phải dài hơn tầng trong 1 chút để
  // không tự abort trước khi backend kịp trả lỗi/kết quả rõ ràng.
  async chat(payload: {
    conversation: { role: "user" | "assistant"; content: string }[];
    message: string;
    files?: { data: string; mimeType: string; filename?: string }[];
  }) {
    // silentError=1: lỗi đã hiện ngay trong bong bóng chat (WebsiteChatWidget.vue
    // tự bắt lỗi) — không cần thêm popup hệ thống chồng lên che khung chat.
    return await api.post(`/website-chat/chat`, payload, {
      timeout: 190_000,
      params: { silentError: 1 },
    });
  },
};
