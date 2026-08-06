<script setup lang="ts">
import { masterDataService } from "~/services/app";

const headers = [
  { title: "Tiêu đề", key: "title", sortable: false },
  { title: "Giá trị", key: "value", align: "center", sortable: false },
  { title: "Cập nhật", key: "updatedAt", sortable: false },
  { title: "Trạng thái", key: "status", align: "center", sortable: false },
  { title: "Thao tác", key: "action", align: "center", sortable: false },
];

const data = ref<any>({});
const loading = ref<string>("");
const dataTableRef = ref<any>(null);
const commonDialogRef = ref<any>(null);

const formData = reactive<any>({
  _id: null,
  title: "",
  value: "",
});

function onResetForm(item?: any) {
  formData._id = item?._id || null;
  formData.title = item?.title || "";
  formData.value = item?.value || "";
}

async function loadItems(event: any) {
  loading.value = "load-table";
  try {
    const res = await masterDataService.getTutorialVideosAdmin({
      search: event?.search,
      page: event?.page,
      limit: event?.limit,
    });
    data.value = {
      docs: res.data?.docs || [],
      totalDocs: res.data?.totalDocs || 0,
    };
  } catch (error) {
    console.log("Lỗi khi tải danh sách video hướng dẫn!", error);
  } finally {
    loading.value = "";
  }
}

const onSubmitForm = async () => {
  if (!formData.title || !formData.value) return;

  loading.value = "submit-form";
  try {
    if (formData._id) {
      await masterDataService.updateTutorialVideo({
        _id: formData._id,
        title: formData.title,
        value: formData.value,
      });
    } else {
      await masterDataService.createTutorialVideo({
        title: formData.title,
        value: formData.value,
      });
    }
    commonDialogRef.value?.onDisplay(false);
    onResetForm();
    dataTableRef.value?.loadItems();
  } catch (error) {
    console.log("Lỗi khi lưu video hướng dẫn!", error);
  } finally {
    loading.value = "";
  }
};

const onAction = async (event: any) => {
  if (event.action === "add") {
    onResetForm();
    commonDialogRef.value?.onDisplay(true);
  } else if (event.action === "update") {
    onResetForm(event.item);
    commonDialogRef.value?.onDisplay(true);
  } else if (event.action === "delete") {
    loading.value = "delete";
    try {
      await masterDataService.deleteTutorialVideo({ _id: event.ids[0] });
      dataTableRef.value?.loadItems();
    } catch (error) {
      console.log("Lỗi khi xóa video hướng dẫn!", error);
    } finally {
      loading.value = "";
    }
  }
};

async function onToggleStatus(item: any) {
  loading.value = `status-${item._id}`;
  try {
    await masterDataService.updateTutorialVideo({
      _id: item._id,
      status: item.status?.code === "active" ? "inactive" : "active",
    });
    dataTableRef.value?.loadItems();
  } catch (error) {
    console.log("Lỗi khi đổi trạng thái video hướng dẫn!", error);
  } finally {
    loading.value = "";
  }
}

definePageMeta({ layout: "admin", title: "Video hướng dẫn" });
</script>

<template>
  <CommonDialog
    ref="commonDialogRef"
    :title="formData._id ? 'Cập nhật video hướng dẫn' : 'Thêm video hướng dẫn'"
    width="500"
  >
    <div class="mt-2">
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="formData.title"
            variant="outlined"
            label="Tiêu đề video (✳)"
            placeholder="Ví dụ: Cách viết prompt hiệu quả"
            hide-details
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="formData.value"
            variant="outlined"
            label="ID video YouTube (✳)"
            placeholder="Ví dụ: v8OvU85tDLY"
            hide-details
          />
        </v-col>

        <v-col cols="12">
          <div class="text-caption text-medium-emphasis">
            ID video YouTube là đoạn ký tự sau "v=" hoặc sau "youtu.be/" trong
            link video (ví dụ link "https://youtu.be/v8OvU85tDLY" thì ID là
            "v8OvU85tDLY").
          </div>
        </v-col>
      </v-row>
    </div>

    <template #footer>
      <div class="d-flex ga-3">
        <v-btn
          text="Hủy bỏ"
          class="flex-1"
          variant="tonal"
          color="primary"
          style="height: 48px"
          @click="commonDialogRef?.onDisplay(false)"
        />

        <v-btn
          :text="formData._id ? 'Cập nhật' : 'Thêm mới'"
          class="flex-1"
          variant="flat"
          color="primary"
          style="height: 48px"
          :disabled="!formData.title || !formData.value"
          :loading="loading === 'submit-form'"
          @click="onSubmitForm"
        />
      </div>
    </template>
  </CommonDialog>

  <DataTable
    ref="dataTableRef"
    :filters="[]"
    :showSelect="false"
    :actions="['add']"
    :rowActions="['update', 'delete']"
    :headers="headers"
    :data="data"
    :loading="Boolean(loading == 'load-table')"
    @change="loadItems"
    @action="onAction"
  >
    <template #row-title="{ item }">
      <div class="py-2" style="max-width: 320px; white-space: normal">
        {{ (item as any).title }}
      </div>
    </template>

    <template #row-value="{ item }">
      <div class="d-flex justify-center">
        <v-img
          :src="`https://img.youtube.com/vi/${(item as any).value}/mqdefault.jpg`"
          :aspect-ratio="16 / 9"
          cover
          rounded
          class="my-2"
          style="width: 100px; max-width: 100px; flex: none"
        />
      </div>
    </template>

    <template #row-status="{ item }">
      <v-chip
        :color="(item as any).status?.color"
        style="cursor: pointer"
        :loading="loading === `status-${(item as any)._id}`"
        @click="onToggleStatus(item)"
      >
        {{
          (item as any).status?.code === "active" ? "Hoạt động" : "Tạm ngưng"
        }}
      </v-chip>
    </template>
  </DataTable>
</template>

<style scoped>
/* max-width trên td/th thường bị trình duyệt bỏ qua khi table-layout: auto
   (mặc định) — dùng width: 0 để buộc cột co khít theo đúng nội dung bên
   trong (div đã giới hạn max-width: 320px ở template), không bị dư khoảng trống. */
:deep(th:nth-child(1)),
:deep(td:nth-child(1)) {
  width: 0;
}

</style>
