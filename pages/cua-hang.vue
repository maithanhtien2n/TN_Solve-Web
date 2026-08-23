<script setup lang="ts">
import { storeService } from "~/services/app";

const router = useRouter();
const { onGetterUserData: userData, onGetterDisplayLogin: displayLogin } =
  useAppStore();

const templates = ref<any[]>([]);
const defaultPrice = ref<number>(0);
// Giá đã giảm 40% cho user đang thuê gói dịch vụ còn hạn — null nếu không có
// ưu đãi (chưa đăng nhập hoặc không có gói còn hạn, xem store.service.ts
// getDiscountedPriceFn). Áp dụng tương tự cho từng tpl.discountedPrice.
const defaultDiscountedPrice = ref<number | null>(null);
const walletBalance = ref<number>(0);

const walletDialogRef = ref<any>(null);
const topupAmount = ref<number>(50000);
const topupLoading = ref(false);
const topupPresets = [10000, 20000, 50000, 100000, 200000, 500000];

const previewDialogRef = ref<any>(null);
const previewTemplate = ref<any>(null);

async function loadTemplates() {
  try {
    const res = await storeService.getTemplates();
    templates.value = res.data || [];
  } catch (error) {
    console.log("Lỗi khi tải danh sách mẫu video!", error);
  }
}

async function loadDefaultPrice() {
  try {
    const res = await storeService.getDefaultPrice();
    defaultPrice.value = res.data?.price || 0;
    defaultDiscountedPrice.value = res.data?.discountedPrice ?? null;
  } catch (error) {
    console.log("Lỗi khi tải giá mặc định!", error);
  }
}

async function loadWallet() {
  if (!userData.value?._id) return;
  try {
    const res = await storeService.getWallet();
    walletBalance.value = res.data?.balance || 0;
  } catch (error) {
    console.log("Lỗi khi tải số dư ví!", error);
  }
}

onMounted(() => {
  loadTemplates();
  loadDefaultPrice();
  loadWallet();
});

watch(
  () => userData.value?._id,
  (id) => {
    if (id) loadWallet();
    else walletBalance.value = 0;
    // Giá ưu đãi phụ thuộc trạng thái đăng nhập (gói thuê gắn với account) —
    // tải lại để cập nhật ngay khi đăng nhập/đăng xuất, không cần F5 trang.
    loadTemplates();
    loadDefaultPrice();
  }
);

// Nhập liệu (ảnh/prompt) + tạo video thật sự diễn ra ở trang tao-moi.vue —
// dùng lại đúng pipeline video chính (sống sót qua reload, hiện trong thư
// viện, công khai cộng đồng, tự xoá sau 24h) thay vì tạo tại chỗ như trước.
// "default" là sentinel cho lựa chọn "Tạo mặc định" (không theo mẫu nào).
// Bấm thẳng vào card = điều hướng ngay, không cần bước "chọn" riêng.
function onClickTemplateCard(id: string | null) {
  if (!userData.value?._id) {
    displayLogin.value = true;
    return;
  }
  router.push(`/thu-vien-cua-toi/tao-moi?templateId=${id || "default"}`);
}

function onOpenPreview(tpl: any) {
  previewTemplate.value = tpl;
  previewDialogRef.value?.onDisplay(true);
}

function onConfirmCreateFromPreview() {
  if (!previewTemplate.value) return;
  previewDialogRef.value?.onDisplay(false);
  onClickTemplateCard(previewTemplate.value._id);
}

function onOpenTopup() {
  if (!userData.value?._id) {
    displayLogin.value = true;
    return;
  }
  walletDialogRef.value?.onDisplay(true);
}

async function onClickTopup() {
  if (topupLoading.value) return;
  topupLoading.value = true;
  try {
    const res = await storeService.createWalletTopupPayment({
      amount: topupAmount.value,
    });
    if (res.data) {
      localStorage.setItem(
        "pendingPaymentSummary",
        JSON.stringify({
          items: [{ label: "Nạp ví Cửa hàng", price: topupAmount.value }],
          total: topupAmount.value,
        })
      );
      window.location.href = res.data;
    }
  } catch (error) {
    console.log("Lỗi khi tạo link nạp ví!", error);
  } finally {
    topupLoading.value = false;
  }
}

