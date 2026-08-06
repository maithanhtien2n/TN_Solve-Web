<script setup lang="ts">
import { masterDataService } from "~/services/app";
import { useIntersectionObserver } from "@vueuse/core";

const params = reactive<any>({ page: 1, limit: 12 });
const videos = ref<{ _id: string; title: string; youtubeId: string }[]>([]);
const totalDocs = ref(0);
const loading = ref<string>("list");
const loadMore = ref<any>(null);

const playingId = ref<string | null>(null);
const onClickVideo = (id: string) => {
  playingId.value = id;
};

const onGetVideos = async (loadingType: string = "") => {
  loading.value = loadingType;
  try {
    const res = await masterDataService.getTutorialVideos(params);
    totalDocs.value = res.data?.totalDocs || 0;
    if (params.page === 1) {
      videos.value = res.data?.docs || [];
    } else {
      videos.value = [...videos.value, ...(res.data?.docs || [])];
    }
  } catch (_) {
  } finally {
    loading.value = "";
  }
};

onMounted(async () => {
  await onGetVideos("list");
});

onMounted(() => {
  useIntersectionObserver(
    loadMore,
    async ([{ isIntersecting }]) => {
      if (isIntersecting) {
        if (videos.value.length < totalDocs.value) {
          params.page++;
          onGetVideos();
        }
      }
    },
    { threshold: 1.0 }
  );
});

useSeo({
  title: "Video hướng dẫn",
  description:
    "Tổng hợp video hướng dẫn sử dụng TN Solve — cách viết prompt, mẹo tạo video AI, đăng ký gói không giới hạn và nhiều mẹo hữu ích khác.",
  image: "/images/page-home.png",
  keywords: "video hướng dẫn TN Solve, hướng dẫn sử dụng, mẹo tạo video AI",
});
</script>

<template>
  <!-- Hero -->
  <div class="page-hero">
    <div class="hero-blob" />
    <div class="hero-blob2" />
    <div class="hero-inner">
      <div class="hero-left">
        <div class="hero-badge">
          <v-icon size="13" color="rgba(255,255,255,0.85)">mdi-youtube</v-icon>
          Video hướng dẫn
        </div>
        <h1 class="hero-title">Học cách dùng TN Solve nhanh nhất</h1>
        <div class="hero-check">
          <v-icon size="14" color="rgba(255,255,255,0.9)">mdi-check-circle</v-icon>
          Toàn bộ video hướng dẫn, mẹo và thủ thuật để tạo video AI hiệu quả hơn
        </div>
      </div>
      <div class="hero-stats">
        <div class="hero-stat">
          <span class="hero-stat-num">{{ totalDocs }}</span>
          <span class="hero-stat-label">video hướng dẫn</span>
        </div>
        <div class="hero-stat-sep" />
        <div class="hero-stat">
          <span class="hero-stat-num">Dễ hiểu</span>
          <span class="hero-stat-label">từng bước chi tiết</span>
        </div>
        <div class="hero-stat-sep" />
        <div class="hero-stat">
          <span class="hero-stat-num">Miễn phí</span>
          <span class="hero-stat-label">xem & học tập</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Skeleton loading -->
  <div v-if="loading === 'list'" class="huongdan-grid">
    <div v-for="i in 6" :key="i" class="huongdan-card-skeleton">
      <v-skeleton-loader type="text" width="80%" class="mb-2" />
      <v-skeleton-loader type="image" class="thumb-skeleton" />
    </div>
  </div>

  <!-- Grid -->
  <div v-else-if="videos.length">
    <div class="huongdan-grid">
      <div v-for="video in videos" :key="video._id" class="huongdan-card">
        <div class="huongdan-title">{{ video.title }}</div>

        <div
          v-if="playingId !== video._id"
          class="huongdan-thumb-wrap"
          @click="onClickVideo(video._id)"
        >
          <img
            :src="`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`"
            :alt="video.title"
            class="huongdan-thumb"
          />
          <div class="huongdan-play">
            <div class="huongdan-play-circle">
              <v-icon size="26" color="white">mdi-play</v-icon>
            </div>
          </div>
        </div>
        <div v-else class="huongdan-thumb-wrap">
          <iframe
            :src="`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`"
            class="huongdan-iframe"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          />
        </div>
      </div>
    </div>

    <!-- Load more trigger -->
    <div ref="loadMore" class="d-flex justify-center py-4">
      <v-progress-circular
        v-if="loading === ''"
        width="2"
        size="28"
        color="primary"
        indeterminate
        style="opacity: 0"
      />
    </div>
  </div>

  <!-- Empty state -->
  <div v-else class="empty-state">
    <div class="empty-icon">
      <v-icon size="40" color="white">mdi-youtube</v-icon>
    </div>
    <div class="empty-body">
      <h3 class="empty-title">Chưa có video hướng dẫn nào</h3>
      <p class="empty-desc">Video hướng dẫn sẽ được cập nhật sớm.</p>
    </div>
  </div>
</template>

<style scoped>
/* ─── Hero (đồng bộ với trang Cộng đồng) ─────────────── */
.page-hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1a237e 0%, #283593 40%, #1565c0 80%, #1e88e5 100%);
  border-radius: 16px;
  padding: 28px 36px;
  margin-bottom: 24px;
  color: #fff;
}

.hero-blob {
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  top: -80px;
  right: -40px;
  pointer-events: none;
}

.hero-blob2 {
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.07) 0%, transparent 70%);
  bottom: -50px;
  left: 200px;
  pointer-events: none;
}

.hero-inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
}

.hero-left {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.95);
  text-transform: uppercase;
  width: fit-content;
}

.hero-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
  letter-spacing: -0.3px;
}

.hero-check {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.85);
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.hero-stat-num {
  font-size: 1.1rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
}

.hero-stat-label {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.75);
  white-space: nowrap;
}

.hero-stat-sep {
  width: 1px;
  height: 32px;
  background: rgba(255, 255, 255, 0.25);
}

/* ─── Grid ───────────────────────────────────────────── */
.huongdan-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.huongdan-card,
.huongdan-card-skeleton {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.huongdan-card-skeleton {
  padding: 16px;
}

.huongdan-title {
  padding: 16px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.3;
  min-height: calc(1.3em * 2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.huongdan-thumb-wrap {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  background: #000;
  cursor: pointer;
}

.huongdan-thumb,
.huongdan-iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.huongdan-thumb {
  object-fit: cover;
}

.huongdan-iframe {
  border: 0;
}

.huongdan-play {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.18);
  transition: background 0.2s ease;
}

.huongdan-play-circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.22);
  border: 1.5px solid rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(2px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease, background 0.2s ease;
}

.huongdan-card:hover .huongdan-play-circle {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.32);
}

.thumb-skeleton {
  aspect-ratio: 16 / 9;
  border-radius: 10px;
}

@media only screen and (max-width: 900px) {
  .huongdan-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media only screen and (max-width: 600px) {
  .huongdan-grid {
    grid-template-columns: 1fr;
  }
}

/* ─── Empty state ────────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  margin-bottom: 16px;
}

.empty-title {
  font-weight: 700;
  margin-bottom: 6px;
}

.empty-desc {
  color: #64748b;
  font-size: 0.9rem;
}
</style>
