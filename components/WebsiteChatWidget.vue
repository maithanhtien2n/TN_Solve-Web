<script setup lang="ts">
import { websiteChatService } from "~/services/website-chat";

// [2026-08-31] Widget chat hỗ trợ khách hàng công khai — nổi góc phải dưới mọi
// trang. CHỈ dùng Hana (xem website-chat.service.ts bên server), lỗi báo
// thẳng ra khung chat, KHÔNG fallback provider khác. KHÔNG lưu lịch sử DB —
// chỉ giữ trong sessionStorage (mất khi đóng tab/trình duyệt), đúng yêu cầu.
const {
  onGetterUserData: userData,
  // [2026-08-31] Sidebar điều hướng mobile (AppHeader.vue) mở/đóng qua state
  // CHUNG này — đọc để tự ẩn nút chat nổi lúc sidebar đang mở, tránh nút chat
  // đè lên trên lớp phủ mờ của sidebar (từng thử chỉnh z-index bên
  // AppHeader.vue không ăn thua, xử lý dứt điểm bằng cách ẩn hẳn ở đây).
  onGetterMobileNavOpen: mobileNavOpen,
} = useAppStore();

// [2026-08-31] sessionStorage chỉ theo TAB, KHÔNG biết ai đang đăng nhập — nếu
// dùng 1 key cố định, 2 tài khoản dùng chung 1 tab (máy chung, đăng xuất rồi
// người khác đăng nhập không đóng tab) sẽ thấy lịch sử chat của nhau. Gắn key
// theo email tài khoản (hoặc "guest" nếu chưa đăng nhập) — mỗi tài khoản có
// "ngăn" riêng, đổi tài khoản là tự động không thấy chat của người khác nữa.
const storageKey = computed(
  () => `tnsolve_website_chat_history_${userData.value?.email || "guest"}`
);
const MAX_FILES = 3;
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB — khớp giới hạn server

type ChatMessage = {
  role: "user" | "assistant" | "error";
  content: string;
  fileNames?: string[];
  time: number;
};

const SUGGESTIONS = [
  "Giá bao nhiêu?",
  "Hướng dẫn đăng ký",
  "Có video demo không?",
];

const open = ref(false);
const hasOpenedOnce = ref(false);
const messages = ref<ChatMessage[]>([]);
const input = ref("");
const pendingFiles = ref<File[]>([]);
const sending = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const scrollRef = ref<HTMLElement | null>(null);
const inputRef = ref<any>(null);

// [2026-08-31] Trên điện thoại, panel chat chuyển sang full màn hình (xem CSS
// @media max-width:480px) — dùng để ẩn FAB lúc panel mở (setBackgroundScrollLocked)
// và đồng bộ chiều cao panel theo bàn phím ảo (xem visualViewport bên dưới).
const isMobile = ref(false);
onMounted(() => {
  const mql = window.matchMedia("(max-width: 480px)");
  isMobile.value = mql.matches;
  mql.addEventListener("change", (e) => (isMobile.value = e.matches));
});

// [2026-08-31] Bàn phím ảo mobile bật lên -> header/panel bị "trôi" lên,
// header khuất mất khỏi màn hình. Nguyên nhân: panel dùng position:fixed +
// 100dvh, nhưng một số trình duyệt (đặc biệt Chrome Android chưa hỗ trợ/tôn
// trọng viewport meta interactive-widget=resizes-content — đã thêm ở
// nuxt.config.ts, lớp phòng chính) xử lý bàn phím kiểu "đè lên nội dung +
// tự cuộn cả trang để lộ ô input" thay vì co lại đúng, khiến 100dvh không
// phản ứng theo và phần fixed bị lệch khỏi vùng nhìn thấy thật.
// Lớp DỰ PHÒNG này bám trực tiếp vào window.visualViewport (viewport THẬT sau
// khi trừ phần bàn phím che, hỗ trợ rộng: iOS Safari 13+, Chrome, Firefox
// mobile) — tự đặt đúng chiều cao + vị trí top của panel theo viewport thật
// mỗi khi nó đổi (bàn phím bật/tắt, hoặc visual viewport bị cuộn/pan), đảm
// bảo panel luôn khớp khung nhìn thật bất kể trình duyệt xử lý bàn phím kiểu
// gì. Chỉ áp dụng khi panel đang mở + đang ở mobile — không đụng gì trên
// máy tính.
const mobileViewportStyle = ref<Record<string, string> | undefined>(undefined);
function syncMobileViewport() {
  const vv = window.visualViewport;
  if (!vv || !isMobile.value || !open.value) {
    mobileViewportStyle.value = undefined;
    return;
  }
  mobileViewportStyle.value = {
    height: `${vv.height}px`,
    maxHeight: `${vv.height}px`,
    top: `${vv.offsetTop}px`,
  };
}
onMounted(() => {
  if (!window.visualViewport) return;
  window.visualViewport.addEventListener("resize", syncMobileViewport);
  window.visualViewport.addEventListener("scroll", syncMobileViewport);
});
onUnmounted(() => {
  if (!window.visualViewport) return;
  window.visualViewport.removeEventListener("resize", syncMobileViewport);
  window.visualViewport.removeEventListener("scroll", syncMobileViewport);
});
watch(open, () => nextTick(syncMobileViewport));

