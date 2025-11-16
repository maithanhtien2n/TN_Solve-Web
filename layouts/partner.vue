<script setup lang="ts">
import AppSystem from "~/components/layouts/AppSystem.vue";

const { t } = useI18n();

useSeo({
  title: t("Cộng tác viên"),
  description:
    "Nền tảng AI giúp bạn tạo video chuyên nghiệp chỉ trong vài phút",
  image: "/images/page-home.png",
});
</script>

<template>
  <AppSystem />
</template>
