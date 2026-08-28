<script setup lang="ts">
import { storeService } from "~/services/app";

const router = useRouter();
const {
  onGetterUserData: userData,
  onGetterDisplayLogin: displayLogin,
  onActionSetSystemPopup,
} = useAppStore();

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
// Giống ô "Thông tin sản phẩm"/đồng ý điều khoản ở trang Đăng ký dịch vụ
// (dang-ky-dich-vu.vue) — bắt buộc tích đồng ý mới cho nạp, đúng quy định
// hiển thị đủ thông tin trước khi thanh toán.
// [2026-08-28] Mặc định ĐÓNG trên điện thoại, mở trên desktop — set lúc MỞ
// dialog (onOpenTopup), KHÔNG set tĩnh ở đây lúc component setup: useDevice()
// đo width qua onMounted (bắt đầu = 0 -> isMobile.value luôn true lúc setup,
// chưa kịp đo thật), set tĩnh 1 lần ở đây sẽ luôn bắt nhầm là mobile.
const { isMobile } = useDevice();
const showTopupProductInfo = ref<boolean>(true);
const agreedToTopupTerms = ref<boolean>(false);
const showTopupTermsError = ref<boolean>(false);
// Ô "Đồng ý điều khoản" nằm cuối popup, dễ bị khuất dưới "Thông tin sản
// phẩm" — nếu bấm "Nạp ví ngay" mà chưa tích, phải tự cuộn xuống cho user
// THẤY NGAY lỗi, không để lỗi hiện âm thầm ở phần đang bị che khuất.
const agreeCheckSectionRef = ref<HTMLElement | null>(null);

// Lịch sử ví CỦA CHÍNH USER (khác trang admin xem của TẤT CẢ user) — dùng
// chung 1 dialog cho cả "Lịch sử nạp tiền" và "Lịch sử mua hàng", chỉ khác
// tham số `type` gửi lên BE (xem store.service.ts getWalletTransactions).
const historyDialogRef = ref<any>(null);
const historyType = ref<"topup" | "generation">("topup");
const historyLoading = ref(false);
const historyLoadingMore = ref(false);
const historyDocs = ref<any[]>([]);
const historyPage = ref(1);
const historyTotalDocs = ref(0);
const HISTORY_PAGE_SIZE = 20;

const previewDialogRef = ref<any>(null);
const previewTemplate = ref<any>(null);
// <video controls> không có poster nên hiện nền đen trong lúc chờ tải đủ dữ
// liệu — che bằng shimmer, reset lại mỗi lần mở dialog (đổi mẫu khác).
const previewVideoLoaded = ref(false);

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

  // Chặn sớm ngay tại đây (thay vì để user điều hướng sang trang tạo rồi mới
  // biết lỗi) — giá lấy đúng giá ĐÃ ÁP DỤNG giảm 40% nếu có, khớp giá thật sẽ
  // bị trừ (xem product.service.ts).
  const tpl = id ? templates.value.find((t) => t._id === id) : null;
  const price = id
    ? (tpl?.discountedPrice ?? tpl?.price ?? 0)
    : (defaultDiscountedPrice.value ?? defaultPrice.value);

  if (walletBalance.value < price) {
    onActionSetSystemPopup({
      type: "error",
      content: `Số dư ví Cửa hàng không đủ (còn ${formatCurrency(walletBalance.value)}, cần ${formatCurrency(price)}). Vui lòng nạp thêm!`,
    });
    return;
  }

  router.push(`/thu-vien-cua-toi/tao-moi?templateId=${id || "default"}`);
}

function onOpenPreview(tpl: any) {
  previewTemplate.value = tpl;
  previewVideoLoaded.value = false;
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
  agreedToTopupTerms.value = false;
  showTopupTermsError.value = false;
  // Mặc định đóng trên điện thoại, mở trên desktop — set đúng lúc mở dialog
  // (page đã mounted xong, isMobile.value đo đúng thật lúc này).
  showTopupProductInfo.value = !isMobile.value;
  walletDialogRef.value?.onDisplay(true);
}

async function onOpenHistory(type: "topup" | "generation") {
  if (!userData.value?._id) {
    displayLogin.value = true;
    return;
  }
  historyType.value = type;
  historyDialogRef.value?.onDisplay(true);
  historyDocs.value = [];
  historyPage.value = 1;
  historyTotalDocs.value = 0;
  historyLoading.value = true;
  try {
    const res = await storeService.getWalletTransactions({
      type,
      page: 1,
      limit: HISTORY_PAGE_SIZE,
    });
    historyDocs.value = res.data?.docs || [];
    historyTotalDocs.value = res.data?.totalDocs || 0;
  } catch (error) {
    console.log("Lỗi khi tải lịch sử ví!", error);
  } finally {
    historyLoading.value = false;
  }
}

