<script setup lang="ts">
import { accountService, appService } from "~/services/app";

import ConfirmDialog from "~/components/ConfirmDialog.vue";

const route = useRoute();

const { onGetterMasterData } = useMasterDataStore();

const headers = computed(() => {
  let item = [
    { title: "Họ và tên", key: "name", sortable: false },
    { title: "Email", key: "email", sortable: false },
    { title: "Tín dụng", key: "settings.credit", sortable: false },
    { title: "Thời hạn còn lại", key: "remainingTime", sortable: false },
    { title: "Ngày tham gia", key: "createdAt", sortable: false },
    { title: "Người giới thiệu", key: "referral.name", sortable: false },
    { title: "Cập nhật", key: "updatedAt", sortable: false },
    { title: "Trạng thái", key: "status", align: "center", sortable: false },
    { title: "Thao tác", key: "action", align: "center", sortable: false },
  ];

  if (role.value === EnumAccountRole.ADMIN) {
    item.splice(4, 1);
    item.pop();

    item = item.filter(
      (x: any) =>
        !["settings.credit", "remainingTime", "referral.name"].includes(x.key)
    );
  }

  return item;
});

const data = ref<any>({});
const loading = ref<string>("");
const dataTableRef = ref<any>(null);
const commonDialogRef = ref<any>(null);
const confirmDialogRef = ref<any>(null);
const settingCommonDialogRef = ref<any>(null);

const role = computed(() => route.path?.split("/")?.pop() || "user");

const formData = reactive<any>({
  name: "",
  email: "",
  referral: { _id: null },
  price: 69000,
  rentalMonths: 1,
});

const settingAccountDetail = ref<any>({
  name: "",
  flowCookies: "",
  geminiCookies: "",
  showBrowser: false,
  useMyAccount: false,
  isCreateSpeed: false,
});

const statusItems = computed(() => statusOptions);
const priceOptions = computed(() =>
  role.value === "user"
    ? [
        { title: "60.000 VND", value: 60000 },
        { title: "69,000 VND", value: 69000 },
        { title: "139,000 VND", value: 139000 },
      ]
    : [{ title: "139,000 VND", value: 139000 }]
);
const rentalMonthsOptions = computed(
  () => onGetterMasterData.value["rental-months"] || []
);
const totalPrice = computed(() =>
  formatCurrency(formData.price * formData.rentalMonths)
);

async function loadItems(event: any) {
  const params = { ...event, role: role.value };

  loading.value = "load-table";
  await accountService
    .getAllAccount(params)
    .then((res) => {
      if (res.data) data.value = res.data;
    })
    .finally(() => {
      loading.value = "";
    });
}

const onResetForm = async (item: any) => {
  formData.accountId = item._id;
  formData.name = item.name;
  formData.email = item.email;
  formData.referral =
    item.remainingTime === "Chưa từng đăng ký" && item.referral
      ? item.referral
      : { isReferral: false };
  formData.price = role.value !== "user" ? 139000 : 69000;
  formData.rentalMonths = 1;
  formData.remainingTime = item.remainingTime || "Chưa từng đăng ký";
};

const onAction = async (event: any) => {
  if (event.action == "view") {
    onResetForm(event.item);
  }
};

const onClickRegisterService = (event: any) => {
  onResetForm(event);
  commonDialogRef.value.onDisplay(true);
};

const onConfirmRegisterService = async () => {
  let payload: any = {
    accountId: formData.accountId,
    price: formData.price,
    rentalMonths: formData.rentalMonths,
  };

  confirmDialogRef.value.show({
    message: "Bạn có chắc muốn đăng ký địch vụ cho khách hàng?",
    noTransMsg: true,
    onConfirm: async () => {
      await accountService.serviceRegistration(payload).then(() => {
        onResetForm({});
        dataTableRef.value?.loadItems();
        commonDialogRef.value.onDisplay(false);
      });
    },
  });
};

const onClickSettingAccount = (item: any) => {
  settingAccountDetail.value = item.settings;
  settingAccountDetail.value._id = item._id;
  settingAccountDetail.value.name = item.name;
  settingCommonDialogRef.value?.onDisplay(true);
};

const onClickViewInfoPartner = (item: any) => {
  window.open(`/doi-tac?id=${item?._id}`, "_blank");
};

const onClickSaveSetting = async () => {
  loading.value = "setting";
  await appService
    .saveSetting({
      accountId: settingAccountDetail.value._id,
      showBrowser: settingAccountDetail.value.showBrowser,
    })
    .then(async () => {
      settingCommonDialogRef.value?.onDisplay(false);
      dataTableRef.value?.loadItems();
    })
    .finally(() => {
      loading.value = "";
    });
};
</script>

