<script setup lang="ts">
const router = useRouter();
const { isMobile } = useDevice();

const { onGetterUserData: userData } = useAppStore();
const { onGetterMasterData } = useMasterDataStore();

const client = computed<boolean>(() => {
  const win = window as any;
  return !!(win?.electronAPI && win?.electronAPI?.isElectron);
});

const appVersionDownload = computed(
  () => onGetterMasterData.value["app-version"] || "",
);

const showCredit = ref(false);

const isSubscribed = computed(
  () =>
    userData.value?.role === EnumAccountRole.ADMIN ||
    !!userData.value?.remainingTime,
);

useSeo({
  title: "Trang chủ",
  description:
    "TN Solve - Nền tảng AI tạo video tự động chuyên nghiệp chỉ 139.000đ/tháng. Tạo video AI với mô hình Veo, Grok trong vài phút. Đăng ký ngay!",
  image: "/images/page-home.png",
  keywords:
    "TN Solve, tạo video AI, video AI tự động, Veo, Grok, tạo video chuyên nghiệp, công cụ AI, tạo video online 139k",
});
</script>

<template>
  <!-- ── Hero banner ────────────────────────────────────── -->
  <div class="hero-banner">
    <div class="hero-glow" />

    <div class="hero-inner">
    <div class="hero-content">
      <template v-if="isSubscribed">
        <div class="hero-label">
          <span class="dot-live" />
          Hệ thống đang hoạt động
        </div>
        <h1 class="hero-heading">
          Xin chào,
          <span class="hero-name">{{ userData?.name?.split(" ").pop() }}</span>
          👋
        </h1>
        <p class="hero-sub">
          Sẵn sàng tạo video AI chuyên nghiệp ngay hôm nay?
        </p>
        <div>
          <v-btn
            color="white"
            rounded="lg"
            elevation="0"
            size="large"
            class="cta-primary mt-2"
            @click="router.push('/video/create')"
          >
            <v-icon start size="20">mdi-image-filter-tilt-shift</v-icon>
            Tạo video
          </v-btn>
        </div>
      </template>

      <template v-else>
        <div class="hero-label">
          <v-icon size="13">mdi-star-four-points</v-icon>
          AI-Powered · Veo · Grok
        </div>
        <h1 class="hero-heading">
          Tạo video AI <br />
          chuyên nghiệp
        </h1>
        <p class="hero-sub">
          Chỉ <strong class="hero-price">139.000đ/tháng</strong> — không giới
          hạn tính năng cao cấp
        </p>
        <div class="hero-ctas">
          <v-btn
            color="white"
            rounded="lg"
            elevation="0"
            size="large"
            class="cta-primary"
            @click="router.push('/payment')"
          >
            <v-icon start size="18">mdi-rocket-launch-outline</v-icon>
            Đăng ký ngay
          </v-btn>
          <a
            href="https://zalo.me/0343027232"
            target="_blank"
            class="cta-ghost"
          >
            <v-icon size="17">mdi-chat-processing-outline</v-icon>
            Tư vấn Zalo
          </a>
        </div>
      </template>
    </div>
    </div>

    <!-- Decorative circles -->
    <div class="deco deco-1" />
    <div class="deco deco-2" />
  </div>

  <!-- ── Quick cards ─────────────────────────────────────── -->
  <div class="quick-grid">
    <router-link v-if="isSubscribed" to="/video" class="quick-card">
      <div class="quick-icon" style="background: #eff6ff">
        <v-icon color="#1e88e5" size="22">mdi-play-circle-outline</v-icon>
      </div>
      <div class="quick-label">Thư viện</div>
      <div class="quick-desc">Xem lại các video đã tạo</div>
    </router-link>

    <div
      v-else
      class="quick-card quick-card--credit"
      @click="showCredit = true"
      style="cursor: pointer"
    >
      <div class="quick-icon" style="background: #eff6ff">
        <v-icon color="#1e88e5" size="22">mdi-diamond-stone</v-icon>
      </div>
      <div class="quick-label">Gói 139k/tháng</div>
      <div class="quick-desc">Xem chi tiết gói & tín dụng</div>
    </div>

    <router-link to="/video/public" class="quick-card">
      <div class="quick-icon" style="background: #f0fdf4">
        <v-icon color="#10b981" size="22">mdi-earth</v-icon>
      </div>
      <div class="quick-label">Cộng đồng</div>
      <div class="quick-desc">Thước phim từ mọi người</div>
    </router-link>

    <a
      href="https://zalo.me/g/p8hls5tonlfkqmyfndmx"
      target="_blank"
      class="quick-card"
    >
      <div class="quick-icon" style="background: #fff7ed">
        <v-icon color="#f59e0b" size="22">mdi-account-group-outline</v-icon>
      </div>
      <div class="quick-label">Nhóm Zalo</div>
      <div class="quick-desc">Tin tức & hỗ trợ mỗi ngày</div>
    </a>

    <router-link
      v-if="!isSubscribed"
      to="/payment"
      class="quick-card quick-card--highlight"
    >
      <div class="quick-icon" style="background: #fdf4ff">
        <v-icon color="#8b5cf6" size="22">mdi-crown-outline</v-icon>
      </div>
      <div class="quick-label">Nâng cấp</div>
      <div class="quick-desc">Chỉ 139.000đ/tháng</div>
    </router-link>

    <router-link v-else to="/documents" class="quick-card">
      <div class="quick-icon" style="background: #fdf4ff">
        <v-icon color="#8b5cf6" size="22">mdi-book-open-outline</v-icon>
      </div>
      <div class="quick-label">Trợ lý AI</div>
      <div class="quick-desc">Gợi ý & viết prompt video thông minh</div>
    </router-link>
  </div>

  <!-- Credit info dialog -->
  <v-dialog v-model="showCredit" max-width="480">
    <v-card rounded="xl" class="credit-dialog">
      <v-card-title class="credit-dialog-header">
        <div class="credit-dialog-title">
          <div class="credit-dialog-icon">
            <v-icon color="white" size="18">mdi-diamond-stone</v-icon>
          </div>
          <div>
            <div class="credit-dialog-name">Chi tiết gói dịch vụ</div>
            <div class="credit-dialog-sub">
              Minh bạch · Linh hoạt · Tiết kiệm
            </div>
          </div>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="showCredit = false"
        />
      </v-card-title>

      <v-card-text class="pt-2 pb-5 px-5">
        <div class="credit-section">
          <div class="credit-chip">Gói cơ bản</div>
          <div class="credit-main-price">139.000đ <span>/tháng</span></div>
          <div class="credit-main-sub">
            Tặng kèm <strong>5.000 tín dụng</strong> để tạo video
          </div>
        </div>

        <div class="credit-section">
          <div class="credit-section-title">
            <v-icon size="15" color="#f59e0b">mdi-lightning-bolt</v-icon>
            Cách tính tín dụng
          </div>
          <div class="credit-rows">
            <div class="credit-row">
              <span>Video 8 giây</span>
              <span class="credit-cost">10 tín dụng</span>
            </div>
            <div class="credit-row">
              <span>Video 16 giây</span>
              <span class="credit-cost">20 tín dụng</span>
            </div>
            <div class="credit-row">
              <span>Video 24 giây</span>
              <span class="credit-cost">30 tín dụng</span>
            </div>
          </div>
          <div class="credit-note">Mỗi 8 giây video = 10 tín dụng</div>
        </div>

        <div class="credit-section">
          <div class="credit-section-title">
            <v-icon size="15" color="#10b981">mdi-plus-circle-outline</v-icon>
            Mua thêm tín dụng
          </div>
          <div class="credit-rows">
            <div class="credit-row">
              <span>2.000 tín dụng</span>
              <span class="credit-cost credit-cost--green">10.000đ</span>
            </div>
          </div>
        </div>

        <div class="credit-unlimited">
          <div class="credit-unlimited-title">
            <v-icon size="16" color="#8b5cf6">mdi-infinity</v-icon>
            Tạo không giới hạn
          </div>
          <div class="credit-unlimited-body">
            <div>Gói 139k + Tín dụng không giới hạn 200k</div>
            <div class="credit-unlimited-price">
              Chỉ <strong>339.000đ</strong>/tháng
            </div>
            <div class="credit-unlimited-sub">
              Tạo video thoải mái, không lo hết tín dụng
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- ── Video tutorial ─────────────────────────────────── -->
  <div class="video-section">
    <div class="video-section-label">
      <div class="video-section-badge">
        <v-icon size="15" color="#e53935">mdi-youtube</v-icon>
        Video hướng dẫn
      </div>
      <div class="video-section-title">Bắt đầu ngay chỉ trong vài phút</div>
      <div class="video-section-sub">
        Xem hướng dẫn đăng ký và sử dụng TN Solve để tạo video AI ngay hôm nay
      </div>
    </div>
    <div class="video-frame-wrap">
      <div class="video-frame-inner">
        <iframe
          src="https://www.youtube.com/embed/AFyTHzDbUwA"
          frameborder="0"
          allow="
            accelerometer;
            autoplay;
            clipboard-write;
            encrypted-media;
            gyroscope;
            picture-in-picture;
            web-share;
          "
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ─── Hero banner ────────────────────────────────────── */
.hero-banner {
  position: relative;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  border-radius: 0;
  background:
    repeating-linear-gradient(
      45deg,
      rgba(255,255,255,0.035) 0px,
      rgba(255,255,255,0.035) 1px,
      transparent 1px,
      transparent 28px
    ),
    repeating-linear-gradient(
      -45deg,
      rgba(255,255,255,0.035) 0px,
      rgba(255,255,255,0.035) 1px,
      transparent 1px,
      transparent 28px
    ),
    linear-gradient(135deg, #0f172a 0%, #1e3a5f 55%, #1565c0 100%);
  margin-top: -32px;
  margin-bottom: 24px;
  overflow: hidden;
  color: #fff;
}

.hero-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 48px 16px;
  position: relative;
  z-index: 1;
}

