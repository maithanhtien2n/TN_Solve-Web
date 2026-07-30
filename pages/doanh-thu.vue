<script setup lang="ts">
import { publicRevenueService } from "~/services/app";

definePageMeta({ layout: "public-revenue" });

// Không lưu password vào cookie/localStorage/session — chỉ giữ tạm trong bộ nhớ
// của trang này. Reload lại trang là mất, phải nhập lại mật khẩu từ đầu.
const password = ref("");
const unlocked = ref(false);
const loading = ref(false);
const errorMsg = ref("");

const viewType = ref<"today" | "week" | "month" | "custom">("today");
const dateFrom = ref("");
const dateTo = ref("");
const stats = ref<any>(null);

const viewOptions = [
  { title: "Hôm nay", value: "today", icon: "mdi-calendar-today" },
  { title: "Tuần này", value: "week", icon: "mdi-calendar-week" },
  { title: "Tháng này", value: "month", icon: "mdi-calendar-month" },
  { title: "Chọn ngày", value: "custom", icon: "mdi-calendar-range" },
];

async function fetchStats() {
  if (viewType.value === "custom" && !dateFrom.value) return;

  loading.value = true;
  errorMsg.value = "";

  try {
    const res = await publicRevenueService.getStats({
      password: password.value,
      viewType: viewType.value,
      dateFrom: viewType.value === "custom" ? dateFrom.value : undefined,
      dateTo: viewType.value === "custom" ? dateTo.value : undefined,
    });

    stats.value = res.data;
    unlocked.value = true;
  } catch (error: any) {
    unlocked.value = false;
    stats.value = null;
    errorMsg.value =
      error?.response?.data?.message || "Sai mật khẩu, vui lòng thử lại!";
  } finally {
    loading.value = false;
  }
}

async function onChangeView(type: "today" | "week" | "month" | "custom") {
  viewType.value = type;
  if (type !== "custom") await fetchStats();
}
</script>

<template>
  <div class="revenue-page">
    <div class="revenue-wrap">
      <transition name="fade" mode="out-in">
        <!-- Màn hình nhập mật khẩu -->
        <div v-if="!unlocked" key="lock" class="revenue-card lock-card">
          <img src="/images/tn-solve-logo.png" alt="TN Solve" class="brand-logo" />

          <div class="lock-icon">
            <v-icon size="30" color="white">mdi-lock-outline</v-icon>
          </div>

          <h1 class="revenue-title">Xem doanh thu</h1>
          <p class="revenue-subtitle">Nhập mật khẩu để tiếp tục</p>

          <v-text-field
            v-model="password"
            type="password"
            placeholder="Mật khẩu"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            hide-details
            class="mt-4"
            :error="Boolean(errorMsg)"
            @keyup.enter="fetchStats"
          />

          <p v-if="errorMsg" class="error-text">{{ errorMsg }}</p>

          <v-btn
            block
            color="primary"
            height="48"
            rounded="lg"
            elevation="0"
            class="mt-3"
            :loading="loading"
            @click="fetchStats"
          >
            Xem doanh thu
          </v-btn>
        </div>

        <!-- Nội dung doanh thu -->
        <div v-else key="stats" class="revenue-card">
          <img src="/images/tn-solve-logo.png" alt="TN Solve" class="brand-logo" />

          <div class="view-toggle">
            <button
              v-for="opt in viewOptions"
              :key="opt.value"
              class="view-btn"
              :class="{ active: viewType === opt.value }"
              @click="onChangeView(opt.value as any)"
            >
              <v-icon size="16" class="mr-1">{{ opt.icon }}</v-icon>
              {{ opt.title }}
            </button>
          </div>

          <transition name="fade" mode="out-in">
            <div v-if="viewType === 'custom'" key="range" class="range-box">
              <div class="range-inputs">
                <v-text-field
                  v-model="dateFrom"
                  type="date"
                  label="Từ ngày"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  hide-details
                />
                <span class="range-sep">
                  <v-icon size="16">mdi-arrow-right</v-icon>
                </span>
                <v-text-field
                  v-model="dateTo"
                  type="date"
                  label="Đến ngày (tùy chọn)"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  hide-details
                />
              </div>

              <v-btn
                block
                color="primary"
                height="46"
                rounded="lg"
                elevation="0"
                class="mt-3"
                :loading="loading"
                :disabled="!dateFrom"
                @click="fetchStats"
              >
                Xem doanh thu
              </v-btn>
            </div>
          </transition>

          <transition name="fade" mode="out-in">
            <div v-if="loading" key="loading" class="skeleton-box mt-4">
              <v-skeleton-loader type="card" height="110" rounded="lg" />
            </div>

            <div v-else-if="stats" key="data" class="mt-4">
              <div class="total-card">
                <div class="total-label">TỔNG DOANH THU</div>
                <div class="total-value">{{ formatCurrency(stats.total) }}</div>
              </div>

              <div class="breakdown-row">
                <div class="breakdown-item">
                  <v-icon size="16" color="#7c3aed">mdi-package-variant-closed</v-icon>
                  <span class="breakdown-label">Gói</span>
                  <span class="breakdown-value">{{ formatCurrency(stats.packageTotal) }}</span>
                </div>
                <div class="breakdown-item">
                  <v-icon size="16" color="#0284c7">mdi-circle-multiple-outline</v-icon>
                  <span class="breakdown-label">Tín dụng</span>
                  <span class="breakdown-value">{{ formatCurrency(stats.creditTotal) }}</span>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.revenue-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: linear-gradient(135deg, #eef2ff 0%, #f5f7ff 45%, #eaf6ff 100%);
}

