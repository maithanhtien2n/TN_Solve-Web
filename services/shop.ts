import api from "./axios";

export const shopService = {
  // PUBLIC
  async getProducts() {
    return await api.get("/telegram-buyer/products");
  },

  async getBalance() {
    return await api.get("/telegram-buyer/balance");
  },

  async purchase(payload: { uid: string; quantity: number }) {
    return await api.post("/telegram-buyer/purchase", payload);
  },

  async createShopPayment(payload: { uid: string; quantity: number }) {
    return await api.post("/telegram-buyer/create-payment", payload);
  },

  async getOrderStatus(orderCode: string) {
    return await api.get(`/telegram-buyer/order-status/${orderCode}`);
  },

  async cancelOrder(orderCode: string) {
    return await api.post(`/telegram-buyer/cancel-order/${orderCode}`);
  },

  async getMyShopOrders() {
    return await api.get("/telegram-buyer/my-orders");
  },

  // ADMIN
  async adminGetShopOrders(params?: { status?: string; search?: string; page?: number; limit?: number }) {
    return await api.get("/telegram-buyer/admin/orders", { params });
  },

  async adminGetProducts() {
    return await api.get("/telegram-buyer/admin/products");
  },

  async adminUpdateProduct(payload: {
    uid: string;
    shopId: string;
    product_name: string;
    originalPrice: number;
    markup: number | null;
    isVisible: boolean;
  }) {
    return await api.put("/telegram-buyer/admin/product", payload);
  },
};
