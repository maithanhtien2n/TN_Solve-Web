import { defineStore } from "pinia";
import { masterDataService } from "~/services/app";

export const useMasterDataStore = defineStore("master-data", () => {
  const masterData = ref<any>({});

  const onGetterMasterData = computed(() => masterData);

  const onActionAllMasterDataClient = async (params: any) => {
    const res = await masterDataService.getAllMasterDataClient(params);
    masterData.value[params.type] = res.data;
    return res;
  };

  return {
    onGetterMasterData,

    onActionAllMasterDataClient,
  };
});
