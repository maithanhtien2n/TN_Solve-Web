<script setup lang="ts">
const { onGetterUserData: userData } = useAppStore();

const registered = computed(() => Boolean(userData.value?.serviceExpiry));

const documents = [
  {
    emoji: "🔍",
    title: "AI Phân Tích & Clone Video",
    tags: [],
    value: "https://gemini.google.com/gem/1gc0fwxS3YpkFCa9c7ku2bL-XZ5PBVXm-?usp=sharing",
  },
  {
    emoji: "🎬",
    title: "AI Làm Phim Đa Vũ Trụ",
    tags: ["Làm phim"],
    value: "https://gemini.google.com/gem/1xcYJ7af0H8S1NxE0n1IKRsFZX2y_qoIl?usp=sharing",
  },
  {
    emoji: "🎬",
    title: "Đạo Diễn AI Sử Thi 2D",
    tags: ["Làm phim", "Đồng bộ nhân vật"],
    value: "https://gemini.google.com/gem/1PMB2sYtZ9Z1tP5RRaOTwiLA0MBkL2-GN?usp=sharing",
  },
  {
    emoji: "🎬",
    title: "Đạo Diễn AI Cổ Tích 2D",
    tags: ["Làm phim", "Đồng bộ nhân vật"],
    value: "https://gemini.google.com/gem/1GcTxzg1m9wmH052hKGniwmOZTdWSu0U8?usp=sharing",
  },
  {
    emoji: "🎭",
    title: "Kiến Trúc Sư AI Video Truyền Động Lực",
    tags: ["Làm phim"],
    value: "https://gemini.google.com/gem/1gIW0-Ha8OtkB38hbo6V7rP0tTi_kXm6J?usp=sharing",
  },
  {
    emoji: "🎬",
    title: "AI Biên Soạn Prompt Drama Mẹ Chồng Nàng Dâu",
    tags: ["Đồng bộ nhân vật"],
    value: "https://gemini.google.com/gem/14P3CwGGH-SOmH76uRoeGoICMcYk5C5wx?usp=sharing",
  },
  {
    emoji: "📝",
    title: "AI Chuyên Làm Video Podcast Triết Lý",
    tags: ["Đồng bộ nhân vật", "Tùy chỉnh nhân vật"],
    value: "https://gemini.google.com/gem/1FZkD9kDuDCE-AvnPIt4KNrEa1Ih_XjIK?usp=sharing",
  },
  {
    emoji: "📖",
    title: "AI Phim Hoạt Hình Quà Tặng Cuộc Sống",
    tags: ["Làm phim"],
    value: "https://gemini.google.com/gem/18JVkNtXesH43TRA1zc1pC2_SEWAe4sdb?usp=sharing",
  },
  {
    emoji: "🍌",
    title: "Bro Khỉ Tâm Sự Chuyện Đàn Ông",
    tags: ["Làm phim"],
    value: "https://gemini.google.com/gem/1cuZ3qYU3GkfR25YDXc1fPp1wk3rqGfw9?usp=sharing",
  },
  {
    emoji: "🎨",
    title: "AI Hoạt Hình Giáo Dục Trẻ Em Nói Tiếng Anh",
    tags: ["Làm phim"],
    value: "https://gemini.google.com/gem/1ovviMlY7omu3CBx1jgj97oy1q-EpT0UG?usp=sharing",
  },
  {
    emoji: "✨",
    title: "AI Hiệu Ứng Pháo Hoa POV",
    tags: ["Làm phim"],
    value: "https://gemini.google.com/gem/1VT0_eNcuQBNLw3OOb0yxnuLTvHG9rv-s?usp=sharing",
  },
  {
    emoji: "🎭",
    title: "AI 3D Trái Cây Dạy Đạo Lý",
    tags: ["Làm phim"],
    value: "https://gemini.google.com/gem/19V5yizpIG9fp5hfjROVBxkV-EkYab5mv?usp=sharing",
  },
  {
    emoji: "📜",
    title: "AI Kịch Bản Nhân Vật Kể Chuyện",
    tags: ["Đồng bộ cảnh quay"],
    value: "https://gemini.google.com/gem/1QzEAOsmWa0WKefSGy2QImSfEkW7YnEOc?usp=sharing",
  },
  {
    emoji: "🎵",
    title: "AI Tạo MV Ca Nhạc Chuyên Nghiệp",
    tags: ["Tùy chỉnh cảnh quay"],
    value: "https://gemini.google.com/gem/1k-GUzKKA-pB_Xrc0sqAWRqLdtVKMvbFJ?usp=sharing",
  },
  {
    emoji: "⏳",
    title: "AI Bậc Thầy Tua Nhanh",
    tags: ["Tùy chỉnh quy trình"],
    value: "https://gemini.google.com/gem/1VhlbwN5fQTUUOZ1IYQERbqS9NZ1LmNSu?usp=sharing",
  },
  {
    emoji: "📦",
    title: "Tạo Video Quảng Cáo Xoay Sản Phẩm",
    tags: ["Tùy chỉnh nhân vật"],
    value: "https://gemini.google.com/gem/1VVX-4ZWiP-JoJJP5CVTqcZxdBi2_8DMc?usp=sharing",
  },
  {
    emoji: "📝",
    title: "Xưởng Phim Cinematic AI",
    tags: ["Đồng bộ nhân vật", "Tùy chỉnh nhân vật"],
    value: "https://gemini.google.com/gem/1a6CxQz_FAGG4Ks_ZOy87PVBoBD3lv97C?usp=sharing",
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
  title: "Trợ lý AI",
  description:
    "Trợ lý viết câu lệnh AI TN Solve - Hướng dẫn viết prompt hiệu quả cho Veo, Grok. Bộ sưu tập prompt mẫu giúp tạo video AI chất lượng cao.",
  image: "/images/page-home.png",
  keywords:
    "prompt AI, viết câu lệnh AI, hướng dẫn Veo Grok, prompt tạo video, TN Solve tài liệu, mẫu prompt video AI",
});

