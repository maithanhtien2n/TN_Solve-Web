<script setup lang="ts">
import { appService } from "~/services/app";
import { couponService } from "~/services/app";

const route = useRoute();
const router = useRouter();
const { isMobile } = useDevice();
const { onGetterMasterData } = useMasterDataStore();
const { onGetterUserData: userData, onGetterDisplayLogin: displayLogin } = useAppStore();

const loading = ref<string>("");
const showProductInfo = ref<boolean>(false);
const agreedToTerms = ref<boolean>(false);
const showTermsError = ref<boolean>(false);
const formData = ref<any>({
  rentalMonths: 1,
  discountCode: "",
});
const couponDetail = ref<any>(null);

const planOptions = [
  { months: 1,  label: "1 tháng",  save: null,   tag: "Linh hoạt", price: 139000,  days: 30,  credits: 5000 },
  { months: 3,  label: "3 tháng",  save: "−7%",  price: 388000,  days: 90,  credits: 15000, popular: true },
  { months: 6,  label: "6 tháng",  save: "−16%", price: 701000,  days: 180, credits: 30000 },
  { months: 12, label: "1 năm",    save: "−25%", price: 1251000, days: 365, credits: 60000 },
];

const selectPlan = (months: number) => {
  formData.value.rentalMonths = months;
  // Đổi gói thuê -> reset dropdown "Không giới hạn" về mặc định 1 tháng,
  // tránh giữ lại lựa chọn dài của gói cũ (VD đang chọn "7 tháng" cho gói 6
  // tháng, bấm sang gói 1 tháng thì dropdown vẫn hiện 7 tháng gây hiểu nhầm).
  unlimitedMs.value = 30 * DAY_MS;
};

const selectedPlan = computed(() =>
  planOptions.find((p) => p.months === formData.value.rentalMonths) ?? planOptions[0]
);
const selectedDays = computed(() => selectedPlan.value.days);
const selectedCredits = computed(() => selectedPlan.value.credits);

const packageOriginalPrice = computed(() => 139000 * formData.value.rentalMonths);
const hasPackageDiscount = computed(() => packageOriginalPrice.value !== selectedPlan.value.price);

const couponDiscountAmt = computed(() => {
  const coupon = couponDetail.value;
  if (!coupon) return 0;
  let amount = 0;
  if (coupon.discountType === EnumDiscountType.PERCENTAGE)
    amount = Math.round((selectedPlan.value.price * coupon.discountValue) / 100);
  else if (coupon.discountType === EnumDiscountType.FIXED)
    amount = coupon.discountValue;
  return Math.ceil(amount / 500) * 500;
});

// Số tiền giảm thực áp dụng — không vượt quá giá gói, khớp
// Math.max(priceFinal - discountAmount, 0) ở backend.
const appliedDiscountAmt = computed(() => Math.min(couponDiscountAmt.value, selectedPlan.value.price));

// Gói "Không giới hạn" mua kèm (tuỳ chọn) — giá cố định 200k/30 ngày, KHÔNG áp
// mã giảm giá/referral (chỉ áp vào phần thuê gốc ở trên). Đơn vị làm việc là
// MILI GIÂY (unlimitedMs) — CHÍNH XÁC tuyệt đối, không làm tròn ngày — để khi
// khách chọn option "khớp hạn gói thuê", gói Không giới hạn hết hạn ĐÚNG CÙNG
// THỜI ĐIỂM (tới từng giây) với gói thuê chính, không lệch vài giờ do làm
// tròn. Label hiển thị vẫn làm tròn theo ngày cho dễ đọc — khớp field/logic
// bên backend (paymentRequests/payment2sRequests, getMaxUnlimitedAddOnMs).
const DAY_MS = 24 * 60 * 60 * 1000;
const UNLIMITED_PRICE_PER_30_DAYS = 200000;
const addUnlimited = ref(false);
const unlimitedMs = ref(30 * DAY_MS); // mặc định "1 tháng"

