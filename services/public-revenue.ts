import api from "./axios";

export const publicRevenueService = {
  async getStats(payload: {
    password: string;
    viewType: "today" | "week" | "month" | "custom";
    dateFrom?: string;
    dateTo?: string;
  }) {
    return await api.post(`/public-revenue/stats`, payload);
  },
};
