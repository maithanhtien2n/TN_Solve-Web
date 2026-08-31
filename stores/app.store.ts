import { defineStore } from "pinia";
import { appService } from "~/services/app";

export const useAppStore = defineStore("app", () => {
  const loading = ref<boolean>(false);
  const systemPopup = ref<any>({
    type: "",
    content: "",
    display: false,
  });
  const displayPopupBuyCredit = ref<boolean>(false);
  const displayLogin = ref<boolean>(false);
  const userData = ref<any>(undefined);
  // [2026-08-31] Trạng thái mở/đóng sidebar điều hướng mobile (AppHeader.vue)
  // — đặt ở store CHUNG (không phải state riêng trong AppHeader) để
  // WebsiteChatWidget.vue (component KHÁC, không liên quan gì tới header) có
  // thể tự ẩn nút chat nổi khi sidebar đang mở, tránh nút chat đè lên trên
  // lớp phủ mờ của sidebar (đã thử chỉnh z-index qua prop của Vuetify nhưng
  // không ăn thua, chuyển sang cách chắc chắn hơn: ẩn hẳn nút đi).
  const mobileNavOpen = ref<boolean>(false);

  const hasPlayed = ref<boolean>(false);

  const onGetterDisplayPopupBuyCredit = computed(() => displayPopupBuyCredit);
  const onGetterLoading = computed(() => loading);
  const onGetterSystemPopup = computed(() => systemPopup);
  const onGetterDisplayLogin = computed(() => displayLogin);
  const onGetterUserData = computed(() => userData);
  const onGetterMobileNavOpen = computed(() => mobileNavOpen);

  const onGetterHasPlayed = computed(() => hasPlayed);

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
    onGetterDisplayPopupBuyCredit,
    onGetterLoading,
    onGetterSystemPopup,
    onGetterDisplayLogin,
    onGetterUserData,
    onGetterMobileNavOpen,

    onGetterHasPlayed,

    onActionSetSystemPopup,
    onActionGetUserData,
  };
});
