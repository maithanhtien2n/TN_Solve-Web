/**
 * Test luồng gộp SÂU "itv" (CUSTOM_SCENES) — trước đây "Tùy chỉnh cảnh quay"/
 * "Tùy chỉnh quy trình" là 2 videoMode riêng (custom_scenes/custom_process),
 * gộp UI trước rồi giờ gộp LUÔN thành 1 videoMode duy nhất "itv", phân biệt
 * lại bằng videoStyle THẬT ("general"/"smooth_transition") — không còn cần
 * "dịch" videoMode lúc submit như trước nữa.
 *
 * Đồng thời test luôn bảng mã VideoMode mới (2026-08-23, đổi tên cho đồng
 * bộ): movie->ttv, character_preservation->object_sync,
 * scene_consistency->continuous_shot, custom_character->rtv,
 * custom_scenes->itv, my_subject giữ nguyên.
 *
 * pages/thu-vien-cua-toi/[id].vue.
 *
 * Dùng thẳng `reactive`/`computed`/`ref` từ package `vue` (đã có sẵn qua
 * Nuxt) để dựng lại CHÍNH XÁC logic trong component (không mount component
 * thật, dự án chưa có test framework/mount tooling) — copy nguyên các
 * computed liên quan, chạy qua các kịch bản load/đổi mode/submit thực tế.
 *
 * Usage: node scripts/test-merged-custom-mode.mjs
 */
import { reactive, computed, ref } from "vue";

let pass = 0,
  fail = 0;
function assertTrue(name, cond, detail = "") {
  const ok = !!cond;
  console.log(`${ok ? "✅" : "❌"} ${name}${ok ? "" : ` — ${detail}`}`);
  ok ? pass++ : fail++;
}

// ── Mock master-data (đúng như master-data.controller.ts trả về) ──
const masterData = ref({
  "video-mode": [
    { title: "Text to video", value: "ttv" },
    { title: "Reference to video", value: "rtv" },
    { title: "Image to video", value: "itv" },
    { title: "Chủ thể của tôi", value: "my_subject" },
    { title: "Đồng bộ đối tượng", value: "object_sync" },
    { title: "Cảnh quay liên tục", value: "continuous_shot" },
  ],
  "video-style": [
    { title: "Mặc định", value: "general" },
    { title: "Đánh giá", value: "testimonial" },
    { title: "Shorts/Reels", value: "shorts" },
    { title: "Chuyển cảnh mượt", value: "smooth_transition" },
  ],
});