useSeo({
  title: "Cửa hàng",
  description:
    "Tạo video AI theo mẫu có sẵn chỉ với 1 cú click - Cửa hàng TN Solve.",
  image: "/images/page-home.png",
  keywords: "cửa hàng, tạo video theo mẫu, video AI mẫu có sẵn, TN Solve",
});
</script>

<template>
  <CommonDialog ref="walletDialogRef" title="Nạp ví Cửa hàng" width="530">
    <div class="mt-2">
      <div class="text-body-2 text-medium-emphasis mb-3">
        Số dư hiện tại:
        <strong>{{ walletBalance.toLocaleString("vi-VN") }}đ</strong>
        — Nạp tối thiểu 10.000đ, tối đa 500.000đ mỗi lần.
      </div>

      <v-number-input
        v-model="topupAmount"
        variant="outlined"
        control-variant="stacked"
        :min="10000"
        :max="500000"
        :step="10000"
        label="Số tiền nạp (đ)"
        hide-details
      />

      <div class="topup-presets">
        <v-chip
          v-for="amt in topupPresets"
          :key="amt"
          size="small"
          variant="tonal"
          :color="topupAmount === amt ? 'primary' : undefined"
          @click="topupAmount = amt"
        >
          {{ amt.toLocaleString("vi-VN") }}đ
        </v-chip>
      </div>
    </div>

    <template #footer>
      <div
        class="cta-button w-100 justify-center"
        :class="{ disabled: topupLoading }"
        style="border-radius: 6px"
        @click="!topupLoading && onClickTopup()"
      >
        <v-progress-circular
          v-if="topupLoading"
          width="2"
          size="23"
          color="white"
          indeterminate
        />
        <v-icon v-else size="27">mdi-wallet-plus-outline</v-icon>
        <h3>Nạp ví</h3>
      </div>
    </template>
  </CommonDialog>

  <div class="shop-page">
    <!-- Hero -->
    <div class="shop-hero">
      <div class="hero-blob" />
      <div class="hero-blob2" />
      <div class="hero-inner">
        <div class="hero-left">
          <h1 class="hero-title">Cửa hàng</h1>
          <div class="hero-checks">
            <div class="hero-check">
              <v-icon size="14" color="rgba(255,255,255,0.9)">mdi-check-circle</v-icon>
              Giảm 40% cho khách hàng đang sử dụng gói
            </div>
          </div>
        </div>

        <button
          v-if="Object.values(userData || {})?.length"
          type="button"
          class="wallet-btn"
          @click="onOpenTopup"
        >
          <div class="wallet-btn-icon">
            <v-icon size="18" color="#fff">mdi-wallet-outline</v-icon>
          </div>
          <div class="wallet-btn-text">
            <span class="wallet-btn-label">Số dư ví</span>
            <span class="wallet-btn-value">{{ walletBalance.toLocaleString("vi-VN") }}đ</span>
          </div>
          <div class="wallet-btn-add">
            <v-icon size="18" color="#fff">mdi-plus</v-icon>
          </div>
        </button>
      </div>
    </div>

    <!-- Lưới mẫu video -->
    <div class="template-grid">
      <div class="template-card">
        <div class="template-card-media template-card-media--default">
          <v-icon size="34" color="#fff">mdi-auto-fix</v-icon>
          <div v-if="defaultDiscountedPrice != null" class="template-card-discount-badge">
            -{{ Math.round((1 - defaultDiscountedPrice / defaultPrice) * 100) }}%
          </div>
          <div class="template-card-price">
            <span v-if="defaultDiscountedPrice != null" class="template-card-price-old">
              {{ formatCurrency(defaultPrice) }}
            </span>
            {{ formatCurrency(defaultDiscountedPrice ?? defaultPrice) }}
          </div>
        </div>
        <div class="template-card-body">
          <div class="template-card-title">Tạo mặc định</div>
        </div>
        <button type="button" class="template-card-cta" @click="onClickTemplateCard(null)">
          <v-icon size="18">mdi-movie-open-play-outline</v-icon>
          Tạo video
        </button>
      </div>

      <div v-for="tpl in templates" :key="tpl._id" class="template-card">
        <div class="template-card-media">
          <v-img v-if="tpl.thumbnail" :src="tpl.thumbnail" cover height="100%" />
          <v-icon v-else size="34" color="#cbd5e1">mdi-image-outline</v-icon>
          <div v-if="tpl.discountedPrice != null" class="template-card-discount-badge">
            -{{ Math.round((1 - tpl.discountedPrice / tpl.price) * 100) }}%
          </div>
          <div class="template-card-price">
            <span v-if="tpl.discountedPrice != null" class="template-card-price-old">
              {{ formatCurrency(tpl.price) }}
            </span>
            {{ formatCurrency(tpl.discountedPrice ?? tpl.price) }}
          </div>
        </div>
        <div class="template-card-body">
          <div class="template-card-title">{{ tpl.title }}</div>
        </div>
        <button type="button" class="template-card-cta" @click="onOpenPreview(tpl)">
          <v-icon size="18">mdi-eye-outline</v-icon>
          Xem mẫu
        </button>
      </div>
    </div>

    <!-- Xem mẫu video -->
    <CommonDialog ref="previewDialogRef" :title="previewTemplate?.title || ''" width="530">
      <div v-if="previewTemplate" class="preview-body">
        <div class="preview-price">
          <span v-if="previewTemplate.discountedPrice != null" class="preview-price-old">
            {{ formatCurrency(previewTemplate.price) }}
          </span>
          {{ formatCurrency(previewTemplate.discountedPrice ?? previewTemplate.price) }}
          <span v-if="previewTemplate.discountedPrice != null" class="preview-price-badge">
            -{{ Math.round((1 - previewTemplate.discountedPrice / previewTemplate.price) * 100) }}%
          </span>
        </div>

        <div v-if="previewTemplate.sampleVideo" class="preview-video-wrap">
          <video :src="previewTemplate.sampleVideo" controls class="preview-video" />
        </div>

        <StoreFieldCard v-if="previewTemplate.exampleImages?.length" label="Ảnh yêu cầu">
          <div class="preview-images">
            <v-img
              v-for="(img, idx) in previewTemplate.exampleImages"
              :key="idx"
              :src="img"
              contain
              class="preview-image"
            />
          </div>
        </StoreFieldCard>

        <StoreFieldCard v-if="previewTemplate.promptFields?.length" label="Thông tin yêu cầu" compact>
          <div class="preview-req">
            {{ previewTemplate.promptFields.map((f: any) => f.title).join(", ") }}
          </div>
        </StoreFieldCard>
      </div>

      <template #footer>
        <div
          class="cta-button w-100 justify-center"
          style="border-radius: 6px"
          @click="onConfirmCreateFromPreview"
        >
          <v-icon size="22">mdi-movie-open-play-outline</v-icon>
          <h3>Tạo video</h3>
        </div>
      </template>
    </CommonDialog>
  </div>
