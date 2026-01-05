<script setup lang="ts">
import { appService } from "~/services/app";

const { onGetterDisplayPopupBuyCredit } = useAppStore();

const loading = ref<boolean>(false);
const commonDialogRef = ref<any>(null);
const selectedPackageIndex = ref<number>(0);

const creditPackagesData = computed(() => [
  { title: "2,000💎", value: 2000, price: "10,000đ" },
  { title: "4,000💎", value: 4000, price: "20,000đ" },
  { title: "6,000💎", value: 6000, price: "30,000đ" },
  { title: "8,000💎", value: 8000, price: "40,000đ" },
  { title: "11,000💎 (+1,000 KM)", value: 11000, price: "50,000đ" },
  { title: "12,000💎", value: 12000, price: "60,000đ" },
  { title: "14,000💎", value: 14000, price: "70,000đ" },
  { title: "16,000💎", value: 16000, price: "80,000đ" },
  { title: "18,000💎", value: 18000, price: "90,000đ" },
  // Gói khuyến mãi 10%
  { title: "24,000💎 (+4,000 KM)", value: 24000, price: "100,000đ" },
]);

const onClickPayment = async () => {
  loading.value = true;
  await appService
    .createPaymentUrlBuyCredit({
      creditAmount: creditPackagesData.value[selectedPackageIndex.value].value,
    })
    .then((res) => {
      if (res.data && res.data) {
        window.location.href = res.data;
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

watch(onGetterDisplayPopupBuyCredit, (newVal) => {
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
        {{ $t("Tặng thêm tín dụng khi bạn chọn gói 50.000đ hoặc 100.000đ") }}
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
            <v-radio
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
        style="border-radius: 6px"
        @click="onClickPayment"
      >
        <v-progress-circular
          v-if="loading"
          width="2"
          size="23"
          color="white"
          indeterminate
        />

        <v-icon v-else size="27">mdi-credit-card-outline</v-icon>
        <h3>{{ $t("Thanh toán") }}</h3>
      </div>
    </template>
  </CommonDialog>
</template>
