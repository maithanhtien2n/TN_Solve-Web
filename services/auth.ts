import api from "./axios";

export const authService = {
  async login(payload: any) {
    return await api.post("/auth/login", payload);
  },

  async logout() {
    return await api.post("/auth/logout");
  },

  async partnerRegister(payload: any) {
    return await api.post("/auth/partner-register", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  async getInfoFromImage(payload: any, signal: AbortSignal) {
    return await api.post("/auth/documents-parse", payload, { signal });
  },
};
