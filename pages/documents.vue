<script setup lang="ts">
const { t } = useI18n();

const { onGetterUserData: userData } = useAppStore();

const registered = computed(() => Boolean(userData.value?.serviceExpiry));

const documents = [
  {
    title: "🔍 AI Phân Tích & Clone Video",
    value:
      "https://gemini.google.com/gem/1gc0fwxS3YpkFCa9c7ku2bL-XZ5PBVXm-?usp=sharing",
  },
  {
    title: "🎬 Đạo Diễn Làm Phim Đa Vũ Trụ",
    value:
      "https://gemini.google.com/gem/1xcYJ7af0H8S1NxE0n1IKRsFZX2y_qoIl?usp=sharing",
  },
  {
    title: "📖 Đạo Diễn Phim Hoạt Hình AI Quà Tặng Cuộc Sống",
    value:
      "https://gemini.google.com/gem/18JVkNtXesH43TRA1zc1pC2_SEWAe4sdb?usp=sharing",
  },
  {
    title: "🎨 Đạo Diễn Hoạt Hình Giáo Dục Trẻ Em Nói Tiếng Anh",
    value:
      "https://gemini.google.com/gem/1ovviMlY7omu3CBx1jgj97oy1q-EpT0UG?usp=sharing",
  },
  {
    title: "✨ Đạo Diễn Hiệu Ứng Pháo Hoa POV",
    value:
      "https://gemini.google.com/gem/1VT0_eNcuQBNLw3OOb0yxnuLTvHG9rv-s?usp=sharing",
  },
  {
    title: '🎭 Đạo Diễn 3D "Trái Cây Nổi Giận"',
    value:
      "https://gemini.google.com/gem/19V5yizpIG9fp5hfjROVBxkV-EkYab5mv?usp=sharing",
  },
  {
    title: "📜 AI Kịch Bản Nhân Vật Kể Chuyện",
    value:
      "https://gemini.google.com/gem/1QzEAOsmWa0WKefSGy2QImSfEkW7YnEOc?usp=sharing",
  },
  {
    title: "🍌 Bro Khỉ Tâm Sự Chuyện Đàn Ông",
    value:
      "https://gemini.google.com/gem/1cuZ3qYU3GkfR25YDXc1fPp1wk3rqGfw9?usp=sharing",
  },
  {
    title: "💚 Xây dựng video nhân hoá nhân vật về sức khỏe",
    value:
      "https://gemini.google.com/gem/1-IBDvyXN9FZpRF9eBy9w1GePlMbnVuGS?usp=sharing",
  },
  {
    title: "🎵 Đạo Diễn Tạo MV Ca Nhạc",
    value:
      "https://gemini.google.com/gem/1k-GUzKKA-pB_Xrc0sqAWRqLdtVKMvbFJ?usp=sharing",
  },
  {
    title: "⏳ Fast-Forward Master (Bậc thầy tua nhanh)",
    value:
      "https://gemini.google.com/gem/1VhlbwN5fQTUUOZ1IYQERbqS9NZ1LmNSu?usp=sharing",
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
      <div v-for="(item, index) in documents" :key="index">
        <span
          class="text-blue cursor-pointer"
          style="text-decoration: underline"
          @click="onClickDocument(item)"
        >
          {{ item.title }}
        </span>
      </div>
    </div>
  </div>
</template>
