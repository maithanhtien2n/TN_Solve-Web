<script setup lang="ts">
const props = defineProps({
  width: { type: String, default: "100%" },
  height: { type: String, default: "20rem" },
  iconUpload: { type: String, default: "mdi-video-plus-outline" },
  textUpload: { type: String, default: "Tải video lên" },
  readonly: { type: Boolean, default: false },
});

const emits = defineEmits(["onSelectFile"]);

const file = ref<File>();
const previewUrl = ref<string>("");
const isDragging = ref<boolean>(false);

const processFile = (selectedFile: File) => {
  file.value = selectedFile;
  previewUrl.value = URL.createObjectURL(selectedFile);
  emits("onSelectFile", { file: file.value, previewUrl: previewUrl.value });
};

const onChangeFile = (event: any) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  processFile(input.files[0]);
  input.value = "";
};

const onDrop = (event: DragEvent) => {
  isDragging.value = false;
  const f = event.dataTransfer?.files?.[0];
  if (f && f.type.startsWith("video/")) processFile(f);
};

const onRemoveFile = () => {
  file.value = undefined;
  previewUrl.value = "";
  emits("onSelectFile", { file: file.value, previewUrl: "" });
};

// value: url video đã có sẵn (VD khi sửa 1 mẫu đã có video) — không phải file
// thật nên không set `file`, chỉ hiện preview. Phải reset `file` về undefined,
// nếu không component bị tái sử dụng giữa các lần mở dialog khác nhau (Vue
// không unmount) sẽ giữ lại `file` từ lần chọn video trước đó của 1 phiên
// khác, khiến nơi gọi tưởng nhầm là user vừa chọn lại video này.
const setValue = (value: any) => {
  previewUrl.value = value || "";
  file.value = undefined;
};

defineExpose({ file, previewUrl, setValue });
</script>

<template>
  <div
    class="ui-upload"
    :class="{ 'ui-upload--drag': isDragging }"
    :style="{ width: props.width, height: props.height }"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="onDrop"
  >
    <slot />

    <!-- Preview state -->
    <template v-if="previewUrl">
      <video :src="previewUrl" controls class="ui-upload__video" />

      <button v-if="!readonly" class="ui-upload__remove" @click.stop="onRemoveFile">
        <v-icon size="16">mdi-close</v-icon>
      </button>
    </template>

    <!-- Empty state -->
    <template v-else>
      <div class="ui-upload__empty">
        <div class="ui-upload__icon-wrap">
          <v-icon size="28" color="#1565c0">{{ iconUpload }}</v-icon>
        </div>
        <p class="ui-upload__label">{{ textUpload }}</p>
        <p class="ui-upload__hint">hoặc kéo thả video vào đây</p>
      </div>

      <input
        type="file"
        accept="video/*"
        class="ui-upload__input"
        @change="onChangeFile"
      />
    </template>
  </div>
</template>

<style scoped>
.ui-upload {
  position: relative;
  border-radius: 12px;
  border: 2px dashed #cbd5e1;
  background: #f8faff;
  overflow: hidden;
  transition: border-color 0.2s, background 0.2s;
  cursor: pointer;
}

.ui-upload:hover {
  border-color: #93c5fd;
  background: #eff6ff;
}

.ui-upload--drag {
  border-color: #1565c0;
  background: #dbeafe;
}

/* ── Preview ───────────────────────────────── */
.ui-upload__video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}

.ui-upload__remove {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  z-index: 2;
}

.ui-upload__remove:hover {
  background: #ef4444;
}

/* ── Empty ─────────────────────────────────── */
.ui-upload__empty {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  pointer-events: none;
}

.ui-upload__icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: rgba(21, 101, 192, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.ui-upload__label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.ui-upload__hint {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0;
}

/* ── Input ─────────────────────────────────── */
.ui-upload__input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
}
</style>
