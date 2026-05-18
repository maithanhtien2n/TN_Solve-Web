<script setup lang="ts">
import AppSystem from "~/components/layouts/AppSystem.vue";

useSeo({
  title: "Trang quản trị",
  description: "Trang quản trị TN Solve",
  image: "/images/page-home.png",
});

useHead({ meta: [{ name: "robots", content: "noindex, nofollow" }] });
</script>

<template>
  <AppSystem />
</template>
