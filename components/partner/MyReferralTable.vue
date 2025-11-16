<script setup lang="ts">
import { accountService } from "~/services/app";

const route = useRoute();

const { t } = useI18n();

const { onGetterMasterData } = useMasterDataStore();

const headers = [
  { title: "Họ và tên", key: "name", sortable: false },
  { title: "Email", key: "email", sortable: false },
  // { title: "Hoa hồng (%)", key: "commissionRate", sortable: false },
  { title: "Thời hạn còn lại", key: "remainingTime", sortable: false },
  { title: "Ngày tham gia", key: "createdAt", sortable: false },
  { title: "Cập nhật", key: "updatedAt", sortable: false },
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
  statusOptions?.map((x: any) => ({ ...x, title: t(x.title) }))
);

async function loadItems(event: any) {
  const params = { ...event, role: route.path?.split("/")?.pop() || "user" };

  loading.value = "load-table";
  await accountService
    .getMyReferralList(params)
    .then((res) => {
      if (res.data) data.value = res.data;
    })
    .finally(() => {
      loading.value = "";
    });
}
</script>

<template>
  <ConfirmDialog ref="confirmDialogRef" />

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
  >
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
