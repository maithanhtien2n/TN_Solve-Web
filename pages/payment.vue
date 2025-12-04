<script setup lang="ts">
import { appService } from "~/services/app";

const route = useRoute();

const { t } = useI18n();
const { isMobile } = useDevice();

const { onGetterMasterData } = useMasterDataStore();

const loading = ref<string>("");
const formData = ref<any>({
  rentalMonths: 1,
  discountCode: "",
});

const totalPrice = computed(() => {
  const rentalMonths = formData.value.rentalMonths;
  const basePricePerMonth = 99000;

  // 1. Tính giá gốc và giá cuối cùng
  const originalPrice = basePricePerMonth * rentalMonths;
  let finalPrice = originalPrice; // Khởi tạo finalPrice bằng giá gốc

  // Biến cờ để kiểm tra có chiết khấu hay không
  let hasDiscount = false;

  switch (rentalMonths) {
    case 3:
      finalPrice = 275000; // Giá sau chiết khấu
      hasDiscount = true;
      break;
    case 6:
      finalPrice = 500000; // Giá sau chiết khấu
      hasDiscount = true;
      break;
    case 12:
      finalPrice = 890000; // Giá sau chiết khấu
      hasDiscount = true;
      break;
    // case 1 và default sẽ giữ nguyên finalPrice = originalPrice
  }

  // Luôn đảm bảo giá tiền là số nguyên dương
  if (finalPrice <= 0) {
    return formatCurrency(0); // Trả về string 0 đồng
  }

  // --- LOGIC TRẢ VỀ DỰA TRÊN hasDiscount ---
  if (hasDiscount) {
    const amountSaved = originalPrice - finalPrice;
    // Tính toán tỷ lệ giảm giá và làm tròn về số nguyên
    const discountRate = Math.round((amountSaved / originalPrice) * 100);

    // Trả về Object chi tiết khi có giảm giá
    return {
      originalPrice: formatCurrency(originalPrice),
      finalPrice: formatCurrency(finalPrice),
      discountRate: `${discountRate}%`,
      amountSaved: formatCurrency(amountSaved), // Thêm số tiền tiết kiệm để hiển thị tiện hơn
      isDiscounted: true,
    };
  } else {
    // Trả về String giá tiền khi không có giảm giá
    return formatCurrency(finalPrice);
  }
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

useSeo({
  title: t("Đăng kí gói dịch vụ"),
  description:
    "Nền tảng AI giúp bạn tạo video chuyên nghiệp chỉ trong vài phút",
  image: "/images/page-home.png",
});

definePageMeta({ middleware: "auth" });
</script>

<template>
  <div class="max-w-xl mx-auto">
    <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">
      Thanh Toán Gói Dịch Vụ
    </h1>

    <div
      class="d-flex flex-column justify-center align-center"
      style="max-width: 33rem; margin: auto"
    >
      <h3 v-if="isMobile" class="font-bold text-red">
        💥 <span class="text-primary text-2xl">GIÁ ƯU ĐÃI</span> — Chỉ
        <span class="text-2xl text-primary">99.000đ/tháng</span>!
      </h3>

      <h1 v-else class="font-bold text-red">
        💥 <span class="text-primary text-2xl">GIÁ ƯU ĐÃI</span> — Chỉ
        <span class="text-2xl text-primary">99.000đ/tháng</span>!
      </h1>

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
      />

      <h3 class="w-100" style="font-size: 1.4rem">
        <template v-if="typeof totalPrice === 'object'">
          Tổng cộng:
          <span
            style="font-size: 1rem; color: #999; text-decoration: line-through"
          >
            {{ totalPrice.originalPrice }}
          </span>
          <span class="text-red ms-2" style="font-size: 1.4rem">
            {{ totalPrice.finalPrice }}
          </span>

          <v-chip color="success" size="small" class="ms-2">
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
