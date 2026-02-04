<script setup lang="ts">
import { productService } from "~/services/product";
import { useIntersectionObserver } from "@vueuse/core";

const { t } = useI18n();
const { width, isMobile } = useDevice();

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
  title: t("Thước phim công khai"),
  description:
    "Nền tảng AI giúp bạn tạo video chuyên nghiệp chỉ trong vài phút",
  image: "/images/page-video.png",
});
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
    <div class="mb-4 d-flex flex-column">
      <h2 class="font-bold" style="margin-top: -7px">
        {{ $t("Thước phim công khai") }}
      </h2>
      <span>
        {{
          $t(
            "Các thước phim đã được chia sẻ từ cộng đồng để mọi người cùng xem và học tập."
          )
        }}
      </span>
    </div>

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
              {{ item.title }}
            </h4>

            <div class="d-flex align-center">
              <small class="line-clamp-1">
                <v-icon size="15" style="margin-bottom: 3px">
                  mdi-account-tie
                </v-icon>
                {{ item?.account?.name }}
              </small>
            </div>

            <div
              v-if="item.visibility === 'public'"
              class="d-flex align-center"
            >
              <small class="text-nowrap text-grey-darken-2">
                {{ item?.viewsCount }} {{ $t("lượt xem") }}
              </small>

              <v-icon>mdi-circle-small</v-icon>

              <small class="text-nowrap text-grey-darken-2">
                {{ timeAgoVi(item?.createdAt) }}
              </small>
            </div>
          </div>
        </router-link>
      </v-col>

      <div ref="loadMore" />
    </v-row>

    <div v-else class="mx-auto my-10 text-center">
      <v-icon icon="mdi-movie-open-outline" size="40" class="mb-1" />

      <div>{{ $t("Chưa có thước phim nào từ cộng đồng") }}.</div>
    </div>

    <ButtonCreateVideo style="margin-top: 2rem" />
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
</style>
