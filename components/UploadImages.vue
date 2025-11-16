<script setup lang="ts">
const { isMobile } = useDevice();

const props = defineProps({
  width: { type: String, default: "6rem" },
  height: { type: String, default: "6rem" },
});

const emits = defineEmits(["onSelectFiles"]);

const loading = ref(false);
const files = ref<File[]>([]);
const base64s = ref<string[]>([]);
const deleteImages = ref<string[]>([]);

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("FileReader error"));
    reader.readAsDataURL(file);
  });

const onChangeFiles = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  if (files.value.length + input.files.length > 5) {
    useAppStore().onActionSetSystemPopup({
      type: "error",
      content: "Chỉ được phép tải lên tối đa 5 ảnh!",
    });
    return;
  }

  loading.value = true;

  // Chuyển FileList thành mảng
  const newFiles = Array.from(input.files);

  try {
    // Đọc song song tất cả file mới thành Base64
    const newBase64s = await Promise.all(newFiles.map(toBase64));

    // Push từng phần tử vào mảng hiện có
    newFiles.forEach((file) => files.value.push(file));
    newBase64s.forEach((b64) => base64s.value.push(b64));

    emits("onSelectFiles", files.value);
  } catch (err) {
    console.error("Lỗi khi đọc file:", err);
  } finally {
    loading.value = false;
  }

  // Reset input để có thể chọn lại cùng file (nếu cần)
  input.value = "";
};

const onRemoveFile = (index: number, img: string) => {
  if (img.includes("http")) deleteImages.value.push(img);

  files.value.splice(index, 1);
  base64s.value.splice(index, 1);

  if (files.value.length) emits("onSelectFiles", files.value);
};

const setValue = (images: string[]) => {
  files.value = [];
  base64s.value = [];
  deleteImages.value = [];
  base64s.value = images;
};

defineExpose({ files, base64s, setValue, deleteImages });
</script>

<template>
  <v-row dense>
    <v-col cols="6" lg="4" md="4" sm="4">
      <div
        class="d-flex justify-center align-center cursor-pointer relative"
        style="border: 1px solid rgb(201 201 201); overflow: hidden"
        :style="{ width: props.width, height: props.height }"
      >
        <v-progress-circular
          v-if="loading"
          indeterminate
          :size="isMobile ? 27 : 27"
          class="absolute"
          width="1"
          style="position: absolute"
        />
        <div v-else class="d-flex flex-column align-center justify-center ga-1">
          <v-icon :size="isMobile ? 27 : 27" color="grey-darken-1">
            mdi-image-outline
          </v-icon>
          <span>{{ $t("Chọn ảnh") }}</span>
        </div>

        <input
          multiple
          type="file"
          accept="image/*"
          style="top: -2rem"
          class="absolute right-0 left-0 bottom-0 cursor-pointer"
          @change="onChangeFiles"
        />
      </div>
    </v-col>

    <template v-if="Boolean(base64s?.length)">
      <v-col
        v-for="(img, index) in base64s"
        cols="6"
        lg="4"
        md="4"
        sm="4"
        :key="index"
      >
        <div
          class="relative d-flex justify-center align-center cursor-pointer relative"
          style="border: 1px solid rgb(201 201 201); overflow: hidden"
          :style="{ width: props.width, height: props.height }"
        >
          <v-btn
            icon
            size="24"
            variant="flat"
            class="top-0 right-0"
            style="position: absolute; z-index: 999"
            @click="onRemoveFile(index, img)"
          >
            <v-icon size="20">mdi-close</v-icon>
          </v-btn>

          <v-img :lazy-src="img" :src="img" />
        </div>
      </v-col>
    </template>
  </v-row>
</template>