@media (max-width: 600px) {
  .hero-inner {
    padding: 36px 16px;
  }
}

.hero-glow {
  position: absolute;
  top: -60px;
  right: -60px;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(30, 136, 229, 0.35) 0%,
    transparent 70%
  );
  pointer-events: none;
}

.deco {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0.07;
  background: #fff;
}

.deco-1 {
  width: 180px;
  height: 180px;
  bottom: -50px;
  right: 60px;
}
.deco-2 {
  width: 90px;
  height: 90px;
  bottom: 30px;
  right: 200px;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 560px;
}

.hero-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.dot-live {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4ade80;
  animation: blink 1.5s ease-in-out infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.hero-heading {
  font-size: clamp(1.7rem, 4vw, 2.6rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
  letter-spacing: -0.5px;
  margin: 0;
}

.hero-name {
  color: #90caf9;
}

.hero-sub {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.72);
  margin: 0;
  line-height: 1.6;
}

.hero-price {
  color: #fcd34d;
}

.hero-ctas {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.cta-primary {
  color: #1e3a5f !important;
  font-weight: 700 !important;
}

.cta-ghost {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  text-decoration: none;
  transition:
    border-color 0.15s,
    background 0.15s;
}

.cta-ghost:hover {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.08);
}

/* ─── Quick cards ────────────────────────────────────── */
.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 28px;
}

