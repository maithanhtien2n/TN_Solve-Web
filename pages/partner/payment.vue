<script setup lang="ts">
import { appService } from "~/services/app";

const { width } = useDevice();

const { onGetterUserData, onActionGetUserData } = useAppStore();

const MIN_PAYOUT_AMOUNT = 100000;

const isCopied = ref<boolean>(false);
const commonDialogRef = ref<any>(null);

const paymentInfo = computed(
  () => onGetterUserData.value?.settings?.paymentInfo || {}
);

const formData = reactive<any>({
  bankName: paymentInfo.value?.bankName || "",
  accountName: paymentInfo.value?.accountName || "",
  accountNumber: paymentInfo.value?.accountNumber || "",
});

const loading = ref<string>("");

const onResetForm = () => {
  formData.bankName = paymentInfo.value?.bankName || "";
  formData.accountName = paymentInfo.value?.accountName || "";
  formData.accountNumber = paymentInfo.value?.accountNumber || "";
  commonDialogRef.value?.onDisplay(true);
};

const onSavePaymentInfo = async () => {
  loading.value = "save-payment-info";
  await appService
    .saveSetting({ paymentInfo: JSON.stringify(formData) })
    .then(async () => {
      await onActionGetUserData();
      commonDialogRef.value?.onDisplay(false);
    })
    .finally(() => {
      loading.value = "";
    });
};

const onCopyReferralLink = async () => {
  if (!onGetterUserData.value?.referralLink) return;
  try {
    await navigator.clipboard.writeText(onGetterUserData.value?.referralLink);
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000); // Reset biểu tượng sau 2 giây
  } catch (err) {
    console.error("Failed to copy referral code: ", err);
  }
};

definePageMeta({ layout: "partner", title: "Thanh toán" });
</script>