</template>

<style scoped>
.shop-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ─── Hero ───────────────────────────────────────────── */
.shop-hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #4e342e 0%, #6d4c41 40%, #8d6e63 80%, #bcaaa4 100%);
  border-radius: 16px;
  padding: 28px 36px;
  color: #fff;
}

.hero-blob {
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  top: -80px;
  right: -40px;
  pointer-events: none;
}

.hero-blob2 {
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.07) 0%, transparent 70%);
  bottom: -50px;
  left: 200px;
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

.hero-left {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

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
  color: rgba(255, 255, 255, 0.85);
}

.wallet-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  padding: 8px 10px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.35);
  cursor: pointer;
  font: inherit;
  transition: background 0.18s, transform 0.18s, box-shadow 0.18s;
}

.wallet-btn:hover {
  background: rgba(255, 255, 255, 0.22);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
}

.wallet-btn:active {
  transform: translateY(0);
}

.wallet-btn-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
}

.wallet-btn-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
}

.wallet-btn-label {
  font-size: 0.66rem;
  color: rgba(255, 255, 255, 0.72);
  font-weight: 600;
}

.wallet-btn-value {
  font-size: 1.05rem;
  color: #fff;
  font-weight: 800;
}

.wallet-btn-add {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 2px;
  transition: background 0.18s;
}

