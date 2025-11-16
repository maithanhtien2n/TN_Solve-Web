<script setup lang="ts">
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Autoplay, Navigation } from "swiper/modules";

const { isMobile } = useDevice();

const active = ref(0);

const banners = computed<any>(() => [
  { image: "/images/banner-1.png" },
  { image: "/images/banner-2.png" },
]);

const onSlideChange = (s: any) => (active.value = s.realIndex);
</script>

<template>
  <swiper
    :loop="true"
    :navigation="Boolean(!isMobile)"
    :pagination="{ clickable: true }"
    :modules="[Pagination, Autoplay, Navigation]"
    :autoplay="{
      delay: 4500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    }"
    @slideChange="onSlideChange"
    class="mySwiper un-select"
  >
    <swiper-slide v-for="(item, index) in banners" :key="index">
      <v-img class="hero-img" cover :src="item.image" :aspect-ratio="16 / 6">
        <!-- TEXT OVERLAY -->
        <div v-if="item.name" class="banner-text" v-show="active === index">
          <div class="banner-text-inner animate-in">
            <h2 class="headline">{{ item.name }}</h2>
            <p
              v-if="item.note"
              class="subline"
              v-html="item.note"
              style="white-space: pre-line; line-height: 1.8rem"
            />
          </div>
        </div>
      </v-img>
    </swiper-slide>
  </swiper>
</template>

<style scoped>
.swiper-slide-container {
  border-radius: 3px;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
    rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
}

/* ====== ẢNH TRONG SWIPER ====== */
.hero-img :deep(img) {
  object-position: center 55%;
  object-fit: cover;
}

/* ====== TEXT OVERLAY ====== */
.banner-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end; /* Đưa chữ xuống cuối banner */
  justify-content: center; /* Căn ngang giữa */
  padding: 2rem 1rem 3rem; /* Thêm khoảng cách dưới */
  pointer-events: none;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.65) 0%,
    rgba(0, 0, 0, 0.444) 45%,
    rgba(0, 0, 0, 0) 100%
  ); /* Gradient tối để chữ nổi bật */
}

/* ====== NỘI DUNG CHỮ ====== */
.banner-text-inner {
  text-align: center;
  color: #fff;
  text-shadow: 0 3px 14px rgba(0, 0, 0, 0.65);
  animation: fadeSlideUp 0.9s ease forwards;
  margin-bottom: 1rem;
}

/* Tiêu đề */
.headline {
  font-weight: 800;
  line-height: 1.2;
  font-size: clamp(26px, 5vw, 56px);
  margin: 0 0 6px;
  letter-spacing: 0.5px;
}

/* Mô tả */
.subline {
  margin: 0;
  font-size: clamp(15px, 2vw, 20px);
  color: rgba(255, 255, 255, 0.9);
}

/* ====== ANIMATION ====== */
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(25px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ====== SWIPER UI ====== */
:deep(.swiper-pagination-bullet) {
  opacity: 1;
  width: 14px;
  height: 14px;
  transition: all 0.3s;
  margin: 0 8px !important;
  background: rgba(255, 255, 255, 0.5);
}
:deep(.swiper-pagination-bullet-active) {
  background-color: #fff;
  /* transform: scale(1.15); */
}
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: white;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.35));
}
:deep(.swiper-pagination) {
  bottom: 16px !important;
}

/* ====== MOBILE TỐI ƯU ====== */
@media (max-width: 700px) {
  .banner-text {
    padding: 1.5rem 1rem 2rem;
    align-items: flex-end;
  }
  .banner-text-inner {
    max-width: 90%;
  }
  .headline {
    font-size: clamp(20px, 6vw, 32px);
  }
  .subline {
    font-size: clamp(13px, 4vw, 16px);
  }
  :deep(.swiper-pagination-bullet) {
    width: 8px !important;
    height: 8px !important;
  }

  :deep(.swiper-pagination) {
    bottom: 8px !important;
  }
}

@media (max-width: 768px) {
  .swiper-slide-container {
    border-radius: 0 !important;
  }
}
</style>
