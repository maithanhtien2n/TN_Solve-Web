<script setup lang="ts">
import { productService } from "~/services/app";

import ConfirmDialog from "~/components/ConfirmDialog.vue";

const route = useRoute();

const { t } = useI18n();

const { onGetterMasterData } = useMasterDataStore();

const headers = [
  { title: "Tiêu đề", key: "title", sortable: false },
  { title: "Mô hình", key: "modelVideoTitle", sortable: false },
  { title: "Tỷ lệ khung hình", key: "frameRateTitle", sortable: false },
  { title: "Chế độ", key: "videoModeTitle", sortable: false },
  { title: "Phong cách", key: "videoStyleTitle", sortable: false },
  {
    title: "Thời lượng",
    key: "videoDurationTitle",
    align: "center",
    sortable: false,
  },
  { title: "Tác giả", key: "account.name", sortable: false },
  { title: "Cập nhật", key: "updatedAt", sortable: false },
  { title: "Trạng thái", key: "status", align: "center", sortable: false },
  { title: "Thao tác", key: "action", align: "center", sortable: false },
];

const data = ref<any>({});
const loading = ref<string>("");
const dataTableRef = ref<any>(null);
const confirmDialogRef = ref<any>(null);

const params = reactive<any>({
  modelVideo: null,
  frameRate: null,
  videoMode: null,
  videoStyle: null,
  videoDuration: null,
  status: null,
});

const modelVideoItems = computed(() => [
  { title: "Tất cả", value: null },
  ...(onGetterMasterData.value["model-video"] || []),
]);

const frameRateItems = computed(
  () =>
    [
      { title: "Tất cả", value: null },
      ...onGetterMasterData.value["frame-rate"],
    ]?.map((x: any) => ({
      title: t(x.title),
      value: x.value,
    })) || []
);

const videoModeItems = computed(
  () =>
    [
      { title: "Tất cả", value: null },
      ...onGetterMasterData.value["video-mode"],
    ]?.map((x: any) => ({
      title: t(x.title),
      value: x.value,
    })) || []
);

const videoStyleItems = computed(() => {
  const list =
    [
      { title: "Tất cả", value: null },
      ...onGetterMasterData.value["video-style"],
    ]?.map((x: any) => ({
      title: t(x.title),
      value: x.value,
    })) || [];

  switch (params.videoMode) {
    case "movie": {
      return list.filter((x: any) =>
        [null, "general", "monologue", "narration"].includes(x.value)
      );
    }
    case "storytelling": {
      return list.filter((x: any) => [null, "general"].includes(x.value));
    }
    case "short_form_video": {
      return list.filter((x: any) =>
        [null, "general", "satisfying", "asmr"].includes(x.value)
      );
    }
    case "my_subject": {
      return list.filter((x: any) =>
        [null, "general", "testimonial"].includes(x.value)
      );
    }
    default: {
      return list;
    }
  }
});

const videoDurationItems = computed(() => {
  const allOptions =
    [
      { title: "Tất cả", value: null },
      ...onGetterMasterData.value["video-duration"],
    ] || [];

  if (params.videoMode === "movie") {
    return allOptions;
  } else if (["short_form_video", "my_subject"].includes(params.videoMode)) {
    // Nếu là video ngắn, chỉ lấy các giá trị từ '1' đến '7'
    const shortVideoValues = [null, "1", "2", "3", "4", "5", "6", "7"];
    return allOptions.filter((option: any) =>
      shortVideoValues.includes(option.value)
    );
  } else if (["storytelling"].includes(params.videoMode)) {
    const shortVideoValues = [null, "8", "12", "16", "20", "24"];
    return allOptions.filter((option: any) =>
      shortVideoValues.includes(option.value)
    );
  } else {
    return allOptions;
  }
});

const statusItems = computed(() =>
  statusOptions
    .filter((x: any) => x.value !== "all")
    ?.map((x: any) => ({ ...x, title: t(x.title) }))
);

async function loadItems(event: any) {
  const params = {
    ...event,
    state: route.path?.split("/")?.pop() || "in-progress",
  };

  loading.value = "load-table";
  await productService
    .getAllProduct(params)
    .then((res) => {
      if (res.data) data.value = res.data;
    })
    .finally(() => {
      loading.value = "";
    });
}

