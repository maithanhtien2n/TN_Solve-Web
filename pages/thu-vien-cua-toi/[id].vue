<script setup lang="ts">
import { productService } from "~/services/app";
import { masterDataService } from "~/services/app";
import { storeService } from "~/services/app";

const route = useRoute();
const router = useRouter();
const { isMobile } = useDevice();
const { width } = useDevice();
const { $socket } = useNuxtApp();

const { onGetterUserData } = useAppStore();
const { onGetterMasterData } = useMasterDataStore();

const loading = ref("");
const videoFlow = ref<any>({});
const commonDialogRef = ref<any>(null);
const uploadImageRefs = ref<any[]>([]);
// [audit fix] Các lưới ô ảnh "KHÔNG bắt buộc điền hết" (rtv 1-3 ảnh; Cửa hàng
// "Tạo mặc định" khi KHÔNG phải chế độ "Image to video") cho phép user điền ô
// SAU mà bỏ trống ô TRƯỚC — mảng formData.images sẽ có 1 phần tử "undefined"
// NẰM GIỮA 2 ảnh thật. Lúc gửi đi (services/product.ts, forEach KHÔNG bỏ qua
// phần tử đã gán rõ undefined, khác sparse hole thật) tạo request lỗi, và
// product.service.ts phía BE không lọc phần tử rỗng nên crash lúc đọc
// image.originalname. Thay vì chỉ lọc lúc gửi, DỒN LẠI ngay trên UI mỗi khi
// user chọn/xoá 1 ô — ảnh luôn tự xếp liền mạch từ ô đầu tiên. Nhận thêm
// refsArray vì có 2 lưới dùng ref khác nhau (uploadImageRefs cho rtv/
// my_subject, storeImageRefs cho Cửa hàng) nhưng cùng ghi vào formData.images.
// Áp dụng CẢ cho "Image to video" (Ảnh đầu/Ảnh cuối): pipeline bắt buộc phải
// có khung hình ĐẦU mới chạy được, nên nếu user chỉ nhập 1 ảnh (bất kể nhập ở
// ô "Ảnh đầu" hay "Ảnh cuối") thì ảnh đó PHẢI được đẩy về vị trí "Ảnh đầu"
// (index 0) — đúng ý nghĩa nó cần đóng vai trò khung hình đầu bắt buộc.
function compactImageSlots(refsArray: any[], totalSlots: number) {
  const refs = refsArray.slice(0, totalSlots);
  const filled = refs
    .map((ref: any) => ({ file: ref?.file, base64: ref?.base64 }))
    .filter((item: any) => item.base64);
  for (let i = 0; i < totalSlots; i++) {
    const item = filled[i];
    formData.images[i] = item?.file;
    refs[i]?.setFileValue(item?.base64 || "", item?.file);
  }
}
// Prompt gốc (formData.value) có thể rất dài (VD kịch bản thuyết trình vài
// nghìn ký tự) — mặc định thu gọn lại, cho nút "Xem thêm/Thu gọn" bung ra khi
// cần. Chỉ 1 state dùng chung cho 2 nơi hiện Prompt (storeOrder mặc định vs
// thường) vì chúng loại trừ nhau (v-if/v-else), không bao giờ cùng hiện 1 lúc.
const promptExpanded = ref(false);
const PROMPT_COLLAPSE_THRESHOLD = 400;
const isPromptLong = computed(
  () => (formData.value?.length || 0) > PROMPT_COLLAPSE_THRESHOLD,
);
const myTimeline = ref<HTMLDivElement | null>(null);
const pollTimer = ref<ReturnType<typeof setTimeout> | null>(null);

const client = computed<boolean>(() => {
  const win = window as any;
  return !!(win?.electronAPI && win?.electronAPI?.isElectron);
});

const formData = reactive<any>({
  title: "Video của tôi",
  value: "",
  frameRate: "horizontal",
  modelVideo: "veo3_fast",
  videoMode: "ttv",
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
  storeOrder: false,
  templateId: null,
  storePromptInputs: {} as Record<string, string>,
  // Chế độ THẬT đã dùng lúc tạo video này (đóng băng vĩnh viễn) — dùng để
  // hiện lại đúng số ô ảnh cho video ĐÃ TẠO, xem storeRequiresImage/
  // storeImageCount (KHÔNG được dựa vào videoMode HIỆN TẠI của mẫu, vì admin
  // có thể đổi mẫu sau khi video này đã tạo xong, làm sai lệch hiển thị).
  storeVideoMode: null as "text" | "image" | "reference" | null,
  imagesCount: 0,
  uploadedImages: [] as string[],
});

const productId = computed(() =>
  route.params.id !== "tao-moi" ? route.params.id : null,
);

// ── "Cửa hàng" (video theo mẫu) ─────────────────────────────────────────────
// Tạo mới: nhận diện qua ?templateId= trên URL ("default" = lựa chọn "Tạo mặc
// định"). Xem lại video đã có/reload trang: URL không còn giữ query nữa (đã
// router.replace sang /thu-vien-cua-toi/{id}) nên phải dựa vào formData.storeOrder
// (đọc từ chính ProductModel đã lưu — xem onGetProductDetail) để vẫn hiện đúng
// giao diện rút gọn + panel video mẫu, không bị rơi về giao diện video thường.
const storeTemplate = ref<any>(null);

const isStoreOrder = computed(() => {
  if (!productId.value) return Boolean(route.query.templateId);
  return Boolean(formData.storeOrder);
});

// "Tạo mặc định" (không theo mẫu) vẫn cho chọn 1 trong 3 chế độ giống hệt
// mẫu thật (Text/Image/Reference to video) — thay cho field "Template" (vốn
// chỉ hiện tên mẫu, không có tác dụng gì khi không có mẫu thật).
const defaultVideoMode = ref<"text" | "image" | "reference">("text");
const storeModeOptions = [
  { title: "Text to video", value: "text" },
  { title: "Image to video", value: "image" },
  { title: "Reference to video", value: "reference" },
];

// Đang XEM 1 video Cửa hàng ĐÃ TẠO (không phải đang sửa lại do lỗi) -> phải
// dựa vào CHÍNH VIDEO ĐÓ đã dùng gì lúc tạo (formData.imagesCount/storeVideoMode,
// đóng băng vĩnh viễn) — TUYỆT ĐỐI không dựa vào cấu hình HIỆN TẠI của mẫu
// (storeTemplate.value), vì admin có thể đổi mẫu (chế độ/số ảnh minh hoạ)
// SAU KHI video này đã tạo xong, làm hiện sai hẳn/mất luôn ảnh cũ. Đang tạo
// mới hoặc đang sửa lại do lỗi thì vẫn tính theo lựa chọn HIỆN TẠI trên form.
const isViewingExistingStoreOrder = computed(
  () => Boolean(productId.value) && !storeEditableOnError.value,
);

const storeRequiresImage = computed(() => {
  if (isViewingExistingStoreOrder.value) return (formData.imagesCount || 0) > 0;
  return storeTemplate.value?._id
    ? storeTemplate.value?.videoMode !== "text"
    : defaultVideoMode.value !== "text";
});
// Số ảnh THẬT bắt buộc phải tải — có mẫu thật thì khớp đúng SỐ ẢNH MINH HOẠ
// admin đã thực sự tải lên cho mẫu (exampleImages.length, VD admin chỉ tải
// 3/4 ảnh thì đây cũng chỉ 3); "Tạo mặc định" thì theo đúng số cố định của
// chế độ đã chọn (2 cho Image, 4 cho Reference), giống quy tắc bên admin.
const storeImageCount = computed(() => {
  if (isViewingExistingStoreOrder.value) return formData.imagesCount || 0;
  if (storeTemplate.value?._id) {
    if (storeTemplate.value?.videoMode === "text") return 0;
    return storeTemplate.value?.exampleImages?.length || 0;
  }
  if (defaultVideoMode.value === "reference") return 4;
  if (defaultVideoMode.value === "image") return 2;
  return 0;
});
const storeImageRefs = ref<any[]>([]);

// Video Cửa hàng (có mẫu hoặc "Tạo mặc định") không có ô "Thời lượng" để
// chọn lúc tạo (AI tự quyết định độ dài) — nên lúc video xong, hiện lại đúng
// ĐỘ DÀI THẬT đo được từ chính video đã tạo (KHÔNG dùng formData.videoDuration
// — với video Cửa hàng, giá trị đó chỉ là hằng số nội bộ không có ý nghĩa,
// xem product.service.ts videoAutomationStore).
const actualVideoDurationSec = ref<number | null>(null);
function onLoadActualVideoDuration(event: Event) {
  const seconds = (event.target as HTMLVideoElement)?.duration;
  actualVideoDurationSec.value = Number.isFinite(seconds) ? seconds : null;
}
const actualVideoDurationLabel = computed(() => {
  if (actualVideoDurationSec.value == null) return null;
  const totalSeconds = Math.round(actualVideoDurationSec.value);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
});

// storeTemplate.aspectRatio cấu hình khung hình cho video SẼ TẠO, KHÔNG chắc
// khớp với video demo (sampleVideo) admin tự upload để minh hoạ — đo kích
// thước THẬT của chính file sampleVideo mới chắc chắn đúng, tránh bị kéo dãn/
// crop sai tỷ lệ khi 2 giá trị lệch nhau.
const sampleVideoFrameRate = ref<string | null>(null);
function onLoadSampleVideoMetadata(event: Event) {
  const video = event.target as HTMLVideoElement;
  if (!video?.videoWidth || !video?.videoHeight) return;
  sampleVideoFrameRate.value =
    video.videoHeight > video.videoWidth ? "vertical" : "horizontal";
}
watch(
  () => storeTemplate.value?.sampleVideo,
  () => {
    sampleVideoFrameRate.value = null;
  },
);
const previewVideoFrameRate = computed(
  () =>
    sampleVideoFrameRate.value ||
    (storeTemplate.value?.aspectRatio === "PORTRAIT" ? "vertical" : "horizontal"),
);
// Chế độ THẬT đang áp dụng (xem video đã tạo thì theo chính video đó, không
// thì mẫu thật theo mẫu, còn lại theo lựa chọn defaultVideoMode) — dùng để
// đặt tên ô ảnh cho đúng ý nghĩa (VD Image to video là "ảnh đầu + ảnh cuối",
// không phải "ảnh 1 + ảnh 2" chung chung).
const storeImageMode = computed(() => {
  if (isViewingExistingStoreOrder.value) return formData.storeVideoMode;
  return storeTemplate.value?._id ? storeTemplate.value?.videoMode : defaultVideoMode.value;
});
function storeImageSlotLabel(n: number) {
  if (storeImageMode.value === "image") {
    return n === 1 ? "Ảnh đầu" : "Ảnh cuối";
  }
  return `Ảnh ${n}`;
}
// Có mẫu thật -> bắt buộc đủ HẾT các ô (đúng số ảnh admin đã cấu hình).
// "Tạo mặc định" -> chỉ cần TỐI THIỂU 1 ảnh, không bắt buộc chọn hết các ô
// (giống hệt điều kiện phía backend, xem product.service.ts).
const storeImagesValid = computed(() => {
  if (!storeRequiresImage.value) return true;
  const filled = storeImageRefs.value.filter((ref) => ref?.base64);
  if (storeTemplate.value?._id) {
    return filled.length === storeImageRefs.value.filter((ref) => ref).length;
  }
  return filled.length >= 1;
});

