import api from "./axios";

export * from "./auth";
export * from "./account";
export * from "./product";
export * from "./master-data";

export const appService = {
  async getUserData(params?: any) {
    return await api.get("/accounts/me", { params });
  },

  async saveSetting(payload: any) {
    let data: any = { ...payload };

    if (data.geminiCookies === "●●●●●●●●●●●●●●●●●●●●●●●●●●●") {
      data.geminiCookies = null;
    }

    if (data.flowCookies === "●●●●●●●●●●●●●●●●●●●●●●●●●●●") {
      data.flowCookies = null;
    }

    return await api.post("/accounts/settings", data);
  },

  async createPaymentUrl(payload: any) {
    return await api.post("/common/create-payment-url", payload);
  },
};
