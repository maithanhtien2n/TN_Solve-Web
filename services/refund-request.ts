import api from "./axios";

export const refundRequestService = {
  async getTotalEstimate() {
    return await api.get("/refund-requests/total-estimate");
  },

  async previewAll() {
    return await api.get("/refund-requests/preview-all");
  },

  async create(payload: any) {
    return await api.post("/refund-requests", payload);
  },

  async getMy(params?: any) {
    return await api.get("/refund-requests/my", { params });
  },

  async getAll(params?: any) {
    return await api.get("/refund-requests", { params });
  },

  async action(payload: any) {
    return await api.put("/refund-requests/action", payload);
  },
};
