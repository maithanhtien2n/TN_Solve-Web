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
const newRevenuePassword = ref<string>("");
const newZaloGroupLink = ref<string>("");
const newVideoTutorialId = ref<string>("");
const newDefaultTemplatePrice = ref<string>("");

async function onSaveRevenuePassword(item: any) {
  if (!newRevenuePassword.value) return;

  loading.value = `revenue-password-${item._id}`;
  try {
    await masterDataService.settingAction({
      _id: item._id,
      value: newRevenuePassword.value,
    });
    newRevenuePassword.value = "";
    dataTableRef.value?.loadItems();
  } catch (error) {
    console.log("Lỗi khi đổi mật khẩu!", error);
  } finally {
    loading.value = "";
  }
}

async function onSaveZaloGroupLink(item: any) {
  if (!newZaloGroupLink.value) return;

  loading.value = `zalo-group-link-${item._id}`;
  try {
    await masterDataService.settingAction({
      _id: item._id,
      value: newZaloGroupLink.value,
    });
    newZaloGroupLink.value = "";
    dataTableRef.value?.loadItems();
  } catch (error) {
    console.log("Lỗi khi đổi link nhóm Zalo!", error);
  } finally {
    loading.value = "";
  }
}

async function onSaveVideoTutorialId(item: any) {
  if (!newVideoTutorialId.value) return;

  loading.value = `video-tutorial-${item._id}`;
  try {
    await masterDataService.settingAction({
      _id: item._id,
      value: newVideoTutorialId.value,
    });
    newVideoTutorialId.value = "";
    dataTableRef.value?.loadItems();
  } catch (error) {
    console.log("Lỗi khi đổi video hướng dẫn!", error);
  } finally {
    loading.value = "";
  }
}

async function onSaveDefaultTemplatePrice(item: any) {
  if (!newDefaultTemplatePrice.value) return;

  loading.value = `default-template-price-${item._id}`;
  try {
    await masterDataService.settingAction({
      _id: item._id,
      value: newDefaultTemplatePrice.value,
    });
    newDefaultTemplatePrice.value = "";
    dataTableRef.value?.loadItems();
  } catch (error) {
    console.log("Lỗi khi đổi giá tạo video mặc định!", error);
  } finally {
    loading.value = "";
  }
}

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

async function onFileDelete(item: any) {
  loading.value = `delete-${item._id}`;
  try {
    await masterDataService.deleteSettingFile({ _id: item._id });
    dataTableRef.value?.loadItems();
  } catch (error) {
    console.log("Lỗi khi xóa file!", error);
  } finally {
    loading.value = "";
  }
}

function triggerFileInput(id: string) {
  const input = document.getElementById(`file-input-${id}`) as HTMLInputElement;
  input?.click();
}

async function onFileUpload(event: Event, item: any) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  loading.value = `upload-${item._id}`;
  try {
    await masterDataService.settingFileAction({ _id: item._id, file });
    dataTableRef.value?.loadItems();
  } catch (error) {
    console.log("Lỗi khi tải tệp!", error);
  } finally {
    loading.value = "";
    input.value = "";
  }
}

