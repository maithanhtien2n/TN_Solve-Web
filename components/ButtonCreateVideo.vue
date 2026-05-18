<script setup lang="ts">
const router = useRouter();

const handleClick = async () => {
  router.push("/video/create");
};
// ----------------
</script>

<template>
  <ClientOnly>
    <div class="d-flex justify-center" style="position: fixed; bottom: 2rem; left: 0; width: 100%; z-index: 99; pointer-events: none">
      <div class="cta-button" style="border-radius: 6px; pointer-events: all" @click="handleClick">
        <v-icon size="27">mdi-image-filter-tilt-shift</v-icon>
        <h3>Tạo video</h3>
      </div>
    </div>
  </ClientOnly>
</template>
