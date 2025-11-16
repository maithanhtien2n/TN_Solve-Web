<script setup lang="ts">
const router = useRouter();
const localePath = useLocalePath();
</script>

<template>
  <div class="sticky d-flex justify-center" style="bottom: 2rem">
    <div
      class="cta-button"
      style="border-radius: 6px"
      @click="router.push(localePath('/video/create'))"
    >
      <v-icon size="27">mdi-image-filter-tilt-shift</v-icon>
      <h3>{{ $t("Tạo video") }}</h3>
    </div>
  </div>
</template>