const onClickRestartVideo = async (item: any) => {
  if (!item || !item._id) return;

  await productService.saveProduct(item);
  await dataTableRef.value?.loadItems();

  // confirmDialogRef.value.show({
  //   message: "Bạn có chắc muốn tạo lại video này?",
  //   noTransMsg: true,
  //   onConfirm: async () => {
  //     await productService.saveProduct(item);
  //     await dataTableRef.value?.loadItems();
  //   },
  // });
};

const onAction = async (event: any) => {
  if (event.action == "reload") {
    onClickRestartVideo(event.item);
  } else if (event.action == "view") {
    if (event?.item?.link) {
      window.open(event?.item?.link, "_blank");
    } else {
      useAppStore().onActionSetSystemPopup({
        type: "error",
        content: "Thước phim không tồn tại!",
      });
    }
  }
};

const onChangeFilter = (event: any) => {
  params[event.field] = event.value;
};
</script>

<template>
  <ConfirmDialog ref="confirmDialogRef" />

  <DataTable
    ref="dataTableRef"
    :filters="[
      {
        label: 'Mô hình',
        field: 'modelVideo',
        type: 'select',
        items: modelVideoItems,
      },
      {
        label: 'Tỷ lệ khung hình',
        field: 'frameRate',
        type: 'select',
        items: frameRateItems,
      },
      {
        label: 'Chế độ',
        field: 'videoMode',
        type: 'select',
        items: videoModeItems,
      },
      {
        label: 'Phong cách',
        field: 'videoStyle',
        type: 'select',
        items: videoStyleItems,
      },
      {
        label: 'Thời lượng',
        field: 'videoDuration',
        type: 'select',
        items: videoDurationItems,
      },
      {
        label: 'Trạng thái',
        field: 'status',
        type: 'select',
        items: statusItems,
      },
    ]"
    :showSelect="false"
    :actions="[]"
    :rowActions="
      route.path?.split('/')?.pop() === 'error' ? ['reload', 'view'] : ['view']
    "
    :headers="headers"
    :data="data"
    :loading="Boolean(loading == 'load-table')"
    @change="loadItems"
    @action="onAction"
    @change-filter="onChangeFilter"
  >
    <template #row-title="{ item }">
      <div class="d-flex flex-column ga-1 py-4">
        <span style="min-width: 14rem">
          {{ `${(item as any)?.client ? "💻" : "🌐"} ${(item as any).title}` }}
        </span>

        <div
          v-if="(item as any).state === 'primary'"
          class="text-primary"
          style="border-radius: 1rem"
        >
          <div class="text-caption">
            {{ (item as any)?.lastMessage?.title }}
          </div>
          <div v-if="(item as any)?.lastMessage?.note" class="text-caption">
            {{ (item as any)?.lastMessage?.note }}
          </div>
        </div>

        <div
          v-else-if="(item as any).state === 'error'"
          class="text-red"
          style="border-radius: 1rem"
        >
          <div v-if="(item as any)?.lastMessage?.note" class="text-caption">
            {{ (item as any)?.lastMessage?.note }}
          </div>

          <div v-if="(item as any)?.lastMessage?.errorMsg" class="text-caption">
            {{ (item as any)?.lastMessage?.errorMsg }}
          </div>
        </div>

        <div
          v-else-if="(item as any).state === 'success'"
          class="text-success"
          style="border-radius: 1rem"
        >
          <div v-if="(item as any)?.lastMessage?.note" class="text-caption">
            {{ (item as any)?.lastMessage?.note }}
          </div>
        </div>

        <div
          v-if="(item as any).isDelete"
          class="text-red d-flex align-center ga-1"
        >
          <v-icon size="20">mdi-delete-outline</v-icon>
          <span style="font-size: 0.8rem">Khách hàng đã xóa video này</span>
        </div>
      </div>
    </template>

    <template #row-account.name="{ item }">
      <span class="text-nowrap line-clamp-1" style="max-width: 170px">
        {{ `${(item as any)?.account?.name}` }}
      </span>
    </template>
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
