<script setup lang="ts">
// [2026-09-01] Xem lại lịch sử chat website CHO ADMIN (WebsiteChatSessionModel)
// — cố ý COPY lại đúng UI bong bóng chat + nút "Sao chép kịch bản" từ
// WebsiteChatWidget.vue (khung chat thật của khách) thay vì tách thành 1
// component dùng chung, để KHÔNG động/rủi ro gì tới widget khách hàng đang
// chạy ổn định. Component này chỉ đọc (không có ô nhập/nút gửi).
type TranscriptMessage = {
  role: "user" | "assistant";
  content: string;
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

// Giống hệt cơ chế marker <<<PROMPT_START>>>/<<<PROMPT_END>>> ở
// WebsiteChatWidget.vue — xem ghi chú đầy đủ ở file gốc.
const PROMPT_BLOCK_REGEX = /<<<PROMPT_START>>>([\s\S]*?)<<<PROMPT_END>>>/;
function extractScriptBlock(content: string): string | null {
  const match = (content || "").match(PROMPT_BLOCK_REGEX);
  return match ? match[1].trim() : null;
}
function getDisplayText(content: string): string {
  const stripped = (content || "").replace(PROMPT_BLOCK_REGEX, (_full, inner) => inner.trim());
  return stripped.replace(/<<<PROMPT_(START|END)>>>/g, "").trim();
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
          <span class="wct-bubble-text" v-html="renderMessageContent(getDisplayText(m.content))"></span>
        </div>
        <button
          v-if="m.role !== 'user' && extractScriptBlock(m.content)"
          type="button"
          class="wct-copy-btn"
          @click="onCopyScript(m.content, i)"
        >
          Sao chép
          <v-icon size="14" :color="copiedIndex === i ? '#16a34a' : undefined">
            {{ copiedIndex === i ? "mdi-check" : "mdi-content-copy" }}
          </v-icon>
        </button>
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
  max-width: 76%;
}
.wct-row-user .wct-col {
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
.wct-copy-btn {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 6px;
  padding: 5px 10px;
  border: 1px solid #d7e3ec;
  border-radius: 8px;
  background: #f4f8fb;
  color: #0072c6;
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.wct-copy-btn:hover {
  background: #e7f1fa;
  border-color: #b9d6ea;
}
.wct-bubble-text :deep(a) {
  color: #0072c6;
  text-decoration: underline;
  word-break: break-all;
}
.wct-bubble-user .wct-bubble-text :deep(a) {
  color: #fff;
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
