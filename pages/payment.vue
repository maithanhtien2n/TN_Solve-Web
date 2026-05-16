<script setup lang="ts">
import { appService } from "~/services/app";
import { couponService } from "~/services/app";

const route = useRoute();

const { t } = useI18n();
const { isMobile } = useDevice();

const { onGetterMasterData } = useMasterDataStore();

const loading = ref<string>("");
const formData = ref<any>({
  rentalMonths: 1,
  discountCode: "",
});
const couponDetail = ref<any>(null);

const totalPrice = computed(() => {
  const rentalMonths = formData.value.rentalMonths;
  const basePricePerMonth = 139000;

  const coupon = couponDetail.value; // Có hoặc null

  // 1. Tính giá gốc theo tháng
  const originalPrice = basePricePerMonth * rentalMonths;

  // 2. Giá sau giảm theo gói
  let finalPrice = originalPrice;
  let packageDiscountAmount = 0;

  switch (rentalMonths) {
    case 3:
      finalPrice = 388000;
      packageDiscountAmount = originalPrice - finalPrice;
      break;
    case 6:
      finalPrice = 701000;
      packageDiscountAmount = originalPrice - finalPrice;
      break;
    case 12:
      finalPrice = 1251000;
      packageDiscountAmount = originalPrice - finalPrice;
      break;
    default:
      finalPrice = originalPrice;
  }

  // 3. Giảm bởi coupon
  let couponDiscountAmount = 0;

  if (coupon) {
    if (coupon.discountType === EnumDiscountType.PERCENTAGE) {
      couponDiscountAmount = Math.round(
        (finalPrice * coupon.discountValue) / 100
      );
    } else if (coupon.discountType === EnumDiscountType.FIXED) {
      couponDiscountAmount = coupon.discountValue;
    }

    couponDiscountAmount = Math.ceil(couponDiscountAmount / 500) * 500;
  } else {
    packageDiscountAmount = Math.ceil(packageDiscountAmount / 500) * 500;
  }

  // Giảm tiếp
  finalPrice = finalPrice - couponDiscountAmount;
  if (finalPrice < 0) finalPrice = 0;

  // 4. Xác định tổng số tiền đã giảm
  const totalDiscount = packageDiscountAmount + couponDiscountAmount;

  // ❗ Nếu KHÔNG có giảm giá nào → TRẢ STRING
  if (totalDiscount === 0) {
    return formatCurrency(finalPrice);
  }

  // 5. Nếu CÓ GIẢM → TRẢ OBJECT ĐÚNG KHUÔN LOGIC CŨ
  const discountRatePercent = Math.round((totalDiscount / originalPrice) * 100);
  const discountRateText =
    coupon && coupon.discountType === EnumDiscountType.FIXED
      ? formatCurrency(totalDiscount) // Nếu coupon dạng tiền → show số tiền
      : `${discountRatePercent}%`; // Còn lại → %

  return {
    originalPrice: formatCurrency(originalPrice),
    finalPrice: formatCurrency(finalPrice),
    discountRate: discountRateText,
  };
});

const rentalMonthsOptions = computed(
  () =>
    onGetterMasterData.value["rental-months"]?.map((x: any) => ({
      title: t(x.title),
      value: x.value,
    })) || []
);

const onClickPayment = async () => {
  loading.value = "create-url";
  await appService
    .createPaymentUrl({
      rentalMonths: formData.value.rentalMonths,
      discountCode: formData.value.discountCode,
    })
    .then((res) => {
      if (res.data && res.data) {
        window.location.href = res.data;
      }
    })
    .finally(() => {
      loading.value = "";
    });
};

const onChangeDiscountCode = async (event: any) => {
  const value = event.target.value || "";
  await couponService
    .getDetailCoupon({ code: value })
    .then((res) => {
      if (res.data) couponDetail.value = res.data;
      else couponDetail.value = null;
    })
    .catch(() => {
      couponDetail.value = null;
    });
};

