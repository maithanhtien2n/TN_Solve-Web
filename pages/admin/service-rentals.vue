<script setup lang="ts">
import { accountService } from "~/services/app";

const route = useRoute();

const { t } = useI18n();

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
  {
    title: "Trạng thái",
    key: "expiryStatus",
    align: "center",
    sortable: false,
  },
];

const data = ref<any>({});
const loading = ref<string>("");
const dataTableRef = ref<any>(null);
const confirmDialogRef = ref<any>(null);

const statusItems = computed(() =>
  expiryStatusOptions?.map((x: any) => ({ ...x, title: t(x.title) }))
);
const rentalMonthsOptions = computed(
  () =>
    onGetterMasterData.value["rental-months"]?.map((x: any) => ({
      title: t(x.title),
      value: x.value,
    })) || []
);

async function loadItems(event: any) {
  const params = {
    ...event,
    expiry: route.path?.split("/")?.pop() || "active",
  };

  loading.value = "load-table";
  await accountService
    .getAllServiceRental(params)
    .then((res) => {
      if (res.data) data.value = res.data;
    })
    .finally(() => {
      loading.value = "";
    });
}

definePageMeta({ layout: "admin", title: "Gói cho thuê" });
</script>

<template>
  <ConfirmDialog ref="confirmDialogRef" />

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
    <template #row-basePrice="{ item }">
      <div class="text-red text-nowrap">
        {{ formatCurrency((item as any).basePrice) }}
      </div>

      <small
        v-if="(item as any).discount && (item as any).discount !== '0'"
        class="text-blue text-nowrap"
      >
        Mã giảm giá {{ formatCurrency((item as any).discount) }}
      </small>
    </template>

    <template #row-price="{ item }">
      <div class="text-error text-nowrap">
        {{ formatCurrency((item as any).price) }}
      </div>
    </template>

    <template #row-expiryStatus="{ item }">
      <v-chip
        :color="(item as any)?.expiryStatus == 'Đã hết hạn' ? 'red': 'success'"
      >
        {{ $t((item as any)?.expiryStatus) }}
      </v-chip>
    </template>
  </DataTable>
</template>

<style scoped>
.image-container {
  width: 100%;
  height: 10rem;
  overflow: hidden;
  border: 1px solid rgb(197 197 197);
  border-radius: 5px;
}

@media only screen and (max-width: 550px) {
  .image-container {
    height: 8rem !important;
  }
}
</style>
