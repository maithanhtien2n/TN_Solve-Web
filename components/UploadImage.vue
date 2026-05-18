<script setup lang="ts">
const props = defineProps({
  width: { type: String, default: "100%" },
  height: { type: String, default: "20rem" },
  iconUpload: { type: String, default: "mdi-folder-upload-outline" },
  textUpload: { type: String, default: "Tải ảnh lên" },
  readonly: { type: Boolean, default: false },
});

const emits = defineEmits(["onSelectFile"]);

const file = ref<File>();
const base64 = ref<string>("");
const loading = ref<boolean>(false);
const isDragging = ref<boolean>(false);

const processFile = (selectedFile: File) => {
  loading.value = true;
  const reader = new FileReader();
  reader.onload = (e: any) => {
    file.value = selectedFile;
    base64.value = e.target.result;
    loading.value = false;
    emits("onSelectFile", { file: file.value, base64: base64.value });
  };
  reader.onerror = () => { loading.value = false; };
  reader.readAsDataURL(selectedFile);
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
  if (f && f.type.startsWith("image/")) processFile(f);
};

const onRemoveFile = () => {
  file.value = undefined;
  base64.value = "";
  emits("onSelectFile", { file: file.value, base64: base64.value });
};

const setValue = (value: any) => { base64.value = value; };

defineExpose({ file, base64, setValue, hehe: "11" });
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
    <template v-if="base64">
      <v-img
        :src="base64"
        :lazy-src="base64"
        alt="image-upload"
        class="ui-upload__img"
        contain
      >
        <template #placeholder>
          <v-img src="/images/image-default.svg" />
        </template>
      </v-img>

      <button v-if="!readonly" class="ui-upload__remove" @click.stop="onRemoveFile">
        <v-icon size="16">mdi-close</v-icon>
      </button>
    </template>

    <!-- Empty state -->
    <template v-else>
      <div v-if="loading" class="ui-upload__loading">
        <v-progress-circular indeterminate size="36" width="2" color="#1565c0" />
      </div>

      <div v-else class="ui-upload__empty">
        <div class="ui-upload__icon-wrap">
          <v-icon size="28" color="#1565c0">{{ iconUpload }}</v-icon>
        </div>
        <p class="ui-upload__label">{{ textUpload }}</p>
        <p class="ui-upload__hint">hoặc kéo thả ảnh vào đây</p>
      </div>

      <input
        type="file"
        accept="image/*"
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
.ui-upload__img {
  width: 100%;
  height: 100%;
}

.ui-upload__remove {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(0,0,0,0.55);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  z-index: 2;
}

.ui-upload__remove:hover { background: #ef4444; }

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
  background: rgba(21,101,192,0.1);
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

.ui-upload__loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
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
