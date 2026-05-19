<script setup lang="ts">
import { appService } from "~/services/app";
import { couponService } from "~/services/app";

const { isMobile } = useDevice();
const { onGetterMasterData } = useMasterDataStore();

const loading = ref<string>("");
const agreedToTerms = ref<boolean>(false);
const formData = ref<any>({
  rentalMonths: 1,
  discountCode: "",
});
const couponDetail = ref<any>(null);

const planOptions = [
  { months: 1,  label: "1 thÃ¡ng",  save: null,  price: 139000,  days: 30,  credits: 5000 },
  { months: 3,  label: "3 thÃ¡ng",  save: "âˆ’7%", price: 388000,  days: 90,  credits: 15000, popular: true },
  { months: 6,  label: "6 thÃ¡ng",  save: "âˆ’16%",price: 701000,  days: 180, credits: 30000 },
  { months: 12, label: "1 nÄƒm",    save: "âˆ’25%",price: 1251000, days: 365, credits: 60000 },
];

const selectedPlan = computed(() =>
  planOptions.find((p) => p.months === formData.value.rentalMonths) ?? planOptions[0]
);
const selectedDays = computed(() => selectedPlan.value.days);
const selectedCredits = computed(() => selectedPlan.value.credits);

const totalPrice = computed(() => {
  const rentalMonths = formData.value.rentalMonths;
  const basePricePerMonth = 139000;
  const originalPrice = basePricePerMonth * rentalMonths;
  const coupon = couponDetail.value;

  let finalPrice = originalPrice;
  let packageDiscountAmount = 0;

  switch (rentalMonths) {
    case 3:  finalPrice = 388000;  packageDiscountAmount = originalPrice - finalPrice; break;
    case 6:  finalPrice = 701000;  packageDiscountAmount = originalPrice - finalPrice; break;
    case 12: finalPrice = 1251000; packageDiscountAmount = originalPrice - finalPrice; break;
    default: finalPrice = originalPrice;
  }

  let couponDiscountAmount = 0;
  if (coupon) {
    if (coupon.discountType === EnumDiscountType.PERCENTAGE)
      couponDiscountAmount = Math.round((finalPrice * coupon.discountValue) / 100);
    else if (coupon.discountType === EnumDiscountType.FIXED)
      couponDiscountAmount = coupon.discountValue;
    couponDiscountAmount = Math.ceil(couponDiscountAmount / 500) * 500;
  } else {
    packageDiscountAmount = Math.ceil(packageDiscountAmount / 500) * 500;
  }

  finalPrice = Math.max(finalPrice - couponDiscountAmount, 0);
  const totalDiscount = packageDiscountAmount + couponDiscountAmount;

  if (totalDiscount === 0) return formatCurrency(finalPrice);

  const discountRatePercent = Math.round((totalDiscount / originalPrice) * 100);
  const discountRateText =
    coupon && coupon.discountType === EnumDiscountType.FIXED
      ? formatCurrency(totalDiscount)
      : `${discountRatePercent}%`;

  return {
    originalPrice: formatCurrency(originalPrice),
    finalPrice: formatCurrency(finalPrice),
    discountRate: discountRateText,
  };
});

const onClickPayment = async () => {
  loading.value = "create-url";
  await appService
    .createPaymentUrl({ rentalMonths: formData.value.rentalMonths, discountCode: formData.value.discountCode })
    .then((res) => { if (res.data) window.location.href = res.data; })
    .finally(() => { loading.value = ""; });
};

const onChangeDiscountCode = async (event: any) => {
  const value = event.target.value || "";
  await couponService.getDetailCoupon({ code: value })
    .then((res) => { couponDetail.value = res.data || null; })
    .catch(() => { couponDetail.value = null; });
};

useSeo({
  title: "ÄÄƒng kÃ½ dá»‹ch vá»¥",
  description: "ÄÄƒng kÃ½ dá»‹ch vá»¥ TN Solve - Táº¡o video AI khÃ´ng giá»›i háº¡n tá»« 139.000Ä‘/thÃ¡ng.",
  image: "/images/page-home.png",
  keywords: "Ä‘Äƒng kÃ½ TN Solve, mua gÃ³i táº¡o video AI, giÃ¡ 139k",
});

definePageMeta({ middleware: "auth" });
</script>

