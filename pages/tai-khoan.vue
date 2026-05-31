<script setup lang="ts">
import { accountService } from "~/services/account";
import { shopService } from "~/services/shop";
import { refundRequestService } from "~/services/refund-request";

const { isMobile } = useDevice();
const { onGetterUserData: userData } = useAppStore();

useSeo({
  title: "Tài khoản",
  description:
    "Quản lý tài khoản TN Solve - Xem lịch sử gói dịch vụ, tín dụng và thông tin cá nhân của bạn.",
  keywords: "tài khoản TN Solve, quản lý tài khoản, lịch sử dịch vụ",
});

useHead({ meta: [{ name: "robots", content: "noindex, nofollow" }] });

const tab = ref("packages");
const tabBarRef = ref<HTMLElement | null>(null);
const selectTab = (name: string) => {
  tab.value = name;
  nextTick(() => {
    const active = tabBarRef.value?.querySelector(
      ".tab-item--active",
    ) as HTMLElement;
    active?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  });
};
const packageHistory = ref<any>([]);
const creditHistory = ref<any>([]);
const shopOrders = ref<any[]>([]);
const myRefunds = ref<any[]>([]);

const refundPopup = ref(false);
const refundEnabled = ref(true);

async function onRefundSubmitted() {
  const res = await refundRequestService.getMy({}).catch(() => null);
  if (res?.data?.docs) myRefunds.value = res.data.docs;
}

const refundStatusMap: Record<string, { label: string; color: string }> = {
  pending: { label: "Chờ duyệt", color: "#d97706" },
  approved: { label: "Đã hoàn tiền", color: "#059669" },
  rejected: { label: "Từ chối", color: "#dc2626" },
};

const refundTypeMap: Record<string, string> = {
  all: "Hoàn toàn bộ",
  subscription: "Gói dịch vụ",
  credit: "Tín dụng",
};

