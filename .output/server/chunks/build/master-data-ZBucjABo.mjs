import { defineStore } from 'pinia';
import { b as api, F as FormData } from './app.store-CsbFmGtW.mjs';
import { ref, computed } from 'vue';

const masterDataService = {
  async getAllMasterDataClient(params) {
    return await api.get(`/master-data/${params.type}`, { params });
  },
  async getAllMasterData(params) {
    return await api.get(`/master-data/admin/${params.type}`, { params });
  },
  async getMasterDataChild(params) {
    return await api.get(`/master-data/admin/${params.type}/child`, { params });
  },
  async saveMasterData(payload) {
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
  async actionMasterData(payload) {
    return await api.put(
      `/master-data/admin/${payload.type}/${payload.action}`,
      { ids: payload.ids }
    );
  }
};
const useMasterDataStore = defineStore("master-data", () => {
  const masterData = ref({});
  const onGetterMasterData = computed(() => masterData);
  const onActionAllMasterDataClient = async (params) => {
    const res = await masterDataService.getAllMasterDataClient(params);
    masterData.value[params.type] = res.data;
    return res;
  };
  return {
    onGetterMasterData,
    onActionAllMasterDataClient
  };
});

export { useMasterDataStore as u };
//# sourceMappingURL=master-data-ZBucjABo.mjs.map
