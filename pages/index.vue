<script setup lang="ts">
const router = useRouter();
const localePath = useLocalePath();

const { t, locale } = useI18n();
const { width, isMobile } = useDevice();

const { onGetterUserData: userData } = useAppStore();
const { onGetterMasterData } = useMasterDataStore();

const client = computed<boolean>(() => {
  const win = window as any;
  return !!(win?.electronAPI && win?.electronAPI?.isElectron);
});

const appVersionDownload = computed(
  () => onGetterMasterData.value["app-version"] || ""
);
const appVersion = computed(() => {
  let result = appVersionDownload.value?.split("/")?.pop();
  return result;
});

useSeo({
  title: t("Trang chủ"),
  description:
    "Nền tảng AI giúp bạn tạo video chuyên nghiệp chỉ trong vài phút",
  image: "/images/page-home.png",
});
</script>

<template>
  <div
    v-if="
      !userData ||
      (userData?.role !== EnumAccountRole.ADMIN && !userData?.remainingTime)
    "
  >
    <div
      v-if="locale === 'vi'"
      class="mt-10 mb-3 d-flex flex-column align-center text-center ga-2"
    >
      <h3 v-if="isMobile" class="font-bold text-red" style="font-size: 1.2rem">
        💥 <span class="text-primary text-2xl">GIÁ ƯU ĐÃI</span> — Chỉ
        <span class="text-2xl text-primary">99.000đ/tháng</span>!
      </h3>

      <h1 v-else class="font-bold text-red">
        💥
        <span class="text-primary font-bold" style="font-size: 2rem">
          GIÁ ƯU ĐÃI
        </span>
        — Chỉ
        <span class="text-primary font-bold" style="font-size: 2rem">
          99.000đ/tháng
        </span>
        !
      </h1>

      <p
        class="text-gray-600 max-w-md"
        :style="{ 'font-size': isMobile ? '1rem' : '1.2rem' }"
      >
        Trải nghiệm không giới hạn toàn bộ tính năng cao cấp, còn chần chờ gì
        nữa!
      </p>

      <div :style="{ 'font-size': isMobile ? '1rem' : '1.2rem' }">
        📌 Đăng ký dịch vụ
        <span
          class="text-primary font-semibold cursor-pointer"
          style="text-decoration: underline"
          @click="router.push(localePath('/payment'))"
        >
          tại đây
        </span>
        hoặc liên hệ <br v-if="width < 560" />
        Zalo
        <a
          :href="'https://zalo.me/0343027232'"
          target="_blank"
          class="text-primary font-semibold hover:underline"
          style="text-wrap: nowrap"
        >
          034 302 7232
        </a>
        để được hỗ trợ.
      </div>

      👇

      <div class="d-flex flex-column">
        <span :style="{ 'font-size': isMobile ? '1rem' : '1.2rem' }">
          📢 Cập nhật tin tức, tính năng mới mỗi ngày
        </span>

        <div :style="{ 'font-size': isMobile ? '1rem' : '1.2rem' }">
          Nhóm Zalo:
          <a target="_blank" href="https://zalo.me/g/p8hls5tonlfkqmyfndmx">
            https://zalo.me/g/p8hls5tonlfkqmyfndmx
          </a>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="userData?.role === EnumAccountRole.ADMIN || userData?.remainingTime"
    class="text-center mt-10"
  >
    <h3
      v-if="isMobile"
      class="font-bold text-primary"
      style="font-size: 1.2rem"
    >
      🎉 CHÀO MỪNG BẠN ĐẾN TN SOLVE
    </h3>

    <h1 v-if="!isMobile" class="font-bold text-primary" style="font-size: 2rem">
      🎉 CHÀO MỪNG BẠN ĐẾN VỚI TN SOLVE
    </h1>

    👇

    <div class="d-flex flex-column">
      <span :style="{ 'font-size': isMobile ? '1rem' : '1.2rem' }">
        📢 Cập nhật tin tức, tính năng mới mỗi ngày
      </span>

      <div :style="{ 'font-size': isMobile ? '1rem' : '1.2rem' }">
        Nhóm Zalo:
        <a target="_blank" href="https://zalo.me/g/p8hls5tonlfkqmyfndmx">
          https://zalo.me/g/p8hls5tonlfkqmyfndmx
        </a>
      </div>
    </div>
  </div>

  <!-- <div class="mt-8 mb-6 text-center mx-auto" style="max-width: 700px">
    <div
      class="py-3 px-4 rounded-lg d-inline-flex align-center justify-center flex-wrap ga-3"
      style="
        background-color: #fff3e0;
        border: 2px solid #ffb74d;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      "
    >
      <span
        :style="{ 'font-size': isMobile ? '1rem' : '1.15rem' }"
        class="font-bold"
        style="line-height: 1rem"
      >
        <v-icon color="red" size="large" class="mb-1">mdi-youtube</v-icon>
        Xem video hướng dẫn đăng ký/gia hạn giá sốc
        <span class="text-red font-bold mr-1">69K</span>
      </span>
      <a
        href="https://youtu.be/XyHbjH2myy8"
        target="_blank"
        class="v-btn bg-red-darken-1 v-btn--density-default v-btn--size-default px-6 font-bold text-white"
        style="text-decoration: none; letter-spacing: 0.5px"
      >
        XEM NGAY
        <v-icon right class="ml-1">mdi-open-in-new</v-icon>
      </a>
    </div>
  </div> -->

  <div v-if="!client && !isMobile && appVersionDownload" class="section my-10">
    <div class="download-wrap">
      <div class="download-left">
        <div
          class="download-title"
          :style="{ 'font-size': isMobile ? '1rem' : '1.2rem' }"
        >
          Tải công cụ TN Solve bản mới nhất
          <span class="text-primary font-bold">
            {{ appVersion }}
          </span>
          về máy tính
        </div>
        <div
          class="download-desc"
          :style="{ 'font-size': isMobile ? '1rem' : '1.2rem' }"
        >
          Cài đặt trên Windows để sử dụng nhanh và ổn định hơn.
        </div>
      </div>

      <a
        class="download-btn"
        :href="appVersionDownload"
        target="_blank"
        rel="noopener"
      >
        <v-icon size="22" class="icon-win">mdi-microsoft-windows</v-icon>
        <span :style="{ 'font-size': isMobile ? '1rem' : '1.2rem' }">
          Tải cho Windows
        </span>
      </a>
    </div>
  </div>

  <div class="my-10 d-flex justify-center">
    <div class="video-wrap">
      <div class="video-frame">
        <iframe
          width="706"
          height="400"
          src="https://www.youtube.com/embed/AFyTHzDbUwA"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        />
      </div>
    </div>
  </div>

  <ButtonCreateVideo class="mt-10" />
</template>

<style scoped>
/* ====== Video ====== */
.video-wrap {
  width: 100%;
  max-width: 980px;
}
.video-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.video-title {
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.2px;
}
.video-frame {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.1);
}
.video-frame iframe {
  display: block;
  width: 100%;
  aspect-ratio: 16/9;
  height: auto;
  border: 0;
}

/* Tải xuống */
.download-wrap {
  max-width: 980px;
  margin: 0 auto;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  padding: 18px 20px;

  /* 👇 rõ hơn */
  border: 1.5px solid rgba(0, 0, 0, 0.14);
  border-radius: 14px;
  background: #ffffff;
}

/* Text */
.download-title {
  font-size: 17px;
  font-weight: 600;
  color: #0f172a; /* đậm hơn chút */
}

.download-desc {
  margin-top: 6px;
  font-size: 14.5px;
  color: #475569; /* đỡ mờ */
  line-height: 1.6;
}
</style>
