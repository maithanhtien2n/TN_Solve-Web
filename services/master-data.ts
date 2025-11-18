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
    formData.append("name", payload.name);
    formData.append("note", payload.note || "");
    formData.append("content", payload.content || "");
    if (payload._id) formData.append("_id", payload._id);
    if (payload.status) formData.append("status", payload.status);
    if (payload.parentId) formData.append("parentId", payload.parentId);

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
};
