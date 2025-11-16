import { b as api } from './app.store-CsbFmGtW.mjs';

const accountService = {
  async checkPartner(params) {
    return await api.get(`/accounts/check-partner`, { params });
  },
  async getAllAccount(params) {
    return await api.get(`/accounts`, { params });
  },
  async getMyReferralList(params) {
    return await api.get(`/accounts/my-referral`, { params });
  },
  async getTransactionHistory(params) {
    return await api.get(`/accounts/transaction-history`, { params });
  },
  // Dịch vụ thuê ---------------------
  async getAllServiceRental(params) {
    return await api.get(`/service-rentals`, { params });
  },
  async serviceRegistration(payload) {
    return await api.post(`/service-rentals`, payload);
  }
};

export { accountService as a };
//# sourceMappingURL=account-Cwp5COvj.mjs.map
