import api from "./axios";
import FormData from "form-data";

export const storeService = {
  async getTemplates() {
    return await api.get(`/store/templates`);
  },

  async getDefaultPrice() {
    return await api.get(`/store/default-price`);
  },

  async getTemplateDetail(id: string) {
    return await api.get(`/store/templates/detail/${id}`);
  },

  async analyzePrompt(basePrompt: string) {
    return await api.post(`/store/templates/admin/analyze-prompt`, { basePrompt });
  },

  async getTemplatesAdmin(params?: {
    search?: string;
    page?: number;
    limit?: number;
  }) {
    return await api.get(`/store/templates/admin`, { params });
  },

  async saveTemplate(payload: any) {
    const formData = new FormData();
    if (payload.title != null) formData.append("title", payload.title);
    if (payload.basePrompt != null) formData.append("basePrompt", payload.basePrompt);
    if (payload.videoMode != null) formData.append("videoMode", payload.videoMode);
    if (payload.aspectRatio != null) formData.append("aspectRatio", payload.aspectRatio);
    if (payload.price != null) formData.append("price", String(payload.price));
    if (payload._id) formData.append("_id", payload._id);
    if (payload.status) formData.append("status", payload.status);
    if (payload.thumbnail && typeof payload.thumbnail === "object") {
      formData.append("thumbnail", payload.thumbnail);
    }
    if (payload.sampleVideo && typeof payload.sampleVideo === "object") {
      formData.append("sampleVideo", payload.sampleVideo);
    }
    if (Array.isArray(payload.exampleImages)) {
      payload.exampleImages.forEach((image: any) => {
        if (image) formData.append("exampleImages", image);
      });
    }
    if (payload.exampleImagesMeta != null) {
      formData.append("exampleImagesMeta", JSON.stringify(payload.exampleImagesMeta));
    }
    if (payload.promptFields != null) {
      formData.append("promptFields", JSON.stringify(payload.promptFields));
    }

    if (payload._id) {
      return await api.put(`/store/templates/admin`, formData);
    } else {
      return await api.post(`/store/templates/admin`, formData);
    }
  },

  async deleteTemplate(payload: { _id: string }) {
    return await api.delete(`/store/templates/admin`, { data: payload });
  },

  async getWallet() {
    return await api.get(`/store/wallet`);
  },

  async getWalletTransactions(params?: { page?: number; limit?: number }) {
    return await api.get(`/store/wallet/transactions`, { params });
  },

  async createWalletTopupPayment(payload: { amount: number }) {
    return await api.post(`/store/wallet/topup`, payload);
  },
};
