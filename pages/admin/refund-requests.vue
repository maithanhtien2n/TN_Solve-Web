<script setup lang="ts">
import { refundRequestService } from "~/services/refund-request";

const headers = [
  { title: "Thông tin khách hàng", key: "customerInfo", sortable: false },
  { title: "Tiền gốc",  key: "originalAmount", align: "end",    sortable: false },
  { title: "Tiền hoàn", key: "refundAmount",    align: "end",    sortable: false },
  { title: "Lý do",     key: "reason",                           sortable: false },
  { title: "Ngày gửi",  key: "createdAt",                        sortable: false },
  { title: "Trạng thái", key: "statusChip",  align: "center",   sortable: false },
  { title: "Thao tác",   key: "action",       align: "center",   sortable: false },
];

const statusOptions = [
  { title: "Tất cả",    value: "" },
  { title: "Chờ duyệt", value: "pending"  },
  { title: "Đã duyệt",  value: "approved" },
  { title: "Từ chối",   value: "rejected" },
];

const statusMap: Record<string, { label: string; color: string }> = {
  pending:  { label: "Chờ duyệt",    color: "warning" },
  approved: { label: "Đã duyệt",     color: "success" },
  rejected: { label: "Từ chối",      color: "error"   },
};

const categoryLabel: Record<string, string> = {
  subscription:     "Gói dịch vụ",
  credit_unlimited: "Unlimited credit",
  credit:           "Tín dụng",
};

const data        = ref<any>({});
const loading     = ref("");
const dataTableRef = ref<any>(null);
const estimate    = ref<any>(null);

onMounted(async () => {
  refundRequestService.getTotalEstimate()
    .then((res) => { estimate.value = res.data; })
    .catch(() => {});
});

// QR dialog
const qrDialogRef  = ref<any>(null);
const qrItem       = ref<any>(null);

// Action dialog (approve / reject)
const actionDialogRef = ref<any>(null);
const actionItem      = ref<any>(null);
const actionType      = ref<"approved" | "rejected">("approved");
const adminNote       = ref("");

async function loadItems(event: any) {
  loading.value = "load-table";
  await refundRequestService
    .getAll(event)
    .then((res) => { if (res.data) data.value = res.data; })
    .finally(() => { loading.value = ""; });
}

function openQr(item: any) {
  qrItem.value = item;
  qrDialogRef.value?.onDisplay(true);
}

function openAction(item: any, type: "approved" | "rejected") {
  actionItem.value = item;
  actionType.value  = type;
  adminNote.value   = "";
  actionDialogRef.value?.onDisplay(true);
}

async function submitAction() {
  if (!actionItem.value) return;
  loading.value = "action";
  await refundRequestService
    .action({ id: actionItem.value._id, action: actionType.value, adminNote: adminNote.value })
    .then(() => {
      actionDialogRef.value?.onDisplay(false);
      dataTableRef.value?.loadItems();
    })
    .catch((e: any) => alert(e?.response?.data?.message || "Có lỗi xảy ra!"))
    .finally(() => { loading.value = ""; });
}

definePageMeta({ layout: "admin", title: "Yêu cầu hoàn tiền" });
</script>

