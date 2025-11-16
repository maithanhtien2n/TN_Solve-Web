<script setup lang="ts">
import { accountService } from "~/services/app";

const route = useRoute();

const { t } = useI18n();

const { onGetterMasterData } = useMasterDataStore();

const headers = [
  { title: "Thông tin khách hàng", key: "customerInfo", sortable: false },
  { title: "Chi tiết gói", key: "rentalNote", sortable: false },
  { title: "Hoa hồng (%)", key: "commissionRate", sortable: false },
  {
    title: "Giá gói",
    key: "basePrice",
    align: "end",
    sortable: false,
  },
  {
    title: "Thành tiền",
    key: "paymentAmount",
    align: "end",
    sortable: false,
  },
  {
    title: "Tiền nhận được",
    key: "commissionAmount",
    align: "end",
    sortable: false,
  },
  { title: "Ngày giao dịch", key: "createdAt", sortable: false },
  {
    title: "Trạng thái",
    key: "status",
    align: "center",
    sortable: false,
  },
];

const data = ref<any>({});
const loading = ref<string>("");
const dataTableRef = ref<any>(null);
const confirmDialogRef = ref<any>(null);

const statusItems = computed(() =>
  commissionStatusOptions?.map((x: any) => ({ ...x, title: t(x.title) }))
);
const transactionMonthsItems = computed(
  () =>
    onGetterMasterData.value["transaction-months"]?.map((x: any) => ({
      title: t(x.title),
      value: x.value,
    })) || []
);

async function loadItems(event: any) {
  const params = { ...event };

  loading.value = "load-table";
  await accountService
    .getTransactionHistory(params)
    .then((res) => {
      if (res.data) data.value = res.data;
    })
    .finally(() => {
      loading.value = "";
    });
}

definePageMeta({ layout: "partner", title: "Lịch sử giao dịch" });
</script>

<template>
  <ConfirmDialog ref="confirmDialogRef" />

  <DataTable
    ref="dataTableRef"
    :filters="[
      {
        label: 'Thời gian',
        field: 'monthYear',
        type: 'select',
        items: transactionMonthsItems,
      },
      {
        label: 'Trạng thái',
        field: 'status',
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
      <div class="text-red">
        {{ formatCurrency((item as any).basePrice) }}
      </div>
    </template>

    <template #row-paymentAmount="{ item }">
      <div class="text-red">
        {{ formatCurrency((item as any).paymentAmount) }}
      </div>
    </template>

    <template #row-commissionAmount="{ item }">
      <div class="text-error">
        {{ formatCurrency((item as any).commissionAmount) }}
      </div>
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
