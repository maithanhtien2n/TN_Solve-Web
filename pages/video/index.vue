<script setup lang="ts">
import { productService } from "~/services/product";
import { useIntersectionObserver } from "@vueuse/core";

const { t } = useI18n();
const { width, isMobile } = useDevice();

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
      message = t("Bạn có chắc chắn muốn công khai video này không?");
    } else if (type === "private") {
      message = t("Bạn có chắc chắn muốn riêng tư video này không?");
    } else if (type === "delete-video") {
      if (data.state === "primary") {
        message = t(
          "Xóa thước phim đang tạo sẽ tốn 10 tín dụng. Bạn có muốn tiếp tục?"
        );
      } else {
        message = t("Bạn có chắc chắn muốn xoá thước phim này không?");
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
  title: t("Thư viện của tôi"),
  description:
    "Nền tảng AI giúp bạn tạo video chuyên nghiệp chỉ trong vài phút",
  image: "/images/page-video.png",
});

definePageMeta({ middleware: "auth" });
</script>

<template>
  <div
    v-if="Boolean(loading === 'list')"
    class="d-flex justify-center flex-column align-center ga-3 pt-10 pb-16"
  >
    <v-progress-circular width="2" size="40" color="primary" indeterminate />
    {{ $t("Đang tải dữ liệu...") }}
  </div>

  <div v-else>
    <ConfirmDialog ref="confirmDialogRef" />

    <v-row
      v-if="Array.isArray(products.docs) && products.docs.length"
      :dense="isMobile"
    >
      <v-col
        v-for="(item, index) in products.docs"
        :key="index"
        lg="4"
        md="6"
        sm="12"
        cols="12"
      >
        <router-link
          class="d-flex cursor-pointer un-select video-card"
          style="
            border-radius: 6px;
            box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
          "
          :to="`/video/${item._id}`"
        >
          <div
            v-if="item.state === 'success' && item.video"
            class="relative d-flex"
          >
            <!-- KHỔ DỌC -->
            <div
              class="video-wrapper cursor-pointer"
              :style="{
                width: width > 650 ? '160px' : '140px',
                height: width > 650 ? '101.25px' : '90px',
              }"
            >
              <!-- Video nền mờ -->
              <video class="video-bg" preload="metadata" muted playsinline>
                <source :src="item.video" type="video/mp4" />
              </video>

              <!-- Video chính -->
              <video
                :style="
                  item.frameRate === 'Khổ ngang (16:9)'
                    ? { 'object-fit': 'cover' }
                    : {}
                "
                class="video-main"
                preload="metadata"
                muted
                playsinline
              >
                <source :src="item.video" type="video/mp4" />
              </video>
            </div>

            <!-- KHỔ NGANG -->
            <!-- <video
              class="cursor-pointer bg-black"
              style="border-radius: 6px 0 0 6px"
              :key="item.video"
              :width="width > 650 ? 160 : 140"
              :height="width > 650 ? 101.25 : 90"
              preload="metadata"
              muted
              playsinline
              :style="{ objectFit: 'cover' }"
            >
              <source :src="item.video" type="video/mp4" />
            </video> -->

            <span class="video-duration">
              {{ item.videoDuration }}
            </span>
          </div>

          <div v-else-if="item.state === 'primary'" class="relative">
            <v-skeleton-loader
              style="border-radius: 6px 0 0 6px"
              :style="{
                width: width > 650 ? '160px' : '140px',
                height: width > 650 ? '101.25px' : '90px',
              }"
            />

            <div
              class="absolute d-flex flex-column align-center justify-center ga-2 bg-opacity-90"
              style="top: 0; left: 0; right: 0; bottom: 0"
            >
              <v-icon size="24" color="blue">mdi-progress-helper</v-icon>
            </div>
          </div>

          <div
            v-else
            class="d-flex align-center justify-center cursor-pointer ga-1 bg-grey-lighten-3"
            style="border-radius: 6px 0 0 6px"
            :style="{
              width: width > 650 ? '160px' : '140px',
              height: width > 650 ? '101.25px' : '90px',
            }"
          >
            <v-icon size="24" color="error">mdi-alert-circle-outline</v-icon>
          </div>

          <div class="d-flex flex-column flex-1 pa-3 pt-2">
            <h4
              class="video-card-title font-bold cursor-pointer mb-1"
              style="line-height: 1.4rem"
              :class="`line-clamp-${isMobile ? 1 : 1}`"
            >
              {{ item.client ? "💻" : "🌐" }} {{ item.title }}
            </h4>

            <!-- <small>{{ item.frameRate }}</small> -->

            <!-- <small>{{ item.modelVideo }}</small> -->

            <small v-if="item.visibility === 'public'">
              <v-icon size="16" color="primary" style="margin-bottom: 2px">
                mdi-star-four-points-outline
              </v-icon>
              {{ item.createdAt }}
            </small>

            <small v-else>
              <v-icon size="15" style="margin-bottom: 2.5px">
                mdi-lock-outline
              </v-icon>
              {{ item.createdAt }}
            </small>

            <div
              v-if="item.visibility === 'public'"
              class="d-flex align-center"
            >
              <small class="text-nowrap text-grey-darken-2">
                {{ item?.viewsCount }} {{ $t("lượt xem") }}
              </small>

              <v-icon>mdi-circle-small</v-icon>

              <small class="text-nowrap text-grey-darken-2">
                {{ item?.likesCount }} {{ $t("lượt thích") }}
              </small>
            </div>
          </div>

          <v-menu location="bottom right">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                size="40"
                variant="text"
                icon="mdi-dots-vertical"
                @click.prevent.stop
              />
            </template>

            <v-card min-width="200">
              <v-list>
                <v-list-item
                  v-for="(menu, index) in [
                    {
                      title:
                        item.visibility === 'public' ? 'Riêng tư' : 'Công khai',
                      value:
                        item.visibility === 'public' ? 'private' : 'public',
                      icon:
                        item.visibility === 'public'
                          ? 'mdi-lock-outline'
                          : 'mdi-star-four-points-outline',
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
                  :key="index"
                  :value="menu.value"
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
                      {{ $t(menu.title) }}
                    </label>
                  </div>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </router-link>
      </v-col>

      <div ref="loadMore" />
    </v-row>

    <v-card
      v-else
      class="empty-state-box d-flex flex-column align-center justify-center rounded-xl bg-grey-lighten-5 text-center mt-6"
      variant="flat"
      style="min-height: 24rem"
    >
      <div
        class="empty-icon-wrapper mb-5 d-flex align-center justify-center rounded-circle bg-white"
      >
        <v-icon color="#8cb8f4" size="56">mdi-movie-open-remove-outline</v-icon>
      </div>
      <h3 class="text-h6 font-weight-bold text-grey-darken-3 mb-2">
        {{ $t("Bạn chưa có thước phim nào") }}
      </h3>
      <span class="text-grey-darken-1 text-body-1 mb-6">
        Hãy tạo video đầu tiên để bắt đầu trải nghiệm hệ thống.
      </span>
      <ButtonCreateVideo />
    </v-card>

    <div
      v-if="Array.isArray(products.docs) && products.docs.length"
      class="mt-8"
    >
      <ButtonCreateVideo />
    </div>
  </div>
</template>

<style scoped>
.un-select:hover .video-card-title {
  text-decoration: underline;
  color: #1e88e5;
  transition: all 0.3s;
}

.video-duration {
  right: 5px;
  z-index: 9;
  bottom: 5px;
  color: #fff;
  font-size: 0.8rem;
  position: absolute;
  border-radius: 6px;
  padding: 0 6px;
  background-color: rgba(0, 0, 0, 0.533);
}

.video-card {
  color: inherit; /* Giữ nguyên màu chữ */
  text-decoration: none; /* Bỏ gạch chân */
}

.video-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 6px 0 0 6px;
  background: #000;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url("/images/video-loading.jpg");
}

/* Video nền mờ */
.video-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(10px) brightness(0.75);
  transform: scale(1.2); /* tránh viền mờ */
}

/* Video chính */
.video-main {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 1;
}

/* Hiệu ứng cho Empty State */
.empty-state-box {
  border: 2px dashed #cbd5e1;
  transition: all 0.3s ease;
}
.empty-state-box:hover {
  border-color: #94a3b8;
  background-color: #f1f5f9 !important;
}
.empty-icon-wrapper {
  width: 96px;
  height: 96px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
}
</style>
