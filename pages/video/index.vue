<script setup lang="ts">
import { productService } from "~/services/product";
import { useIntersectionObserver } from "@vueuse/core";

const { onGetterUserData } = useAppStore();

const params = reactive<any>({
  search: "",
  page: 1,
  limit: 24,
});

const products = ref<any>({});
const loading = ref<string>("");
const loadMore = ref<any>(null);
const confirmDialogRef = ref<any>(null);

const onGetProducts = async (loadingType: string = "") => {
  loading.value = loadingType;
  await productService
    .getProductMyLibrary(params)
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

const onClickDotMenuItem = (type: string, data: any) => {
  if (type === "download-video") {
    downloadVideo(data.video, data.title);
    return;
  } else if (["public", "private"].includes(type) || type === "delete-video") {
    let message = "";

    if (type === "public") {
      message = "Bạn có chắc chắn muốn công khai video này không?";
    } else if (type === "private") {
      message = "Bạn có chắc chắn muốn riêng tư video này không?";
    } else if (type === "delete-video") {
      if (data.state === "primary") {
        message =
          "Xóa thước phim đang tạo sẽ tốn 10 tín dụng. Bạn có muốn tiếp tục?";
      } else {
        message = "Bạn có chắc chắn muốn xoá thước phim này không?";
      }
    }

    confirmDialogRef.value.show({
      message,
      noTransMsg: true,
      onConfirm: async () => {
        try {
          if (data.state === "primary") {
            await productService.deleteVideoProcess({ _id: data._id });
          } else {
            await productService.actionProduct({
              ids: [data._id],
              action: type === "delete-video" ? "delete" : type,
            });
          }

          params.page = 1;
          await onGetProducts();
        } catch (error: any) {
          console.error(error);
        }
      },
    });
    return;
  }
};

const onCardMouseEnter = (event: MouseEvent) => {
  const card = event.currentTarget as HTMLElement;
  const videos = card.querySelectorAll(
    "video"
  ) as NodeListOf<HTMLVideoElement>;
  videos.forEach((v) => v.play().catch(() => {}));
};

const onCardMouseLeave = (event: MouseEvent) => {
  const card = event.currentTarget as HTMLElement;
  const videos = card.querySelectorAll(
    "video"
  ) as NodeListOf<HTMLVideoElement>;
  videos.forEach((v) => {
    v.pause();
    v.currentTime = 0;
  });
};

onMounted(async () => {
  await onGetProducts("list");

  if (
    onGetterUserData.value?._id !== "68fdcb8002e4f0f894bc201e" &&
    onGetterUserData.value?.role &&
    (![EnumAccountRole.ADMIN, EnumAccountRole.PARTNER].includes(
      onGetterUserData.value?.role
    ) ||
      ["68f3433dac1378cfef58692e", "690639102a7022e6ec1e96f3"].includes(
        onGetterUserData.value?._id
      ))
  ) {
    useAppStore().onActionSetSystemPopup({
      type: "warning",
      content:
        "Thời gian lưu trữ cho video đã tạo là 24h.\nXin quý khách vui lòng tải xuống và lưu trữ để tránh mất mát dữ liệu.",
    });
  }
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
  title: "Thư viện của tôi",
  description:
    "Thư viện video AI của bạn trên TN Solve - Quản lý, xem lại và tải xuống các video đã tạo bằng Veo, Grok. Theo dõi tiến trình tạo video.",
  image: "/images/page-video.png",
  keywords:
    "thư viện video AI, video đã tạo, quản lý video TN Solve, tải video AI",
});

definePageMeta({ middleware: "auth" });
</script>

<template>
  <div>
    <ConfirmDialog ref="confirmDialogRef" />

    <!-- Skeleton loading -->
    <div v-if="loading === 'list'" class="video-grid">
      <div v-for="i in 12" :key="i" class="skeleton-card">
        <div class="skeleton-thumb">
          <v-skeleton-loader type="image" height="100%" />
        </div>
        <div class="pa-3 d-flex flex-column ga-2">
          <v-skeleton-loader type="text" />
          <v-skeleton-loader type="text" width="55%" />
        </div>
      </div>
    </div>

    <template v-else>
      <!-- Video grid -->
      <div
        v-if="Array.isArray(products.docs) && products.docs.length"
        class="video-grid"
      >
        <router-link
          v-for="(item, index) in products.docs"
          :key="index"
          class="video-card"
          :to="`/video/${item._id}`"
          @mouseenter="onCardMouseEnter"
          @mouseleave="onCardMouseLeave"
        >
          <!-- Thumbnail -->
          <div class="thumb-area">
            <!-- Success -->
            <template v-if="item.state === 'success' && item.video">
              <div class="video-wrapper">
                <video
                  class="video-bg"
                  :src="item.video"
                  preload="metadata"
                  muted
                  playsinline
                />
                <video
                  class="video-main"
                  :src="item.video"
                  preload="metadata"
                  muted
                  playsinline
                  :style="
                    item.frameRate === 'Khổ ngang (16:9)'
                      ? { objectFit: 'cover' }
                      : {}
                  "
                />
              </div>

              <span v-if="item.videoDuration" class="duration-badge">
                {{ item.videoDuration }}
              </span>
            </template>

            <!-- Processing -->
            <template v-else-if="item.state === 'primary'">
              <div class="processing-state">
                <v-progress-circular
                  indeterminate
                  color="rgba(255,255,255,0.85)"
                  size="38"
                  width="2"
                />
                <span class="processing-label">Đang xử lý</span>
                <span class="processing-hint">Video đang được tạo...</span>
              </div>
            </template>

            <!-- Error -->
            <template v-else>
              <div class="error-state">
                <div class="error-icon-wrap">
                  <v-icon size="28" color="white">mdi-alert-outline</v-icon>
                </div>
                <span class="error-label">Tạo video thất bại</span>
                <span class="error-hint">Nhấn vào để xem chi tiết</span>
              </div>
            </template>

            <!-- Visibility badge -->
            <div class="visibility-badge">
              <v-icon
                v-if="item.visibility === 'public'"
                size="13"
                color="white"
              >
                mdi-earth
              </v-icon>
              <v-icon v-else size="13" color="white">mdi-lock-outline</v-icon>
              <span>{{
                item.visibility === "public" ? "Công khai" : "Riêng tư"
              }}</span>
            </div>

            <!-- 3-dot menu -->
            <v-menu location="bottom end">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  class="menu-btn"
                  icon="mdi-dots-vertical"
                  size="30"
                  variant="text"
                  color="white"
                  @click.prevent.stop
                />
              </template>

              <v-card min-width="200">
                <v-list>
                  <v-list-item
                    v-for="(menu, mIdx) in [
                      {
                        title:
                          item.visibility === 'public'
                            ? 'Riêng tư'
                            : 'Công khai',
                        value:
                          item.visibility === 'public' ? 'private' : 'public',
                        icon:
                          item.visibility === 'public'
                            ? 'mdi-lock-outline'
                            : 'mdi-earth',
                      },
                      {
                        title: 'Tải video',
                        value: 'download-video',
                        icon: 'mdi-tray-arrow-down',
                      },
                      {
                        title: 'Xóa thước phim',
                        value: 'delete-video',
                        icon: 'mdi-delete-outline',
                      },
                    ]"
                    :key="mIdx"
                    :class="{
                      disabled:
                        ['download-video', 'public', 'private'].includes(
                          menu.value
                        ) && ['primary', 'error'].includes(item.state),
                    }"
                    @click="onClickDotMenuItem(menu.value, item)"
                  >
                    <div class="d-flex align-center ga-4">
                      <v-icon
                        :icon="menu.icon"
                        :color="`${menu.value === 'delete-video' ? 'red' : ''}`"
                      />
                      <label
                        class="cursor-pointer"
                        :class="{ 'text-red': menu.value === 'delete-video' }"
                      >
                        {{ menu.title }}
                      </label>
                    </div>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </div>

          <!-- Card info -->
          <div class="card-info">
            <p class="video-title">
              {{ item.title }}
            </p>

            <div class="video-meta">
              <span>{{ item.createdAt }}</span>

              <template v-if="item.visibility === 'public'">
                <span class="dot">·</span>
                <span>{{ item.viewsCount }} lượt xem</span>
                <span class="dot">·</span>
                <span>{{ item.likesCount }} thích</span>
              </template>
            </div>
          </div>
        </router-link>

        <div ref="loadMore" class="load-more-trigger" />
      </div>

      <!-- Empty state -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <v-icon size="40" color="white">mdi-movie-open-play-outline</v-icon>
        </div>
        <div class="empty-body">
          <h3 class="empty-title">Chưa có thước phim nào</h3>
          <p class="empty-desc">Tạo video AI đầu tiên của bạn chỉ trong vài phút.</p>
        </div>
        <button class="empty-cta" @click="$router.push('/video/create')">
          <v-icon size="17">mdi-image-filter-tilt-shift</v-icon>
          Tạo video ngay
        </button>
      </div>

      <!-- Create button at bottom -->
      <div
        v-if="Array.isArray(products.docs) && products.docs.length"
        class="mt-8"
      >
        <ButtonCreateVideo />
      </div>
    </template>
  </div>
