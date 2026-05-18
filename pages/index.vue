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
            <span class="hero-name">{{
              userData?.name?.split(" ").pop()
            }}</span>
            👋
          </h1>
          <p class="hero-sub">
            Sẵn sàng tạo video AI chuyên nghiệp ngay hôm nay?
          </p>
          <div class="hero-ctas" style="margin-top: 8px">
            <button class="cta-primary" @click="router.push('/video/create')">
              <span class="cta-primary__glow" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path
                  d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"
                />
              </svg>
              Tạo video
            </button>
          </div>
        </template>

        <template v-else>
          <h1 class="hero-heading">
            Tạo video AI <br />
            chuyên nghiệp
          </h1>
          <div class="hero-price-block">
            <span class="hero-price-only">139.000đ</span>
            <div class="hero-price-right">
              <span class="hero-price-per">/tháng</span>
              <span class="hero-price-desc">không giới hạn tính năng</span>
            </div>
          </div>
          <div class="hero-ctas">
            <button class="cta-primary" @click="router.push('/payment')">
              <span class="cta-primary__glow" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.76.71-1.96-.05-2.71a2.03 2.03 0 0 0-2.95-.29z"
                />
                <path
                  d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"
                />
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
              </svg>
              Đăng ký ngay
            </button>
            <a
              href="https://zalo.me/0343027232"
              target="_blank"
              class="cta-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                />
              </svg>
              Tư vấn Zalo
            </a>
          </div>
        </template>
      </div>

      <!-- Right visual -->
      <div class="hero-visual">
        <div class="hv-card">
          <div class="hv-screen">
            <div class="hv-screen-bg" />
            <div class="hv-play">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <div class="hv-bar">
              <div class="hv-bar-fill" />
            </div>
          </div>
          <div class="hv-info">
            <div class="hv-info-dot" />
            <span>Video AI đang xử lý…</span>
          </div>
          <div class="hv-tags">
            <span class="hv-tag">HD 1080p</span>
            <span class="hv-tag">Tạo tự động</span>
            <span class="hv-tag">Xuất nhanh</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Decorative circles -->
    <div class="deco deco-1" />
    <div class="deco deco-2" />
  </div>

  <!-- ── Quick cards ─────────────────────────────────────── -->
  <div class="quick-grid">
    <router-link v-if="isSubscribed" to="/video" class="quick-card qc-blue">
      <div class="quick-icon">
        <v-icon color="#1e88e5" size="22">mdi-play-circle-outline</v-icon>
      </div>
      <div class="quick-card-body">
        <div class="quick-label">Thư viện</div>
        <div class="quick-desc">Xem lại các video đã tạo</div>
      </div>
    </router-link>

    <div
      v-else
      class="quick-card qc-blue"
      @click="showCredit = true"
      style="cursor: pointer"
    >
      <div class="quick-icon">
        <v-icon color="#1e88e5" size="22">mdi-diamond-stone</v-icon>
      </div>
      <div class="quick-card-body">
        <div class="quick-label">Gói 139k/tháng</div>
        <div class="quick-desc">Xem chi tiết gói & tín dụng</div>
      </div>
    </div>

    <router-link to="/video/public" class="quick-card qc-green">
      <div class="quick-icon">
        <v-icon color="#10b981" size="22">mdi-earth</v-icon>
      </div>
      <div class="quick-card-body">
        <div class="quick-label">Cộng đồng</div>
        <div class="quick-desc">Thước phim từ mọi người</div>
      </div>
    </router-link>

    <a
      href="https://zalo.me/g/p8hls5tonlfkqmyfndmx"
      target="_blank"
      class="quick-card qc-orange"
    >
      <div class="quick-icon">
        <v-icon color="#f59e0b" size="22">mdi-account-group-outline</v-icon>
      </div>
      <div class="quick-card-body">
        <div class="quick-label">Nhóm Zalo</div>
        <div class="quick-desc">Tin tức & hỗ trợ mỗi ngày</div>
      </div>
    </a>

    <router-link
      v-if="!isSubscribed"
      to="/payment"
      class="quick-card qc-purple"
    >
      <div class="quick-icon">
        <v-icon color="#8b5cf6" size="22">mdi-crown-outline</v-icon>
      </div>
      <div class="quick-card-body">
        <div class="quick-label">Nâng cấp</div>
        <div class="quick-desc">Chỉ 139.000đ/tháng</div>
      </div>
    </router-link>

    <router-link v-else to="/documents" class="quick-card qc-purple">
      <div class="quick-icon">
        <v-icon color="#8b5cf6" size="22">mdi-book-open-outline</v-icon>
      </div>
      <div class="quick-card-body">
        <div class="quick-label">Trợ lý AI</div>
        <div class="quick-desc">Gợi ý & viết prompt video thông minh</div>
      </div>
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
      rgba(255, 255, 255, 0.035) 0px,
      rgba(255, 255, 255, 0.035) 1px,
      transparent 1px,
      transparent 28px
    ),
    repeating-linear-gradient(
      -45deg,
      rgba(255, 255, 255, 0.035) 0px,
      rgba(255, 255, 255, 0.035) 1px,
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
  display: flex;
  align-items: center;
  gap: 48px;
}

