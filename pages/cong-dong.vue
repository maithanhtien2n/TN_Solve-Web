<script setup lang="ts">
import { productService } from "~/services/product";
import { useIntersectionObserver } from "@vueuse/core";

const { isMobile } = useDevice();

const params = reactive<any>({
  search: "",
  page: 1,
  limit: 24,
});

const products = ref<any>({});
const loading = ref<string>("");
const loadMore = ref<any>(null);

const onGetProducts = async (loadingType: string = "") => {
  loading.value = loadingType;
  await productService
    .getAllProductPublic(params)
    .then((res) => {
      if (params.page === 1) {
        products.value = res.data;
      } else {
        products.value = {
          ...(products.value || {}),
          docs: [...(products.value?.docs || []), ...(res.data?.docs || [])],
        };
      }
    })
    .finally(() => {
      loading.value = "";
    });
};

const onCardMouseEnter = (event: MouseEvent) => {
  const card = event.currentTarget as HTMLElement;
  const videos = card.querySelectorAll("video") as NodeListOf<HTMLVideoElement>;
  videos.forEach((v) => v.play().catch(() => {}));
};

const onCardMouseLeave = (event: MouseEvent) => {
  const card = event.currentTarget as HTMLElement;
  const videos = card.querySelectorAll("video") as NodeListOf<HTMLVideoElement>;
  videos.forEach((v) => {
    v.pause();
    v.currentTime = 0;
  });
};

onMounted(async () => {
  await onGetProducts("list");
});

onMounted(() => {
  useIntersectionObserver(
    loadMore,
    async ([{ isIntersecting }]) => {
      if (isIntersecting) {
        if (products.value?.docs?.length < products.value?.totalDocs) {
          params.page++;
          onGetProducts();
        }
      }
    },
    { threshold: 1.0 }
  );
});

useSeo({
  title: "Thước phim cộng đồng",
  description:
    "Khám phá thư viện video AI cộng đồng TN Solve. Xem hàng ngàn video được tạo bằng AI Veo, Grok. Nguồn cảm hứng sáng tạo nội dung miễn phí.",
  image: "/images/page-video.png",
  keywords:
    "thước phim cộng đồng, video AI công khai, TN Solve video, xem video AI, mẫu video Veo Grok",
});
</script>

<template>
  <!-- Header -->
  <div class="page-header mb-6">
    <div class="page-title-row">
      <div class="page-icon">
        <v-icon size="28" color="#1e88e5">mdi-earth</v-icon>
      </div>
      <div>
        <h2 class="page-title">Thước phim cộng đồng</h2>
        <p class="page-desc">Các thước phim đã được chia sẻ từ cộng đồng để mọi người cùng xem và học tập.</p>
      </div>
    </div>
  </div>

  <!-- Skeleton loading -->
  <div v-if="Boolean(loading === 'list')" class="video-grid">
    <div v-for="i in 12" :key="i" class="video-card-skeleton">
      <v-skeleton-loader type="image" class="thumb-skeleton" />
      <div class="skeleton-info">
        <v-skeleton-loader type="text" width="80%" />
        <v-skeleton-loader type="text" width="50%" />
      </div>
    </div>
  </div>

  <!-- Grid -->
  <div v-else-if="Array.isArray(products.docs) && products.docs.length">
    <div class="video-grid">
      <router-link
        v-for="(item, index) in products.docs"
        :key="item._id"
        class="video-card"
        :to="`/thu-vien-cua-toi/${item._id}`"
        @mouseenter="onCardMouseEnter"
        @mouseleave="onCardMouseLeave"
      >
        <!-- Thumbnail -->
        <div class="thumb-area">
          <!-- Success: video -->
          <template v-if="item.state === 'success' && item.video">
            <video class="video-bg" preload="metadata" muted playsinline>
              <source :src="item.video" type="video/mp4" />
            </video>
            <video
              class="video-main"
              :style="item.frameRate === 'Khổ ngang (16:9)' ? { objectFit: 'cover' } : {}"
              preload="metadata"
              muted
              playsinline
            >
              <source :src="item.video" type="video/mp4" />
            </video>
          </template>

          <!-- Processing -->
          <div v-else-if="item.state === 'primary'" class="state-overlay state-processing">
            <div class="state-icon-wrap">
              <v-progress-circular color="white" width="2" size="28" indeterminate />
            </div>
            <span class="state-label">Đang xử lý</span>
          </div>

          <!-- Error -->
          <div v-else class="state-overlay state-error">
            <div class="state-icon-wrap">
              <v-icon color="white" size="28">mdi-alert-circle-outline</v-icon>
            </div>
            <span class="state-label">Lỗi xử lý</span>
          </div>

          <!-- Duration badge -->
          <span v-if="item.videoDuration" class="badge-duration">
            {{ item.videoDuration }}
          </span>

          <!-- Top rank badge -->
          <div
            v-if="[0, 1, 2].includes(index)"
            class="badge-rank"
            :class="`rank-${index + 1}`"
          >
            <v-icon v-if="index === 0" size="13">mdi-crown</v-icon>
            <v-icon v-else size="13">mdi-medal</v-icon>
            <span>{{ index + 1 }}</span>
          </div>
        </div>

        <!-- Info -->
        <div class="card-info">
          <p class="video-title">{{ item.title }}</p>

          <div class="video-meta">
            <span>{{ item?.account?.name }}</span>

            <template v-if="item.visibility === 'public'">
              <span class="dot">·</span>
              <span>{{ item?.viewsCount }} lượt xem</span>
              <span class="dot">·</span>
              <span>{{ timeAgoVi(item?.createdAt) }}</span>
            </template>
          </div>
        </div>
      </router-link>
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

  <!-- Empty -->
  <div v-else class="empty-state">
    <div class="empty-icon">
      <v-icon size="40" color="white">mdi-earth</v-icon>
    </div>
    <div class="empty-body">
      <h3 class="empty-title">Chưa có thước phim nào</h3>
      <p class="empty-desc">Cộng đồng chưa có video nào. Hãy là người đầu tiên chia sẻ tác phẩm của bạn!</p>
    </div>
    <button class="empty-cta" @click="$router.push('/thu-vien-cua-toi/tao-moi')">
      <v-icon size="17">mdi-image-filter-tilt-shift</v-icon>
      Tạo video ngay
    </button>
  </div>

  <ButtonCreateVideo style="margin-top: 2rem" />