// Thời gian còn lại (mili giây, CHÍNH XÁC) của gói thuê CHÍNH hiện tại (nếu
// có) — cho phép gợi ý mua gói "Không giới hạn" khớp đúng hạn gói thuê sau
// khi gia hạn. Backend tự tính lại từ DB, đây chỉ là preview.
const remainingRentalMs = computed(() => {
  const expiry = userData.value?.serviceExpiry;
  if (!expiry) return 0;
  const diffMs = new Date(expiry).getTime() - Date.now();
  return diffMs > 0 ? diffMs : 0;
});

// Thời gian còn lại (mili giây, CHÍNH XÁC) của gói "Không giới hạn" ĐANG CÓ
// (nếu có) — PHẢI trừ ra khỏi tổng tối đa bên dưới, nếu không tài khoản đã có
// sẵn Không giới hạn còn hạn dài sẽ bị gợi ý mua dư (vd còn 150 ngày Không
// giới hạn + gia hạn thêm 1 tháng thì dropdown vẫn cho chọn tới 9 tháng thay
// vì đúng ra chỉ còn thiếu 4 tháng là khớp đủ gói thuê — bug thật đã gặp).
const existingUnlimitedMs = computed(() => {
  const expiry = userData.value?.settings?.unlimitedExpiry;
  if (!expiry) return 0;
  const diffMs = new Date(expiry).getTime() - Date.now();
  return diffMs > 0 ? diffMs : 0;
});

// Tổng thời lượng tối đa được phép mua = thời gian còn lại của gói thuê hiện
// tại + số tháng đang chọn mua mới × 30 ngày − thời gian Không giới hạn hiện
// có (khớp getMaxUnlimitedAddOnMs bên server).
const maxUnlimitedMs = computed(() =>
  Math.max(
    0,
    remainingRentalMs.value +
      selectedPlan.value.months * 30 * DAY_MS -
      existingUnlimitedMs.value
  )
);

// Danh sách option dropdown: các mốc tháng nguyên (1, 2, ... N tháng), cộng
// thêm 1 option cuối "N tháng X ngày" nếu còn dư thời gian lẻ từ gói thuê
// hiện tại. Label làm tròn theo ngày cho dễ đọc, nhưng GIÁ TRỊ THẬT (.ms) của
// option lẻ vẫn giữ chính xác tuyệt đối tới từng mili giây.
const unlimitedOptions = computed(() => {
  const wholeMonths = Math.floor(maxUnlimitedMs.value / (30 * DAY_MS));
  const opts = Array.from({ length: wholeMonths }, (_, i) => ({
    ms: (i + 1) * 30 * DAY_MS,
    label: `${i + 1} tháng`,
  }));
  const extraMs = maxUnlimitedMs.value - wholeMonths * 30 * DAY_MS;
  const extraDaysRounded = Math.round(extraMs / DAY_MS);
  if (extraDaysRounded > 0) {
    // Làm tròn đủ 30 ngày -> gộp gọn thành "N+1 tháng" thay vì hiện dạng
    // "N tháng 30 ngày" nhìn rối. Giá trị .ms vẫn giữ NGUYÊN maxUnlimitedMs
    // (không làm tròn lên đủ tháng), nên giá tiền/hạn dùng thật vẫn chính xác.
    const label =
      extraDaysRounded >= 30
        ? `${wholeMonths + 1} tháng`
        : `${wholeMonths} tháng ${extraDaysRounded} ngày`;
    opts.push({ ms: maxUnlimitedMs.value, label });
  }
  return opts;
});

watch(maxUnlimitedMs, (newMax) => {
  if (unlimitedMs.value > newMax) unlimitedMs.value = newMax;
});

const selectedUnlimitedLabel = computed(
  () =>
    unlimitedOptions.value.find((o) => o.ms === unlimitedMs.value)?.label ??
    `${Math.round(unlimitedMs.value / DAY_MS)} ngày`
);

const unlimitedAddOnPrice = computed(() =>
  addUnlimited.value
    ? Math.floor(
        (unlimitedMs.value * UNLIMITED_PRICE_PER_30_DAYS) / (30 * DAY_MS) / 500
      ) * 500
    : 0
);