const formatDate = (iso: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const serviceStatus = computed(() => {
  if (userData.value?.role === EnumAccountRole.ADMIN)
    return { label: "Quản trị viên", color: "#7c3aed", bg: "#f3e8ff" };
  if (userData.value?.serviceExpiry)
    return userData.value?.remainingTime
      ? {
          label: `Còn ${userData.value.remainingTime}`,
          color: "#059669",
          bg: "#ecfdf5",
        }
      : { label: "Đã hết hạn", color: "#dc2626", bg: "#fef2f2" };
  return { label: "Chưa đăng ký", color: "#64748b", bg: "#f1f5f9" };
});

const shopStatusMap: Record<string, { label: string; cls: string }> = {
  pending: { label: "Chờ thanh toán", cls: "status-warning" },
  completed: { label: "Hoàn thành", cls: "status-success" },
  failed: { label: "Thất bại", cls: "status-error" },
};

const selectedOrder = ref<any>(null);
const copiedField = ref<string>("");
const copyText = async (text: string, field: string) => {
  await navigator.clipboard.writeText(text);
  copiedField.value = field;
  setTimeout(() => {
    copiedField.value = "";
  }, 1500);
};

onMounted(async () => {
  const [pkg, credit, shop, refunds, refundCheck] = await Promise.allSettled([
    accountService.getMyPackageHistory({}),
    accountService.getMyCreditHistory({}),
    shopService.getMyShopOrders(),
    refundRequestService.getMy({}),
    refundRequestService.previewAll(),
  ]);
  if (pkg.status === "fulfilled") packageHistory.value = pkg.value?.data || [];
  if (credit.status === "fulfilled")
    creditHistory.value = credit.value?.data || [];
  if (shop.status === "fulfilled") shopOrders.value = shop.value?.data || [];
  if (refunds.status === "fulfilled")
    myRefunds.value = refunds.value?.data?.docs || [];
  if (refundCheck.status === "fulfilled")
    refundEnabled.value = !refundCheck.value?.data?.error?.includes("không khả dụng");
});

definePageMeta({ middleware: "auth" });
</script>

<template>
  <div
    v-if="!userData?.email"
    class="d-flex justify-center flex-column align-center ga-3 pt-10 pb-16"
  >
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
          <div
            class="profile-badge"
            :style="{
              color: serviceStatus.color,
              background: serviceStatus.bg,
            }"
          >
            <span
              class="badge-dot"
              :style="{ background: serviceStatus.color }"
            />
            {{ serviceStatus.label }}
          </div>
        </div>

        <button v-if="refundEnabled" class="refund-all-btn" @click="refundPopup = true">
          <v-icon size="14">mdi-cash-refund</v-icon>
          Yêu cầu hoàn tiền
        </button>
      </div>

      <!-- Stats -->
      <div class="profile-stats">
        <div class="stat-item">
          <div class="stat-icon" style="background: #eff6ff">
            <v-icon size="18" color="#1e88e5"
              >mdi-circle-multiple-outline</v-icon
            >
          </div>
          <div>
            <div class="stat-label">Tín dụng</div>
            <div class="stat-value">
              <template v-if="userData?.settings?.unlimitedVideo">
                <v-icon size="14">mdi-infinity</v-icon>
                {{ userData.settings.unlimitedVideo }} ngày
              </template>
              <template v-else>{{
                (userData?.settings?.credit || 0).toLocaleString("vi-VN")
              }}</template>
            </div>
          </div>
        </div>

        <div class="stat-divider" />

        <div class="stat-item">
          <div class="stat-icon" style="background: #f0fdf4">
            <v-icon size="18" color="#059669"
              >mdi-calendar-check-outline</v-icon
            >
          </div>
          <div>
            <div class="stat-label">Hết hạn</div>
            <div class="stat-value">
              {{ formatDate(userData?.serviceExpiry) }}
            </div>
          </div>
        </div>

        <div class="stat-divider" />

        <div class="stat-item">
          <div class="stat-icon" style="background: #fdf4ff">
            <v-icon size="18" color="#9333ea"
              >mdi-package-variant-closed</v-icon
            >
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
      <div ref="tabBarRef" class="tab-bar">
        <div
          class="tab-item"
          :class="{ 'tab-item--active': tab === 'packages' }"
          @click="selectTab('packages')"
        >
          <v-icon size="16">mdi-package-variant-closed</v-icon>
          Lịch sử gói
        </div>
        <div
          class="tab-item"
          :class="{ 'tab-item--active': tab === 'credits' }"
          @click="selectTab('credits')"
        >
          <v-icon size="16">mdi-database-clock-outline</v-icon>
          Lịch sử tín dụng
        </div>
        <div
          class="tab-item"
          :class="{ 'tab-item--active': tab === 'shop' }"
          @click="selectTab('shop')"
        >
          <v-icon size="16">mdi-shopping-outline</v-icon>
          Lịch sử mua hàng
        </div>
        <div
          class="tab-item"
          :class="{ 'tab-item--active': tab === 'refunds' }"
          @click="selectTab('refunds')"
        >
          <v-icon size="16">mdi-cash-refund</v-icon>
          Hoàn tiền
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
                <div class="cell-sub">
                  {{ item.serviceStartDate }} → {{ item.serviceExpiry }}
                </div>
              </td>
              <td>
                <div class="cell-price">{{ formatCurrency(item.price) }}</div>
                <div v-if="+item.discount" class="cell-discount">
                  Giảm {{ formatCurrency(+item.discount) }}
                </div>
              </td>
              <td class="text-right">
                <span
                  class="status-chip"
                  :class="`status-${item.statusColor}`"
                  >{{ item.statusText }}</span
                >
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
                  {{
                    item.creditAmount === -1
                      ? "Không giới hạn 💎"
                      : `Mua ${item.creditAmount} 💎`
                  }}
                  <span
                    v-if="[11000, 24000].includes(item.creditAmount)"
                    class="cell-bonus"
                  >
                    +{{ item.creditAmount === 11000 ? "1,000" : "4,000" }} KM
                  </span>
                </div>
                <div v-if="item.creditAmount === -1" class="cell-sub">
                  {{ item.serviceStartDate }} → {{ item.serviceExpiry }}
                </div>
              </td>
              <td>
                <div class="cell-price">{{ formatCurrency(item.price) }}</div>
                <div v-if="+item.discount" class="cell-discount">
                  Giảm {{ formatCurrency(+item.discount) }}
                </div>
              </td>
              <td class="text-right">
                <div class="cell-date">{{ item.serviceStartDate }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Refund history -->
      <div v-show="tab === 'refunds'" class="tab-content">
        <div v-if="!myRefunds.length" class="empty-state">
          <v-icon size="40" color="#cbd5e1">mdi-cash-refund</v-icon>
          <div>Chưa có yêu cầu hoàn tiền nào</div>
        </div>
        <table v-else class="data-table">
          <thead>
            <tr>
              <th>Ngày gửi</th>
              <th>Tiền gốc</th>
              <th>Tiền hoàn</th>
              <th>Ngân hàng</th>
              <th>Lý do</th>
              <th class="text-right">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in myRefunds" :key="item._id">
              <td>
                <div class="cell-sub">{{ item.createdAt }}</div>
              </td>
              <td>
                <div class="cell-price">
                  {{ formatCurrency(item.originalAmount) }}
                </div>
              </td>
              <td>
                <div class="cell-price" style="color: #059669">
                  {{ formatCurrency(item.refundAmount) }}
                </div>
              </td>
              <td>
                <div class="cell-title" style="font-size: 0.8rem">
                  {{ item.bankName }}
                </div>
                <div class="cell-sub">{{ item.bankAccount }}</div>
              </td>
              <td>
                <div class="cell-sub">
                  {{ item.reason }}
                </div>
                <div
                  v-if="item.adminNote"
                  class="cell-sub"
                  style="color: #f59e0b"
                >
                  {{ item.adminNote }}
                </div>
              </td>
              <td class="text-right">
                <div>
                  <span
                    class="status-chip"
                    :style="{
                      background: refundStatusMap[item.status]?.color + '18',
                      color: refundStatusMap[item.status]?.color,
                    }"
                  >
                    {{ refundStatusMap[item.status]?.label || item.status }}
                  </span>
                </div>
                <div
                  v-if="item.status === 'approved'"
                  class="cell-sub mt-1"
                  style="color: #059669; font-size: 0.72rem"
                >
                  Vui lòng kiểm tra tài khoản ngân hàng của bạn
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Shop order history -->
      <div v-show="tab === 'shop'" class="tab-content">
        <div v-if="!shopOrders.length" class="empty-state">
          <v-icon size="40" color="#cbd5e1">mdi-shopping-outline</v-icon>
          <div>Chưa có lịch sử mua hàng</div>
        </div>

        <div v-else class="shop-order-list">
          <div
            v-for="order in shopOrders"
            :key="order.orderCode"
            class="shop-order-card"
            :class="`order--${order.status}`"
          >
            <!-- Row 1: name + badge -->
            <div class="order-row-top">
              <div class="order-name">{{ order.productName }}</div>
              <span
                class="status-chip"
                :class="shopStatusMap[order.status]?.cls || 'status-grey'"
              >
                {{ shopStatusMap[order.status]?.label || order.status }}
              </span>
            </div>

            <!-- Row 2: meta + amount -->
            <div class="order-row-meta">
              <span class="order-meta-text">
                {{ formatDate(order.createdAt) }}
                · {{ order.quantity }} tài khoản
              </span>
              <span class="order-amount">{{
                formatCurrency(order.totalAmount)
              }}</span>
            </div>

            <!-- Error (failed) -->
            <div v-if="order.errorMessage" class="order-error-inline">
              <v-icon size="13" color="#ef4444"
                >mdi-alert-circle-outline</v-icon
              >
              {{ order.errorMessage }}
            </div>

            <!-- Xem tài khoản (completed) -->
            <div
              v-if="
                order.status === 'completed' && order.deliveredAccounts?.length
              "
              class="order-toggle"
              @click="selectedOrder = order"
            >
              <v-icon size="14">mdi-key-outline</v-icon>
              Xem thông tin tài khoản
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Popup hoàn tiền: v-if để remount sạch mỗi lần mở -->
  <PopupRefundRequest
    v-if="refundPopup"
    v-model="refundPopup"
    @submitted="onRefundSubmitted"
  />

  <!-- Popup chi tiết đơn hàng -->
  <v-dialog v-model="selectedOrder" max-width="480" scrollable>
    <v-card v-if="selectedOrder" rounded="xl" elevation="0">
      <!-- Header -->
      <div class="od-header">
        <span class="od-header-title">🎉 Chi tiết đơn hàng</span>
        <button class="popup-close" @click="selectedOrder = null">
          <v-icon size="20">mdi-close</v-icon>
        </button>
      </div>

      <div class="od-body">
        <!-- Thông tin đơn -->
        <div class="od-summary">
          <div class="od-summary-row">
            <span>Sản phẩm</span>
            <strong>{{ selectedOrder.productName }}</strong>
          </div>
          <div class="od-summary-row">
            <span>Số lượng</span>
            <strong>{{ selectedOrder.quantity }} tài khoản</strong>
          </div>
          <div class="od-summary-row">
            <span>Tổng tiền</span>
            <strong class="od-amount">{{
              formatCurrency(selectedOrder.totalAmount)
            }}</strong>
          </div>
          <div class="od-summary-row">
            <span>Ngày mua</span>
            <strong>{{ formatDate(selectedOrder.createdAt) }}</strong>
          </div>
          <div class="od-summary-row">
            <span>Mã đơn</span>
            <strong class="od-code">{{ selectedOrder.orderCode }}</strong>
          </div>
        </div>

        <!-- Danh sách tài khoản -->
        <div class="od-accounts">
          <div
            v-for="(acc, i) in selectedOrder.deliveredAccounts"
            :key="i"
            class="od-acc-card"
          >
            <div class="od-acc-header">
              <v-icon size="13" color="#059669"
                >mdi-account-circle-outline</v-icon
              >
              Tài khoản {{ (i as number) + 1 }}
            </div>

            <div class="od-acc-row">
              <span class="od-acc-label">Email / User</span>
              <div class="od-acc-val-wrap">
                <span class="od-acc-val">{{ acc.user }}</span>
                <button
                  class="od-copy-btn"
                  :class="{ 'od-copy-btn--ok': copiedField === `user-${i}` }"
                  @click="copyText(acc.user, `user-${i}`)"
                >
                  <v-icon size="13">{{
                    copiedField === `user-${i}`
                      ? "mdi-check"
                      : "mdi-content-copy"
                  }}</v-icon>
                </button>
              </div>
            </div>

            <div class="od-acc-row">
              <span class="od-acc-label">Mật khẩu</span>
              <div class="od-acc-val-wrap">
                <span class="od-acc-val">{{ acc.password }}</span>
                <button
                  class="od-copy-btn"
                  :class="{ 'od-copy-btn--ok': copiedField === `pw-${i}` }"
                  @click="copyText(acc.password, `pw-${i}`)"
                >
                  <v-icon size="13">{{
                    copiedField === `pw-${i}` ? "mdi-check" : "mdi-content-copy"
                  }}</v-icon>
                </button>
              </div>
            </div>

            <div v-if="acc.verifyEmail" class="od-acc-row">
              <span class="od-acc-label">Email xác minh</span>
              <div class="od-acc-val-wrap">
                <span class="od-acc-val">{{ acc.verifyEmail }}</span>
                <button
                  class="od-copy-btn"
                  :class="{ 'od-copy-btn--ok': copiedField === `ve-${i}` }"
                  @click="copyText(acc.verifyEmail, `ve-${i}`)"
                >
                  <v-icon size="13">{{
                    copiedField === `ve-${i}` ? "mdi-check" : "mdi-content-copy"
                  }}</v-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-card>
  </v-dialog>
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
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
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
  .profile-stats {
    flex-direction: column;
    align-items: flex-start;
    padding: 0 16px;
  }
  .stat-divider {
    width: 100%;
    height: 1px;
    margin: 0;
  }
  .stat-item {
    width: 100%;
  }
}

