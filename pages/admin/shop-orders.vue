<script setup lang="ts">
import { shopService } from "~/services/shop";

definePageMeta({ layout: "admin", title: "Quản lý đơn hàng" });
useHead({ title: "Quản lý đơn hàng | Admin" });

const loading = ref(false);
const orders = ref<any[]>([]);
const total = ref(0);
const page = ref(1);
const limit = 20;

const search = ref("");
const statusFilter = ref("");
const selectedOrder = ref<any>(null);
const copiedField = ref("");

const statusOptions = [
  { title: "Tất cả", value: "" },
  { title: "Chờ thanh toán", value: "pending" },
  { title: "Hoàn thành", value: "completed" },
  { title: "Thất bại", value: "failed" },
];

const statusMap: Record<string, { label: string; cls: string }> = {
  pending:   { label: "Chờ thanh toán", cls: "status-warning" },
  completed: { label: "Hoàn thành",     cls: "status-success" },
  failed:    { label: "Thất bại",        cls: "status-error"   },
};

const totalPages = computed(() => Math.ceil(total.value / limit));

const fetchOrders = async () => {
  loading.value = true;
  try {
    const res = await shopService.adminGetShopOrders({
      status: statusFilter.value || undefined,
      search: search.value || undefined,
      page: page.value,
      limit,
    });
    orders.value = res?.data?.orders || [];
    total.value  = res?.data?.total  || 0;
  } catch {
  } finally {
    loading.value = false;
  }
};

let searchTimer: ReturnType<typeof setTimeout> | null = null;
const onSearch = () => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => { page.value = 1; fetchOrders(); }, 400);
};
watch(statusFilter, () => { page.value = 1; fetchOrders(); });
watch(page, fetchOrders);
onMounted(fetchOrders);