function buildComponentState() {
  const formData = reactive({
    videoMode: "ttv",
    videoStyle: "general",
    modelVideo: "veo3_fast",
  });

  // ── Copy nguyên logic từ [id].vue ──
  const videoModeOptions = computed(() => masterData.value["video-mode"] || []);

  const videoModeSelectableOptions = computed(() => videoModeOptions.value);

  const videoStyleOptions = computed(() => {
    let list = masterData.value["video-style"] || [];
    if (formData.videoMode === "my_subject") {
      return list.filter((x) =>
        ["general", "testimonial", "shorts"].includes(x.value),
      );
    }
    if (formData.videoMode === "itv") {
      return [
        { title: "Mặc định", value: "general" },
        { title: "Chuyển cảnh mượt", value: "smooth_transition" },
        { title: "Tùy chọn", value: "custom_prompt" },
      ];
    }
    if (["ttv", "rtv"].includes(formData.videoMode)) {
      return [
        { title: "Mặc định", value: "general" },
        { title: "Tùy chọn", value: "custom_prompt" },
      ];
    }
    return list.filter((x) => ["general"].includes(x.value));
  });

  const CUSTOM_STYLE_PROXY_MODES = ["itv", "ttv", "rtv"];

  const customModeStyleChoice = ref("general");
  const customScenePrompts = reactive([]);
  const customPromptSceneCount = computed(() => +formData.videoDuration || 1);
  const isCustomPromptMode = computed(
    () =>
      CUSTOM_STYLE_PROXY_MODES.includes(formData.videoMode) &&
      customModeStyleChoice.value === "custom_prompt",
  );

  const videoStyleFieldModel = computed({
    get: () =>
      CUSTOM_STYLE_PROXY_MODES.includes(formData.videoMode)
        ? customModeStyleChoice.value
        : formData.videoStyle,
    set: (val) => {
      if (CUSTOM_STYLE_PROXY_MODES.includes(formData.videoMode)) {
        customModeStyleChoice.value = val;
      } else {
        formData.videoStyle = val;
      }
    },
  });

  function distributePastedScenePrompts(text, startIndex) {
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
  }

  // Mô phỏng @update:modelValue của select "Chế độ"
  function onModeSelectChanged() {
    if (!videoStyleOptions.value.some((x) => x.value === videoStyleFieldModel.value)) {
      videoStyleFieldModel.value = videoStyleOptions.value[0].value;
    }
  }

  // Mô phỏng đoạn load trong onGetProductDetail
  function loadFromServer(data) {
    formData.videoMode = data.videoMode;
    customModeStyleChoice.value = "general";
    customScenePrompts.splice(0, customScenePrompts.length);
    if (data.isCustomPrompt) {
      formData.videoStyle = "general";
      customModeStyleChoice.value = "custom_prompt";
      customScenePrompts.splice(
        0,
        customScenePrompts.length,
        ...(Array.isArray(data.prompts)
          ? data.prompts.map((p) => p.description || "")
          : []),
      );
    } else if (data.videoMode === "itv" && data.videoStyle === "smooth_transition") {
      formData.videoStyle = "smooth_transition";
      customModeStyleChoice.value = "smooth_transition";
    } else {
      formData.videoStyle = videoStyleOptions.value.some(
        (x) => x.value === data.videoStyle,
      )
        ? data.videoStyle
        : videoStyleOptions.value[0]?.value || "general";
    }
  }

  // Mô phỏng đoạn dịch payload trong onSubmitNormal
  function buildSubmitPayload() {
    const payload = { ...formData };
    if (formData.videoMode === "itv") {
      payload.videoStyle =
        customModeStyleChoice.value === "smooth_transition"
          ? "smooth_transition"
          : "general";
    } else if (["ttv", "rtv"].includes(formData.videoMode)) {
      payload.videoStyle = "general";
    }
    if (isCustomPromptMode.value) {
      const scenePrompts = Array.from(
        { length: customPromptSceneCount.value },
        (_, i) => customScenePrompts[i] || "",
      );
      payload.customPrompts = scenePrompts;
      payload.value = scenePrompts.join("\n\n");
    } else {
      delete payload.customPrompts;
    }
    return payload;
  }

  // Mô phỏng dòng đầu onSubmitNormal(): if (!title || (!value && !isCustomPromptMode)) return;
  function isSubmitBlocked() {
    return Boolean(
      !formData.title || (!formData.value && !isCustomPromptMode.value),
    );
  }

  // Mô phỏng điều kiện disable nút "Tạo video" (luồng thường, không Store) —
  // chỉ phần liên quan formData.value/isCustomPromptMode + ảnh/prompt mỗi
  // cảnh, bỏ qua phần Store (không liên quan tính năng này).
  // uploadRefsBase64: mảng bool mô phỏng uploadImageRefs[i]?.base64 (true =
  // ô đó đã có ảnh) — số phần tử = số ô đang render.
  function isCtaDisabled(uploadRefsBase64 = []) {
    return Boolean(
      (!formData.value && !isCustomPromptMode.value) ||
        (isCustomPromptMode.value &&
          Array.from(
            { length: customPromptSceneCount.value },
            (_, i) => customScenePrompts[i],
          ).some((p) => !p?.trim())) ||
        (formData.videoMode === "my_subject" && !uploadRefsBase64[0]) ||
        // rtv: chỉ cần TỐI THIỂU 1/3 ô có ảnh (khác itv — MỌI ô render ra
        // đều bắt buộc).
        (formData.videoMode === "rtv" &&
          !uploadRefsBase64.some((b) => b)) ||
        (formData.videoMode === "itv" && uploadRefsBase64.some((b) => !b)),
    );
  }

  return {
    formData,
    videoModeOptions,
    videoModeSelectableOptions,
    videoStyleOptions,
    isCustomPromptMode,
    customPromptSceneCount,
    customScenePrompts,
    customModeStyleChoice,
    videoStyleFieldModel,
    onModeSelectChanged,
    loadFromServer,
    buildSubmitPayload,
    isSubmitBlocked,
    isCtaDisabled,
    distributePastedScenePrompts,
  };
}

