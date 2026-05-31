<script setup lang="ts">
import { refundRequestService } from "~/services/refund-request";

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  submitted: [];
}>();

const BANKS = [
  { title: "Vietcombank (VCB)",  value: "VCB"   },
  { title: "Techcombank (TCB)",  value: "TCB"   },
  { title: "MB Bank",            value: "MB"    },
  { title: "VPBank",             value: "VPB"   },
  { title: "TPBank",             value: "TPB"   },
  { title: "ACB",                value: "ACB"   },
  { title: "BIDV",               value: "BIDV"  },
  { title: "Vietinbank",         value: "ICB"   },
  { title: "Sacombank",          value: "STB"   },
  { title: "OCB",                value: "OCB"   },
  { title: "MSB",                value: "MSB"   },
  { title: "SHB",                value: "SHB"   },
  { title: "VIB",                value: "VIB"   },
  { title: "Agribank",           value: "VBARD" },
  { title: "HDBank",             value: "HDB"   },
  { title: "Nam A Bank",         value: "NAB"   },
  { title: "Eximbank",           value: "EIB"   },
  { title: "SeABank",            value: "SEAB"  },
  { title: "LPBank",             value: "LPB"   },
];

const categoryConfig: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  subscription:     { icon: "mdi-calendar-clock",         color: "#7c3aed", bg: "#f3e8ff", label: "Gói dịch vụ"             },
  credit_unlimited: { icon: "mdi-infinity",               color: "#0284c7", bg: "#e0f2fe", label: "Tín dụng không giới hạn" },
  credit:           { icon: "mdi-circle-multiple-outline", color: "#059669", bg: "#d1fae5", label: "Tín dụng còn lại"         },
};

const loading = ref(false);
const preview = ref<any>(null);
const errorMsg = ref("");
const selectedBank = ref<any>(null);
const form = ref({ bankName: "", bankCode: "", bankAccount: "", bankAccountName: "", reason: "" });

watch(selectedBank, (bank) => {
  if (bank) { form.value.bankName = bank.title; form.value.bankCode = bank.value; }
});

