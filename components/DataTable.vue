<script setup lang="ts">
const appStore = useAppStore();

const { t } = useI18n();
const { isMobile } = useDevice();

const props = defineProps({
  filters: { type: Array as any, default: () => [] },
  actions: {
    type: Array as any,
    default: () => ["add", "active", "inactive", "delete"],
  },
  rowActions: {
    type: Array as any,
    default: () => ["update", "delete"],
  },
  headers: { type: Array as any, default: () => [] },
  data: {
    type: Object as any,
    default: () => ({ docs: [], page: 1, limit: 20, totalDocs: 0 }),
  },
  loading: { type: Boolean, default: false },
  showSelect: { type: Boolean, default: false },
  hideSearch: { type: Boolean, default: false },
});

const emits = defineEmits(["change", "action", "change-filter"]);

const display = ref(false);
const selected = ref<any[]>([]);
const confirmDialogRef = ref<any>(null);

const params = reactive<any>({
  search: "",
  page: 1,
  limit: 20,
});

const dataHeaders = computed(() =>
  Array.isArray(props.headers) && props.headers?.length
    ? props.headers.map((h: any) => ({
        ...h,
        title: t(h.title),
      }))
    : []
);

// Trường hợp key = user.profile
function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj) || "---";
}

function setDefault() {
  props.filters.forEach((filter: any) => {
    if (filter.type === "select" && filter.items?.length) {
      if (!params[filter.field])
        params[filter.field] = filter.items[0][filter.itemValue || "value"];
    } else if (filter.type === "text") {
      if (!params[filter.field]) params[filter.field] = "";
    }
  });
}

function resetSelected() {
  selected.value = [];
}

function loadItems() {
  resetSelected();
  emits("change", params);
}

function search(type: string = "filter") {
  if (type == "search" && !params.search) return;

  params.page = 1;
  loadItems();
  display.value = false;
}

const onConfirmAction = (action: string, item?: any | null) => {
  if (!item?._id && !selected.value?.length) {
    appStore.onActionSetSystemPopup({
      type: "error",
      content: "Vui lòng chọn ít nhất một dữ liệu để thực hiện thao tác này.",
    });

    return;
  }

  const items: any = props.data?.docs.filter((item: any) =>
    selected.value.includes(item?._id)
  );

  if (
    action === EnumStatus.ACTIVE &&
    items.some(
      (item: any) => ![EnumStatus.INACTIVE].includes(item.status?.code)
    )
  ) {
    appStore.onActionSetSystemPopup({
      type: "error",
      content: `Vui lòng chỉ chọn những dữ liệu có trạng thái: Dự thảo, Tạm dừng.`,
    });

    return;
  }

  if (
    action === EnumStatus.INACTIVE &&
    items.some((item: any) => ![EnumStatus.ACTIVE].includes(item.status?.code))
  ) {
    appStore.onActionSetSystemPopup({
      type: "error",
      content: `Vui lòng chỉ chọn những dữ liệu có trạng thái: Hoạt động.`,
    });

    return;
  }

  let message: string = "";
  const amount = selected.value?.length || 0;

  switch (action) {
    case "active":
      message = t("Bạn có chắc chắn muốn kích hoạt {amount} dữ liệu?", {
        amount,
      });
      break;
    case "inactive":
      message = t("Bạn có chắc chắn muốn tạm dừng {amount} dữ liệu?", {
        amount,
      });
      break;
    case "delete":
      message = t("Bạn có chắc chắn muốn xóa {amount} dữ liệu?", { amount });
      break;
    default:
      break;
  }

  confirmDialogRef.value.show({
    message,
    noTransMsg: true,
    onConfirm: async () => {
      emits("action", {
        action,
        ids: item?._id ? [item._id] : selected.value,
      });
    },
  });
};

watch(
  () => props.filters,
  () => {
    setDefault();
  },
  { immediate: true }
);

watch(
  () => params.search,
  () => {
    if (!params.search) emits("change", params);
  }
);

onMounted(() => {
  setDefault();
});

defineExpose({ params, selected, loadItems, resetSelected });
</script>