<template>
  <ConfirmDialog ref="confirmDialogRef" />

  <CommonDialog ref="commonDialogRef" title="Đăng ký dịch vụ" width="500">
    <div class="d-flex flex-column ga-3" style="min-height: 24rem">
      <div>
        <h3 class="font-bold mb-1">Thông tin người dùng</h3>
        <h4>{{ formData.name }}</h4>
        <h4>{{ formData.email }}</h4>
      </div>

      <div
        v-if="
          formData.referral.name &&
          formData.remainingTime === 'Chưa từng đăng ký'
        "
        style="margin-top: -10px"
      >
        <div>
          <!-- <v-chip size="small" color="success" class="my-1">
            Giảm 5% (có mã giới thiệu)
          </v-chip> -->

          <div class="text-blue mb-2">Người giới thiệu:</div>

          <div
            v-if="formData.referral.name"
            class="d-flex align-center ga-2 py-2 px-3"
            style="background-color: #8d8d8d"
          >
            <v-avatar>
              <v-img
                :src="formData.referral?.avatar || '/images/avatar-default.jpg'"
                :lazy-src="
                  formData.referral?.avatar || '/images/avatar-default.jpg'
                "
              >
                <template #placeholder>
                  <v-img src="/images/avatar-default.jpg" />
                </template>
              </v-img>
            </v-avatar>

            <div class="d-flex flex-column" style="color: #fff">
              <span>{{ formData.referral?.name }}</span>
              <span>{{ formData.referral?.email }}</span>
            </div>
          </div>
        </div>
      </div>

      <v-divider class="mt-1" />

      <div>
        <h3 class="font-bold">Thông tin thanh toán</h3>

        <v-select
          v-model="formData.price"
          hide-details
          class="w-100 mt-4"
          variant="outlined"
          item-title="title"
          item-value="value"
          :items="priceOptions"
          label="Giá gói"
        />

        <v-select
          v-model="formData.rentalMonths"
          class="w-100 mt-4"
          variant="outlined"
          item-title="title"
          item-value="value"
          :items="rentalMonthsOptions"
          label="Thời hạn đăng ký"
        />
      </div>

      <h3 class="mb-4 bg-brown-lighten-5 px-4 py-2">
        Tổng cộng: {{ totalPrice }}
      </h3>
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
        text="Đăng ký"
        class="flex-1"
        variant="flat"
        color="primary"
        style="height: 48px"
        @click="onConfirmRegisterService"
      />
    </div>
  </CommonDialog>

  <CommonDialog
    ref="settingCommonDialogRef"
    :title="`Cài đặt tài khoản | ${settingAccountDetail.name}`"
    width="500"
  >
    <div class="d-flex flex-column">
      <div style="margin-left: -0.6rem">
        <v-checkbox
          v-model="settingAccountDetail.showBrowser"
          hide-details
          label="Hiển thị quá trình thực thi"
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
          text="Lưu cài đặt"
          class="flex-1"
          variant="flat"
          color="primary"
          style="height: 48px"
          :loading="Boolean(loading === 'setting')"
          @click="onClickSaveSetting"
        />
      </div>
    </div>
  </CommonDialog>

  <DataTable
    ref="dataTableRef"
    :filters="[
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
    @action="onAction"
  >
    <template #row-name="{ item }">
      <div class="d-flex align-center">
        <v-btn
          icon
          size="40"
          variant="text"
          @click="onClickSettingAccount(item)"
        >
          <v-icon size="20">mdi-cog-outline</v-icon>
        </v-btn>

        <span class="text-nowrap">
          {{ (item as any).name }}
        </span>
      </div>
    </template>

    <!-- [2026-09-03] Đổi hiện đúng y hệt kiểu huy hiệu user tự thấy ở trang
    của họ (AppHeader.vue .menu-credit-badge / tai-khoan.vue) — trước đây
    admin lại hiện "X ngày" (số ngày còn lại gói Không giới hạn, đã có sẵn ở
    cột "Thời hạn còn lại" ngay bên cạnh rồi, trùng lặp) thay vì số tín dụng
    thật. Theo yêu cầu cụ thể: "ở user đang hiện như nào thì admin cũng hiện
    y như vậy". -->
    <template #row-settings.credit="{ item }">
      <span
        class="credit-badge"
        :class="{ 'credit-badge--frozen': (item as any)?.settings?.unlimitedVideo }"
      >
        <span
          class="credit-badge-icon"
          :class="{ 'credit-badge-icon--lock': (item as any)?.settings?.unlimitedVideo }"
          >{{ (item as any)?.settings?.unlimitedVideo ? "🔒" : "💎" }}</span
        >
        {{ ((item as any)?.settings?.credit || 0).toLocaleString("vi-VN") }} tín dụng
      </span>
    </template>

    <template #row-action="{ item }">
      <div class="d-flex justify-center">
        <v-btn
          v-if="role === EnumAccountRole.PARTNER"
          icon
          size="40"
          variant="text"
          @click="onClickViewInfoPartner(item)"
        >
          <v-icon size="20">mdi-eye-outline</v-icon>
        </v-btn>

        <v-btn
          icon
          size="40"
          variant="text"
          @click="onClickRegisterService(item)"
        >
          <v-icon size="20">mdi-account-plus-outline</v-icon>
        </v-btn>
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

/* [2026-09-03] Y HỆT .menu-credit-badge/.menu-credit-icon ở AppHeader.vue —
   copy nguyên giá trị, đổi tên class để tránh nhầm 2 component không liên
   quan (scoped CSS không tự dùng chung được giữa 2 file .vue khác nhau). */
.credit-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #b45309;
  background: rgba(252, 211, 77, 0.15);
  border: 1px solid rgba(252, 211, 77, 0.4);
  padding: 4px 12px;
  border-radius: 999px;
  white-space: nowrap;
}

/* Tín dụng thường đang bị "đóng băng" vì tài khoản đang dùng gói Không giới
   hạn — làm mờ + đổi màu xám lạnh (khác hẳn màu vàng bình thường) để admin
   hiểu ngay số này tạm ngưng dùng, không phải mất hẳn — xem giải thích đầy
   đủ ở AppHeader.vue (.menu-credit-badge--frozen). */
.credit-badge--frozen {
  color: #64748b;
  background: rgba(148, 163, 184, 0.15);
  border: 1px solid rgba(148, 163, 184, 0.35);
  opacity: 0.85;
}

.credit-badge-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 13px;
  height: 13px;
  line-height: 1;
  font-size: 0.75rem;
}

.credit-badge-icon--lock {
  transform: translateY(-1.5px);
}
</style>
