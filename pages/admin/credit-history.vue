<script setup lang="ts">
import { accountService } from "~/services/account";

const headers = [
  { title: "Thông tin khách hàng", key: "customerInfo", sortable: false },
  { title: "Loại tín dụng",        key: "creditAmount", sortable: false },
  { title: "Số tiền",              key: "price",        align: "end", sortable: false },
  { title: "Ngày mua",             key: "serviceStartDate", sortable: false },
  { title: "Hết hạn",              key: "serviceExpiry",    sortable: false },
];

const creditTypeOptions = [
  { title: "Tất cả",          value: ""          },
  { title: "Tín dụng thường", value: "regular"   },
  { title: "Không giới hạn",  value: "unlimited" },
];

const data           = ref<any>({});
const loading        = ref("");
const revenueByMonth = ref<any[]>([]);
const showRevenue    = ref(false);

async function loadItems(event: any) {
  loading.value = "load-table";
  await accountService
    .getAllCreditHistory(event)
    .then((res) => { if (res.data) data.value = res.data; })
    .finally(() => { loading.value = ""; });
}

async function toggleRevenue() {
  showRevenue.value = !showRevenue.value;
  if (showRevenue.value && !revenueByMonth.value.length) {
    await accountService.getCreditRevenueByMonth()
      .then((res) => { revenueByMonth.value = res.data || []; });
  }
}

definePageMeta({ layout: "admin", title: "Lịch sử mua tín dụng" });
</script>

<template>
  <!-- Doanh thu theo tháng -->
  <v-card v-if="showRevenue" rounded="lg" border class="mb-4">
    <div class="d-flex align-center justify-space-between pa-4 pb-2">
      <div class="d-flex align-center ga-2 font-weight-bold">
        <v-icon color="success" size="18">mdi-chart-bar</v-icon>
        Doanh thu tín dụng theo tháng
      </div>
      <v-btn icon size="small" variant="text" @click="showRevenue = false">
        <v-icon size="18">mdi-close</v-icon>
      </v-btn>
    </div>
    <v-table density="compact">
      <thead>
        <tr>
          <th>Tháng</th>
          <th class="text-right">Số giao dịch</th>
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
    :filters="[
      {
        label: 'Loại',
        field: 'creditType',
        type: 'select',
        items: creditTypeOptions,
      },
    ]"
    :showSelect="false"
    :actions="[]"
    :rowActions="[]"
    :headers="headers"
    :data="data"
    :loading="Boolean(loading === 'load-table')"
    @change="loadItems"
  >
    <template #action>
      <div class="d-flex justify-end">
        <v-btn variant="outlined" color="success" style="height:48px" @click="toggleRevenue">
          <v-icon start size="18">mdi-chart-bar</v-icon>
          Doanh thu theo tháng
        </v-btn>
      </div>
    </template>

    <template #row-creditAmount="{ item }">
      <v-chip :color="(item as any).creditAmount === -1 ? 'primary' : 'success'">
        <template v-if="(item as any).creditAmount === -1">
          <v-icon size="13" start>mdi-infinity</v-icon>
          Không giới hạn
        </template>
        <template v-else>
          {{ Number((item as any).creditAmount).toLocaleString("vi-VN") }} 💎
        </template>
      </v-chip>
    </template>

    <template #row-price="{ item }">
      <span class="text-red text-nowrap">{{ formatCurrency((item as any).price) }}</span>
    </template>

    <template #row-serviceExpiry="{ item }">
      <span v-if="(item as any).serviceExpiry" class="text-nowrap">{{ (item as any).serviceExpiry }}</span>
      <span v-else class="text-medium-emphasis">—</span>
    </template>
  </DataTable>
</template>
