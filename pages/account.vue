<script setup lang="ts">
import { accountService } from "~/services/account";

const { isMobile } = useDevice();
const { onGetterUserData: userData } = useAppStore();

useSeo({
  title: "Tài khoản",
  description: "Quản lý tài khoản TN Solve - Xem lịch sử gói dịch vụ, tín dụng và thông tin cá nhân của bạn.",
  keywords: "tài khoản TN Solve, quản lý tài khoản, lịch sử dịch vụ",
});

useHead({ meta: [{ name: "robots", content: "noindex, nofollow" }] });

const tab = ref("packages");
const packageHistory = ref<any>([]);
const creditHistory = ref<any>([]);

const formatDate = (iso: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const serviceStatus = computed(() => {
  if (userData.value?.role === EnumAccountRole.ADMIN)
    return { label: "Quản trị viên", color: "#7c3aed", bg: "#f3e8ff" };
  if (userData.value?.serviceExpiry)
    return userData.value?.remainingTime
      ? { label: `Còn ${userData.value.remainingTime}`, color: "#059669", bg: "#ecfdf5" }
      : { label: "Đã hết hạn", color: "#dc2626", bg: "#fef2f2" };
  return { label: "Chưa đăng ký", color: "#64748b", bg: "#f1f5f9" };
});

onMounted(async () => {
  await accountService.getMyPackageHistory({}).then((res) => { packageHistory.value = res.data; });
  await accountService.getMyCreditHistory({}).then((res) => { creditHistory.value = res.data; });
});

definePageMeta({ middleware: "auth" });
</script>

<template>
  <div v-if="!userData?.email" class="d-flex justify-center flex-column align-center ga-3 pt-10 pb-16">
    <v-progress-circular width="2" size="40" color="primary" indeterminate />
    Đang tải dữ liệu...
  </div>

  <div v-else class="account-wrap">

    <!-- Profile card -->
    <div class="profile-card">
      <div class="profile-main">
        <v-avatar size="80" class="profile-avatar">
          <v-img :src="userData?.avatar" cover />
        </v-avatar>

        <div class="profile-info">
          <div class="profile-name">{{ userData?.name }}</div>
          <div class="profile-email">{{ userData?.email }}</div>
          <div class="profile-badge" :style="{ color: serviceStatus.color, background: serviceStatus.bg }">
            <span class="badge-dot" :style="{ background: serviceStatus.color }" />
            {{ serviceStatus.label }}
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="profile-stats">
        <div class="stat-item">
          <div class="stat-icon" style="background: #eff6ff">
            <v-icon size="18" color="#1e88e5">mdi-circle-multiple-outline</v-icon>
          </div>
          <div>
            <div class="stat-label">Tín dụng</div>
            <div class="stat-value">
              <template v-if="userData?.settings?.unlimitedVideo">
                <v-icon size="14">mdi-infinity</v-icon> {{ userData.settings.unlimitedVideo }} ngày
              </template>
              <template v-else>{{ (userData?.settings?.credit || 0).toLocaleString("vi-VN") }}</template>
            </div>
          </div>
        </div>

        <div class="stat-divider" />

        <div class="stat-item">
          <div class="stat-icon" style="background: #f0fdf4">
            <v-icon size="18" color="#059669">mdi-calendar-check-outline</v-icon>
          </div>
          <div>
            <div class="stat-label">Hết hạn</div>
            <div class="stat-value">{{ formatDate(userData?.serviceExpiry) }}</div>
          </div>
        </div>

        <div class="stat-divider" />

        <div class="stat-item">
          <div class="stat-icon" style="background: #fdf4ff">
            <v-icon size="18" color="#9333ea">mdi-package-variant-closed</v-icon>
          </div>
          <div>
            <div class="stat-label">Lịch sử gói</div>
            <div class="stat-value">{{ packageHistory.length }} gói</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tab-section">
      <div class="tab-bar">
        <div
          class="tab-item"
          :class="{ 'tab-item--active': tab === 'packages' }"
          @click="tab = 'packages'"
        >
          <v-icon size="16">mdi-package-variant-closed</v-icon>
          Lịch sử gói
        </div>
        <div
          class="tab-item"
          :class="{ 'tab-item--active': tab === 'credits' }"
          @click="tab = 'credits'"
        >
          <v-icon size="16">mdi-database-clock-outline</v-icon>
          Lịch sử tín dụng
        </div>
      </div>

      <!-- Package history -->
      <div v-show="tab === 'packages'" class="tab-content">
        <div v-if="!packageHistory.length" class="empty-state">
          <v-icon size="40" color="#cbd5e1">mdi-package-variant</v-icon>
          <div>Chưa có lịch sử gói</div>
        </div>
        <table v-else class="data-table">
          <thead>
            <tr>
              <th>Gói mua</th>
              <th>Giá tiền</th>
              <th class="text-right">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in packageHistory" :key="item.id">
              <td>
                <div class="cell-title">{{ item.note }}</div>
                <div class="cell-sub">{{ item.serviceStartDate }} → {{ item.serviceExpiry }}</div>
              </td>
              <td>
                <div class="cell-price">{{ formatCurrency(item.price) }}</div>
                <div v-if="+item.discount" class="cell-discount">Giảm {{ formatCurrency(+item.discount) }}</div>
              </td>
              <td class="text-right">
                <span class="status-chip" :class="`status-${item.statusColor}`">{{ item.statusText }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Credit history -->
      <div v-show="tab === 'credits'" class="tab-content">
        <div v-if="!creditHistory.length" class="empty-state">
          <v-icon size="40" color="#cbd5e1">mdi-database-off-outline</v-icon>
          <div>Chưa có lịch sử tín dụng</div>
        </div>
        <table v-else class="data-table">
          <thead>
            <tr>
              <th>Tín dụng</th>
              <th>Giá tiền</th>
              <th class="text-right">Thời gian</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in creditHistory" :key="item.id">
              <td>
                <div class="cell-title">
                  {{ item.creditAmount === -1 ? "Không giới hạn 💎" : `Mua ${item.creditAmount} 💎` }}
                  <span v-if="[11000, 24000].includes(item.creditAmount)" class="cell-bonus">
                    +{{ item.creditAmount === 11000 ? "1,000" : "4,000" }} KM
                  </span>
                </div>
                <div v-if="item.creditAmount === -1" class="cell-sub">
                  {{ item.serviceStartDate }} → {{ item.serviceExpiry }}
                </div>
              </td>
              <td>
                <div class="cell-price">{{ formatCurrency(item.price) }}</div>
                <div v-if="+item.discount" class="cell-discount">Giảm {{ formatCurrency(+item.discount) }}</div>
              </td>
              <td class="text-right">
                <div class="cell-date">{{ item.serviceStartDate }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<style scoped>
.account-wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 60px;
}

/* ─── Profile card ───────────────────────────────────── */
.profile-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  overflow: hidden;
}

.profile-main {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
}

.profile-avatar {
  border: 3px solid #e5e7eb;
  flex-shrink: 0;
}

.profile-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}

