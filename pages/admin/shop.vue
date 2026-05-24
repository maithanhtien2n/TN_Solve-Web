<script setup lang="ts">
import { shopService } from "~/services/shop";

definePageMeta({ layout: "admin", title: "Quản lý cửa hàng" });
useHead({ title: "Quản lý cửa hàng | Admin" });

const loading = ref(false);
const saving = ref<string>("");
const bulkSaving = ref(false);
const focusedUid = ref<string>("");
const snackbar = ref(false);
const snackbarMsg = ref("");
const originalMarkupInput = ref<string>(""); // giá trị trước khi sửa
const products = ref<any[]>([]);
const shopErrors = ref<any[]>([]);
const selected = ref<string[]>([]);
const balances = ref<any[]>([]);
const balanceLoading = ref(false);

// Phân trang
const page = ref(1);
const perPage = 10;
const totalPages = computed(() => Math.ceil(products.value.length / perPage));
const paginated = computed(() =>
  products.value.slice((page.value - 1) * perPage, page.value * perPage)
);

const allPageSelected = computed(() =>
  paginated.value.length > 0 && paginated.value.every((p) => selected.value.includes(p.uid))
);

const toggleSelectAll = () => {
  const pageUids = paginated.value.map((p) => p.uid);
  if (allPageSelected.value) {
    selected.value = selected.value.filter((uid) => !pageUids.includes(uid));
  } else {
    selected.value = [...new Set([...selected.value, ...pageUids])];
  }
};

const toggleSelect = (uid: string) => {
  const product = products.value.find((p) => p.uid === uid);
  if (!product || product.available <= 0) return;
  if (selected.value.includes(uid)) {
    selected.value = selected.value.filter((u) => u !== uid);
  } else {
    selected.value = [...selected.value, uid];
  }
};

const fetchBalances = async () => {
  balanceLoading.value = true;
  try {
    const res = await shopService.getBalance();
    balances.value = res?.data?.balances || [];
  } catch (e) {
    console.error(e);
  } finally {
    balanceLoading.value = false;
  }
};

