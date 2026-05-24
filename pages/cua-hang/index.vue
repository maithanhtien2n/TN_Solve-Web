<script setup lang="ts">
import { shopService } from "~/services/shop";

useHead({ title: "Cửa hàng | TN Solve" });

const route = useRoute();
const router = useRouter();
const { onGetterUserData: userData, onGetterDisplayLogin: displayLogin } = useAppStore();

const loading = ref(false);
const products = ref<any[]>([]);
const shopErrors = ref<any[]>([]);
const selectedProduct = ref<any>(null);
const detailOnly = ref(false);

// --- Purchase flow ---
const paymentDialog = ref(false);
const paymentData = ref<any>(null);
const loadingUid = ref<string | null>(null);
const paymentStatus = ref<'idle' | 'pending' | 'completed' | 'failed'>('idle');
const deliveredAccounts = ref<any[]>([]);
const paymentError = ref('');
const paymentIsContactAdmin = ref(false);
let pollTimer: ReturnType<typeof setInterval> | null = null;
let countdownTimer: ReturnType<typeof setInterval> | null = null;
const countdown = ref(10 * 60); // giây

const countdownText = computed(() => {
  const m = Math.floor(countdown.value / 60).toString().padStart(2, '0');
  const s = (countdown.value % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
});

const copiedField = ref("");
const copyText = async (text: string, key: string) => {
  await navigator.clipboard.writeText(text);
  copiedField.value = key;
  setTimeout(() => { copiedField.value = ""; }, 1500);
};

const quantities = ref<Record<string, number>>({});
const getQty = (uid: string) => quantities.value[uid] ?? 1;
const setQty = (uid: string, val: number, max: number) => {
  quantities.value[uid] = Math.min(Math.max(1, isNaN(val) ? 1 : val), max);
};
const onQtyInput = (uid: string, event: Event, max: number) => {
  const el = event.target as HTMLInputElement;
  const raw = parseInt(el.value, 10);
  const clamped = Math.min(Math.max(1, isNaN(raw) ? 1 : raw), max);
  quantities.value[uid] = clamped;
  // Directly update DOM to prevent displaying value beyond stock
  el.value = String(clamped);
};

const onBuyNow = async (product: any) => {
  if (loadingUid.value) return;
  if (!userData.value?.email) {
    router.replace({ query: { redirect: route.path } });
    displayLogin.value = true;
    return;
  }
  const quantity = getQty(product.uid);
  selectedProduct.value = null;
  paymentData.value = null;
  paymentStatus.value = 'idle';
  deliveredAccounts.value = [];
  paymentError.value = '';
  paymentIsContactAdmin.value = false;
  loadingUid.value = product.uid;

  try {
    const res = await shopService.createShopPayment({ uid: product.uid, quantity });
    paymentDialog.value = true;
    if (res?.data?.contactAdmin) {
      paymentStatus.value = 'failed';
      paymentError.value = res?.data?.message || 'Sản phẩm tạm thời không khả dụng. Vui lòng liên hệ admin để được hỗ trợ.';
      paymentIsContactAdmin.value = true;
    } else {
      paymentData.value = res?.data;
      paymentStatus.value = 'pending';
      startPolling(res?.data?.orderCode);
    }
  } catch {
    // Axios interceptor đã hiển thị toast lỗi tự động — không cần mở dialog
  } finally {
    loadingUid.value = null;
  }
};

const startPolling = (orderCode: string) => {
  stopPolling();

  // Countdown
  countdown.value = 10 * 60;
  countdownTimer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      stopPolling();
      if (paymentStatus.value === 'pending') {
        paymentStatus.value = 'failed';
        paymentError.value = 'Hết thời gian chờ. Vui lòng liên hệ hỗ trợ.';
      }
    }
  }, 1000);

  // Polling trạng thái
  pollTimer = setInterval(async () => {
    try {
      const res = await shopService.getOrderStatus(orderCode);
      const status = res?.data?.status;
      if (status === 'completed') {
        paymentStatus.value = 'completed';
        deliveredAccounts.value = res?.data?.deliveredAccounts || [];
        stopPolling();
      } else if (status === 'failed') {
        paymentStatus.value = 'failed';
        paymentError.value = res?.data?.errorMessage || 'Mua thất bại';
        stopPolling();
      }
    } catch {}
  }, 3000);
};

