import api from "./axios";
import FormData from "form-data";

export const productService = {
  async getAllProductPublic(params: any) {
    return await api.get("/products/video-public", { params });
  },

  async getAllProductClient(payload: any) {
    return await api.post(`/products/product-list`, payload);
  },

  async getAllProduct(params: any) {
    return await api.get(`/products`, { params });
  },

  async saveProduct(payload: any) {
    const formData = new FormData();
    if (payload._id) formData.append("_id", payload._id);
    formData.append("title", payload.title);
    formData.append("value", payload.value);
    formData.append("frameRate", payload.frameRate);
    formData.append("modelVideo", payload.modelVideo);
    formData.append("videoMode", payload.videoMode);
    formData.append("videoStyle", payload.videoStyle);
    formData.append("videoDuration", payload.videoDuration);
    if (payload.images && Array.isArray(payload.images)) {
      payload.images.forEach((image: any) => {
        formData.append("images", image);
      });
    }
    if (payload.client) formData.append("client", true);

    return await api.post(`/products/video-automation`, formData);
  },

  // silent: dùng cho polling nền ([id].vue) — 1 lần lỗi mạng/timeout thoáng
  // qua giữa các lượt poll không nên bật popup lỗi toàn cục (services/axios.ts),
  // vì poll tự thử lại ở lượt kế tiếp, không cần làm phiền người dùng.
  // Đánh dấu bằng QUERY PARAM chứ không phải header tuỳ ý — thêm header lạ
  // (X-Silent-Error) khiến trình duyệt bắt buộc gửi CORS preflight (OPTIONS)
  // trước, mà server chỉ khai allowedHeaders cố định (server.ts) không có
  // header này nên preflight bị chặn, mọi request kèm header đó fail thẳng
  // (CORS error) — không phải lỗi thoáng qua nữa mà lỗi 100% mọi lần. Query
  // param không kích hoạt preflight, an toàn hơn nhiều cho mục đích này.
  async getDetailProduct(params: any, silent = false) {
    return await api.get(`/products/detail`, {
      params: { ...params, ...(silent && { silentError: 1 }) },
    });
  },

  async actionProduct(payload: any) {
    return await api.put(`/products/action`, {
      ids: payload.ids,
      action: payload.action,
    });
  },

  async deleteVideoProcess(payload: any) {
    return await api.put(`/products/delete-video-process`, payload);
  },

  async getProductMyLibrary(params: any) {
    return await api.get(`/products/my-library`, { params });
  },

  async likeProductVideo(payload: any) {
    return await api.put(`/products/like-action`, payload);
  },
};