const checkoutTotal = computed(
  () => selectedPlan.value.price - appliedDiscountAmt.value + unlimitedAddOnPrice.value
);

const onClickPayment = async () => {
  if (!userData.value?.email) {
    router.replace({ query: { redirect: route.path } });
    displayLogin.value = true;
    return;
  }
  if (!agreedToTerms.value) {
    showTermsError.value = true;
    return;
  }
  showTermsError.value = false;
  loading.value = "create-url";
  await appService
    .createPaymentUrl({
      rentalMonths: formData.value.rentalMonths,
      discountCode: formData.value.discountCode,
      unlimitedMs: addUnlimited.value ? unlimitedMs.value : 0,
      // true khi chọn đúng option cuối (khớp full hạn gói thuê) — báo backend
      // tính lại thời hạn TƯƠI lúc webhook cấp phát, tránh lệch giờ do thời
      // gian thanh toán (xem getMaxUnlimitedAddOnMs bên server).
      unlimitedSyncFull:
        addUnlimited.value && unlimitedMs.value === maxUnlimitedMs.value,
    })
    .then((res: any) => {
      if (res.data) {
        // Lưu lại tóm tắt gói vừa chọn để hiện đúng chi tiết ở popup "Thanh
        // toán thành công" (layouts/default.vue) khi cổng thanh toán redirect
        // về — tại thời điểm đó server có thể chưa xử lý xong webhook, nên
        // không tra được dữ liệu mới nhất từ DB, phải tự lưu từ phía FE.
        const items = [
          {
            label: `Gói ${selectedPlan.value.label}`,
            price: selectedPlan.value.price - appliedDiscountAmt.value,
          },
        ];
        if (addUnlimited.value && unlimitedMs.value > 0) {
          items.push({
            label: `Không giới hạn tín dụng ${selectedUnlimitedLabel.value}`,
            price: unlimitedAddOnPrice.value,
          });
        }
        localStorage.setItem(
          "pendingPaymentSummary",
          JSON.stringify({ items, total: checkoutTotal.value })
        );
        window.location.href = res.data;
      }
    })
    .finally(() => { loading.value = ""; });
};

const onChangeDiscountCode = async (event: any) => {
  const value = event.target.value || "";
  await couponService.getDetailCoupon({ code: value })
    .then((res) => { couponDetail.value = res.data || null; })
    .catch(() => { couponDetail.value = null; });
};

useSeo({
  title: "Đăng ký dịch vụ",
  description: "Đăng ký dịch vụ TN Solve - Tạo video AI không giới hạn từ 139.000đ/tháng.",
  image: "/images/page-home.png",
  keywords: "đăng ký TN Solve, mua gói tạo video AI, giá 139k",
});

definePageMeta({});
</script>

