<script setup lang="ts">
import { websiteChatService } from "~/services/website-chat";

// [2026-08-31] Widget chat hỗ trợ khách hàng công khai — nổi góc phải dưới mọi
// trang. CHỈ dùng Hana (xem website-chat.service.ts bên server), lỗi báo
// thẳng ra khung chat, KHÔNG fallback provider khác. KHÔNG lưu lịch sử DB —
// chỉ giữ trong sessionStorage (mất khi đóng tab/trình duyệt), đúng yêu cầu.
const { onGetterUserData: userData } = useAppStore();

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

onMounted(loadForCurrentAccount);

// Đổi tài khoản (đăng nhập/đăng xuất) NGAY TRONG cùng 1 tab, không cần tải lại
// trang — SPA nên không tự reload để chạy lại onMounted, phải tự lắng nghe.
watch(
  () => userData.value?.email,
  () => loadForCurrentAccount()
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

function toggleOpen() {
  open.value = !open.value;
  if (open.value) {
    hasOpenedOnce.value = true;
    scrollToBottom();
    nextTick(() => inputRef.value?.focus?.());
  }
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
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
      <div v-if="open" class="chat-panel">
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
                {{ m.content }}
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

    <button class="chat-fab" :class="{ 'chat-fab-open': open }" @click="toggleOpen">
      <span v-if="!hasOpenedOnce" class="chat-fab-ring"></span>
      <v-icon size="26" color="white">{{ open ? "mdi-close" : "mdi-chat-processing-outline" }}</v-icon>
    </button>
  </div>
</template>

<style scoped>
.chat-widget {
  position: fixed;
  right: 20px;
  bottom: 20px;
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

@media (max-width: 480px) {
  .chat-widget {
    right: 12px;
    bottom: 12px;
  }
  .chat-panel {
    width: calc(100vw - 24px);
    bottom: 72px;
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
