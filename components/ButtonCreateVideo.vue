<script setup lang="ts">
const router = useRouter();
const localePath = useLocalePath();

// ----------
// const { onGetterHasPlayed } = useAppStore();

const handleClick = async () => {
  // Âm thanh chúc tết chỉ phát lần đầu tiên người dùng nhấn vào nút tạo video
  // if (!onGetterHasPlayed.value) {
  //   onGetterHasPlayed.value = true;

  //   const audio = new Audio("/audio/intro.wav");

  //   try {
  //     await audio.play();
  //   } catch (e) {}
  // }

  router.push(localePath("/video/create"));
};
// ----------------
</script>

<template>
  <div class="sticky d-flex justify-center" style="bottom: 2rem; z-index: 9">
    <div class="cta-button" style="border-radius: 6px" @click="handleClick">
      <v-icon size="27">mdi-image-filter-tilt-shift</v-icon>
      <h3>{{ $t("Tạo video") }}</h3>
    </div>
  </div>
</template>
