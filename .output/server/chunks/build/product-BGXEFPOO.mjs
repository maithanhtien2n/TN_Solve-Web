import { b as api, F as FormData } from './app.store-CsbFmGtW.mjs';

const productService = {
  async getAllProductClient(payload) {
    return await api.post(`/products/product-list`, payload);
  },
  async getAllProduct(params) {
    return await api.get(`/products`, { params });
  },
  async saveProduct(payload) {
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
      payload.images.forEach((image) => {
        formData.append("images", image);
      });
    }
    return await api.post(`/products/video-automation`, formData);
  },
  async getDetailProduct(params) {
    return await api.get(`/products/detail`, { params });
  },
  async actionProduct(payload) {
    return await api.put(`/products/action`, {
      ids: payload.ids,
      action: payload.action
    });
  },
  async getProductMyLibrary(params) {
    return await api.get(`/products/my-library`, { params });
  }
};

export { productService as p };
//# sourceMappingURL=product-BGXEFPOO.mjs.map