<template>
  <div class="pay-page">
    <!-- Hero -->
    <div class="pay-hero">
      <div class="hero-blob" />
      <div class="hero-blob2" />
      <div class="hero-inner">
        <div class="hero-left">
          <h1 class="hero-title">Đăng ký dịch vụ</h1>
          <div class="hero-checks">
            <div class="hero-check">
              <v-icon size="14" color="rgba(255,255,255,0.9)">mdi-check-circle</v-icon>
              Kích hoạt ngay sau thanh toán
            </div>
          </div>
        </div>
        <div class="hero-stats">
          <div class="hero-stat">
            <span class="hero-stat-num">139.000đ</span>
            <span class="hero-stat-label">chỉ từ / tháng</span>
          </div>
          <div class="hero-stat-sep" />
          <div class="hero-stat">
            <span class="hero-stat-num">5.000+</span>
            <span class="hero-stat-label">tín dụng khởi đầu</span>
          </div>
          <div class="hero-stat-sep" />
          <div class="hero-stat">
            <span class="hero-stat-num">100%</span>
            <span class="hero-stat-label">bảo mật thanh toán</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Plans + Checkout -->
    <div class="pay-wrap">
    <!-- Left: Plans -->
    <div class="pay-left">
      <div class="pay-left-header">
        <h2 class="pay-left-title">Chọn gói phù hợp</h2>
        <p class="pay-left-sub">Tiết kiệm hơn khi đăng ký gói dài hạn</p>
      </div>

      <div class="plan-list">
        <div
          v-for="plan in planOptions"
          :key="plan.months"
          class="plan-item"
          :class="{
            'plan-item--active': formData.rentalMonths === plan.months,
            'plan-item--popular': plan.popular,
          }"
          @click="selectPlan(plan.months)"
        >
          <div class="plan-item-label">{{ plan.label }}</div>
          <div v-if="plan.popular" class="plan-popular-badge">Phổ biến nhất</div>
          <div class="plan-item-price">{{ formatCurrency(plan.price) }}</div>
          <div v-if="plan.save" class="plan-save-badge">{{ plan.save }}</div>
          <div v-else-if="plan.tag" class="plan-tag-badge">
            <v-icon size="11" color="#fff">mdi-lightning-bolt</v-icon>
            {{ plan.tag }}
          </div>
        </div>
      </div>

      <!-- Add-on: gói tạo video không giới hạn -->
      <div class="addon-box">
        <div class="addon-toggle">
          <input id="addon-unlimited-checkbox" v-model="addUnlimited" type="checkbox" />
          <label for="addon-unlimited-checkbox" class="addon-label">Nâng cấp tạo video không giới hạn</label>
          <select
            v-if="addUnlimited && unlimitedOptions.length > 1"
            v-model.number="unlimitedMs"
            class="addon-native-select"
            @click.stop
          >
            <option v-for="opt in unlimitedOptions" :key="opt.ms" :value="opt.ms">{{ opt.label }}</option>
          </select>
          <span v-else-if="addUnlimited" class="addon-static-month">{{ selectedUnlimitedLabel }}</span>
        </div>
        <div class="addon-desc">
          <div class="addon-desc-intro">Khi tích chọn, bạn sẽ được:</div>
          <ul>
            <li>
              <span class="addon-desc-highlight">Tạo video không giới hạn</span> với số tháng bạn đã
              chọn.
            </li>
            <li>
              Giá gói tăng thêm <span class="addon-desc-highlight">200.000đ/tháng</span>.
            </li>
          </ul>
        </div>
      </div>

      <!-- Thông tin sản phẩm (A3) -->
      <div class="product-info">
        <div class="product-info-title" @click="showProductInfo = !showProductInfo">
          Thông tin sản phẩm
          <v-icon class="pi-toggle-icon" size="18" color="#475569">
            {{ showProductInfo ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
          </v-icon>
        </div>
        <div class="product-info-list" :class="{ 'pi-collapsed': !showProductInfo }">
          <div class="pi-row">
            <span class="pi-label">Dịch vụ</span>
            <span class="pi-val">Sử dụng nền tảng TN Solve để tạo và xử lý video bằng AI</span>
          </div>
          <div class="pi-row">
            <span class="pi-label">Nguồn gốc/xuất xứ</span>
            <span class="pi-val">Sản phẩm/dịch vụ do TN Solve phát triển và cung cấp</span>
          </div>
          <div class="pi-row">
            <span class="pi-label">Thời hạn sử dụng</span>
            <span class="pi-val"><strong>{{ selectedDays }} ngày</strong> kể từ khi thanh toán/kích hoạt thành công</span>
          </div>
          <div class="pi-row">
            <span class="pi-label">Tín dụng</span>
            <span v-if="addUnlimited" class="pi-val">Bao gồm <strong>{{ selectedCredits.toLocaleString("vi-VN") }} tín dụng</strong> khởi đầu và <strong>không giới hạn tín dụng</strong> {{ selectedUnlimitedLabel }}</span>
            <span v-else class="pi-val">Bao gồm <strong>{{ selectedCredits.toLocaleString("vi-VN") }} tín dụng</strong> khởi đầu</span>
          </div>
          <div class="pi-row">
            <span class="pi-label">Phạm vi sử dụng</span>
            <span class="pi-val">Tín dụng dùng để sử dụng các tính năng tạo video, xử lý video trên hệ thống TN Solve</span>
          </div>
          <div class="pi-row">
            <span class="pi-label">Giá gói</span>
            <span class="pi-val"><strong>{{ formatCurrency(checkoutTotal) }}</strong>, đã bao gồm VAT</span>
          </div>
          <div class="pi-row">
            <span class="pi-label">Trước khi thanh toán</span>
            <span class="pi-val">Khách hàng được kiểm tra lại thông tin gói, thời hạn sử dụng, số tín dụng và tổng số tiền cần thanh toán</span>
          </div>
          <div class="pi-row">
            <span class="pi-label">Giao hàng</span>
            <span class="pi-val">Tài khoản khách hàng sẽ nhận được sản phẩm ngay tức thì sau khi thanh toán thành công</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Right: Checkout -->
    <div class="pay-right">
      <div class="checkout-card">
        <div class="checkout-title">Thông tin thanh toán</div>

        <!-- Discount — với gói combo, mã giảm giá chỉ áp vào phần 139k, phần 200k giữ nguyên -->
        <div class="checkout-field">
          <label class="field-label">Mã giảm giá</label>
          <v-text-field
            v-model="formData.discountCode"
            variant="outlined"
            density="compact"
            placeholder="Nhập mã (nếu có)"
            hide-details
            @change="onChangeDiscountCode"
          />

          <div v-if="couponDetail" class="coupon-ok">
            <v-icon size="15" color="#10b981">mdi-check-circle</v-icon>
            <span>
              <strong>{{ couponDetail.name }}</strong> — Giảm
              <span v-if="couponDetail.discountType === EnumDiscountType.PERCENTAGE">{{ couponDetail.discountValue }}%</span>
              <span v-else>{{ formatCurrency(couponDetail.discountValue) }}</span>
            </span>
          </div>
        </div>

        <!-- Summary -->
        <div class="checkout-summary">
          <div class="sum-product">
            <span class="sum-product-name">TN Solve {{ selectedPlan.label }}</span>
            <div class="sum-product-price">
              <span v-if="hasPackageDiscount" class="sum-original">{{ formatCurrency(packageOriginalPrice) }}</span>
              <span class="sum-pkg-price">{{ formatCurrency(selectedPlan.price) }}</span>
            </div>
          </div>

          <div v-if="addUnlimited" class="sum-row">
            <span>Không giới hạn tín dụng {{ selectedUnlimitedLabel }}</span>
            <span class="addon-price">{{ formatCurrency(unlimitedAddOnPrice) }}</span>
          </div>

          <div class="sum-row">
            <span>Số lượng</span>
            <span>1</span>
          </div>

          <div v-if="couponDetail && appliedDiscountAmt > 0" class="sum-row">
            <span>Giảm giá</span>
            <span class="sum-off">−{{ formatCurrency(appliedDiscountAmt) }}</span>
          </div>
          <div class="sum-sep" />
          <div class="sum-row sum-row--total">
            <span>Thành tiền</span>
            <span class="sum-total">{{ formatCurrency(checkoutTotal) }}</span>
          </div>
          <div class="sum-vat">Đã bao gồm thuế VAT</div>
        </div>

        <!-- Agree checkbox -->
        <div>
          <label class="agree-check" @click="showTermsError = false">
            <input v-model="agreedToTerms" type="checkbox" />
            <span>Tôi đã đọc và đồng ý với <a href="/dieu-khoan" target="_blank"><strong>Điều khoản dịch vụ</strong></a> và <a href="/chinh-sach-bao-mat" target="_blank"><strong>Chính sách bảo mật</strong></a></span>
          </label>
          <p v-if="showTermsError" class="terms-error">
            <v-icon size="16" color="#b91c1c">mdi-alert-circle</v-icon>
            Vui lòng tích vào ô trên để đồng ý với điều khoản!
          </p>
        </div>

        <!-- Pay button -->
        <button class="checkout-btn" :disabled="Boolean(loading === 'create-url')" @click="onClickPayment">
          <v-progress-circular v-if="Boolean(loading === 'create-url')" width="2" size="18" color="white" indeterminate />
          <template v-else>
            <v-icon size="18">mdi-credit-card-outline</v-icon>
            Thanh toán ngay
          </template>
        </button>

        <div class="checkout-secure">
          <v-icon size="13">mdi-lock-outline</v-icon>
          Thanh toán bảo mật · Kích hoạt tức thì
        </div>
      </div>

      <!-- Contact -->
      <div class="contact-box">
        <v-icon size="16" color="#1e88e5">mdi-chat-processing-outline</v-icon>
        <span>
          Cần hỗ trợ? Liên hệ Zalo
          <a href="https://zalo.me/0343027232" target="_blank" class="contact-link">034 302 7232</a>
        </span>
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
/* ─── Page wrapper ───────────────────────────────────────── */
.pay-page {
  width: 100%;
}

/* ─── Hero ───────────────────────────────────────────────── */
.pay-hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0d47a1 0%, #1565c0 40%, #1e88e5 80%, #42a5f5 100%);
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
}

.hero-left { display: flex; flex-direction: column; gap: 6px; }

.hero-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
  letter-spacing: -0.3px;
}

