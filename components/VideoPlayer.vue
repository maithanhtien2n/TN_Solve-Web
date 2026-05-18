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

const customPlayerOptions = {
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

let player: Plyr | null = null;

onMounted(async () => {
  const PlyrModule = await import("plyr");
  const Plyr = PlyrModule.default;

  if (videoPlayerRef.value) {
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
    :class="{
      portrait: frameRate === 'vertical',
    }"
    :style="{
      'padding-top': '56.25%',
      'background-image':
        frameRate === 'vertical' && poster ? `url(${poster})` : '',
    }"
  >
    <!-- Lớp nền blur (chỉ khi dọc + có poster) -->
    <div v-if="frameRate === 'vertical' && poster" class="bg-blur" />

    <div class="video-content">
      <v-skeleton-loader v-if="loading" style="width: 100%; height: 100%" />

      <div :style="{ opacity: loading ? 0 : 1, width: '100%', height: '100%' }">
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
  border-radius: 13px;
  background: #000;
  background-size: cover;
  background-position: center;
}

.bg-blur {
  position: absolute;
  inset: 0;
  background-image: inherit;
  background-size: cover;
  background-position: center;
  filter: blur(16px) brightness(0.75);
  transform: scale(1.15);
}

.video-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* ép Plyr full size */
.video-wrapper :deep(.plyr) {
  width: 100%;
  height: 100%;
}

.video-wrapper :deep(.plyr__video-wrapper) {
  width: 100%;
  height: 100%;
}

/* ép thẻ video luôn full khung */
.video-wrapper :deep(video) {
  width: 100% !important;
  height: 100% !important;
  display: block;
}

/* ngang = cover */
.video-wrapper:not(.portrait) :deep(video) {
  object-fit: cover !important;
}

/* dọc = contain để lộ nền blur */
.video-wrapper.portrait :deep(video) {
  object-fit: contain !important;
  background: transparent !important;
}

/* bỏ nền đen mặc định của plyr wrapper */
.video-wrapper :deep(.plyr__video-wrapper) {
  background: transparent !important;
}

/* nếu plyr có poster overlay thì cũng để transparent */
.video-wrapper :deep(.plyr__poster) {
  background-color: transparent !important;
}
</style>