async function loadPreview() {
  loading.value = true;
  errorMsg.value = "";
  preview.value = null;
  await refundRequestService
    .previewAll()
    .then((res) => {
      if (res.data?.error) {
        errorMsg.value = res.data.error;
      } else {
        preview.value = res.data;
      }
    })
    .catch((e) => { errorMsg.value = e?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại."; })
    .finally(() => { loading.value = false; });
}

async function submit() {
  if (!form.value.bankCode || !form.value.bankAccount || !form.value.bankAccountName || form.value.reason.length < 10) {
    errorMsg.value = "Vui lòng điền đầy đủ thông tin (lý do tối thiểu 10 ký tự)!";
    return;
  }
  loading.value = true;
  errorMsg.value = "";
  await refundRequestService
    .create({ ...form.value })
    .then(() => { emit("submitted"); close(); })
    .catch((e) => { errorMsg.value = e?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!"; })
    .finally(() => { loading.value = false; });
}

function close() { emit("update:modelValue", false); }

// Với v-if trên component, onMounted chỉ chạy khi popup thật sự mở
onMounted(() => { loadPreview(); });
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="500" scrollable @update:model-value="close">
    <v-card rounded="xl" elevation="0">

      <!-- Header -->
      <div class="rr-header">
        <div class="rr-title">
          <v-icon size="18" color="#d97706">mdi-cash-refund</v-icon>
          Yêu cầu hoàn tiền tất cả
        </div>
        <button class="rr-close" @click="close"><v-icon size="20">mdi-close</v-icon></button>
      </div>

      <div class="rr-body">

        <!-- Loading -->
        <div v-if="loading && !preview" class="rr-loading">
          <v-progress-circular size="24" width="2" indeterminate color="primary" />
          <span>Đang tính toán số tiền hoàn...</span>
        </div>

        <!-- Error khi chưa có preview (lỗi load) -->
        <v-alert v-if="errorMsg && !preview" type="error" density="compact" variant="tonal">
          {{ errorMsg }}
        </v-alert>

        <template v-if="preview">

          <!-- ── Breakdown items ── -->
          <div class="rr-section-label">Chi tiết giao dịch được hoàn</div>

          <div class="rr-items">
            <div v-for="(item, i) in preview.breakdown" :key="i" class="rr-item">
              <!-- Icon + type badge -->
              <div class="rr-item-head">
                <div
                  class="rr-item-icon"
                  :style="{ background: categoryConfig[item.category]?.bg, color: categoryConfig[item.category]?.color }"
                >
                  <v-icon size="16">{{ categoryConfig[item.category]?.icon }}</v-icon>
                </div>
                <div>
                  <div class="rr-item-label">{{ item.label }}</div>
                  <div class="rr-item-type">{{ categoryConfig[item.category]?.label }}</div>
                </div>
              </div>

              <!-- Progress bar ngày (chỉ subscription / unlimited) -->
              <template v-if="item.totalDays > 0">
                <div class="rr-progress-wrap">
                  <div
                    class="rr-progress-bar"
                    :style="{
                      width: `${Math.min(100, Math.round(item.remainingDays / item.totalDays * 100))}%`,
                      background: categoryConfig[item.category]?.color,
                    }"
                  />
                </div>
                <div class="rr-progress-label">
                  <template v-if="item.notStarted">
                    <span class="rr-not-started">Chưa bắt đầu — hoàn 100%</span>
                  </template>
                  <template v-else>
                    Còn <strong>{{ item.remainingDays }}</strong> / {{ item.totalDays }} ngày
                  </template>
                </div>
              </template>

              <!-- Số tiền -->
              <div class="rr-item-amounts">
                <div class="rr-amount-row">
                  <span class="rr-amount-label">Đã thanh toán</span>
                  <span class="rr-amount-original">{{ formatCurrency(item.originalAmount) }}</span>
                </div>
                <div class="rr-amount-row rr-amount-row--refund">
                  <span class="rr-amount-label">Tiền hoàn</span>
                  <span class="rr-amount-refund">{{ formatCurrency(item.refundAmount) }}</span>
                </div>
                <div v-if="item.creditToReclaim > 0" class="rr-amount-row">
                  <span class="rr-amount-label">Thu hồi tín dụng</span>
                  <span class="rr-amount-credit">{{ item.creditToReclaim.toLocaleString("vi-VN") }} 💎</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ── Tổng ── -->
          <div class="rr-total">
            <div class="rr-total-row">
              <span>Tổng tiền gốc</span>
              <span class="rr-total-original">{{ formatCurrency(preview.totalOriginal) }}</span>
            </div>
            <div class="rr-total-divider" />
            <div class="rr-total-row rr-total-row--main">
              <span>Tổng tiền hoàn ước tính</span>
              <span class="rr-total-refund">{{ formatCurrency(preview.totalRefund) }}</span>
            </div>
          </div>

          <!-- ── Notice ── -->
          <div class="rr-notice">
            <v-icon size="15" color="#d97706">mdi-information-outline</v-icon>
            <span>Sau khi admin duyệt, tất cả gói và tín dụng sẽ bị thu hồi. Tiền được chuyển khoản thủ công trong 1–3 ngày làm việc.</span>
          </div>

          <!-- ── Form ngân hàng ── -->
          <div class="rr-section-label" style="margin-top: 4px;">Thông tin tài khoản nhận tiền</div>

          <v-autocomplete
            v-model="selectedBank"
            :items="BANKS"
            item-title="title"
            item-value="value"
            return-object
            label="Ngân hàng *"
            variant="outlined"
            density="compact"
            hide-details="auto"
            class="rr-field"
            placeholder="Chọn ngân hàng..."
          />

          <v-text-field
            v-model="form.bankAccount"
            label="Số tài khoản *"
            variant="outlined"
            density="compact"
            hide-details="auto"
            class="rr-field"
            placeholder="VD: 1234567890"
          />

          <v-text-field
            v-model="form.bankAccountName"
            label="Tên chủ tài khoản *"
            variant="outlined"
            density="compact"
            hide-details="auto"
            class="rr-field"
            placeholder="VD: NGUYEN VAN A"
            hint="Nhập IN HOA đúng tên trên tài khoản ngân hàng"
            persistent-hint
          />

          <v-textarea
            v-model="form.reason"
            label="Lý do hoàn tiền *"
            variant="outlined"
            density="compact"
            rows="2"
            hide-details="auto"
            class="rr-field"
            placeholder="Mô tả lý do bạn muốn hoàn tiền (tối thiểu 10 ký tự)..."
          />

        </template>
      </div>

      <!-- Footer -->
      <div v-if="preview" class="rr-footer">
        <v-alert v-if="errorMsg" type="error" density="compact" variant="tonal" class="rr-footer-error">
          {{ errorMsg }}
        </v-alert>
        <div class="rr-footer-btns">
          <v-btn variant="text" color="grey-darken-1" @click="close">Hủy</v-btn>
          <v-btn color="warning" variant="flat" :loading="loading" @click="submit">
            Gửi yêu cầu hoàn tiền
          </v-btn>
        </div>
      </div>

    </v-card>
  </v-dialog>
</template>

<style scoped>
/* ── Header ───────────────────────────────── */
.rr-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}
.rr-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}
.rr-close {
  width: 32px; height: 32px;
  border-radius: 50%;
  border: none;
  background: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
  flex-shrink: 0;
}
.rr-close:hover { background: #e2e8f0; }

/* ── Body ─────────────────────────────────── */
.rr-body {
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
  max-height: 70vh;
}
.rr-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #64748b;
  font-size: 0.85rem;
  padding: 10px 0;
}
.rr-alert { border-radius: 10px !important; }

/* ── Section label ────────────────────────── */
.rr-section-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #94a3b8;
}

