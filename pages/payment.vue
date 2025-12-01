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

const totalPrice = computed(() =>
  formatCurrency(99000 * formData.value.rentalMonths)
);

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
  image: "/images/page-video.png",
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
        Tổng cộng: <span class="text-red">{{ totalPrice }}</span>
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