const stopPolling = () => {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
  if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
};

const onClosePayment = async () => {
  const orderCode = paymentData.value?.orderCode;
  stopPolling();
  paymentDialog.value = false;
  // Huỷ đơn nếu đang pending
  if (paymentStatus.value === 'pending' && orderCode) {
    try { await shopService.cancelOrder(orderCode); } catch {}
  }
};

const fetchProducts = async () => {
  loading.value = true;
  try {
    const res = await shopService.getProducts();
    products.value = (res?.data?.products || []).filter(
      (p: any) => p.available > 0
    );
    shopErrors.value = res?.data?.shopErrors || [];
  } catch {
    // Axios interceptor xử lý toast lỗi
  } finally {
    loading.value = false;
  }
};

onMounted(fetchProducts);

// Huỷ đơn pending khi user thoát trang (đóng tab, reload, navigate)
const cancelPendingOnLeave = () => {
  const orderCode = paymentData.value?.orderCode;
  if (orderCode && paymentStatus.value === 'pending') {
    shopService.cancelOrder(orderCode).catch(() => {});
  }
};
onUnmounted(cancelPendingOnLeave);
if (import.meta.client) {
  window.addEventListener('beforeunload', cancelPendingOnLeave);
  onUnmounted(() => window.removeEventListener('beforeunload', cancelPendingOnLeave));
}
</script>

