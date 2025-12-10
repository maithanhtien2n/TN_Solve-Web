import api from "./axios";

export const couponService = {
  async getAllCoupon(params: any) {
    return await api.get(`/coupons`, { params });
  },

  async saveCoupon(payload: any) {
    return await api.post(`/coupons`, payload);
  },

  async actionCoupon(payload: any) {
    return await api.put(`/coupons/action`, payload);
  },
};