<template>
  <v-container fluid class="ma-0 pa-0">
    <CommonDialog
      ref="commonDialogRef"
      title="Thông tin thanh toán"
      width="500"
    >
      <div class="mt-3">
        <v-text-field
          v-model="formData.bankName"
          class="w-100"
          variant="outlined"
          :label="$t('Tên ngân hàng (Ví dụ: ACB, Vietcombank...)')"
        />

        <v-text-field
          v-model="formData.accountName"
          class="w-100"
          variant="outlined"
          :label="$t('Tên chủ tài khoản (Viết hoa, không dấu)')"
        />

        <v-text-field
          v-model="formData.accountNumber"
          class="w-100"
          variant="outlined"
          :label="$t('Số tài khoản')"
        />
      </div>

      <div class="d-flex ga-3 mt-6">
        <v-btn
          text="Hủy bỏ"
          class="flex-1"
          variant="tonal"
          color="primary"
          style="height: 48px"
          @click="commonDialogRef?.onDisplay(false)"
        />

        <v-btn
          text="Lưu thông tin"
          class="flex-1"
          variant="flat"
          color="primary"
          style="height: 48px"
          :disabled="
            Boolean(
              !formData.bankName ||
                !formData.accountName ||
                !formData.accountNumber
            )
          "
          :loading="Boolean(loading === 'save-payment-info')"
          @click="onSavePaymentInfo"
        />
      </div>
    </CommonDialog>

    <v-row justify="center" class="">
      <v-col cols="12" md="10" lg="7">
        <v-card
          variant="outlined"
          class="py-3 pb-6"
          :class="`${width > 550 ? 'px-2' : 'px-0'}`"
        >
          <v-card-item>
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-bank</v-icon>
              Thông tin thanh toán
            </v-card-title>
          </v-card-item>

          <v-card-text class="mt-3 pb-0">
            <v-sheet
              v-if="
                !paymentInfo.bankName ||
                !paymentInfo.accountName ||
                !paymentInfo.accountNumber
              "
              color="orange"
              variant="tonal"
              class="pa-4 d-flex align-center justify-space-between rounded-lg"
            >
              <div>
                <div class="font-bold">{{ $t("BẠN CHƯA THÊM NGÂN HÀNG") }}</div>
                <div class="mt-1">
                  {{ $t("Vui lòng thêm thông tin để có thể rút tiền.") }}
                </div>
              </div>

              <v-btn
                icon
                variant="text"
                style="height: 48px"
                @click="commonDialogRef?.onDisplay(true)"
              >
                <v-icon>mdi-plus-circle-outline</v-icon>
              </v-btn>
            </v-sheet>

            <v-sheet v-else variant="outlined" class="rounded-lg">
              <v-list-item class="pa-0">
                <h3 class="font-bold">
                  {{ paymentInfo?.accountName }}
                </h3>

                <h3>
                  {{ paymentInfo?.accountNumber }}
                </h3>

                <h3>
                  {{ paymentInfo?.bankName }}
                </h3>

                <template #append>
                  <v-btn
                    icon
                    variant="text"
                    style="height: 48px"
                    @click="onResetForm()"
                  >
                    <v-icon>mdi-pencil-outline</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-sheet>
          </v-card-text>

          <v-card-text>
            <h3 class="mb-2 font-bold">
              {{ $t("LINK GỚI THIỆU CỦA BẠN") }}
            </h3>

            <v-text-field
              readonly
              hide-details
              variant="outlined"
              title="Sao chép mã"
              style="cursor: pointer"
              :color="isCopied ? 'success' : 'default'"
              :model-value="onGetterUserData.referralLink"
              :append-inner-icon="isCopied ? 'mdi-check' : 'mdi-content-copy'"
              @click:append-inner="onCopyReferralLink()"
            />
          </v-card-text>

          <v-card-text
            class="pb-7 pt-2"
            v-if="
              Array.isArray(onGetterUserData?.settings?.paymentHistory) &&
              onGetterUserData?.settings?.paymentHistory?.length
            "
          >
            <h3 class="mb-2 font-bold">
              {{ $t("LỊCH SỬ THANH TOÁN") }}
            </h3>

            <v-data-table
              :headers="[
                { title: 'Tháng', key: 'billingPeriod', sortable: false },
                {
                  title: 'Lượt thuê',
                  key: 'transactionCount',
                  align: 'center',
                  sortable: false,
                },
                {
                  title: 'Số tiền',
                  key: 'amount',
                  align: 'end',
                  sortable: false,
                },
                { title: 'Ghi chú', key: 'note', sortable: false },
              ]"
              :items="onGetterUserData?.settings?.paymentHistory"
              :items-per-page="-1"
              hide-default-footer
            >
              <template #item.amount="{ item }">
                <span class="text-red">
                  {{ formatCurrency((item as any).amount) }}
                </span>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>

        <v-card-text>
          <h2 class="mb-2 font-bold">Quy trình thanh toán</h2>
          <ul class="pl-5 text-medium-emphasis">
            <li>
              Hệ thống sẽ tự tổng kết số tiền vào <b>ngày 1 hàng tháng</b> (tổng
              kết của tháng trước).
            </li>
            <li>
              Thanh toán sẽ được thực hiện từ
              <b>ngày 2 đến chậm nhất là ngày 8</b> hàng tháng.
            </li>
            <li>
              Nếu sau ngày 8 vẫn chưa nhận được tiền, vui lòng
              <a
                href="https://zalo.me/g/vvhrhc608"
                target="_blank"
                class="text-primary underline"
              >
                nhắn vào nhóm Zalo
              </a>
              để được kiểm tra lại.
            </li>
            <li>
              Nếu sau ngày 20 không có phản hồi nào, mọi khiếu nại cho tháng đó
              sẽ không được chấp nhận.
            </li>
            <li>
              Vui lòng đảm bảo thông tin ngân hàng chính xác. Chúng tôi không
              chịu trách nhiệm nếu bạn nhập sai thông tin.
            </li>
          </ul>
        </v-card-text>
      </v-col>
    </v-row>
  </v-container>
</template>
