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

  async getDetailProduct(params: any) {
    return await api.get(`/products/detail`, { params });
  },

  async actionProduct(payload: any) {
    return await api.put(`/products/action`, {
      ids: payload.ids,
      action: payload.action,
    });
  },

  async getProductMyLibrary(params: any) {
    return await api.get(`/products/my-library`, { params });
  },
};
