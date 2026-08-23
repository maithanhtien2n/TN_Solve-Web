<script setup lang="ts">
import { appService } from "~/services/app";

const { onGetterUserData: userData, onGetterDisplayPopupBuyCredit } =
  useAppStore();

const loading = ref<boolean>(false);
const commonDialogRef = ref<any>(null);
const selectedPackageIndex = ref<number>(0);

const DAY_MS = 24 * 60 * 60 * 1000;
const UNLIMITED_PRICE_PER_30_DAYS = 200000;

// Thời gian còn lại (mili giây, CHÍNH XÁC) của gói thuê chính hiện tại — dùng
// làm trần cho việc mua "Không giới hạn" ĐỘC LẬP ở đây (không kèm gia hạn gói
// thuê mới, khác với trang đăng ký dịch vụ), để không mua dư ngày vượt quá
// thời hạn gói thuê đang có.
const remainingRentalMs = computed(() => {
  const expiry = userData.value?.serviceExpiry;
  if (!expiry) return 0;
  const diffMs = new Date(expiry).getTime() - Date.now();
  return diffMs > 0 ? diffMs : 0;
});

// Thời gian còn lại (mili giây, CHÍNH XÁC) của gói "Không giới hạn" ĐANG CÓ
// (nếu có) — dùng để tính phần chênh lệch còn thiếu so với gói thuê chính.
const existingUnlimitedMs = computed(() => {
  const expiry = userData.value?.settings?.unlimitedExpiry;
  if (!expiry) return 0;
  const diffMs = new Date(expiry).getTime() - Date.now();
  return diffMs > 0 ? diffMs : 0;
});

const SEVEN_DAYS_MS = 7 * DAY_MS;

// Chênh lệch giữa gói thuê chính và gói Không giới hạn hiện có — chỉ cho mua
// THÊM đúng phần này để 2 gói khớp lại cùng thời điểm hết hạn. Nếu chưa có
// gói Không giới hạn nào, công thức tự rút gọn về đúng remainingRentalMs
// (giữ nguyên hành vi cũ). Nếu chênh lệch <7 ngày thì coi như = 0, chặn mua.
const gapMs = computed(() => {
  const gap = remainingRentalMs.value - existingUnlimitedMs.value;
  return gap >= SEVEN_DAYS_MS ? gap : 0;
});

// Danh sách option: tháng nguyên (1, 2, ... N tháng) trong phạm vi gapMs,
// cộng thêm 1 option cuối cho phần ngày lẻ còn dư (nếu có). Nếu gapMs dưới
// 30 ngày thì KHÔNG có option "tháng" nào, chỉ đúng 1 option ngày lẻ. Nếu
// gapMs = 0 (chưa đủ 7 ngày chênh lệch) thì danh sách rỗng — ẩn cả dòng.
const unlimitedOptions = computed(() => {
  const wholeMonths = Math.floor(gapMs.value / (30 * DAY_MS));
  const opts = Array.from({ length: wholeMonths }, (_, i) => ({
    ms: (i + 1) * 30 * DAY_MS,
    label: `${i + 1} tháng`,
  }));
  const extraMs = gapMs.value - wholeMonths * 30 * DAY_MS;
  const extraDaysRounded = Math.round(extraMs / DAY_MS);
  if (extraDaysRounded > 0) {
    const label =
      extraDaysRounded >= 30
        ? `${wholeMonths + 1} tháng`
        : wholeMonths > 0
          ? `${wholeMonths} tháng ${extraDaysRounded} ngày`
          : `${extraDaysRounded} ngày`;
    opts.push({ ms: gapMs.value, label });
  }
  return opts;
});

const selectedUnlimitedMs = ref<number>(0);
watch(
  unlimitedOptions,
  (opts) => {
    if (!opts.length) {
      selectedUnlimitedMs.value = 0;
      return;
    }
    if (!opts.some((o) => o.ms === selectedUnlimitedMs.value)) {
      selectedUnlimitedMs.value = opts[0].ms;
    }
  },
  { immediate: true }
);

const selectedUnlimitedLabel = computed(
  () =>
    unlimitedOptions.value.find((o) => o.ms === selectedUnlimitedMs.value)
      ?.label ?? ""
);

const unlimitedPrice = computed(() =>
  Math.floor(
    (selectedUnlimitedMs.value * UNLIMITED_PRICE_PER_30_DAYS) /
      (30 * DAY_MS) /
      500
  ) * 500
);

const creditPackagesData = computed(() => [
  ...(unlimitedOptions.value.length
    ? [
        {
          title: `Tạo video không giới hạn ${selectedUnlimitedLabel.value}`,
          value: -1,
          price: `${unlimitedPrice.value.toLocaleString("en-US")}đ`,
        },
      ]
    : []),

  { title: "2,000💎", value: 2000, price: "10,000đ" },
  { title: "4,000💎", value: 4000, price: "20,000đ" },
  { title: "6,000💎", value: 6000, price: "30,000đ" },
  { title: "8,000💎", value: 8000, price: "40,000đ" },
  { title: "10,000💎 (+1,000 KM)", value: 11000, price: "50,000đ" },
  { title: "12,000💎", value: 12000, price: "60,000đ" },
  { title: "14,000💎", value: 14000, price: "70,000đ" },
  { title: "16,000💎", value: 16000, price: "80,000đ" },
  { title: "18,000💎", value: 18000, price: "90,000đ" },
  { title: "20,000💎 (+4,000 KM)", value: 24000, price: "100,000đ" },
]);