function loadForCurrentAccount() {
  try {
    const saved = sessionStorage.getItem(storageKey.value);
    messages.value = saved ? JSON.parse(saved) : [];
    hasOpenedOnce.value = !!saved;
  } catch {
    // sessionStorage có thể bị chặn (private browsing...) — bỏ qua, chat vẫn
    // hoạt động bình thường trong phiên hiện tại, chỉ là không khôi phục được.
    messages.value = [];
  }
}

// [2026-09-01] Mã phiên GỬI KÈM BE để admin xem lại lịch sử chat gộp đúng 1
// cuộc hội thoại (WebsiteChatSessionModel, TTL 30 ngày). PHẢI gắn theo TÀI
// KHOẢN giống hệt storageKey ở trên (cùng key-pattern "..._${email||guest}"),
// KHÔNG dùng 1 key cố định cho cả tab — lúc đầu làm key cố định, kết quả là
// khách chat lúc CHƯA đăng nhập rồi đăng nhập NGAY TRONG cùng tab (không đóng
// tab) bị gộp lộn 2 cuộc trò chuyện khác nhau vào 1 phiên bên admin, trong
// khi chính khung chat của khách đã tự tách lịch sử hiển thị ra 2 nơi khác
// nhau rồi (đổi storageKey) — 2 cơ chế lệch nhau. Giờ sessionId đổi theo
// ĐÚNG NHỊP với storageKey (cùng trigger, cùng điều kiện đổi).
const SESSION_ID_STORAGE_PREFIX = "tnsolve_website_chat_session_id_";
const sessionIdStorageKey = computed(
  () => `${SESSION_ID_STORAGE_PREFIX}${userData.value?.email || "guest"}`
);
let sessionId = "";
function ensureSessionId() {
  const genId = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  try {
    sessionId = sessionStorage.getItem(sessionIdStorageKey.value) || "";
    if (!sessionId) {
      sessionId = genId();
      sessionStorage.setItem(sessionIdStorageKey.value, sessionId);
    }
  } catch {
    // sessionStorage bị chặn -> vẫn tạo id tạm cho phiên hiện tại (không sống
    // sót qua F5, nhưng không chặn chat hoạt động — xem ghi chú loadForCurrentAccount).
    // LUÔN tạo mới (không tái dùng biến cũ) — hàm này gọi lại mỗi khi đổi tài
    // khoản, id cũ thuộc về tài khoản/lượt trước, không được giữ lại.
    sessionId = genId();
  }
}

function loadForCurrentAccountAndSession() {
  loadForCurrentAccount();
  ensureSessionId();
}

onMounted(loadForCurrentAccountAndSession);

// Đổi tài khoản (đăng nhập/đăng xuất) NGAY TRONG cùng 1 tab, không cần tải lại
// trang — SPA nên không tự reload để chạy lại onMounted, phải tự lắng nghe.
// Gộp chung 1 watch cho cả lịch sử hiển thị (storageKey) VÀ mã phiên log admin
// (sessionIdStorageKey) — 2 cái này PHẢI luôn đổi cùng lúc, cùng 1 lý do.
watch(
  () => userData.value?.email,
  () => loadForCurrentAccountAndSession()
);

function persist() {
  try {
    sessionStorage.setItem(storageKey.value, JSON.stringify(messages.value));
  } catch {
    // xem ghi chú loadForCurrentAccount ở trên
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (scrollRef.value) scrollRef.value.scrollTop = scrollRef.value.scrollHeight;
  });
}

