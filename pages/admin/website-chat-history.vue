<script setup lang="ts">
import { websiteChatService } from "~/services/website-chat";
import WebsiteChatTranscript from "~/components/admin/WebsiteChatTranscript.vue";

const headers = [
  { title: "Tài khoản", key: "accountEmail", sortable: false },
  { title: "Số tin nhắn", key: "messageCount", align: "center", sortable: false },
  { title: "Bắt đầu", key: "createdAt", sortable: false },
  { title: "Cập nhật cuối", key: "updatedAt", sortable: false },
  { title: "Thao tác", key: "action", align: "center", sortable: false },
];

const data = ref<any>({});
const loading = ref<string>("");
const dataTableRef = ref<any>(null);
const commonDialogRef = ref<any>(null);
const selectedSession = ref<any>(null);
const selectedSessionTitle = computed(() => {
  if (selectedSession.value?.accountEmail) return selectedSession.value.accountEmail;
  const ip = selectedSession.value?.ip;
  return ip ? `Khách (${ip})` : "Khách";
});

async function loadItems(event: any) {
  loading.value = "load-table";
  try {
    const res = await websiteChatService.getSessionsAdmin({
      search: event?.search,
      page: event?.page,
      limit: event?.limit,
    });
    data.value = {
      docs: res.data?.docs || [],
      totalDocs: res.data?.totalDocs || 0,
    };
  } catch (error) {
    console.log("Lỗi khi tải danh sách phiên chat!", error);
  } finally {
    loading.value = "";
  }
}

async function onAction(event: any) {
  if (event.action !== "view") return;
  loading.value = `view-${event.item._id}`;
  try {
    const res = await websiteChatService.getSessionDetailAdmin(event.item._id);
    selectedSession.value = res.data;
    commonDialogRef.value?.onDisplay(true);
  } catch (error) {
    console.log("Lỗi khi tải chi tiết phiên chat!", error);
  } finally {
    loading.value = "";
  }
}

definePageMeta({ layout: "admin", title: "Lịch sử chat website" });
</script>

<template>
  <CommonDialog
    ref="commonDialogRef"
    :title="selectedSessionTitle"
    width="600"
  >
    <WebsiteChatTranscript :messages="selectedSession?.messages || []" />
  </CommonDialog>

  <DataTable
    ref="dataTableRef"
    :showSelect="false"
    :actions="[]"
    :rowActions="['view']"
    :headers="headers"
    :data="data"
    :loading="Boolean(loading === 'load-table')"
    @change="loadItems"
    @action="onAction"
  >
    <template #row-accountEmail="{ item }">
      <span v-if="(item as any).accountEmail">{{ (item as any).accountEmail }}</span>
      <span v-else class="text-medium-emphasis">
        Khách{{ (item as any).ip ? ` (${(item as any).ip})` : "" }}
      </span>
    </template>
  </DataTable>
</template>
