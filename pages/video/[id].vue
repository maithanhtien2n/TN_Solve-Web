<script setup lang="ts">
import { productService } from "~/services/app";
import { masterDataService } from "~/services/app";

const route = useRoute();
const router = useRouter();
const { isMobile } = useDevice();
const { width } = useDevice();
const { $socket } = useNuxtApp();

const { onGetterUserData } = useAppStore();
const { onGetterMasterData } = useMasterDataStore();

const loading = ref("");
const videoFlow = ref<any>({});
const uploadImageRef = ref<any>(null);
const commonDialogRef = ref<any>(null);
const uploadImageRefs = ref<any[]>([]);
const myTimeline = ref<HTMLDivElement | null>(null);

const client = computed<boolean>(() => {
  const win = window as any;
  return !!(win?.electronAPI && win?.electronAPI?.isElectron);
});

const formData = reactive<any>({
  title: "Video của tôi",
  value: "",
  frameRate: "horizontal",
  modelVideo: "veo3_fast",
  videoMode: "movie",
  videoStyle: "general",
  videoDuration: "8",
  author: "",
  images: [],
  video: "",
  messages: [],
  account: {},
  prompts: [],
  client: client.value,
  createdAt: "",
});

const productId = computed(() =>
  route.params.id !== "create" ? route.params.id : null,
);

const isError = computed(() =>
  Boolean(
    productId.value &&
    formData.messages.length &&
    formData.messages[formData.messages.length - 1]?.color === "error",
  ),
);

const modelVideoOptions = computed(() => {
  let list = onGetterMasterData.value["model-video"] || [];

  list = list?.filter((x: any) => !["tn_solve_1", "grok"].includes(x.value));

  return list;
});

const videoModeOptions = computed(() => {
  let list =
    onGetterMasterData.value["video-mode"] || [];

  list = list.filter((x: any) => !["sync_process"].includes(x.value));

  if (formData.modelVideo === "grok") {
    list = list.filter(
      (x: any) =>
        ![
          "character_preservation",
          "sync_process",
          "custom_character",
          "custom_process",
        ].includes(x.value),
    );
  }

  return list;
});

const frameRateOptions = computed(
  () => onGetterMasterData.value["frame-rate"] || [],
);

const videoStyleOptions = computed(() => {
  let list =
    onGetterMasterData.value["video-style"] || [];

  switch (formData.videoMode) {
    case "movie":
    case "character_preservation": {
      return list.filter((x: any) =>
        [
          "general",
          "cinematic",
          "animation",
          "news",
          "documentary",
          "advertising",
          "storytelling",
        ].includes(x.value),
      );
    }
    case "scene_consistency": {
      return list.filter((x: any) =>
        [
          "general",
          "educational",
          "confession",
          "interview",
          "walk_and_talk",
          "conversational",
        ].includes(x.value),
      );
    }
    case "sync_process": {
      return list.filter((x: any) =>
        [
          "general",
          "slow_zoom",
          "tracking",
          "walkthrough",
          "top_down",
          "cutaway",
          "exploded_view",
        ].includes(x.value),
      );
    }
    case "my_subject": {
      return list.filter((x: any) =>
        ["general", "testimonial", "shorts"].includes(x.value),
      );
    }
    case "custom_character": {
      return list.filter((x: any) =>
        ["general", "advertising"].includes(x.value),
      );
    }
    case "custom_scenes":
    case "custom_process": {
      return list.filter((x: any) =>
        [
          "general",
          "subtle_motion",
          "pan_horizontal",
          "pan_vertical",
          "dynamic",
        ].includes(x.value),
      );
    }
    default: {
      return list;
    }
  }
});