useSeo({
  title: t("Đăng ký dịch vụ"),
  description:
    "Nền tảng AI giúp bạn tạo video chuyên nghiệp chỉ trong vài phút",
  image: "/images/page-home.png",
});

definePageMeta({ middleware: "auth" });
</script>

<template>
  <div class="max-w-xl mx-auto">
    <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">
      {{ $t("Đăng ký/Gia hạn dịch vụ") }}
    </h1>

    <div
      class="d-flex flex-column justify-center align-center"
      style="max-width: 33rem; margin: auto"
    >
      <h3 v-if="isMobile" class="font-bold text-red">
        💥 <span class="text-primary text-2xl">GIÁ ƯU ĐÃI</span> — Chỉ
        <span class="text-2xl text-primary">139.000đ/tháng</span>!
      </h3>

      <h1 v-else class="font-bold text-red">
        💥 <span class="text-primary text-2xl">GIÁ ƯU ĐÃI</span> — Chỉ
        <span class="text-2xl text-primary">139.000đ/tháng</span>!
      </h1>

      <p v-if="isMobile" class="text-center text-sm text-gray-600 mt-1 mb-3">
        Nhận ưu đãi giảm giá sâu hơn khi đăng ký gói <br />
        <span class="text-primary">3 tháng, 6 tháng hoặc 1 năm</span>
      </p>

      <p v-else class="text-gray-600 mt-2 mb-4">
        Nhận ưu đãi giảm giá sâu hơn khi đăng ký gói
        <span class="text-primary">3 tháng, 6 tháng hoặc 1 năm</span>
      </p>

      <v-select
        v-model="formData.rentalMonths"
        class="w-100 mt-10"
        variant="outlined"
        item-title="title"
        item-value="value"
        :items="rentalMonthsOptions"
        :label="$t('Thời hạn đăng ký')"
      />

      <v-text-field
        v-model="formData.discountCode"
        class="w-100"
        variant="outlined"
        item-title="title"
        item-value="value"
        :label="$t('Mã giảm giá (nếu có)')"
        @change="onChangeDiscountCode"
      />

      <div v-if="couponDetail" class="w-100 mb-3">
        <v-alert type="success" variant="outlined" dense>
          <strong>{{ couponDetail.name }}</strong>
          <br />
          <span>
            Giảm
            <span
              v-if="couponDetail.discountType === EnumDiscountType.PERCENTAGE"
            >
              {{ couponDetail.discountValue }}%
            </span>
            <span v-else>{{ formatCurrency(couponDetail.discountValue) }}</span>
            cho đơn hàng này!
          </span>
          <br />
          <em class="text-black">
            Hạn sử dụng: {{ couponDetail.startDateFormat }} -
            {{ couponDetail.endDateFormat }}
          </em>
        </v-alert>
      </div>

      <h3 class="w-100" style="font-size: 1.4rem">
        <template v-if="typeof totalPrice === 'object'">
          Tổng cộng:
          <span
            style="font-size: 1rem; color: #999; text-decoration: line-through"
          >
            {{ totalPrice.originalPrice }}
          </span>
          <span class="text-red mx-2" style="font-size: 1.4rem">
            {{ totalPrice.finalPrice }}
          </span>

          <v-chip color="success" size="small">
            Giảm {{ totalPrice.discountRate }}
          </v-chip>
        </template>

        <template v-else>
          Tổng cộng:
          <span class="text-red" style="font-size: 1.4rem">
            {{ totalPrice }}
          </span>
        </template>
      </h3>

      <div
        class="cta-button w-100 justify-center mt-10"
        style="border-radius: 6px"
        @click="onClickPayment"
      >
        <v-progress-circular
          v-if="Boolean(loading === 'create-url')"
          width="2"
          size="23"
          color="white"
          indeterminate
        />

        <v-icon v-else size="27">mdi-credit-card-outline</v-icon>
        <h3>{{ $t("Thanh toán") }}</h3>
      </div>
    </div>
  </div>
</template>