@media (max-width: 900px) {
  .hero-inner {
    gap: 28px;
  }
  .hero-visual {
    display: none;
  }
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
  flex: 1;
  min-width: 0;
}

/* ─── Hero visual (right col) ────────────────────────── */
.hero-visual {
  flex-shrink: 0;
  width: 320px;
  position: relative;
}

.hv-card {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 14px;
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* mock video screen */
.hv-screen {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 10px;
  overflow: hidden;
  background: #0d1117;
}

.hv-screen-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #0d1b2a 0%, #1a3a5c 60%, #1e5fa0 100%);
  opacity: 0.9;
}

.hv-play {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.9);
  z-index: 1;
}

.hv-play svg {
  filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.4));
  animation: pulse-play 2s ease-in-out infinite;
}

@keyframes pulse-play {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.85;
  }
  50% {
    transform: scale(1.12);
    opacity: 1;
  }
}

/* progress bar */
.hv-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.15);
  z-index: 1;
}

.hv-bar-fill {
  height: 100%;
  width: 62%;
  background: linear-gradient(90deg, #38bdf8, #818cf8);
  border-radius: 2px;
  animation: progress-fill 3s ease-in-out infinite alternate;
}

@keyframes progress-fill {
  from {
    width: 30%;
  }
  to {
    width: 85%;
  }
}

/* info row */
.hv-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.7);
}

.hv-info-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #38bdf8;
  flex-shrink: 0;
  animation: pulse 1.6s ease-in-out infinite;
}

/* tags */
.hv-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.hv-tag {
  font-size: 0.68rem;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 999px;
  background: rgba(56, 189, 248, 0.15);
  color: #7dd3fc;
  border: 1px solid rgba(56, 189, 248, 0.25);
}

/* floating stats */
.hv-stat {
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 8px 14px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  animation: float-stat 4s ease-in-out infinite;
}

.hv-stat-1 {
  top: -18px;
  right: -18px;
  animation-delay: 0s;
}

.hv-stat-2 {
  bottom: -18px;
  left: -18px;
  animation-delay: 2s;
}

@keyframes float-stat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

.hv-stat-num {
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
}