<template>
  <div class="pay-wrap">
    <!-- Left: Plans -->
    <div class="pay-left">
      <div class="pay-left-header">
        <h2 class="pay-left-title">Chá»n gÃ³i phÃ¹ há»£p</h2>
        <p class="pay-left-sub">Tiáº¿t kiá»‡m hÆ¡n khi Ä‘Äƒng kÃ½ gÃ³i dÃ i háº¡n</p>
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
          @click="formData.rentalMonths = plan.months"
        >
          <div v-if="plan.popular" class="plan-popular-badge">Phá»• biáº¿n nháº¥t</div>

          <div class="plan-item-top">
            <div class="plan-radio">
              <div class="plan-radio-dot" :class="{ 'plan-radio-dot--on': formData.rentalMonths === plan.months }" />
            </div>
            <div class="plan-item-info">
              <div class="plan-item-label">{{ plan.label }}</div>
              <div class="plan-item-price">{{ formatCurrency(plan.price) }}</div>
            </div>
            <div class="plan-item-right">
              <div v-if="plan.save" class="plan-save-badge">{{ plan.save }}</div>
              <div class="plan-item-per">{{ formatCurrency(Math.round(plan.price / plan.months)) }}/thÃ¡ng</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Included features -->
      <div class="includes">
        <div class="includes-title">Bao gá»“m</div>
        <div class="includes-list">
          <div class="include-item">
            <v-icon size="16" color="#1e88e5">mdi-calendar-check-outline</v-icon>
            <span><strong>{{ selectedDays }} ngÃ y</strong> sá»­ dá»¥ng</span>
          </div>
          <div class="include-item">
            <v-icon size="16" color="#10b981">mdi-check-circle</v-icon>
            <span><strong>{{ selectedCredits.toLocaleString("vi-VN") }} tÃ­n dá»¥ng</strong> khá»Ÿi Ä‘áº§u</span>
          </div>
<div class="include-item">
            <v-icon size="16" color="#10b981">mdi-check-circle</v-icon>
            KÃ­ch hoáº¡t ngay sau thanh toÃ¡n
          </div>
        </div>
      </div>
    </div>

    <!-- Right: Checkout -->
    <div class="pay-right">
      <div class="checkout-card">
        <div class="checkout-title">ThÃ´ng tin thanh toÃ¡n</div>

        <!-- Discount -->
        <div class="checkout-field">
          <label class="field-label">MÃ£ giáº£m giÃ¡</label>
          <v-text-field
            v-model="formData.discountCode"
            variant="outlined"
            density="compact"
            placeholder="Nháº­p mÃ£ (náº¿u cÃ³)"
            hide-details
            @change="onChangeDiscountCode"
          />

          <div v-if="couponDetail" class="coupon-ok">
            <v-icon size="15" color="#10b981">mdi-check-circle</v-icon>
            <span>
              <strong>{{ couponDetail.name }}</strong> â€” Giáº£m
              <span v-if="couponDetail.discountType === EnumDiscountType.PERCENTAGE">{{ couponDetail.discountValue }}%</span>
              <span v-else>{{ formatCurrency(couponDetail.discountValue) }}</span>
            </span>
          </div>
        </div>

        <!-- Summary -->
        <div class="checkout-summary">
          <template v-if="typeof totalPrice === 'object'">
            <div class="sum-row">
              <span>GiÃ¡ gá»‘c</span>
              <span class="sum-original">{{ totalPrice.originalPrice }}</span>
            </div>
            <div class="sum-row">
              <span>Giáº£m giÃ¡</span>
              <span class="sum-off">âˆ’{{ totalPrice.discountRate }}</span>
            </div>
            <div class="sum-sep" />
            <div class="sum-row sum-row--total">
              <span>Tá»•ng cá»™ng</span>
              <span class="sum-total">{{ totalPrice.finalPrice }}</span>
            </div>
          </template>
          <template v-else>
            <div class="sum-row sum-row--total">
              <span>Tá»•ng cá»™ng</span>
              <span class="sum-total">{{ totalPrice }}</span>
            </div>
          </template>
          <div class="sum-vat">ÄÃ£ bao gá»“m thuáº¿ VAT</div>
        </div>

        <!-- Agree checkbox -->
        <label class="agree-check">
          <input v-model="agreedToTerms" type="checkbox" />
          <span>TÃ´i Ä‘Ã£ Ä‘á»c vÃ  Ä‘á»“ng Ã½ vá»›i <a href="/dieu-khoan" target="_blank"><strong>Äiá»u khoáº£n dá»‹ch vá»¥</strong></a> vÃ  <a href="/chinh-sach-bao-mat" target="_blank"><strong>ChÃ­nh sÃ¡ch báº£o máº­t</strong></a></span>
        </label>

        <!-- Pay button -->
        <button class="checkout-btn" :disabled="Boolean(loading === 'create-url') || !agreedToTerms" @click="onClickPayment">
          <v-progress-circular v-if="Boolean(loading === 'create-url')" width="2" size="18" color="white" indeterminate />
          <template v-else>
            <v-icon size="18">mdi-credit-card-outline</v-icon>
            Thanh toÃ¡n ngay
          </template>
        </button>

        <div class="checkout-secure">
          <v-icon size="13">mdi-lock-outline</v-icon>
          Thanh toÃ¡n báº£o máº­t Â· KÃ­ch hoáº¡t tá»©c thÃ¬
        </div>
      </div>

      <!-- Contact -->
      <div class="contact-box">
        <v-icon size="16" color="#1e88e5">mdi-chat-processing-outline</v-icon>
        <span>
          Cáº§n há»— trá»£? LiÃªn há»‡ Zalo
          <a href="https://zalo.me/0343027232" target="_blank" class="contact-link">034 302 7232</a>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* â”€â”€â”€ Layout â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.pay-wrap {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 28px;
  align-items: start;
  max-width: 900px;
  margin: 0 auto;
  padding-bottom: 60px;
}