/* ─── Tabs ───────────────────────────────────────────── */
.tab-section {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.tab-bar {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 8px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.tab-bar::-webkit-scrollbar {
  display: none;
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
  transition:
    color 0.18s,
    border-color 0.18s;
  white-space: nowrap;
}

.tab-item:hover {
  color: #1e88e5;
}

.tab-item--active {
  color: #1e88e5;
  border-bottom-color: #1e88e5;
  font-weight: 600;
}

.tab-content {
  padding: 0;
}

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

.data-table tr:last-child td {
  border-bottom: none;
}
.data-table tr:hover td {
  background: #fafcff;
}

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

.status-success {
  background: #ecfdf5;
  color: #059669;
}
.status-warning {
  background: #fffbeb;
  color: #d97706;
}
.status-error {
  background: #fef2f2;
  color: #dc2626;
}
.status-grey {
  background: #f1f5f9;
  color: #64748b;
}

/* ─── Refund all button ──────────────────────────────── */
.refund-all-btn {
  margin-left: auto;
  flex-shrink: 0;
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 13px;
  border-radius: 8px;
  border: 1px solid #fde68a;
  background: #fffbeb;
  color: #d97706;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}
.refund-all-btn:hover {
  background: #fef3c7;
}

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

/* ─── Shop order history ─────────────────────────────── */
.shop-order-list {
  display: flex;
  flex-direction: column;
}

.shop-order-card {
  padding: 16px 20px;
  border-bottom: 1px solid #f5f5f5;
  border-left: 3px solid transparent;
  transition: background 0.12s;
}
.shop-order-card:last-child {
  border-bottom: none;
}
.shop-order-card:hover {
  background: #fafcff;
}
.order--completed {
  border-left-color: #059669;
}
.order--failed {
  border-left-color: #ef4444;
}
.order--pending {
  border-left-color: #f59e0b;
}

.order-row-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.order-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.order-row-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 5px;
  gap: 12px;
}

.order-meta-text {
  font-size: 0.775rem;
  color: #94a3b8;
}

.order-amount {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1e88e5;
  flex-shrink: 0;
}

.order-error-inline {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 7px;
  font-size: 0.775rem;
  color: #ef4444;
}

.order-toggle {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #059669;
  cursor: pointer;
  user-select: none;
  padding: 3px 8px 3px 6px;
  border-radius: 6px;
  background: #f0fdf4;
  border: 1px solid #d1fae5;
  transition: background 0.15s;
}
.order-toggle:hover {
  background: #dcfce7;
}

/* ─── Account cards ──────────────────────────────────── */
.account-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.account-card {
  background: #f8fffe;
  border: 1px solid #d1fae5;
  border-radius: 10px;
  overflow: hidden;
}

.account-card-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  background: #ecfdf5;
  font-size: 0.72rem;
  font-weight: 700;
  color: #059669;
  border-bottom: 1px solid #d1fae5;
}

.account-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid #f0fdf4;
}
.account-row:last-child {
  border-bottom: none;
}

