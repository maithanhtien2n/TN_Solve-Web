<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { geminiHanaService } from "~/services/gemini-hana";

const headers = [
  { title: "Tên gợi nhớ", key: "label", sortable: false },
  { title: "__Secure-1PSID", key: "secure1PSIDPreview", sortable: false },
  { title: "__Secure-1PSIDTS", key: "secure1PSIDTSPreview", sortable: false },
  { title: "Hoạt động", key: "isActive", align: "center", sortable: false },
  { title: "Trạng thái gần nhất", key: "liveStatus", sortable: false },
  { title: "Cập nhật", key: "updatedAt", sortable: false },
  { title: "Thao tác", key: "action", align: "center", sortable: false },
];

const data = ref<any>({});
// [2026-08-31] Trạng thái SỐNG đọc từ RAM gemini-hana-service (KHÔNG lưu DB),
// khớp theo _id — xem loadLiveHealth(). Load lại mỗi lần bảng load lại.
const liveHealthMap = ref<Record<string, { healthy: boolean; lastError: string | null }>>({});

async function loadLiveHealth() {
  try {
    const res: any = await geminiHanaService.getLiveHealth();
    const map: Record<string, any> = {};
    for (const a of res.data?.accounts || []) {
      map[a.id] = { healthy: a.healthy, lastError: a.lastError || null };
    }
    liveHealthMap.value = map;
  } catch {
    // gemini-hana-service có thể đang không chạy — không chặn cả trang vì
    // lỗi này, chỉ đơn giản không hiện được cột trạng thái lúc đó.
    liveHealthMap.value = {};
  }
}
const loading = ref<string>("");
const dataTableRef = ref<any>(null);
const commonDialogRef = ref<any>(null);
const confirmDialogRef = ref<any>(null);

const {
  values: formData,
  handleSubmit,
  resetForm,
} = useForm({
  initialValues: {
    _id: null,
    label: "",
    secure1PSID: "",
    secure1PSIDTS: "",
  },
  validationSchema: {
    label(value: any) {
      if (!value) return "Vui lòng nhập tên gợi nhớ";
      return true;
    },
    // Chỉ bắt buộc khi TẠO MỚI (_id rỗng) — khi SỬA, để trống nghĩa là "giữ
    // nguyên cookie cũ" (khớp đúng logic backend, xem gemini-hana.service.ts
    // saveAccount) — nếu validate ở đây bắt buộc luôn thì tính năng "để
    // trống" không bao giờ submit được, form chặn ngay từ FE.
    secure1PSID(value: any, { form }: any) {
      if (!value && !form._id) return "Vui lòng nhập __Secure-1PSID";
      return true;
    },
    secure1PSIDTS(value: any, { form }: any) {
      if (!value && !form._id) return "Vui lòng nhập __Secure-1PSIDTS";
      return true;
    },
  },
});

const _id = useField("_id");
const label = useField("label");
const secure1PSID = useField("secure1PSID");
const secure1PSIDTS = useField("secure1PSIDTS");

async function loadItems(event: any) {
  const params = { ...event };

  loading.value = "load-table";
  await Promise.all([
    geminiHanaService.getAllAccounts(params).then((res) => {
      if (res.data) data.value = res.data;
    }),
    // Chạy song song, KHÔNG chặn bảng chính nếu gemini-hana-service chậm/lỗi
    // (đã tự bắt lỗi bên trong loadLiveHealth).
    loadLiveHealth(),
  ]).finally(() => {
    loading.value = "";
  });
}

const onResetForm = (event?: any) => {
  resetForm({
    values: {
      _id: event?._id || null,
      label: event?.label || "",
      secure1PSID: "",
      secure1PSIDTS: "",
    },
  });
};

function onCopyId(item: any) {
  navigator.clipboard.writeText(item._id);
  const { $toast } = useNuxtApp();
  $toast.success("Đã copy ID tài khoản!");
}

const onAction = (event: any) => {
  if (event.action === "add") {
    onResetForm({});
    commonDialogRef.value?.onDisplay(true);
  } else if (event.action === "update") {
    onResetForm(event.item);
    commonDialogRef.value?.onDisplay(true);
  } else if (event.action === "switch") {
    const payload: any = {
      ids: [event.item._id],
      action: event.isActive ? "active" : "inactive",
    };

    loading.value = "switch-" + event.item._id;
    geminiHanaService
      .actionAccount(payload)
      .then(() => {
        dataTableRef.value?.loadItems();
      })
      .finally(() => {
        loading.value = "";
      });
  } else if (event.action === "delete") {
    confirmDialogRef.value?.show({
      title: "Xóa tài khoản",
      message: `Bạn có chắc chắn muốn xóa tài khoản "${event.item.label}" không? Hành động này không thể hoàn tác.`,
      onConfirm: async () => {
        await geminiHanaService.actionAccount({
          ids: [event.item._id],
          action: "delete",
        });
        dataTableRef.value?.loadItems();
      },
    });
  } else if (event.action === "test") {
    onOpenTest(event.item);
  }
};