@media (max-width: 800px) {
  .quick-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .quick-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}

.quick-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #f0f0f0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  text-decoration: none;
  color: inherit;
  transition:
    box-shadow 0.18s,
    border-color 0.18s,
    transform 0.18s;
}

.quick-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.09);
  border-color: #e0e0e0;
  transform: translateY(-2px);
}

.quick-card--highlight {
  border-color: #e9d5ff;
  background: #fdf4ff;
}

.quick-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
}

.quick-desc {
  font-size: 0.75rem;
  color: #9e9e9e;
  line-height: 1.4;
}

/* ─── Section block ──────────────────────────────────── */
.section-block {
  margin-bottom: 24px;
}

.section-header {
  margin-bottom: 10px;
}

.section-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #616161;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ─── Video section ──────────────────────────────────── */
.video-section {
  background:
    repeating-linear-gradient(
      45deg,
      rgba(255,255,255,0.035) 0px,
      rgba(255,255,255,0.035) 1px,
      transparent 1px,
      transparent 28px
    ),
    repeating-linear-gradient(
      -45deg,
      rgba(255,255,255,0.035) 0px,
      rgba(255,255,255,0.035) 1px,
      transparent 1px,
      transparent 28px
    ),
    linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 24px;
  display: flex;
  gap: 40px;
  align-items: center;
}

