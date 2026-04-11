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
    title: "🎬 AI Làm Phim Đa Vũ Trụ (Làm phim)",
    value:
      "https://gemini.google.com/gem/1xcYJ7af0H8S1NxE0n1IKRsFZX2y_qoIl?usp=sharing",
  },
  {
    title: "🎬 AI Biên Soạn Prompt Drama Mẹ Chồng Nàng Dâu (Đồng bộ nhân vật)",
    value:
      "https://gemini.google.com/gem/14P3CwGGH-SOmH76uRoeGoICMcYk5C5wx?usp=sharing",
  },
  {
    title:
      "📝 AI Chuyên Làm Video Podcast Triết Lý (Đồng bộ nhân vật, Tùy chỉnh nhân vật)",
    value:
      "https://gemini.google.com/gem/1FZkD9kDuDCE-AvnPIt4KNrEa1Ih_XjIK?usp=sharing",
  },
  {
    title: "📖 AI Phim Hoạt Hình AI Quà Tặng Cuộc Sống (Làm phim)",
    value:
      "https://gemini.google.com/gem/18JVkNtXesH43TRA1zc1pC2_SEWAe4sdb?usp=sharing",
  },
  {
    title: "🍌 Bro Khỉ Tâm Sự Chuyện Đàn Ông (Làm phim)",
    value:
      "https://gemini.google.com/gem/1cuZ3qYU3GkfR25YDXc1fPp1wk3rqGfw9?usp=sharing",
  },
  {
    title: "🎨 AI Hoạt Hình Giáo Dục Trẻ Em Nói Tiếng Anh (Làm phim)",
    value:
      "https://gemini.google.com/gem/1ovviMlY7omu3CBx1jgj97oy1q-EpT0UG?usp=sharing",
  },
  {
    title: "✨ AI Hiệu Ứng Pháo Hoa POV (Làm phim)",
    value:
      "https://gemini.google.com/gem/1VT0_eNcuQBNLw3OOb0yxnuLTvHG9rv-s?usp=sharing",
  },
  {
    title: "🎭 AI 3D Trái Cây Dạy Đạo Lý (Làm phim)",
    value:
      "https://gemini.google.com/gem/19V5yizpIG9fp5hfjROVBxkV-EkYab5mv?usp=sharing",
  },
  {
    title: "📜 AI Kịch Bản Nhân Vật Kể Chuyện (Đồng bộ cảnh quay)",
    value:
      "https://gemini.google.com/gem/1QzEAOsmWa0WKefSGy2QImSfEkW7YnEOc?usp=sharing",
  },
  {
    title: "🎵 AI Tạo MV Ca Nhạc Chuyên Nghiệp (Tùy chỉnh cảnh quay)",
    value:
      "https://gemini.google.com/gem/1k-GUzKKA-pB_Xrc0sqAWRqLdtVKMvbFJ?usp=sharing",
  },
  {
    title: "⏳ AI Bậc thầy tua nhanh (Tùy chỉnh quy trình)",
    value:
      "https://gemini.google.com/gem/1VhlbwN5fQTUUOZ1IYQERbqS9NZ1LmNSu?usp=sharing",
  },
  {
    title: "📦 Tạo Video Quảng Cáo Xoay Sản Phẩm (Tùy chỉnh nhân vật)",
    value:
      "https://gemini.google.com/gem/1VVX-4ZWiP-JoJJP5CVTqcZxdBi2_8DMc?usp=sharing",
  },
  {
    title: "📝 Xưởng Phim Cinematic AI (Đồng bộ nhân vật, Tùy chỉnh nhân vật)",
    value:
      "https://gemini.google.com/gem/1a6CxQz_FAGG4Ks_ZOy87PVBoBD3lv97C?usp=sharing",
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