const formatDate = (iso: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const copyText = async (text: string, key: string) => {
  await navigator.clipboard.writeText(text);
  copiedField.value = key;
  setTimeout(() => { copiedField.value = ""; }, 1500);
};
</script>

<template>
  <div class="orders-page">

    <v-card rounded="xl" elevation="0" border class="table-card">

      <!-- Toolbar -->
      <div class="table-toolbar">
        <div class="toolbar-left">
          <v-text-field
            v-model="search"
            placeholder="Tìm mã đơn, tên sản phẩm, user ID..."
            prepend-inner-icon="mdi-magnify"
            density="compact"
            variant="outlined"
            hide-details
            rounded="lg"
            style="min-width: 280px"
            @input="onSearch"
          />
          <v-select
            v-model="statusFilter"
            :items="statusOptions"
            item-title="title"
            item-value="value"
            density="compact"
            variant="outlined"
            hide-details
            rounded="lg"
            style="min-width: 170px"
          />
        </div>
        <div class="toolbar-right">
          <span class="table-count">{{ total.toLocaleString("vi-VN") }} đơn hàng</span>
        </div>
      </div>

      <v-divider />

      <!-- Table -->
      <div class="table-wrap">
        <table class="shop-table">
          <thead>
            <tr>
              <th class="col-code">Mã đơn</th>
              <th class="col-product">Sản phẩm</th>
              <th class="col-qty">SL</th>
              <th class="col-amount">Tổng tiền</th>
              <th class="col-status">Trạng thái</th>
              <th class="col-date">Thời gian</th>
              <th class="col-action"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="7" class="loading-cell">
                <v-progress-circular indeterminate color="primary" size="28" />
              </td>
            </tr>
            <tr v-else-if="!orders.length">
              <td colspan="7" class="loading-cell">
                <v-icon size="36" color="#cbd5e1">mdi-inbox-outline</v-icon>
                <div style="margin-top:8px; color:#94a3b8; font-size:0.875rem">Không có đơn hàng nào</div>
              </td>
            </tr>
            <tr v-for="order in orders" :key="order.orderCode">
              <td class="col-code">
                <span class="order-code">{{ order.orderCode }}</span>
              </td>
              <td class="col-product">
                <div class="product-name">{{ order.productName || "—" }}</div>
                <div class="user-id">{{ order.userId }}</div>
              </td>
              <td class="col-qty">
                <span class="stock-chip stock-in">{{ order.quantity }}</span>
              </td>
              <td class="col-amount">
                <span class="price-selling">{{ formatCurrency(order.totalAmount) }}</span>
              </td>
              <td class="col-status">
                <span class="status-chip" :class="statusMap[order.status]?.cls">
                  {{ statusMap[order.status]?.label || order.status }}
                </span>
              </td>
              <td class="col-date">
                <span class="date-text">{{ formatDate(order.createdAt) }}</span>
              </td>
              <td class="col-action">
                <button
                  v-if="order.status === 'completed' && order.deliveredAccounts?.length"
                  class="btn-action btn-show"
                  @click="selectedOrder = order"
                >
                  <v-icon size="13">mdi-text-box-outline</v-icon> Chi tiết đơn hàng
                </button>
                <span v-else-if="order.errorMessage" class="error-inline" :title="order.errorMessage">
                  <v-icon size="13" color="#ef4444">mdi-alert-circle-outline</v-icon>
                  {{ order.errorMessage }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <v-divider />

      <div class="pagination">
        <span class="pagination-info">
          Hiển thị {{ (page - 1) * limit + 1 }}–{{ Math.min(page * limit, total) }}
          / {{ total }} đơn hàng
        </span>
        <v-pagination
          v-model="page"
          :length="totalPages"
          :total-visible="5"
          density="compact"
          rounded="lg"
          color="primary"
        />
      </div>

    </v-card>
  </div>

  <!-- Popup xem tài khoản -->
  <v-dialog v-model="selectedOrder" max-width="480" scrollable>
    <v-card v-if="selectedOrder" rounded="xl" elevation="0">
      <div class="od-header">
        <span class="od-title">Chi tiết đơn hàng</span>
        <button class="od-close" @click="selectedOrder = null">
          <v-icon size="20">mdi-close</v-icon>
        </button>
      </div>

      <div class="od-body">
        <!-- Summary -->
        <div class="od-summary">
          <div class="od-row"><span>Mã đơn</span><strong class="mono">{{ selectedOrder.orderCode }}</strong></div>
          <div class="od-row"><span>Sản phẩm</span><strong>{{ selectedOrder.productName }}</strong></div>
          <div class="od-row"><span>Số lượng</span><strong>{{ selectedOrder.quantity }} tài khoản</strong></div>
          <div class="od-row"><span>Tổng tiền</span><strong class="text-primary">{{ formatCurrency(selectedOrder.totalAmount) }}</strong></div>
          <div class="od-row"><span>User ID</span><strong class="mono small">{{ selectedOrder.userId }}</strong></div>
        </div>

        <!-- Accounts -->
        <div class="od-accounts">
          <div v-for="(acc, i) in selectedOrder.deliveredAccounts" :key="i" class="od-acc-card">
            <div class="od-acc-header">
              <v-icon size="13" color="#059669">mdi-account-circle-outline</v-icon>
              Tài khoản {{ i + 1 }}
            </div>

            <div class="od-acc-row">
              <span class="od-acc-label">Email / User</span>
              <div class="od-acc-val-wrap">
                <span class="od-acc-val">{{ acc.user }}</span>
                <button class="od-copy-btn" :class="{ 'od-copy-btn--ok': copiedField === `u${i}` }" @click="copyText(acc.user, `u${i}`)">
                  <v-icon size="13">{{ copiedField === `u${i}` ? 'mdi-check' : 'mdi-content-copy' }}</v-icon>
                </button>
              </div>
            </div>

            <div class="od-acc-row">
              <span class="od-acc-label">Mật khẩu</span>
              <div class="od-acc-val-wrap">
                <span class="od-acc-val">{{ acc.password }}</span>
                <button class="od-copy-btn" :class="{ 'od-copy-btn--ok': copiedField === `p${i}` }" @click="copyText(acc.password, `p${i}`)">
                  <v-icon size="13">{{ copiedField === `p${i}` ? 'mdi-check' : 'mdi-content-copy' }}</v-icon>
                </button>
              </div>
            </div>

            <div v-if="acc.verifyEmail" class="od-acc-row">
              <span class="od-acc-label">Email xác minh</span>
              <div class="od-acc-val-wrap">
                <span class="od-acc-val">{{ acc.verifyEmail }}</span>
                <button class="od-copy-btn" :class="{ 'od-copy-btn--ok': copiedField === `v${i}` }" @click="copyText(acc.verifyEmail, `v${i}`)">
                  <v-icon size="13">{{ copiedField === `v${i}` ? 'mdi-check' : 'mdi-content-copy' }}</v-icon>
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
.orders-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Toolbar ────────────────────── */
.table-card { overflow: hidden; }

.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  gap: 8px;
  flex-wrap: wrap;
}

.toolbar-left, .toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-count {
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 8px;
  border: 1px solid;
  cursor: pointer;
  transition: opacity 0.15s;
}

.btn-action:hover { opacity: 0.8; }
.btn-show { color: #059669; background: #f0fdf4; border-color: #bbf7d0; }

/* ── Table ──────────────────────── */
.table-wrap { overflow-x: auto; }

.shop-table {
  width: 100%;
  border-collapse: collapse;
}

.shop-table thead tr { background: #f8fafc; }

.shop-table th {
  padding: 11px 16px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #64748b;
  text-align: left;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.shop-table td {
  padding: 12px 16px;
  border-top: 1px solid #f1f5f9;
  vertical-align: middle;
}

.shop-table tbody tr:hover { background: #f8fafc; }

/* ── Columns ────────────────────── */
.col-code    { width: 160px; min-width: 130px; }
.col-product { width: 200px; max-width: 200px; }
.col-qty     { width: 70px; text-align: center; }
.shop-table th.col-qty, .shop-table td.col-qty { text-align: center; }
.col-amount  { width: 130px; text-align: right; }
.shop-table th.col-amount, .shop-table td.col-amount { text-align: right; }
.col-status  { width: 140px; }
.col-date    { width: 150px; min-width: 120px; white-space: nowrap; }
.col-action  { width: 180px; min-width: 140px; }

/* ── Cells ──────────────────────── */
.order-code {
  font-family: monospace;
  font-size: 0.78rem;
  color: #475569;
  font-weight: 600;
}

.product-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.9rem;
  line-height: 1.4;
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-id {
  font-size: 0.7rem;
  color: #94a3b8;
  margin-top: 2px;
  font-family: monospace;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stock-chip {
  display: inline-block;
  min-width: 32px;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 999px;
}

.stock-in  { background: #dcfce7; color: #166534; }

.status-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 110px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  user-select: none;
}

.status-warning  { background: #fef9c3; color: #854d0e; border: 1px solid #fde68a; }
.status-success  { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
.status-error    { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

.price-selling { font-weight: 700; color: #1565c0; font-size: 0.9rem; }

.date-text {
  font-size: 0.8rem;
  color: #64748b;
  white-space: nowrap;
}

.error-inline {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: #ef4444;
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.loading-cell {
  text-align: center;
  padding: 48px;
  color: #94a3b8;
}

/* ── Pagination ─────────────────── */
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
}

.pagination-info {
  font-size: 0.82rem;
  color: #94a3b8;
}

/* ── Detail popup ── */
.od-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}
.od-title { font-size: 1rem; font-weight: 700; color: #0f172a; }
.od-close {
  width: 34px; height: 34px;
  border-radius: 50%; border: none;
  background: rgba(0,0,0,0.06);
  color: #475569; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s;
}
.od-close:hover { background: rgba(0,0,0,0.12); }

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
.od-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.82rem;
  color: #374151;
  gap: 12px;
}
.od-row span { color: #94a3b8; flex-shrink: 0; }
.od-row strong { text-align: right; }
.mono { font-family: monospace; }
.small { font-size: 0.75rem; color: #64748b !important; font-weight: 400 !important; }

.od-accounts { display: flex; flex-direction: column; gap: 10px; }

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
.od-acc-row:last-child { border-bottom: none; }
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
  width: 26px; height: 26px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
  color: #94a3b8;
  transition: all 0.15s;
}
.od-copy-btn:hover { background: #d1fae5; color: #059669; }
.od-copy-btn--ok { background: #d1fae5 !important; color: #059669 !important; }
</style>
