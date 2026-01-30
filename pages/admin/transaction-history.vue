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
const commonDialogRef = ref<any>(null);

const banks = computed(() => onGetterMasterData.value["banks"] || []);

const partnerItems = computed(
  () =>
    onGetterMasterData.value["my-partner"]?.map((x: any) => ({
      title: t(x.title),
      value: x.value,
    })) || []
);

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

function onGetBankName(code: string) {
  const bank = banks.value.find((x: any) => x.code === code);
  return bank.short_name;
}

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

const onAction = (event: any) => {
  commonDialogRef.value?.onDisplay(true);
};

definePageMeta({ layout: "admin", title: "Lịch sử giao dịch" });
</script>

<template>
  <ConfirmDialog ref="confirmDialogRef" />

  <CommonDialog ref="commonDialogRef" title="Chi tiết" width="500">
    <div class="d-flex flex-column ga-3" style="min-height: 24rem">
      <!-- Bank info -->
      <div class="d-flex flex-column ga-2">
        <h3 class="font-bold">Thông tin nhận tiền</h3>

        <div class="d-flex align-center justify-space-between">
          <span class="text-medium-emphasis">Ngân hàng</span>
          <span class="font-weight-medium">
            {{ onGetBankName(data?.partnerInfo?.paymentInfo?.bankName) }}
          </span>
        </div>

        <div class="d-flex align-center justify-space-between">
          <span class="text-medium-emphasis">Chủ tài khoản</span>
          <span class="font-weight-medium">
            {{ data?.partnerInfo?.paymentInfo?.accountName }}
          </span>
        </div>

        <div class="d-flex align-center justify-space-between">
          <span class="text-medium-emphasis">Số tài khoản</span>
          <span class="font-weight-medium">
            {{ data?.partnerInfo?.paymentInfo?.accountNumber }}
          </span>
        </div>

        <div class="d-flex align-center justify-space-between">
          <span class="text-medium-emphasis">Doanh thu</span>
          <span class="font-weight-medium text-red">
            {{ formatCurrency(data?.totalCommissionAmount) }}
          </span>
        </div>
      </div>

      <v-divider />

      <!-- QR -->
      <div class="d-flex flex-column ga-2 align-center">
        <h3 class="font-bold align-self-start">Mã QR thanh toán</h3>

        <v-sheet
          rounded="lg"
          border
          class="pa-3 d-flex align-center justify-center"
          style="width: 100%"
        >
          <v-img
            :src="data?.partnerInfo?.imageQR"
            max-width="260"
            aspect-ratio="1"
            cover
          >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular
                  indeterminate
                  color="primary"
                  width="1"
                  size="40"
                />
              </div>
            </template>
          </v-img>
        </v-sheet>
      </div>
    </div>
  </CommonDialog>

  <DataTable
    ref="dataTableRef"
    :filters="[
      {
        label: 'Cộng tác viên',
        field: 'accountId',
        type: 'select',
        items: partnerItems,
      },
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
    :actions="data?.partnerInfo ? ['detail'] : []"
    :rowActions="['register']"
    :headers="headers"
    :data="data"
    :loading="Boolean(loading == 'load-table')"
    @change="loadItems"
    @action="onAction"
  >
    <template #row-basePrice="{ item }">
      <div class="text-red text-nowrap">
        {{ formatCurrency((item as any).basePrice) }}
      </div>

      <small
        v-if="(item as any).note && (item as any).note!=='0'"
        class="text-blue text-nowrap"
      >
        Mã giảm giá {{ formatCurrency((item as any).note) }}
      </small>
    </template>

    <template #row-paymentAmount="{ item }">
      <div class="text-red text-nowrap">
        {{ formatCurrency((item as any).paymentAmount) }}
      </div>
    </template>

    <template #row-commissionAmount="{ item }">
      <div class="text-error text-nowrap">
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
