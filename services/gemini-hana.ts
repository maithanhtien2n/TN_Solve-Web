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

  async testAccount(payload: {
    accountId: string;
    prompt: string;
    files?: { data: string; mimeType: string; filename?: string }[];
  }) {
    return await api.post(`/gemini-hana/test`, payload);
  },

  async chatAccount(payload: {
    accountId: string;
    prompt: string;
    files?: { data: string; mimeType: string; filename?: string }[];
    chatMetadata?: (string | null)[] | null;
  }) {
    return await api.post(`/gemini-hana/chat`, payload);
  },
};
