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
const commonDialogRef = ref<any>(null);
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
  } else if (type === "delete-video") {
    confirmDialogRef.value.show({
      noTransMsg: true,
      message: t("Bạn có chắc chắn muốn xoá video này không?"),
      onConfirm: async () => {
        try {
          await productService.actionProduct({
            ids: [data._id],
            action: "delete",
          });

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

onMounted(() => {
  onGetProducts("list");
  commonDialogRef.value?.onDisplay(true);
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
  <CommonDialog
    ref="commonDialogRef"
    width="800"
    title="🔔 Thông báo quan trọng!"
  >
    <div style="padding: 1rem">
      <h2
        style="
          color: #ffc300;
          border-bottom: 2px solid #ffc300;
          margin-top: -5px;
        "
        class="mb-4 pb-4"
      >
        &#128226; Thông báo Nóng về Chi Phí Tín Dụng Veo 3 (Mọi người làm video
        chú ý giúp Em nhé!)
      </h2>

      <p>Chào cả nhà mình,</p>

      <p>
        Cảm ơn mọi người rất nhiều vì đã ủng hộ công cụ tạo video tự động dùng
        dịch vụ của <strong>Veo 3</strong> mà Em cung cấp!
      </p>

      <p>
        Trước đây, Veo 3 Fast là <strong>miễn phí (0 tín dụng/video)</strong>,
        giúp mọi người làm video thoải mái.
      </p>

      <p>
        Tuy nhiên, do lượng người dùng tăng đột biến, bên cung cấp dịch vụ Veo 3
        đang bị quá tải và họ vừa đưa ra một thông báo thay đổi chính sách:
      </p>

      <blockquote
        style="
          background-color: #f9f9f9;
          border-left: 5px solid #007bff;
          margin: 15px 0;
          padding: 10px 15px;
        "
      >
        <p style="margin: 0">
          <strong
            >Vì quá tải, Veo 3 Fast sẽ bắt đầu tính 10 tín dụng/video.</strong
          >
        </p>
      </blockquote>

      <p>
        Em xin lỗi mọi người về sự thay đổi đột ngột và bất tiện này từ phía nhà
        cung cấp Veo 3.
      </p>

      <h3 style="color: #28a745">&#127873; Phương án Hỗ trợ từ Em</h3>

      <p>
        Để mọi người vẫn tiếp tục tạo được video ổn thỏa, Em xin gửi tặng mọi
        người chút hỗ trợ:
      </p>

      <ul style="list-style-type: none; padding-left: 0">
        <li style="margin-bottom: 10px">
          &#10003; <strong>Tặng ngay 4000 tín dụng</strong> vào mỗi tài khoản để
          mọi người sử dụng cho dịch vụ Veo 3 Fast (tương đương
          <strong>400 cảnh</strong>).
        </li>
        <li>
          &#10003; Nếu mọi người dùng hết 4000 tín dụng này mà vẫn cần làm
          video,
          <strong
            >tool đã tích hợp chế độ để mọi người liên kết tài khoản Veo 3 cá
            nhân bên ngoài</strong
          >
          vào hệ thống để tiếp tục sử dụng.
        </li>
      </ul>

      <p style="text-align: center; margin-top: 25px">
        <strong>Mong mọi người</strong> thông cảm và tiếp tục ủng hộ Em nhé!
      </p>
    </div>
  </CommonDialog>

  <div
    v-if="Boolean(loading === 'list')"
    class="d-flex justify-center flex-column align-center ga-3 pt-10 pb-16"
  >
    <v-progress-circular width="2" size="40" color="primary" indeterminate />
    {{ $t("Đang tải dữ liệu...") }}
  </div>

  <div v-else>
    <ConfirmDialog ref="confirmDialogRef" />

    <div class="mb-4">
      <span class="text-error">
        ⚠️ Lưu ý: Thời gian lưu trữ cho video đã tạo là 12 giờ. Xin quý khách
        vui lòng tải xuống và lưu trữ để tránh mất mát dữ liệu.
      </span>
    </div>

    <v-row :dense="isMobile">
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
            <video
              class="cursor-pointer bg-black"
              style="border-radius: 6px 0 0 6px"
              :key="item.video"
              :width="width > 650 ? 160 : 140"
              :height="width > 650 ? 101.25 : 90"
              :style="
                item.frameRate === 'Khổ ngang (16:9)'
                  ? { 'object-fit': 'cover' }
                  : {}
              "
            >
              <source :src="item.video" type="video/mp4" />
            </video>

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
              class="video-card-title font-bold line-clamp-2 cursor-pointer mb-1"
              style="line-height: 1.4rem"
            >
              {{ item.title }}
            </h4>

            <!-- <small>{{ item.frameRate }}</small> -->

            <!-- <small>{{ item.modelVideo }}</small> -->

            <small>{{ item.createdAt }}</small>

            <!-- <small v-if="item.state === 'primary'" class="text-primary mt-1">
            {{ $t("Đang tạo video...") }}
          </small>

          <small v-else-if="item.state === 'error'" class="text-error mt-1">
            {{ $t("Tạo video thất bại") }}
          </small> -->
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
                      title: 'Tải video',
                      value: 'download-video',
                      icon: 'mdi-tray-arrow-down',
                    },
                    {
                      title: 'Xoá video',
                      value: 'delete-video',
                      icon: 'mdi-delete-outline',
                    },
                  ]"
                  :key="index"
                  :value="menu.value"
                  :class="{
                    disabled:
                      item.state === 'primary' ||
                      (menu.value === 'download-video' &&
                        item.state === 'error'),
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
</style>