<template>
  <div class="shop-page">

      <!-- Hero -->
      <div class="shop-hero">
        <div class="hero-blob" />
        <div class="hero-blob2" />
        <div class="hero-inner">
          <div class="hero-left">
            <div class="hero-badge">
              <v-icon size="13" color="rgba(255,255,255,0.85)">mdi-store-outline</v-icon>
              Cửa hàng
            </div>
            <h1 class="hero-title">Tài khoản công nghệ số</h1>
            <div class="hero-checks">
              <div class="hero-check">
                <v-icon size="14" color="rgba(255,255,255,0.9)">mdi-check-circle</v-icon>
                Uy tín — đã phục vụ hàng trăm khách hàng tin dùng
              </div>
            </div>
          </div>
          <div class="hero-stats">
            <div class="hero-stat">
              <span class="hero-stat-num">{{ products.length }}</span>
              <span class="hero-stat-label">sản phẩm</span>
            </div>
            <div class="hero-stat-sep" />
            <div class="hero-stat">
              <span class="hero-stat-num">Tức thì</span>
              <span class="hero-stat-label">giao hàng</span>
            </div>
            <div class="hero-stat-sep" />
            <div class="hero-stat">
              <span class="hero-stat-num">24/7</span>
              <span class="hero-stat-label">hỗ trợ</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Cảnh báo shop lỗi -->
      <v-alert
        v-if="shopErrors.length"
        type="warning"
        variant="tonal"
        rounded="lg"
        class="mb-6"
        density="compact"
      >
        Một số sản phẩm tạm thời không khả dụng. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.
      </v-alert>

      <!-- Loading -->
      <div v-if="loading" class="product-grid">
        <v-skeleton-loader v-for="i in 6" :key="i" type="card" rounded="xl" />
      </div>

      <!-- Empty -->
      <div v-else-if="!products.length" class="empty-state">
        <v-icon size="56" color="#cbd5e1">mdi-store-off-outline</v-icon>
        <p>Hiện chưa có sản phẩm nào</p>
      </div>

      <!-- Product grid -->
      <div v-else class="product-grid">
        <div v-for="product in products" :key="product.uid" class="product-card">

          <!-- Top: badge + giá -->
          <div class="card-top">
            <div class="stock-badge">
              <span class="stock-dot" />
              Còn {{ product.available }} tài khoản
            </div>
            <div class="product-price">{{ product.sellingPrice.toLocaleString("vi-VN") }}₫</div>
          </div>

          <!-- Tên sản phẩm -->
          <div class="product-name">{{ product.product_name }}</div>

          <!-- Bảo hành -->
          <div v-if="product.description" class="product-warranty">
            <v-icon size="13" color="#059669" class="flex-shrink-0" style="margin-top:2px">mdi-shield-check-outline</v-icon>
            <div class="warranty-content">
              <span class="warranty-text">{{ product.description }}</span>
              <button class="btn-see-more" @click="selectedProduct = product; detailOnly = true">Xem thêm</button>
            </div>
          </div>

          <!-- Spacer -->
          <div style="flex:1" />

          <!-- Số lượng + Tổng tiền + Mua ngay -->
          <div class="card-footer">
            <div class="card-buy-row">
              <div class="qty-stepper">
                <button
                  class="qty-btn"
                  :disabled="getQty(product.uid) <= 1"
                  @click.stop="setQty(product.uid, getQty(product.uid) - 1, product.available)"
                >−</button>
                <input
                  class="qty-input"
                  type="number"
                  min="1"
                  :max="product.available"
                  :value="getQty(product.uid)"
                  @input="onQtyInput(product.uid, $event, product.available)"
                  @blur="setQty(product.uid, getQty(product.uid), product.available)"
                />
                <button
                  class="qty-btn"
                  :disabled="getQty(product.uid) >= product.available"
                  @click.stop="setQty(product.uid, getQty(product.uid) + 1, product.available)"
                >+</button>
              </div>
              <div v-if="getQty(product.uid) > 1" class="card-total">
                <span class="card-total-label">Tổng</span>
                <span class="card-total-amount">{{ (getQty(product.uid) * product.sellingPrice).toLocaleString('vi-VN') }}₫</span>
              </div>
            </div>
            <button class="btn-buy" :disabled="loadingUid === product.uid" @click="onBuyNow(product)">
              <v-progress-circular v-if="loadingUid === product.uid" indeterminate size="15" width="2" color="white" />
              <v-icon v-else size="15">mdi-lightning-bolt</v-icon>
              {{ loadingUid === product.uid ? 'Đang xử lý...' : 'Mua ngay' }}
            </button>
          </div>

        </div>
      </div>

  </div>

  <!-- Popup chi tiết -->
  <v-dialog v-model="selectedProduct" max-width="480" rounded="xl">
    <v-card v-if="selectedProduct" rounded="xl" elevation="0">

      <!-- Header -->
      <div class="popup-header">
        <div class="popup-header-left">
          <div class="stock-badge">
            <span class="stock-dot" />
            Còn {{ selectedProduct.available }} tài khoản
          </div>
          <div class="popup-title">{{ selectedProduct.product_name }}</div>
          <div class="popup-price">{{ selectedProduct.sellingPrice.toLocaleString("vi-VN") }}₫</div>
        </div>
        <button class="popup-close" @click="selectedProduct = null">
          <v-icon size="20">mdi-close</v-icon>
        </button>
      </div>

      <v-divider />

      <!-- Body -->
      <div class="popup-body">
        <div class="popup-desc">
          <div class="popup-desc-label">
            <v-icon size="14" color="#059669">mdi-shield-check-outline</v-icon>
            Chi tiết bảo hành
          </div>
          <p class="popup-desc-text">{{ selectedProduct.description }}</p>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="!detailOnly" class="popup-footer">
        <button class="btn-buy" :disabled="loadingUid === selectedProduct?.uid" @click="onBuyNow(selectedProduct); selectedProduct = null">
          <v-progress-circular v-if="loadingUid === selectedProduct?.uid" indeterminate size="15" width="2" color="white" />
          <v-icon v-else size="15">mdi-lightning-bolt</v-icon>
          {{ loadingUid === selectedProduct?.uid ? 'Đang xử lý...' : 'Mua ngay' }}
        </button>
      </div>

    </v-card>
  </v-dialog>

  <!-- Popup thanh toán QR -->
  <v-dialog v-model="paymentDialog" max-width="480" persistent rounded="xl" scrollable>
    <v-card rounded="xl" elevation="0">
      <!-- Header -->
      <div class="pay-header">
        <span class="pay-header-title">
          {{ paymentStatus === 'completed' ? '🎉 Mua thành công!' : paymentStatus === 'failed' ? '❌ Thất bại' : '💳 Thanh toán' }}
        </span>
        <button class="popup-close" @click="onClosePayment">
          <v-icon size="20">mdi-close</v-icon>
        </button>
      </div>

      <v-divider />

      <div class="pay-body">

        <!-- Pending: hiện QR -->
        <template v-if="paymentStatus === 'pending' && paymentData">
          <p class="pay-product-name">{{ paymentData.product_name }}</p>
          <div class="pay-amount">{{ paymentData.amount?.toLocaleString('vi-VN') }}₫</div>

          <div class="pay-qr-wrap">
            <img :src="paymentData.qrImageUrl" class="pay-qr-img" alt="QR thanh toán" />
          </div>

          <div class="pay-info">
            <div class="pay-info-row">
              <span>Ngân hàng</span>
              <strong>{{ paymentData.bankName }}</strong>
            </div>
            <div class="pay-info-row">
              <span>Số tài khoản</span>
              <strong>{{ paymentData.bankAccount }}</strong>
            </div>
            <div class="pay-info-row">
              <span>Nội dung CK</span>
              <strong class="text-primary">{{ paymentData.transferContent }}</strong>
            </div>
          </div>

          <div class="pay-polling">
            <v-progress-circular indeterminate size="14" width="2" color="primary" />
            <span>Đang chờ xác nhận thanh toán...</span>
            <span class="pay-countdown" :class="countdown < 60 ? 'pay-countdown-urgent' : ''">
              {{ countdownText }}
            </span>
          </div>

          <div class="pay-warning-note">
            <v-icon size="13" color="#92400e">mdi-alert-outline</v-icon>
            Giữ nguyên cửa sổ này sau khi chuyển khoản để nhận tài khoản ngay. Đóng popup sẽ huỷ đơn hàng.
          </div>
        </template>

        <!-- Thành công -->
        <template v-else-if="paymentStatus === 'completed'">
          <div class="pay-center">
            <v-icon size="52" color="success">mdi-check-circle-outline</v-icon>
            <p class="pay-success-msg">Tài khoản đã được giao</p>
          </div>

          <!-- Thông tin đơn hàng -->
          <div class="od-summary">
            <div class="od-row"><span>Sản phẩm</span><strong>{{ paymentData?.product_name }}</strong></div>
            <div class="od-row"><span>Số lượng</span><strong>{{ deliveredAccounts.length }} tài khoản</strong></div>
            <div class="od-row"><span>Tổng tiền</span><strong class="text-primary">{{ paymentData?.amount?.toLocaleString('vi-VN') }}₫</strong></div>
            <div class="od-row"><span>Mã đơn</span><strong class="mono small">{{ paymentData?.orderCode }}</strong></div>
          </div>

          <!-- Danh sách tài khoản -->
          <div class="od-accounts">
            <div v-for="(acc, i) in deliveredAccounts" :key="i" class="od-acc-card">
              <div class="od-acc-header">
                <v-icon size="13" color="#059669">mdi-account-circle-outline</v-icon>
                Tài khoản {{ i + 1 }}
              </div>

              <div v-if="acc.user" class="od-acc-row">
                <span class="od-acc-label">Email / User</span>
                <div class="od-acc-val-wrap">
                  <span class="od-acc-val">{{ acc.user }}</span>
                  <button class="od-copy-btn" :class="{ 'od-copy-btn--ok': copiedField === `u${i}` }" @click="copyText(acc.user, `u${i}`)">
                    <v-icon size="13">{{ copiedField === `u${i}` ? 'mdi-check' : 'mdi-content-copy' }}</v-icon>
                  </button>
                </div>
              </div>

              <div v-if="acc.password" class="od-acc-row">
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

          <!-- Link trang tài khoản -->
          <div class="pay-history-tip">
            <v-icon size="14" color="#64748b">mdi-information-outline</v-icon>
            Xem lại thông tin bất cứ lúc nào tại
            <nuxt-link to="/tai-khoan" class="pay-history-link" @click="paymentDialog = false">
              Tài khoản → Lịch sử mua hàng
            </nuxt-link>
          </div>
        </template>

        <!-- Thất bại -->
        <template v-else-if="paymentStatus === 'failed'">
          <div class="pay-center">
            <v-icon size="56" :color="paymentIsContactAdmin ? 'warning' : 'error'">
              {{ paymentIsContactAdmin ? 'mdi-alert-outline' : 'mdi-alert-circle-outline' }}
            </v-icon>
            <p class="pay-error-msg" :class="{ 'pay-warning-msg': paymentIsContactAdmin }">
              {{ paymentError }}
            </p>
            <a v-if="paymentIsContactAdmin" href="https://zalo.me/0343027232" target="_blank" class="pay-contact-btn">
              <v-icon size="15">mdi-chat-outline</v-icon>
              Liên hệ Admin hỗ trợ
            </a>
          </div>
        </template>

      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.shop-page {
  min-height: 80vh;
  padding-bottom: 60px;
}