@media (max-width: 750px) {
  .pay-wrap { grid-template-columns: 1fr; }
}

/* â”€â”€â”€ Left â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.pay-left {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  padding: 22px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.pay-left-header {
  margin-bottom: 18px;
}

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

/* â”€â”€â”€ Plan list â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.plan-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}

.plan-item {
  position: relative;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
}

.plan-item:hover {
  border-color: #90caf9;
}

.plan-item--active {
  border-color: #1e88e5;
  background: #f0f7ff;
}

.plan-item--popular {
  border-color: #1e88e5;
  margin-top: 8px;
  padding-top: 20px;
}

.plan-popular-badge {
  position: absolute;
  top: -10px;
  left: 16px;
  font-size: 0.65rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #1565c0, #1e88e5);
  padding: 2px 10px;
  border-radius: 999px;
  letter-spacing: 0.3px;
}

.plan-item-top {
  display: flex;
  align-items: center;
  gap: 12px;
}

.plan-radio {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.15s;
}

.plan-item--active .plan-radio {
  border-color: #1e88e5;
}

.plan-radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: transparent;
  transition: background 0.15s;
}

.plan-radio-dot--on {
  background: #1e88e5;
}

.plan-item-info {
  flex: 1;
}

.plan-item-label {
  font-size: 0.88rem;
  font-weight: 600;
  color: #1a1a1a;
}

.plan-item-price {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 2px;
}

.plan-item-right {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
}

.plan-save-badge {
  font-size: 0.68rem;
  font-weight: 700;
  color: #10b981;
  background: #ecfdf5;
  padding: 2px 8px;
  border-radius: 999px;
}

.plan-item-per {
  font-size: 0.75rem;
  color: #9e9e9e;
}

/* â”€â”€â”€ Includes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

.includes-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.include-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.83rem;
  color: #374151;
}

/* â”€â”€â”€ Checkout card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.checkout-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  padding: 22px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 18px;
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
  padding: 8px 12px;
  background: #ecfdf5;
  border-radius: 8px;
}

/* â”€â”€â”€ Summary â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
  font-size: 0.85rem;
  color: #374151;
}

.sum-original {
  color: #9e9e9e;
  text-decoration: line-through;
}

.sum-off {
  color: #10b981;
  font-weight: 600;
}

.sum-sep {
  border-top: 1px dashed #e5e7eb;
  margin: 4px 0;
}

.sum-row--total {
  font-weight: 700;
  font-size: 0.95rem;
}

.sum-total {
  color: #e53935;
  font-size: 1.25rem;
  font-weight: 800;
}

/* â”€â”€â”€ Button â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

.checkout-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.checkout-secure {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 0.72rem;
  color: #9e9e9e;
}

/* â”€â”€â”€ VAT + Agree â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.sum-vat {
  font-size: 0.72rem;
  color: #94a3b8;
  text-align: right;
  margin-top: 4px;
}

.agree-check {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.8rem;
  color: #475569;
  line-height: 1.5;
  cursor: pointer;
  margin-bottom: 4px;
}

.agree-check input[type="checkbox"] {
  margin-top: 2px;
  flex-shrink: 0;
  accent-color: #1565c0;
  width: 15px;
  height: 15px;
  cursor: pointer;
}

.agree-check a {
  color: #1565c0;
  text-decoration: none;
}

.agree-check a:hover { text-decoration: underline; }

/* â”€â”€â”€ Contact â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

.contact-link:hover {
  text-decoration: underline;
}
</style>