/* ── Items ────────────────────────────────── */
.rr-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rr-item {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #fafcff;
}

.rr-item-head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.rr-item-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.rr-item-label {
  font-size: 0.88rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
}
.rr-item-type {
  font-size: 0.72rem;
  color: #94a3b8;
  margin-top: 2px;
}

/* Progress bar */
.rr-progress-wrap {
  width: 100%;
  height: 6px;
  background: #f1f5f9;
  border-radius: 999px;
  overflow: hidden;
}
.rr-progress-bar {
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s;
}
.rr-progress-label {
  font-size: 0.76rem;
  color: #64748b;
  margin-top: -4px;
}
.rr-progress-label strong { color: #0f172a; }
.rr-not-started {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.73rem;
  font-weight: 600;
  color: #059669;
  background: #d1fae5;
  padding: 2px 8px;
  border-radius: 999px;
}

/* Amounts */
.rr-item-amounts {
  border-top: 1px solid #f0f0f0;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.rr-amount-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.82rem;
}
.rr-amount-label { color: #94a3b8; }
.rr-amount-original { color: #94a3b8; text-decoration: line-through; }
.rr-amount-row--refund .rr-amount-label { color: #0f172a; font-weight: 600; }
.rr-amount-refund {
  font-size: 1rem;
  font-weight: 700;
  color: #1e88e5;
}
.rr-amount-credit { font-size: 0.82rem; font-weight: 600; color: #dc2626; }

/* ── Total ────────────────────────────────── */
.rr-total {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.rr-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #374151;
}
.rr-total-row span:first-child { color: #64748b; }
.rr-total-original { font-weight: 600; color: #374151; }
.rr-total-divider { height: 1px; background: #e2e8f0; }
.rr-total-row--main span:first-child { font-weight: 700; color: #0f172a; font-size: 0.9rem; }
.rr-total-refund {
  font-size: 1.3rem;
  font-weight: 800;
  color: #1e88e5;
}

/* ── Notice ───────────────────────────────── */
.rr-notice {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.78rem;
  color: #92400e;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 10px;
  padding: 10px 13px;
  line-height: 1.6;
}

/* ── Form fields ──────────────────────────── */
.rr-field { margin-bottom: 10px; }
.rr-field:last-child { margin-bottom: 0; }

/* ── Footer ───────────────────────────────── */
.rr-footer {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 20px 18px;
  border-top: 1px solid #f0f0f0;
}
.rr-footer-error { border-radius: 8px !important; }
.rr-footer-btns {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