.wallet-btn:hover .wallet-btn-add {
  background: rgba(255, 255, 255, 0.35);
}

@media (max-width: 700px) {
  .shop-hero { padding: 24px 20px; border-radius: 12px; }
  .hero-inner { flex-direction: column; align-items: stretch; gap: 16px; }
  .hero-title { font-size: 1.3rem; }
  .wallet-btn { width: 100%; }
  .wallet-btn-add { margin-left: auto; }
}

/* ─── Lưới mẫu video ─────────────────────────────────── */
.template-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 900px) {
  .template-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
}

@media (max-width: 550px) {
  .template-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

.template-card {
  display: flex;
  flex-direction: column;
  text-align: left;
  font: inherit;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.template-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  border-color: #e0e0e0;
}

.template-card-media {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  overflow: hidden;
}

.template-card-media--default {
  background: linear-gradient(135deg, #1e3a5f 0%, #1565c0 100%);
}

.template-card-body {
  padding: 10px 12px 4px;
}

.template-card-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.45;
  color: #1a1a1a;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: color 0.18s ease;
}

.template-card:hover .template-card-title {
  color: #1e88e5;
}

.template-card-price {
  position: absolute;
  right: 8px;
  bottom: 8px;
  z-index: 1;
  font-size: 0.92rem;
  font-weight: 700;
  color: #fff;
  background: rgba(20, 20, 20, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 20px;
  padding: 3px 10px;
  letter-spacing: 0.2px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.template-card-price-old {
  text-decoration: line-through;
  opacity: 0.65;
  font-size: 0.76rem;
  font-weight: 500;
  margin-right: 4px;
}

.template-card-discount-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 1;
  font-size: 0.72rem;
  font-weight: 700;
  color: #15803d;
  background: #dcfce7;
  border-radius: 999px;
  padding: 2px 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.template-card-price::before {
  content: "";
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ff5252;
  margin-right: 5px;
  box-shadow: 0 0 5px #ff5252;
  vertical-align: middle;
}

.template-card-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: calc(100% - 24px);
  margin: 8px 12px 12px;
  padding: 9px;
  border: none;
  border-radius: 10px;
  background: #eaf2fd;
  color: #1565c0;
  font: inherit;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.template-card-cta:hover {
  background: #1565c0;
  color: #fff;
}

.preview-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.preview-price {
  display: flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  margin-top: -8px;
  margin-bottom: -10px;
  font-size: 1.05rem;
  font-weight: 700;
  color: #e53935;
}

.preview-price-old {
  font-size: 0.85rem;
  font-weight: 500;
  color: #94a3b8;
  text-decoration: line-through;
}

.preview-price-badge {
  font-size: 0.72rem;
  font-weight: 700;
  color: #15803d;
  background: #dcfce7;
  border-radius: 999px;
  padding: 2px 8px;
}

.preview-video-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 10px;
  overflow: hidden;
  background: #0d0d0d;
}

.preview-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.preview-req {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.88rem;
  color: #1a1a1a;
}

.preview-images {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preview-image {
  /* Luôn tính bề rộng như đang có đủ 4 ảnh/hàng, dù thực tế ít hơn — để chiều
     cao (theo tỷ lệ 16:9) không bị kéo dãn to hơn khi mẫu chỉ có 1-2 ảnh. */
  flex: 0 0 calc((100% - 3 * 8px) / 4);
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  background: #e2e8f0;
}

.topup-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}
</style>