.profile-email {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 10px;
}

.profile-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Stats */
.profile-stats {
  display: flex;
  align-items: center;
  gap: 0;
  border-top: 1px solid #f0f0f0;
  padding: 0 24px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
  flex: 1;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #f0f0f0;
  margin: 0 24px;
}

.stat-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-label {
  font-size: 0.73rem;
  color: #94a3b8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.stat-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
  margin-top: 1px;
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 600px) {
  .profile-stats { flex-direction: column; align-items: flex-start; padding: 0 16px; }
  .stat-divider { width: 100%; height: 1px; margin: 0; }
  .stat-item { width: 100%; }
}

/* ─── Tabs ───────────────────────────────────────────── */
.tab-section {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  overflow: hidden;
}

.tab-bar {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 8px;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 14px 18px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: color 0.18s, border-color 0.18s;
  white-space: nowrap;
}

.tab-item:hover { color: #1e88e5; }

.tab-item--active {
  color: #1e88e5;
  border-bottom-color: #1e88e5;
  font-weight: 600;
}

.tab-content { padding: 0; }

/* ─── Table ──────────────────────────────────────────── */
.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  padding: 12px 20px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #94a3b8;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  text-align: left;
}

.data-table td {
  padding: 14px 20px;
  border-bottom: 1px solid #f8f8f8;
  vertical-align: middle;
}

.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: #fafcff; }

.cell-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 6px;
}

.cell-sub {
  font-size: 0.775rem;
  color: #94a3b8;
  margin-top: 3px;
}

.cell-price {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1e88e5;
}

.cell-discount {
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 2px;
}

.cell-date {
  font-size: 0.875rem;
  font-weight: 600;
  color: #059669;
}

.cell-bonus {
  font-size: 0.7rem;
  font-weight: 600;
  color: #f59e0b;
  background: #fffbeb;
  padding: 1px 7px;
  border-radius: 999px;
}

.status-chip {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-success { background: #ecfdf5; color: #059669; }
.status-warning { background: #fffbeb; color: #d97706; }
.status-error   { background: #fef2f2; color: #dc2626; }
.status-grey    { background: #f1f5f9; color: #64748b; }

/* ─── Empty state ────────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 48px 20px;
  color: #94a3b8;
  font-size: 0.875rem;
}

</style>
