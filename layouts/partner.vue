<script setup lang="ts">
import AppSystem from "~/components/layouts/AppSystem.vue";

useSeo({
  title: "Cộng tác viên",
  description: "Cổng thông tin cộng tác viên TN Solve",
  image: "/images/page-home.png",
});

useHead({ meta: [{ name: "robots", content: "noindex, nofollow" }] });
</script>

<template>
  <AppSystem />
</template>
