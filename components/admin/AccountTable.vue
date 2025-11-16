<script setup lang="ts">
import { accountService } from "~/services/app";

import ConfirmDialog from "~/components/ConfirmDialog.vue";

const route = useRoute();

const { t } = useI18n();

const { onGetterMasterData } = useMasterDataStore();

const headers = computed(() => {
  const item = [
    { title: "Họ và tên", key: "name", sortable: false },
    { title: "Email", key: "email", sortable: false },
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
  }

  return item;
});

const data = ref<any>({});
const loading = ref<string>("");
const dataTableRef = ref<any>(null);
const commonDialogRef = ref<any>(null);
const confirmDialogRef = ref<any>(null);

const role = computed(() => route.path?.split("/")?.pop() || "user");

const formData = reactive<any>({
  name: "",
  email: "",
  referral: { _id: null },
  price: 69000,
  rentalMonths: 1,
});

const statusItems = computed(() =>
  statusOptions?.map((x: any) => ({ ...x, title: t(x.title) }))
);
const priceOptions = computed(() =>
  role.value === "user"
    ? [
        { title: "60.000 VND", value: 60000 },
        { title: "69,000 VND", value: 69000 },
        { title: "99,000 VND", value: 99000 },
      ]
    : [{ title: "99,000 VND", value: 99000 }]
);
const rentalMonthsOptions = computed(
  () =>
    onGetterMasterData.value["rental-months"]?.map((x: any) => ({
      title: t(x.title),
      value: x.value,
    })) || []
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
  formData.price = role.value !== "user" ? 99000 : 69000;
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

const onClickViewInfoPartner = (item: any) => {
  window.open(`https://tnsolve.com/partner?id=${item?._id}`, "_blank");
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
          :label="$t('Giá gói')"
        />

        <v-select
          v-model="formData.rentalMonths"
          class="w-100 mt-4"
          variant="outlined"
          item-title="title"
          item-value="value"
          :items="rentalMonthsOptions"
          :label="$t('Thời hạn đăng ký')"
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
      <div style="min-width: 14rem">
        {{ (item as any).name }}
      </div>
    </template>

    <template #row-action="{ item }">
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
