<script setup lang="ts">
import { appService } from "~/services/app";

import AccountData from "~/components/admin/AccountData.vue";

const { onGetterUserData, onActionGetUserData } = useAppStore();

const loading = ref<boolean>(false);

useSeo({
  title: "Cài đặt",
  description:
    "Cài đặt tài khoản TN Solve - Quản lý thông tin cá nhân, tùy chỉnh ưu tiên mô hình AI và tối ưu trải nghiệm tạo video của bạn.",
  image: "/images/page-setting.png",
  keywords:
    "cài đặt tài khoản, TN Solve settings, cấu hình video AI, quản lý tài khoản",
});

definePageMeta({ middleware: "auth" });
</script>

<template>
  <div v-if="onGetterUserData?._id">
    <h3 class="font-bold mb-4">Tài nguyên</h3>

    <AccountData :accountId="onGetterUserData?._id" />
  </div>
</template>