// [2026-08-31] Panel full màn hình trên mobile CHE MẮT trang nền chứ không
// che luôn khả năng cuộn của nó — html/body phía sau vẫn cuộn bình thường,
// ra 2 thanh cuộn cùng lúc (1 của khung tin nhắn, 1 của trang web nền).
// Chỉ set overflow:hidden trên body là KHÔNG đủ tin cậy (trang có thể có
// phần tử cuộn riêng ngoài body, một số trình duyệt mobile vẫn lách qua
// được) — dùng cách khoá chắc chắn hơn: ghim body đứng yên bằng
// position:fixed + đẩy lên đúng vị trí đang cuộn dở bằng margin âm "top",
// rồi khi mở khoá thì trả lại đúng scrollY cũ (không thì trang tự nhảy về
// đầu). Chỉ áp dụng mobile — máy tính là popup nổi, không che kín màn hình
// nên trang nền vẫn phải cuộn được bình thường.
let savedScrollY = 0;
function setBackgroundScrollLocked(locked: boolean) {
  if (!isMobile.value) return;
  if (locked) {
    savedScrollY = window.scrollY;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.width = "100%";
  } else {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, savedScrollY);
  }
}

function toggleOpen() {
  open.value = !open.value;
  setBackgroundScrollLocked(open.value);
  if (open.value) {
    hasOpenedOnce.value = true;
    scrollToBottom();
    nextTick(() => inputRef.value?.focus?.());
  }
}

