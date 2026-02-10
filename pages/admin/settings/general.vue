<script setup lang="ts">
import { masterDataService } from "~/services/app";

const headers = [
  { title: "Tên cài đặt", key: "title", sortable: false },
  { title: "Trạng thái", key: "value", sortable: false },
  { title: "Cập nhật", key: "updatedAt", sortable: false },
  { title: "Thao tác", align: "center", key: "action", sortable: false },
];

const data = ref<any>({});
const loading = ref<string>("");
const dataTableRef = ref<any>(null);

async function loadItems(event: any) {
  const params = { ...event };

  loading.value = "load-table";
  await masterDataService
    .getSettingGeneral(params)
    .then((res) => {
      if (res.data) data.value = res.data;
    })
    .finally(() => {
      loading.value = "";
    });
}

const onClickAction = async (action: string, data?: any | null) => {
  try {
    switch (action) {
      case "update_account": {
        await fetch(
          `${
            import.meta.env.VITE_API_URL === "http://localhost:3000"
              ? "http://localhost:3000/api/common/update-storage-state?secret=0573725920Tien"
              : "https://api.tnsolve.com/api/common/update-storage-state?secret=0573725920Tien"
          }`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        break;
      }

      case "video_to_website": {
        await masterDataService.settingAction({ _id: data._id });
        break;
      }

      case "show_browser": {
        await masterDataService.settingAction({ _id: data._id });
        break;
      }

      case "delete_profile_when_open_app": {
        await masterDataService.settingAction({ _id: data._id });
        break;
      }

      case "scene_creation_mode": {
        await masterDataService.settingAction({ _id: data._id });
        break;
      }

      case "run_in_browser": {
        await masterDataService.settingAction({
          _id: data._id,
          value: data.value,
        });
        break;
      }
    }

    dataTableRef.value?.loadItems();
  } catch (error) {
    console.log("Đã xảy ra lỗi khi thực hiện cài đặt!", error);
  }
};

definePageMeta({ layout: "admin", title: "Thông tin chung" });
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
      <template v-if="(item as any).title === 'Cập nhật tài khoản'">
        <span v-if="(item as any).value" class="text-blue text-nowrap">
          {{ (item as any).value }}
        </span>

        <span v-else class="text-nowrap">
          Vừa cập nhật xong
          <v-icon size="17" color="green" class="mb-1">mdi-check</v-icon>
        </span>
      </template>

      <template v-else-if="(item as any).title === 'Tạo thước phim ở website'">
        <span v-if="(item as any).value" class="text-green text-nowrap">
          Cho phép
        </span>

        <span v-else class="text-red text-nowrap">Không cho phép</span>
      </template>

      <template v-else-if="(item as any).title === 'Hiển thị trình duyệt'">
        <span v-if="(item as any).value" class="text-green text-nowrap">
          Cho phép
        </span>

        <span v-else class="text-red text-nowrap">Không cho phép</span>
      </template>

      <template v-else-if="(item as any).title === 'Xóa hồ sơ khi mở ứng dụng'">
        <span v-if="(item as any).value" class="text-green text-nowrap">
          Cho phép
        </span>

        <span v-else class="text-red text-nowrap">Không cho phép</span>
      </template>

      <template v-else-if="(item as any).title === 'Chế độ tạo bối cảnh'">
        <span v-if="(item as any).value === 'api'" class="text-nowrap">
          API
        </span>

        <span v-else-if="(item as any).value === 'browser'" class="text-nowrap">
          Trình duyệt
        </span>
      </template>

      <template v-else-if="(item as any).title === 'Chạy trên trình duyệt'">
        <span v-if="(item as any).value === 'auto'" class="text-nowrap">
          Tự động
        </span>

        <span v-else-if="(item as any).value === 'profile'" class="text-nowrap">
          Có hồ sơ
        </span>

        <span
          v-else-if="(item as any).value === 'anonymous'"
          class="text-nowrap"
        >
          Ẩn danh
        </span>
      </template>

      <span v-else>{{ (item as any).value }}</span>
    </template>

    <template #row-action="{ item }">
      <div class="d-flex justify-center">
        <template v-if="(item as any).title === 'Cập nhật tài khoản'">
          <div class="my-3">
            <v-btn
              icon
              size="40"
              variant="text"
              @click="onClickAction('update_account', item)"
            >
              <v-icon size="20">mdi-reload</v-icon>
            </v-btn>
          </div>
        </template>

        <template
          v-else-if="(item as any).title === 'Tạo thước phim ở website'"
        >
          <v-checkbox
            readonly
            hide-details
            class="my-1"
            :model-value="Boolean((item as any).value)"
            @click="onClickAction('video_to_website', item)"
          />
        </template>

        <template v-else-if="(item as any).title === 'Hiển thị trình duyệt'">
          <v-checkbox
            readonly
            hide-details
            class="my-1"
            :model-value="Boolean((item as any).value)"
            @click="onClickAction('show_browser', item)"
          />
        </template>

        <template
          v-else-if="(item as any).title === 'Xóa hồ sơ khi mở ứng dụng'"
        >
          <v-checkbox
            readonly
            hide-details
            class="my-1"
            :model-value="Boolean((item as any).value)"
            @click="onClickAction('delete_profile_when_open_app', item)"
          />
        </template>

        <template v-else-if="(item as any).title === 'Chế độ tạo bối cảnh'">
          <div>
            <v-select
              v-model="(item as any).value"
              hide-details
              density="compact"
              variant="outlined"
              class="my-4 w-10rem"
              :items="[
                { title: 'API', value: 'api' },
                { title: 'Trình duyệt', value: 'browser' },
              ]"
              @update:model-value="onClickAction('scene_creation_mode', item)"
            />
          </div>
        </template>

        <template v-else-if="(item as any).title === 'Chạy trên trình duyệt'">
          <div>
            <v-select
              v-model="(item as any).value"
              hide-details
              density="compact"
              variant="outlined"
              class="my-4 w-10rem"
              :items="[
                { title: 'Tự động', value: 'auto' },
                { title: 'Có hồ sơ', value: 'profile' },
                { title: 'Ẩn danh', value: 'anonymous' },
              ]"
              @update:model-value="onClickAction('run_in_browser', item)"
            />
          </div>
        </template>
      </div>
    </template>
  </DataTable>
</template>
