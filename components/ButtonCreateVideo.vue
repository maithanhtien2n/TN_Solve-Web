<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";

const router = useRouter();

const handleClick = async () => {
  router.push("/thu-vien-cua-toi/tao-moi");
};

// sentinelRef nằm ĐÚNG vị trí tự nhiên của nút trong luồng nội dung (ngay sau
// danh sách video, trước AppFooter) — không bị ảnh hưởng bởi việc nút đang
// fixed hay không. Khi sentinel lọt vào viewport (cuộn tới gần cuối trang),
// chuyển nút từ "fixed" (nổi khi cuộn) sang nằm tại chỗ, để không đè footer.
const sentinelRef = ref<HTMLElement | null>(null);
const isNearEnd = ref(false);

useIntersectionObserver(
  sentinelRef,
  ([{ isIntersecting }]) => {
    isNearEnd.value = isIntersecting;
  },
  { rootMargin: "100px" }
);
</script>

<template>
  <ClientOnly>
    <div ref="sentinelRef" />
    <div
      class="d-flex justify-center"
      :style="
        isNearEnd
          ? 'position: static; width: 100%; z-index: 99;'
          : 'position: fixed; bottom: 2rem; left: 0; width: 100%; z-index: 99; pointer-events: none;'
      "
    >
      <div class="cta-button" style="border-radius: 6px; pointer-events: all" @click="handleClick">
        <v-icon size="27">mdi-image-filter-tilt-shift</v-icon>
        <h3>Tạo video</h3>
      </div>
    </div>
  </ClientOnly>
</template>
