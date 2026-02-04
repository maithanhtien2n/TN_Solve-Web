<script setup lang="ts">
import { productService } from "~/services/app";
import { masterDataService } from "~/services/app";

const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();

const { isMobile } = useDevice();

const { t } = useI18n();
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
  title: `${t(
    "Video của tôi"
  )} ${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}`,
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
  route.params.id !== "create" ? route.params.id : null
);

const isError = computed(() =>
  Boolean(
    productId.value &&
      formData.messages.length &&
      formData.messages[formData.messages.length - 1]?.color === "error"
  )
);

const modelVideoOptions = computed(() => {
  let list = onGetterMasterData.value["model-video"] || [];
  list = list?.filter((x: any) => x.value !== "tn_solve_1");
  return list;
});

const videoModeOptions = computed(() => {
  const list =
    onGetterMasterData.value["video-mode"]?.map((x: any) => ({
      title: t(x.title),
      value: x.value,
    })) || [];

  return list;
});

const frameRateOptions = computed(
  () =>
    onGetterMasterData.value["frame-rate"]?.map((x: any) => ({
      title: t(x.title),
      value: x.value,
    })) || []
);

const videoStyleOptions = computed(() => {
  const list =
    onGetterMasterData.value["video-style"]?.map((x: any) => ({
      title: t(x.title),
      value: x.value,
    })) || [];

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
        ].includes(x.value)
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
        ].includes(x.value)
      );
    }
    case "my_subject": {
      return list.filter((x: any) =>
        ["general", "testimonial"].includes(x.value)
      );
    }
    case "custom_character": {
      return list.filter((x: any) =>
        ["general", "advertising"].includes(x.value)
      );
    }
    case "custom_scenes": {
      return list.filter((x: any) =>
        [
          "general",
          "subtle_motion",
          "pan_horizontal",
          "pan_vertical",
          "dynamic",
        ].includes(x.value)
      );
    }
    default: {
      return list;
    }
  }
});

