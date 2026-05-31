<script setup lang="ts">
import { accountService } from "~/services/app";

const route = useRoute();

const { onGetterMasterData } = useMasterDataStore();

const headers = [
  { title: "Thông tin khách hàng", key: "customerInfo", sortable: false },
  { title: "Chi tiết gói", key: "note", sortable: false },
  { title: "Người giới thiệu", key: "referral.name", sortable: false },
  { title: "Ngày bắt đầu", key: "serviceStartDate", sortable: false },
  { title: "Ngày hết hạn", key: "serviceExpiry", sortable: false },
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
        {{ formatCurrency((item as any).basePrice) }}
      </div>
      <small v-if="(item as any).discount && (item as any).discount !== '0'" class="text-blue text-nowrap">
        Mã giảm giá {{ formatCurrency((item as any).discount) }}
      </small>
    </template>

    <template #row-price="{ item }">
      <div class="text-error text-nowrap">{{ formatCurrency((item as any).price) }}</div>
    </template>

    <template #row-expiryStatus="{ item }">
      <v-chip :color="(item as any)?.expiryStatus == 'Đã hết hạn' ? 'red' : 'success'">
        {{ (item as any)?.expiryStatus }}
      </v-chip>
    </template>
  </DataTable>
</template>