@media (prefers-color-scheme: dark) {
  .revenue-page {
    background: linear-gradient(135deg, #0f1222 0%, #131a2b 50%, #101826 100%);
  }
}

.revenue-wrap {
  width: 100%;
  max-width: 420px;
}

.revenue-card {
  background: #fff;
  border-radius: 20px;
  padding: 32px 28px;
  box-shadow: 0 10px 40px rgba(30, 41, 100, 0.1);
}

@media (prefers-color-scheme: dark) {
  .revenue-card {
    background: #1a2036;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35);
  }
}

.lock-card {
  text-align: center;
}

.brand-logo {
  display: block;
  height: 36px;
  width: auto;
  max-width: 100%;
  object-fit: contain;
  margin: 0 auto 20px;
}

.lock-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4f6bf6, #7b8cf9);
}

.revenue-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #1e2433;
  margin: 0;
}

@media (prefers-color-scheme: dark) {
  .revenue-title {
    color: #f1f3fb;
  }
}

.revenue-subtitle {
  font-size: 0.85rem;
  color: #8b93a7;
  margin: 4px 0 0;
}

.error-text {
  color: #e0405c;
  font-size: 0.8rem;
  margin: 6px 0 0;
  text-align: left;
}

.view-toggle {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 4px;
}

.view-btn {
  flex: 1 1 calc(50% - 4px);
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 8px;
  border-radius: 12px;
  border: 1px solid #e3e7f0;
  background: #f8f9fc;
  color: #5b6478;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.view-btn:hover {
  background: #eef1fb;
}

.view-btn.active {
  background: linear-gradient(135deg, #4f6bf6, #7b8cf9);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 4px 12px rgba(79, 107, 246, 0.35);
}

@media (prefers-color-scheme: dark) {
  .view-btn {
    background: #232a42;
    border-color: #2d3654;
    color: #aab2c8;
  }
  .view-btn:hover {
    background: #2a3252;
  }
}

.range-box {
  margin-top: 14px;
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-inputs > .v-text-field {
  flex: 1 1 0;
  min-width: 0;
}

.range-sep {
  color: #9aa2b6;
  flex-shrink: 0;
}

@media (max-width: 420px) {
  .range-inputs {
    flex-direction: column;
    align-items: stretch;
  }
  .range-sep {
    display: none;
  }
}

.skeleton-box {
  min-height: 110px;
}

.total-card {
  border-radius: 16px;
  padding: 22px 20px;
  text-align: center;
  background: linear-gradient(135deg, #3a5bfa, #6d8bff);
  box-shadow: 0 8px 24px rgba(58, 91, 250, 0.3);
}

.total-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.6px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 6px;
}

.total-value {
  font-size: clamp(1.4rem, 6vw, 1.8rem);
  font-weight: 800;
  color: #fff;
  word-break: break-word;
}

.breakdown-row {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.breakdown-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 12px 8px;
  border-radius: 12px;
  background: #f8f9fc;
}

@media (prefers-color-scheme: dark) {
  .breakdown-item {
    background: #232a42;
  }
}

.breakdown-label {
  font-size: 0.72rem;
  color: #8b93a7;
  font-weight: 600;
}

.breakdown-value {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1e2433;
}

@media (prefers-color-scheme: dark) {
  .breakdown-value {
    color: #f1f3fb;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 400px) {
  .revenue-card {
    padding: 24px 18px;
    border-radius: 16px;
  }
}
</style>
