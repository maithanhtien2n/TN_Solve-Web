<script setup lang="ts">
import { masterDataService } from "~/services/app";

const headers = [
  { title: "Tên cài đặt", key: "title", sortable: false },
  { title: "Giá trị", key: "value", sortable: false },
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

const onClickAction = async (data?: any | null, action?: string) => {
  try {
    switch (action) {
      case "update_account": {
        await fetch(
          `${
            import.meta.env.VITE_API_URL === "http://localhost:3000"
              ? "http://localhost:3000/api/common/update-storage-state?secret=d98aeba92127b1cc2f7adfbe04dee7395fbebe84ec9052744b87ed5fa6a3bccc"
              : "https://api.tnsolve.com/api/common/update-storage-state?secret=d98aeba92127b1cc2f7adfbe04dee7395fbebe84ec9052744b87ed5fa6a3bccc"
          }`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );

        break;
      }

      default: {
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

      <template v-else-if="(item as any).title === 'Mô hình ưu tiên'">
        <span v-if="(item as any).value === 'grok'" class="text-nowrap">
          🥉 TNS - 6s / 5💎
        </span>

        <span
          v-else-if="(item as any).value === 'veo3_fast'"
          class="text-nowrap"
        >
          🥈 TNS - 8s / 10💎
        </span>
      </template>

      <template v-else-if="(item as any).title === 'Chế độ tạo bối cảnh'">
        <span v-if="(item as any).value === 'api'" class="text-nowrap">
          API
        </span>

        <span v-else-if="(item as any).value === 'browser'" class="text-nowrap">
          Trình duyệt
        </span>
      </template>

      <template
        v-else-if="
          (item as any).title === 'Thời gian khởi động lại trình duyệt'
        "
      >
        <span class="text-nowrap">Sau {{ (item as any).value }} phút</span>
      </template>

      <template
        v-else-if="(item as any).title === 'Số lượt tạo cùng lúc trên website'"
      >
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
              @click="onClickAction(item, 'update_account')"
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
            @click="onClickAction(item)"
          />
        </template>

        <template v-else-if="(item as any).title === 'Hiển thị trình duyệt'">
          <v-checkbox
            readonly
            hide-details
            class="my-1"
            :model-value="Boolean((item as any).value)"
            @click="onClickAction(item)"
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
            @click="onClickAction(item)"
          />
        </template>

        <template v-else-if="(item as any).title === 'Mô hình ưu tiên'">
          <div>
            <v-select
              v-model="(item as any).value"
              hide-details
              density="compact"
              variant="outlined"
              class="my-4 w-10rem"
              :items="[
                { title: '🥉 TNS - 6s / 5💎', value: 'grok' },
                { title: '🥈 TNS - 8s / 10💎', value: 'veo3_fast' },
              ]"
              @update:model-value="onClickAction(item)"
            />
          </div>
        </template>

        <template
          v-else-if="(item as any).title === 'Số lượng slot trên mỗi worker'"
        >
          <div>
            <v-select
              v-model="(item as any).value"
              hide-details
              density="compact"
              variant="outlined"
              class="my-4 w-10rem"
              :items="[
                { title: '1', value: '1' },
                { title: '2', value: '2' },
                { title: '3', value: '3' },
                { title: '4', value: '4' },
                { title: '5', value: '5' },
                { title: '6', value: '6' },
                { title: '7', value: '7' },
                { title: '8', value: '8' },
                { title: '9', value: '9' },
                { title: '10', value: '10' },
              ]"
              @update:model-value="onClickAction(item)"
            />
          </div>
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
              @update:model-value="onClickAction(item)"
            />
          </div>
        </template>

        <template
          v-else-if="
            (item as any).title === 'Thời gian khởi động lại trình duyệt'
          "
        >
          <div>
            <v-select
              v-model="(item as any).value"
              hide-details
              density="compact"
              variant="outlined"
              class="my-4 w-10rem"
              :items="[
                { title: 'Sau 10 phút', value: '10' },
                { title: 'Sau 20 phút', value: '20' },
                { title: 'Sau 30 phút', value: '30' },
                { title: 'Sau 40 phút', value: '40' },
                { title: 'Sau 50 phút', value: '50' },
                { title: 'Sau 60 phút', value: '60' },
              ]"
              @update:model-value="onClickAction(item)"
            />
          </div>
        </template>

        <template
          v-else-if="
            (item as any).title === 'Số lượt tạo cùng lúc trên website'
          "
        >
          <div>
            <v-select
              v-model="(item as any).value"
              hide-details
              density="compact"
              variant="outlined"
              class="my-4 w-10rem"
              :items="[
                { title: '1', value: '1' },
                { title: '2', value: '2' },
                { title: '3', value: '3' },
                { title: '4', value: '4' },
                { title: '5', value: '5' },
                { title: '6', value: '6' },
                { title: '7', value: '7' },
                { title: '8', value: '8' },
                { title: '9', value: '9' },
                { title: '10', value: '10' },
              ]"
              @update:model-value="onClickAction(item)"
            />
          </div>
        </template>

        <template
          v-else-if="
            (item as any).title === 'Số lượt tạo cùng lúc trên windows'
          "
        >
          <div>
            <v-select
              v-model="(item as any).value"
              hide-details
              density="compact"
              variant="outlined"
              class="my-4 w-10rem"
              :items="[
                { title: '1', value: '1' },
                { title: '2', value: '2' },
                { title: '3', value: '3' },
                { title: '4', value: '4' },
                { title: '5', value: '5' },
                { title: '6', value: '6' },
                { title: '7', value: '7' },
                { title: '8', value: '8' },
                { title: '9', value: '9' },
                { title: '10', value: '10' },
              ]"
              @update:model-value="onClickAction(item)"
            />
          </div>
        </template>

        <template
          v-else-if="
            (item as any).title === 'Số lượng browser khởi động trên máy khách'
          "
        >
          <div>
            <v-select
              v-model="(item as any).value"
              hide-details
              density="compact"
              variant="outlined"
              class="my-4 w-10rem"
              :items="[
                { title: '1', value: '1' },
                { title: '2', value: '2' },
                { title: '3', value: '3' },
                { title: '4', value: '4' },
              ]"
              @update:model-value="onClickAction(item)"
            />
          </div>
        </template>

        <template
          v-else-if="
            (item as any).title === 'Số lượng browser khởi động trên máy admin'
          "
        >
          <div>
            <v-select
              v-model="(item as any).value"
              hide-details
              density="compact"
              variant="outlined"
              class="my-4 w-10rem"
              :items="[
                { title: '1', value: '1' },
                { title: '2', value: '2' },
                { title: '3', value: '3' },
                { title: '4', value: '4' },
                { title: '5', value: '5' },
                { title: '6', value: '6' },
                { title: '7', value: '7' },
                { title: '8', value: '8' },
                { title: '9', value: '9' },
                { title: '10', value: '10' },
                { title: '11', value: '11' },
                { title: '12', value: '12' },
                { title: '13', value: '13' },
                { title: '14', value: '14' },
                { title: '15', value: '15' },
                { title: '16', value: '16' },
                { title: '17', value: '17' },
                { title: '18', value: '18' },
                { title: '19', value: '19' },
                { title: '20', value: '20' },
              ]"
              @update:model-value="onClickAction(item)"
            />
          </div>
        </template>
      </div>
    </template>
  </DataTable>
</template>