const videoDurationOptions = computed(() => {
  // let allOptions =
  //   onGetterMasterData.value["video-duration"]?.filter(
  //     (option: any) =>
  //       !["76", "72", "68", "64", "60", "56", "52", "48", "44"].includes(
  //         option.value
  //       )
  //   ) || [];

  let allOptions = onGetterMasterData.value["video-duration"] || [];

  if (formData.modelVideo === "grok") {
    const convert8to6 = (time: string) => {
      const [mm, ss] = time.split(":").map(Number);
      const total = mm * 60 + ss;

      const step = total / 8; // vì dữ liệu gốc là bội số của 8
      const newTotal = step * 6; // đổi sang bội số 6

      const newMM = Math.floor(newTotal / 60);
      const newSS = newTotal % 60;

      return `${String(newMM).padStart(2, "0")}:${String(newSS).padStart(
        2,
        "0",
      )}`;
    };

    allOptions =
      allOptions?.map((x: any) => ({
        title: convert8to6(x.title),
        value: x.value,
      })) || [];

    allOptions = allOptions.filter((option: any) =>
      [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
      ].includes(option.value),
    );
  }

  allOptions =
    allOptions?.map((x: any, index: number) => ({
      title: `${x.title} - (${index + 1} cảnh)`,
      value: x.value,
    })) || [];

  if (productId.value || formData.videoMode === "movie") {
    return allOptions;
  }

  if (
    ["character_preservation", "custom_character"].includes(formData.videoMode)
  ) {
    const shortVideoValues = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
    ];
    return allOptions.filter((option: any) =>
      shortVideoValues.includes(option.value),
    );
  } else if (
    [
      "my_subject",
      "scene_consistency",
      "sync_process",
      "custom_scenes",
      "custom_process",
    ].includes(formData.videoMode)
  ) {
    const shortVideoValues = ["1", "2", "3", "4", "5", "6", "7", "8"];
    return allOptions.filter((option: any) =>
      shortVideoValues.includes(option.value),
    );
  } else {
    return allOptions;
  }
});

const scrollToTimeline = () => {
  if (myTimeline.value) {
    myTimeline.value.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};

const onGetProductDetail = async (loadingType: string = "") => {
  await masterDataService
    .getVideoFlow()
    .then((res) => {
      videoFlow.value = res?.data || {};
    })
    .catch(() => {});

  if (!productId.value) return;

  loading.value = loadingType;
  await productService
    .getDetailProduct({ _id: productId.value })
    .then((res) => {
      const data = res?.data;
      if (data) {
        formData.title = data.title;
        formData.value = data.value;
        formData.frameRate = data.frameRate;
        formData.modelVideo = data.modelVideo;
        formData.videoMode = data.videoMode;
        formData.videoStyle = data.videoStyle;
        formData.videoDuration = data.videoDuration;
        formData.author = data.author;
        formData.images = [];
        formData.hasImage = Boolean(
          Array.isArray(data.images) && data.images.length,
        );
        formData.video = data.video;
        formData.messages = data.messages || [];
        formData.account = data.account || {};
        formData.prompts = Array.isArray(data.prompts) ? data.prompts : [];
        formData.client = data.client || client.value;
        formData.createdAt = data.createdAt;
        formData.updatedAt = data.updatedAt;
        formData.viewsCount = data.viewsCount || 0;
        formData.likesCount = data.likesCount || 0;
        formData.visibility = data.visibility || "private";
        formData.isLiked = data.isLiked || false;

        setTimeout(() => {
          if (
            ["custom_character", "custom_scenes", "custom_process"].includes(
              formData.videoMode,
            )
          ) {
            uploadImageRefs.value.forEach((ref, index) => {
              ref?.setValue(data.images[index]);
            });
          } else {
            uploadImageRef.value?.setValue(data.images[0]);
          }
        }, 100);
      } else {
        router.replace("/video/create");
      }
    })
    .catch(() => {
      router.replace("/video/create");
    })
    .finally(() => {
      loading.value = "";
    });
};

const onSubmit = async () => {
  if (!formData.title || !formData.value) return;

  loading.value = "submit";
  if (productId.value) formData._id = productId.value;

  if (
    ![
      "my_subject",
      "custom_character",
      "custom_scenes",
      "custom_process",
    ].includes(formData.videoMode)
  ) {
    delete formData.images;
  }

  if (client.value) formData.client = true;

  await productService
    .saveProduct(formData)
    .then(async (res) => {
      const productId = res?.data?.productId;
      if (productId) {
        await onGetProductDetail();
        router.replace(`/video/${productId}`);
      }
    })
    .catch(() => {
      loading.value = "";
    });
};

const onClickNoteMessage = (isClick: boolean) => {
  if (isClick) commonDialogRef.value?.onDisplay(true);
};

const onClickLikeVideo = () => {
  productService.likeProductVideo({ _id: productId.value }).then(async () => {
    await onGetProductDetail();
  });
};

onMounted(() => {
  if (!productId.value) {
    formData.title = `Video của tôi ${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}`;
  }
  onGetProductDetail(
    Array.isArray(formData.messages) && formData.messages?.length
      ? ""
      : "detail",
  );
});

onMounted(() => {
  $socket.on(`server:product-detail:${productId.value}`, async (data) => {
    await onGetProductDetail();

    nextTick(() => {
      if (data.state === "success") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        scrollToTimeline();
      }
    });
  });
});

