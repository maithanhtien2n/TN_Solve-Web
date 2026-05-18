<script setup lang="ts">
const router = useRouter();

const handleClick = async () => {
  router.push("/video/create");
};
// ----------------
</script>

<template>
  <div class="sticky d-flex justify-center" style="bottom: 2rem; z-index: 9">
    <div class="cta-button" style="border-radius: 6px" @click="handleClick">
      <v-icon size="27">mdi-image-filter-tilt-shift</v-icon>
      <h3>Tạo video</h3>
    </div>
  </div>
</template>
