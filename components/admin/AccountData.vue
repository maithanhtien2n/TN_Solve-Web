<script setup lang="ts">
import { masterDataService } from "~/services/app";

const route = useRoute();

const headers = [
  { title: "Tên tài khoản", key: "title", sortable: false },
  { title: "Mật khẩu", key: "value", sortable: false },
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
const commonDialogRef = ref<any>(null);

const formData = reactive({
  accountInfo: "",
});

const type = computed(() => route.path?.split("/")?.pop() || "");

const accountTitle = computed(() => {
  if (type.value === "account-create-image") {
    return "Tài khoản Nano banana";
  } else if (type.value === "account-create-video-advanced") {
    return "Tài khoản Veo3 (Advanced)";
  } else {
    return "Tài khoản Veo3 (Basic)";
  }
});

async function loadItems(event: any) {
  const params = {
    ...event,
    type: EnumMasterDataType.ACCOUNT_INFO,
    note: type.value,
    limit: 100,
  };

  loading.value = "load-table";
  await masterDataService
    .getAllMasterData(params)
    .then((res) => {
      if (res.data) data.value = res.data;
      formData.accountInfo = Array.isArray(data.value?.docs)
        ? data.value.docs
            .map((doc: any) => {
              return `${doc.title}\n${doc.value}`;
            })
            .join("\n\n")
        : "";
    })
    .finally(() => {
      loading.value = "";
    });
}

const onClickAction = (event: any) => {
  if (event.action === "update") {
    commonDialogRef.value?.onDisplay(true);
  }
};

const onClickUpdateData = async () => {
  loading.value = "submit";
  await masterDataService
    .updateAccountInfo({
      accountInfo: formData.accountInfo,
      note: type.value,
    })
    .then(() => {
      dataTableRef.value?.loadItems();
      commonDialogRef.value?.onDisplay(false);
    })
    .finally(() => {
      loading.value = "";
    });
};
</script>

<template>
  <CommonDialog ref="commonDialogRef" :title="accountTitle" width="500">
    <div class="d-flex flex-column ga-3" style="min-height: 24rem">
      <v-textarea
        v-model="formData.accountInfo"
        rows="2"
        auto-grow
        hide-details
        class="w-100 mt-2"
        variant="outlined"
      />

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
          text="Cập nhật dữ liệu"
          class="flex-1"
          variant="flat"
          color="primary"
          style="height: 48px"
          :loading="Boolean(loading === 'submit')"
          @click="onClickUpdateData"
        />
      </div>
    </div>
  </CommonDialog>

  <DataTable
    ref="dataTableRef"
    :filters="[]"
    :showSelect="false"
    :actions="['update']"
    :rowActions="['register']"
    :headers="headers"
    :data="data"
    :loading="Boolean(loading == 'load-table')"
    @change="loadItems"
    @action="onClickAction"
  >
    <template #row-value="{ item }">
      <span>
        {{
          (item as any).value?.length > 3
            ? "●●●●●●●●●●" + (item as any).value.slice(-3)
            : (item as any).value
        }}
      </span>
    </template>
  </DataTable>
</template>
