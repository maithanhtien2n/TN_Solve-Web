<script setup lang="ts">
import { ref } from "vue";

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

const onChangeFile = (event: any) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const selectedFile = input.files[0];
  if (selectedFile) {
    loading.value = true;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      file.value = selectedFile;
      base64.value = e.target.result;
      loading.value = false;
      emits("onSelectFile", { file: file.value, base64: base64.value });
    };

    reader.onerror = () => {
      loading.value = false;
    };

    reader.readAsDataURL(selectedFile);
  }

  input.value = "";
};

const onRemoveFile = () => {
  file.value = undefined;
  base64.value = "";
  emits("onSelectFile", { file: file.value, base64: base64.value });
};

const setValue = (value: any) => {
  base64.value = value;
};

defineExpose({ file, base64, setValue, hehe: "11" });
</script>

<template>
  <div
    class="relative"
    style="
      overflow: hidden;
      border: 1px solid rgb(197 197 197);
      border-radius: 5px;
    "
  >
    <slot />

    <div
      v-if="base64"
      class="d-flex justify-center align-center relative"
      :style="{ width: props.width, height: props.height }"
    >
      <v-img
        :src="base64"
        :lazy-src="base64"
        alt="image-upload"
        class="w-100 h-100"
        style="object-fit: contain"
      >
        <template #placeholder>
          <v-img src="/images/image-default.svg" />
        </template>
      </v-img>

      <v-btn
        v-if="!readonly"
        icon
        size="24"
        color="black"
        style="position: absolute"
        class="top-0 right-0 cursor-pointer"
      >
        <v-icon size="20" @click="onRemoveFile">mdi-close</v-icon>
      </v-btn>
    </div>

    <div
      v-else
      class="d-flex justify-center align-center cursor-pointer relative"
      :style="{ width: props.width, height: props.height }"
    >
      <v-progress-circular
        v-if="loading"
        indeterminate
        size="48"
        width="2"
        class="absolute"
      />

      <div v-else class="d-flex flex-column ga-1 align-center">
        <v-icon size="33" color="grey-darken-1">
          {{ iconUpload }}
        </v-icon>
        <span>{{ textUpload }}</span>
      </div>

      <input
        type="file"
        accept="image/*"
        style="top: -2rem"
        class="absolute right-0 left-0 bottom-0 cursor-pointer"
        @change="onChangeFile"
      />
    </div>
  </div>
</template>