</template>

<style scoped>
/* ─── Grid ─────────────────────────────────────────── */
.video-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 1100px) {
  .video-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 840px) {
  .video-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .video-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}

/* ─── Skeleton card ─────────────────────────────────── */
.skeleton-card {
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
}

.skeleton-thumb {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

/* ─── Video card ────────────────────────────────────── */
.video-card {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  color: inherit;
  text-decoration: none;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07), 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.22s ease, transform 0.22s ease;
  cursor: pointer;
}

.video-card:hover {
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12), 0 3px 10px rgba(0, 0, 0, 0.08);
}

/* ─── Thumbnail ─────────────────────────────────────── */
.thumb-area {
  position: relative;
  aspect-ratio: 16 / 9;
  background: #111;
  overflow: hidden;
  flex-shrink: 0;
}

.video-wrapper {
  position: absolute;
  inset: 0;
}

.video-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(14px) brightness(0.55);
  transform: scale(1.18);
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

/* ─── Play overlay ──────────────────────────────────── */
.play-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.1);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.video-card:hover .play-overlay {
  opacity: 1;
}

.play-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, background 0.2s ease;
}

.video-card:hover .play-btn {
  transform: scale(1.12);
  background: rgba(0, 0, 0, 0.72);
}

/* ─── Duration badge ────────────────────────────────── */
.duration-badge {
  position: absolute;
  right: 7px;
  bottom: 7px;
  z-index: 3;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.72);
  border-radius: 4px;
  padding: 1px 6px;
  letter-spacing: 0.2px;
}

