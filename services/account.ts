import api from "./axios";
import FormData from "form-data";

export const accountService = {
  async checkPartner(params: any) {
    return await api.get(`/accounts/check-partner`, { params });
  },

  async getAllAccount(params: any) {
    return await api.get(`/accounts`, { params });
  },

  async getMyReferralList(params: any) {
    return await api.get(`/accounts/my-referral`, { params });
  },

  async getTransactionHistory(params: any) {
    return await api.get(`/accounts/transaction-history`, { params });
  },

  // Dịch vụ thuê ---------------------
  async getAllServiceRental(params: any) {
    return await api.get(`/service-rentals`, { params });
  },

  async serviceRegistration(payload: any) {
    return await api.post(`/service-rentals`, payload);
  },
};