const onClickAction = async (data?: any | null, action?: string) => {
  try {
    switch (action) {
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
      <template v-if="(item as any).title === 'Tạo thước phim ở website'">
        <span v-if="(item as any).value" class="text-green text-nowrap">
          Cho phép
        </span>

        <span v-else class="text-red text-nowrap">Không cho phép</span>
      </template>

      <template v-else-if="(item as any).title === 'Tạo thước phim ở website (key riêng)'">
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

      <template v-else-if="(item as any).title === 'Cho phép hoàn tiền'">
        <span v-if="(item as any).value" class="text-green text-nowrap">
          Cho phép
        </span>

        <span v-else class="text-red text-nowrap">Không cho phép</span>
      </template>

      <template v-else-if="(item as any).title === 'Hiển thị trang Cửa hàng'">
        <span v-if="(item as any).value" class="text-green text-nowrap">
          Cho phép
        </span>

        <span v-else class="text-red text-nowrap">Không cho phép</span>
      </template>

      <template
        v-else-if="(item as any).title === 'Mật khẩu xem doanh thu công khai'"
      >
        <span class="text-nowrap text-medium-emphasis">•••••••• (đã mã hóa)</span>
      </template>

      <template v-else-if="(item as any).title === 'Link nhóm Zalo'">
        <span v-if="(item as any).value" class="text-nowrap">
          {{ (item as any).value }}
        </span>
        <span v-else class="text-nowrap text-medium-emphasis">
          https://zalo.me/g/p8hls5tonlfkqmyfndmx (mặc định)
        </span>
      </template>

      <template
        v-else-if="(item as any).title === 'Video hướng dẫn (ID YouTube)'"
      >
        <span v-if="(item as any).value" class="text-nowrap">
          {{ (item as any).value }}
        </span>
        <span v-else class="text-nowrap text-medium-emphasis">
          v8OvU85tDLY (mặc định)
        </span>
      </template>

      <template
        v-else-if="(item as any).title === 'Giá tạo video mặc định (Cửa hàng)'"
      >
        <span v-if="(item as any).value" class="text-nowrap">
          {{ Number((item as any).value).toLocaleString("vi-VN") }}đ
        </span>
        <span v-else class="text-nowrap text-medium-emphasis">
          500đ (mặc định)
        </span>
      </template>

      <template v-else-if="(item as any).title === 'Mô hình ưu tiên'">
        <span
          v-if="(item as any).value === 'veo3_fast'"
          class="text-nowrap"
        >
          🥈 TNS - 8s / 10💎
        </span>
      </template>

      <template v-else-if="(item as any).title === 'Mô hình tạo ảnh'">
        <span v-if="(item as any).value" class="text-nowrap">
          {{ (item as any).value }}
        </span>
        <span v-else class="text-nowrap text-medium-emphasis">
          nano_banana_2_lite (mặc định)
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
        v-else-if="(item as any).title === 'Điều kiện mở kiếm tiền'"
      >
        <span class="text-nowrap">{{ (item as any).value }} người</span>
      </template>

      <template v-else>
        <a
          v-if="(item as any).value?.startsWith('http')"
          :href="(item as any).value"
          target="_blank"
        >
          {{ (item as any).value.split('/').pop().replace(/^\d+-/, '') }}
        </a>
        <span v-else>{{ (item as any).value }}</span>
      </template>
    </template>

    <template #row-action="{ item }">
      <div class="d-flex justify-center">
        <template
          v-if="(item as any).title === 'Tạo thước phim ở website'"
        >
          <v-checkbox
            readonly
            hide-details
            class="my-1"
            :model-value="Boolean((item as any).value)"
            @click="onClickAction(item)"
          />
        </template>

        <template
          v-else-if="(item as any).title === 'Tạo thước phim ở website (key riêng)'"
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

        <template v-else-if="(item as any).title === 'Cho phép hoàn tiền'">
          <v-checkbox
            readonly
            hide-details
            class="my-1"
            :model-value="Boolean((item as any).value)"
            @click="onClickAction(item)"
          />
        </template>

        <template v-else-if="(item as any).title === 'Hiển thị trang Cửa hàng'">
          <v-checkbox
            readonly
            hide-details
            class="my-1"
            :model-value="Boolean((item as any).value)"
            @click="onClickAction(item)"
          />
        </template>

        <template
          v-else-if="(item as any).title === 'Mật khẩu xem doanh thu công khai'"
        >
          <div class="d-flex align-center ga-2 my-2 w-10rem">
            <v-text-field
              v-model="newRevenuePassword"
              type="password"
              density="compact"
              variant="outlined"
              hide-details
              class="flex-grow-1"
              placeholder="Mật khẩu mới"
              @keyup.enter="onSaveRevenuePassword(item)"
            />
            <v-btn
              variant="tonal"
              color="primary"
              height="36"
              rounded="lg"
              :disabled="!newRevenuePassword"
              :loading="loading === `revenue-password-${(item as any)._id}`"
              icon="mdi-content-save-outline"
              @click="onSaveRevenuePassword(item)"
            />
          </div>
        </template>

        <template v-else-if="(item as any).title === 'Link nhóm Zalo'">
          <div class="d-flex align-center ga-2 my-2 w-10rem">
            <v-text-field
              v-model="newZaloGroupLink"
              density="compact"
              variant="outlined"
              hide-details
              class="flex-grow-1"
              :placeholder="(item as any).value || 'https://zalo.me/g/...'"
              @keyup.enter="onSaveZaloGroupLink(item)"
            />
            <v-btn
              variant="tonal"
              color="primary"
              height="36"
              rounded="lg"
              :disabled="!newZaloGroupLink"
              :loading="loading === `zalo-group-link-${(item as any)._id}`"
              icon="mdi-content-save-outline"
              @click="onSaveZaloGroupLink(item)"
            />
          </div>
        </template>

        <template
          v-else-if="(item as any).title === 'Video hướng dẫn (ID YouTube)'"
        >
          <div class="d-flex align-center ga-2 my-2 w-10rem">
            <v-text-field
              v-model="newVideoTutorialId"
              density="compact"
              variant="outlined"
              hide-details
              class="flex-grow-1"
              :placeholder="(item as any).value || 'v8OvU85tDLY'"
              @keyup.enter="onSaveVideoTutorialId(item)"
            />
            <v-btn
              variant="tonal"
              color="primary"
              height="36"
              rounded="lg"
              :disabled="!newVideoTutorialId"
              :loading="loading === `video-tutorial-${(item as any)._id}`"
              icon="mdi-content-save-outline"
              @click="onSaveVideoTutorialId(item)"
            />
          </div>
        </template>

        <template
          v-else-if="(item as any).title === 'Giá tạo video mặc định (Cửa hàng)'"
        >
          <div class="d-flex align-center ga-2 my-2 w-10rem">
            <v-text-field
              v-model="newDefaultTemplatePrice"
              type="number"
              density="compact"
              variant="outlined"
              hide-details
              class="flex-grow-1"
              :placeholder="(item as any).value || '500'"
              @keyup.enter="onSaveDefaultTemplatePrice(item)"
            />
            <v-btn
              variant="tonal"
              color="primary"
              height="36"
              rounded="lg"
              :disabled="!newDefaultTemplatePrice"
              :loading="loading === `default-template-price-${(item as any)._id}`"
              icon="mdi-content-save-outline"
              @click="onSaveDefaultTemplatePrice(item)"
            />
          </div>
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
                { title: '🥈 TNS - 8s / 10💎', value: 'veo3_fast' },
              ]"
              @update:model-value="onClickAction(item)"
            />
          </div>
        </template>

        <template v-else-if="(item as any).title === 'Mô hình tạo ảnh'">
          <div>
            <v-select
              v-model="(item as any).value"
              hide-details
              density="compact"
              variant="outlined"
              class="my-4 w-10rem"
              :items="[
                { title: 'nano_banana_pro', value: 'nano_banana_pro' },
                { title: 'nano_banana_2', value: 'nano_banana_2' },
                { title: 'nano_banana_2_lite', value: 'nano_banana_2_lite' },
              ]"
              @update:model-value="onClickAction(item)"
            />
          </div>
        </template>

        <template v-else-if="(item as any).title.includes('Số lượng slot')">
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
          v-else-if="(item as any).title === 'Điều kiện mở kiếm tiền'"
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

        <template v-else>
          <div class="my-4 d-flex align-center w-10rem" style="gap: 10px;">
            <input
              :id="`file-input-${(item as any)._id}`"
              type="file"
              class="d-none"
              @change="(e: Event) => onFileUpload(e, item)"
            />
            <v-btn
              variant="tonal"
              color="primary"
              height="36"
              rounded="lg"
              :loading="loading === `upload-${(item as any)._id}`"
              class="flex-grow-1"
              icon="mdi-upload"
              @click="triggerFileInput((item as any)._id)"
            />
            <v-btn
              v-if="(item as any).value?.startsWith('http')"
              variant="tonal"
              color="error"
              height="36"
              rounded="lg"
              :loading="loading === `delete-${(item as any)._id}`"
              class="flex-grow-1"
              icon="mdi-trash-can-outline"
              @click="onFileDelete(item)"
            />
          </div>
        </template>
      </div>
    </template>
  </DataTable>
</template>
