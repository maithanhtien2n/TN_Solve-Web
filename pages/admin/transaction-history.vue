<script setup lang="ts">
import { accountService, appService, masterDataService } from "~/services/app";

const route = useRoute();

const { onGetterMasterData } = useMasterDataStore();

const dataTableRef = ref<any>(null);

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
  () => onGetterMasterData.value["my-partner"] || []
);

// Danh sách CTV hiển thị trong bộ lọc "Cộng tác viên": mặc định là tất cả CTV,
// nhưng khi chọn 1 tháng cụ thể thì chỉ còn lại những CTV có phát sinh hoa hồng
// trong đúng tháng đó (xem onChangeFilter bên dưới).
const partnerItemsDynamic = ref<any[]>([]);

watch(
  partnerItems,
  (val) => {
    if (!dataTableRef.value?.params?.monthYear) {
      partnerItemsDynamic.value = val;
    }
  },
  { immediate: true }
);

const statusItems = computed(() => commissionStatusOptions);

const transactionMonthsItems = computed(
  () => onGetterMasterData.value["transaction-months"] || []
);

async function onChangeFilter(event: any) {
  if (event.field !== "monthYear") return;

  if (!event.value) {
    partnerItemsDynamic.value = partnerItems.value;
  } else {
    await masterDataService
      .getMyPartnerByMonth({ monthYear: event.value })
      .then((res: any) => {
        partnerItemsDynamic.value = res.data || [];
      })
      .catch(() => {
        partnerItemsDynamic.value = [];
      });
  }

  // CTV đang chọn có thể không còn trong danh sách mới -> chọn lại CTV đầu tiên
  if (dataTableRef.value) {
    const stillValid = partnerItemsDynamic.value.some(
      (x: any) => x.value === dataTableRef.value.params.accountId
    );
    if (!stillValid) {
      dataTableRef.value.params.accountId =
        partnerItemsDynamic.value[0]?.value ?? null;
    }
  }
}

function onGetBankName(code: string) {
  const bank = banks.value.find((x: any) => x.code === code);
  return bank?.short_name;
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

// Data cũ (tạo trước khi tách comboDiscountAmount/couponDiscountAmount/
// referralDiscountAmount) không có breakdown nguồn giảm giá — nhưng vẫn có
// basePrice/rentalMonths/paymentAmount nên tính lại được TỔNG số tiền giảm.
// Số tháng khớp mốc combo (3/6/12) thì quy về combo (tính lại %), còn lại
// quy về mã giảm giá.
function getLegacyDiscountAmount(item: any): number {
  const knownDiscount =
    (item.comboDiscountAmount || 0) +
    (item.couponDiscountAmount || 0) +
    (item.referralDiscountAmount || 0);
  if (knownDiscount > 0) return 0;

  const total =
    (item.basePrice || 0) * (item.rentalMonths || 1) - (item.paymentAmount || 0);
  return total > 0 ? total : 0;
}
function isLegacyComboTier(item: any): boolean {
  return [3, 6, 12].includes(item.rentalMonths);
}
function getLegacyComboPercent(item: any): number {
  const total = (item.basePrice || 0) * (item.rentalMonths || 1);
  return total > 0 ? Math.round((getLegacyDiscountAmount(item) / total) * 100) : 0;
}

const loadingCommission = ref(false);
async function runMonthlyCommission() {
  if (!confirm("Chạy quy trình chốt hoa hồng tháng? Thao tác này không thể hoàn tác.")) return;
  loadingCommission.value = true;
  await appService.runMonthlyCommission()
    .then(() => { alert("Đã chạy xong! Tải lại trang để xem kết quả."); })
    .catch((e: any) => alert(e?.response?.data?.message || "Có lỗi xảy ra!"))
    .finally(() => { loadingCommission.value = false; });
}

definePageMeta({ layout: "admin", title: "Lịch sử giao dịch" });
</script>

<template>
  <ConfirmDialog ref="confirmDialogRef" />

  <CommonDialog
    ref="commonDialogRef"
    :title="`Chi tiết doanh thu - ${data?.partnerInfo?.name}`"
    width="500"
  >
    <div class="d-flex flex-column ga-3" style="min-height: 24rem">
      <!-- Bank info -->
      <div class="d-flex flex-column ga-2">
        <h3 class="font-bold">Thông tin nhận tiền</h3>

        <div class="d-flex align-center justify-space-between">
          <span class="text-medium-emphasis">Ngân hàng</span>
          <span class="font-weight-medium">
            {{
              onGetBankName(data?.partnerInfo?.paymentInfo?.bankName) || "---"
            }}
          </span>
        </div>

        <div class="d-flex align-center justify-space-between">
          <span class="text-medium-emphasis">Chủ tài khoản</span>
          <span class="font-weight-medium">
            {{ data?.partnerInfo?.paymentInfo?.accountName || "---" }}
          </span>
        </div>

        <div class="d-flex align-center justify-space-between">
          <span class="text-medium-emphasis">Số tài khoản</span>
          <span class="font-weight-medium">
            {{ data?.partnerInfo?.paymentInfo?.accountNumber || "---" }}
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
            max-width="300"
            aspect-ratio="1"
            cover
          >
            <template #placeholder>
              <div
                v-if="data?.partnerInfo?.imageQR"
                class="d-flex align-center justify-center fill-height"
              >
                <v-progress-circular
                  indeterminate
                  color="primary"
                  width="1"
                  size="40"
                />
              </div>

              <v-img src="/images/no-image.jpg" aspect-ratio="1" cover />
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
        label: 'Thời gian',
        field: 'monthYear',
        type: 'select',
        items: transactionMonthsItems,
      },
      {
        label: 'Cộng tác viên',
        field: 'accountId',
        type: 'select',
        items: partnerItemsDynamic,
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
    @change-filter="onChangeFilter"
  >
    <template #action>
      <div class="d-flex justify-end ga-2">
        <v-btn
          v-if="data?.partnerInfo"
          text="Chi tiết"
          style="height:48px"
          variant="flat"
          color="green"
          @click="onAction(null)"
        />
        <v-btn
          style="height:48px"
          variant="outlined"
          color="warning"
          :loading="loadingCommission"
          @click="runMonthlyCommission"
        >
          <v-icon start size="18">mdi-cash-clock</v-icon>
          Chốt hoa hồng tháng
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