onMounted(async () => {
  const priorityModel = await getSettingValue("Mô hình ưu tiên");
  if (priorityModel) formData.modelVideo = priorityModel;
});

onUnmounted(() => {
  $socket.off(`server:product-detail:${productId.value}`);
});

useSeo({
  title: productId.value ? "Chi tiết video" : "Tạo video AI",
  description: productId.value
    ? "Xem chi tiết và theo dõi tiến trình tạo video AI của bạn trên TN Solve. Xem từng cảnh quay, tải xuống video hoàn chỉnh."
    : "Tạo video AI chuyên nghiệp với TN Solve - Chọn mô hình Veo, Grok, thiết lập cảnh quay và tạo video tự động chỉ trong vài phút.",
  image: "/images/page-detail.png",
  keywords:
    "tạo video AI, Veo, Grok, video tự động, TN Solve tạo video, AI video creator",
});

definePageMeta({ middleware: "auth" });
</script>

<template>
  <CommonDialog ref="commonDialogRef" title="Chi tiết cảnh quay" width="800">
    <div class="d-flex flex-column ga-4">
      <div
        v-for="(item, index) in formData.prompts"
        :key="index"
        class="d-flex flex-column"
      >
        <div>
          <span class="font-bold">Cảnh: </span>
          <span v-html="item.scene" />
        </div>

        <div>
          <span class="font-bold">Mô tả: </span>
          <span v-html="item.description" />
        </div>

        <div v-if="item.prompt">
          <span class="font-bold">Prompt: </span><br />
          <span v-html="item.prompt" style="white-space: pre-line" />
        </div>
      </div>
    </div>
  </CommonDialog>

  <div
    v-if="Boolean(loading === 'detail')"
    class="d-flex justify-center flex-column align-center ga-3 pt-10 pb-16"
  >
    <v-progress-circular width="2" size="40" color="primary" indeterminate />
    Đang tải dữ liệu...
  </div>

  <v-row v-else align="start">
    <v-col
      v-if="videoFlow && Object.values(videoFlow || {})?.length"
      cols="12"
    >
      <div class="flow-status-bar mb-2">
        <div class="flow-status-header">
          <span class="flow-status-title">{{ videoFlow.title }}</span>
          <span class="flow-status-pct">{{ videoFlow.value }}%</span>
        </div>
        <v-progress-linear
          :color="videoFlow.color"
          :modelValue="videoFlow.value"
          height="9"
          rounded
          bg-color="#96a8be"
        />
      </div>
    </v-col>

    <v-col cols="12" lg="6" md="6">
      <div v-if="formData.video" class="d-flex flex-column ga-3">
        <div
          class="d-flex justify-center rem bg-black"
          style="border-radius: 13px; overflow: hidden"
        >
          <VideoPlayer
            :src="formData.video"
            :frameRate="formData.frameRate"
            :removeControls="['settings']"
          />
        </div>

        <div
          class="cta-button w-100 justify-center"
          style="border-radius: 6px"
          :class="{
            disabled:
              !formData.title || !formData.value || loading === 'download',
          }"
          @click="
            downloadVideo(formData.video, formData.title, (e: string) => {
              loading = e;
            })
          "
        >
          <v-progress-circular
            v-if="Boolean(loading === 'download')"
            width="2"
            size="23"
            color="white"
            indeterminate
          />

          <v-icon v-else size="27">mdi-tray-arrow-down</v-icon>
          <h3>Tải video</h3>
        </div>

        <!-- Title + stats -->
        <div class="title-stats-row mt-2">
          <div class="title-block">
            <h3 v-if="isMobile" class="font-bold" style="line-height: 1.6rem">
              {{ formData.title }}
            </h3>
            <h2 v-else class="font-bold">{{ formData.title }}</h2>

            <div v-if="formData.visibility === 'public'" class="meta-line">
              <span class="stat-item">
                <v-icon size="13">mdi-eye-outline</v-icon>
                {{ formData?.viewsCount }} lượt xem
              </span>
              <span class="stats-dot">·</span>
              <span class="stat-item">
                <v-icon size="13">mdi-clock-outline</v-icon>
                {{ timeAgoVi(formData?.createdAt) }}
              </span>
            </div>
          </div>

          <button
            v-if="formData.visibility === 'public'"
            class="like-btn"
            :class="{ liked: formData?.isLiked }"
            @click="onClickLikeVideo()"
          >
            <v-icon size="16">
              {{ formData?.isLiked ? 'mdi-thumb-up' : 'mdi-thumb-up-outline' }}
            </v-icon>
            <span>{{ formData?.likesCount }}</span>
          </button>
        </div>

        <div class="info-grid">
          <div class="info-card">
            <span class="info-label">Mô hình</span>
            <span class="info-value">{{ modelVideoOptions.find((i: any) => i.value === formData.modelVideo)?.title || "Chưa có" }}</span>
          </div>
          <div class="info-card">
            <span class="info-label">Tỷ lệ khung hình</span>
            <span class="info-value">{{ frameRateOptions.find((i: any) => i.value === formData.frameRate)?.title || "Chưa có" }}</span>
          </div>
          <div class="info-card">
            <span class="info-label">Chế độ</span>
            <span class="info-value">{{ videoModeOptions.find((i: any) => i.value === formData.videoMode)?.title || "Chưa có" }}</span>
          </div>
          <div class="info-card">
            <span class="info-label">Phong cách</span>
            <span class="info-value">{{ videoStyleOptions.find((i: any) => i.value === formData.videoStyle)?.title || "Chưa có" }}</span>
          </div>
          <div class="info-card">
            <span class="info-label">Thời lượng</span>
            <span class="info-value">{{ videoDurationOptions.find((i: any) => i.value === formData.videoDuration)?.title || "Chưa có" }}</span>
          </div>
          <div class="info-card">
            <span class="info-label">Tác giả</span>
            <span class="info-value">{{ formData?.account?.name || "Chưa có" }}</span>
          </div>
        </div>

        <v-row dense>
          <template v-if="formData.hasImage">
            <v-col v-if="formData.videoMode === 'my_subject'" cols="12">
              <div>
                <span class="font-bold">Ảnh chủ thể:</span>
                <br />
                <UploadImage
                  ref="uploadImageRef"
                  :readonly="true"
                  :height="width > 550 ? '10rem' : '8rem'"
                  class="mt-2 mb-1"
                />
              </div>
            </v-col>

            <v-col
              v-else-if="
                [
                  'custom_character',
                  'custom_scenes',
                  'custom_process',
                ].includes(formData.videoMode)
              "
              cols="12"
            >
              <v-row dense>
                <v-col
                  v-for="(item, index) in formData.videoMode ===
                  'custom_character'
                    ? 2
                    : +formData.videoDuration"
                  :key="index"
                  cols="6"
                >
                  <div class="info-card">
                    <span class="info-label">
                      {{
                        `${
                          formData.videoMode === "custom_character"
                            ? "Ảnh nhân vật"
                            : "Ảnh bối cảnh"
                        } ${index + 1}`
                      }}
                    </span>
                    <UploadImage
                      :readonly="true"
                      :ref="(el) => (uploadImageRefs[index] = el)"
                      :height="width > 550 ? '10rem' : '8rem'"
                      class="mt-1 mb-1"
                    />
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </template>

          <v-col cols="12">
            <div class="info-card">
              <span class="info-label">Prompt</span>
              <span v-html="formData.value" class="info-value" style="white-space: pre-line" />
            </div>
          </v-col>
        </v-row>
      </div>

      <div v-else>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="formData.title"
              hide-details
              class="w-100"
              variant="outlined"
              label="Tiêu đề (✳)"
              :readonly="Boolean(productId)"
              :class="{ disabled: Boolean(productId) }"
            />
          </v-col>

          <v-col cols="12" lg="6" md="6" sm="6">
            <v-select
              v-model="formData.modelVideo"
              hide-details
              class="w-100"
              variant="outlined"
              item-title="title"
              item-value="value"
              :items="modelVideoOptions"
              :readonly="Boolean(productId)"
              :class="{ disabled: Boolean(productId) }"
              label="Mô hình"
              @update:model-value="
                (value) => {
                  if (
                    value === 'grok' &&
                    [
                      'character_preservation',
                      'sync_process',
                      'custom_character',
                      'custom_process',
                    ].includes(formData.videoMode)
                  ) {
                    formData.videoMode = 'movie';
                  }
                }
              "
            />
          </v-col>

          <v-col cols="12" lg="6" md="6" sm="6">
            <v-select
              v-model="formData.frameRate"
              hide-details
              class="w-100"
              variant="outlined"
              item-title="title"
              item-value="value"
              :items="frameRateOptions"
              :readonly="
                Boolean(productId || formData.videoMode === 'short_form_video')
              "
              :class="{ disabled: Boolean(productId) }"
              label="Tỷ lệ khung hình"
            />
          </v-col>

          <v-col cols="12" lg="6" md="6" sm="6">
            <v-select
              v-model="formData.videoMode"
              hide-details
              class="w-100"
              variant="outlined"
              item-title="title"
              item-value="value"
              :items="videoModeOptions"
              :readonly="Boolean(productId)"
              :class="{ disabled: Boolean(productId) }"
              label="Chế độ"
              @update:modelValue="
                () => {
                  if (
                    !videoStyleOptions.some(
                      (x: any) => x.value === formData.videoStyle,
                    )
                  ) {
                    formData.videoStyle = videoStyleOptions[0].value;
                  }

                  if (
                    !videoDurationOptions.some(
                      (x: any) => x.value === formData.videoDuration,
                    )
                  ) {
                    formData.videoDuration = videoDurationOptions[0].value;
                  }

                  if (formData.videoMode === 'short_form_video') {
                    formData.frameRate = 'vertical';
                  }
                }
              "
            />
          </v-col>

          <v-col cols="12" lg="6" md="6" sm="6">
            <v-select
              v-model="formData.videoStyle"
              hide-details
              class="w-100"
              variant="outlined"
              item-title="title"
              item-value="value"
              :items="videoStyleOptions"
              :readonly="Boolean(productId)"
              :class="{
                disabled: Boolean(productId),
              }"
              label="Phong cách"
            />
          </v-col>

          <v-col cols="12">
            <v-select
              v-model="formData.videoDuration"
              hide-details
              class="w-100"
              variant="outlined"
              item-title="title"
              item-value="value"
              :items="videoDurationOptions"
              :readonly="Boolean(productId)"
              :class="{ disabled: Boolean(productId) }"
              label="Thời lượng"
            />
          </v-col>

          <v-col v-if="formData.videoMode === 'my_subject'" cols="12">
            <UploadImage
              ref="uploadImageRef"
              :class="{ disabled: Boolean(productId) }"
              :height="width > 550 ? '10rem' : '8rem'"
              iconUpload="mdi-image-outline"
              textUpload="Chọn ảnh"
              @on-select-file="(event) => (formData.images = [event?.file])"
            />
          </v-col>

          <v-col
            v-else-if="
              ['custom_character', 'custom_scenes', 'custom_process'].includes(
                formData.videoMode,
              )
            "
            cols="12"
          >
            <v-row dense>
              <v-col
                v-for="(item, index) in formData.videoMode ===
                'custom_character'
                  ? 2
                  : +formData.videoDuration"
                :key="index"
                cols="6"
              >
                <UploadImage
                  :ref="(el) => (uploadImageRefs[index] = el)"
                  :class="{ disabled: Boolean(productId) }"
                  :height="width > 550 ? '10rem' : '8rem'"
                  iconUpload="mdi-image-outline"
                  :textUpload="`Chọn ảnh ${index + 1}`"
                  @on-select-file="
                    (event) => (formData.images[index] = event?.file)
                  "
                />
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="formData.value"
              rows="6"
              auto-grow
              hide-details
              class="w-100"
              variant="outlined"
              label="Prompt (✳)"
              :readonly="Boolean(productId)"
              :class="{ disabled: Boolean(productId) }"
            />
          </v-col>

          <v-col
            v-if="
              (!formData?.account?._id ||
                onGetterUserData?._id === formData?.account?._id) &&
              (!productId || isError)
            "
            cols="12"
          >
            <div
              class="cta-button w-100 justify-center"
              style="border-radius: 6px"
              :class="{
                disabled:
                  loading === 'submit' ||
                  !formData.title ||
                  !formData.value ||
                  (formData.videoMode === 'my_subject' &&
                    !uploadImageRef?.base64) ||
                  (formData.videoMode === 'custom_character' &&
                    uploadImageRefs
                      .filter((item: any) => item)
                      .some((ref: any) => !ref?.base64)) ||
                  (formData.videoMode === 'custom_scenes' &&
                    uploadImageRefs
                      .filter((item: any) => item)
                      .some((ref: any) => !ref?.base64)) ||
                  (formData.videoMode === 'custom_process' &&
                    uploadImageRefs
                      .filter((item: any) => item)
                      .some((ref: any) => !ref?.base64)),
              }"
              @click="onSubmit()"
            >
              <v-progress-circular
                v-if="Boolean(loading === 'submit')"
                width="2"
                size="23"
                color="white"
                indeterminate
              />
              <v-icon v-else size="27">mdi-image-filter-tilt-shift</v-icon>
              <h3>{{ isError ? "Tạo lại video" : "Tạo video" }}</h3>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-col>

    <v-col lg="6" md="6" cols="12">

      <!-- Guide panel khi chưa tạo video -->
      <div v-if="!productId" class="guide-panel">
        <div class="guide-header">
          <div class="guide-header-icon">
            <v-icon color="white" size="22">mdi-image-filter-tilt-shift</v-icon>
          </div>
          <div>
            <div class="guide-header-title">Quy trình tạo video AI</div>
            <div class="guide-header-sub">Chỉ vài phút để có video chuyên nghiệp</div>
          </div>
        </div>

        <div class="guide-steps">
          <div class="guide-step">
            <div class="guide-step-num">1</div>
            <div class="guide-step-body">
              <div class="guide-step-title">Điền thông tin & Prompt</div>
              <div class="guide-step-desc">Chọn mô hình, tỷ lệ khung hình, chế độ, phong cách, thời lượng và viết nội dung mô tả video</div>
            </div>
          </div>
          <div class="guide-step-connector" />
          <div class="guide-step">
            <div class="guide-step-num">2</div>
            <div class="guide-step-body">
              <div class="guide-step-title">AI phân tích & tạo kịch bản</div>
              <div class="guide-step-desc">Hệ thống tự động phân tích prompt và tạo kịch bản từng cảnh quay</div>
            </div>
          </div>
          <div class="guide-step-connector" />
          <div class="guide-step">
            <div class="guide-step-num">3</div>
            <div class="guide-step-body">
              <div class="guide-step-title">Xử lý & render video</div>
              <div class="guide-step-desc">AI tiến hành tạo từng cảnh quay và ghép thành video hoàn chỉnh</div>
            </div>
          </div>
          <div class="guide-step-connector" />
          <div class="guide-step">
            <div class="guide-step-num">4</div>
            <div class="guide-step-body">
              <div class="guide-step-title">Tải video về máy</div>
              <div class="guide-step-desc">Video hoàn tất, bạn có thể xem, chia sẻ hoặc tải xuống ngay</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline khi đã có video -->
      <div v-else ref="myTimeline" class="steps-timeline">
        <div
          v-for="(item, index) in formData.messages"
          :key="index"
          class="step-item"
          :class="`step-${item.color}`"
        >
          <!-- connector line -->
          <div class="step-line" v-if="index !== 0" />

          <div class="step-row">
            <!-- icon -->
            <div class="step-icon" :class="`step-icon--${item.color}`">
              <v-icon v-if="item.color === 'success'" color="white" size="16">mdi-check</v-icon>
              <v-progress-circular v-else-if="item.color === 'primary'" color="white" width="2" size="14" indeterminate />
              <v-icon v-else-if="item.color === 'error'" color="white" size="16">mdi-close</v-icon>
              <v-icon v-else color="white" size="14">mdi-clock-outline</v-icon>
            </div>

            <!-- content -->
            <div class="step-content">
              <div class="step-title">{{ item.title }}</div>
              <div v-if="item.dateTime" class="step-time">{{ item.dateTime }}</div>
              <div
                v-if="item.note"
                class="step-note"
                :class="{
                  'step-note--link':
                    item.note?.includes('Đã phân tích xong kịch bản') &&
                    onGetterUserData?.role === EnumAccountRole.ADMIN,
                }"
                @click="
                  onClickNoteMessage(
                    item.note?.includes('Đã phân tích xong kịch bản') &&
                      onGetterUserData?.role === EnumAccountRole.ADMIN,
                  )
                "
              >
                {{ item.note }}
              </div>
              <div
                v-if="['❌ Cookies flow (veo3) của bạn không hợp lệ!', '❌ Cookies flow (veo3) của bạn đã hết hạn!'].includes(item.note)"
                class="step-note"
              >
                Vui lòng cập nhật cookies mới
                <a target="_blank" rel="noopener noreferrer" href="https://tnsolve.com/setting">tại đây</a>
              </div>
              <div
                v-if="onGetterUserData?.role === EnumAccountRole.ADMIN && item.errorMsg"
                class="step-note step-note--error"
              >
                {{ item.errorMsg }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-col>

    <v-col
      v-if="
        formData?.account?._id &&
        onGetterUserData?._id !== formData?.account?._id
      "
      cols="12"
      class="mt-6"
    >
      <div class="w-100 text-center text-gray-600">
        © Thước phim được sáng tạo bởi
        <span class="font-bold text-black">
          {{ formData.account?.name }}
        </span>
        <br />
        Hãy tôn trọng tác giả và không sử dụng cho các mục đích vi phạm.
      </div>
    </v-col>
  </v-row>
</template>

<style scoped>
/* ─── Guide panel ────────────────────────────────────── */
.guide-panel {
  background: #fff;
  border: 1px solid #d0dae6;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.guide-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 55%, #1565c0 100%);
}

.guide-header-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255,255,255,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.guide-header-title {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
}

.guide-header-sub {
  font-size: 0.78rem;
  color: rgba(255,255,255,0.65);
  margin-top: 2px;
}

.guide-steps {
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.guide-step {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.guide-step-connector {
  width: 2px;
  height: 20px;
  background: #d0dae6;
  margin-left: 15px;
}

.guide-step-num {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #eff6ff;
  border: 2px solid #bfdbfe;
  color: #1e88e5;
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.guide-step-body {
  padding-top: 4px;
  padding-bottom: 12px;
}

.guide-step-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 3px;
}

.guide-step-desc {
  font-size: 0.78rem;
  color: #6b7280;
  line-height: 1.5;
}

.auto-grow-textarea ::v-deep(textarea) {
  max-height: 450px;
  overflow-y: auto;
}

/* ─── Info cards grid ───────────────────────────────── */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 4px;
}

.info-card {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid #d0dae6;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.info-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #212121;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 0.85rem;
  font-weight: 400;
  color: #212121;
  line-height: 1.35;
}

/* ─── Title + stats row ─────────────────────────────── */
.title-stats-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.title-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.meta-line {
  display: flex;
  align-items: center;
  gap: 6px;
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 14px;
  border-radius: 20px;
  border: 1px solid #e0e0e0;
  background: transparent;
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 500;
  color: #616161;
  transition: background 0.18s, color 0.18s, border-color 0.18s;
}

.like-btn:hover {
  background: #f5f5f5;
  border-color: #bdbdbd;
}

.like-btn.liked {
  background: #e3f2fd;
  border-color: #90caf9;
  color: #1976d2;
}

.stats-divider {
  width: 1px;
  height: 16px;
  background: #e0e0e0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: #9e9e9e;
}

.stats-dot {
  color: #bdbdbd;
  font-size: 0.9rem;
}

/* ─── Flow Status Bar ───────────────────────────────── */
.flow-status-bar {
  padding: 12px 14px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid #d0dae6;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.flow-status-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.flow-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  animation: pulse-dot 1.5s ease-in-out infinite;
}

.flow-dot--success { background: #43a047; animation: none; }
.flow-dot--primary { background: #1e88e5; }
.flow-dot--error   { background: #e53935; animation: none; }
.flow-dot--grey    { background: #bdbdbd; animation: none; }

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(1.3); }
}

.flow-status-title {
  font-size: 0.85rem;
  font-weight: 500;
  color: #212121;
  flex: 1;
}

.flow-status-pct {
  font-size: 0.78rem;
  font-weight: 600;
  color: #9e9e9e;
}

/* ─── Steps Timeline ─────────────────────────────────── */
.steps-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 4px 0;
  margin-top: -4px;
}

.step-item {
  position: relative;
}

.step-line {
  position: absolute;
  top: -12px;
  left: 15px;
  width: 2px;
  height: 12px;
  background: #e0e0e0;
}

.step-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  min-height: 56px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid #d0dae6;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: background 0.15s;
}

.step-success .step-row {
  background: #f0faf4;
  border-color: #c8ecd6;
}

.step-primary .step-row {
  background: #f0f6ff;
  border-color: #c2d9f8;
}

.step-error .step-row {
  background: #fff4f4;
  border-color: #fdd;
}

.step-icon {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
}

.step-icon--success { background: #43a047; }
.step-icon--primary { background: #1e88e5; }
.step-icon--error   { background: #e53935; }
.step-icon--grey    { background: #bdbdbd; }

.step-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.step-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #212121;
  line-height: 1.4;
}

.step-time {
  font-size: 0.75rem;
  color: #9e9e9e;
}

.step-note {
  font-size: 0.78rem;
  color: #555;
  margin-top: 1px;
}

.step-note--link {
  color: #1e88e5;
  cursor: pointer;
  text-decoration: underline;
}

.step-note--error {
  color: #e53935;
}
</style>