<template>
  <ConfirmDialog ref="confirmDialogRef" />

  <v-navigation-drawer
    temporary
    v-model="display"
    :width="!isMobile ? 330 : '560'"
    :location="!isMobile ? 'right' : 'bottom'"
    style="z-index: 99999 !important"
  >
    <template v-slot:prepend>
      <div class="d-flex align-center ga-2 mx-3" style="height: 64px">
        <v-icon size="25">mdi-filter-variant</v-icon>
        <h3>{{ $t("Bộ lọc") }}</h3>
      </div>
    </template>

    <v-divider />

    <div
      v-if="Array.isArray(filters) && filters?.length"
      class="ma-4 d-flex flex-column ga-3 pt-2"
    >
      <template v-for="(item, index) in filters" :key="index">
        <v-text-field
          v-if="item.type === 'text'"
          v-model="params[item.field]"
          variant="outlined"
          density="comfortable"
          :label="item.label ? $t(item.label) : ''"
          @update:model-value="
            emits('change-filter', {
              type: item.type,
              field: item.field,
              value: params[item.field],
            })
          "
        />

        <v-select
          v-else-if="item.type === 'select'"
          v-model="params[item.field]"
          variant="outlined"
          density="comfortable"
          :items="item.items"
          :label="item.label ? $t(item.label) : ''"
          :item-title="item.itemTitle || 'title'"
          :item-value="item.itemValue || 'value'"
          @update:model-value="
            emits('change-filter', {
              type: item.type,
              field: item.field,
              value: params[item.field],
            })
          "
        />
      </template>
    </div>

    <template v-slot:append>
      <div class="d-flex ga-2 ma-4">
        <v-btn
          :text="$t('Đóng')"
          variant="outlined"
          color="primary"
          class="flex-1"
          style="height: 48px"
          @click="display = false"
        />

        <v-btn
          :text="$t('Tìm kiếm')"
          variant="flat"
          color="primary"
          class="flex-1"
          style="height: 48px"
          @click="search()"
        />
      </div>
    </template>
  </v-navigation-drawer>

  <v-data-table-server
    item-value="_id"
    v-model="selected"
    v-model:page="params.page"
    v-model:items-per-page="params.limit"
    :headers="dataHeaders"
    :items="data.docs"
    :items-length="data.totalDocs"
    :items-per-page-options="[20, 50, 100]"
    :loading="loading"
    :show-select="props.showSelect"
    :hide-default-footer="Boolean(!data.totalDocs)"
    @update:options="loadItems"
  >
    <template #top>
      <div v-if="!hideSearch" class="mb-3 d-flex flex-column ga-3">
        <v-row dense>
          <v-col v-if="!isMobile" cols="12" lg="5">
            <div class="d-flex ga-2">
              <v-text-field
                v-model="params.search"
                hide-details
                single-line
                density="comfortable"
                variant="outlined"
                prepend-inner-icon="mdi-magnify"
                :label="$t('Tìm kiếm')"
                :placeholder="$t('Tìm kiếm')"
                @keyup.enter="search('search')"
                @click:prepend-inner="search('search')"
              />

              <v-btn
                v-if="filters?.length"
                variant="outlined"
                color="primary"
                style="height: 48px"
                @click="display = true"
              >
                <v-icon size="19">mdi-filter-variant</v-icon>
                <span class="ml-2">{{ $t("Bộ lọc") }}</span>
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12" lg="7" md="7">
            <slot name="action">
              <v-row v-if="props.actions?.length" dense>
                <div class="flex-1" />

                <v-col
                  v-if="
                    props.actions.includes('add') ||
                    props.actions.includes('update')
                  "
                  :cols="props.actions.length === 1 ? 12 : 6"
                  xl="2"
                  md="3"
                  sm="3"
                >
                  <v-btn
                    :text="
                      $t(
                        props.actions.includes('update')
                          ? 'Cập nhật'
                          : 'Thêm mới'
                      )
                    "
                    style="height: 48px"
                    variant="flat"
                    color="primary"
                    class="w-100"
                    @click="
                      emits('action', {
                        action: props.actions.includes('update')
                          ? 'update'
                          : 'add',
                      })
                    "
                  />
                </v-col>

                <v-col
                  v-if="props.actions.includes('active')"
                  cols="6"
                  xl="2"
                  md="3"
                  sm="3"
                >
                  <v-btn
                    :text="$t('Kích hoạt')"
                    style="height: 48px"
                    variant="flat"
                    color="green"
                    class="w-100"
                    @click="onConfirmAction('active')"
                  />
                </v-col>

                <v-col
                  v-if="props.actions.includes('inactive')"
                  cols="6"
                  xl="2"
                  md="3"
                  sm="3"
                >
                  <v-btn
                    :text="$t('Tạm dừng')"
                    style="height: 48px"
                    variant="flat"
                    color="red"
                    class="w-100"
                    @click="onConfirmAction('inactive')"
                  />
                </v-col>

                <v-col
                  v-if="props.actions.includes('detail')"
                  :cols="props.actions.length === 1 ? 12 : 6"
                  xl="2"
                  md="3"
                  sm="3"
                >
                  <v-btn
                    :text="$t('Chi tiết')"
                    style="height: 48px"
                    variant="flat"
                    color="green"
                    class="w-100"
                    @click="emits('action', { action: 'detail' })"
                  />
                </v-col>
              </v-row>
            </slot>
          </v-col>

          <v-col v-if="isMobile" cols="12" lg="5">
            <div class="d-flex ga-2">
              <v-text-field
                v-model="params.search"
                hide-details
                single-line
                density="comfortable"
                variant="outlined"
                prepend-inner-icon="mdi-magnify"
                :label="$t('Tìm kiếm')"
                :placeholder="$t('Tìm kiếm')"
                @keyup.enter="search('search')"
                @click:prepend-inner="search('search')"
              />

              <v-btn
                v-if="filters?.length"
                variant="outlined"
                color="primary"
                style="height: 48px"
                @click="display = true"
              >
                <v-icon size="19">mdi-filter-variant</v-icon>
                <span class="ml-2">{{ $t("Bộ lọc") }}</span>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </div>
    </template>

    <template
      v-for="h in (headers as any)"
      :key="h.key"
      v-slot:[`header.${h.key}`]
    >
      <span class="font-bold" :class="`text-${h.align || 'start'}`">
        {{ $t(h.title) }}
      </span>
    </template>

    <template
      v-for="h in (headers as any)"
      :key="h.value"
      v-slot:[`item.${h.key}`]="slotProps"
    >
      <slot
        :name="`row-${h.key}`"
        :item="slotProps.item"
        :index="slotProps.index"
      >
        <div v-if="['createdAt', 'updatedAt'].includes(h.key)" class="my-4">
          <span class="text-nowrap">
            {{ (slotProps.item as any)?.[h.key] || "---" }}
          </span>
        </div>

        <div v-else-if="h.key == 'status'" class="my-4">
          <v-chip
            v-if="
                (slotProps.item as any)?.[h.key]?.color && (slotProps.item as any)?.[h.key]?.name
              "
            :color="(slotProps.item as any)?.[h.key]?.color"
          >
            {{ $t((slotProps.item as any)?.[h.key]?.name) }}
          </v-chip>

          <v-chip v-else>
            {{ (slotProps.item as any)?.[h.key] }}
          </v-chip>
        </div>

        <div v-else-if="h.key == 'action'" class="d-flex justify-center">
          <v-btn
            v-if="props.rowActions.includes('reload')"
            icon
            size="40"
            variant="text"
            :disabled="Boolean((slotProps.item as any)?.isDelete || [
              '❌ Hình ảnh tải lên vi phạm chính sách!',
              '❌ Cookies flow (veo3) của bạn không hợp lệ!',
              '❌ Cookies flow (veo3) của bạn đã hết hạn!',
              '❌ Tín dụng tài khoản flow (veo3) của bạn không đủ!',
              '❌ Hình ảnh tải lên vi phạm chính sách, vui lòng chọn ảnh khác!',
              // '❌ Thước phim liên quan đến chủ đề nhạy cảm, vi phạm chính sách nội dung!'
              '❌ Thước phim đã bị hỏng không thể sửa chữa, vui lòng xóa và tạo lại thước phim mới!',
            ].includes((slotProps.item as any)?.lastMessage?.note)) || (slotProps.item as any).loading"
            @click="
              () => {
                (slotProps.item as any).loading = true;
                emits('action', { action: 'reload', item: slotProps.item });
              }
            "
          >
            <v-icon size="20">mdi-reload</v-icon>
          </v-btn>

          <v-btn
            v-if="props.rowActions.includes('view')"
            icon
            size="40"
            variant="text"
            @click="emits('action', { action: 'view', item: slotProps.item })"
          >
            <v-icon size="20">mdi-eye-outline</v-icon>
          </v-btn>

          <v-btn
            v-if="props.rowActions.includes('update')"
            icon
            size="40"
            variant="text"
            @click="emits('action', { action: 'update', item: slotProps.item })"
          >
            <v-icon size="20">mdi-pencil-outline</v-icon>
          </v-btn>

          <v-btn
            v-if="props.rowActions.includes('delete')"
            icon
            size="40"
            variant="text"
            color="error"
            @click="onConfirmAction('delete', slotProps.item)"
          >
            <v-icon size="20">mdi-trash-can-outline</v-icon>
          </v-btn>
        </div>

        <div
          v-else
          class="my-4 text-nowrap"
          :class="h.class"
          :style="{ 'min-width': h.width }"
        >
          {{ getNestedValue(slotProps.item, h.key) }}
        </div>
      </slot>
    </template>
  </v-data-table-server>

  <v-overlay v-model="display" style="z-index: 9999 !important" />
</template>