const onSubmit = handleSubmit(async (values: any) => {
  if (loading.value === "submit-form") return;
  const payload: any = { ...values };

  loading.value = "submit-form";
  await geminiHanaService
    .saveAccount(payload)
    .then(async () => {
      commonDialogRef.value?.onDisplay(false);
      dataTableRef.value?.loadItems();
      onResetForm({});
    })
    .finally(() => {
      loading.value = "";
    });
});

// ─── Dialog Test — test đúng 1 account, gõ prompt (+ file tuỳ chọn), gọi
// thử, hiện kết quả ────────────────────────────────────────────────────────
const testDialogRef = ref<any>(null);
const testingAccount = ref<any>(null);
const testPrompt = ref<string>("Xin chào, bạn là ai?");
const testFiles = ref<File[]>([]);
const testResult = ref<string>("");
const testError = ref<string>("");
const testLoading = ref<boolean>(false);

function onOpenTest(item: any) {
  testingAccount.value = item;
  testPrompt.value = "Xin chào, bạn là ai?";
  testFiles.value = [];
  testResult.value = "";
  testError.value = "";
  testDialogRef.value?.onDisplay(true);
}

// Đọc File -> base64 (bỏ tiền tố "data:...;base64," của FileReader, chỉ giữ
// đúng phần base64 thuần — khớp đúng định dạng gemini-hana-service mong đợi).
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function onSubmitTest() {
  if (!testPrompt.value || testLoading.value) return;

  testLoading.value = true;
  testResult.value = "";
  testError.value = "";
  try {
    const files = await Promise.all(
      testFiles.value.map(async (file) => ({
        data: await fileToBase64(file),
        mimeType: file.type || "application/octet-stream",
        filename: file.name,
      }))
    );

    const res = await geminiHanaService.testAccount({
      accountId: testingAccount.value._id,
      prompt: testPrompt.value,
      files: files.length ? files : undefined,
    });
    testResult.value = res.data?.text || "(không có nội dung trả về)";
  } catch (error: any) {
    testError.value =
      error?.response?.data?.message || error?.message || "Lỗi không xác định";
  } finally {
    testLoading.value = false;
  }
}

// ─── Dialog Chat nhiều lượt — test /accounts/{id}/chat, có nhớ hội thoại
// qua chatMetadata (khác dialog Test ở trên: mỗi lần Test luôn là hội thoại
// mới, không nhớ gì) ─────────────────────────────────────────────────────
const chatDialogRef = ref<any>(null);
const chattingAccount = ref<any>(null);
const chatMessages = ref<{ role: "user" | "model"; text: string }[]>([]);
const chatMetadataState = ref<(string | null)[] | null>(null);
const chatInput = ref<string>("");
const chatDialogFiles = ref<File[]>([]);
const chatDialogLoading = ref<boolean>(false);
const chatDialogError = ref<string>("");

function onOpenChat(item: any) {
  chattingAccount.value = item;
  onNewConversation();
  chatDialogRef.value?.onDisplay(true);
}

function onNewConversation() {
  chatMessages.value = [];
  chatMetadataState.value = null;
  chatInput.value = "";
  chatDialogFiles.value = [];
  chatDialogError.value = "";
}

async function onSendChat() {
  if (!chatInput.value || chatDialogLoading.value) return;

  const prompt = chatInput.value;
  chatMessages.value.push({ role: "user", text: prompt });
  chatInput.value = "";
  chatDialogLoading.value = true;
  chatDialogError.value = "";
  try {
    const files = await Promise.all(
      chatDialogFiles.value.map(async (file) => ({
        data: await fileToBase64(file),
        mimeType: file.type || "application/octet-stream",
        filename: file.name,
      }))
    );
    chatDialogFiles.value = []; // đính kèm chỉ gửi 1 lần cho lượt vừa gõ

    const res = await geminiHanaService.chatAccount({
      accountId: chattingAccount.value._id,
      prompt,
      files: files.length ? files : undefined,
      chatMetadata: chatMetadataState.value,
    });
    chatMessages.value.push({
      role: "model",
      text: res.data?.text || "(không có nội dung trả về)",
    });
    chatMetadataState.value = res.data?.chatMetadata || null;
  } catch (error: any) {
    chatDialogError.value =
      error?.response?.data?.message || error?.message || "Lỗi không xác định";
    chatMessages.value.pop(); // gỡ tin nhắn user vừa thêm — gửi thất bại
  } finally {
    chatDialogLoading.value = false;
  }
}

definePageMeta({ layout: "admin", title: "Tài khoản" });
</script>