/* ── Hero ───────────────────────────────── */
.shop-hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0a6657 0%, #0984e3 60%, #00b4d8 100%);
  border-radius: 16px;
  padding: 28px 36px;
  margin-bottom: 24px;
  color: #fff;
}

.hero-blob {
  position: absolute;
  width: 260px; height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  top: -80px; right: -40px;
  pointer-events: none;
}

.hero-blob2 {
  position: absolute;
  width: 160px; height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%);
  bottom: -50px; left: 200px;
  pointer-events: none;
}

.hero-inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
}

.hero-left { display: flex; flex-direction: column; gap: 6px; }

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(255,255,255,0.18);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: rgba(255,255,255,0.95);
  text-transform: uppercase;
  width: fit-content;
}

.hero-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
  letter-spacing: -0.3px;
}

.hero-checks { display: flex; flex-direction: column; gap: 5px; }

.hero-check {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.85);
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.hero-stat-num {
  font-size: 1.1rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
}

.hero-stat-label {
  font-size: 0.68rem;
  color: rgba(255,255,255,0.75);
  white-space: nowrap;
}

.hero-stat-sep {
  width: 1px;
  height: 32px;
  background: rgba(255,255,255,0.25);
}

/* ── Grid ───────────────────────────────── */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 20px;
}