const onClickPayment = async () => {
  if (loading.value) return;
  loading.value = true;
  const selectedPkg = creditPackagesData.value[selectedPackageIndex.value];
  await appService
    .createPaymentUrlBuyCredit({
      creditAmount: selectedPkg.value,
      unlimitedMs: selectedPkg.value === -1 ? selectedUnlimitedMs.value : 0,
      // true khi chọn đúng option cuối (khớp full hạn gói thuê) — báo backend
      // tính lại thời hạn TƯƠI lúc webhook cấp phát, tránh lệch giờ do thời
      // gian thanh toán (xem getMaxUnlimitedTopUpMs bên server).
      unlimitedSyncFull:
        selectedPkg.value === -1 && selectedUnlimitedMs.value === gapMs.value,
    })
    .then((res) => {
      if (res.data && res.data) {
        // Lưu lại tóm tắt gói vừa chọn để hiện đúng chi tiết ở popup "Thanh
        // toán thành công" (layouts/default.vue) — xem giải thích đầy đủ ở
        // dang-ky-dich-vu.vue (cùng cơ chế).
        const isUnlimited = selectedPkg.value === -1;
        const label = isUnlimited
          ? `Không giới hạn tín dụng ${selectedUnlimitedLabel.value}`
          : `${selectedPkg.value.toLocaleString("vi-VN")} tín dụng`;
        const price = isUnlimited
          ? unlimitedPrice.value
          : Number(String(selectedPkg.price).replace(/[^\d]/g, ""));
        localStorage.setItem(
          "pendingPaymentSummary",
          JSON.stringify({ items: [{ label, price }], total: price })
        );
        window.location.href = res.data;
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

watch(onGetterDisplayPopupBuyCredit, (newVal) => {
  if (newVal && unlimitedOptions.value.length) {
    // Mỗi lần mở lại popup -> reset dropdown "Không giới hạn" về mặc định 1
    // tháng (option đầu), tránh giữ lại lựa chọn dài của lần mở trước (VD
    // chọn "3 tháng" rồi đóng mở lại vẫn còn "3 tháng" gây hiểu nhầm).
    selectedUnlimitedMs.value = unlimitedOptions.value[0].ms;
  }
  commonDialogRef.value.onDisplay(newVal);
});
</script>

<template>
  <CommonDialog
    ref="commonDialogRef"
    title="Mua tín dụng"
    width="530"
    @change="(e) => (onGetterDisplayPopupBuyCredit = e)"
  >
    <div class="text-center mb-2">
      <v-icon icon="mdi-gift" color="amber-darken-1" size="small" />
      <span class="font-bold text-blue-darken-3 ml-2">
        Tặng thêm tín dụng khi bạn chọn gói 50.000đ hoặc 100.000đ
      </span>
    </div>

    <v-radio-group
      v-model="selectedPackageIndex"
      hide-details
      style="margin-bottom: -1rem"
    >
      <v-list class="bg-transparent" dense>
        <v-list-item
          v-for="(pkg, index) in creditPackagesData"
          :key="index"
          @click="selectedPackageIndex = index"
          class="border mb-3 rounded-lg"
        >
          <div class="d-flex align-center items-center">
            <v-radio v-if="pkg.value === -1" :value="index" color="primary" hide-details class="unlimited-radio">
              <template #label>
                <span class="unlimited-radio-label">
                  <span class="unlimited-radio-text">Tạo video không giới hạn</span>
                  <select
                    v-if="unlimitedOptions.length > 1"
                    v-model.number="selectedUnlimitedMs"
                    class="unlimited-native-select"
                  >
                    <option v-for="opt in unlimitedOptions" :key="opt.ms" :value="opt.ms">{{ opt.label }}</option>
                  </select>
                  <span v-else class="unlimited-static-label">{{ selectedUnlimitedLabel }}</span>
                </span>
              </template>
            </v-radio>
            <v-radio
              v-else
              :value="index"
              :label="pkg.title"
              color="primary"
              hide-details
            />

            <div class="text-right">
              <span class="font-bold">
                {{ pkg.price }}
              </span>
            </div>
          </div>
        </v-list-item>
      </v-list>
    </v-radio-group>

    <template #footer>
      <div
        class="cta-button w-100 justify-center"
        :class="{ disabled: loading }"
        style="border-radius: 6px"
        @click="!loading && onClickPayment()"
      >
        <v-progress-circular
          v-if="loading"
          width="2"
          size="23"
          color="white"
          indeterminate
        />

        <v-icon v-else size="27">mdi-credit-card-outline</v-icon>
        <h3>Thanh toán</h3>
      </div>
    </template>
  </CommonDialog>
</template>

<style scoped>
/* Vuetify tự bọc nội dung slot #label trong 1 thẻ .v-label riêng, có sẵn
   overflow:hidden + white-space:nowrap + height cố định 1 dòng — chặn hết
   mọi cách xuống dòng viết từ bên trong. Phải "chọc" thẳng vào đó mới sửa được. */
.unlimited-radio :deep(.v-label) {
  overflow: visible;
  white-space: normal;
  height: auto;
}

.unlimited-radio-label {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.unlimited-radio-text {
  font-size: 1rem;
  letter-spacing: 0.009375em;
  color: rgba(0, 0, 0, 0.87);
}

.unlimited-native-select {
  flex-shrink: 0;
  appearance: none;
  -webkit-appearance: none;
  box-sizing: border-box;
  min-width: 90px;
  height: 30px;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1;
  padding: 0 22px 0 6px;
  border: 1.5px solid #90caf9;
  border-radius: 7px;
  background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%231565c0' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 7px center;
  background-size: 11px;
  color: #1565c0;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.unlimited-native-select:hover {
  border-color: #1e88e5;
}

.unlimited-native-select:focus {
  outline: none;
}

.unlimited-native-select:focus-visible {
  outline: none;
  border-color: #1565c0;
}

.unlimited-static-label {
  flex-shrink: 0;
  font-size: 1rem;
  font-weight: 400;
  color: #1565c0;
}
</style>
