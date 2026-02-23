<script setup lang="ts">
import { appService } from "~/services/app";

import AccountData from "~/components/admin/AccountData.vue";

const { t } = useI18n();

const { onGetterUserData, onActionGetUserData } = useAppStore();

const loading = ref<boolean>(false);

useSeo({
  title: t("Cài đặt"),
  description:
    "Nền tảng AI giúp bạn tạo video chuyên nghiệp chỉ trong vài phút",
  image: "/images/page-setting.png",
});

definePageMeta({ middleware: "auth" });
</script>

<template>
  <div v-if="onGetterUserData?._id">
    <h3 class="font-bold mb-4">{{ $t("Tài nguyên") }}</h3>

    <AccountData :accountId="onGetterUserData?._id" />
  </div>
</template>
