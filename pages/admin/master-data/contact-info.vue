<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { masterDataService } from "~/services/app";

const headers = [
  { title: "Tiêu đề", key: "title", sortable: false },
  { title: "Đường dẫn", key: "value", sortable: false },
  { title: "Cập nhật", key: "updatedAt", sortable: false },
  { title: "Trạng thái", key: "status", align: "center", sortable: false },
  { title: "Thao tác", key: "action", align: "center", sortable: false },
];

const data = ref<any>({});
const loading = ref<string>("");
const dataTableRef = ref<any>(null);
const commonDialogRef = ref<any>(null);

const { handleSubmit, resetForm } = useForm({
  initialValues: {
    _id: null,
    title: "",
    value: "",
  },
  validationSchema: {
    title(value: any) {
      if (!value) return "Vui lòng nhập tiêu đề";
      return true;
    },
    value(value: any) {
      if (!value) return "Vui lòng nhập đường dẫn";
      return true;
    },
  },
});

const _id = useField("_id");
const title = useField("title");
const link = useField("value");

function onResetForm(item?: any) {
  resetForm({
    values: {
      _id: item?._id || null,
      title: item?.title || "",
      value: item?.value || "",
    },
  });
}

async function loadItems(event: any) {
  loading.value = "load-table";
  try {
    const res = await masterDataService.getContactInfoAdmin({
      search: event?.search,
      page: event?.page,
      limit: event?.limit,
    });
    data.value = {
      docs: res.data?.docs || [],
      totalDocs: res.data?.totalDocs || 0,
    };
  } catch (error) {
    console.log("Lỗi khi tải danh sách thông tin liên hệ!", error);
  } finally {
    loading.value = "";
  }
}

const onSubmitForm = handleSubmit(async (values: any) => {
  if (loading.value === "submit-form") return;
  loading.value = "submit-form";
  try {
    if (values._id) {
      await masterDataService.updateContactInfo({
        _id: values._id,
        title: values.title,
        value: values.value,
      });
    } else {
      await masterDataService.createContactInfo({
        title: values.title,
        value: values.value,
      });
    }
    commonDialogRef.value?.onDisplay(false);
    onResetForm();
    dataTableRef.value?.loadItems();
  } catch (error) {
    console.log("Lỗi khi lưu thông tin liên hệ!", error);
  } finally {
    loading.value = "";
  }
});

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
      await masterDataService.deleteContactInfo({ _id: event.ids[0] });
      dataTableRef.value?.loadItems();
    } catch (error) {
      console.log("Lỗi khi xóa thông tin liên hệ!", error);
    } finally {
      loading.value = "";
    }
  }
};

async function onToggleStatus(item: any) {
  loading.value = `status-${item._id}`;
  try {
    await masterDataService.updateContactInfo({
      _id: item._id,
      status: item.status?.code === "active" ? "inactive" : "active",
    });
    dataTableRef.value?.loadItems();
  } catch (error) {
    console.log("Lỗi khi đổi trạng thái thông tin liên hệ!", error);
  } finally {
    loading.value = "";
  }
}

definePageMeta({ layout: "admin", title: "Nhóm hỗ trợ" });
</script>

<template>
  <CommonDialog
    ref="commonDialogRef"
    :title="_id.value.value ? 'Cập nhật thông tin liên hệ' : 'Thêm thông tin liên hệ'"
    width="500"
  >
    <div class="mt-2">
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="title.value.value"
            variant="outlined"
            label="Tiêu đề (✳)"
            placeholder="Ví dụ: Zalo hỗ trợ, Fanpage Facebook..."
            :error-messages="title.errorMessage.value"
            :hide-details="Boolean(!title.errorMessage.value)"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="link.value.value"
            variant="outlined"
            label="Đường dẫn (✳)"
            placeholder="Ví dụ: https://zalo.me/..."
            :error-messages="link.errorMessage.value"
            :hide-details="Boolean(!link.errorMessage.value)"
          />
        </v-col>
      </v-row>
    </div>

    <template #footer>
      <div
        class="cta-button w-100 justify-center"
        :class="{ disabled: loading === 'submit-form' }"
        style="border-radius: 6px"
        @click="onSubmitForm"
      >
        <v-progress-circular
          v-if="loading === 'submit-form'"
          width="2"
          size="23"
          color="white"
          indeterminate
        />

        <v-icon v-else size="27">mdi-card-account-phone-outline</v-icon>
        <h3>{{ _id.value.value ? "Cập nhật" : "Thêm mới" }}</h3>
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
      <a
        :href="(item as any).value"
        target="_blank"
        rel="noopener"
        class="contact-link"
      >
        {{ (item as any).value }}
      </a>
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
.contact-link {
  color: #1e88e5;
  text-decoration: none;
  word-break: break-all;
}
.contact-link:hover {
  text-decoration: underline;
}
</style>
