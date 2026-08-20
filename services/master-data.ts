import api from "./axios";
import FormData from "form-data";

export const masterDataService = {
  async getAllMasterDataClient(params: any) {
    return await api.get(`/master-data/${params.type}`, { params });
  },

  async getMyPartnerByMonth(params: any) {
    return await api.get(`/master-data/my-partner-by-month`, { params });
  },

  async getVideoTutorial() {
    return await api.get(`/master-data/video-tutorial`);
  },

  async getZaloGroupLink() {
    return await api.get(`/master-data/zalo-group-link`);
  },

  async getTutorialVideos(params?: { page?: number; limit?: number }) {
    return await api.get(`/master-data/tutorial-videos`, { params });
  },

  async getContactInfo() {
    return await api.get(`/master-data/contact-info`);
  },

  async getTutorialVideosAdmin(params?: {
    search?: string;
    page?: number;
    limit?: number;
  }) {
    return await api.get(`/master-data/tutorial-videos/admin`, { params });
  },

  async createTutorialVideo(payload: { title: string; value: string }) {
    return await api.post(`/master-data/tutorial-videos/admin`, payload);
  },

  async updateTutorialVideo(payload: {
    _id: string;
    title?: string;
    value?: string;
    status?: string;
  }) {
    return await api.put(`/master-data/tutorial-videos/admin`, payload);
  },

  async deleteTutorialVideo(payload: { _id: string }) {
    return await api.delete(`/master-data/tutorial-videos/admin`, {
      data: payload,
    });
  },

  async getContactInfoAdmin(params?: {
    search?: string;
    page?: number;
    limit?: number;
  }) {
    return await api.get(`/master-data/contact-info/admin`, { params });
  },

  async createContactInfo(payload: { title: string; value: string }) {
    return await api.post(`/master-data/contact-info/admin`, payload);
  },

  async updateContactInfo(payload: {
    _id: string;
    title?: string;
    value?: string;
    status?: string;
  }) {
    return await api.put(`/master-data/contact-info/admin`, payload);
  },

  async deleteContactInfo(payload: { _id: string }) {
    return await api.delete(`/master-data/contact-info/admin`, {
      data: payload,
    });
  },

  async getOtherProducts() {
    return await api.get(`/master-data/other-products`);
  },

  async getOtherProductsAdmin(params?: {
    search?: string;
    page?: number;
    limit?: number;
  }) {
    return await api.get(`/master-data/other-products/admin`, { params });
  },

  async createOtherProduct(payload: { title: string; value: string }) {
    return await api.post(`/master-data/other-products/admin`, payload);
  },

  async updateOtherProduct(payload: {
    _id: string;
    title?: string;
    value?: string;
    status?: string;
  }) {
    return await api.put(`/master-data/other-products/admin`, payload);
  },

  async deleteOtherProduct(payload: { _id: string }) {
    return await api.delete(`/master-data/other-products/admin`, {
      data: payload,
    });
  },

  async getAllMasterData(params: any) {
    if (params.isMyAccount) {
      return await api.get(`/common/get-account-info`, { params });
    } else {
      return await api.get(`/master-data/admin/${params.type}`, { params });
    }
  },

  async getMasterDataChild(params: any) {
    return await api.get(`/master-data/admin/${params.type}/child`, { params });
  },

  async saveMasterData(payload: any) {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("value", payload.value || "");
    formData.append("note", payload.note || "");
    if (payload._id) formData.append("_id", payload._id);
    if (payload.status) formData.append("status", payload.status);
    if (payload.image && typeof payload.image == "object") {
      formData.append("image", payload.image);
    }

    if (payload._id) {
      return await api.put(`/master-data/admin/${payload.type}`, formData);
    } else {
      return await api.post(`/master-data/admin/${payload.type}`, formData);
    }
  },

  async actionMasterData(payload: any) {
    return await api.put(
      `/master-data/admin/${payload.type}/${payload.action}`,
      { ids: payload.ids }
    );
  },

  async getVideoFlow() {
    return await api.get(`/common//video/flow`);
  },

  async updateAccountInfo(payload: any) {
    if (payload.isMyAccount) {
      return await api.post(`/common/save-account-info`, {
        accountInfo: payload.accountInfo,
      });
    } else {
      delete payload.isMyAccount;
      return await api.post(`/common/update-account-info`, payload);
    }
  },

  async getSettingGeneral(params: any) {
    return await api.get(`/common/setting-general`, { params });
  },

  async settingAction(payload: any) {
    return await api.put(`/common/setting-action`, payload);
  },

  async settingFileAction(payload: { _id: string; file: File }) {
    const formData = new FormData();
    formData.append("_id", payload._id);
    formData.append("file", payload.file);
    return await api.put(`/common/setting-file-action`, formData);
  },

  async deleteSettingFile(payload: { _id: string }) {
    return await api.delete(`/common/setting-file-action`, { data: payload });
  },
};