.hv-stat-label {
  font-size: 0.65rem;
  color: #64748b;
  white-space: nowrap;
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

.hero-price-block {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0 4px;
  background: rgba(252, 211, 77, 0.1);
  border: 1px solid rgba(252, 211, 77, 0.35);
  border-radius: 12px;
  padding: 10px 18px 10px 14px;
}

.hero-price-only {
  font-size: 2.4rem;
  font-weight: 900;
  color: #fcd34d;
  letter-spacing: -1px;
  line-height: 1;
  text-shadow: 0 0 24px rgba(252, 211, 77, 0.5);
}

.hero-price-right {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.hero-price-per {
  font-size: 1rem;
  font-weight: 700;
  color: #fcd34d;
  opacity: 0.85;
  line-height: 1.2;
}

.hero-price-desc {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.3;
}

@media (max-width: 600px) {
  .hero-price-only {
    font-size: 1.9rem;
  }
}

.hero-ctas {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 4px;
}

/* ─── CTA primary ────────────────────────────────────── */
.cta-primary {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 13px 26px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  background: #fff;
  box-shadow:
    0 4px 20px rgba(255, 255, 255, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  overflow: hidden;
  transition:
    transform 0.18s,
    box-shadow 0.18s;
  letter-spacing: -0.2px;
}

.cta-primary__glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    120deg,
    transparent 40%,
    rgba(255, 255, 255, 0.35) 50%,
    transparent 60%
  );
  transform: translateX(-100%);
  transition: transform 1.4s ease;
  pointer-events: none;
}

.cta-primary:hover {
  transform: translateY(-2px);
  box-shadow:
    0 8px 28px rgba(255, 255, 255, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.cta-primary:hover .cta-primary__glow {
  transform: translateX(100%);
}

.cta-primary:active {
  transform: translateY(0);
}

/* ─── CTA ghost ──────────────────────────────────────── */
.cta-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 22px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  border: 1.5px solid rgba(255, 255, 255, 0.28);
  background: rgba(255, 255, 255, 0.06);
  text-decoration: none;
  backdrop-filter: blur(4px);
  transition:
    border-color 0.18s,
    background 0.18s,
    transform 0.18s;
  letter-spacing: -0.2px;
}

.cta-ghost:hover {
  border-color: rgba(255, 255, 255, 0.65);
  background: rgba(255, 255, 255, 0.13);
  transform: translateY(-2px);
}

.cta-ghost:active {
  transform: translateY(0);
}

/* ─── Quick cards ────────────────────────────────────── */
.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
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
  gap: 12px;
  padding: 18px;
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  border: 1px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  transition:
    transform 0.18s,
    box-shadow 0.18s;
  position: relative;
  overflow: hidden;
}

/* shimmer sweep on hover */
.quick-card::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 45%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent 0%,
    rgba(255, 255, 255, 0.6) 50%,
    transparent 100%
  );
  transform: skewX(-15deg) translateX(-250%);
  pointer-events: none;
}

.quick-card:hover::after {
  animation: card-shimmer 1.8s ease forwards;
}

@keyframes card-shimmer {
  from {
    transform: skewX(-15deg) translateX(-250%);
  }
  to {
    transform: skewX(-15deg) translateX(500%);
  }
}

.quick-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.qc-blue {
  background: #eff6ff;
  border-color: #bfdbfe;
}
.qc-green {
  background: #ecfdf5;
  border-color: #a7f3d0;
}
.qc-orange {
  background: #fffbeb;
  border-color: #fde68a;
}
.qc-purple {
  background: #f5f3ff;
  border-color: #ddd6fe;
}

.qc-blue:hover {
  box-shadow: 0 8px 24px rgba(30, 136, 229, 0.18);
}
.qc-green:hover {
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.18);
}
.qc-orange:hover {
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.18);
}
.qc-purple:hover {
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.18);
}

.quick-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qc-blue .quick-icon {
  background: #dbeafe;
}
.qc-green .quick-icon {
  background: #d1fae5;
}
.qc-orange .quick-icon {
  background: #fef3c7;
}
.qc-purple .quick-icon {
  background: #ede9fe;
}

.quick-card-body {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.quick-label {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
}

.quick-desc {
  font-size: 0.8rem;
  color: #64748b;
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
      rgba(255, 255, 255, 0.035) 0px,
      rgba(255, 255, 255, 0.035) 1px,
      transparent 1px,
      transparent 28px
    ),
    repeating-linear-gradient(
      -45deg,
      rgba(255, 255, 255, 0.035) 0px,
      rgba(255, 255, 255, 0.035) 1px,
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
