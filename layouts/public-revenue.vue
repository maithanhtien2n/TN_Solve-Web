<script setup lang="ts">
useSeo({
  title: "Doanh thu",
  description: "Trang xem doanh thu",
});

useHead({ meta: [{ name: "robots", content: "noindex, nofollow" }] });
</script>

<template>
  <v-app>
    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>
