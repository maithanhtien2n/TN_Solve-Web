<script setup lang="ts">
// [2026-09-01] Xem lại lịch sử chat website CHO ADMIN (WebsiteChatSessionModel)
// — cố ý COPY lại đúng UI bong bóng chat + nút "Sao chép kịch bản" từ
// WebsiteChatWidget.vue (khung chat thật của khách) thay vì tách thành 1
// component dùng chung, để KHÔNG động/rủi ro gì tới widget khách hàng đang
// chạy ổn định. Component này chỉ đọc (không có ô nhập/nút gửi).
type TranscriptMessage = {
  role: "user" | "assistant";
  content: string;
  // [2026-09-02] Tên file khách đính kèm ở đúng lượt hỏi đó (nếu có) — chỉ có
  // ở message role "user", do server ghi lại (xem website-chat.service.ts
  // logChatSession). Trước đây field này không tồn tại nên bong bóng khách
  // đính kèm file KHÔNG hiện icon file gì cả bên admin, dù bên widget khách
  // vẫn hiện bình thường (đó là do FE tự vẽ từ state cục bộ, không đọc DB).
  fileNames?: string[];
  createdAt: string | Date;
};

const props = defineProps<{ messages: TranscriptMessage[] }>();

function formatTime(dateVal: string | Date) {
  return new Date(dateVal).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Giống hệt renderMessageContent/escapeHtml ở WebsiteChatWidget.vue — tự
// escape HTML trước rồi mới biến URL thành thẻ <a>, chặn XSS từ nội dung do
// AI/khách sinh ra (xem ghi chú đầy đủ ở file gốc).
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
    const trailingMatch = rawUrl.match(/[).,;:!?'"]+$/);
    const trailing = trailingMatch ? trailingMatch[0] : "";
    const url = trailing ? rawUrl.slice(0, -trailing.length) : rawUrl;
    if (!url) return rawUrl;
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>${trailing}`;
  });
}

// [2026-09-02] Đồng bộ với WebsiteChatWidget.vue (bên client) — thu gọn câu
// hỏi dài của user còn 6 dòng, nút "Xem thêm/Thu gọn" bung ra khi cần. CHỈ
// áp dụng cho bong bóng user, không áp dụng cho câu trả lời của bot.
//
// [2026-09-02] SỬA LẠI: đo THẬT bằng ResizeObserver (scrollHeight vs
// clientHeight) thay vì đếm ký tự — xem ghi chú đầy đủ ở file gốc
// (WebsiteChatWidget.vue), lý do y hệt: đếm ký tự không phản ánh đúng việc
// line-clamp có THỰC SỰ cắt bớt nội dung hay không (phụ thuộc cách wrap
// chữ thật trên màn hình).
const expandedUserMsgs = ref<Record<number, boolean>>({});
function toggleUserMsgExpand(i: number) {
  expandedUserMsgs.value[i] = !expandedUserMsgs.value[i];
}
const overflowingUserMsgs = ref<Record<number, boolean>>({});
const userMsgEls = new Map<number, HTMLElement>();
const userMsgElIndex = new WeakMap<HTMLElement, number>();
let userMsgResizeObserver: ResizeObserver | null = null;
function measureUserMsgOverflow(el: HTMLElement, i: number) {
  overflowingUserMsgs.value[i] = el.scrollHeight - el.clientHeight > 1;
}
function ensureUserMsgObserver() {
  if (userMsgResizeObserver || typeof ResizeObserver === "undefined") return;
  userMsgResizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const el = entry.target as HTMLElement;
      const idx = userMsgElIndex.get(el);
      if (idx !== undefined) measureUserMsgOverflow(el, idx);
    }
  });
}
// el: "any" — Vue định nghĩa function ref nhận Element | ComponentPublicInstance
// | null, thực tế luôn là 1 <span> DOM thật nên ép kiểu thẳng xuống HTMLElement
// bên dưới là an toàn.
function registerUserMsgTextEl(el: any, i: number) {
  const prev = userMsgEls.get(i);
  if (prev) {
    userMsgResizeObserver?.unobserve(prev);
    userMsgElIndex.delete(prev);
  }
  if (!el) {
    userMsgEls.delete(i);
    return;
  }
  const htmlEl = el as HTMLElement;
  userMsgEls.set(i, htmlEl);
  userMsgElIndex.set(htmlEl, i);
  ensureUserMsgObserver();
  userMsgResizeObserver?.observe(htmlEl);
  measureUserMsgOverflow(htmlEl, i);
}
onUnmounted(() => {
  userMsgResizeObserver?.disconnect();
});

// Giống hệt cơ chế marker <<<PROMPT_START>>>/<<<PROMPT_END>>> ở
// WebsiteChatWidget.vue — xem ghi chú đầy đủ ở file gốc.
const PROMPT_BLOCK_REGEX = /<<<PROMPT_START>>>([\s\S]*?)<<<PROMPT_END>>>/;
function extractScriptBlock(content: string): string | null {
  const match = (content || "").match(PROMPT_BLOCK_REGEX);
  return match ? match[1].trim() : null;
}
// Giống hệt splitMessageParts ở WebsiteChatWidget.vue — tách chữ thường
// trước/sau kịch bản để hiện kịch bản riêng trong khối nền xám (xem ghi chú
// đầy đủ ở file gốc).
function splitMessageParts(content: string): {
  before: string;
  script: string | null;
  after: string;
} {
  const raw = content || "";
  const match = raw.match(PROMPT_BLOCK_REGEX);
  if (!match || match.index === undefined) {
    return { before: raw.replace(/<<<PROMPT_(START|END)>>>/g, "").trim(), script: null, after: "" };
  }
  // .replace() dọn marker LẺ còn sót — phòng trường hợp hiếm bot lỡ tạo 2 khối
  // kịch bản trong cùng 1 tin nhắn (regex trên không có cờ /g nên chỉ bắt
  // được khối ĐẦU TIÊN, khối thứ 2 sẽ rơi vào "after" còn nguyên marker thô).
  return {
    before: raw.slice(0, match.index).replace(/<<<PROMPT_(START|END)>>>/g, "").trim(),
    script: match[1].trim(),
    after: raw.slice(match.index + match[0].length).replace(/<<<PROMPT_(START|END)>>>/g, "").trim(),
  };
}

const copiedIndex = ref<number | null>(null);
let copiedTimer: ReturnType<typeof setTimeout> | null = null;
async function onCopyScript(content: string, index: number) {
  const script = extractScriptBlock(content);
  if (!script) return;
  try {
    await navigator.clipboard.writeText(script);
    copiedIndex.value = index;
    if (copiedTimer) clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => {
      copiedIndex.value = null;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy script:", err);
  }
}
</script>

<template>
  <div class="wct-panel">
    <div v-if="!props.messages?.length" class="wct-empty">Phiên chat này không có tin nhắn nào.</div>

    <div
      v-for="(m, i) in props.messages"
      :key="i"
      class="wct-row"
      :class="{ 'wct-row-user': m.role === 'user' }"
    >
      <div v-if="m.role !== 'user'" class="wct-avatar">
        <img src="/images/avatar-tnsolve.jpg" alt="TN Solve" />
      </div>
      <div class="wct-col">
        <div class="wct-bubble" :class="{ 'wct-bubble-user': m.role === 'user' }">
          <span
            v-if="m.role === 'user' || splitMessageParts(m.content).before"
            class="wct-bubble-text"
            :class="{ 'wct-bubble-text--clamped': m.role === 'user' && !expandedUserMsgs[i] }"
            :ref="m.role === 'user' ? (el) => registerUserMsgTextEl(el, i) : undefined"
            v-html="renderMessageContent(m.role === 'user' ? m.content : splitMessageParts(m.content).before)"
          ></span>
          <button
            v-if="m.role === 'user' && overflowingUserMsgs[i]"
            type="button"
            class="wct-msg-toggle-btn"
            @click="toggleUserMsgExpand(i)"
          >
            {{ expandedUserMsgs[i] ? "Thu gọn" : "Xem thêm" }}
          </button>

          <div v-if="m.role !== 'user' && splitMessageParts(m.content).script" class="wct-prompt-box">
            <div class="wct-prompt-header">
              <span class="wct-prompt-label">Prompt</span>
              <button type="button" class="wct-prompt-copy-btn" @click="onCopyScript(m.content, i)">
                Sao chép
                <v-icon size="14" :color="copiedIndex === i ? '#16a34a' : undefined">
                  {{ copiedIndex === i ? "mdi-check" : "mdi-content-copy" }}
                </v-icon>
              </button>
            </div>
            <div class="wct-prompt-content" v-html="renderMessageContent(splitMessageParts(m.content).script || '')"></div>
          </div>

          <span
            v-if="m.role !== 'user' && splitMessageParts(m.content).after"
            class="wct-bubble-text"
            v-html="renderMessageContent(splitMessageParts(m.content).after)"
          ></span>

          <div v-if="m.fileNames?.length" class="wct-bubble-files">
            <v-icon size="13">mdi-paperclip</v-icon>
            {{ m.fileNames.join(", ") }}
          </div>
        </div>
        <div class="wct-time" :class="{ 'wct-time-user': m.role === 'user' }">
          {{ formatTime(m.createdAt) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wct-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 12px;
  background: #f4f7fb;
  border-radius: 10px;
  /* Không tự cuộn riêng — CommonDialog (v-dialog scrollable) đã lo phần cuộn
     bên ngoài (v-card-text), tránh 2 lớp thanh cuộn lồng nhau. */
}
.wct-empty {
  text-align: center;
  color: #94a3b8;
  font-size: 0.85rem;
  padding: 24px 0;
}
.wct-row {
  display: flex;
  align-items: flex-end;
  gap: 6px;
}
.wct-row-user {
  justify-content: flex-end;
}
.wct-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0984e3, #00b8d9);
  overflow: hidden;
  flex: none;
  margin-bottom: 2px;
}
.wct-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.wct-col {
  display: flex;
  flex-direction: column;
  /* [2026-09-02] Đồng bộ với WebsiteChatWidget.vue (bên client) — CHỈ nới
     giới hạn tối đa 76% -> 100% (tin dài được dùng hết chiều rộng), KHÔNG ép
     full cứng bằng "flex: 1" (thử trước đó, sai — khiến tin ngắn như "ok cảm
     ơn ạ" cũng bị kéo full xấu). Không có flex-grow nên vẫn tự co theo đúng
     nội dung như bong bóng chat bình thường. */
  max-width: 100%;
}
.wct-row-user .wct-col {
  /* Khôi phục lại — bong bóng khách tự co theo nội dung rồi nép sát phải. */
  align-items: flex-end;
}
.wct-bubble {
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
.wct-bubble-user {
  background: linear-gradient(135deg, #0984e3, #0072c6);
  color: white;
  border-radius: 16px 16px 4px 16px;
  box-shadow: 0 4px 12px -4px rgba(9, 132, 227, 0.5);
}
/* Khối kịch bản (Prompt) — xem ghi chú đầy đủ ở WebsiteChatWidget.vue gốc. */
.wct-prompt-box {
  margin: 8px 0;
  border-radius: 10px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-left: 3px solid #0072c6;
  overflow: hidden;
}
.wct-prompt-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 10px;
  background: #e2e8f0;
}
.wct-prompt-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #475569;
  letter-spacing: 0.02em;
}
.wct-prompt-copy-btn {
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
.wct-prompt-copy-btn:hover {
  background: #f4f8fb;
  border-color: #b9d6ea;
}
.wct-prompt-content {
  padding: 10px;
  font-size: 0.85rem;
  line-height: 1.5;
  color: #334155;
  white-space: pre-wrap;
  word-break: break-word;
}
.wct-prompt-content :deep(a) {
  color: #0072c6;
  text-decoration: underline;
  word-break: break-all;
}
.wct-bubble-text :deep(a) {
  color: #0072c6;
  text-decoration: underline;
  word-break: break-all;
}
.wct-bubble-user .wct-bubble-text :deep(a) {
  color: #fff;
}
.wct-bubble-files {
  font-size: 0.72rem;
  opacity: 0.8;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 4px;
}
/* [2026-09-02] Đồng bộ với WebsiteChatWidget.vue — xem ghi chú đầy đủ ở
   .chat-bubble-text--clamped/.chat-msg-toggle-btn file gốc. */
.wct-bubble-text--clamped {
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.wct-msg-toggle-btn {
  display: block;
  margin-top: 4px;
  background: none;
  border: none;
  padding: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
}
.wct-msg-toggle-btn:hover {
  text-decoration: underline;
}
.wct-time {
  font-size: 0.68rem;
  color: #94a3b8;
  margin-top: 3px;
  padding: 0 3px;
}
.wct-time-user {
  text-align: right;
}
</style>