.account-label {
  font-size: 0.72rem;
  color: #94a3b8;
  width: 95px;
  flex-shrink: 0;
  font-weight: 500;
}

.account-value-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.account-value {
  font-size: 0.82rem;
  font-weight: 600;
  color: #0f172a;
  font-family: monospace;
  word-break: break-all;
  flex: 1;
}

.copy-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
  color: #94a3b8;
  transition: all 0.15s;
}
.copy-btn:hover {
  background: #d1fae5;
  color: #059669;
}

/* ─── Order detail popup ─────────────────────────────── */
.od-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 14px;
  border-bottom: 1px solid #f0f0f0;
}
.od-header-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}
.od-body {
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: 70vh;
  overflow-y: auto;
}

.od-summary {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.od-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.82rem;
  color: #374151;
  gap: 12px;
}
.od-summary-row span {
  color: #94a3b8;
  flex-shrink: 0;
}
.od-summary-row strong {
  text-align: right;
}
.od-amount {
  color: #1e88e5 !important;
  font-size: 0.95rem;
}
.od-code {
  font-family: monospace;
  font-size: 0.78rem;
  color: #64748b !important;
  font-weight: 400 !important;
}

.od-accounts {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.od-acc-card {
  background: #f8fffe;
  border: 1px solid #d1fae5;
  border-radius: 10px;
  overflow: hidden;
}
.od-acc-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  background: #ecfdf5;
  font-size: 0.72rem;
  font-weight: 700;
  color: #059669;
  border-bottom: 1px solid #d1fae5;
}
.od-acc-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid #f0fdf4;
}
.od-acc-row:last-child {
  border-bottom: none;
}
.od-acc-label {
  font-size: 0.72rem;
  color: #94a3b8;
  width: 90px;
  flex-shrink: 0;
  font-weight: 500;
}
.od-acc-val-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}
.od-acc-val {
  font-size: 0.82rem;
  font-weight: 600;
  color: #0f172a;
  font-family: monospace;
  word-break: break-all;
  flex: 1;
}
.od-copy-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
  color: #94a3b8;
  transition: all 0.15s;
}
.od-copy-btn:hover {
  background: #d1fae5;
  color: #059669;
}
.od-copy-btn--ok {
  background: #d1fae5 !important;
  color: #059669 !important;
}

/* reuse popup-close from account page if not defined */
.popup-close {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.06);
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
  flex-shrink: 0;
}
.popup-close:hover {
  background: rgba(0, 0, 0, 0.12);
}
</style>