.hero-checks {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

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
  color: rgba(255,255,255,0.7);
  font-weight: 500;
  white-space: nowrap;
}

.hero-stat-sep {
  width: 1px;
  height: 28px;
  background: rgba(255,255,255,0.25);
  flex-shrink: 0;
}

@media (max-width: 700px) {
  .pay-hero { padding: 24px 20px; border-radius: 12px; }
  .hero-inner { flex-direction: column; align-items: flex-start; gap: 16px; }
  .hero-title { font-size: 1.3rem; }
  .hero-stat-sep { display: none; }
}

/* ─── Layout ─────────────────────────────────────────────── */
.pay-wrap {
  display: grid;
  grid-template-columns: 1fr 500px;
  gap: 28px;
  align-items: stretch;
}

@media (max-width: 900px) {
  .pay-wrap { grid-template-columns: 1fr; }
}

/* ─── Left ───────────────────────────────────────────────── */
.pay-left {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.pay-right {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pay-left-header { margin-bottom: 18px; }

.pay-left-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px;
}

.pay-left-sub {
  font-size: 0.83rem;
  color: #9e9e9e;
  margin: 0;
}

/* ─── Plan list ──────────────────────────────────────────── */
.plan-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}

.plan-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
  padding: 22px 14px;
  justify-content: center;
  min-height: 110px;
  border-radius: 14px;
  border: 2px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
  user-select: none;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
}