<template>
  <ConfirmDialog ref="confirmDialogRef" />

  <CommonDialog
    ref="commonDialogRef"
    :title="_id.value.value ? 'Cập nhật tài khoản' : 'Thêm tài khoản'"
    width="560"
  >
    <div class="mt-2">
      <v-alert
        type="info"
        variant="tonal"
        density="compact"
        class="mb-4 text-caption"
      >
        Cách lấy: mở gemini.google.com đã đăng nhập → F12 → tab
        <b>Application</b> → mục <b>Cookies</b> → gemini.google.com → copy
        Value của 2 dòng <b>__Secure-1PSID</b> và <b>__Secure-1PSIDTS</b>.
        Nên dùng tài khoản test riêng, không dùng tài khoản chính.
      </v-alert>

      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="label.value.value"
            variant="outlined"
            label="Tên gợi nhớ (✳)"
            placeholder="VD: Tài khoản test 1"
            :error-messages="label.errorMessage.value"
            :hide-details="Boolean(!label.errorMessage.value)"
          />
        </v-col>

        <v-col cols="12">
          <v-textarea
            v-model="secure1PSID.value.value"
            rows="2"
            variant="outlined"
            label="__Secure-1PSID (✳)"
            :placeholder="
              _id.value.value ? 'Để trống nếu không đổi' : 'g.a000...'
            "
            :error-messages="secure1PSID.errorMessage.value"
            :hide-details="Boolean(!secure1PSID.errorMessage.value)"
          />
        </v-col>

        <v-col cols="12">
          <v-textarea
            v-model="secure1PSIDTS.value.value"
            rows="2"
            variant="outlined"
            label="__Secure-1PSIDTS (✳)"
            :placeholder="
              _id.value.value ? 'Để trống nếu không đổi' : 'sidts-...'
            "
            :error-messages="secure1PSIDTS.errorMessage.value"
            :hide-details="Boolean(!secure1PSIDTS.errorMessage.value)"
          />
        </v-col>
      </v-row>
    </div>

    <template #footer>
      <div
        class="cta-button w-100 justify-center"
        :class="{ disabled: loading === 'submit-form' }"
        style="border-radius: 6px"
        @click="onSubmit"
      >
        <v-progress-circular
          v-if="Boolean(loading == 'submit-form')"
          width="2"
          size="23"
          color="white"
          indeterminate
        />

        <v-icon v-else size="27">mdi-account-key-outline</v-icon>
        <h3>{{ _id.value.value ? "Cập nhật" : "Thêm tài khoản" }}</h3>
      </div>
    </template>
  </CommonDialog>

  <CommonDialog
    ref="testDialogRef"
    :title="`Test tài khoản: ${testingAccount?.label || ''}`"
    width="560"
  >
    <div class="mt-2">
      <v-textarea
        v-model="testPrompt"
        rows="3"
        variant="outlined"
        label="Nội dung gửi thử"
        hide-details
        @keyup.enter.ctrl="onSubmitTest"
      />

      <v-file-input
        v-model="testFiles"
        multiple
        counter
        show-size
        variant="outlined"
        density="comfortable"
        class="mt-3"
        label="File đính kèm (tuỳ chọn — ảnh, video, tài liệu...)"
        prepend-icon=""
        prepend-inner-icon="mdi-paperclip"
        hide-details
      />

      <div
        class="cta-button w-100 justify-center mt-3"
        :class="{ disabled: testLoading || !testPrompt }"
        style="border-radius: 6px"
        @click="onSubmitTest"
      >
        <v-progress-circular
          v-if="testLoading"
          width="2"
          size="23"
          color="white"
          indeterminate
        />
        <v-icon v-else size="22">mdi-send-outline</v-icon>
        <h3>Gửi thử</h3>
      </div>

      <v-alert
        v-if="testResult"
        type="success"
        variant="tonal"
        density="compact"
        class="mt-4"
        style="white-space: pre-wrap"
      >
        {{ testResult }}
      </v-alert>

      <v-alert
        v-if="testError"
        type="error"
        variant="tonal"
        density="compact"
        class="mt-4"
      >
        {{ testError }}
      </v-alert>
    </div>
  </CommonDialog>

  <CommonDialog
    ref="chatDialogRef"
    :title="`Chat nhiều lượt: ${chattingAccount?.label || ''}`"
    width="620"
  >
    <div class="mt-2">
      <div class="d-flex justify-space-between align-center mb-2">
        <span class="text-caption text-medium-emphasis">
          {{
            chatMetadataState
              ? "Đang nối tiếp hội thoại"
              : "Hội thoại mới — chưa gửi lượt nào"
          }}
        </span>
        <v-btn
          size="small"
          variant="text"
          color="primary"
          prepend-icon="mdi-refresh"
          @click="onNewConversation"
        >
          Hội thoại mới
        </v-btn>
      </div>

      <div
        class="chat-history mb-3"
        style="max-height: 320px; overflow-y: auto"
      >
        <div v-if="!chatMessages.length" class="text-center text-caption text-medium-emphasis py-6">
          Chưa có tin nhắn nào — gõ bên dưới để bắt đầu.
        </div>
        <div
          v-for="(msg, i) in chatMessages"
          :key="i"
          class="d-flex mb-2"
          :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div
            class="px-3 py-1"
            style="max-width: 80%; border-radius: 10px; white-space: pre-wrap"
            :class="
              msg.role === 'user'
                ? 'bg-primary text-white'
                : 'bg-grey-lighten-3 text-black'
            "
          >
            {{ msg.text }}
          </div>
        </div>
      </div>

      <v-alert
        v-if="chatDialogError"
        type="error"
        variant="tonal"
        density="compact"
        class="mb-3"
      >
        {{ chatDialogError }}
      </v-alert>

      <v-textarea
        v-model="chatInput"
        rows="2"
        variant="outlined"
        label="Nhắn tiếp..."
        hide-details
        @keyup.enter.ctrl="onSendChat"
      />

      <v-file-input
        v-model="chatDialogFiles"
        multiple
        counter
        show-size
        variant="outlined"
        density="comfortable"
        class="mt-3"
        label="File đính kèm cho lượt này (tuỳ chọn)"
        prepend-icon=""
        prepend-inner-icon="mdi-paperclip"
        hide-details
      />

      <div
        class="cta-button w-100 justify-center mt-3"
        :class="{ disabled: chatDialogLoading || !chatInput }"
        style="border-radius: 6px"
        @click="onSendChat"
      >
        <v-progress-circular
          v-if="chatDialogLoading"
          width="2"
          size="23"
          color="white"
          indeterminate
        />
        <v-icon v-else size="22">mdi-send-outline</v-icon>
        <h3>Gửi</h3>
      </div>
    </div>
  </CommonDialog>

  <DataTable
    ref="dataTableRef"
    :filters="[]"
    :showSelect="false"
    :actions="['add']"
    :rowActions="[]"
    :headers="headers"
    :data="data"
    :loading="Boolean(loading == 'load-table')"
    @change="loadItems"
    @action="onAction"
  >
    <template #row-secure1PSIDPreview="{ item }">
      <span class="text-caption text-medium-emphasis">
        {{ (item as any).secure1PSIDPreview }}
      </span>
    </template>

    <template #row-secure1PSIDTSPreview="{ item }">
      <span class="text-caption text-medium-emphasis">
        {{ (item as any).secure1PSIDTSPreview }}
      </span>
    </template>

    <template #row-isActive="{ item }">
      <div class="d-flex justify-center">
        <v-checkbox
          hide-details
          density="compact"
          color="primary"
          :loading="Boolean(loading == 'switch-' + (item as any)._id)"
          :model-value="(item as any).isActive"
          @update:model-value="
            (e) => {
              onAction({ action: 'switch', item, isActive: e });
            }
          "
        />
      </div>
    </template>

    <template #row-liveStatus="{ item }">
      <template v-if="!liveHealthMap[(item as any)._id]">
        <span class="text-caption text-medium-emphasis">Chưa có dữ liệu</span>
      </template>
      <template v-else-if="!liveHealthMap[(item as any)._id].lastError">
        <v-chip size="small" color="success" variant="tonal">
          <v-icon start size="14">mdi-check-circle-outline</v-icon>
          OK
        </v-chip>
      </template>
      <template v-else>
        <v-tooltip :text="liveHealthMap[(item as any)._id].lastError" location="top">
          <template #activator="{ props }">
            <v-chip v-bind="props" size="small" color="error" variant="tonal" style="cursor: help">
              <v-icon start size="14">mdi-alert-circle-outline</v-icon>
              Lỗi
            </v-chip>
          </template>
        </v-tooltip>
      </template>
    </template>

    <template #row-action="{ item }">
      <div class="d-flex justify-center align-center ga-2">
        <v-btn
          icon
          size="40"
          variant="text"
          title="Copy ID (dùng cho API /accounts/{id}/chat)"
          @click="onCopyId(item)"
        >
          <v-icon size="20">mdi-content-copy</v-icon>
        </v-btn>

        <v-btn
          icon
          size="40"
          variant="text"
          color="primary"
          title="Test tài khoản này"
          @click="onAction({ action: 'test', item })"
        >
          <v-icon size="20">mdi-flask-outline</v-icon>
        </v-btn>

        <v-btn
          icon
          size="40"
          variant="text"
          color="primary"
          title="Chat nhiều lượt (có nhớ hội thoại)"
          @click="onOpenChat(item)"
        >
          <v-icon size="20">mdi-forum-outline</v-icon>
        </v-btn>

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
