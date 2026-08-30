<script setup lang="ts">
import { geminiHanaService } from "~/services/gemini-hana";

const headers = [
  { title: "Tên cài đặt", key: "title", sortable: false },
  { title: "Giá trị", key: "value", sortable: false },
  { title: "Cập nhật", key: "updatedAt", sortable: false },
  { title: "Thao tác", align: "center", key: "action", sortable: false },
];

const data = ref<any>({});
const loading = ref<string>("");
const dataTableRef = ref<any>(null);
const newConcurrency = ref<string>("");

async function loadItems(event: any) {
  const params = { ...event };

  loading.value = "load-table";
  await geminiHanaService
    .getSettings()
    .then((res) => {
      if (res.data) data.value = res.data;
    })
    .finally(() => {
      loading.value = "";
    });
}

async function onSaveConcurrency(item: any) {
  if (!newConcurrency.value) return;

  loading.value = `concurrency-${item._id}`;
  try {
    await geminiHanaService.saveSettings({
      _id: item._id,
      value: newConcurrency.value,
    });
    newConcurrency.value = "";
    dataTableRef.value?.loadItems();
  } catch (error) {
    console.log("Lỗi khi đổi số request đồng thời!", error);
  } finally {
    loading.value = "";
  }
}

definePageMeta({ layout: "admin", title: "Cài đặt" });
</script>

<template>
  <DataTable
    ref="dataTableRef"
    :filters="[]"
    :showSelect="false"
    :actions="[]"
    :rowActions="[]"
    :headers="headers"
    :data="data"
    :loading="Boolean(loading == 'load-table')"
    @change="loadItems"
  >
    <template #row-value="{ item }">
      <span class="text-nowrap">{{ (item as any).value }}</span>
    </template>

    <template #row-action="{ item }">
      <div class="d-flex justify-center">
        <div class="d-flex align-center ga-2 my-2 w-10rem">
          <v-text-field
            v-model="newConcurrency"
            type="number"
            :min="1"
            :max="50"
            density="compact"
            variant="outlined"
            hide-details
            class="flex-grow-1"
            :placeholder="(item as any).value"
            @keyup.enter="onSaveConcurrency(item)"
          />
          <v-btn
            variant="tonal"
            color="primary"
            height="36"
            rounded="lg"
            :disabled="!newConcurrency"
            :loading="loading === `concurrency-${(item as any)._id}`"
            icon="mdi-content-save-outline"
            @click="onSaveConcurrency(item)"
          />
        </div>
      </div>
    </template>
  </DataTable>
</template>
