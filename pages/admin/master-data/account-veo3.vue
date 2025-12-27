<script setup lang="ts">
import { masterDataService } from "~/services/app";

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
  accountVeo3: "",
});

async function loadItems(event: any) {
  const params = {
    ...event,
    type: EnumMasterDataType.ACCOUNT_INFO,
  };

  loading.value = "load-table";
  await masterDataService
    .getAllMasterData(params)
    .then((res) => {
      if (res.data) data.value = res.data;
      formData.accountVeo3 = Array.isArray(data.value?.docs)
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
      accountVeo3: formData.accountVeo3,
    })
    .then(() => {
      dataTableRef.value?.loadItems();
      commonDialogRef.value?.onDisplay(false);
    })
    .finally(() => {
      loading.value = "";
    });
};

definePageMeta({ layout: "admin", title: "Tài khoản Veo3" });
</script>

<template>
  <CommonDialog ref="commonDialogRef" title="Tài khoản Veo3" width="500">
    <div class="d-flex flex-column ga-3" style="min-height: 24rem">
      <v-textarea
        v-model="formData.accountVeo3"
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
