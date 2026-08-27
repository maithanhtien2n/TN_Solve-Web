<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { storeService } from "~/services/app";

const headers = [
  { title: "Ảnh", key: "thumbnail", sortable: false },
  { title: "Tiêu đề", key: "title", sortable: false },
  { title: "Chế độ", key: "videoMode", sortable: false },
  { title: "Giá", key: "price", sortable: false },
  { title: "Cập nhật", key: "updatedAt", sortable: false },
  { title: "Trạng thái", key: "status", align: "center", sortable: false },
  { title: "Thao tác", key: "action", align: "center", sortable: false },
];

const videoModeOptions = [
  { title: "Text to video", value: "text" },
  { title: "Image to video", value: "image" },
  { title: "Reference to video", value: "reference" },
];

// Tách ra hàm riêng (thay vì viết thẳng trong template) — Vue compiler tự dò
// "{{"/"}}" theo text thô để tìm mustache, nếu viết literal 2 ký tự này lồng
// bên trong 1 mustache khác (dù chỉ là chuỗi JS bình thường) sẽ bị lỗi parse.
function displayFieldKey(key: string) {
  return "{{" + key + "}}";
}

const data = ref<any>({});
const loading = ref<string>("");
const dataTableRef = ref<any>(null);
const commonDialogRef = ref<any>(null);
const confirmDialogRef = ref<any>(null);

const uploadThumbnailRef = ref<any>(null);
const uploadSampleVideoRef = ref<any>(null);
const exampleImageRefs = ref<any[]>([]);

// Field do AI phân tích prompt sinh ra (title + key, chèn "{{key}}" vào đúng
// vị trí trong basePrompt) — HOÀN TOÀN do AI quyết định, không cho sửa/xoá
// thủ công (nếu không sẽ lệch với các "{{key}}" AI đã chèn sẵn trong prompt).
// Muốn đổi thì sửa lại nội dung prompt rồi bấm phân tích lại.
const analyzedFields = ref<{ title: string; key: string }[]>([]);
const analyzing = ref(false);

async function onAnalyzePrompt() {
  if (!basePrompt.value.value) return;
  analyzing.value = true;
  try {
    const res = await storeService.analyzePrompt(basePrompt.value.value as string);
    basePrompt.value.value = res.data?.prompt || basePrompt.value.value;
    analyzedFields.value = res.data?.fields || [];
  } catch (error) {
    console.log("Lỗi khi phân tích prompt bằng AI!", error);
  } finally {
    analyzing.value = false;
  }
}

const { handleSubmit, resetForm } = useForm({
  initialValues: {
    _id: null,
    title: "",
    basePrompt: "",
    videoMode: "text",
    aspectRatio: "LANDSCAPE",
    price: null,
  },
  validationSchema: {
    title(value: any) {
      if (!value) return "Vui lòng nhập tiêu đề mẫu";
      return true;
    },
    basePrompt(value: any) {
      if (!value) return "Vui lòng nhập prompt mẫu";
      return true;
    },
    price(value: any) {
      if (!value) return "Vui lòng nhập giá tiền";
      if (value <= 0) return "Giá tiền phải lớn hơn 0";
      return true;
    },
  },
});

const _id = useField("_id");
const title = useField("title");
const basePrompt = useField("basePrompt");
const videoMode = useField("videoMode");
const aspectRatio = useField("aspectRatio");
const price = useField<number>("price");

// Số ô ảnh minh hoạ theo Chế độ — KHÔNG dùng để tạo video, chỉ để user biết
// nên chụp/tải ảnh kiểu gì cho hợp mẫu (xem video-template.model.ts exampleImages).
const exampleImageCount = computed(() => {
  if (videoMode.value.value === "image") return 2;
  if (videoMode.value.value === "reference") return 4;
  return 0;
});

function onResetForm(item?: any) {
  resetForm({
    values: {
      _id: item?._id || null,
      title: item?.title || "",
      basePrompt: item?.basePrompt || "",
      videoMode: item?.videoMode || "text",
      aspectRatio: item?.aspectRatio || "LANDSCAPE",
      price: item?.price || null,
    },
  });
  analyzedFields.value = item?.promptFields || [];
  // Dialog mount trễ (Vuetify v-dialog) — ref chưa sẵn sàng ngay lúc này, phải
  // đợi 1 nhịp giống hệt pattern đã dùng ở [id].vue (uploadImageRef.setValue).
  setTimeout(() => {
    uploadThumbnailRef.value?.setValue(item?.thumbnail || "");
    uploadSampleVideoRef.value?.setValue(item?.sampleVideo || "");
    (item?.exampleImages || []).forEach((url: string, index: number) => {
      exampleImageRefs.value[index]?.setValue(url);
    });
  }, 100);
}

