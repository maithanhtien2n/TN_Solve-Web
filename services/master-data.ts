import api from "./axios";
import FormData from "form-data";

export const masterDataService = {
  async getAllMasterDataClient(params: any) {
    return await api.get(`/master-data/${params.type}`, { params });
  },

  async getAllMasterData(params: any) {
    return await api.get(`/master-data/admin/${params.type}`, { params });
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
    return await api.post(`/common/update-account-info`, payload);
  },

  async getSettingGeneral(params: any) {
    return await api.get(`/common/setting-general`, { params });
  },

  async settingAction(payload: any) {
    return await api.put(`/common/setting-action`, payload);
  },
};
