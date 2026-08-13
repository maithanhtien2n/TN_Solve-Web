<script setup lang="ts">
import { accountService } from "~/services/app";

const route = useRoute();

const { onGetterMasterData } = useMasterDataStore();

const headers = [
  { title: "Thông tin khách hàng", key: "customerInfo", sortable: false },
  { title: "Chi tiết gói", key: "note", sortable: false },
  { title: "Người giới thiệu", key: "referral.name", sortable: false },
  { title: "Thời gian", key: "serviceStartDate", sortable: false },
  { title: "Giá gói", key: "basePrice", align: "end", sortable: false },
  { title: "Thành tiền", key: "price", align: "end", sortable: false },
  { title: "Cập nhật", key: "updatedAt", sortable: false },
  { title: "Trạng thái", key: "expiryStatus", align: "center", sortable: false },
];

const data             = ref<any>({});
const loading          = ref<string>("");
const dataTableRef     = ref<any>(null);
const revenueByMonth   = ref<any[]>([]);
const showRevenue      = ref(false);

const statusItems = computed(() => expiryStatusOptions);

async function loadItems(event: any) {
  const params = { ...event, expiry: route.path?.split("/")?.pop() || "active" };
  loading.value = "load-table";
  await accountService
    .getAllServiceRental(params)
    .then((res) => { if (res.data) data.value = res.data; })
    .finally(() => { loading.value = ""; });
}

// Data cũ (tạo trước khi tách comboDiscountAmount/couponDiscountAmount/
// referralDiscountAmount) không có breakdown nguồn giảm giá — nhưng vẫn có
// basePrice/rentalMonths/price nên tính lại được TỔNG số tiền giảm. Không rõ
// nguồn (combo hay mã) nên hiện nhãn trung tính "Giảm X", không suy đoán bừa
// thành "Gói giảm"/"Mã giảm" (tránh gắn nhầm nguồn cho dữ liệu cũ).
function getLegacyDiscountAmount(item: any): number {
  const knownDiscount =
    (item.comboDiscountAmount || 0) +
    (item.couponDiscountAmount || 0) +
    (item.referralDiscountAmount || 0);
  if (knownDiscount > 0) return 0;

  const total = (item.basePrice || 0) * (item.rentalMonths || 1) - (item.price || 0);
  return total > 0 ? total : 0;
}

// Data cũ: nếu số tháng thuê khớp 1 trong các mốc combo (3/6/12) thì coi
// khoản giảm là combo (tính lại % từ số tiền), còn lại quy về mã giảm giá.
function isLegacyComboTier(item: any): boolean {
  return [3, 6, 12].includes(item.rentalMonths);
}
function getLegacyComboPercent(item: any): number {
  const total = (item.basePrice || 0) * (item.rentalMonths || 1);
  return total > 0 ? Math.round((getLegacyDiscountAmount(item) / total) * 100) : 0;
}

async function toggleRevenue() {
  showRevenue.value = !showRevenue.value;
  if (showRevenue.value && !revenueByMonth.value.length) {
    await accountService.getServiceRentalRevenueByMonth()
      .then((res) => { revenueByMonth.value = res.data || []; });
  }
}

definePageMeta({ layout: "admin", title: "Gói cho thuê" });
</script>

<template>
  <ConfirmDialog />

  <!-- Doanh thu theo tháng -->
  <v-card v-if="showRevenue" rounded="lg" border class="mb-4">
    <div class="d-flex align-center justify-space-between pa-4 pb-2">
      <div class="d-flex align-center ga-2 font-weight-bold">
        <v-icon color="success" size="18">mdi-chart-bar</v-icon>
        Doanh thu theo tháng
      </div>
      <v-btn icon size="small" variant="text" @click="showRevenue = false">
        <v-icon size="18">mdi-close</v-icon>
      </v-btn>
    </div>
    <v-table density="compact">
      <thead>
        <tr>
          <th>Tháng</th>
          <th class="text-right">Số gói</th>
          <th class="text-right">Doanh thu</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in revenueByMonth" :key="row.label">
          <td>{{ row.label }}</td>
          <td class="text-right">{{ row.count }}</td>
          <td class="text-right text-error font-weight-medium">{{ formatCurrency(row.total) }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-card>

  <DataTable
    ref="dataTableRef"
    :filters="[
      {
        label: 'Trạng thái',
        field: 'expiryStatus',
        type: 'select',
        items: statusItems,
      },
    ]"
    :showSelect="false"
    :actions="[]"
    :rowActions="['register']"
    :headers="headers"
    :data="data"
    :loading="Boolean(loading == 'load-table')"
    @change="loadItems"
  >
    <template #action>
      <div class="d-flex justify-end">
        <v-btn
          variant="outlined"
          color="success"
          style="height:48px"
          @click="toggleRevenue"
        >
          <v-icon start size="18">mdi-chart-bar</v-icon>
          Doanh thu theo tháng
        </v-btn>
      </div>
    </template>

    <template #row-basePrice="{ item }">
      <div class="text-red text-nowrap">
        {{ formatCurrency((item as any).basePrice * (item as any).rentalMonths) }}
      </div>
      <small v-if="(item as any).comboDiscountPercent > 0" class="text-blue text-nowrap d-block">
        Gói {{ (item as any).rentalMonths }} tháng giảm {{ (item as any).comboDiscountPercent }}%
      </small>
      <small v-if="(item as any).couponDiscountAmount > 0" class="text-blue text-nowrap d-block">
        Mã giảm {{ formatCurrency((item as any).couponDiscountAmount) }}
      </small>
      <small v-if="(item as any).referralDiscountAmount > 0" class="text-blue text-nowrap d-block">
        Mã GT giảm {{ formatCurrency((item as any).referralDiscountAmount) }}
      </small>
      <template v-if="getLegacyDiscountAmount(item) > 0">
        <small v-if="isLegacyComboTier(item)" class="text-blue text-nowrap d-block">
          Gói {{ item.rentalMonths }} tháng giảm {{ getLegacyComboPercent(item) }}%
        </small>
        <small v-else class="text-blue text-nowrap d-block">
          Mã giảm {{ formatCurrency(getLegacyDiscountAmount(item)) }}
        </small>
      </template>
    </template>

    <template #row-price="{ item }">
      <div class="text-error text-nowrap">{{ formatCurrency((item as any).price) }}</div>
    </template>

    <template #row-serviceStartDate="{ item }">
      <span class="text-nowrap">
        {{ (item as any).serviceStartDate }} - {{ (item as any).serviceExpiry }}
      </span>
    </template>

    <template #row-expiryStatus="{ item }">
      <v-chip :color="(item as any)?.expiryStatus == 'Đã hết hạn' ? 'red' : 'success'">
        {{ (item as any)?.expiryStatus }}
      </v-chip>
    </template>
  </DataTable>
</template>
