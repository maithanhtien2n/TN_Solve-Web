import { defineStore } from "pinia";
import { masterDataService } from "~/services/app";

export const useMasterDataStore = defineStore("master-data", () => {
  const masterData = ref<any>({});
  // Cờ loading RIÊNG theo từng `type` — để UI (VD dashboard CTV) có thể hiện
  // trạng thái đang tải khi đổi accountId, thay vì cứ đứng yên hiện dữ liệu
  // CŨ một lúc rồi mới nhảy sang dữ liệu mới trông giật cục.
  const masterDataLoading = ref<Record<string, boolean>>({});

  const onGetterMasterData = computed(() => masterData);
  const onGetterMasterDataLoading = computed(() => masterDataLoading);

  const onActionAllMasterDataClient = async (params: any) => {
    masterDataLoading.value[params.type] = true;
    try {
      const res = await masterDataService.getAllMasterDataClient(params);
      masterData.value[params.type] = res.data;
      return res;
    } finally {
      masterDataLoading.value[params.type] = false;
    }
  };

  return {
    onGetterMasterData,
    onGetterMasterDataLoading,

    onActionAllMasterDataClient,
  };
});