definePageMeta({ middleware: "auth" });
</script>

<template>
  <!-- Header -->
  <div class="page-header mb-6">
    <div class="page-title-row">
      <div class="page-icon">
        <v-icon size="22" color="white">mdi-robot-excited-outline</v-icon>
      </div>
      <div>
        <h2 class="page-title">Trợ lý AI viết Prompt</h2>
        <p class="page-desc">{{ documents.length }} trợ lý Gemini chuyên biệt hỗ trợ tạo video AI</p>
      </div>
    </div>
  </div>

  <!-- Grid -->
  <div class="doc-grid">
    <div
      v-for="(item, index) in documents"
      :key="index"
      class="doc-card"
      @click="onClickDocument(item)"
    >
      <div class="doc-emoji">{{ item.emoji }}</div>

      <div class="doc-body">
        <div class="doc-title">{{ item.title }}</div>

        <div v-if="item.tags.length" class="doc-tags">
          <span v-for="tag in item.tags" :key="tag" class="doc-tag">
            {{ tag }}
          </span>
        </div>
      </div>

      <v-icon class="doc-arrow" size="18" color="#bdbdbd">mdi-arrow-right</v-icon>
    </div>
  </div>
</template>

<style scoped>
/* ─── Header ─────────────────────────────────────────── */
.page-header {
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.page-title-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.page-icon {
  flex-shrink: 0;
  width: 46px;
  height: 46px;
  border-radius: 13px;
  background: linear-gradient(135deg, #1a73e8, #4285f4);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(26,115,232,0.35);
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
  color: #9e9e9e;
  margin: 0;
}

/* ─── Grid ───────────────────────────────────────────── */
.doc-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

@media (max-width: 900px) {
  .doc-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 550px) {
  .doc-grid { grid-template-columns: 1fr; }
}

/* ─── Card ───────────────────────────────────────────── */
.doc-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #f0f0f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  cursor: pointer;
  transition: box-shadow 0.18s, border-color 0.18s, transform 0.18s;
}

.doc-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.09);
  border-color: #e0e0e0;
  transform: translateY(-1px);
}

.doc-card:hover .doc-arrow {
  color: #1a73e8 !important;
  transform: translateX(3px);
}

.doc-emoji {
  font-size: 1.6rem;
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 10px;
}

.doc-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.doc-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.doc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.doc-tag {
  font-size: 0.68rem;
  font-weight: 500;
  color: #1a73e8;
  background: #e8f0fe;
  padding: 2px 8px;
  border-radius: 999px;
}

.doc-arrow {
  flex-shrink: 0;
  transition: color 0.18s, transform 0.18s;
}
</style>
