import { defineStore } from "pinia";
import { appService } from "~/services/app";

export const useAppStore = defineStore("app", () => {
  const loading = ref<boolean>(false);
  const systemPopup = ref<any>({
    type: "",
    content: "",
    display: false,
  });
  const displayLogin = ref<boolean>(false);
  const userData = ref<any>(undefined);

  const onGetterLoading = computed(() => loading);
  const onGetterSystemPopup = computed(() => systemPopup);
  const onGetterDisplayLogin = computed(() => displayLogin);
  const onGetterUserData = computed(() => userData);

  const onActionSetSystemPopup = (payload: any) => {
    systemPopup.value = {
      ...systemPopup.value,
      ...payload,
      display: payload.display ?? true,
    };
  };

  const onActionGetUserData = async (params?: any) => {
    try {
      const res = await appService.getUserData(params);
      userData.value = res.data;
      return res;
    } catch (error) {
      userData.value = {};
      throw error;
    }
  };

  return {
    onGetterLoading,
    onGetterSystemPopup,
    onGetterDisplayLogin,
    onGetterUserData,

    onActionSetSystemPopup,
    onActionGetUserData,
  };
});