function main() {
  // ── 1. Chế độ dropdown chỉ còn 6 dòng, đúng mã mới, không còn giá trị nào
  //     tên "custom_process"/"movie"/... kiểu cũ. ──
  {
    const s = buildComponentState();
    const selectable = s.videoModeSelectableOptions.value;
    assertTrue(
      "TC1: videoModeSelectableOptions có đúng 6 dòng (không còn custom_process riêng)",
      selectable.length === 6 && !selectable.some((x) => x.value === "custom_process"),
      JSON.stringify(selectable.map((x) => x.value)),
    );
    assertTrue(
      "TC2: videoModeOptions và videoModeSelectableOptions giờ giống hệt nhau (không cần lọc/relabel gì nữa)",
      JSON.stringify(s.videoModeOptions.value) ===
        JSON.stringify(s.videoModeSelectableOptions.value),
    );
  }

  // ── 2. Chọn itv -> Phong cách hiện đúng 3 lựa chọn. ──
  {
    const s = buildComponentState();
    s.formData.videoMode = "itv";
    s.onModeSelectChanged();
    const styles = s.videoStyleOptions.value;
    assertTrue(
      "TC3: chọn itv -> Phong cách hiện đúng 3 lựa chọn Mặc định/Chuyển cảnh mượt/Tùy chọn",
      styles.length === 3 &&
        styles.some((x) => x.value === "general" && x.title === "Mặc định") &&
        styles.some(
          (x) => x.value === "smooth_transition" && x.title === "Chuyển cảnh mượt",
        ) &&
        styles.some((x) => x.value === "custom_prompt" && x.title === "Tùy chọn"),
      JSON.stringify(styles),
    );
    assertTrue(
      "TC4: mới chuyển vào itv -> Phong cách tự reset về Mặc định",
      s.videoStyleFieldModel.value === "general",
    );
  }

  // ── 3. Chọn "Chuyển cảnh mượt" -> giờ là videoStyle THẬT, videoMode
  //    KHÔNG cần đổi gì nữa (khác hẳn kiến trúc cũ dịch qua custom_process). ──
  {
    const s = buildComponentState();
    s.formData.videoMode = "itv";
    s.onModeSelectChanged();
    s.videoStyleFieldModel.value = "smooth_transition"; // user chọn ở UI

    assertTrue(
      "TC5: chọn Chuyển cảnh mượt -> formData.videoMode VẪN là itv (không có videoMode ẩn nào khác để lộ ra)",
      s.formData.videoMode === "itv",
      `videoMode thực tế: ${s.formData.videoMode}`,
    );
    assertTrue(
      "TC6: formData.videoStyle vẫn giữ 'general' (chưa submit, videoStyleFieldModel chỉ ghi customModeStyleChoice)",
      s.formData.videoStyle === "general",
    );

    const payload = s.buildSubmitPayload();
    assertTrue(
      "TC7: payload gửi BE -> videoMode='itv' (không đổi), videoStyle='smooth_transition' (giá trị THẬT)",
      payload.videoMode === "itv" && payload.videoStyle === "smooth_transition",
      JSON.stringify(payload),
    );
    assertTrue(
      "TC8: SAU khi build payload, formData.videoMode vẫn KHÔNG đổi (UI Chế độ vẫn hiện đúng label, không ra mã thô)",
      s.formData.videoMode === "itv" &&
        s.videoModeOptions.value.some((x) => x.value === s.formData.videoMode),
    );
  }

  // ── 4. Chọn "Mặc định" -> payload phải là videoStyle=general. ──
  {
    const s = buildComponentState();
    s.formData.videoMode = "itv";
    s.onModeSelectChanged();
    s.videoStyleFieldModel.value = "general";
    const payload = s.buildSubmitPayload();
    assertTrue(
      "TC9: chọn Mặc định -> payload videoMode='itv', videoStyle='general'",
      payload.videoMode === "itv" && payload.videoStyle === "general",
      JSON.stringify(payload),
    );
  }

  // ── 5. Load lại video CŨ có videoMode=itv + videoStyle=smooth_transition
  //    (đã migrate từ custom_process cũ) -> hiện đúng "Chuyển cảnh mượt". ──
  {
    const s = buildComponentState();
    s.loadFromServer({ videoMode: "itv", videoStyle: "smooth_transition" });
    assertTrue(
      "TC10: video cũ (migrate từ custom_process) videoMode=itv+videoStyle=smooth_transition -> formData.videoMode='itv'",
      s.formData.videoMode === "itv",
    );
    assertTrue(
      "TC11: video đó -> Phong cách hiển thị đúng 'Chuyển cảnh mượt'",
      s.videoStyleFieldModel.value === "smooth_transition",
    );
    assertTrue(
      "TC12: video đó -> thẻ info-card Phong cách tra đúng label",
      s.videoStyleOptions.value.find((x) => x.value === s.videoStyleFieldModel.value)
        ?.title === "Chuyển cảnh mượt",
    );
    // "Tạo lại" (retry) video cũ này -> payload phải gửi lại đúng smooth_transition.
    const payload = s.buildSubmitPayload();
    assertTrue(
      "TC13: 'Tạo lại' video cũ -> payload vẫn đúng videoStyle=smooth_transition (round-trip không đổi)",
      payload.videoStyle === "smooth_transition",
    );
  }

  // ── 6. Load lại video CŨ có videoMode=itv + videoStyle=general -> hiện
  //    đúng "Mặc định". ──
  {
    const s = buildComponentState();
    s.loadFromServer({ videoMode: "itv", videoStyle: "general" });
    assertTrue(
      "TC14: video cũ videoMode=itv+videoStyle=general -> Phong cách hiển thị đúng 'Mặc định'",
      s.videoStyleFieldModel.value === "general",
    );
  }

  // ── 6b. Chế độ giữ ĐÚNG thứ tự gốc từ master-data (không sắp xếp lại thủ
  //    công): Text to video -> Chủ thể của tôi -> Đồng bộ đối tượng ->
  //    Cảnh quay liên tục -> rtv -> itv. ──
  {
    const s = buildComponentState();
    const values = s.videoModeSelectableOptions.value.map((x) => x.value);
    assertTrue(
      "TC14b: thứ tự Chế độ đúng nguyên bản master-data (3 mode 'X to video' gom lên đầu)",
      JSON.stringify(values) ===
        JSON.stringify(["ttv", "rtv", "itv", "my_subject", "object_sync", "continuous_shot"]),
      JSON.stringify(values),
    );
  }

  // ── 7. Video cũ ở mode KHÁC (không phải itv) vẫn chạy đúng logic cũ. ──
  {
    const s = buildComponentState();
    s.loadFromServer({ videoMode: "ttv", videoStyle: "general" });
    assertTrue(
      "TC15: video mode 'ttv' không bị đụng gì — videoStyle nạp bình thường",
      s.formData.videoMode === "ttv" && s.formData.videoStyle === "general",
    );

    // Video cũ mode 'ttv' nhưng lỡ mang 1 videoStyle đã bị xoá khỏi hệ
    // thống (VD 'cinematic') -> vẫn phải fallback về general như đã sửa
    // trước (không phải phạm vi thay đổi lần này nhưng test lại cho chắc).
    const s2 = buildComponentState();
    s2.loadFromServer({ videoMode: "ttv", videoStyle: "cinematic" });
    assertTrue(
      "TC16: video mode 'ttv' với videoStyle đã xoá (cinematic) vẫn fallback đúng về general",
      s2.formData.videoStyle === "general",
    );
  }

  // ── 9. Chuyển từ itv SANG mode khác -> Phong cách reset đúng, không còn
  //    sót giá trị 'smooth_transition' kiểu cũ ở formData.videoStyle. ──
  {
    const s = buildComponentState();
    s.formData.videoMode = "itv";
    s.onModeSelectChanged();
    s.videoStyleFieldModel.value = "smooth_transition";

    s.formData.videoMode = "ttv"; // user đổi Chế độ sang mode khác
    s.onModeSelectChanged();
    assertTrue(
      "TC19: đổi từ itv sang 'ttv' -> formData.videoStyle reset về giá trị hợp lệ (general), không dính smooth_transition",
      s.formData.videoStyle === "general",
      `videoStyle: ${s.formData.videoStyle}`,
    );
  }

  // ── 10. my_subject không bị ảnh hưởng bởi thay đổi lần này (vẫn 3 lựa
  //     chọn testimonial/shorts/general như cũ). ──
  {
    const s = buildComponentState();
    s.formData.videoMode = "my_subject";
    const styles = s.videoStyleOptions.value.map((x) => x.value);
    assertTrue(
      "TC20: my_subject không bị đổi gì — vẫn đúng 3 lựa chọn general/testimonial/shorts",
      styles.length === 3 &&
        ["general", "testimonial", "shorts"].every((v) => styles.includes(v)),
      JSON.stringify(styles),
    );
  }

  // ── 11. "Tùy chọn" (tự nhập tay prompt từng cảnh) — chỉ hiện cho
  //     ttv/rtv/itv; chọn xong hiện đúng N ô prompt, submit đúng payload,
  //     bỏ qua AI. ──
  {
    // Text to video (ttv)
    const s = buildComponentState();
    s.formData.videoDuration = "3";
    s.formData.videoMode = "ttv";
    s.onModeSelectChanged();
    assertTrue(
      'TC21: "ttv" Phong cách có đúng 2 lựa chọn Mặc định/Tùy chọn',
      s.videoStyleOptions.value.length === 2 &&
        s.videoStyleOptions.value.some((x) => x.value === "custom_prompt"),
      JSON.stringify(s.videoStyleOptions.value),
    );

    s.videoStyleFieldModel.value = "custom_prompt";
    assertTrue(
      "TC22: chọn Tùy chọn -> isCustomPromptMode=true, số ô prompt = đúng videoDuration (3)",
      s.isCustomPromptMode.value && s.customPromptSceneCount.value === 3,
    );
    assertTrue(
      "TC23: formData.videoMode/videoStyle KHÔNG bị đổi khi chọn Tùy chọn (giữ nguyên hiển thị UI)",
      s.formData.videoMode === "ttv" && s.formData.videoStyle === "general",
    );

    s.customScenePrompts[0] = "Cảnh 1: mở đầu";
    s.customScenePrompts[1] = "Cảnh 2: cao trào";
    s.customScenePrompts[2] = "Cảnh 3: kết thúc";
    const payload = s.buildSubmitPayload();
    assertTrue(
      "TC24: payload ttv+Tùy chọn -> videoMode giữ nguyên 'ttv', videoStyle='general', customPrompts đúng 3 phần tử",
      payload.videoMode === "ttv" &&
        payload.videoStyle === "general" &&
        Array.isArray(payload.customPrompts) &&
        payload.customPrompts.length === 3 &&
        payload.customPrompts[1] === "Cảnh 2: cao trào",
      JSON.stringify(payload.customPrompts),
    );
    assertTrue(
      "TC24b: ô Prompt gốc đã ẩn -> payload.value được TỰ GHÉP lại từ các ô Prompt N (thoả ràng buộc required của BE)",
      typeof payload.value === "string" &&
        payload.value.includes("Cảnh 1: mở đầu") &&
        payload.value.includes("Cảnh 3: kết thúc"),
      payload.value,
    );
  }

  // ── 11b. itv + Tùy chọn -> videoMode giữ nguyên 'itv', videoStyle='general'
  //     (AI bị bỏ qua nên "Mặc định"/"Chuyển cảnh mượt" không còn ý nghĩa). ──
  {
    const s = buildComponentState();
    s.formData.videoDuration = "2";
    s.formData.videoMode = "itv";
    s.onModeSelectChanged();
    s.videoStyleFieldModel.value = "custom_prompt";
    s.customScenePrompts[0] = "A";
    s.customScenePrompts[1] = "B";
    const payload = s.buildSubmitPayload();
    assertTrue(
      "TC25: payload itv+Tùy chọn -> videoMode='itv', videoStyle='general', customPrompts đúng",
      payload.videoMode === "itv" &&
        payload.videoStyle === "general" &&
        payload.customPrompts.length === 2,
      JSON.stringify(payload),
    );
  }

  // ── 11c. Không chọn Tùy chọn -> KHÔNG gửi customPrompts (tránh gửi rác lên
  //     BE cho luồng AI bình thường). ──
  {
    const s = buildComponentState();
    s.formData.videoMode = "ttv";
    const payload = s.buildSubmitPayload();
    assertTrue(
      "TC26: mode bình thường (không Tùy chọn) -> payload KHÔNG có field customPrompts",
      !("customPrompts" in payload),
    );
  }

  // ── 11d. Load lại video cũ đã dùng "Tùy chọn" -> nạp đúng lựa chọn Phong
  //     cách + nội dung từng ô prompt đã lưu (description === prompt). ──
  {
    const s = buildComponentState();
    s.loadFromServer({
      videoMode: "ttv",
      videoStyle: "general",
      isCustomPrompt: true,
      prompts: [
        { scene: 1, description: "Cảnh 1 cũ" },
        { scene: 2, description: "Cảnh 2 cũ" },
      ],
    });
    assertTrue(
      "TC27: load video ttv+Tùy chọn cũ -> customModeStyleChoice='custom_prompt', nạp đúng nội dung đã lưu",
      s.customModeStyleChoice.value === "custom_prompt" &&
        s.customScenePrompts[0] === "Cảnh 1 cũ" &&
        s.customScenePrompts[1] === "Cảnh 2 cũ",
      JSON.stringify(s.customScenePrompts),
    );

    // itv + Tùy chọn -> Chế độ vẫn đúng itv, không cần swap gì nữa.
    const s2 = buildComponentState();
    s2.loadFromServer({
      videoMode: "itv",
      videoStyle: "general",
      isCustomPrompt: true,
      prompts: [{ scene: 1, description: "X" }],
    });
    assertTrue(
      "TC28: load video itv+Tùy chọn cũ -> videoMode giữ nguyên 'itv', Phong cách = Tùy chọn",
      s2.formData.videoMode === "itv" && s2.customModeStyleChoice.value === "custom_prompt",
    );
  }

  // ── 11e. Chống rò rỉ trạng thái CŨ khi chuyển qua lại giữa các video (Vue
  //     Router tái dùng instance) — xem video Tùy chọn xong chuyển sang xem
  //     video BÌNH THƯỜNG (không Tùy chọn) không được còn dính lựa chọn cũ. ──
  {
    const s = buildComponentState();
    s.loadFromServer({
      videoMode: "ttv",
      videoStyle: "general",
      isCustomPrompt: true,
      prompts: [{ scene: 1, description: "Cũ" }],
    });
    assertTrue(
      "TC29 setup: video A (Tùy chọn) load đúng trạng thái Tùy chọn",
      s.isCustomPromptMode.value,
    );

    // Chuyển sang xem video B — mode 'ttv' bình thường, KHÔNG dùng Tùy chọn.
    s.loadFromServer({ videoMode: "ttv", videoStyle: "general" });
    assertTrue(
      "TC29: chuyển sang video B (không Tùy chọn) -> customModeStyleChoice reset về general, isCustomPromptMode=false, không còn sót prompt cũ",
      !s.isCustomPromptMode.value &&
        s.customModeStyleChoice.value === "general" &&
        s.customScenePrompts.length === 0,
      `isCustomPromptMode=${s.isCustomPromptMode.value}, choice=${s.customModeStyleChoice.value}, prompts=${JSON.stringify(s.customScenePrompts)}`,
    );
  }

  // ── 12. Ô "Prompt" gốc bị ẩn khi ở "Tùy chọn" — không được để việc ẩn đó
  //     khoá luôn nút submit (formData.value không ai điền tới nữa), NHƯNG
  //     luồng AI bình thường (không Tùy chọn) VẪN PHẢI giữ nguyên yêu cầu bắt
  //     buộc điền Prompt như trước giờ — đây là phép thử "không ảnh hưởng
  //     luồng cũ" quan trọng nhất của đợt sửa này. ──
  {
    // 12a. LUỒNG CŨ (AI bình thường, không Tùy chọn) — value rỗng PHẢI vẫn bị
    // chặn submit y hệt hành vi từ trước tới giờ.
    const sOld = buildComponentState();
    sOld.formData.title = "Video test";
    sOld.formData.value = "";
    assertTrue(
      "TC30: luồng AI bình thường (không Tùy chọn) — value rỗng VẪN bị chặn submit như cũ (không bị nới lỏng nhầm)",
      sOld.isSubmitBlocked(),
    );

    sOld.formData.value = "Ý tưởng video";
    assertTrue(
      "TC31: luồng AI bình thường — điền đủ title+value thì KHÔNG bị chặn (hành vi cũ nguyên vẹn)",
      !sOld.isSubmitBlocked(),
    );

    // 12b. "Tùy chọn" — value rỗng (vì ô đã ẩn) KHÔNG được chặn submit, miễn
    // có title. Nút CTA vẫn phải tự chặn riêng nếu THIẾU nội dung prompt.
    const sNew = buildComponentState();
    sNew.formData.title = "Video test";
    sNew.formData.videoMode = "ttv";
    sNew.formData.videoDuration = "2";
    sNew.onModeSelectChanged();
    sNew.videoStyleFieldModel.value = "custom_prompt";
    sNew.formData.value = ""; // ô đã ẩn, không ai điền tới nữa
    assertTrue(
      "TC32: Tùy chọn — value rỗng (do ô đã ẩn) KHÔNG bị guard đầu hàm chặn (chỉ cần title)",
      !sNew.isSubmitBlocked(),
    );
    assertTrue(
      "TC33: Tùy chọn nhưng CHƯA điền prompt cảnh nào -> nút CTA vẫn phải disable (không cho submit thiếu nội dung)",
      sNew.isCtaDisabled([]),
    );

    sNew.customScenePrompts[0] = "Cảnh 1";
    sNew.customScenePrompts[1] = "Cảnh 2";
    assertTrue(
      "TC34: Tùy chọn điền đủ N ô prompt -> nút CTA không còn bị disable vì thiếu prompt",
      !sNew.isCtaDisabled([]),
    );

    // 12c. Không title -> LUÔN bị chặn dù ở mode nào (bất biến, không đổi).
    const sNoTitle = buildComponentState();
    sNoTitle.formData.title = "";
    sNoTitle.videoStyleFieldModel.value = "custom_prompt";
    assertTrue(
      "TC35: thiếu Tiêu đề -> luôn bị chặn submit dù đang ở Tùy chọn (bất biến không đổi)",
      sNoTitle.isSubmitBlocked(),
    );
  }

  // ── 13. Store order (isStoreOrder) hoàn toàn KHÔNG liên quan tới tính
  //     năng "Tùy chọn" — CUSTOM_STYLE_PROXY_MODES/isCustomPromptMode chỉ xét
  //     theo formData.videoMode, Store order dùng videoMode khác hẳn (hoặc
  //     rỗng) nên không thể vô tình bật lên. ──
  {
    const s = buildComponentState();
    s.formData.videoMode = "ttv"; // Store cũng có thể để mode mặc định này
    assertTrue(
      "TC36: mode 'ttv' mặc định (chưa chọn Tùy chọn) -> isCustomPromptMode=false, không ảnh hưởng gì tới Store",
      !s.isCustomPromptMode.value,
    );
  }

  // ── 14. Dán text có "---" vào 1 ô Prompt -> tự tách và điền lần lượt vào
  //     chính ô đó + các ô kế tiếp. ──
  {
    const s = buildComponentState();
    s.formData.videoDuration = "3";
    s.formData.videoMode = "ttv";
    s.onModeSelectChanged();
    s.videoStyleFieldModel.value = "custom_prompt";

    const handled = s.distributePastedScenePrompts(
      "Cảnh mở đầu ---\nCảnh cao trào\n--- Cảnh kết thúc",
      0,
    );
    assertTrue(
      "TC37: dán vào ô 1 (index 0) -> trả về true (có xử lý), điền đúng cả 3 ô theo thứ tự",
      handled &&
        s.customScenePrompts[0] === "Cảnh mở đầu" &&
        s.customScenePrompts[1] === "Cảnh cao trào" &&
        s.customScenePrompts[2] === "Cảnh kết thúc",
      JSON.stringify(s.customScenePrompts),
    );
  }

  // ── 14b. Dán vào ô GIỮA (không phải ô đầu) -> bắt đầu điền từ CHÍNH ô đó,
  //     không đụng tới các ô TRƯỚC nó. ──
  {
    const s = buildComponentState();
    s.formData.videoDuration = "5";
    s.formData.videoMode = "ttv";
    s.onModeSelectChanged();
    s.videoStyleFieldModel.value = "custom_prompt";
    s.customScenePrompts[0] = "Đã gõ tay cảnh 1";
    s.customScenePrompts[1] = "Đã gõ tay cảnh 2";

    s.distributePastedScenePrompts("A --- B --- C", 2); // dán vào ô 3 (index 2)
    assertTrue(
      "TC38: dán vào ô giữa (index 2) -> không đụng ô 1/2 đã gõ tay trước đó, điền đúng từ ô 3 trở đi",
      s.customScenePrompts[0] === "Đã gõ tay cảnh 1" &&
        s.customScenePrompts[1] === "Đã gõ tay cảnh 2" &&
        s.customScenePrompts[2] === "A" &&
        s.customScenePrompts[3] === "B" &&
        s.customScenePrompts[4] === "C",
      JSON.stringify(s.customScenePrompts),
    );
  }

  // ── 14c. Số đoạn NHIỀU hơn số ô còn lại -> điền đủ ô có, bỏ đoạn dư, không
  //     throw lỗi. ──
  {
    const s = buildComponentState();
    s.formData.videoDuration = "2";
    s.formData.videoMode = "ttv";
    s.onModeSelectChanged();
    s.videoStyleFieldModel.value = "custom_prompt";

    s.distributePastedScenePrompts("1 --- 2 --- 3 --- 4 --- 5", 0);
    assertTrue(
      "TC39: dán 5 đoạn nhưng chỉ có 2 ô -> điền đúng 2 ô đầu, bỏ 3 đoạn dư, không lỗi",
      s.customScenePrompts.length === 2 &&
        s.customScenePrompts[0] === "1" &&
        s.customScenePrompts[1] === "2",
      JSON.stringify(s.customScenePrompts),
    );
  }

  // ── 14d. Text KHÔNG có "---" -> trả về false (không xử lý), để hành vi dán
  //     mặc định của trình duyệt tự lo, KHÔNG được tự ý sửa customScenePrompts. ──
  {
    const s = buildComponentState();
    s.formData.videoDuration = "2";
    s.formData.videoMode = "ttv";
    s.onModeSelectChanged();
    s.videoStyleFieldModel.value = "custom_prompt";

    const handled = s.distributePastedScenePrompts(
      "Chỉ 1 đoạn bình thường, không có dấu tách",
      0,
    );
    assertTrue(
      "TC40: dán text KHÔNG có '---' -> trả về false, KHÔNG tự ý điền gì (nhường cho hành vi dán mặc định)",
      handled === false && s.customScenePrompts.length === 0,
    );
  }

  // ── 14e. Dấu tách chấp nhận nhiều hơn 3 gạch ngang (VD "----", "-----"),
  //     không bắt buộc CHÍNH XÁC 3 gạch. ──
  {
    const s = buildComponentState();
    s.formData.videoDuration = "2";
    s.formData.videoMode = "ttv";
    s.onModeSelectChanged();
    s.videoStyleFieldModel.value = "custom_prompt";

    s.distributePastedScenePrompts("X ----- Y", 0);
    assertTrue(
      "TC41: dấu tách nhiều hơn 3 gạch ngang vẫn nhận diện đúng",
      s.customScenePrompts[0] === "X" && s.customScenePrompts[1] === "Y",
      JSON.stringify(s.customScenePrompts),
    );
  }

  // ── 15. "Chủ thể của tôi" (1 ảnh) và "rtv" (tối thiểu 1, tối đa 3 ảnh —
  //     KHÔNG bắt buộc điền hết) dùng CTA-disabled đúng logic mới, khác hẳn
  //     itv (mọi ô render ra đều bắt buộc). ──
  {
    const s = buildComponentState();
    s.formData.title = "Video test";
    s.formData.value = "Ý tưởng";
    s.formData.videoMode = "my_subject";
    assertTrue(
      "TC42: Chủ thể của tôi — chưa có ảnh -> CTA disable",
      s.isCtaDisabled([false]),
    );
    assertTrue(
      "TC43: Chủ thể của tôi — đã có 1 ảnh -> CTA KHÔNG disable",
      !s.isCtaDisabled([true]),
    );
  }
  {
    const s = buildComponentState();
    s.formData.title = "Video test";
    s.formData.value = "Ý tưởng";
    s.formData.videoMode = "rtv";
    assertTrue(
      "TC44: rtv — chưa điền ô nào trong 3 ô -> CTA disable",
      s.isCtaDisabled([false, false, false]),
    );
    assertTrue(
      "TC45: rtv — CHỈ điền 1/3 ô (tối thiểu) -> CTA KHÔNG disable (không còn bắt buộc đúng 2 như trước)",
      !s.isCtaDisabled([true, false, false]),
    );
    assertTrue(
      "TC46: rtv — điền lẻ tẻ 2/3 ô (VD ô 1 và ô 3) -> CTA vẫn KHÔNG disable",
      !s.isCtaDisabled([true, false, true]),
    );
    assertTrue(
      "TC47: rtv — điền đủ cả 3/3 ô -> CTA KHÔNG disable",
      !s.isCtaDisabled([true, true, true]),
    );
  }
  {
    // Đối chứng: itv KHÔNG bị ảnh hưởng — vẫn giữ đúng luật cũ (MỌI ô render
    // ra đều bắt buộc phải điền), bất kể videoStyle general hay smooth_transition.
    const s = buildComponentState();
    s.formData.title = "Video test";
    s.formData.value = "Ý tưởng";
    s.formData.videoMode = "itv";
    s.formData.videoDuration = "3";
    assertTrue(
      "TC48: itv — thiếu 1/3 ô ảnh -> vẫn CTA disable như cũ (không bị đổi theo rtv)",
      s.isCtaDisabled([true, false, true]),
    );
    assertTrue(
      "TC49: itv — đủ cả 3/3 ô -> CTA không disable như cũ",
      !s.isCtaDisabled([true, true, true]),
    );
  }

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail > 0 ? 1 : 0);
}

main();