</template>

<style scoped>
/* ─── Header ─────────────────────────────────────────── */
.page-header {
  padding: 18px 20px;
  margin-top: 23px;
  margin-bottom: 6px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #d0dae6;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.page-title-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.page-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 3px;
  letter-spacing: -0.2px;
}

.page-desc {
  font-size: 0.82rem;
  color: #6b7280;
  margin: 0;
}

/* ─── Grid ───────────────────────────────────────────── */
.video-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 900px) {
  .video-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
}

@media (max-width: 550px) {
  .video-grid { grid-template-columns: 1fr; gap: 12px; }
}

/* ─── Card ───────────────────────────────────────────── */
.video-card {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #f0f0f0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.video-card:hover {
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  border-color: #e0e0e0;
}

/* ─── Thumbnail ──────────────────────────────────────── */
.thumb-area {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  background: #0d0d0d;
  overflow: hidden;
}

.video-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(10px) brightness(0.7);
  transform: scale(1.15);
  z-index: 0;
}

.video-main {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 1;
}

.video-main::-webkit-media-controls,
.video-bg::-webkit-media-controls {
  display: none !important;
}

.video-main::-webkit-media-controls-start-playback-button,
.video-bg::-webkit-media-controls-start-playback-button {
  display: none !important;
  opacity: 0 !important;
}

/* ─── State overlays ─────────────────────────────────── */
.state-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.state-processing {
  background: linear-gradient(135deg, #0d1117, #1a2332);
}

.state-error {
  background: linear-gradient(135deg, #1a1a1a, #2d1515);
}

.state-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.state-label {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.7);
  letter-spacing: 0.3px;
}

/* ─── Badges ─────────────────────────────────────────── */
.badge-duration {
  position: absolute;
  bottom: 6px;
  right: 6px;
  z-index: 9;
  background: rgba(0,0,0,0.6);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 1px 6px;
  border-radius: 4px;
}

.badge-rank {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 9;
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 3px 8px 3px 6px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 12px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255,255,255,0.3);
}

.badge-rank span {
  line-height: 1;
}

.rank-1 {
  background: linear-gradient(135deg, #f59e0b, #fcd34d);
  color: #7c2d00;
  box-shadow: 0 2px 12px rgba(245,158,11,0.5);
}

.rank-2 {
  background: linear-gradient(135deg, #94a3b8, #e2e8f0);
  color: #334155;
  box-shadow: 0 2px 10px rgba(148,163,184,0.45);
}

.rank-3 {
  background: linear-gradient(135deg, #92400e, #d97706);
  color: #fef3c7;
  box-shadow: 0 2px 10px rgba(146,64,14,0.45);
}

/* ─── Card info ──────────────────────────────────────── */
.card-info {
  padding: 10px 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.video-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.45;
  color: #1a1a1a;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  transition: color 0.18s ease;
}

.video-card:hover .video-title {
  color: #1e88e5;
}

.video-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  font-size: 0.72rem;
  color: #9e9e9e;
}

.dot {
  color: #bdbdbd;
}

/* ─── Skeleton ───────────────────────────────────────── */
.video-card-skeleton {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
}

.thumb-skeleton {
  width: 100%;
  aspect-ratio: 16/9;
}

.skeleton-info {
  padding: 10px 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* ─── Empty ──────────────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 22rem;
  gap: 20px;
  border-radius: 20px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 1px solid #bbf7d0;
  padding: 3rem 2rem;
  text-align: center;
}

.empty-icon {
  width: 76px;
  height: 76px;
  border-radius: 20px;
  background: linear-gradient(135deg, #059669, #10b981);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(16,185,129,0.25);
}

.empty-body { display: flex; flex-direction: column; gap: 8px; }

.empty-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
}

.empty-desc {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
  max-width: 340px;
  line-height: 1.6;
}

.empty-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 24px;
  border-radius: 10px;
  background: linear-gradient(135deg, #059669, #10b981);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(16,185,129,0.35);
  transition: transform 0.15s, box-shadow 0.15s;
}

.empty-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16,185,129,0.45);
}
</style>