const videoDurationOptions = computed(() => {
  const allOptions =
    onGetterMasterData.value["video-duration"]?.filter(
      (option: any) =>
        !["76", "72", "68", "64", "60", "56", "52", "48", "44"].includes(
          option.value
        )
    ) || [];

  if (productId.value || formData.videoMode === "movie") {
    return allOptions;
  }

  if (
    [
      "character_preservation",
      "scene_consistency",
      "my_subject",
      "custom_character",
      "custom_scenes",
    ].includes(formData.videoMode)
  ) {
    const shortVideoValues = ["1", "2", "3", "4", "5", "6", "7", "8"];
    return allOptions.filter((option: any) =>
      shortVideoValues.includes(option.value)
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

const onFormatString = (value: string) => {
  if (!value) return;
  if (value.includes("Tổng cộng có")) {
    const match = value.match(/\d+/);
    const amount = match ? match[0] : null;
    return t("Tổng cộng có {amount} cảnh", { amount });
  } else if (value.includes("Hoàn tất tạo video cho")) {
    const match = value.match(/\d+/);
    const amount = match ? match[0] : null;
    return t("Hoàn tất tạo video cho {amount} cảnh", { amount });
  } else if (value.includes("Lần thử")) {
    const matches = value.match(/\d+\/\d+/g);
    if (matches && matches.length >= 2) {
      const [tryCount, sceneCount] = matches;
      return t(`Lần thử {tryCount}: đang tạo video cho cảnh {sceneCount}...`, {
        tryCount,
        sceneCount,
      });
    } else {
      return value;
    }
  } else if (value.includes("Tổng thời gian hoàn thành")) {
    const [title, time] = value.split(":");
    return t(title) + `: ${time}`;
  } else {
    return t(value);
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
          Array.isArray(data.images) && data.images.length
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
            ["custom_character", "custom_scenes"].includes(formData.videoMode)
          ) {
            uploadImageRefs.value.forEach((ref, index) => {
              ref?.setValue(data.images[index]);
            });
          } else {
            uploadImageRef.value?.setValue(data.images[0]);
          }
        }, 100);
      } else {
        router.replace(localePath("/video/create"));
      }
    })
    .catch(() => {
      router.replace(localePath("/video/create"));
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
    !["my_subject", "custom_character", "custom_scenes"].includes(
      formData.videoMode
    )
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
        router.replace(localePath(`/video/${productId}`));
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
  onGetProductDetail(
    Array.isArray(formData.messages) && formData.messages?.length
      ? ""
      : "detail"
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

onUnmounted(() => {
  $socket.off(`server:product-detail:${productId.value}`);
});

useSeo({
  title: t(productId.value ? "Chi tiết" : "Tạo video"),
  description:
    "Nền tảng AI giúp bạn tạo video chuyên nghiệp chỉ trong vài phút",
  image: "/images/page-detail.png",
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
          <span class="font-bold">{{ $t("Cảnh") }}: </span>
          <span v-html="item.scene" />
        </div>

        <div>
          <span class="font-bold">{{ $t("Mô tả") }}: </span>
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
    {{ $t("Đang tải dữ liệu...") }}
  </div>

  <v-row v-else>
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
          <h3>{{ $t("Tải video") }}</h3>
        </div>

        <h3 v-if="isMobile" class="font-bold mt-2" style="line-height: 1.6rem">
          {{ formData.client ? "💻" : "🌐" }} {{ formData.title }}
        </h3>

        <h2 v-else class="font-bold mt-2">
          {{ formData.client ? "💻" : "🌐" }} {{ formData.title }}
        </h2>

        <div
          v-if="formData.visibility === 'public'"
          class="d-flex align-center ga-3"
        >
          <div class="d-flex align-center ga-3">
            <v-btn
              icon
              size="40"
              variant="tonal"
              :class="{ 'text-primary': formData?.isLiked }"
              @click="onClickLikeVideo()"
            >
              <v-icon size="18">mdi-thumb-up-outline</v-icon>
            </v-btn>
            <span class="text-grey-darken-2">
              {{ formData?.likesCount }} {{ $t("lượt thích") }}
            </span>
          </div>

          |

          <div class="d-flex align-center">
            <span class="text-nowrap text-grey-darken-2">
              {{ formData?.viewsCount }} {{ $t("lượt xem") }}
            </span>

            <v-icon>mdi-circle-small</v-icon>

            <span class="text-nowrap text-grey-darken-2">
              {{ timeAgoVi(formData?.createdAt) }}
            </span>
          </div>
        </div>

        <v-row dense>
          <v-col cols="6">
            <div>
              <span class="font-bold">{{ $t("Mô hình") }}:</span>
              <br />
              {{
                modelVideoOptions.find(
                  (i: any) => i.value === formData.modelVideo
                )?.title || $t("Chưa có")
              }}
            </div>
          </v-col>

          <v-col cols="6">
            <div>
              <span class="font-bold">{{ $t("Tỷ lệ khung hình") }}:</span>
              <br />
              {{
                frameRateOptions.find(
                  (i: any) => i.value === formData.frameRate
                )?.title || $t("Chưa có")
              }}
            </div>
          </v-col>

          <v-col cols="6">
            <div>
              <span class="font-bold">{{ $t("Chế độ") }}:</span>
              <br />
              {{
                videoModeOptions.find(
                  (i: any) => i.value === formData.videoMode
                )?.title || $t("Chưa có")
              }}
            </div>
          </v-col>

          <v-col cols="6">
            <div>
              <span class="font-bold">{{ $t("Phong cách") }}:</span>
              <br />
              {{
                videoStyleOptions.find(
                  (i: any) => i.value === formData.videoStyle
                )?.title || $t("Chưa có")
              }}
            </div>
          </v-col>

          <v-col cols="6">
            <div>
              <span class="font-bold">{{ $t("Thời lượng") }}:</span>
              <br />
              {{
                videoDurationOptions.find(
                  (i: any) => i.value === formData.videoDuration
                )?.title || $t("Chưa có")
              }}
            </div>
          </v-col>

          <v-col cols="6">
            <div>
              <span class="font-bold">{{ $t("Tác giả") }}:</span>
              <br />
              {{ formData?.account?.name || $t("Chưa có") }}
            </div>
          </v-col>

          <v-divider class="my-2" />

          <template v-if="formData.hasImage">
            <v-col v-if="formData.videoMode === 'my_subject'" cols="12">
              <div>
                <span class="font-bold">{{ $t("Ảnh chủ thể") }}:</span>
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
                ['custom_character', 'custom_scenes'].includes(
                  formData.videoMode
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
                  <div>
                    <span class="font-bold">
                      {{
                        `${
                          formData.videoMode === "custom_character"
                            ? $t("Ảnh nhân vật")
                            : $t("Ảnh bối cảnh")
                        } ${index + 1}`
                      }}:
                    </span>
                    <br />
                    <UploadImage
                      :readonly="true"
                      :ref="(el) => (uploadImageRefs[index] = el)"
                      :height="width > 550 ? '10rem' : '8rem'"
                      class="mt-2 mb-1"
                    />
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </template>

          <v-col cols="12">
            <div>
              <span class="font-bold">{{ $t("Prompt") }}:</span>
              <br />
              <span v-html="formData.value" style="white-space: pre-line" />
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
              :label="$t('Tiêu đề') + ' (✳)'"
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
              :label="$t('Mô hình')"
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
              :label="$t('Tỷ lệ khung hình')"
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
              :label="$t('Chế độ')"
              @update:modelValue="
                () => {
                  if (
                    !videoStyleOptions.some((x: any) => x.value === formData.videoStyle)
                  ) {
                    formData.videoStyle = videoStyleOptions[0].value;
                  }

                  if (
                    !videoDurationOptions.some((x: any) => x.value === formData.videoDuration)
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
              :label="$t('Phong cách')"
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
              :label="$t('Thời lượng')"
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
              ['custom_character', 'custom_scenes'].includes(formData.videoMode)
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
                  :textUpload="`${t('Chọn ảnh')} ${index + 1}`"
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
                  (formData.videoMode === 'my_subject' && !uploadImageRef?.base64) ||
                  (formData.videoMode === 'custom_character' && uploadImageRefs.filter((item: any) => item)
                    .some((ref: any) => !ref?.base64)) ||
                  (formData.videoMode === 'custom_scenes' && uploadImageRefs.filter((item: any) => item)
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
              <h3>{{ isError ? $t("Tạo lại video") : $t("Tạo video") }}</h3>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-col>

    <v-col lg="6" md="6" cols="12">
      <div
        v-if="videoFlow && Object.values(videoFlow || {})?.length"
        class="mb-4"
      >
        <v-progress-linear
          height="10"
          :color="videoFlow.color"
          :modelValue="videoFlow.value"
        />
        <div class="mt-2">
          {{ videoFlow.title }}
        </div>
      </div>

      <div ref="myTimeline">
        <v-timeline
          side="end"
          class="mb-4"
          direction="vertical"
          :density="'compact'"
        >
          <template
            v-for="(item, index) in productId
              ? formData.messages
              : [
                  {
                    title: 'Hoàn tất thông tin',
                    dateTime: '',
                    color: 'grey',
                  },
                ]"
            :key="index"
          >
            <v-timeline-item :dot-color="item.color" size="small">
              <template v-slot:icon>
                <v-icon v-if="item.color === 'success'" color="white" size="20">
                  mdi-check
                </v-icon>

                <v-progress-circular
                  v-else-if="item.color === 'primary'"
                  color="white"
                  width="2"
                  size="16"
                  indeterminate
                />

                <v-icon v-if="item.color === 'error'" color="white" size="20">
                  mdi-close
                </v-icon>
              </template>

              <div>
                <div class="font-bold">
                  {{ onFormatString(item.title) }}
                </div>

                <div class="text-caption">
                  {{ item.dateTime }}
                </div>

                <div
                  v-if="item.note"
                  class="text-caption"
                  :class="{
                    'cursor-pointer text-blue-darken-1':
                      item.note?.includes('Tổng cộng có') &&
                      onGetterUserData?.role === EnumAccountRole.ADMIN,
                  }"
                  @click="
                    onClickNoteMessage(
                      item.note?.includes('Tổng cộng có') &&
                        onGetterUserData?.role === EnumAccountRole.ADMIN
                    )
                  "
                >
                  {{ onFormatString(item.note) }}
                </div>
                <div
                  v-if="
                    [
                      '❌ Cookies flow (veo3) của bạn không hợp lệ!',
                      '❌ Cookies flow (veo3) của bạn đã hết hạn!',
                    ].includes(item.note)
                  "
                  class="text-caption"
                >
                  {{ $t("Vui lòng cập nhật cookies mới") }}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://tnsolve.com/setting"
                  >
                    {{ $t("tại đây") }}
                  </a>
                </div>

                <div
                  v-if="
                    onGetterUserData?.role === EnumAccountRole.ADMIN &&
                    item.errorMsg
                  "
                  class="text-caption"
                >
                  {{ item.errorMsg }}
                </div>
              </div>
            </v-timeline-item>
          </template>
        </v-timeline>
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
.auto-grow-textarea ::v-deep(textarea) {
  max-height: 450px;
  overflow-y: auto;
}
</style>