const fetchProducts = async (showLoading = false) => {
  if (showLoading) loading.value = true;
  selected.value = [];
  try {
    const res = await shopService.adminGetProducts();
    const sortOrder = (p: any) => {
      if (p.available <= 0) return 6;
      if (p.isVisible)  return p.markup != null ? 0 : 1;
      return p.markup != null ? 2 : 3;
    };
    products.value = (res?.data?.products || [])
      .map((p: any) => ({ ...p, _markup: p.markup != null ? formatPriceInput(p.markup) : "" }))
      .sort((a: any, b: any) => sortOrder(a) - sortOrder(b));
    shopErrors.value = res?.data?.shopErrors || [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const onToggleVisible = async (product: any) => {
  if (product.available <= 0) return;
  if (product.markup == null && !product.isVisible) {
    snackbarMsg.value = "Cần nhập chênh lệch giá trước khi hiển thị sản phẩm";
    snackbar.value = true;
    return;
  }
  saving.value = product.uid;
  try {
    product.isVisible = !product.isVisible;
    await shopService.adminUpdateProduct({
      uid: product.uid,
      shopId: product.shopId,
      product_name: product.product_name,
      originalPrice: product.originalPrice,
      markup: product.markup,
      isVisible: product.isVisible,
    });
  } catch {
    product.isVisible = !product.isVisible;
  } finally {
    saving.value = "";
    fetchProducts();
  }
};

const onBulkSetVisible = async (visible: boolean) => {
  bulkSaving.value = true;
  const selected_products = products.value.filter((p) => selected.value.includes(p.uid) && p.available > 0);
  if (visible) {
    const noMarkup = selected_products.filter((p) => p.markup == null);
    if (noMarkup.length > 0) {
      snackbarMsg.value = `${noMarkup.length} sản phẩm chưa có giá, không thể hiển thị`;
      snackbar.value = true;
    }
  }
  const targets = selected_products.filter((p) => (p.markup != null || !visible) && p.isVisible !== visible);
  for (const p of targets) {
    p.isVisible = visible;
    await shopService.adminUpdateProduct({
      uid: p.uid,
      shopId: p.shopId,
      product_name: p.product_name,
      originalPrice: p.originalPrice,
      markup: p.markup,
      isVisible: visible,
    });
  }
  selected.value = [];
  bulkSaving.value = false;
  fetchProducts();
};

const parsePriceInput = (val: string) =>
  Number(val.replace(/\./g, "").replace(/[^\d]/g, ""));

const formatPriceInput = (val: string | number) => {
  const num = typeof val === "number" ? val : parsePriceInput(String(val));
  if (!num && num !== 0) return "";
  return num.toLocaleString("vi-VN");
};

const onMarkupInput = (product: any, e: Event) => {
  const raw = (e.target as HTMLInputElement).value.replace(/[^\d]/g, "");
  product._markup = raw;
  const el = e.target as HTMLInputElement;
  const pos = el.selectionStart ?? raw.length;
  el.value = raw;
  el.setSelectionRange(pos, pos);
};

const onSaveMarkup = async (product: any) => {
  const raw = String(product._markup).trim();
  const markup = parsePriceInput(raw);
  const isEmpty = !raw || markup === 0;

  if (!isEmpty) {
    if (isNaN(markup) || markup <= 0) return;
    // markup phải ít nhất 1.000đ
    if (markup < 1000) {
      snackbarMsg.value = "Chênh lệch tối thiểu là 1.000₫";
      snackbar.value = true;
      return;
    }
  }

  saving.value = product.uid;
  try {
    product.markup = isEmpty ? null : markup;
    // Cập nhật sellingPrice hiển thị ngay trên UI
    product.sellingPrice = product.markup != null ? product.originalPrice + product.markup : null;
    if (isEmpty && product.isVisible) product.isVisible = false;
    product._markup = isEmpty ? "" : formatPriceInput(markup);
    originalMarkupInput.value = product._markup;
    await shopService.adminUpdateProduct({
      uid: product.uid,
      shopId: product.shopId,
      product_name: product.product_name,
      originalPrice: product.originalPrice,
      markup: product.markup,
      isVisible: product.isVisible,
    });
  } finally {
    saving.value = "";
    fetchProducts();
  }
};

const formatPrice = (val: number | null) =>
  val != null ? val.toLocaleString("vi-VN") + "₫" : "—";

onMounted(() => { fetchProducts(true); fetchBalances(); });
</script>

<template>
  <div class="admin-shop">

    <!-- Số dư ví các shop -->
    <div class="balance-row">
      <div v-if="balanceLoading" class="balance-card balance-skeleton">
        <v-progress-circular indeterminate size="16" width="2" color="primary" />
        <span>Đang tải số dư...</span>
      </div>
      <div v-for="b in balances" :key="b.shopId" class="balance-card">
        <v-icon size="15" color="#64748b">mdi-wallet-outline</v-icon>
        <span class="balance-shop">{{ b.shopName }}</span>
        <div class="balance-sep" />
        <span class="balance-label">Số dư</span>
        <span class="balance-amount" :class="b.balance > 0 ? 'balance-ok' : 'balance-empty'">
          {{ b.balance?.toLocaleString("vi-VN") }}<span class="balance-unit">₫</span>
        </span>
      </div>
    </div>

    <v-alert
      v-if="shopErrors.length"
      type="warning"
      variant="tonal"
      rounded="lg"
      density="compact"
      icon="mdi-alert-outline"
    >
      Shop đang gián đoạn: <strong>{{ shopErrors.map((e) => e.shopName).join(", ") }}</strong>
    </v-alert>

    <v-card rounded="xl" elevation="0" border class="table-card">

      <!-- Toolbar -->
      <div class="table-toolbar">
        <div class="toolbar-left">
          <template v-if="selected.length > 0">
            <span class="selected-badge">{{ selected.length }} đã chọn</span>
            <button class="btn-action btn-show" :disabled="bulkSaving" @click="onBulkSetVisible(true)">
              <v-icon size="13">mdi-eye-outline</v-icon> Hiện
            </button>
            <button class="btn-action btn-hide" :disabled="bulkSaving" @click="onBulkSetVisible(false)">
              <v-icon size="13">mdi-eye-off-outline</v-icon> Ẩn
            </button>
            <button class="btn-action btn-cancel" @click="selected = []">
              <v-icon size="13">mdi-close</v-icon> Bỏ chọn
            </button>
          </template>
        </div>
        <div class="toolbar-right">
          <span class="table-count">{{ products.length }} sản phẩm</span>
        </div>
      </div>

      <v-divider />

      <div class="table-wrap">
        <table class="shop-table">
          <thead>
            <tr>
              <th class="col-check">
                <input type="checkbox" class="row-checkbox" :checked="allPageSelected" @change="toggleSelectAll" />
              </th>
              <th class="col-name">Sản phẩm</th>
              <th class="col-shop">Shop</th>
              <th class="col-stock">Tồn kho</th>
              <th class="col-price">Giá gốc</th>
              <th class="col-price">Giá bán ra</th>
              <th class="col-toggle">Hiển thị</th>
              <th class="col-action">Chênh lệch</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="8" class="loading-cell">
                <v-progress-circular indeterminate color="primary" size="28" />
              </td>
            </tr>
            <template v-else>
              <tr
                v-for="item in paginated"
                :key="item.uid"
                :class="{ 'row-hidden': !item.isVisible, 'row-selected': selected.includes(item.uid) }"
              >
                <!-- Checkbox -->
                <td class="col-check">
                  <input
                    type="checkbox"
                    class="row-checkbox"
                    :checked="selected.includes(item.uid)"
                    :disabled="item.available <= 0"
                    @change="toggleSelect(item.uid)"
                  />
                </td>

                <!-- Tên -->
                <td class="col-name">
                  <div class="product-name">{{ item.product_name }}</div>
                </td>

                <!-- Shop -->
                <td class="col-shop">
                  <span class="shop-chip">{{ item.shopName }}</span>
                </td>

                <!-- Tồn kho -->
                <td class="col-stock">
                  <span class="stock-chip" :class="item.available > 0 ? 'stock-in' : 'stock-out'">
                    {{ item.available }}
                  </span>
                </td>

                <!-- Giá gốc -->
                <td class="col-price">
                  <span class="price-original">{{ formatPrice(item.originalPrice) }}</span>
                </td>

                <!-- Giá bán ra (tự động = giá gốc + chênh lệch) -->
                <td class="col-price">
                  <span v-if="item.sellingPrice != null" class="price-selling">
                    {{ formatPrice(item.sellingPrice) }}
                  </span>
                  <span v-else class="text-muted">—</span>
                </td>

                <!-- Hiển thị -->
                <td class="col-toggle">
                  <span
                    class="status-chip"
                    :class="[
                      item.available <= 0 ? 'status-disabled' : (item.isVisible ? 'status-show' : 'status-hide'),
                      { 'status-no-click': item.available <= 0 }
                    ]"
                    @click="onToggleVisible(item)"
                  >
                    <v-progress-circular v-if="saving === item.uid" indeterminate size="12" width="2" />
                    <template v-else-if="item.available <= 0">Hết hàng</template>
                    <template v-else>{{ item.isVisible ? "Hiển thị" : "Ẩn" }}</template>
                  </span>
                </td>

                <!-- Nhập chênh lệch -->
                <td class="col-action">
                  <div class="price-edit-wrap">
                    <div class="price-edit">
                      <v-text-field
                        :model-value="item._markup"
                        type="text"
                        placeholder="Nhập chênh lệch..."
                        density="compact"
                        variant="outlined"
                        hide-details
                        rounded="lg"
                        style="width: 100%"
                        @focus="focusedUid = item.uid; originalMarkupInput = item._markup; item._markup = parsePriceInput(item._markup) || ''"
                        @click="focusedUid = item.uid"
                        @blur="if (focusedUid === item.uid) { item._markup = originalMarkupInput; focusedUid = ''; }"
                        @input="onMarkupInput(item, $event)"
                        @keyup.enter="onSaveMarkup(item); focusedUid = ''"
                      />
                      <v-btn
                        v-if="focusedUid === item.uid"
                        icon
                        color="primary"
                        variant="flat"
                        rounded="lg"
                        :loading="saving === item.uid"
                        style="width: 36px; height: 36px; min-width: 36px;"
                        @mousedown.prevent
                        @click="focusedUid = ''; onSaveMarkup(item)"
                      >
                        <v-icon size="16">mdi-check</v-icon>
                      </v-btn>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <v-divider />

      <div class="pagination">
        <span class="pagination-info">
          Hiển thị {{ (page - 1) * perPage + 1 }}–{{ Math.min(page * perPage, products.length) }}
          / {{ products.length }} sản phẩm
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

  <v-snackbar v-model="snackbar" color="error" location="top" :timeout="4000" rounded="lg">
    {{ snackbarMsg }}
    <template #actions>
      <v-btn icon size="small" variant="text" @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped>
.admin-shop {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.selected-badge {
  font-size: 0.78rem;
  font-weight: 700;
  color: #1565c0;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 3px 10px;
  border-radius: 999px;
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

.btn-action:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-action:not(:disabled):hover { opacity: 0.8; }

.btn-show   { color: #059669; background: #f0fdf4; border-color: #bbf7d0; }
.btn-hide   { color: #dc2626; background: #fef2f2; border-color: #fecaca; }
.btn-cancel { color: #64748b; background: #f8fafc; border-color: #e2e8f0; }

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
.row-selected { background: #eff6ff !important; }

/* ── Checkbox ───────────────────── */
.col-check { width: 40px; }

.row-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #1565c0;
}

/* ── Columns ────────────────────── */
.col-name   { width: 200px; max-width: 200px; }
.col-shop   { width: 100px; }
.shop-table th.col-shop,
.shop-table td.col-shop { text-align: center; }
.col-stock  { width: 90px; }
.shop-table th.col-stock,
.shop-table td.col-stock { text-align: center; }
.col-price  { width: 120px; }
.shop-table th.col-price,
.shop-table td.col-price { text-align: right; }
.col-toggle { width: 100px; }
.shop-table th.col-toggle,
.shop-table td.col-toggle { text-align: center; }
.col-action { width: 200px; }
.shop-table th.col-action,
.shop-table td.col-action { text-align: right; }
.col-action .v-field__input { text-align: right; }

/* ── Cells ──────────────────────── */
.product-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.9rem;
  line-height: 1.4;
}

.shop-chip {
  font-size: 0.73rem;
  font-weight: 600;
  color: #1565c0;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 2px 10px;
  border-radius: 999px;
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
.stock-out { background: #fee2e2; color: #991b1b; }

.status-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 72px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
  user-select: none;
}

.status-chip:not(.status-no-click):hover { opacity: 0.8; }
.status-show     { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
.status-hide     { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
.status-disabled { background: #f1f5f9; color: #94a3b8; border: 1px solid #e2e8f0; white-space: nowrap; }
.status-no-click { cursor: not-allowed; }

.price-original { color: #94a3b8; font-size: 0.88rem; }
.price-selling  { font-weight: 700; color: #1565c0; font-size: 0.9rem; }
.text-muted { color: #cbd5e1; }

.price-edit-wrap { display: flex; flex-direction: column; gap: 4px; }
.price-edit { display: flex; align-items: center; gap: 6px; }
.price-edit .v-text-field { flex: 1; }

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

/* ── Balance row ────────────────── */
.balance-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: -10px; /* kéo sát bảng */
}

.balance-card {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 14px;
}

.balance-skeleton {
  color: #94a3b8;
  font-size: 0.82rem;
  gap: 7px;
}

.balance-shop {
  font-size: 0.82rem;
  font-weight: 600;
  color: #334155;
}

.balance-sep {
  width: 1px;
  height: 14px;
  background: #e2e8f0;
  flex-shrink: 0;
}

.balance-label {
  font-size: 0.75rem;
  color: #94a3b8;
}

.balance-amount {
  font-size: 0.95rem;
  font-weight: 800;
}

.balance-unit {
  font-size: 0.72rem;
  font-weight: 600;
  margin-left: 1px;
}

.balance-ok    { color: #059669; }
.balance-empty { color: #dc2626; }
</style>