/* ── Card ───────────────────────────────── */
.product-card {
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 18px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: box-shadow 0.2s;
  cursor: default;
}

.product-card:hover {
  box-shadow: 0 12px 32px rgba(21, 101, 192, 0.1);
  border-color: #bfdbfe;
}

/* ── Top row ────────────────────────────── */
.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

/* ── Stock badge ────────────────────────── */
.stock-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 999px;
  background: rgba(5, 150, 105, 0.08);
  color: #047857;
  border: 1px solid rgba(5, 150, 105, 0.18);
  white-space: nowrap;
}

.stock-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #10b981;
  flex-shrink: 0;
}

/* ── Name ───────────────────────────────── */
.product-name {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.45;
}

/* ── Price ──────────────────────────────── */
.product-price {
  font-size: 1.25rem;
  font-weight: 800;
  color: #1565c0;
  white-space: nowrap;
}

/* ── Warranty ───────────────────────────── */
.product-warranty {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  font-size: 0.78rem;
  color: #047857;
  background: rgba(5, 150, 105, 0.05);
  border: 1px solid rgba(5, 150, 105, 0.14);
  border-radius: 10px;
  padding: 8px 10px;
  line-height: 1.5;
}

.warranty-content {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.warranty-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.btn-see-more {
  font-size: 0.72rem;
  font-weight: 600;
  color: #1565c0;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-align: left;
  width: fit-content;
}

.btn-see-more:hover { text-decoration: underline; }

/* ── Quantity stepper ───────────────────── */
.card-footer {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-buy-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex: 1;
}

.card-total-label {
  font-size: 0.68rem;
  color: #94a3b8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  line-height: 1;
}

.card-total-amount {
  font-size: 1.05rem;
  font-weight: 800;
  color: #1565c0;
  line-height: 1.2;
  white-space: nowrap;
}

.qty-stepper {
  display: flex;
  align-items: center;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  flex: 1;
  background: #fff;
}

.qty-btn {
  width: 32px;
  height: 40px;
  border: none;
  background: #f8fafc;
  color: #374151;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  flex-shrink: 0;
}
.qty-btn:hover:not(:disabled) { background: #e2e8f0; }
.qty-btn:disabled { opacity: 0.35; cursor: not-allowed; }

.qty-input {
  flex: 1;
  min-width: 0;
  height: 40px;
  border: none;
  border-left: 1.5px solid #e2e8f0;
  border-right: 1.5px solid #e2e8f0;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
  outline: none;
  -moz-appearance: textfield;
}
.qty-input::-webkit-inner-spin-button,
.qty-input::-webkit-outer-spin-button { -webkit-appearance: none; }


/* ── Button ─────────────────────────────── */
.btn-buy {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 11px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #1565c0 0%, #2196f3 100%);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.18s, transform 0.15s, box-shadow 0.18s;
  box-shadow: 0 4px 14px rgba(21, 101, 192, 0.25);
}

.btn-buy:hover {
  opacity: 0.93;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(21, 101, 192, 0.32);
}

.btn-buy:active { transform: translateY(0); }
.btn-buy:disabled {
  opacity: 0.75;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* ── Popup ──────────────────────────────── */
.popup-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 20px 16px;
}

.popup-header-left {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.popup-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.4;
}

.popup-price {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1565c0;
}

.popup-body {
  padding: 16px 20px;
}

.popup-desc {
  background: rgba(5, 150, 105, 0.05);
  border: 1px solid rgba(5, 150, 105, 0.14);
  border-radius: 10px;
  padding: 12px 14px;
}

.popup-desc-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #047857;
  margin-bottom: 8px;
}

.popup-desc-text {
  font-size: 0.85rem;
  color: #374151;
  line-height: 1.65;
  white-space: pre-line;
  margin: 0;
}

.popup-footer {
  padding: 4px 20px 20px;
}

/* ── Empty ──────────────────────────────── */
.empty-state {
  text-align: center;
  padding: 80px 0;
  color: #94a3b8;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

/* ── Payment popup ──────────────────────── */
.pay-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
}
.pay-header-title { font-size: 1rem; font-weight: 700; color: #1e293b; }
.pay-body { padding: 16px 20px 24px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }
.pay-center { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 16px 0; }
.pay-hint { font-size: 0.85rem; color: #64748b; margin: 0; }
.pay-product-name { font-size: 0.9rem; color: #475569; text-align: center; margin: 0; }
.pay-amount { font-size: 1.8rem; font-weight: 800; color: #1565c0; text-align: center; }
.pay-qr-wrap { display: flex; justify-content: center; }
.pay-qr-img { width: 220px; height: 220px; border-radius: 12px; border: 1px solid #e2e8f0; }
.pay-info {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.pay-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.82rem;
  color: #64748b;
}
.pay-info-row strong { color: #1e293b; }
.pay-polling {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.78rem;
  color: #64748b;
}

.pay-countdown {
  font-size: 0.78rem;
  font-weight: 700;
  color: #1565c0;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.5px;
}

.pay-countdown-urgent { color: #dc2626; }

.pay-warning-note {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #92400e;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 8px 10px;
  line-height: 1.5;
}
.pay-success-msg { font-size: 0.95rem; font-weight: 600; color: #16a34a; margin: 0; }
.pay-error-msg { font-size: 0.9rem; color: #dc2626; text-align: center; margin: 0; }

/* ─── Order summary ─── */
.pay-order-summary {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.pay-order-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.82rem;
  color: #374151;
}
.pay-order-row span { color: #94a3b8; }
.pay-order-code { font-family: monospace; font-size: 0.78rem; color: #64748b; }

/* ─── History tip ─── */
.pay-history-tip {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 4px;
  padding: 8px 10px;
  background: #f8fafc;
  border-radius: 8px;
}
.pay-history-link {
  color: #1e88e5;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
}
.pay-history-link:hover { text-decoration: underline; }

.pay-account-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #059669;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 6px;
}

.pay-account-card {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.pay-account-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
  color: #374151;
}
.pay-account-row strong { color: #1e293b; word-break: break-all; }
.pay-warning-msg { color: #d97706 !important; }
.pay-contact-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #0068ff;
  color: #fff;
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  margin-top: 4px;
}
.pay-contact-btn:hover { opacity: 0.88; }

/* ── Order detail (od-*) ────────────────── */
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

/* ── Close button ───────────────────────── */
.popup-close {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.08);
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
  flex-shrink: 0;
}
.popup-close:hover { background: rgba(0, 0, 0, 0.14); }
</style>