// Field do AI phân tích prompt sinh ra lúc admin tạo mẫu (xem
// store.service.ts analyzePrompt()) — HOÀN TOÀN linh động theo nội dung
// prompt, không cố định field nào. "Tạo mặc định" (không mẫu, storeTemplate
// là object giả) không có khái niệm này — luôn dùng ô "Nội dung video" tự do
// (formData.value) như cũ.
const storePromptFields = computed(() => storeTemplate.value?.promptFields || []);
const storePromptValues = reactive<Record<string, string>>({});
// storeTemplate (và storePromptFields theo nó) bị load lại nhiều lần với
// NỘI DUNG GIỐNG HỆT nhưng OBJECT MỚI (poll nền, loadStoreTemplate() gọi lại
// lúc "Tạo lại video" sau lỗi...) — nếu XOÁ SẠCH rồi set lại toàn bộ mỗi lần
// như cũ thì giá trị user ĐANG GÕ DỞ (hoặc đã gõ, chưa kịp bấm tạo) bị ghi
// đè mất về lại defaultValue của mẫu, y hệt lỗi user báo. Chỉ dọn key KHÔNG
// còn tồn tại (đổi mẫu thật) + điền cho key MỚI xuất hiện, giữ nguyên giá
// trị đã có sẵn. Lúc điền lần đầu cho 1 key, ƯU TIÊN giá trị THẬT user đã
// gửi lên ở lần tạo TRƯỚC (formData.storePromptInputs, có khi xem lại/reload
// video Cửa hàng đang lỗi) hơn f.defaultValue (chỉ là gợi ý chung của mẫu,
// KHÔNG phải nội dung user đã nhập) — nếu không, "Tạo lại video" sau lỗi sẽ
// hiện lại đúng defaultValue của mẫu thay vì thứ user đã tự sửa/gõ.
watch(
  storePromptFields,
  (fields) => {
    const validKeys = new Set(fields.map((f: any) => f.key));
    Object.keys(storePromptValues).forEach((k) => {
      if (!validKeys.has(k)) delete storePromptValues[k];
    });
    fields.forEach((f: any) => {
      if (!(f.key in storePromptValues)) {
        storePromptValues[f.key] =
          formData.storePromptInputs?.[f.key] || f.defaultValue || "";
      }
    });
  },
  { immediate: true },
);

async function loadStoreTemplate() {
  const rawId = !productId.value
    ? (route.query.templateId as string | undefined)
    : formData.templateId || null;
  const realId = rawId && rawId !== "default" ? rawId : null;

  try {
    if (realId) {
      const res = await storeService.getTemplateDetail(realId);
      storeTemplate.value = res.data;
      if (!productId.value) {
        formData.frameRate =
          res.data.aspectRatio === "PORTRAIT" ? "vertical" : "horizontal";
      }
    } else {
      const res = await storeService.getDefaultPrice();
      storeTemplate.value = {
        _id: null,
        title: "Tạo mặc định",
        promptFields: [],
        videoMode: "text",
        aspectRatio: "LANDSCAPE",
        price: res.data?.price || 0,
        discountedPrice: res.data?.discountedPrice ?? null,
        thumbnail: "",
        sampleVideo: "",
      };
    }
  } catch (error) {
    console.log("Lỗi khi tải thông tin mẫu!", error);
  }
}

// Thanh % giả tăng dần (KHÔNG phải tiến trình thật — video theo mẫu chỉ có 1
// cảnh nên không có nhiều mốc [%] thật như video thường) — chỉ để user thấy
// hệ thống vẫn đang chạy, dừng ở 99% chờ video thật xong thì hiện luôn video.
const fakeProgress = ref(0);
let fakeProgressTimer: ReturnType<typeof setInterval> | null = null;

const storeGenerating = computed(
  () =>
    isStoreOrder.value &&
    Boolean(productId.value) &&
    !formData.video &&
    !isError.value,
);

// [đơn giản hoá theo yêu cầu user] KHÔNG còn nhớ/tính lại % qua các lần F5
// nữa — chỉ là thanh % giả chạy random-walk từ 0, F5 lại thì về 0% lại, chấp
// nhận được (video thật vẫn tiếp tục chạy ngầm trên server, không ảnh hưởng).
function startFakeProgress(startAt?: number) {
  // Thanh đang chạy sẵn rồi (interval đã tồn tại) mà KHÔNG phải lệnh reset
  // tường minh (startAt=0 lúc vừa bấm nút) -> bỏ qua, không restart lại giữa
  // chừng (tránh giật số khi watch(storeGenerating,...) tự trigger lại).
  if (startAt === undefined && fakeProgressTimer) return;

  if (startAt !== undefined) {
    fakeProgress.value = startAt;
  }
  if (fakeProgressTimer) clearInterval(fakeProgressTimer);
  fakeProgressTimer = setInterval(() => {
    if (fakeProgress.value >= 99) return;
    fakeProgress.value = Math.min(
      99,
      fakeProgress.value + Math.floor(Math.random() * 4) + 1,
    );
  }, 2000);
}

function stopFakeProgress() {
  if (fakeProgressTimer) {
    clearInterval(fakeProgressTimer);
    fakeProgressTimer = null;
  }
}

// KHÔNG immediate: true — nếu bắn ngay lúc setup component (trước khi
// onGetProductDetail() ở onMounted kịp tải data thật), sẽ tạo 1 interval
// "non" chạy từ formData.createdAt còn rỗng (-> 0%), rồi guard mới ở
// startFakeProgress() (bỏ qua nếu interval đã chạy sẵn) lại chặn luôn cả
// lần tính đúng SAU KHI data thật tải xong (xem onMounted) — F5 lại trang
// sẽ kẹt ở 0% y hệt lỗi cũ. Để onMounted tự gọi startFakeProgress() 1 lần
// đúng lúc (sau khi có data thật) làm điểm khởi đầu chuẩn; watch này chỉ lo
// các lần CHUYỂN TRẠNG THÁI sau đó (đang chạy -> lỗi/xong, hoặc ngược lại).
watch(storeGenerating, (val) => (val ? startFakeProgress() : stopFakeProgress()));

// Vừa bấm "Tạo video" (isStoreOrder) là hiện ngay "Đang tạo video... %",
// KHÔNG đợi router.replace đổi route xong (storeGenerating chỉ true SAU đó,
// dựa vào productId lấy từ route) — khoảng chờ giữa lúc bấm và lúc route đổi
// (gọi API + onGetProductDetail() load lại formData) mới là thứ khiến cả
// trang bị "giật giật" nhìn thấy được; che khoảng đó bằng nút progress ngay
// từ lúc bấm thì phần còn lại của trang có đổi bên dưới cũng không ai để ý.
const submittingStoreOrder = ref(false);
const showStoreProgress = computed(
  () => storeGenerating.value || submittingStoreOrder.value,
);
watch(storeGenerating, (val) => {
  if (val) submittingStoreOrder.value = false;
});

const isError = computed(() =>
  Boolean(
    productId.value &&
    formData.messages.length &&
    formData.messages[formData.messages.length - 1]?.color === "error",
  ),
);

// Video "Cửa hàng" LUÔN hiện video mẫu ở panel bên phải (kể cả lúc lỗi) —
// không có timeline message thật như video thường để tự nhiên hiện lỗi, nên
// cần 1 card lỗi riêng ngay trên nút "Tạo lại video". Cùng nguyên tắc với
// timeline message thường: user thấy note thân thiện, admin thấy thêm
// errorMsg kỹ thuật để debug (xem item.errorMsg ở message-timeline).
const lastErrorMessage = computed(() =>
  isError.value ? formData.messages[formData.messages.length - 1] : null,
);

// Video "Cửa hàng" bị lỗi -> mở khoá lại các field để user tự sửa nội
// dung/ảnh rồi bấm "Tạo lại video", KHÔNG áp dụng cho video thường (gói) —
// giữ nguyên hành vi khoá field cũ cho video thường dù đang lỗi.
const storeEditableOnError = computed(() => isStoreOrder.value && isError.value);

// Đang chờ trong hàng đợi: message cuối là grey (chưa có primary/success nào sau đó)
const queueMessage = computed(() => {
  if (!formData.messages.length) return null;
  const last = formData.messages[formData.messages.length - 1];
  if (last?.color === "grey" && last?.title?.includes("hàng đợi")) return last;
  return null;
});

