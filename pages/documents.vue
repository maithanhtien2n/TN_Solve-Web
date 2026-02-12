<script setup lang="ts">
const { t } = useI18n();

const { onGetterUserData: userData } = useAppStore();

const registered = computed(() => Boolean(userData.value?.serviceExpiry));

const documents = [
  {
    title: 'Trợ lý viết prompt "Làm phim"',
    value:
      "https://gemini.google.com/gem/1sSwbpAhdzLev11WVRxMLiDGrXkmJSDrt?usp=sharing",
  },
  {
    title: "💚 Xây dựng video nhân hoá nhân vật về sức khỏe",
    value:
      "https://gemini.google.com/gem/1-IBDvyXN9FZpRF9eBy9w1GePlMbnVuGS?usp=sharing",
    // required: true,
  },
  {
    title: "🎵 MV AI Pro – Tạo MV Ca Nhạc Chuẩn Ảnh → Video",
    value:
      "https://gemini.google.com/gem/1k-GUzKKA-pB_Xrc0sqAWRqLdtVKMvbFJ?usp=sharing",
  },
  {
    title: "🚀 Giải Pháp Tạo Video Timelapse Thông Minh",
    value:
      "https://gemini.google.com/gem/1HvNrJ2DLWd0PL_PJ3bJbqyjt_2_GlT9f?usp=sharing",
  },
];

const onClickDocument = (item: any) => {
  if (
    userData.value?.role !== EnumAccountRole.ADMIN &&
    item.required &&
    !registered.value
  ) {
    useAppStore().onActionSetSystemPopup({
      type: "info",
      content: "Vui lòng đăng ký dịch vụ để sử dụng trợ lý!",
    });
  } else {
    window.open(item.value, "_blank");
  }
};

useSeo({
  title: t("Tài liệu"),
  description:
    "Nền tảng AI giúp bạn tạo video chuyên nghiệp chỉ trong vài phút",
  image: "/images/page-home.png",
});

definePageMeta({ middleware: "auth" });
</script>

<template>
  <div>
    <h2 class="font-bold">{{ $t("Chatbot hỗ trợ viết prompt") }}</h2>

    <div class="mt-4 d-flex flex-column ga-2">
      <template v-for="(item, index) in documents" :key="index">
        <span
          class="text-blue cursor-pointer"
          style="text-decoration: underline"
          @click="onClickDocument(item)"
        >
          {{ item.title }}
        </span>
      </template>
    </div>
  </div>
</template>
