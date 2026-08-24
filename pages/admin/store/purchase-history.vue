<script setup lang="ts">
import { storeService } from "~/services/store";

const headers = [
  { title: "Thông tin khách hàng", key: "customerInfo",    sortable: false },
  { title: "Sản phẩm",             key: "templateTitle",   sortable: false },
  { title: "Giảm giá",             key: "discountPercent", sortable: false },
  { title: "Giá tiền",             key: "amount",          align: "end", sortable: false },
  { title: "Video",                key: "videoUrl",        sortable: false },
  { title: "Thời gian",            key: "createdAt",       sortable: false },
];

const data    = ref<any>({});
const loading = ref("");

async function loadItems(event: any) {
  loading.value = "load-table";
  await storeService
    .getAllPurchaseHistory(event)
    .then((res) => { if (res.data) data.value = res.data; })
    .finally(() => { loading.value = ""; });
}

definePageMeta({ layout: "admin", title: "Lịch sử mua hàng" });
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
    <template #row-discountPercent="{ item }">
      <v-chip v-if="(item as any).discountPercent > 0" color="success" size="small">
        -{{ (item as any).discountPercent }}%
      </v-chip>
      <span v-else class="text-medium-emphasis">—</span>
    </template>

    <template #row-amount="{ item }">
      <div class="d-flex flex-column align-end">
        <span
          v-if="(item as any).discountPercent > 0"
          class="text-caption text-medium-emphasis text-decoration-line-through"
        >
          {{ formatCurrency((item as any).originalPrice) }}
        </span>
        <span class="text-nowrap text-red">
          -{{ formatCurrency((item as any).amount) }}
        </span>
      </div>
    </template>

    <template #row-videoUrl="{ item }">
      <a
        v-if="(item as any).videoUrl"
        :href="(item as any).videoUrl"
        target="_blank"
        rel="noopener"
        class="text-decoration-none"
      >
        Xem video
      </a>
      <span v-else class="text-medium-emphasis">—</span>
    </template>
  </DataTable>
</template>