const queuePosition = computed(() => {
  if (!queueMessage.value) return null;
  const match = queueMessage.value.title?.match(/#(\d+)/);
  return match ? parseInt(match[1]) : null;
});

// Phần trăm và màu cho thanh cảnh của user
const userScenePct = computed(() => {
  const s = videoFlow.value?.userScene;
  if (!s || !s.budget) return 0;
  return Math.min(100, Math.round((s.used / s.budget) * 100));
});

const userSceneColor = computed(() => {
  const pct = userScenePct.value;
  if (pct >= 100) return "#c62828"; // đỏ đậm — hết budget
  if (pct >= 67) return "deep-orange"; // cam đậm
  if (pct >= 34) return "orange"; // cam
  return "green"; // còn thoải mái
});

// videoFlow nhưng điều chỉnh title theo trạng thái video hiện tại
const displayFlow = computed(() => {
  if (!videoFlow.value || !Object.keys(videoFlow.value).length)
    return videoFlow.value;

  const msgs: any[] = formData.messages;
  const lastColor = msgs.length ? msgs[msgs.length - 1]?.color : null;

  // Video đang xử lý (primary) → bỏ thông báo "sẽ vào hàng đợi", chỉ báo tải
  if (lastColor === "primary" && videoFlow.value.value >= 100) {
    return { ...videoFlow.value, title: "Hệ thống đang chạy hết công suất!" };
  }

  // Video đang trong queue (grey) → thay bằng thông báo "đang trong hàng đợi"
  if (lastColor === "grey" && videoFlow.value.value >= 100) {
    return {
      ...videoFlow.value,
      title: "Hệ thống đang đầy tải — video của bạn đang trong hàng đợi",
    };
  }

  return videoFlow.value;
});

const modelVideoOptions = computed(() => {
  return onGetterMasterData.value["model-video"] || [];
});

const videoModeOptions = computed(() => {
  // itv (CUSTOM_SCENES) đã gộp SÂU "custom_process" cũ ngay ở BE (không còn
  // là videoMode riêng — phân biệt lại qua videoStyle=smooth_transition THẬT,
  // xem videoStyleOptions), nên master-data giờ trả về đúng 1 dòng cho itv,
  // không cần map/lọc lại gì ở đây nữa. Thứ tự hiển thị theo đúng thứ tự gốc
  // từ master-data (BE), không cần sắp xếp lại thủ công.
  return onGetterMasterData.value["video-mode"] || [];
});

const videoModeSelectableOptions = computed(() => videoModeOptions.value);

const frameRateOptions = computed(
  () => onGetterMasterData.value["frame-rate"] || [],
);

const videoStyleOptions = computed(() => {
  let list = onGetterMasterData.value["video-style"] || [];

  // Theo yêu cầu chủ ý: MỌI chế độ chỉ còn "Mặc định" (general) cho Phong
  // cách — quá nhiều lựa chọn trước đây không hiệu quả. Riêng "Chủ thể của
  // tôi" (my_subject) là NGOẠI LỆ DUY NHẤT, giữ nguyên đầy đủ lựa chọn cũ.
  if (formData.videoMode === "my_subject") {
    return list.filter((x: any) =>
      ["general", "testimonial", "shorts"].includes(x.value),
    );
  }

  // itv (CUSTOM_SCENES) — "Chuyển cảnh mượt" giờ là videoStyle THẬT gửi BE
  // (trước đây videoMode riêng "custom_process", đã gộp sâu). "Tùy chọn" vẫn
  // là lựa chọn "ảo" (không map thẳng vào formData.videoStyle thật — điều
  // khiển bởi customModeStyleChoice, xem videoStyleFieldModel bên dưới).
  if (formData.videoMode === "itv") {
    return [
      { title: "Mặc định", value: "general" },
      { title: "Chuyển cảnh mượt", value: "smooth_transition" },
      { title: "Tùy chỉnh", value: "custom_prompt" },
    ];
  }

  // "Text to video"/"rtv" — cho phép user tự nhập tay prompt từng cảnh (bỏ
  // qua AI phân tích, xem onSubmitNormal) thay vì chỉ 1 lựa chọn Mặc định
  // như các mode khác.
  if (["ttv", "rtv"].includes(formData.videoMode)) {
    return [
      { title: "Mặc định", value: "general" },
      { title: "Tùy chỉnh", value: "custom_prompt" },
    ];
  }

  return list.filter((x: any) => ["general"].includes(x.value));
});

// Các mode có ô Phong cách "ảo" "Tùy chọn" (không map thẳng vào
// formData.videoStyle thật — chỉ isCustomPrompt=true mới có ý nghĩa, xem
// buildCustomPromptScenes) — dùng chung 1 danh sách để videoStyleFieldModel/
// onSubmitNormal/onGetProductDetail tham chiếu, tránh lặp điều kiện rải rác
// nhiều nơi. itv (CUSTOM_SCENES) vẫn cần proxy này DÙ "Mặc định"/"Chuyển
// cảnh mượt" đã là videoStyle thật — chỉ riêng "Tùy chọn" của itv vẫn ảo.
const CUSTOM_STYLE_PROXY_MODES = ["itv", "ttv", "rtv"];

// Lựa chọn Phong cách RIÊNG cho các mode ở trên — 1 biến local thuần UI,
// KHÔNG ghi đè lên formData.videoStyle (field đó luôn giữ đúng nghĩa "phong
// cách thật" gửi BE, tránh tình trạng đọc code thấy videoStyle mang giá trị
// trông như tên 1 videoMode hoặc "custom_prompt").
const customModeStyleChoice = ref<
  "general" | "smooth_transition" | "custom_prompt"
>("general");

// Model cho ô "Phong cách": ở các mode trong CUSTOM_STYLE_PROXY_MODES thì
// đọc/ghi customModeStyleChoice ở trên; mode khác thì đọc/ghi thẳng
// formData.videoStyle như bình thường. Dùng 1 proxy này cho MỌI nơi đang
// hiển thị/chỉnh "Phong cách" (ô chọn lúc tạo, thẻ thông tin readonly...) để
// không phải rải điều kiện if/else lặp lại ở từng nơi.
const videoStyleFieldModel = computed<string>({
  get: () =>
    CUSTOM_STYLE_PROXY_MODES.includes(formData.videoMode)
      ? customModeStyleChoice.value
      : formData.videoStyle,
  set: (val: string) => {
    if (CUSTOM_STYLE_PROXY_MODES.includes(formData.videoMode)) {
      customModeStyleChoice.value = val as
        | "general"
        | "smooth_transition"
        | "custom_prompt";
    } else {
      formData.videoStyle = val;
    }
  },
});

// true khi user đang ở "Tùy chọn" (tự nhập tay prompt từng cảnh, bỏ qua AI).
const isCustomPromptMode = computed(
  () =>
    CUSTOM_STYLE_PROXY_MODES.includes(formData.videoMode) &&
    customModeStyleChoice.value === "custom_prompt",
);

// Số ô prompt cần hiện = đúng số cảnh đã chọn ở Thời lượng (mỗi cảnh 8s —
// videoDuration chọn CHÍNH LÀ số cảnh, xem videoDurationOptions).
const customPromptSceneCount = computed(() => +formData.videoDuration || 1);

// Nội dung user tự gõ cho từng cảnh — index 0 = cảnh 1. Không cần pre-size,
// Vue 3 reactive() xử lý gán theo index bình thường (giống formData.images).
const customScenePrompts = reactive<string[]>([]);

// Logic thuần tách text theo "---" rồi phân bổ vào customScenePrompts bắt
// đầu từ startIndex, dừng khi hết ô (bỏ đoạn dư phía sau, không báo lỗi).
// Trả về false nếu text không có dấu tách -> để hành vi dán mặc định của
// trình duyệt (không can thiệp). Tách riêng khỏi onScenePromptPaste (nhận
// ClipboardEvent, phụ thuộc DOM) để test được logic tách/phân bổ độc lập.
const distributePastedScenePrompts = (text: string, startIndex: number) => {
  if (!/-{3,}/.test(text)) return false;

  const parts = text
    .split(/-{3,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  parts.forEach((part, i) => {
    const targetIndex = startIndex + i;
    if (targetIndex < customPromptSceneCount.value) {
      customScenePrompts[targetIndex] = part;
    }
  });
  return true;
};

// Dán 1 khối text có nhiều đoạn ngăn cách bởi "---" vào 1 ô Prompt bất kỳ ->
// tự tách và điền lần lượt vào CHÍNH ô đó + các ô kế tiếp, thay vì phải
// copy/paste tay từng ô một.
const onScenePromptPaste = (event: ClipboardEvent, startIndex: number) => {
  const pasted = event.clipboardData?.getData("text") || "";
  if (distributePastedScenePrompts(pasted, startIndex)) {
    event.preventDefault();
  }
};

const videoDurationOptions = computed(() => {
  // let allOptions =
  //   onGetterMasterData.value["video-duration"]?.filter(
  //     (option: any) =>
  //       !["76", "72", "68", "64", "60", "56", "52", "48", "44"].includes(
  //         option.value
  //       )
  //   ) || [];

  let allOptions = onGetterMasterData.value["video-duration"] || [];

  allOptions =
    allOptions?.map((x: any, index: number) => ({
      title: `${x.title} - (${index + 1} cảnh)`,
      value: x.value,
    })) || [];

  if (productId.value) {
    return allOptions;
  }

  // [2026-08-28] TTV: nới từ 45 lên 75 cảnh (10:00 chẵn, theo yêu cầu user)
  // thay vì 10:08 lẻ (trần cao nhất hệ thống). Rủi ro cũ (gpt-4o-mini "đuối"
  // với story quá dài trong 1 lần gọi, xem generate-scene-chatgpt.ts/
  // prompt-chatgpt/index.ts promptMovie) vẫn còn đó, user đã biết và chấp
  // nhận rủi ro này.
  if (formData.videoMode === "ttv") {
    return allOptions.filter((option: any) => +option.value <= 75);
  }

  if (
    ["object_sync", "rtv"].includes(formData.videoMode)
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
    ["my_subject", "continuous_shot", "itv"].includes(formData.videoMode)
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

// Thay cho socket (io.emit bắn 1 lần, không phát lại nếu client rớt kết nối
// đúng lúc đó — có trường hợp UI đứng yên mãi phải reload mới thấy cập nhật).
// Poll lại API cho tới khi có video cuối cùng (ghép xong) — đảm bảo luôn
// nhận được trạng thái đúng, chỉ đánh đổi độ trễ.
const POLL_INTERVAL_ACTIVE_MS = 10_000;
// Khi đã rơi vào lỗi: KHÔNG dừng hẳn, chỉ poll thưa hơn — vì có thể bị "tạo
// lại giúp" từ nơi khác không đi qua onSubmit() của chính trang này (VD admin
// bấm nút xoay tròn ở trang Thước phim/Tạo bị lỗi — components/admin/
// VideoTable.vue gọi thẳng saveProduct, không liên quan gì tới trang đang mở
// của user), hoặc chính user tự bấm "Tạo lại" ở 1 tab khác. Nếu dừng hẳn thì
// trang đang mở sẽ đứng yên mãi không hề hay biết, phải tự reload mới thấy.
const POLL_INTERVAL_ERROR_MS = 30_000;

const stopPolling = () => {
  if (pollTimer.value) {
    clearTimeout(pollTimer.value);
    pollTimer.value = null;
  }
};

// pollTimer.value KHÔNG phản ánh đúng "đang gọi API hay không" — nó vẫn giữ
// nguyên ID (đã hết hạn, vô hại) suốt lúc pollTick() đang await, chỉ được
// gán ID mới ở CUỐI hàm. Nếu onLiveHint() bắn đúng lúc này, nó sẽ tưởng đang
// rảnh và lên lịch thêm 1 lượt pollTick() chạy chồng. Dùng cờ riêng để chặn.
let isPolling = false;

const pollTick = async () => {
  if (isPolling) return;
  isPolling = true;

  const prevMessageCount = formData.messages.length;
  const hadVideo = Boolean(formData.video);

  await onGetProductDetail("", false, false).finally(() => {
    isPolling = false;
  });

  if (formData.video) {
    stopPolling();
    if (!hadVideo) nextTick(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    return;
  }

  // Chỉ cuộn khi thực sự có cập nhật mới, tránh giật màn hình mỗi lần poll
  if (formData.messages.length !== prevMessageCount) {
    nextTick(() => scrollToTimeline());
  }

  pollTimer.value = setTimeout(
    pollTick,
    isError.value ? POLL_INTERVAL_ERROR_MS : POLL_INTERVAL_ACTIVE_MS,
  );
};

// idOverride: dùng khi gọi ngay sau router.replace() cho video MỚI tạo lần
// đầu — productId.value (computed theo route) CHƯA kịp cập nhật lúc này
// (router.replace chưa resolve xong), nếu chỉ dựa vào nó thì hàm sẽ tự thoát
// sớm và không bao giờ bắt đầu poll. pollTick() bên trong vẫn luôn đọc
// productId.value tại THỜI ĐIỂM CHẠY (sau delay), lúc đó route đã cập nhật
// xong nên không cần truyền override vào tận trong.
const startPolling = (idOverride?: string) => {
  const pid = idOverride || productId.value;
  if (!pid || pollTimer.value || formData.video) return;
  pollTimer.value = setTimeout(
    pollTick,
    isError.value ? POLL_INTERVAL_ERROR_MS : POLL_INTERVAL_ACTIVE_MS,
  );
};

// Server có sẵn 1 chỗ bắn socket riêng cho đúng case admin bấm "tạo lại
// giúp" (impersonate) — xem product.service.ts: io.emit khi có
// request.impersonatedBy. Không tin thẳng payload của event này (đó là lý
// do bỏ socket ở trên) — chỉ dùng làm tín hiệu "có gì đó vừa đổi, poll ngay
// đi" để rút ngắn độ trễ từ tối đa 30s xuống gần như tức thời khi socket may
// mắn tới nơi; poll định kỳ vẫn là lưới an toàn chính nếu socket bị rớt.
const onLiveHint = () => {
  // Đang bận gọi API rồi thì thôi — lượt đang chạy sẽ tự lấy dữ liệu mới
  // nhất, không cần giục thêm (tránh chạy chồng 2 pollTick() cùng lúc).
  if (isPolling || !pollTimer.value) return;
  clearTimeout(pollTimer.value);
  pollTimer.value = setTimeout(pollTick, 0);
};

// Trình duyệt (đặc biệt mobile) tạm dừng/throttle nặng setTimeout khi tab bị
// đưa xuống nền — quay lại tab có thể phải đợi hết chu kỳ hiện tại (tối đa
// POLL_INTERVAL_ERROR_MS) mới thấy cập nhật dù server đã có dữ liệu mới từ
// lâu. Poll ngay khi tab active trở lại để rút ngắn độ trễ đó.
const onVisibilityChange = () => {
  if (document.visibilityState === "visible") onLiveHint();
};

const onGetProductDetail = async (
  loadingType: string = "",
  // Poll định kỳ gọi lại API này liên tục (tối đa 2 tiếng) — 1 lần lỗi mạng/
  // timeout thoáng qua giữa chừng KHÔNG được đá người dùng ra trang tạo mới,
  // chỉ bỏ qua lượt đó rồi tự thử lại ở lượt poll kế tiếp. Chỉ redirect khi lần load ĐẦU
  // TIÊN thật sự xác nhận sản phẩm không tồn tại/lỗi.
  redirectOnError: boolean = true,
  // Ngân sách cảnh (videoFlow) gần như không đổi trong lúc đang theo dõi 1
  // video — chỉ cần lấy 1 lần lúc vào trang, KHÔNG cần gọi lại mỗi lượt poll
  // (5-30s/lần, kéo dài tới 2 tiếng) vì tốn request vô ích không mang lại
  // thông tin gì mới.
  includeFlow: boolean = true,
  // idOverride: dùng ngay sau khi tạo/tạo lại video Cửa hàng — mỗi lần submit
  // luôn sinh _id MỚI (khác video thường, xem _videoAutomationStoreLocked),
  // nên productId.value (computed theo route) lúc này VẪN CÒN LÀ ID CŨ (chưa
  // kịp router.replace) — nếu chỉ dựa productId.value, hàm sẽ fetch NHẦM sản
  // phẩm cũ (đã lỗi), khiến formData.createdAt/messages bị ghi đè lại giá
  // trị cũ giữa chừng (gây fakeProgress tính sai/nhảy %, xem afterCreateProduct).
  idOverride?: string,
) => {
  if (includeFlow) {
    await masterDataService
      .getVideoFlow()
      .then((res) => {
        videoFlow.value = res?.data || {};
      })
      .catch(() => {});
  }

  const pid = idOverride || productId.value;
  if (!pid) return;

  loading.value = loadingType;
  await productService
    // silent = !redirectOnError: cùng 1 tín hiệu "đây là poll nền" — poll thì
    // không redirect khi lỗi (đã sửa trước) VÀ cũng không nên bật popup lỗi
    // toàn cục (services/axios.ts) cho 1 lần lỗi mạng thoáng qua.
    .getDetailProduct({ _id: pid }, !redirectOnError)
    .then(async (res) => {
      const data = res?.data;
      if (data) {
        formData.title = data.title;
        formData.value = data.value;
        formData.frameRate = data.frameRate;
        formData.modelVideo = data.modelVideo;
        formData.videoMode = data.videoMode;
        // Vue Router tái dùng instance khi chỉ đổi param (route /:id) — nếu
        // video TRƯỚC đó đang xem là "Tùy chọn"/"Chuyển cảnh mượt",
        // customModeStyleChoice sẽ còn giữ giá trị CŨ khi chuyển sang xem 1
        // video KHÁC không dùng các lựa chọn này (không có nhánh nào bên
        // dưới đụng tới nó) — reset về mặc định trước, để các nhánh dưới tự
        // ghi đè lại đúng nếu cần.
        customModeStyleChoice.value = "general";
        customScenePrompts.splice(0, customScenePrompts.length);
        if (data.isCustomPrompt) {
          // "Tùy chọn" (tự nhập tay prompt từng cảnh) — nạp lại đúng lựa
          // chọn Phong cách + nội dung từng ô prompt đã lưu. Áp dụng cho cả
          // 3 mode hỗ trợ (xem CUSTOM_STYLE_PROXY_MODES). description ===
          // prompt vì BE lưu cả 2 field bằng đúng text user đã gõ (xem
          // product.service.ts buildCustomPromptScenes), nên chỉ cần đọc
          // description (field DUY NHẤT mà user thường/không phải admin
          // cũng nhận được, xem getById).
          formData.videoStyle = "general";
          customModeStyleChoice.value = "custom_prompt";
          customScenePrompts.splice(
            0,
            customScenePrompts.length,
            ...(Array.isArray(data.prompts)
              ? data.prompts.map((p: any) => p.description || "")
              : []),
          );
        } else if (
          data.videoMode === "itv" &&
          data.videoStyle === "smooth_transition"
        ) {
          // itv (CUSTOM_SCENES) — "Chuyển cảnh mượt" giờ là videoStyle THẬT
          // (trước đây là videoMode riêng "custom_process", suy luận gián
          // tiếp qua videoMode — giờ đọc thẳng data.videoStyle là đủ).
          formData.videoStyle = "smooth_transition";
          customModeStyleChoice.value = "smooth_transition";
        } else {
          // [2026-08-29] LUÔN tin thẳng data.videoStyle để HIỂN THỊ — trước
          // đây kiểm tra "còn nằm trong videoStyleOptions hiện tại không" NGAY
          // TẠI ĐÂY để phát hiện style đã bị gỡ khỏi hệ thống, nhưng
          // videoStyleOptions phụ thuộc danh sách "video-style" tải RIÊNG (ở
          // layouts/default.vue, song song lúc mở app) — nếu API chi tiết
          // video này trả về TRƯỚC KHI danh sách đó tải xong, videoStyleOptions
          // rỗng → luôn rơi vào fallback "general" dù giá trị thật vẫn hợp lệ
          // (race condition, gây hiện sai "Mặc định" dù data thật là
          // "testimonial" — bug thật gặp trên production). Việc kiểm tra "còn
          // hợp lệ để GỬI ĐI không" chỉ thật sự cần lúc SUBMIT (xem
          // onSubmitNormal), tách ra khỏi lúc hiển thị để không còn phụ thuộc
          // thời điểm tải xong của 1 API khác.
          formData.videoStyle = data.videoStyle;
        }
        formData.videoDuration = data.videoDuration;
        formData.author = data.author;
        formData.images = [];
        formData.hasImage = Boolean(
          Array.isArray(data.images) && data.images.length,
        );
        // Số ảnh THẬT đã upload cho CHÍNH video này — dùng để hiện lại đúng
        // số ô ảnh cho video Cửa hàng ĐÃ TẠO (xem storeImageCount), KHÔNG
        // dựa vào exampleImages.length của mẫu (mẫu có thể đã bị admin đổi
        // sau khi video này tạo xong, làm số ô hiện sai/mất hẳn ảnh cũ).
        formData.imagesCount = Array.isArray(data.images) ? data.images.length : 0;
        // URL thật của các ảnh đã upload — hiện lại (read-only) khi video đã
        // xong, dùng chung cho cả Cửa hàng lẫn "Chủ thể của tôi"/"Tùy chỉnh
        // nhân vật" (xem .info-section), KHÁC formData.images ở trên (chỉ
        // dùng cho trạng thái ô upload lúc TẠO/SỬA).
        formData.uploadedImages = Array.isArray(data.images) ? data.images : [];
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
        formData.storeOrder = data.storeOrder || false;
        formData.templateId = data.templateId || null;
        formData.storePromptInputs = data.storePromptInputs || {};
        formData.storeVideoMode = data.storeVideoMode || null;
        // "Tạo mặc định" (không có templateId) — khôi phục lại đúng chế độ đã
        // chọn lúc tạo (quyết định số ô ảnh yêu cầu, xem storeImageCount).
        if (data.storeOrder && !data.templateId && data.storeVideoMode) {
          defaultVideoMode.value = data.storeVideoMode;
        }

        // LUÔN tải lại mẫu cho ĐÚNG video hiện tại — KHÔNG được chỉ tải khi
        // storeTemplate.value còn rỗng: nếu user xem/tạo 1 video Cửa hàng
        // KHÁC ngay trước đó rồi chuyển sang video này (điều hướng trong app,
        // không load lại toàn trang), storeTemplate.value vẫn còn dữ liệu CŨ
        // của video trước, khiến điều kiện rỗng sai, bỏ lỡ tải lại mẫu đúng —
        // số ô ảnh tính sai, ảnh đã upload không hiện lại được. Đồng thời
        // phải AWAIT xong mới populate storeImageRefs bên dưới, nếu không lúc
        // setTimeout chạy storeTemplate.value chưa kịp cập nhật.
        if (formData.storeOrder) {
          await loadStoreTemplate();
        }

        setTimeout(() => {
          if (formData.storeOrder) {
            storeImageRefs.value.forEach((ref, index) => {
              ref?.setValue(data.images[index]);
            });
          } else if (
            ["my_subject", "rtv", "itv"].includes(formData.videoMode)
          ) {
            // Khôi phục lại ảnh đã chọn cho các Ô UPLOAD Ở FORM TẠO/SỬA khi
            // "Tạo lại" video lỗi (KHÔNG liên quan màn hình READONLY xem video
            // đã hoàn thành — chỗ đó giờ hiện ảnh thật qua formData.uploadedImages
            // trực tiếp, không qua UploadImage/setValue nữa, xem template).
            // "Chủ thể của tôi" giờ cũng dùng chung mảng ref uploadImageRefs
            // với custom_character (ref đơn uploadImageRef cũ đã xoá hẳn).
            uploadImageRefs.value.forEach((ref, index) => {
              ref?.setValue(data.images[index]);
            });
          }
        }, 100);
      } else if (redirectOnError) {
        router.replace("/thu-vien-cua-toi/tao-moi");
      }
    })
    .catch(() => {
      if (redirectOnError) router.replace("/thu-vien-cua-toi/tao-moi");
    })
    .finally(() => {
      loading.value = "";
    });
};

// idOverride/onSaved: dùng chung bởi onSubmitNormal() lẫn onSubmitStoreOrder()
// (2 luồng gọi 2 API backend khác hẳn nhau — xem product.service.ts
// videoAutomation vs videoAutomationStore) để không lặp lại đoạn xử lý sau khi
// tạo xong (poll, socket, router.replace) — y hệt logic gốc, chỉ tách phần gọi
// API ra ngoài.
const afterCreateProduct = async (newProductId?: string) => {
  if (!newProductId) return;
  await onGetProductDetail("", true, true, newProductId);
  formData.messages = formData.messages?.length
    ? formData.messages
    : [{ title: "Đang xử lý...", dateTime: "", color: "primary" }];
  router.replace(`/thu-vien-cua-toi/${newProductId}`);
  if (!formData.video) {
    // "Tạo lại video": trang đang có sẵn 1 pollTimer CŨ (poll cho sản phẩm
    // lỗi trước đó, xem onMounted) còn treo — startPolling() có guard chặn
    // set thêm timer nếu pollTimer.value đã có, khiến việc theo dõi sản
    // phẩm MỚI không bao giờ tự khởi động được. Phải dọn timer cũ trước.
    stopPolling();
    startPolling(newProductId);
    $socket.off(`server:product-detail:${newProductId}`, onLiveHint);
    $socket.on(`server:product-detail:${newProductId}`, onLiveHint);
    document.addEventListener("visibilitychange", onVisibilityChange);
  }
};

const onSubmitStoreOrder = async () => {
  if (storeTemplate.value?._id) {
    if (storePromptFields.value.some((f: any) => !storePromptValues[f.key])) return;
  } else if (!formData.value) {
    return;
  }
  if (!storeImagesValid.value) {
    return;
  }

  loading.value = "submit";
  submittingStoreOrder.value = true;
  startFakeProgress(0);
  // "Tạo lại video" tạo _id MỚI (khác video thường) nên trong lúc chờ API +
  // fetch dữ liệu sản phẩm mới xong, pollTimer CŨ (poll cho sản phẩm lỗi
  // trước đó) vẫn có thể tự bắn lên bất cứ lúc nào, ghi đè formData bằng dữ
  // liệu CŨ lần nữa (kể cả sau khi afterCreateProduct() đã fetch đúng data
  // mới) — phải dừng NGAY LÚC BẤM, trước khi làm gì khác, không đợi tới
  // afterCreateProduct() mới dừng (lúc đó có thể đã trễ).
  stopPolling();

  await productService
    .saveProductStore({
      title: formData.title,
      templateId: storeTemplate.value?._id || undefined,
      videoMode: !storeTemplate.value?._id ? defaultVideoMode.value : undefined,
      promptInput: !storeTemplate.value?._id ? formData.value || undefined : undefined,
      promptInputs: storeTemplate.value?._id ? { ...storePromptValues } : undefined,
      aspectRatio: formData.frameRate === "vertical" ? "PORTRAIT" : "LANDSCAPE",
      images: storeImageRefs.value
        .filter((ref) => ref)
        .map((ref) => ref.file)
        .filter(Boolean),
      // "Tạo lại video" sau lỗi: ảnh đã có sẵn từ lần trước (setValue, chỉ có
      // base64/URL, KHÔNG có .file) mà user không chọn lại thì vẫn phải gửi
      // lên được — nếu không, .filter(Boolean) ở "images" bên trên sẽ âm thầm
      // bỏ mất ảnh đó, khiến "Mẫu này yêu cầu tải lên đúng N ảnh!" báo lỗi dù
      // ảnh vẫn đang hiện rõ trên UI.
      imagesMeta: storeImageRefs.value
        .filter((ref) => ref)
        .map((ref) => (ref.file ? null : ref.base64 || null)),
    })
    .then(async (res) => {
      await afterCreateProduct(res?.data?.productId);
    })
    .catch(() => {
      loading.value = "";
      submittingStoreOrder.value = false;
      stopFakeProgress();
    });
};

const onSubmitNormal = async () => {
  // "Tùy chọn" ẩn ô Prompt gốc (formData.value) đi vì AI không còn đọc tới
  // nó nữa — không thể bắt buộc user điền ô đã ẩn, payload.value sẽ được tự
  // ghép lại từ các ô Prompt N bên dưới để vẫn thoả ràng buộc "required" của
  // BE (product.schema.ts).
  if (!formData.title || (!formData.value && !isCustomPromptMode.value)) return;

  loading.value = "submit";
  if (productId.value) formData._id = productId.value;

  if (!["my_subject", "rtv", "itv"].includes(formData.videoMode)) {
    delete formData.images;
  }

  if (client.value) formData.client = true;

  // Lựa chọn Phong cách "ảo" (customModeStyleChoice) của các mode trong
  // CUSTOM_STYLE_PROXY_MODES dịch lại đúng nghĩa thật CHỈ trong payload gửi
  // đi — KHÔNG mutate formData.videoMode/videoStyle thật (đang hiển thị trên
  // UI). itv KHÔNG còn cần đổi videoMode nữa (custom_process đã gộp sâu
  // thành videoStyle=smooth_transition THẬT của itv) — chỉ còn "Tùy chọn"
  // vẫn là giá trị ảo cần dịch lại thành videoStyle="general" + isCustomPrompt.
  const payload = { ...formData };
  if (formData.videoMode === "itv") {
    payload.videoStyle =
      customModeStyleChoice.value === "smooth_transition"
        ? "smooth_transition"
        : "general";
  } else if (["ttv", "rtv"].includes(formData.videoMode)) {
    // "custom_prompt" không phải giá trị videoStyle thật BE chấp nhận.
    payload.videoStyle = "general";
  }

  // [2026-08-29] Video cũ có thể đang lưu 1 videoStyle đã bị gỡ khỏi hệ thống
  // (BE đã xóa hẳn enum) — nếu giữ nguyên giá trị cũ này, request sẽ bị BE
  // (Joi productSchema.create) từ chối. Kiểm tra NGAY TRƯỚC KHI GỬI (không
  // phải lúc hiển thị — xem giải thích đầy đủ ở onGetProductDetail) vì tới
  // đây chắc chắn videoStyleOptions đã tải xong (user đã ở trang này 1 lúc
  // rồi mới bấm submit), không còn race condition với API "video-style".
  if (
    payload.videoStyle &&
    !videoStyleOptions.value.some((x: any) => x.value === payload.videoStyle)
  ) {
    payload.videoStyle = videoStyleOptions.value[0]?.value || "general";
  }

  if (isCustomPromptMode.value) {
    const scenePrompts = Array.from(
      { length: customPromptSceneCount.value },
      (_, i) => customScenePrompts[i] || "",
    );
    payload.customPrompts = scenePrompts;
    // Ô Prompt gốc đã ẩn (không còn ai điền) nhưng BE vẫn required field
    // "value" (Joi + check .length ở product.service.ts) — ghép lại từ nội
    // dung các ô Prompt N để thoả ràng buộc, đồng thời value vẫn có ý nghĩa
    // hiển thị (admin, thẻ thông tin readonly, gallery công khai...).
    payload.value = scenePrompts.join("\n\n");
  } else {
    delete payload.customPrompts;
  }

  await productService
    .saveProduct(payload)
    .then(async (res) => {
      const productId = res?.data?.productId;
      if (productId) {
        await onGetProductDetail();
        formData.messages = formData.messages?.length
          ? formData.messages
          : [{ title: "Đang xử lý...", dateTime: "", color: "primary" }];
        router.replace(`/thu-vien-cua-toi/${productId}`);
        // "Tạo lại video" dùng lại đúng productId cũ (không đổi route) nên
        // onMounted không tự chạy lại — nếu lần trước đã dừng poll (vì video
        // trước đó lỗi/xong), phải khởi động lại thủ công ở đây. Còn video
        // tạo MỚI lần đầu thì route đổi nhưng component không remount (Vue
        // Router tái dùng instance khi chỉ đổi param) nên onMounted cũng
        // không tự chạy — phải tự đăng ký ở đây, dùng "productId" (biến cục
        // bộ ở trên, vừa lấy từ response) chứ KHÔNG dùng productId.value
        // (computed theo route, có thể chưa kịp cập nhật do router.replace
        // chưa resolve xong).
        if (!formData.video) {
          startPolling(productId);
          $socket.off(`server:product-detail:${productId}`, onLiveHint);
          $socket.on(`server:product-detail:${productId}`, onLiveHint);
          // addEventListener tự bỏ qua nếu đăng ký trùng (không như
          // $socket.on) nên gọi lại vô hại nếu onMounted đã đăng ký rồi.
          document.addEventListener("visibilitychange", onVisibilityChange);
        }
      }
    })
    .catch(() => {
      loading.value = "";
    });
};

const onSubmit = () =>
  isStoreOrder.value ? onSubmitStoreOrder() : onSubmitNormal();

const onClickNoteMessage = (isClick: boolean) => {
  if (isClick) commonDialogRef.value?.onDisplay(true);
};

const onClickLikeVideo = () => {
  productService.likeProductVideo({ _id: productId.value }).then(async () => {
    await onGetProductDetail();
  });
};

onMounted(async () => {
  if (!productId.value) {
    formData.title = `Video của tôi ${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}`;
    if (route.query.templateId) {
      await loadStoreTemplate();
    }
  }
  await onGetProductDetail();
  // watch(storeGenerating,...) KHÔNG immediate (xem chỗ khai báo) — phải tự
  // gọi ở đây làm điểm khởi đầu SAU KHI đã có data thật. F5 lại trang giữa
  // chừng lúc đang tạo sẽ thấy % về lại 0% (chấp nhận được, theo yêu cầu).
  if (storeGenerating.value) {
    startFakeProgress();
  }
  // Poll cả khi trang load thẳng vào trạng thái lỗi (không chỉ lúc đang chạy
  // bình thường) — để bắt được trường hợp có ai/nơi nào khác tạo lại giúp
  // (xem giải thích POLL_INTERVAL_ERROR_MS ở trên).
  if (productId.value && !formData.video) {
    startPolling();
    $socket.off(`server:product-detail:${productId.value}`, onLiveHint);
    $socket.on(`server:product-detail:${productId.value}`, onLiveHint);
    document.addEventListener("visibilitychange", onVisibilityChange);
  }
});

onMounted(async () => {
  const priorityModel = await getSettingValue("Mô hình ưu tiên");
  if (priorityModel) formData.modelVideo = priorityModel;
});

onUnmounted(() => {
  stopPolling();
  stopFakeProgress();
  if (productId.value) {
    $socket.off(`server:product-detail:${productId.value}`, onLiveHint);
  }
  document.removeEventListener("visibilitychange", onVisibilityChange);
});

useSeo({
  title: productId.value ? "Chi tiết video" : "Tạo video AI",
  description: productId.value
    ? "Xem chi tiết và theo dõi tiến trình tạo video AI của bạn trên TN Solve. Xem từng cảnh quay, tải xuống video hoàn chỉnh."
    : "Tạo video AI chuyên nghiệp với TN Solve - Chọn công nghệ AI phù hợp, thiết lập cảnh quay và tạo video tự động chỉ trong vài phút.",
  image: "/images/page-detail.png",
  keywords:
    "tạo video AI, video tự động, TN Solve tạo video, AI video creator",
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

        <div v-if="item.prompt || item.description">
          <span class="font-bold">Prompt: </span><br />
          <span
            v-html="item.prompt || item.description"
            style="white-space: pre-line"
          />
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
      v-if="displayFlow && Object.values(displayFlow || {})?.length"
      cols="12"
    >
      <div class="flow-compact-bar">
        <!-- Cột trái: Tải hệ thống — chấm tròn -->
        <div class="flow-col-circle">
          <v-progress-circular
            :color="displayFlow.color"
            :modelValue="displayFlow.value"
            size="44"
            width="3"
          >
            <span class="flow-circle-pct" :style="{ color: displayFlow.color }"
              >{{ displayFlow.value }}%</span
            >
          </v-progress-circular>
        </div>

        <!-- Divider dọc -->
        <div v-if="displayFlow.userScene" class="flow-vdivider" />

        <!-- Cột phải: Ngân sách cảnh của user (chính) -->
        <div v-if="displayFlow.userScene" class="flow-col">
          <div class="flow-col-header">
            <span class="flow-col-title flow-col-title--main">
              <span class="flow-col-label-inline">{{
                displayFlow.userScene.label || "Tổng số cảnh đang dùng"
              }}</span>
            </span>
            <span
              class="flow-col-pct flow-col-pct--main"
              :style="{ color: userSceneColor }"
            >
              <!-- Đang dùng vượt ngân sách (VD 28/24) — hiện chữ "Max" thay vì
              số thật, tránh hiểu lầm "đang dùng đúng 24" (nếu cắt về 24/24) hay
              nhìn như lỗi vỡ layout (nếu giữ nguyên 28/24, tử số > mẫu số). -->
              {{
                displayFlow.userScene.used > displayFlow.userScene.budget
                  ? "max"
                  : displayFlow.userScene.used
              }} / {{ displayFlow.userScene.budget }}
            </span>
          </div>
          <v-progress-linear
            :color="userSceneColor"
            :modelValue="userScenePct"
            height="8"
            rounded
            bg-color="#9e9e9e"
          />
        </div>
      </div>
    </v-col>

    <v-col cols="12" lg="6" md="6">
      <div v-if="formData.video" class="d-flex flex-column ga-3">
        <div class="template-preview-panel">
          <div class="d-flex justify-center rem bg-black">
            <video
              v-if="isStoreOrder"
              :src="formData.video"
              preload="metadata"
              style="display: none"
              @loadedmetadata="onLoadActualVideoDuration"
            />
            <VideoPlayer
              :src="formData.video"
              :frameRate="formData.frameRate"
              :removeControls="['settings']"
            />
          </div>

          <div class="video-panel-actions">
            <div
              class="cta-button w-100 justify-center"
              style="border-radius: 6px"
              :class="{
                disabled:
                  !formData.title ||
                  (!isStoreOrder && !formData.value) ||
                  loading === 'download',
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
          </div>
        </div>

        <!-- Title + stats -->
        <div class="template-preview-panel">
          <div class="title-stats-row">
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
                {{ formData?.isLiked ? "mdi-thumb-up" : "mdi-thumb-up-outline" }}
              </v-icon>
              <span>{{ formData?.likesCount }}</span>
            </button>
          </div>
        </div>

        <!-- Video "Cửa hàng": chỉ hiện field còn ý nghĩa với user — ẩn Mô
        hình/Phong cách (đều là giá trị nội bộ mượn tạm để chạy pipeline,
        không phản ánh gì user đã chọn, xem product.service.ts
        videoAutomationStore). Riêng "Thời lượng" lấy từ ĐỘ DÀI THẬT đo được
        từ chính video đã tạo (formData.videoDuration không có ý nghĩa với
        video Cửa hàng, kể cả khi có mẫu — mẫu không cam kết độ dài cố định).
        "Chế độ" thì KHÁC — chỉ là giá trị nội bộ khi có MẪU THẬT (admin cấu
        hình sẵn), nhưng với "Tạo mặc định" (không mẫu) đây lại là lựa chọn
        THẬT SỰ user đã tự chọn (quyết định số ảnh yêu cầu) — chỉ ẩn khi có
        mẫu thật, hiện lại đúng cho "Tạo mặc định". -->
        <div v-if="isStoreOrder" class="info-section">
          <div class="info-grid">
            <div v-if="storeTemplate?._id" class="info-card">
              <span class="info-label">Template</span>
              <span class="info-value info-value--truncate">{{
                storeTemplate?.title
              }}</span>
            </div>
            <div v-else class="info-card">
              <span class="info-label">Chế độ</span>
              <span class="info-value">{{
                storeModeOptions.find((i: any) => i.value === formData.storeVideoMode)
                  ?.title || "Chưa có"
              }}</span>
            </div>
            <div class="info-card">
              <span class="info-label">Tỷ lệ khung hình</span>
              <span class="info-value">{{
                frameRateOptions.find((i: any) => i.value === formData.frameRate)
                  ?.title || "Chưa có"
              }}</span>
            </div>
            <div class="info-card">
              <span class="info-label">Thời lượng</span>
              <span class="info-value">{{ actualVideoDurationLabel || "Chưa có" }}</span>
            </div>
            <div class="info-card">
              <span class="info-label">Tác giả</span>
              <span class="info-value">{{
                formData?.account?.name || "Chưa có"
              }}</span>
            </div>
          </div>

          <!-- Ảnh THẬT user đã tải lên cho chính video này — hiện lại
          (read-only) ở đây, KHÔNG dựa vào cấu hình mẫu (mẫu có thể đã bị
          admin đổi sau khi video này tạo xong). -->
          <StoreFieldCard
            v-if="formData.uploadedImages?.length"
            :label="storeTemplate?._id ? 'Ảnh yêu cầu' : 'Ảnh đầu vào'"
          >
            <div class="store-image-slots">
              <div
                v-for="(img, idx) in formData.uploadedImages"
                :key="idx"
                class="store-image-slot"
              >
                <v-img :src="img" contain class="store-image-slot-img">
                  <template #placeholder>
                    <div class="img-loading-overlay" />
                  </template>
                </v-img>
              </div>
            </div>
          </StoreFieldCard>

          <!-- Giá trị THẬT user đã nhập cho từng field của mẫu — an toàn hiện
          lại (không phải prompt gốc bí mật của admin, chỉ là nội dung user tự
          gõ vào). "Tạo mặc định" không có field nào (promptFields rỗng). Gom
          chung 1 card, list theo dòng thay vì mỗi field 1 ô lưới riêng. -->
          <StoreFieldCard
            v-if="storeTemplate?.promptFields?.length"
            label="Thông tin yêu cầu"
            compact
          >
            <div class="store-prompt-fields-list store-prompt-fields-list--compact">
              <div
                v-for="f in storeTemplate.promptFields"
                :key="f.key"
                class="info-field-row"
              >{{ f.title }}: {{ formData.storePromptInputs?.[f.key] || "—" }}</div>
            </div>
          </StoreFieldCard>

          <!-- "Tạo mặc định" (không có mẫu thật) — formData.value là chính
          nội dung USER TỰ GÕ, không liên quan gì basePrompt bí mật của admin
          (mẫu thật thì KHÔNG hiện, xem card "Thông tin yêu cầu" ở trên thay
          thế) — nguyên tắc: cái gì user tự nhập/gửi lên thì hiện lại được
          cho họ, chỉ nội dung do admin viết mới cần giấu (giấu cả ở API, xem
          product.service.ts getById/getAllProductPublic/getProductMyLibrary). -->
          <div v-if="!storeTemplate?._id" class="info-card">
            <span class="info-label">Prompt</span>
            <span
              v-html="formData.value"
              class="info-value"
              :class="{ 'info-value--clamped': isPromptLong && !promptExpanded }"
              style="white-space: pre-line"
            />
            <button
              v-if="isPromptLong"
              type="button"
              class="prompt-toggle-btn"
              @click="promptExpanded = !promptExpanded"
            >
              {{ promptExpanded ? "Thu gọn" : "Xem thêm" }}
            </button>
          </div>
        </div>

        <div v-else class="info-section">
          <div class="info-grid">
            <div class="info-card">
              <span class="info-label">Mô hình</span>
              <span class="info-value">{{
                modelVideoOptions.find(
                  (i: any) => i.value === formData.modelVideo,
                )?.title || "Chưa có"
              }}</span>
            </div>
            <div class="info-card">
              <span class="info-label">Tỷ lệ khung hình</span>
              <span class="info-value">{{
                frameRateOptions.find((i: any) => i.value === formData.frameRate)
                  ?.title || "Chưa có"
              }}</span>
            </div>
            <div class="info-card">
              <span class="info-label">Chế độ</span>
              <span class="info-value">{{
                videoModeOptions.find((i: any) => i.value === formData.videoMode)
                  ?.title || "Chưa có"
              }}</span>
            </div>
            <div class="info-card">
              <span class="info-label">Phong cách</span>
              <span class="info-value">{{
                videoStyleOptions.find(
                  (i: any) => i.value === videoStyleFieldModel,
                )?.title || "Chưa có"
              }}</span>
            </div>
            <div class="info-card">
              <span class="info-label">Thời lượng</span>
              <span class="info-value">{{
                videoDurationOptions.find(
                  (i: any) => i.value === formData.videoDuration,
                )?.title || "Chưa có"
              }}</span>
            </div>
            <div class="info-card">
              <span class="info-label">Tác giả</span>
              <span class="info-value">{{
                formData?.account?.name || "Chưa có"
              }}</span>
            </div>
          </div>

          <template v-if="formData.hasImage">
            <!-- "Chủ thể của tôi"/"Tùy chỉnh nhân vật": dùng ảnh THẬT đã
            upload (formData.uploadedImages, URL S3 thật) hiện qua cùng UI
            lưới thẻ với Cửa hàng (StoreFieldCard + store-image-slots), thay
            vì UploadImage readonly cũ. Số ô tự đúng theo mảng thật, không
            cần đoán số lượng nữa. -->
            <StoreFieldCard
              v-if="
                ['my_subject', 'rtv'].includes(formData.videoMode) &&
                formData.uploadedImages?.length
              "
              label="Ảnh đầu vào"
            >
              <div class="store-image-slots">
                <div
                  v-for="(img, idx) in formData.uploadedImages"
                  :key="idx"
                  class="store-image-slot"
                >
                  <v-img :src="img" contain class="store-image-slot-img">
                    <template #placeholder>
                      <div class="img-loading-overlay" />
                    </template>
                  </v-img>
                </div>
              </div>
            </StoreFieldCard>

            <div
              v-else-if="formData.videoMode === 'itv'"
              class="info-grid"
            >
              <div
                v-for="(item, index) in +formData.videoDuration"
                :key="index"
                class="info-card"
              >
                <span class="info-label"> Ảnh bối cảnh {{ index + 1 }} </span>
                <UploadImage
                  :readonly="true"
                  :ref="(el) => (uploadImageRefs[index] = el)"
                  :height="width > 550 ? '10rem' : '8rem'"
                  class="mt-1 mb-1"
                />
              </div>
            </div>
          </template>

          <!-- Prompt gốc của mẫu là BÍ MẬT nội bộ (admin viết, ẩn với user) —
          video Cửa hàng KHÔNG được hiện lại prompt cuối cùng đã gửi đi tạo
          video (đã ghép basePrompt + giá trị user nhập), vì sẽ lộ nguyên văn
          prompt mẫu cho user. -->
          <div v-if="!isStoreOrder" class="info-card">
            <span class="info-label">Prompt</span>
            <span
              v-html="formData.value"
              class="info-value"
              :class="{ 'info-value--clamped': isPromptLong && !promptExpanded }"
              style="white-space: pre-line"
            />
            <button
              v-if="isPromptLong"
              type="button"
              class="prompt-toggle-btn"
              @click="promptExpanded = !promptExpanded"
            >
              {{ promptExpanded ? "Thu gọn" : "Xem thêm" }}
            </button>
          </div>
        </div>
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
              :readonly="(Boolean(productId) || showStoreProgress) && !storeEditableOnError"
              :class="{ disabled: (Boolean(productId) || showStoreProgress) && !storeEditableOnError }"
            />
          </v-col>

          <v-col v-if="isStoreOrder && storeTemplate?._id" cols="12" lg="6" md="6" sm="6">
            <v-text-field
              :model-value="storeTemplate?.title || 'Tạo mặc định'"
              hide-details
              readonly
              class="w-100"
              :class="{ disabled: (Boolean(productId) || showStoreProgress) && !storeEditableOnError }"
              variant="outlined"
              label="Template"
            />
          </v-col>

          <v-col v-else-if="isStoreOrder" cols="12" lg="6" md="6" sm="6">
            <v-select
              v-model="defaultVideoMode"
              hide-details
              class="w-100"
              variant="outlined"
              item-title="title"
              item-value="value"
              :items="storeModeOptions"
              :readonly="(Boolean(productId) || showStoreProgress) && !storeEditableOnError"
              :class="{ disabled: (Boolean(productId) || showStoreProgress) && !storeEditableOnError }"
              label="Chế độ"
            />
          </v-col>

          <v-col v-else cols="12" lg="6" md="6" sm="6">
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
                ((Boolean(productId) || showStoreProgress) && !storeEditableOnError) ||
                formData.videoMode === 'short_form_video'
              "
              :class="{ disabled: (Boolean(productId) || showStoreProgress) && !storeEditableOnError }"
              label="Tỷ lệ khung hình"
            />
          </v-col>

          <v-col v-if="!isStoreOrder" cols="12" lg="6" md="6" sm="6">
            <v-select
              v-model="formData.videoMode"
              hide-details
              class="w-100"
              variant="outlined"
              item-title="title"
              item-value="value"
              :items="videoModeSelectableOptions"
              :readonly="Boolean(productId)"
              :class="{ disabled: Boolean(productId) }"
              label="Chế độ"
              @update:modelValue="
                () => {
                  if (
                    !videoStyleOptions.some(
                      (x: any) => x.value === videoStyleFieldModel,
                    )
                  ) {
                    videoStyleFieldModel = videoStyleOptions[0].value;
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

          <v-col v-if="!isStoreOrder" cols="12" lg="6" md="6" sm="6">
            <v-select
              v-model="videoStyleFieldModel"
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

          <v-col v-if="!isStoreOrder" cols="12">
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

          <v-col v-if="isStoreOrder && storeRequiresImage" cols="12">
            <StoreFieldCard :label="storeTemplate?._id ? 'Ảnh yêu cầu' : 'Ảnh đầu vào'">
              <div class="store-image-slots">
                <div v-for="n in storeImageCount" :key="n" class="store-image-slot">
                  <UploadImage
                    :ref="(el) => (storeImageRefs[n - 1] = el)"
                    :readonly="(Boolean(productId) || showStoreProgress) && !storeEditableOnError"
                    :class="{ disabled: (Boolean(productId) || showStoreProgress) && !storeEditableOnError }"
                    width="100%"
                    height="100%"
                    iconUpload="mdi-image-outline"
                    :textUpload="storeImageSlotLabel(n)"
                    hide-hint
                    hide-icon
                    @on-select-file="
                      (event) => {
                        formData.images[n - 1] = event?.file;
                        // Luôn tự dồn — kể cả 'Image to video' (Ảnh đầu/Ảnh
                        // cuối): pipeline bắt buộc phải có khung hình ĐẦU nên
                        // nếu chỉ nhập 1 ảnh (ở ô nào cũng vậy) thì ảnh đó phải
                        // được đẩy về vị trí 'Ảnh đầu' (index 0), giống RTV.
                        nextTick(() =>
                          compactImageSlots(storeImageRefs, storeImageCount),
                        );
                      }
                    "
                  />
                </div>
              </div>
            </StoreFieldCard>
          </v-col>

          <!-- "Chủ thể của tôi" (1 ảnh) / "Tùy chỉnh nhân vật" (tối thiểu 1,
          tối đa 3 ảnh — KHÔNG bắt buộc điền hết, xem CTA-disabled bên dưới)
          dùng chung UI dạng lưới thẻ với Cửa hàng (StoreFieldCard +
          store-image-slots), thay vì UploadImage đơn/2-ô cố định như trước. -->
          <v-col
            v-else-if="
              !isStoreOrder &&
              ['my_subject', 'rtv'].includes(formData.videoMode)
            "
            cols="12"
          >
            <StoreFieldCard label="Ảnh đầu vào">
              <div class="store-image-slots">
                <div
                  v-for="n in formData.videoMode === 'my_subject' ? 1 : 3"
                  :key="n"
                  class="store-image-slot"
                >
                  <UploadImage
                    :ref="(el) => (uploadImageRefs[n - 1] = el)"
                    :readonly="Boolean(productId)"
                    :class="{ disabled: Boolean(productId) }"
                    width="100%"
                    height="100%"
                    iconUpload="mdi-image-outline"
                    :textUpload="`Ảnh ${n}`"
                    hide-hint
                    hide-icon
                    @on-select-file="
                      (event) => {
                        formData.images[n - 1] = event?.file;
                        nextTick(() =>
                          compactImageSlots(
                            uploadImageRefs,
                            formData.videoMode === 'my_subject' ? 1 : 3,
                          ),
                        );
                      }
                    "
                  />
                </div>
              </div>
            </StoreFieldCard>
          </v-col>

          <v-col
            v-else-if="!isStoreOrder && formData.videoMode === 'itv'"
            cols="12"
          >
            <v-row dense>
              <v-col
                v-for="(item, index) in +formData.videoDuration"
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

          <!-- "Tùy chọn" ở Phong cách — user tự nhập tay prompt từng cảnh,
          bỏ qua bước AI phân tích kịch bản (xem onSubmitNormal). Chỉ hiện
          cho ttv/rtv/itv (xem videoStyleOptions). Với itv, khối này hiện
          THÊM VÀO bên cạnh ô upload ảnh mỗi cảnh ở trên (ảnh vẫn giữ nguyên
          yêu cầu), không thay thế. -->
          <v-col v-if="!isStoreOrder && isCustomPromptMode" cols="12">
            <v-row dense>
              <v-col v-for="index in customPromptSceneCount" :key="index" cols="12">
                <v-textarea
                  v-model="customScenePrompts[index - 1]"
                  rows="2"
                  auto-grow
                  hide-details
                  class="w-100"
                  variant="outlined"
                  :class="{ disabled: Boolean(productId) }"
                  :label="`Prompt ${index} (✳)`"
                  @paste="(event: ClipboardEvent) => onScenePromptPaste(event, index - 1)"
                />
              </v-col>
            </v-row>
          </v-col>

          <v-col v-if="isStoreOrder && storePromptFields.length" cols="12">
            <StoreFieldCard label="Thông tin yêu cầu" compact>
              <div class="store-prompt-fields-list store-prompt-fields-list--inputs">
                <v-text-field
                  v-for="f in storePromptFields"
                  :key="f.key"
                  v-model="storePromptValues[f.key]"
                  variant="outlined"
                  density="comfortable"
                  bg-color="white"
                  :label="`${f.title} (✳)`"
                  :readonly="(Boolean(productId) || showStoreProgress) && !storeEditableOnError"
                  :class="{ disabled: (Boolean(productId) || showStoreProgress) && !storeEditableOnError }"
                  hide-details
                />
              </div>
            </StoreFieldCard>
          </v-col>

          <!-- CHỈ hiện ô "Nội dung video" tự do khi KHÔNG có mẫu thật (video
          thường, hoặc "Tạo mặc định") — formData.value với video Cửa hàng có
          mẫu thật là PROMPT ĐÃ GHÉP (basePrompt bí mật + giá trị field), tuyệt
          đối không được lộ ra dù mẫu đó không có field nào (xem lỗi đã sửa:
          trước đây v-else này vô tình hiện ra khi storePromptFields rỗng). -->
          <!-- "Tùy chọn" bỏ qua hoàn toàn bước AI phân tích ý tưởng (BE
          không hề đọc formData.value khi build prompts từ các ô Prompt
          N riêng, xem custom-prompt.ts) — ẩn luôn ô này để tránh gây hiểu
          nhầm là vẫn cần điền, thấy trong onSubmitNormal/payload.value được
          tự ghép lại từ các ô Prompt N để vẫn thoả ràng buộc bắt buộc của BE. -->
          <v-col
            v-else-if="!(isStoreOrder && storeTemplate?._id) && !isCustomPromptMode"
            cols="12"
          >
            <v-textarea
              v-model="formData.value"
              rows="6"
              auto-grow
              hide-details
              class="w-100"
              variant="outlined"
              label="Prompt (✳)"
              :readonly="(Boolean(productId) || showStoreProgress) && !storeEditableOnError"
              :class="{ disabled: (Boolean(productId) || showStoreProgress) && !storeEditableOnError }"
            />
          </v-col>

          <v-col v-if="isStoreOrder && isError && lastErrorMessage" cols="12">
            <div class="store-error-card">
              <v-icon size="20" color="#dc2626">mdi-alert-circle-outline</v-icon>
              <div class="store-error-body">
                <div class="store-error-note">
                  {{
                    onGetterUserData?.role === EnumAccountRole.ADMIN ||
                    !lastErrorMessage.isInternalRetry
                      ? lastErrorMessage.note || lastErrorMessage.title
                      : "Quá trình này có thể mất vài phút, vui lòng kiên nhẫn chờ đợi..."
                  }}
                </div>
                <div
                  v-if="
                    onGetterUserData?.role === EnumAccountRole.ADMIN &&
                    lastErrorMessage.errorMsg
                  "
                  class="store-error-detail"
                >
                  {{ lastErrorMessage.errorMsg }}
                </div>
              </div>
            </div>
          </v-col>

          <v-col
            v-if="
              (!formData?.account?._id ||
                onGetterUserData?._id === formData?.account?._id) &&
              (!productId || isError || (isStoreOrder && showStoreProgress))
            "
            cols="12"
          >
            <div
              class="cta-button w-100 justify-center"
              style="border-radius: 6px"
              :class="{
                disabled:
                  showStoreProgress ||
                  loading === 'submit' ||
                  !formData.title ||
                  (isStoreOrder
                    ? (storeTemplate?._id
                        ? storePromptFields.some((f: any) => !storePromptValues[f.key])
                        : !formData.value) ||
                      !storeImagesValid
                    : (!formData.value && !isCustomPromptMode) ||
                      (formData.videoMode === 'my_subject' &&
                        !uploadImageRefs[0]?.base64) ||
                      // rtv: tối thiểu 1/tối đa 3 ảnh, KHÔNG bắt buộc điền
                      // hết mọi ô (khác itv bên dưới — mỗi ô gắn 1 cảnh, ô
                      // nào hiện ra là BẮT BUỘC phải điền ô đó).
                      (formData.videoMode === 'rtv' &&
                        !uploadImageRefs.some((ref: any) => ref?.base64)) ||
                      (formData.videoMode === 'itv' &&
                        uploadImageRefs
                          .filter((item: any) => item)
                          .some((ref: any) => !ref?.base64)) ||
                      (isCustomPromptMode &&
                        Array.from(
                          { length: customPromptSceneCount },
                          (_, i) => customScenePrompts[i],
                        ).some((p: any) => !p?.trim()))),
              }"
              @click="!showStoreProgress && onSubmit()"
            >
              <template v-if="showStoreProgress">
                <h3>Đang tạo video... {{ fakeProgress }}%</h3>
              </template>
              <template v-else>
                <v-progress-circular
                  v-if="Boolean(loading === 'submit')"
                  width="2"
                  size="23"
                  color="white"
                  indeterminate
                />
                <v-icon v-else size="27">mdi-image-filter-tilt-shift</v-icon>
                <h3>{{ isError ? "Tạo lại video" : "Tạo video" }}</h3>
              </template>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-col>

    <v-col lg="6" md="6" cols="12">
      <!-- Video mẫu (Cửa hàng) thay cho panel "Quy trình tạo video AI" -->
      <!-- Video "Cửa hàng" LUÔN hiện video mẫu ở đây (kể cả lúc đang tạo) —
      tiến trình đã hiện ngay trên nút "Tạo video" (fakeProgress) rồi, không
      cần đổi sang timeline message thật như luồng thường. -->
      <div v-if="isStoreOrder" class="template-preview-panel">
        <template v-if="storeTemplate?.sampleVideo">
          <video
            :key="storeTemplate._id"
            :src="storeTemplate.sampleVideo"
            preload="metadata"
            style="display: none"
            @loadedmetadata="onLoadSampleVideoMetadata"
          />
          <VideoPlayer
            :key="storeTemplate._id"
            :src="storeTemplate.sampleVideo"
            :frameRate="previewVideoFrameRate"
            :removeControls="['settings']"
          />
        </template>
        <div v-else class="template-preview-media">
          <v-img
            v-if="storeTemplate?.thumbnail"
            :src="storeTemplate.thumbnail"
            cover
            height="100%"
          />
          <v-icon v-else size="42" color="#fff">mdi-auto-fix</v-icon>
        </div>
        <div class="template-preview-info">
          <div class="template-preview-title">
            {{ storeTemplate?.title || "Tạo mặc định" }}
          </div>
          <div class="template-preview-price-row">
            <span v-if="storeTemplate?.discountedPrice != null" class="template-preview-price-old">
              {{ (storeTemplate.price || 0).toLocaleString("vi-VN") }}đ
            </span>
            <span class="template-preview-price">
              {{ (storeTemplate?.discountedPrice ?? storeTemplate?.price ?? 0).toLocaleString("vi-VN") }}đ
            </span>
            <span class="template-preview-price-unit">/ video</span>
            <span v-if="storeTemplate?.discountedPrice != null" class="template-preview-price-badge">
              -{{
                Math.round(
                  (1 - storeTemplate.discountedPrice / storeTemplate.price) * 100
                )
              }}%
            </span>
          </div>

          <StoreFieldCard
            v-if="storeTemplate?.exampleImages?.length"
            label="Ảnh yêu cầu"
            class="template-preview-section"
          >
            <div class="template-preview-images">
              <v-img
                v-for="(img, idx) in storeTemplate.exampleImages"
                :key="idx"
                :src="img"
                contain
                class="template-preview-image"
              />
            </div>
          </StoreFieldCard>

          <StoreFieldCard
            v-if="storePromptFields.length"
            label="Thông tin yêu cầu"
            class="template-preview-section"
            compact
          >
            <div class="template-preview-req">
              {{ storePromptFields.map((f: any) => f.title).join(", ") }}
            </div>
          </StoreFieldCard>
        </div>
      </div>

      <!-- Guide panel khi chưa tạo video -->
      <div v-else-if="!productId" class="guide-panel">
        <div class="guide-header">
          <div class="guide-header-icon">
            <v-icon color="white" size="22">mdi-image-filter-tilt-shift</v-icon>
          </div>
          <div>
            <div class="guide-header-title">Quy trình tạo video AI</div>
            <div class="guide-header-sub">
              Chỉ vài phút để có video chuyên nghiệp
            </div>
          </div>
        </div>

        <div class="guide-steps">
          <div class="guide-step">
            <div class="guide-step-num">1</div>
            <div class="guide-step-body">
              <div class="guide-step-title">Điền thông tin & Prompt</div>
              <div class="guide-step-desc">
                Chọn mô hình, tỷ lệ khung hình, chế độ, phong cách, thời lượng
                và viết nội dung mô tả video
              </div>
            </div>
          </div>
          <div class="guide-step-connector" />
          <div class="guide-step">
            <div class="guide-step-num">2</div>
            <div class="guide-step-body">
              <div class="guide-step-title">AI phân tích & tạo kịch bản</div>
              <div class="guide-step-desc">
                Hệ thống tự động phân tích prompt và tạo kịch bản từng cảnh quay
              </div>
            </div>
          </div>
          <div class="guide-step-connector" />
          <div class="guide-step">
            <div class="guide-step-num">3</div>
            <div class="guide-step-body">
              <div class="guide-step-title">Xử lý & render video</div>
              <div class="guide-step-desc">
                AI tiến hành tạo từng cảnh quay và ghép thành video hoàn chỉnh
              </div>
            </div>
          </div>
          <div class="guide-step-connector" />
          <div class="guide-step">
            <div class="guide-step-num">4</div>
            <div class="guide-step-body">
              <div class="guide-step-title">Tải video về máy</div>
              <div class="guide-step-desc">
                Video hoàn tất, bạn có thể xem, chia sẻ hoặc tải xuống ngay
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Banner hàng đợi -->
      <div v-else-if="queueMessage && !formData.video" class="queue-banner mb-4">
        <div class="queue-banner__icon">
          <v-progress-circular
            color="white"
            width="2"
            size="20"
            indeterminate
          />
        </div>
        <div class="queue-banner__body">
          <div class="queue-banner__title">
            Đang chờ trong hàng đợi
            <span v-if="queuePosition" class="queue-banner__pos"
              >— Vị trí #{{ queuePosition }}</span
            >
          </div>
          <div class="queue-banner__sub">
            Video của bạn sẽ được xử lý ngay khi đến lượt. Vui lòng giữ nguyên
            trang này.
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
              <v-icon v-if="item.color === 'success'" color="white" size="16"
                >mdi-check</v-icon
              >
              <v-progress-circular
                v-else-if="item.color === 'primary'"
                color="white"
                width="2"
                size="14"
                indeterminate
              />
              <v-icon v-else-if="item.color === 'error'" color="white" size="16"
                >mdi-close</v-icon
              >
              <v-icon v-else color="white" size="14">mdi-clock-outline</v-icon>
            </div>

            <!-- content -->
            <div class="step-content">
              <div class="step-title">{{ item.title }}</div>
              <div v-if="item.dateTime" class="step-time">
                {{ item.dateTime }}
              </div>
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
                {{
                  onGetterUserData?.role === EnumAccountRole.ADMIN ||
                  !item.isInternalRetry
                    ? item.note
                    : "Quá trình này có thể mất vài phút, vui lòng kiên nhẫn chờ đợi..."
                }}
              </div>
              <div
                v-if="
                  [
                    '❌ Cookies flow (veo3) của bạn không hợp lệ!',
                    '❌ Cookies flow (veo3) của bạn đã hết hạn!',
                  ].includes(item.note)
                "
                class="step-note"
              >
                Vui lòng cập nhật cookies mới
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://tnsolve.com/cai-dat"
                  >tại đây</a
                >
              </div>
              <div
                v-if="
                  onGetterUserData?.role === EnumAccountRole.ADMIN &&
                  item.errorMsg
                "
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
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.template-preview-panel {
  background: #fff;
  border: 1px solid #d0dae6;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* VideoPlayer tự bo tròn cả 4 góc (.video-wrapper) — ở đây nó luôn là khối
   ĐẦU TIÊN trong panel, ngay dưới là template-preview-info, nên chỉ cần bo
   trên (đã có sẵn nhờ overflow:hidden + border-radius của panel), bỏ bo dưới
   để liền mạch với phần thông tin bên dưới, không bị hụt góc. */
.template-preview-panel :deep(.video-wrapper) {
  border-radius: 0;
}

.video-panel-actions {
  padding: 12px;
}

.template-preview-media {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e3a5f 0%, #1565c0 100%);
}

.template-preview-info {
  padding: 16px 20px 18px;
  border-top: 1px solid #eef1f5;
}

.template-preview-title {
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.4;
  color: #1a1a1a;
  margin-bottom: 8px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.template-preview-price-row {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px;
}

.template-preview-price {
  font-size: 1.15rem;
  color: #e53935;
  font-weight: 800;
}

.template-preview-price-old {
  font-size: 0.82rem;
  font-weight: 500;
  color: #94a3b8;
  text-decoration: line-through;
}

.template-preview-price-unit {
  font-size: 0.78rem;
  color: #94a3b8;
  font-weight: 500;
}

.template-preview-price-badge {
  font-size: 0.7rem;
  font-weight: 700;
  color: #15803d;
  background: #dcfce7;
  border-radius: 999px;
  padding: 2px 8px;
  margin-left: 2px;
}

.template-preview-section {
  margin-top: 14px;
}

.template-preview-images {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.template-preview-image {
  flex: 0 0 calc((100% - 3 * 8px) / 4);
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  background: #e2e8f0;
}

.template-preview-req {
  font-size: 0.86rem;
  color: #1a1a1a;
  line-height: 1.5;
}

.store-image-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.store-image-slot {
  /* Luôn tính bề rộng như đang có đủ 4 ô, dù thực tế ít hơn — thiếu thì để
     trống phía sau chứ không giãn to lấp đầy hàng (tránh làm ảnh cao vọt lên
     khi mẫu chỉ yêu cầu 2-3 ảnh). */
  flex: 0 0 calc((100% - 3 * 8px) / 4);
  aspect-ratio: 16 / 9;
}

@media (max-width: 500px) {
  .store-image-slot {
    flex-basis: calc((100% - 8px) / 2);
  }
}

.store-image-slot-img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background: #e2e8f0;
}

.img-loading-overlay {
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
  animation: img-shimmer 1.4s ease-in-out infinite;
}

@keyframes img-shimmer {
  0% {
    background-position: 150% 0;
  }
  100% {
    background-position: -50% 0;
  }
}

.store-prompt-fields-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Bản read-only "Tên field: giá trị" chỉ là chữ thường, không cần khoảng
   cách rộng như bản có input (viền/label riêng từng ô). */
.store-prompt-fields-list--compact {
  gap: 3px;
}

/* v-text-field outlined tự có label nổi trên viền, đứng sát ngay dưới label
   "THÔNG TIN YÊU CẦU" (compact, cách 4px) trông chật hơn hẳn so với bản
   read-only chỉ có chữ thường — thêm khoảng thở riêng cho bản có input. */
.store-prompt-fields-list--inputs {
  margin-top: 14px;
}

/* Đơn giản "Tên field: giá trị" trên 1 dòng, chữ thường hết (không in đậm) —
   value có thể dài (VD "Lời thoại") nên để tự xuống dòng, không cắt "...".
   Gạch đầu dòng bằng ::before + padding-left để dòng xuống dòng vẫn thẳng
   hàng với chữ (không thụt theo dấu "-"). */
.info-field-row {
  font-size: 0.85rem;
  font-weight: 400;
  color: #212121;
  line-height: 1.5;
  white-space: pre-line;
  padding-left: 14px;
  position: relative;
}

.info-field-row::before {
  content: "-";
  position: absolute;
  left: 0;
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
  background: rgba(255, 255, 255, 0.15);
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
  color: rgba(255, 255, 255, 0.65);
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

/* Video "Cửa hàng": bọc chung info-grid + card "Thông tin yêu cầu" trong 1
   flex column dùng ĐÚNG 1 gap duy nhất (8px, khớp gap bên trong info-grid)
   thay vì cộng dồn margin-bottom của info-grid + margin-top của card riêng —
   tránh lệch/không đều như trước. */
.info-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-section .info-grid {
  margin-bottom: 0;
}

/* Ô cuối cùng đứng lẻ loi 1 mình ở hàng cuối (số ô lẻ) -> tự giãn full chiều
   ngang thay vì đứng nửa trái để trống nửa phải — tự động áp dụng dù sau này
   thêm/bớt ô nào trong lưới này (không cần biết trước số lượng ô). */
.info-grid > *:last-child:nth-child(odd) {
  grid-column: 1 / -1;
}

.info-card {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid #d0dae6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  /* Grid item mặc định min-width:auto — không co lại dưới độ rộng nội dung
     (VD text 1 dòng không wrap của .info-value--truncate), khiến ô này giãn
     rộng ra đẩy lệch cột bên cạnh thay vì cắt "..." bên trong. */
  min-width: 0;
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

.info-value--truncate {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  min-width: 0;
}

/* Prompt gốc có thể dài hàng nghìn ký tự (VD kịch bản thuyết trình) — thu gọn
   lại còn 6 dòng, bung ra bằng nút "Xem thêm" (xem promptExpanded/isPromptLong). */
.info-value--clamped {
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.prompt-toggle-btn {
  align-self: flex-start;
  margin-top: 2px;
  background: none;
  border: none;
  padding: 0;
  color: #1e88e5;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.prompt-toggle-btn:hover {
  text-decoration: underline;
}

/* ─── Title + stats row ─────────────────────────────── */
.title-stats-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
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
  transition:
    background 0.18s,
    color 0.18s,
    border-color 0.18s;
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

/* ─── Queue Banner ──────────────────────────────────── */
.queue-banner {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.35);
}
.queue-banner__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}
.queue-banner__body {
  flex: 1;
}
.queue-banner__title {
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 3px;
}
.queue-banner__pos {
  opacity: 0.9;
  font-size: 0.9rem;
}
.queue-banner__sub {
  font-size: 0.8rem;
  opacity: 0.8;
  line-height: 1.4;
}

/* ─── Flow Compact Bar (2 cột ngang) ────────────────── */
.flow-compact-bar {
  display: flex;
  align-items: stretch;
  padding: 9px 14px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid #d0dae6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  gap: 0;
}

.flow-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  padding: 0 10px;
}

.flow-col:first-child {
  padding-left: 0;
}
.flow-col:last-child {
  padding-right: 0;
}

.flow-col-label-inline {
  font-size: 0.72rem;
  color: #757575;
  font-weight: 400;
}
.flow-col-title--main {
  font-size: 0.85rem;
  font-weight: 600;
  color: #212121;
}
.flow-col-pct--main {
  font-size: 0.82rem;
  font-weight: 700;
}

/* Chấm tròn hệ thống */
.flow-col-circle {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 12px;
}

.flow-circle-pct {
  font-size: 0.65rem;
  font-weight: 700;
  line-height: 1;
}

.flow-col-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.flow-col-title {
  font-size: 0.8rem;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.flow-col-pct {
  font-size: 0.75rem;
  font-weight: 600;
  color: #9e9e9e;
  flex-shrink: 0;
}

.flow-vdivider {
  width: 1px;
  background: #e2e8f0;
  margin: 2px 0;
  flex-shrink: 0;
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
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: background 0.15s;
}

.step-success .step-row {
  background: #e8f8f0;
  border-color: #a8d8ba;
}

.step-primary .step-row {
  background: #e8f1ff;
  border-color: #93c0f5;
}

.step-error .step-row {
  background: #fff0f0;
  border-color: #f5b8b8;
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

.step-icon--success {
  background: #43a047;
}
.step-icon--primary {
  background: #1e88e5;
}
.step-icon--error {
  background: #e53935;
}
.step-icon--grey {
  background: #bdbdbd;
}

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

.store-error-card {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.store-error-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.store-error-note {
  font-size: 0.86rem;
  font-weight: 600;
  color: #b91c1c;
  line-height: 1.45;
}

.store-error-detail {
  font-size: 0.78rem;
  color: #dc2626;
  line-height: 1.4;
  word-break: break-word;
}
</style>