/* ─── Visibility badge ──────────────────────────────── */
.visibility-badge {
  position: absolute;
  left: 7px;
  top: 7px;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 3px;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 500;
  background: rgba(0, 0, 0, 0.52);
  backdrop-filter: blur(4px);
  border-radius: 20px;
  padding: 2px 7px 2px 5px;
}

/* ─── 3-dot menu button ─────────────────────────────── */
.menu-btn {
  position: absolute !important;
  right: 6px;
  top: 6px;
  z-index: 4;
  opacity: 0;
  transition: opacity 0.18s ease;
  background: rgba(0, 0, 0, 0.5) !important;
  backdrop-filter: blur(4px);
  width: 30px !important;
  height: 30px !important;
  min-width: 30px !important;
  border-radius: 50% !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.video-card:hover .menu-btn {
  opacity: 1;
}

/* ─── Processing state ──────────────────────────────── */
.processing-state {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #0d1117 0%, #1a2332 100%);
}

.processing-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.2px;
  margin-top: 2px;
}

.processing-hint {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.35);
}

.error-state {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d1515 100%);
}

.error-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(229, 57, 53, 0.25);
  border: 2px solid rgba(229, 57, 53, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2px;
}

.error-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #ff7070;
  letter-spacing: 0.2px;
}

.error-hint {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.4);
}

/* ─── Card info ─────────────────────────────────────── */
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

/* ─── Load more trigger ─────────────────────────────── */
.load-more-trigger {
  grid-column: 1 / -1;
}

/* ─── Empty state ───────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 22rem;
  gap: 20px;
  border-radius: 20px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e8f4fd 100%);
  border: 1px solid #dbeafe;
  padding: 3rem 2rem;
  text-align: center;
}

.empty-icon {
  width: 76px;
  height: 76px;
  border-radius: 20px;
  background: linear-gradient(135deg, #1e88e5, #42a5f5);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(30,136,229,0.25);
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
  background: linear-gradient(135deg, #1565c0, #1e88e5);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(30,136,229,0.35);
  transition: transform 0.15s, box-shadow 0.15s;
}

.empty-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(30,136,229,0.45);
}
</style>