async function onLoadMoreHistory() {
  if (historyLoadingMore.value) return;
  historyLoadingMore.value = true;
  try {
    const nextPage = historyPage.value + 1;
    const res = await storeService.getWalletTransactions({
      type: historyType.value,
      page: nextPage,
      limit: HISTORY_PAGE_SIZE,
    });
    historyDocs.value = [...historyDocs.value, ...(res.data?.docs || [])];
    historyTotalDocs.value = res.data?.totalDocs || historyTotalDocs.value;
    historyPage.value = nextPage;
  } catch (error) {
    console.log("Lỗi khi tải thêm lịch sử ví!", error);
  } finally {
    historyLoadingMore.value = false;
  }
}

async function onClickTopup() {
  if (topupLoading.value) return;
  if (!agreedToTopupTerms.value) {
    showTopupTermsError.value = true;
    // Đợi DOM render xong dòng lỗi (thêm chiều cao mới cho khối này) rồi mới
    // cuộn — cuộn ngay lúc set state cũ sẽ tính sai vị trí (chưa tính chiều
    // cao dòng lỗi vừa thêm vào). block: "end" để dòng lỗi (nằm CUỐI khối)
    // luôn lộ hẳn phía trên nút "Nạp ví ngay", không bị kẹt sát mép popup.
    nextTick(() => {
      agreeCheckSectionRef.value?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });
    return;
  }
  showTopupTermsError.value = false;
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
    <div class="mt-2 topup-form">
      <div class="checkout-field">
        <label class="field-label">Số tiền nạp (đ)</label>
        <v-number-input
          v-model="topupAmount"
          class="topup-amount-field"
          variant="outlined"
          control-variant="stacked"
          :min="10000"
          :max="500000"
          :step="10000"
          hide-details
        />
        <div class="field-hint">Nạp tối thiểu 10.000đ, tối đa 500.000đ mỗi lần.</div>

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

      <!-- Summary -->
      <div class="checkout-summary">
        <div class="sum-product">
          <span class="sum-product-name">Nạp ví Cửa hàng</span>
          <span class="sum-pkg-price">{{ formatCurrency(topupAmount) }}</span>
        </div>
        <div class="sum-row">
          <span>Số lượng</span>
          <span>1</span>
        </div>
        <div class="sum-sep" />
        <div class="sum-row sum-row--total">
          <span>Thành tiền</span>
          <span class="sum-total">{{ formatCurrency(topupAmount) }}</span>
        </div>
        <div class="sum-vat">Đã bao gồm thuế VAT</div>
      </div>

      <!-- Thông tin sản phẩm -->
      <div class="product-info">
        <div class="product-info-title" @click="showTopupProductInfo = !showTopupProductInfo">
          Thông tin sản phẩm
          <v-icon class="pi-toggle-icon" size="18" color="#475569">
            {{ showTopupProductInfo ? "mdi-chevron-up" : "mdi-chevron-down" }}
          </v-icon>
        </div>
        <div class="product-info-list" :class="{ 'pi-collapsed': !showTopupProductInfo }">
          <div class="pi-row">
            <span class="pi-label">Dịch vụ</span>
            <span class="pi-val">Nạp tiền vào ví Cửa hàng để tạo video AI theo mẫu có sẵn</span>
          </div>
          <div class="pi-row">
            <span class="pi-label">Nguồn gốc/xuất xứ</span>
            <span class="pi-val">Sản phẩm/dịch vụ do TN Solve phát triển và cung cấp</span>
          </div>
          <div class="pi-row">
            <span class="pi-label">Hình thức sử dụng</span>
            <span class="pi-val">Số dư được cộng vào ví, trừ dần khi tạo video, không giới hạn thời gian sử dụng</span>
          </div>
          <div class="pi-row">
            <span class="pi-label">Số tiền nạp</span>
            <span class="pi-val"><strong>{{ formatCurrency(topupAmount) }}</strong>, đã bao gồm VAT</span>
          </div>
          <div class="pi-row">
            <span class="pi-label">Trước khi thanh toán</span>
            <span class="pi-val">Khách hàng được kiểm tra lại số tiền nạp và tổng số tiền cần thanh toán</span>
          </div>
          <div class="pi-row">
            <span class="pi-label">Giao hàng</span>
            <span class="pi-val">Số dư được cộng vào ví ngay sau khi thanh toán thành công</span>
          </div>
        </div>
      </div>

      <!-- Đồng ý điều khoản -->
      <div ref="agreeCheckSectionRef">
        <label class="agree-check" @click="showTopupTermsError = false">
          <input v-model="agreedToTopupTerms" type="checkbox" />
          <span>
            Tôi đã đọc và đồng ý với
            <a href="/dieu-khoan" target="_blank"><strong>Điều khoản dịch vụ</strong></a>
            và
            <a href="/chinh-sach-bao-mat" target="_blank"><strong>Chính sách bảo mật</strong></a>
          </span>
        </label>
        <p v-if="showTopupTermsError" class="terms-error">
          <v-icon size="16" color="#b91c1c">mdi-alert-circle</v-icon>
          Vui lòng tích vào ô trên để đồng ý với điều khoản!
        </p>
      </div>
    </div>

    <template #footer>
      <button
        class="checkout-btn"
        :disabled="Boolean(topupLoading)"
        @click="onClickTopup"
      >
        <v-progress-circular v-if="topupLoading" width="2" size="18" color="white" indeterminate />
        <template v-else>
          <v-icon size="18">mdi-wallet-plus-outline</v-icon>
          Nạp ví ngay
        </template>
      </button>
    </template>
  </CommonDialog>

  <CommonDialog
    ref="historyDialogRef"
    :title="historyType === 'topup' ? 'Lịch sử nạp tiền' : 'Lịch sử mua hàng'"
    width="530"
  >
    <div class="mt-2 history-list">
      <div v-if="historyLoading" class="text-center py-6">
        <v-progress-circular indeterminate color="primary" />
      </div>

      <div v-else-if="!historyDocs.length" class="text-center text-medium-emphasis py-6">
        Chưa có giao dịch nào.
      </div>

      <div v-else>
        <div v-for="doc in historyDocs" :key="doc._id" class="history-row">
          <div class="history-row-main">
            <span class="history-row-title">
              {{ historyType === "topup" ? "Nạp ví Cửa hàng" : doc.templateTitle }}
            </span>
            <span class="history-row-time">{{ doc.createdAt }}</span>
          </div>

          <div class="history-row-side">
            <v-chip v-if="doc.discountPercent > 0" color="success" size="x-small" class="mb-1">
              -{{ doc.discountPercent }}%
            </v-chip>
            <span
              class="history-row-amount"
              :class="historyType === 'topup' ? 'text-success' : 'text-red'"
            >
              {{ historyType === "topup" ? "+" : "-" }}{{ doc.amount.toLocaleString("vi-VN") }}đ
            </span>
            <a
              v-if="doc.videoUrl"
              :href="doc.videoUrl"
              target="_blank"
              rel="noopener"
              class="history-row-link"
            >
              Xem video
            </a>
          </div>
        </div>

        <div v-if="historyDocs.length < historyTotalDocs" class="text-center pt-3">
          <span
            class="history-load-more"
            @click="!historyLoadingMore && onLoadMoreHistory()"
          >
            {{ historyLoadingMore ? "Đang tải..." : "Xem thêm" }}
          </span>
        </div>
      </div>
    </div>
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

        <div v-if="Object.values(userData || {})?.length" class="wallet-area">
          <div
            v-if="userData?.role !== EnumAccountRole.ADMIN"
            class="wallet-history-links"
          >
            <button type="button" class="wallet-history-link" @click="onOpenHistory('topup')">
              <v-icon size="14" color="#fff">mdi-history</v-icon>
              Lịch sử nạp tiền
            </button>
            <button type="button" class="wallet-history-link" @click="onOpenHistory('generation')">
              <v-icon size="14" color="#fff">mdi-cart-outline</v-icon>
              Lịch sử mua hàng
            </button>
          </div>

          <button type="button" class="wallet-btn" @click="onOpenTopup" title="Nạp tiền">
            <div class="wallet-btn-icon">
              <v-icon size="18" color="#fff">mdi-wallet-outline</v-icon>
            </div>
            <span class="wallet-btn-value">{{ walletBalance.toLocaleString("vi-VN") }}đ</span>
            <div class="wallet-btn-add">
              <v-icon size="18" color="#fff">mdi-plus</v-icon>
            </div>
          </button>
        </div>
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
          <v-img v-if="tpl.thumbnail" :src="tpl.thumbnail" cover height="100%">
            <template #placeholder>
              <div class="img-loading-overlay" />
            </template>
          </v-img>
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
          <video
            :src="previewTemplate.sampleVideo"
            controls
            class="preview-video"
            @loadeddata="previewVideoLoaded = true"
          />
          <div v-if="!previewVideoLoaded" class="video-loading-overlay" />
        </div>
        <div v-else-if="previewTemplate.thumbnail" class="preview-video-wrap">
          <v-img :src="previewTemplate.thumbnail" cover height="100%" class="preview-video" />
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
  height: 52px;
  padding: 0 10px;
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

.wallet-btn-value {
  font-size: 1.05rem;
  color: #fff;
  font-weight: 400;
  white-space: nowrap;
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

.wallet-area {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 10px;
  flex-shrink: 0;
}

.wallet-history-links {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.wallet-history-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  padding: 0 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.35);
  cursor: pointer;
  font: inherit;
  font-size: 0.85rem;
  font-weight: 400;
  color: #fff;
  white-space: nowrap;
  transition: background 0.18s, transform 0.18s, box-shadow 0.18s;
}

.wallet-history-link:hover {
  background: rgba(255, 255, 255, 0.22);
}

.history-list {
  max-height: 60vh;
  overflow-y: auto;
}

.history-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.history-row:last-child {
  border-bottom: none;
}

.history-row-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.history-row-title {
  font-size: 0.88rem;
  font-weight: 600;
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-row-time {
  font-size: 0.72rem;
  color: #94a3b8;
}

.history-row-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
  gap: 2px;
}

.history-row-amount {
  font-size: 0.9rem;
  font-weight: 700;
  white-space: nowrap;
}

.history-row-link {
  font-size: 0.72rem;
  color: #1565c0;
  text-decoration: none;
}

.history-row-link:hover {
  text-decoration: underline;
}

.history-load-more {
  font-size: 0.85rem;
  color: #1565c0;
  cursor: pointer;
}

.history-load-more:hover {
  text-decoration: underline;
}

@media (max-width: 700px) {
  .shop-hero { padding: 24px 20px; border-radius: 12px; }
  .hero-inner { flex-direction: column; align-items: stretch; gap: 16px; }
  .hero-title { font-size: 1.3rem; }
  .wallet-area { align-items: stretch; }
  .wallet-btn { flex: 1.4; }
  .wallet-btn-add { margin-left: auto; }
  .wallet-history-links { flex: 1; }
  .wallet-history-link { font-size: 0.75rem; padding: 0 8px; }
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

.video-loading-overlay,
.img-loading-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  background: #e2e8f0;
  background-image: linear-gradient(
    100deg,
    transparent 30%,
    rgba(255, 255, 255, 0.7) 50%,
    transparent 70%
  );
  background-size: 200% 100%;
  animation: video-shimmer 1.4s ease-in-out infinite;
}

@keyframes video-shimmer {
  0% {
    background-position: 150% 0;
  }
  100% {
    background-position: -50% 0;
  }
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

/* ─── Nạp ví — giống bố cục trang Đăng ký dịch vụ (dang-ky-dich-vu.vue) ──── */
.topup-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.field-hint {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 6px;
}

/* Khớp chiều cao ô nhập số tiền với nút "Nạp ví ngay" (48px) */
.topup-amount-field :deep(.v-field__input) {
  min-height: 48px;
  padding-top: 0;
  padding-bottom: 0;
  align-items: center;
}

.topup-amount-field :deep(.v-field__field) {
  min-height: 48px;
}

.checkout-summary {
  background: #f8fafc;
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

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
.sum-pkg-price { font-size: 0.9rem; font-weight: 700; color: #1565c0; white-space: nowrap; }

.sum-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  font-size: 0.85rem;
  color: #374151;
}

.sum-sep { border-top: 1px dashed #e5e7eb; margin: 4px 0; }
.sum-row--total { font-weight: 700; font-size: 0.95rem; }
.sum-total { color: #e53935; font-size: 1.25rem; font-weight: 800; }
.sum-vat { font-size: 0.72rem; color: #94a3b8; text-align: right; margin-top: 4px; }

.product-info {
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
  cursor: pointer;
}

.product-info-list {
  padding: 4px 0;
  display: grid;
  grid-template-columns: max-content 1fr;
  column-gap: 14px;
  font-size: 0.8rem;
  line-height: 1.5;
}
.product-info-list.pi-collapsed { display: none; }

/* display:contents — mỗi .pi-row không tạo box riêng, để .pi-label/.pi-val
   bên trong trở thành item TRỰC TIẾP của grid cha, nhờ vậy cột trái luôn
   canh thẳng hàng (rộng theo nhãn dài nhất) thay vì lệch theo từng dòng. */
.pi-row { display: contents; }

.pi-label,
.pi-val {
  padding: 7px 0;
  border-bottom: 1px solid #f1f5f9;
}

.pi-row:last-child .pi-label,
.pi-row:last-child .pi-val {
  border-bottom: none;
}

.pi-label {
  padding-left: 14px;
  white-space: nowrap;
  color: #64748b;
  font-weight: 500;
}

.pi-val { padding-right: 14px; color: #334155; }

.agree-check {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: #475569;
  line-height: 1.5;
  cursor: pointer;
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

.agree-check input[type="checkbox"]:hover { border-color: #1e88e5; }

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
  box-shadow: 0 4px 14px rgba(30, 136, 229, 0.35);
  transition: transform 0.15s, box-shadow 0.15s;
}

.checkout-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(30, 136, 229, 0.45);
}

.checkout-btn:disabled { opacity: 0.7; cursor: not-allowed; }
</style>