<template>
  <!-- QR Dialog -->
  <CommonDialog ref="qrDialogRef" title="Mã QR chuyển khoản" width="420">
    <div v-if="qrItem" class="d-flex flex-column ga-4">
      <!-- Thông tin chuyển khoản -->
      <div class="d-flex flex-column ga-2">
        <div class="d-flex align-center justify-space-between">
          <span class="text-medium-emphasis">Ngân hàng</span>
          <strong>{{ qrItem.bankName }}</strong>
        </div>
        <div class="d-flex align-center justify-space-between">
          <span class="text-medium-emphasis">Số tài khoản</span>
          <strong>{{ qrItem.bankAccount }}</strong>
        </div>
        <div class="d-flex align-center justify-space-between">
          <span class="text-medium-emphasis">Chủ tài khoản</span>
          <strong>{{ qrItem.bankAccountName }}</strong>
        </div>
        <div class="d-flex align-center justify-space-between">
          <span class="text-medium-emphasis">Số tiền hoàn</span>
          <strong class="text-blue text-h6">{{ formatCurrency(qrItem.refundAmount) }}</strong>
        </div>
        <div class="d-flex align-center justify-space-between">
          <span class="text-medium-emphasis">Nội dung</span>
          <strong>Hoan tien dich vu tn solve</strong>
        </div>
      </div>

      <v-divider />

      <!-- Chi tiết hoàn tiền -->
      <div class="d-flex flex-column ga-1">
        <div class="text-caption font-weight-bold text-medium-emphasis mb-1">CHI TIẾT GIAO DỊCH</div>
        <div v-for="(bd, i) in qrItem.breakdown" :key="i" class="d-flex align-center justify-space-between py-1">
          <div>
            <div class="text-body-2 font-weight-medium">{{ bd.label }}</div>
            <div class="text-caption text-medium-emphasis">{{ categoryLabel[bd.category] || bd.category }}</div>
          </div>
          <div class="text-end">
            <div class="text-caption text-medium-emphasis text-decoration-line-through">{{ formatCurrency(bd.originalAmount) }}</div>
            <div class="text-body-2 font-weight-bold text-blue">{{ formatCurrency(bd.refundAmount) }}</div>
          </div>
        </div>
      </div>

      <v-divider />

      <!-- QR code -->
      <div class="d-flex flex-column align-center ga-2">
        <div class="text-caption font-weight-bold text-medium-emphasis align-self-start">MÃ QR THANH TOÁN</div>
        <v-sheet rounded="lg" border class="pa-3 d-flex align-center justify-center" style="width: 100%">
          <v-img
            v-if="qrItem.qrUrl"
            :src="qrItem.qrUrl"
            max-width="260"
            aspect-ratio="1"
            cover
          >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular indeterminate color="primary" width="1" size="40" />
              </div>
            </template>
          </v-img>
          <div v-else class="text-medium-emphasis text-caption py-6">Không có QR</div>
        </v-sheet>
        <div class="text-caption text-medium-emphasis text-center">
          Quét mã QR để chuyển khoản, sau đó bấm <strong>Duyệt</strong>.
        </div>
      </div>
    </div>
  </CommonDialog>

  <!-- Action Dialog -->
  <CommonDialog
    ref="actionDialogRef"
    :title="actionType === 'approved' ? 'Xác nhận duyệt hoàn tiền' : 'Xác nhận từ chối'"
    width="440"
  >
    <div v-if="actionItem" class="d-flex flex-column ga-4">
      <v-alert
        v-if="actionType === 'approved'"
        type="warning"
        variant="tonal"
        density="compact"
      >
        Bấm <strong>Xác nhận</strong> đồng nghĩa bạn đã chuyển
        <strong>{{ formatCurrency(actionItem.refundAmount) }}</strong>
        đến <strong>{{ actionItem.bankAccountName }}</strong>
        ({{ actionItem.bankAccount }} — {{ actionItem.bankName }}).
        Hệ thống sẽ tự động thu hồi gói và tín dụng.
      </v-alert>

      <v-alert v-else type="error" variant="tonal" density="compact">
        Yêu cầu hoàn tiền của <strong>{{ actionItem.customerInfo }}</strong> sẽ bị từ chối.
      </v-alert>

      <v-textarea
        v-model="adminNote"
        label="Ghi chú cho khách hàng (tùy chọn)"
        variant="outlined"
        density="compact"
        rows="2"
        hide-details
        placeholder="Nhập ghi chú nếu cần..."
      />

      <div class="d-flex justify-end ga-2">
        <v-btn variant="text" @click="actionDialogRef?.onDisplay(false)">Hủy</v-btn>
        <v-btn
          :color="actionType === 'approved' ? 'success' : 'error'"
          :loading="loading === 'action'"
          variant="flat"
          @click="submitAction"
        >
          {{ actionType === 'approved' ? 'Xác nhận đã chuyển tiền' : 'Từ chối' }}
        </v-btn>
      </div>
    </div>
  </CommonDialog>

  <!-- Tổng ước tính -->
  <v-card v-if="estimate" rounded="lg" border class="mb-4 pa-4">
    <div class="d-flex align-center justify-space-between flex-wrap ga-3">
      <div class="d-flex align-center ga-2">
        <v-icon color="warning" size="20">mdi-cash-refund</v-icon>
        <span>Ước tính nếu hoàn cho tất cả người dùng hợp lệ</span>
      </div>
      <span class="text-h5 font-weight-black text-blue">
        {{ formatCurrency(estimate.grandTotal) }}
      </span>
    </div>
    <v-divider class="my-3" />
    <div class="d-flex flex-wrap ga-2">
      <v-chip color="deep-purple">
        <v-icon start size="15">mdi-calendar-clock</v-icon>
        Gói dịch vụ {{ formatCurrency(estimate.breakdown.subscription.total) }}
        ({{ estimate.breakdown.subscription.count }} gói)
      </v-chip>

      <v-chip color="primary">
        <v-icon start size="15">mdi-infinity</v-icon>
        Unlimited credit {{ formatCurrency(estimate.breakdown.unlimited.total) }}
        ({{ estimate.breakdown.unlimited.count }} gói)
      </v-chip>

      <v-chip color="success">
        <v-icon start size="15">mdi-circle-multiple-outline</v-icon>
        Tín dụng còn lại {{ formatCurrency(estimate.breakdown.credit.total) }}
        ({{ estimate.breakdown.credit.count }} tài khoản)
      </v-chip>
    </div>
  </v-card>

  <!-- DataTable -->
  <DataTable
    ref="dataTableRef"
    :filters="[
      {
        label: 'Trạng thái',
        field: 'status',
        type: 'select',
        items: statusOptions,
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
    <!-- Tiền gốc -->
    <template #row-originalAmount="{ item }">
      <div class="text-red text-nowrap">
        {{ formatCurrency((item as any).originalAmount) }}
      </div>
    </template>

    <!-- Tiền hoàn -->
    <template #row-refundAmount="{ item }">
      <div class="text-error text-nowrap">
        {{ formatCurrency((item as any).refundAmount) }}
      </div>
    </template>



    <!-- Lý do -->
    <template #row-reason="{ item }">
      <div style="max-width: 260px">
        <div class="text-caption">{{ (item as any).reason }}</div>
        <div v-if="(item as any).adminNote" class="text-caption text-warning mt-1">
          ↳ {{ (item as any).adminNote }}
        </div>
      </div>
    </template>

    <!-- Trạng thái -->
    <template #row-statusChip="{ item }">
      <v-chip :color="statusMap[(item as any).status]?.color || 'grey'">
        {{ statusMap[(item as any).status]?.label || (item as any).status }}
      </v-chip>
    </template>

    <!-- Thao tác -->
    <template #row-action="{ item }">
      <div class="d-flex align-center justify-center ga-1">
        <!-- QR -->
        <v-btn
          v-if="(item as any).qrUrl"
          icon
          size="36"
          variant="text"
          color="primary"
          title="Xem QR chuyển khoản"
          @click="openQr(item)"
        >
          <v-icon size="20">mdi-qrcode</v-icon>
        </v-btn>

        <template v-if="(item as any).status === 'pending'">
          <!-- Duyệt -->
          <v-btn
            icon
            size="36"
            variant="text"
            color="success"
            title="Duyệt"
            @click="openAction(item, 'approved')"
          >
            <v-icon size="20">mdi-check-circle-outline</v-icon>
          </v-btn>

          <!-- Từ chối -->
          <v-btn
            icon
            size="36"
            variant="text"
            color="error"
            title="Từ chối"
            @click="openAction(item, 'rejected')"
          >
            <v-icon size="20">mdi-close-circle-outline</v-icon>
          </v-btn>
        </template>
      </div>
    </template>
  </DataTable>
</template>

<style scoped>
.estimate-item { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; }
</style>
