<script setup lang="ts">
import type Plyr from "plyr";

const route = useRoute();

const props = defineProps({
  frameRate: {
    type: String,
    default: "horizontal",
  },
  src: {
    type: String,
    required: true,
  },
  removeControls: {
    type: Array,
    default: () => ["settings"],
  },
  poster: {
    type: String,
    default: "",
  },
});

const loading = ref<boolean>(true);
const videoPlayerRef = ref<HTMLVideoElement | null>(null);

// ✅ ĐÚNG: Định nghĩa options ở đây
const customPlayerOptions = {
  //   autopause: true,
  //   autoplay: false,
  controls: [
    "play-large",
    "play",
    "progress",
    "current-time",
    "mute",
    "volume",
    "settings",
    "fullscreen",
  ].filter((item) => !props.removeControls.includes(item)),
  i18n: {
    restart: "Chạy lại",
    rewind: "Tua lại {seektime}s",
    play: "Phát",
    pause: "Tạm dừng",
    fastForward: "Tua nhanh {seektime}s",
    seek: "Tua",
    seekLabel: "{currentTime} trong tổng {duration}",
    played: "Đã xem",
    buffered: "Đã tải",
    currentTime: "Thời gian hiện tại",
    duration: "Tổng thời lượng",
    volume: "Âm lượng",
    mute: "Tắt tiếng",
    unmute: "Bật tiếng",
    enableCaptions: "Bật phụ đề",
    disableCaptions: "Tắt phụ đề",
    download: "Tải xuống",
    enterFullscreen: "Toàn màn hình",
    exitFullscreen: "Thoát toàn màn hình",
    settings: "Cài đặt",
    menuBack: "Quay lại menu trước",
    speed: "Tốc độ",
    normal: "Bình thường",
    quality: "Chất lượng",
    captions: "Phụ đề",
    enabled: "Bật",
    disabled: "Tắt",
    advertisement: "Quảng cáo",
    auto: "Tự động",
    default: "Mặc định",
    loop: "Lặp lại",
  },
};

// Biến lưu trữ đối tượng player
let player: Plyr | null = null;

onMounted(async () => {
  const PlyrModule = await import("plyr");
  const Plyr = PlyrModule.default;

  if (videoPlayerRef.value) {
    // ✅ ĐÚNG: Truyền 'customPlayerOptions' vào lúc khởi tạo Plyr
    player = new Plyr(videoPlayerRef.value, customPlayerOptions);

    player.source = {
      type: "video",
      sources: [
        {
          src: props.src,
          type: "video/mp4",
        },
      ],
      poster: props.poster,
    };
  }

  setTimeout(() => {
    loading.value = false;
  }, 200);
});

onBeforeUnmount(() => {
  player?.destroy();
  player = null;
});
</script>

<template>
  <div
    class="video-wrapper"
    :style="{ 'padding-top': frameRate === 'vertical' ? '177.78%' : '56.25%' }"
  >
    <div class="video-content">
      <v-skeleton-loader v-if="loading" style="width: 100%; height: 100%" />

      <div :style="{ opacity: loading ? 0 : 1 }">
        <video
          ref="videoPlayerRef"
          playsinline
          controls
          :key="route.fullPath"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.video-wrapper {
  position: relative;
  width: 100%;
  height: 0;
  overflow: hidden;
}

.video-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