async function loadItems(event: any) {
  loading.value = "load-table";
  try {
    const res = await storeService.getTemplatesAdmin({
      search: event?.search,
      page: event?.page,
      limit: event?.limit,
    });
    data.value = {
      docs: res.data?.docs || [],
      totalDocs: res.data?.totalDocs || 0,
    };
  } catch (error) {
    console.log("Lỗi khi tải danh sách mẫu video!", error);
  } finally {
    loading.value = "";
  }
}

const onSubmitForm = handleSubmit(async (values: any) => {
  if (loading.value === "submit-form") return;

  loading.value = "submit-form";
  try {
    await storeService.saveTemplate({
      ...values,
      thumbnail: uploadThumbnailRef.value?.file,
      sampleVideo: uploadSampleVideoRef.value?.file,
      exampleImages: exampleImageRefs.value
        .filter((ref) => ref)
        .map((ref) => ref.file)
        .filter(Boolean),
      // Đánh dấu từng ô ảnh minh hoạ theo đúng thứ tự trên form: URL ảnh cũ
      // (giữ nguyên ô đó) hoặc null (ô đó có ảnh MỚI, khớp thứ tự với mảng
      // exampleImages ở trên) — cho phép backend chỉ thay đúng ô đã đổi thay
      // vì bắt buộc gửi lại nguyên bộ (xem store.service.ts updateTemplate).
      exampleImagesMeta: exampleImageRefs.value
        .filter((ref) => ref)
        .map((ref) => (ref.file ? null : ref.base64 || null)),
      promptFields: analyzedFields.value,
    });
    commonDialogRef.value?.onDisplay(false);
    onResetForm();
    dataTableRef.value?.loadItems();
  } catch (error) {
    console.log("Lỗi khi lưu mẫu video!", error);
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
    // Tự xác nhận + tự chờ xong mới tắt loading (giống coupon.vue) — nút xoá
    // gọi thẳng onAction({item}) qua slot #row-action riêng, KHÔNG qua
    // onConfirmAction/emit "ids" mặc định của DataTable (emit đó không đợi
    // được API xoá thật xong, nên nút "Đồng ý" tắt loading ngay tức thì dù
    // xoá xong hay chưa).
    confirmDialogRef.value?.show({
      title: "Xóa mẫu video",
      message: `Bạn có chắc chắn muốn xóa mẫu "${event.item.title}" không? Hành động này không thể hoàn tác.`,
      onConfirm: async () => {
        await storeService.deleteTemplate({ _id: event.item._id });
        dataTableRef.value?.loadItems();
      },
    });
  }
};

async function onToggleStatus(item: any) {
  loading.value = `status-${item._id}`;
  try {
    await storeService.saveTemplate({
      _id: item._id,
      status: item.status?.code === "active" ? "inactive" : "active",
    });
    dataTableRef.value?.loadItems();
  } catch (error) {
    console.log("Lỗi khi đổi trạng thái mẫu video!", error);
  } finally {
    loading.value = "";
  }
}

definePageMeta({ layout: "admin", title: "Sản phẩm" });
</script>

<template>
  <ConfirmDialog ref="confirmDialogRef" />

  <CommonDialog
    ref="commonDialogRef"
    :title="_id.value.value ? 'Cập nhật mẫu video' : 'Thêm mẫu video'"
    width="560"
  >
    <div class="mt-2">
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="title.value.value"
            variant="outlined"
            label="Tiêu đề (✳)"
            placeholder="Ví dụ: Video quảng cáo sản phẩm"
            :error-messages="title.errorMessage.value"
            :hide-details="Boolean(!title.errorMessage.value)"
          />
        </v-col>

        <v-col cols="12">
          <v-textarea
            v-model="basePrompt.value.value"
            rows="3"
            variant="outlined"
            label="Prompt (✳)"
            placeholder="Ví dụ: A cinematic product ad, ..."
            :error-messages="basePrompt.errorMessage.value"
            :hide-details="Boolean(!basePrompt.errorMessage.value)"
          />
        </v-col>

        <v-col cols="12" class="mt-n3">
          <button
            type="button"
            class="analyze-btn"
            :disabled="analyzing || !basePrompt.value.value"
            @click="onAnalyzePrompt"
          >
            <v-progress-circular v-if="analyzing" width="2" size="16" indeterminate />
            <v-icon v-else size="18">mdi-magic-staff</v-icon>
            {{ analyzing ? "Đang phân tích..." : "Phân tích prompt bằng AI" }}
          </button>

          <div v-if="analyzedFields.length" class="analyzed-fields">
            <div class="analyzed-fields-label">
              AI phát hiện {{ analyzedFields.length }} thông tin cần user nhập:
            </div>
            <div class="analyzed-field-row" v-for="f in analyzedFields" :key="f.key">
              <v-chip size="small" variant="tonal" color="primary">{{ f.title }}</v-chip>
              <code class="analyzed-field-key">{{ displayFieldKey(f.key) }}</code>
            </div>
          </div>
        </v-col>

        <v-col cols="12">
          <v-select
            v-model="videoMode.value.value"
            variant="outlined"
            item-title="title"
            item-value="value"
            :items="videoModeOptions"
            label="Chế độ (✳)"
            hide-details
          />
        </v-col>

        <v-col v-if="exampleImageCount > 0" cols="12" class="mt-n3">
          <v-row dense>
            <v-col
              v-for="n in exampleImageCount"
              :key="n"
              :cols="exampleImageCount === 2 ? 6 : 3"
            >
              <div class="example-image-slot">
                <UploadImage
                  :ref="(el) => (exampleImageRefs[n - 1] = el)"
                  width="100%"
                  height="100%"
                  iconUpload="mdi-image-outline"
                  :textUpload="`Ảnh ${n}`"
                  hide-hint
                  hide-icon
                />
              </div>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <v-number-input
            v-model="price.value.value"
            variant="outlined"
            control-variant="stacked"
            :min="0"
            label="Giá tiền (đ) (✳)"
            :error-messages="price.errorMessage.value"
            :hide-details="Boolean(!price.errorMessage.value)"
          />
        </v-col>

        <v-col cols="6">
          <UploadImage
            ref="uploadThumbnailRef"
            height="140px"
            iconUpload="mdi-image-plus-outline"
            textUpload="Ảnh đại diện mẫu"
          />
        </v-col>

        <v-col cols="6">
          <UploadVideo
            ref="uploadSampleVideoRef"
            height="140px"
            iconUpload="mdi-video-plus-outline"
            textUpload="Video mẫu"
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

        <v-icon v-else size="27">mdi-rocket-launch-outline</v-icon>
        <h3>{{ _id.value.value ? "Cập nhật" : "Thêm mới" }}</h3>
      </div>
    </template>
  </CommonDialog>

  <DataTable
    ref="dataTableRef"
    :filters="[]"
    :showSelect="false"
    :actions="['add']"
    :headers="headers"
    :data="data"
    :loading="Boolean(loading == 'load-table')"
    @change="loadItems"
    @action="onAction"
  >
    <template #row-thumbnail="{ item }">
      <v-img
        v-if="(item as any).thumbnail"
        :src="(item as any).thumbnail"
        width="96"
        height="54"
        cover
        class="rounded my-3"
      >
        <template #placeholder>
          <div class="thumb-loading-overlay" />
        </template>
      </v-img>
      <v-icon v-else size="40" color="grey-lighten-1">mdi-image-off-outline</v-icon>
    </template>

    <template #row-title="{ item }">
      <div class="py-2" style="max-width: 260px; white-space: normal">
        {{ (item as any).title }}
      </div>
    </template>

    <template #row-videoMode="{ item }">
      <v-chip size="small" variant="tonal">
        {{
          videoModeOptions.find((o) => o.value === (item as any).videoMode)?.title ||
          (item as any).videoMode
        }}
      </v-chip>
    </template>

    <template #row-price="{ item }">
      <span class="text-error font-weight-medium">{{ formatCurrency((item as any).price) }}</span>
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

    <template #row-action="{ item }">
      <div class="d-flex justify-center align-center ga-2">
        <v-btn
          icon
          size="40"
          variant="text"
          @click="onAction({ action: 'update', item })"
        >
          <v-icon size="20">mdi-pencil-outline</v-icon>
        </v-btn>

        <v-btn
          icon
          size="40"
          variant="text"
          color="error"
          @click="onAction({ action: 'delete', item })"
        >
          <v-icon size="20">mdi-trash-can-outline</v-icon>
        </v-btn>
      </div>
    </template>
  </DataTable>
</template>

<style scoped>
.example-image-slot {
  width: 100%;
  aspect-ratio: 16 / 9;
}

.thumb-loading-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: #e2e8f0;
  background-image: linear-gradient(
    100deg,
    transparent 30%,
    rgba(255, 255, 255, 0.7) 50%,
    transparent 70%
  );
  background-size: 200% 100%;
  animation: thumb-shimmer 1.4s ease-in-out infinite;
}

@keyframes thumb-shimmer {
  0% {
    background-position: 150% 0;
  }
  100% {
    background-position: -50% 0;
  }
}

.analyze-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid rgba(21, 101, 192, 0.35);
  background: rgba(21, 101, 192, 0.06);
  color: #1565c0;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.analyze-btn:hover:not(:disabled) {
  background: rgba(21, 101, 192, 0.12);
}

.analyze-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.analyzed-fields {
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #eef1f5;
}

.analyzed-fields-label {
  font-size: 0.76rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 6px;
}

.analyzed-field-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.analyzed-field-key {
  font-size: 0.76rem;
  color: #94a3b8;
}
</style>