@media (max-width: 768px) {
  .video-section {
    flex-direction: column;
    padding: 24px 20px;
    gap: 24px;
    border-radius: 14px;
  }
  .video-frame-wrap {
    width: 100%;
  }
}

.video-section-label {
  flex: 0 0 260px;
  color: #fff;
}

@media (max-width: 768px) {
  .video-section-label {
    flex: none;
    width: 100%;
  }
}

.video-section-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.video-section-title {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.3;
  margin-bottom: 12px;
  color: #fff;
}

.video-section-sub {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
}

.video-frame-wrap {
  flex: 1;
  min-width: 0;
}

.video-frame-inner {
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.video-frame-inner iframe {
  display: block;
  width: 100%;
  aspect-ratio: 16/9;
  height: auto;
  border: 0;
}

/* ─── Credit dialog ──────────────────────────────────── */
.credit-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 8px;
}

.credit-dialog-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.credit-dialog-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #1565c0, #1e88e5);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(30, 136, 229, 0.3);
}

.credit-dialog-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
}

.credit-dialog-sub {
  font-size: 0.72rem;
  color: #9e9e9e;
  margin-top: 1px;
}

.credit-section {
  margin-bottom: 18px;
}

.credit-chip {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 700;
  color: #1e88e5;
  background: #e3f2fd;
  padding: 2px 10px;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 8px;
}

.credit-main-price {
  font-size: 1.8rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
}

.credit-main-price span {
  font-size: 1rem;
  font-weight: 400;
  color: #9e9e9e;
}

.credit-main-sub {
  font-size: 0.85rem;
  color: #64748b;
  margin-top: 4px;
}

.credit-section-title {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.credit-rows {
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
}

.credit-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 14px;
  font-size: 0.85rem;
  color: #374151;
  border-bottom: 1px solid #f5f5f5;
}

.credit-row:last-child {
  border-bottom: none;
}

.credit-cost {
  font-weight: 600;
  color: #1e88e5;
  background: #e3f2fd;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
}

.credit-cost--green {
  color: #10b981;
  background: #ecfdf5;
}

.credit-note {
  font-size: 0.75rem;
  color: #9e9e9e;
  margin-top: 6px;
  padding-left: 2px;
}

.credit-unlimited {
  background: linear-gradient(135deg, #fdf4ff, #eff6ff);
  border: 1px solid #e9d5ff;
  border-radius: 12px;
  padding: 14px;
}

.credit-unlimited-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  font-weight: 700;
  color: #7c3aed;
  margin-bottom: 8px;
}

.credit-unlimited-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 6px 0 3px;
}

.credit-unlimited-sub {
  font-size: 0.78rem;
  color: #64748b;
}
</style>
