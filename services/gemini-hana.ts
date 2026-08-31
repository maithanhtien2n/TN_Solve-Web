import api from "./axios";

export const geminiHanaService = {
  async getAllAccounts(params: any) {
    return await api.get(`/gemini-hana/accounts`, { params });
  },

  async saveAccount(payload: any) {
    return await api.post(`/gemini-hana/accounts`, payload);
  },

  async actionAccount(payload: any) {
    return await api.put(`/gemini-hana/accounts/action`, payload);
  },

  async getSettings() {
    return await api.get(`/gemini-hana/settings`);
  },

  async saveSettings(payload: any) {
    return await api.put(`/gemini-hana/settings`, payload);
  },

  // [2026-08-30] Timeout riêng 200s (thay vì mặc định 70s của axios.ts) —
  // đồng bộ với chuỗi timeout gen-server/TN_Solve-Server phía sau (180s /
  // 190s), để Admin Test/Chat prompt dài (VD kịch bản 75 cảnh) không bị FE
  // cắt sớm hơn các tầng bên dưới. KHÔNG đổi default toàn app, chỉ 2 call này.
  async testAccount(payload: {
    accountId: string;
    prompt: string;
    files?: { data: string; mimeType: string; filename?: string }[];
  }) {
    return await api.post(`/gemini-hana/test`, payload, { timeout: 200_000 });
  },

  // [2026-08-31] Trạng thái SỐNG (healthy/lastError) từng account — đọc trực
  // tiếp từ RAM gemini-hana-service, không lưu DB. Gọi lại mỗi lần vào/tải
  // lại trang là có dữ liệu mới nhất, không cache gì ở FE.
  async getLiveHealth() {
    return await api.get(`/gemini-hana/health`);
  },

  async chatAccount(payload: {
    accountId: string;
    prompt: string;
    files?: { data: string; mimeType: string; filename?: string }[];
    chatMetadata?: (string | null)[] | null;
  }) {
    return await api.post(`/gemini-hana/chat`, payload, { timeout: 200_000 });
  },
};