.plan-item:hover { border-color: #90caf9; box-shadow: 0 4px 16px rgba(30,136,229,0.1); }
.plan-item--active { border-color: #1e88e5; background: #f0f7ff; box-shadow: 0 4px 16px rgba(30,136,229,0.15); }
.plan-item--popular { padding-top: 24px; }

.plan-popular-badge {
  position: absolute;
  top: -11px; left: 50%; transform: translateX(-50%);
  font-size: 0.63rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #1565c0, #1e88e5);
  padding: 3px 12px;
  border-radius: 999px;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

@media (max-width: 600px) {
  .plan-list { grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .plan-item,
  .plan-item--popular { padding: 16px 10px; }

  .addon-native-select,
  .addon-static-month {
    flex: 1 1 100%;
    width: 100%;
    margin-left: 0;
  }
}

.plan-item-label { font-size: 1rem; font-weight: 700; color: #0f172a; }
.plan-item-price { font-size: 0.95rem; font-weight: 600; color: #1e88e5; }

.plan-save-badge {
  font-size: 0.78rem;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, #059669, #10b981, #34d399);
  padding: 4px 12px;
  border-radius: 999px;
  box-shadow: 0 3px 10px rgba(16,185,129,0.45);
  letter-spacing: 0.2px;
}

.plan-tag-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.78rem;
  font-weight: 600;
  background: linear-gradient(135deg, #1565c0, #42a5f5);
  color: #fff;
  padding: 4px 12px;
  border-radius: 999px;
  box-shadow: 0 3px 10px rgba(30,136,229,0.45);
  letter-spacing: 0.2px;
}

/* ─── Includes ───────────────────────────────────────────── */
.includes {
  background: #f8fafc;
  border-radius: 12px;
  padding: 14px 16px;
}

.includes-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
  margin-bottom: 10px;
}

.includes-list { display: flex; flex-direction: column; gap: 7px; }

.include-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.83rem;
  color: #374151;
}

/* ─── Checkout card ──────────────────────────────────────── */
.checkout-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  padding: 22px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 18px;
  flex: 1;
}

.checkout-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  padding-bottom: 14px;
  border-bottom: 1px solid #f0f0f0;
}

.field-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 8px;
}

.coupon-ok {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #065f46;
  margin-top: 8px;
  height: 40px;
  padding: 0 12px;
  background: #ecfdf5;
  border-radius: 8px;
}

/* ─── Summary ────────────────────────────────────────────── */
.checkout-summary {
  background: #f8fafc;
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sum-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  font-size: 0.85rem;
  color: #374151;
}

.sum-row > span:first-child {
  min-width: 0;
}

.sum-row > span:last-child {
  flex-shrink: 0;
  white-space: nowrap;
}

.addon-box {
  padding: 14px;
  margin: 4px 0;
  border: 2px solid #e5e7eb;
  border-radius: 14px;
  background: #fff;
  user-select: none;
}

.addon-toggle {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  row-gap: 8px;
  width: 100%;
  min-height: 30px;
}

.addon-toggle input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  flex-shrink: 0;
  width: 19px;
  height: 19px;
  border-radius: 6px;
  border: 1.5px solid #90caf9;
  background: #fff;
  cursor: pointer;
  position: relative;
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.addon-toggle input[type="checkbox"]:hover {
  border-color: #1e88e5;
}

.addon-toggle input[type="checkbox"]:checked {
  background: linear-gradient(135deg, #1565c0, #42a5f5);
  border-color: #1565c0;
}

.addon-toggle input[type="checkbox"]:checked::after {
  content: "";
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 9px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.addon-toggle input[type="checkbox"]:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(30, 136, 229, 0.18);
}

.addon-label {
  flex: 0 1 auto;
  max-width: 100%;
  font-size: 0.85rem;
  color: #374151;
  white-space: normal;
  overflow-wrap: break-word;
  cursor: pointer;
}

.addon-desc {
  margin: 10px -14px -14px -14px;
  padding: 10px 14px;
  line-height: 1.4;
  background: #f0f7ff;
  border-radius: 0 0 12px 12px;
  user-select: text;
}

.addon-desc-intro {
  margin-bottom: 4px;
}

.addon-desc-highlight {
  font-weight: 600;
}

.addon-desc ul {
  padding-left: 20px;
}

.addon-desc li {
  list-style: disc;
}

.addon-desc li + li {
  margin-top: 4px;
}

.addon-static-month {
  flex-shrink: 0;
  margin-left: auto;
  box-sizing: border-box;
  min-width: 100px;
  height: 30px;
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 27px;
  padding: 0 10px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  color: #64748b;
  text-align: center;
}

.addon-native-select {
  flex-shrink: 0;
  margin-left: auto;
  appearance: none;
  -webkit-appearance: none;
  box-sizing: border-box;
  width: auto;
  min-width: 100px;
  height: 30px;
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1;
  padding: 0 26px 0 10px;
  border: 1.5px solid #90caf9;
  border-radius: 8px;
  background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%231565c0' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 8px center;
  background-size: 12px;
  color: #1565c0;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.addon-native-select:hover {
  border-color: #1e88e5;
}

.addon-native-select:focus-visible {
  outline: none;
  border-color: #1565c0;
  box-shadow: 0 0 0 3px rgba(30, 136, 229, 0.18);
}

.addon-native-select option {
  color: #374151;
  background: #fff;
  font-weight: 400;
  padding: 6px 10px;
}

.addon-native-select option:checked {
  color: #1565c0;
  background: #f0f7ff;
}

.addon-price {
  color: #1565c0;
  font-weight: 600;
}

.sum-off { color: #10b981; font-weight: 600; }
.sum-sep { border-top: 1px dashed #e5e7eb; margin: 4px 0; }
.sum-row--total { font-weight: 700; font-size: 0.95rem; }
.sum-total { color: #e53935; font-size: 1.25rem; font-weight: 800; }

.sum-product {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 2px;
}
.sum-product-name { font-size: 0.88rem; font-weight: 600; color: #1e293b; }
.sum-product-price { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.sum-pkg-price { font-size: 0.9rem; font-weight: 700; color: #1565c0; white-space: nowrap; }
.sum-original { font-size: 0.78rem; color: #94a3b8; text-decoration: line-through; }

/* ─── Product info (A3) ──────────────────────────────────── */
.product-info {
  margin-top: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}
.product-info-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 10px 14px;
  background: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pi-toggle-icon { display: none; }

/* Mobile: collapse by default, show toggle */
@media (max-width: 768px) {
  .pi-toggle-icon { display: inline-flex; }
  .product-info-title { cursor: pointer; }
  .product-info-list.pi-collapsed { display: none; }
}
.product-info-list { padding: 4px 0; }
.pi-row {
  display: flex;
  gap: 8px;
  padding: 7px 14px;
  font-size: 0.82rem;
  line-height: 1.5;
  border-bottom: 1px solid #f1f5f9;
}
.pi-row:last-child { border-bottom: none; }
.pi-label {
  flex-shrink: 0;
  width: 140px;
  color: #64748b;
  font-weight: 500;
}
.pi-val { color: #334155; }

/* ─── Button ─────────────────────────────────────────────── */
.checkout-btn {
  width: 100%;
  height: 48px;
  border-radius: 10px;
  background: linear-gradient(135deg, #1565c0, #1e88e5);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 14px rgba(30,136,229,0.35);
  transition: transform 0.15s, box-shadow 0.15s;
}

.checkout-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(30,136,229,0.45);
}

.checkout-btn:disabled { opacity: 0.7; cursor: not-allowed; }

.checkout-secure {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 0.72rem;
  color: #9e9e9e;
}

/* ─── VAT + Agree ────────────────────────────────────────── */
.sum-vat {
  font-size: 0.72rem;
  color: #94a3b8;
  text-align: right;
  margin-top: 4px;
}

.agree-check {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: #475569;
  line-height: 1.5;
  cursor: pointer;
  margin-bottom: 4px;
  user-select: none;
}

.agree-check input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  margin-top: 2px;
  flex-shrink: 0;
  width: 19px;
  height: 19px;
  border-radius: 6px;
  border: 1.5px solid #90caf9;
  background: #fff;
  cursor: pointer;
  position: relative;
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.agree-check input[type="checkbox"]:hover {
  border-color: #1e88e5;
}

.agree-check input[type="checkbox"]:checked {
  background: linear-gradient(135deg, #1565c0, #42a5f5);
  border-color: #1565c0;
}

.agree-check input[type="checkbox"]:checked::after {
  content: "";
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 9px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.agree-check input[type="checkbox"]:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(30, 136, 229, 0.18);
}

.agree-check a { color: #1565c0; text-decoration: none; }
.agree-check a:hover { text-decoration: underline; }

.terms-error {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #b91c1c;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 8px 12px;
  margin: 8px 0 0;
}

/* ─── Contact ────────────────────────────────────────────── */
.contact-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 10px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  font-size: 0.82rem;
  color: #374151;
  margin-top: 12px;
}

.contact-link {
  color: #1e88e5;
  font-weight: 600;
  text-decoration: none;
}

.contact-link:hover { text-decoration: underline; }
</style>
