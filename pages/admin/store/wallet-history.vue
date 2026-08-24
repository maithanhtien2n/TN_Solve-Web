<script setup lang="ts">
import { storeService } from "~/services/store";

const headers = [
  { title: "Thông tin khách hàng", key: "customerInfo",     sortable: false },
  { title: "Số tiền",              key: "amount",            align: "end", sortable: false },
  { title: "Mã tham chiếu",        key: "referenceNumber",   sortable: false },
  { title: "Thời gian",            key: "createdAt",         sortable: false },
];

const data    = ref<any>({});
const loading = ref("");

async function loadItems(event: any) {
  loading.value = "load-table";
  await storeService
    .getAllWalletTransactions(event)
    .then((res) => { if (res.data) data.value = res.data; })
    .finally(() => { loading.value = ""; });
}

definePageMeta({ layout: "admin", title: "Lịch sử nạp tiền" });
</script>

<template>
  <DataTable
    :showSelect="false"
    :actions="[]"
    :rowActions="[]"
    :headers="headers"
    :data="data"
    :loading="Boolean(loading === 'load-table')"
    @change="loadItems"
  >
    <template #row-amount="{ item }">
      <span class="text-nowrap text-success">
        +{{ formatCurrency((item as any).amount) }}
      </span>
    </template>

    <template #row-referenceNumber="{ item }">
      <span v-if="(item as any).referenceNumber">{{ (item as any).referenceNumber }}</span>
      <span v-else class="text-medium-emphasis">—</span>
    </template>
  </DataTable>
</template>
