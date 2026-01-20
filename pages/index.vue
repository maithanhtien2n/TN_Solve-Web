<script setup lang="ts">
const router = useRouter();
const localePath = useLocalePath();

const { t, locale } = useI18n();
const { width, isMobile } = useDevice();

const { onGetterUserData: userData } = useAppStore();

useSeo({
  title: t("Trang chủ"),
  description:
    "Nền tảng AI giúp bạn tạo video chuyên nghiệp chỉ trong vài phút",
  image: "/images/page-home.png",
});
</script>

<template>
  <TabView
    v-if="false"
    :tabs="[
      { title: 'Khổ ngang (16:9)', value: 'horizontal' },
      { title: 'Khổ dọc (9:16)', value: 'vertical' },
    ]"
    @change="(value) => console.log(value)"
  >
    <v-row :dense="isMobile">
      <v-col
        v-for="(item, index) in 12"
        :key="index"
        lg="4"
        md="6"
        sm="6"
        cols="12"
        class="cursor-pointer"
      >
        <div
          class="d-flex justify-center rem bg-black"
          style="border-radius: 6px; overflow: hidden; pointer-events: none"
        >
          <VideoPlayer
            :src="`/videos/11.mp4`"
            :frameRate="'horizontal'"
            :removeControls="[
              'play',
              'mute',
              'volume',
              'progress',
              'settings',
              'fullscreen',
              'current-time',
            ]"
          />
        </div>
      </v-col>
    </v-row>
  </TabView>

  <template
    v-if="!userData || (userData.role !== 'admin' && !userData.remainingTime)"
  >
    <div
      v-if="locale === 'vi'"
      class="my-10 d-flex flex-column align-center text-center ga-2"
    >
      <h3 v-if="isMobile" class="font-bold text-red">
        💥 <span class="text-primary text-2xl">GIÁ ƯU ĐÃI</span> — Chỉ
        <span class="text-2xl text-primary">99.000đ/tháng</span>!
      </h3>

      <h1 v-else class="font-bold text-red">
        💥 <span class="text-primary text-2xl">GIÁ ƯU ĐÃI</span> — Chỉ
        <span class="text-2xl text-primary">99.000đ/tháng</span>!
      </h1>

      <p class="text-gray-600 max-w-md">
        Trải nghiệm không giới hạn toàn bộ tính năng cao cấp, còn chần chờ gì
        nữa!
      </p>

      <div>
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
    </div>
  </template>

  <div v-if="userData?.serviceExpiry" class="text-center">
    <div class="d-flex justify-center mt-6">
      <v-img src="/images/qr-zalo-group.jpg" class="h-20rem" />
    </div>

    <a target="_blank" href="https://zalo.me/g/tuhmrl934">
      Bấm vào đây để tham gia nhóm Zalo TN Solve!
    </a>
  </div>

  <div v-if="userData?.role !== EnumAccountRole.ADMIN" class="mt-3 text-center">
    <a
      target="_blank"
      href="https://youtu.be/dCb8hL7wLAM"
      class="text-red"
      style="text-decoration: none"
    >
      <v-icon>mdi-chevron-double-right</v-icon>
      <span class="mr-1">
        Bấm
        <span class="text-blue" style="text-decoration: underline">
          vào đây
        </span>
        để xem video hướng dẫn sử dụng công cụ TN Solve
      </span>
      <v-icon>mdi-youtube</v-icon>
    </a>
  </div>

  <ButtonCreateVideo class="mt-10" />
</template>