onUnmounted(() => setBackgroundScrollLocked(false));

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// [2026-09-01] Bubble tin nhắn trước đây render bằng {{ m.content }} (mustache
// thuần) — Vue tự escape HTML nên AN TOÀN, nhưng cũng vì thế 1 chuỗi URL
// (VD link Zalo bot gợi ý trong knowledge-base.json) chỉ ra CHỮ, không thành
// thẻ <a> bấm được. Đổi sang v-html để chèn được <a>, nên PHẢI tự escape HTML
// trước (chặn XSS từ nội dung do AI/khách sinh ra) rồi mới thay URL bằng thẻ
// <a>, KHÔNG được làm ngược lại (escape sau sẽ biến luôn cả thẻ <a> vừa chèn
// thành chữ).
const URL_REGEX = /(https?:\/\/[^\s<]+)/g;
function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function renderMessageContent(content: string) {
  const escaped = escapeHtml(content || "");
  return escaped.replace(URL_REGEX, (rawUrl) => {
    // Bỏ dấu câu hay dính liền cuối URL (VD "...link)." hoặc "link," trong câu
    // văn) ra khỏi phần href, tránh bấm vào bị lỗi 404 vì dư ký tự.
    const trailingMatch = rawUrl.match(/[).,;:!?'"]+$/);
    const trailing = trailingMatch ? trailingMatch[0] : "";
    const url = trailing ? rawUrl.slice(0, -trailing.length) : rawUrl;
    if (!url) return rawUrl;
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>${trailing}`;
  });
}

// [2026-09-01] Khi bot viết/tối ưu kịch bản (system prompt), toàn bộ đoạn
// Style→hết Cảnh cuối được bọc trong cặp marker ẩn <<<PROMPT_START>>>/
// <<<PROMPT_END>>> — CHỈ dùng để FE tách CHÍNH XÁC đúng phần kịch bản ra copy
// (không lẫn câu dặn dò "dán vào ô Prompt..." phía sau), không phải cú pháp
// hiển thị — luôn phải strip khỏi content trước khi hiện cho user thấy.
const PROMPT_BLOCK_REGEX = /<<<PROMPT_START>>>([\s\S]*?)<<<PROMPT_END>>>/;
function extractScriptBlock(content: string): string | null {
  const match = (content || "").match(PROMPT_BLOCK_REGEX);
  return match ? match[1].trim() : null;
}
// [2026-09-01] Tách 1 tin nhắn bot thành 3 phần: chữ THƯỜNG trước kịch bản
// (VD "Đây là kịch bản mình viết cho bạn nhé:"), kịch bản (script, hiện
// riêng trong khối nền xám có label "Prompt" + nút Sao chép), và chữ thường
// SAU kịch bản (câu dặn dò dán vào ô Prompt...) — dùng chung 1 hàm để không
// phải chạy regex nhiều lần rải rác trong template.
function splitMessageParts(content: string): {
  before: string;
  script: string | null;
  after: string;
} {
  const raw = content || "";
  const match = raw.match(PROMPT_BLOCK_REGEX);
  if (!match || match.index === undefined) {
    // Không có kịch bản (hoặc bot lỡ thiếu 1 trong 2 marker) -> coi như toàn
    // bộ là chữ thường, dọn nốt marker lẻ (nếu có) để không lộ chữ kỹ thuật.
    return { before: raw.replace(/<<<PROMPT_(START|END)>>>/g, "").trim(), script: null, after: "" };
  }
  return {
    before: raw.slice(0, match.index).trim(),
    script: match[1].trim(),
    after: raw.slice(match.index + match[0].length).trim(),
  };
}

const copiedScriptIndex = ref<number | null>(null);
let copiedScriptTimer: ReturnType<typeof setTimeout> | null = null;
async function onCopyScript(content: string, index: number) {
  const script = extractScriptBlock(content);
  if (!script) return;
  try {
    await navigator.clipboard.writeText(script);
    copiedScriptIndex.value = index;
    if (copiedScriptTimer) clearTimeout(copiedScriptTimer);
    copiedScriptTimer = setTimeout(() => {
      copiedScriptIndex.value = null;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy script:", err);
  }
}

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

function fileIcon(file: File) {
  if (file.type.startsWith("image/")) return "mdi-image-outline";
  if (file.type.startsWith("video/")) return "mdi-video-outline";
  return "mdi-file-outline";
}

// Dùng chung cho cả 2 đường nhận file: bấm nút đính kèm (input[type=file])
// VÀ dán ảnh chụp màn hình bằng Ctrl+V (onPaste) — cùng 1 luật kiểm tra
// dung lượng/số lượng, tránh lặp code + lệch luật giữa 2 đường.
function addFiles(picked: File[]) {
  const room = MAX_FILES - pendingFiles.value.length;
  for (const file of picked.slice(0, room)) {
    if (file.size > MAX_FILE_BYTES) {
      messages.value.push({
        role: "error",
        content: `File "${file.name}" vượt quá 10MB, vui lòng chọn file nhỏ hơn.`,
        time: Date.now(),
      });
      continue;
    }
    pendingFiles.value.push(file);
  }
}

function onPickFiles(event: Event) {
  addFiles(Array.from((event.target as HTMLInputElement).files || []));
  if (fileInputRef.value) fileInputRef.value.value = "";
}

// Dán ảnh chụp màn hình (Ctrl+V) trực tiếp vào ô nhập — clipboard lúc đó
// chứa ảnh dạng file (image/png,...), không phải text, nên phải tự đọc qua
// clipboardData.items thay vì để trình duyệt paste như văn bản thường.
function onPaste(event: ClipboardEvent) {
  const items = event.clipboardData?.items;
  if (!items) return;

  const pastedImages: File[] = [];
  for (const item of items) {
    if (item.kind === "file" && item.type.startsWith("image/")) {
      const file = item.getAsFile();
      if (file) pastedImages.push(file);
    }
  }
  if (!pastedImages.length) return; // paste text bình thường -> để trình duyệt xử lý

  event.preventDefault(); // chặn paste text rỗng/base64 lẫn vào ô nhập
  addFiles(pastedImages);
}

function removeFile(index: number) {
  pendingFiles.value.splice(index, 1);
}

async function sendText(text: string) {
  if (!text || sending.value) return;

  const filesToSend = pendingFiles.value;
  messages.value.push({
    role: "user",
    content: text,
    fileNames: filesToSend.length ? filesToSend.map((f) => f.name) : undefined,
    time: Date.now(),
  });
  input.value = "";
  pendingFiles.value = [];
  sending.value = true;
  persist();
  scrollToBottom();

  try {
    const encodedFiles = await Promise.all(
      filesToSend.map(async (f) => ({
        data: await fileToBase64(f),
        mimeType: f.type || "application/octet-stream",
        filename: f.name,
      }))
    );

    // Chỉ gửi role/content trong lịch sử — KHÔNG gửi lại file cũ (file chỉ có
    // ý nghĩa với đúng lượt hỏi lúc đính kèm, gửi lại mỗi lần sẽ phình request
    // vô ích và không cần thiết cho ngữ cảnh văn bản).
    // Chỉ gửi 20 lượt gần nhất — chat càng dài prompt càng phình, chậm hơn và
    // (nếu sau này đổi sang provider tính phí) tốn hơn; 20 lượt đủ giữ mạch
    // ngữ cảnh cho 1 phiên tư vấn thông thường. PHẢI khớp/nhỏ hơn giới hạn
    // `.max()` bên schema (website-chat.schema.ts) — không thì bị lỗi validate
    // khi chat quá dài.
    const MAX_HISTORY_TURNS = 30;
    const conversation = messages.value
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(0, -1) // bỏ tin nhắn user vừa push ở trên — gửi riêng qua `message`
      .slice(-MAX_HISTORY_TURNS)
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

    const res: any = await websiteChatService.chat({
      conversation,
      message: text,
      files: encodedFiles.length ? encodedFiles : undefined,
      sessionId: sessionId || undefined,
      accountEmail: userData.value?.email || undefined,
    });

    messages.value.push({ role: "assistant", content: res.data.text, time: Date.now() });
  } catch (err: any) {
    messages.value.push({
      role: "error",
      content:
        err?.response?.data?.message ||
        "Xin lỗi, hiện chưa trả lời được, bạn thử lại sau nhé!",
      time: Date.now(),
    });
  } finally {
    sending.value = false;
    persist();
    scrollToBottom();
  }
}

function send() {
  sendText(input.value.trim());
}

function sendSuggestion(text: string) {
  sendText(text);
}
</script>

<template>
  <div class="chat-widget">
    <Transition name="chat-pop">
      <div v-if="open" class="chat-panel" :style="mobileViewportStyle">
        <div class="chat-header">
          <div class="chat-header-title">
            <div class="chat-header-avatar">
              <img src="/images/avatar-tnsolve.jpg" alt="TN Solve" />
              <span class="status-dot"></span>
            </div>
            <div>
              <div class="chat-header-name">TN Solve</div>
              <div class="chat-header-status">Đang hoạt động</div>
            </div>
          </div>
          <button class="chat-header-close" @click="toggleOpen">
            <v-icon size="20" color="white">mdi-close</v-icon>
          </button>
        </div>

        <div ref="scrollRef" class="chat-body">
          <div v-if="!messages.length" class="chat-empty">
            <div class="chat-empty-avatar">
              <img src="/images/avatar-tnsolve.jpg" alt="TN Solve" />
            </div>
            <div class="chat-empty-title">Chào bạn 👋</div>
            <div class="chat-empty-sub">
              Có gì cần tư vấn về TN Solve cứ nhắn ở đây, mình trả lời liền nha!
            </div>
            <div class="chat-suggestions">
              <button
                v-for="s in SUGGESTIONS"
                :key="s"
                class="chat-suggestion-chip"
                @click="sendSuggestion(s)"
              >
                {{ s }}
              </button>
            </div>
          </div>

          <div
            v-for="(m, i) in messages"
            :key="i"
            class="chat-row"
            :class="{ 'chat-row-user': m.role === 'user' }"
          >
            <div v-if="m.role !== 'user'" class="chat-avatar">
              <img src="/images/avatar-tnsolve.jpg" alt="TN Solve" />
            </div>
            <div class="chat-bubble-col">
              <div
                class="chat-bubble"
                :class="{
                  'chat-bubble-user': m.role === 'user',
                  'chat-bubble-error': m.role === 'error',
                }"
              >
                <span
                  v-if="m.role === 'user' || splitMessageParts(m.content).before"
                  class="chat-bubble-text"
                  v-html="renderMessageContent(m.role === 'user' ? m.content : splitMessageParts(m.content).before)"
                ></span>

                <div v-if="m.role !== 'user' && splitMessageParts(m.content).script" class="chat-prompt-box">
                  <div class="chat-prompt-header">
                    <span class="chat-prompt-label">Prompt</span>
                    <button
                      type="button"
                      class="chat-prompt-copy-btn"
                      @click="onCopyScript(m.content, i)"
                    >
                      Sao chép
                      <v-icon size="14" :color="copiedScriptIndex === i ? '#16a34a' : undefined">
                        {{ copiedScriptIndex === i ? "mdi-check" : "mdi-content-copy" }}
                      </v-icon>
                    </button>
                  </div>
                  <div
                    class="chat-prompt-content"
                    v-html="renderMessageContent(splitMessageParts(m.content).script || '')"
                  ></div>
                </div>

                <span
                  v-if="m.role !== 'user' && splitMessageParts(m.content).after"
                  class="chat-bubble-text"
                  v-html="renderMessageContent(splitMessageParts(m.content).after)"
                ></span>

                <div v-if="m.fileNames?.length" class="chat-bubble-files">
                  <v-icon size="13">mdi-paperclip</v-icon>
                  {{ m.fileNames.join(", ") }}
                </div>
              </div>
              <div class="chat-bubble-time" :class="{ 'chat-bubble-time-user': m.role === 'user' }">
                {{ formatTime(m.time) }}
              </div>
            </div>
          </div>

          <div v-if="sending" class="chat-row">
            <div class="chat-avatar">
              <img src="/images/avatar-tnsolve.jpg" alt="TN Solve" />
            </div>
            <div class="chat-bubble chat-bubble-typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <div v-if="pendingFiles.length" class="chat-files-preview">
          <div v-for="(f, i) in pendingFiles" :key="i" class="chat-file-chip">
            <v-icon size="15">{{ fileIcon(f) }}</v-icon>
            <span class="chat-file-chip-name">{{ f.name }}</span>
            <button class="chat-file-chip-remove" @click="removeFile(i)">
              <v-icon size="13">mdi-close</v-icon>
            </button>
          </div>
        </div>

        <div class="chat-input-row">
          <input
            ref="fileInputRef"
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
            style="display: none"
            @change="onPickFiles"
          />
          <button
            class="chat-icon-btn"
            :disabled="pendingFiles.length >= MAX_FILES"
            title="Đính kèm file"
            @click="fileInputRef?.click()"
          >
            <v-icon size="20">mdi-paperclip</v-icon>
          </button>
          <input
            ref="inputRef"
            v-model="input"
            class="chat-input"
            placeholder="Nhập tin nhắn..."
            @keydown.enter="send"
            @paste="onPaste"
          />
          <button
            class="chat-send-btn"
            :class="{ 'chat-send-btn-active': input.trim() && !sending }"
            :disabled="!input.trim() || sending"
            @click="send"
          >
            <v-progress-circular v-if="sending" size="18" width="2" indeterminate color="white" />
            <v-icon v-else size="18" color="white">mdi-send</v-icon>
          </button>
        </div>
      </div>
    </Transition>

    <!-- [2026-08-31] Trên mobile, panel mở full màn hình đã che kín nút này
         rồi (xem CSS .chat-panel trong @media max-width:480px) — vẫn giữ nó
         RENDER + đổi icon thành X chỉ tổ gây giật/nhấp nháy lúc bấm (panel
         có transition mở, nút lộ ra 1 nhịp trước khi bị che). Ẩn hẳn luôn
         khi đang mở trên mobile, không chỉ dựa vào z-index che nữa. Máy tính
         giữ nguyên hành vi cũ (panel là popup nổi, không che kín, nút X vẫn
         cần hiện làm lối đóng phụ). -->
    <button
      v-show="!(open && isMobile) && !mobileNavOpen"
      class="chat-fab"
      :class="{ 'chat-fab-open': open }"
      @click="toggleOpen"
    >
      <span v-if="!hasOpenedOnce" class="chat-fab-ring"></span>
      <v-icon size="26" color="white">{{ open ? "mdi-close" : "mdi-chat-processing-outline" }}</v-icon>
    </button>
  </div>
</template>

<style scoped>
.chat-widget {
  position: fixed;
  /* [2026-08-31] Khớp đúng lề nội dung trang: v-container (Vuetify) mặc định
     padding: 16px 2 bên, header/nội dung trang đều nằm trong đó -> FAB thẳng
     hàng với lề thật của nội dung thay vì 1 con số ước chừng. */
  right: 16px;
  bottom: 16px;
  z-index: 2000;
  font-family: inherit;
}

/* ── FAB ─────────────────────────────────────────────── */
.chat-fab {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0984e3, #00b8d9);
  box-shadow: 0 10px 28px -6px rgba(9, 132, 227, 0.55);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}
.chat-fab:hover {
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 14px 32px -6px rgba(9, 132, 227, 0.65);
}
.chat-fab:active {
  transform: scale(0.96);
}
.chat-fab-ring {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid #0984e3;
  opacity: 0.55;
  animation: chat-ring-pulse 2.2s ease-out infinite;
}
@keyframes chat-ring-pulse {
  0% {
    transform: scale(0.85);
    opacity: 0.55;
  }
  100% {
    transform: scale(1.35);
    opacity: 0;
  }
}

/* ── Panel ───────────────────────────────────────────── */
.chat-panel {
  position: absolute;
  right: 0;
  bottom: 76px;
  width: 360px;
  max-width: calc(100vw - 32px);
  height: 500px;
  max-height: 72vh;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 20px 60px -12px rgba(15, 23, 42, 0.28), 0 2px 8px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform-origin: bottom right;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 62px;
  box-sizing: border-box;
  padding: 0 16px 0 14px;
  flex: none;
  background: linear-gradient(120deg, #0984e3, #06a5c2);
  position: relative;
}
.chat-header-title {
  display: flex;
  align-items: center;
  gap: 10px;
}
.chat-header-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  position: relative;
  flex: none;
}
.chat-header-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}
.chat-header-name {
  font-weight: 700;
  font-size: 0.96rem;
  line-height: 1.2;
  color: #fff;
  letter-spacing: -0.01em;
}
.chat-header-status {
  font-size: 0.72rem;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.88);
  margin-top: 2px;
}
.status-dot {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4ade80;
}
.status-dot::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #4ade80;
  animation: status-dot-pulse 1.8s ease-out infinite;
}
@keyframes status-dot-pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  100% {
    transform: scale(2.2);
    opacity: 0;
  }
}
.chat-header-close {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease;
}
.chat-header-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* ── Body ────────────────────────────────────────────── */
.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f8fafc;
}
.chat-body::-webkit-scrollbar {
  width: 6px;
}
.chat-body::-webkit-scrollbar-thumb {
  background: #d5dbe3;
  border-radius: 6px;
}

.chat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 20px;
  padding: 0 8px;
}
.chat-empty-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0984e3, #00b8d9);
  overflow: hidden;
  margin-bottom: 10px;
  box-shadow: 0 4px 14px -4px rgba(9, 132, 227, 0.5);
}
.chat-empty-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.chat-empty-title {
  font-weight: 700;
  font-size: 1rem;
  color: #1e293b;
}
.chat-empty-sub {
  font-size: 0.82rem;
  color: #64748b;
  margin-top: 4px;
  line-height: 1.5;
}
.chat-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
  margin-top: 16px;
}
.chat-suggestion-chip {
  border: 1px solid #d9e6f2;
  background: #fff;
  color: #0984e3;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 7px 13px;
  border-radius: 99px;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.1s ease;
}
.chat-suggestion-chip:hover {
  background: #eaf4fd;
  transform: translateY(-1px);
}

.chat-row {
  display: flex;
  align-items: flex-end;
  gap: 6px;
}
.chat-row-user {
  justify-content: flex-end;
}
.chat-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0984e3, #00b8d9);
  overflow: hidden;
  flex: none;
  margin-bottom: 2px;
}
.chat-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.chat-bubble-col {
  display: flex;
  flex-direction: column;
  max-width: 76%;
}
.chat-row-user .chat-bubble-col {
  align-items: flex-end;
}
.chat-bubble {
  padding: 9px 13px;
  border-radius: 16px 16px 16px 4px;
  background: #fff;
  color: #1e293b;
  font-size: 0.87rem;
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-word;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
}
.chat-bubble-user {
  background: linear-gradient(135deg, #0984e3, #0072c6);
  color: white;
  border-radius: 16px 16px 4px 16px;
  box-shadow: 0 4px 12px -4px rgba(9, 132, 227, 0.5);
}
.chat-bubble-error {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}
.chat-bubble-files {
  font-size: 0.72rem;
  opacity: 0.8;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 4px;
}
/* [2026-09-01] Khối kịch bản (Prompt) — tách hẳn khỏi phần chữ thường của
   bot, nền xám riêng biệt, label "Prompt" bên trái + nút Sao chép bên phải ở
   đầu khối, nội dung kịch bản bên dưới. Đặt cách phần text trước/sau 1 khoảng
   margin cho rõ ràng đây là 1 khối riêng, không phải văn xuôi bình thường. */
.chat-prompt-box {
  margin: 8px 0;
  border-radius: 10px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-left: 3px solid #0072c6;
  overflow: hidden;
}
.chat-prompt-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 10px;
  background: #e2e8f0;
}
.chat-prompt-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #475569;
  letter-spacing: 0.02em;
}
.chat-prompt-copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border: 1px solid #d7e3ec;
  border-radius: 7px;
  background: #fff;
  color: #0072c6;
  font-size: 0.74rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.chat-prompt-copy-btn:hover {
  background: #f4f8fb;
  border-color: #b9d6ea;
}
.chat-prompt-content {
  padding: 10px;
  font-size: 0.85rem;
  line-height: 1.5;
  color: #334155;
  white-space: pre-wrap;
  word-break: break-word;
}
.chat-prompt-content :deep(a) {
  color: #0072c6;
  text-decoration: underline;
  word-break: break-all;
}
.chat-bubble-text :deep(a) {
  color: #0072c6;
  text-decoration: underline;
  word-break: break-all;
}
.chat-bubble-user .chat-bubble-text :deep(a) {
  color: #fff;
}
.chat-bubble-time {
  font-size: 0.68rem;
  color: #94a3b8;
  margin-top: 3px;
  padding: 0 3px;
}
.chat-bubble-time-user {
  text-align: right;
}
.chat-bubble-typing {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 12px 14px;
}
.chat-bubble-typing span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #94a3b8;
  animation: chat-typing 1s infinite ease-in-out;
}
.chat-bubble-typing span:nth-child(2) {
  animation-delay: 0.15s;
}
.chat-bubble-typing span:nth-child(3) {
  animation-delay: 0.3s;
}
@keyframes chat-typing {
  0%,
  60%,
  100% {
    opacity: 0.3;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateY(-2px);
  }
}

/* ── File preview ────────────────────────────────────── */
.chat-files-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 10px 14px 0;
  flex: none;
  background: #fff;
}
.chat-file-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #eef2f7;
  border-radius: 8px;
  padding: 5px 8px;
  font-size: 0.74rem;
  color: #334155;
  max-width: 150px;
}
.chat-file-chip-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.chat-file-chip-remove {
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  color: #94a3b8;
  flex: none;
}
.chat-file-chip-remove:hover {
  color: #475569;
}

/* ── Input row ───────────────────────────────────────── */
.chat-input-row {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 62px;
  box-sizing: border-box;
  padding: 0 12px;
  border-top: 1px solid #eef1f5;
  flex: none;
  background: #fff;
}
.chat-icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: none;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex: none;
  transition: background 0.15s ease;
}
.chat-icon-btn:hover:not(:disabled) {
  background: #f1f5f9;
}
.chat-icon-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.chat-input {
  flex: 1;
  height: 40px;
  box-sizing: border-box;
  border: none;
  outline: none;
  background: #f1f5f9;
  border-radius: 20px;
  padding: 0 15px;
  font-size: 0.87rem;
  color: #1e293b;
  min-width: 0;
}
.chat-input::placeholder {
  color: #94a3b8;
}
.chat-send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: not-allowed;
  flex: none;
  transition: background 0.15s ease, transform 0.1s ease;
}
.chat-send-btn-active {
  background: linear-gradient(135deg, #0984e3, #0072c6);
  cursor: pointer;
}
.chat-send-btn-active:hover {
  transform: scale(1.06);
}
.chat-send-btn:disabled {
  cursor: not-allowed;
}

/* ── Transitions ─────────────────────────────────────── */
.chat-pop-enter-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.chat-pop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.chat-pop-enter-from,
.chat-pop-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.94);
}

/* ── Mobile: full màn hình, chỉ áp dụng cho điện thoại — máy tính giữ
   nguyên dạng popup nổi góc phải dưới như hiện tại. ────────────────── */
@media (max-width: 480px) {
  .chat-panel {
    /* position:fixed neo thẳng theo viewport (không phụ thuộc offset
       right/bottom của .chat-widget) -> phủ kín toàn màn hình, đè luôn FAB
       bên dưới nên không cần ẩn riêng nút FAB. */
    position: fixed;
    inset: 0;
    width: 100%;
    max-width: 100%;
    /* 100dvh = chiều cao viewport ĐỘNG, tự co lại đúng phần còn trống phía
       trên bàn phím ảo khi nó bật lên (trình duyệt mobile đời mới hỗ trợ) —
       100vh cũ không co theo bàn phím, input sẽ bị bàn phím che mất.
       Fallback 100vh cho trình duyệt chưa hỗ trợ dvh. */
    height: 100vh;
    height: 100dvh;
    max-height: 100vh;
    max-height: 100dvh;
    border-radius: 0;
    z-index: 1;
  }

  .chat-header {
    padding-top: env(safe-area-inset-top);
    height: calc(62px + env(safe-area-inset-top));
  }

  .chat-input-row {
    padding-bottom: env(safe-area-inset-bottom);
    height: calc(62px + env(safe-area-inset-bottom));
  }
}

@media (prefers-reduced-motion: reduce) {
  .chat-pop-enter-active,
  .chat-pop-leave-active,
  .chat-fab,
  .chat-send-btn {
    transition: none;
  }
  .chat-fab-ring {
    animation: none;
    display: none;
  }
  .chat-bubble-typing span {
    animation: none;
  }
  .status-dot::after {
    animation: none;
    display: none;
  }
}
</style>
