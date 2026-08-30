<script setup lang="ts">
const panel = ref<string[]>(["cookie", "api"]);

function onCopy(text: string) {
  navigator.clipboard.writeText(text);
  const { $toast } = useNuxtApp();
  $toast.success("Đã copy!");
}

const curlPool = `curl -X POST "https://gen.tnsolve.com/api/v1/gemini-hana/chat?tn_secret=xuxu2703" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Nội dung hỏi",
    "files": [{ "data": "<base64>", "mimeType": "image/jpeg", "filename": "a.jpg" }]
  }'`;

const curlPinned = `curl -X POST "https://gen.tnsolve.com/api/v1/gemini-hana/chat?tn_secret=xuxu2703" \\
  -H "Content-Type: application/json" \\
  -d '{
    "accountId": "<id lấy từ nút Copy ID ở trang Tài khoản>",
    "prompt": "Nội dung hỏi",
    "chatMetadata": null
  }'`;

definePageMeta({ layout: "admin", title: "Tài liệu" });
</script>

<template>
  <v-expansion-panels v-model="panel" multiple variant="accordion">
    <v-expansion-panel value="cookie">
      <v-expansion-panel-title>
        <v-icon class="mr-2">mdi-cookie-outline</v-icon>
        Cách lấy cookie để thêm tài khoản
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <ol class="doc-steps">
          <li>Mở <b>gemini.google.com</b> trên trình duyệt, đăng nhập tài khoản muốn dùng (nên dùng tài khoản test riêng, không dùng tài khoản chính).</li>
          <li>Bấm <b>F12</b> để mở DevTools.</li>
          <li>Vào tab <b>Application</b> (nếu không thấy, bấm mũi tên <code>»</code> để mở rộng danh sách tab).</li>
          <li>Ở cột trái, mở mục <b>Cookies</b> → chọn <code>https://gemini.google.com</code>.</li>
          <li>
            Trong bảng hiện ra, tìm đúng 2 dòng tên <b>chính xác</b> là:
            <ul class="mt-1">
              <li><code>__Secure-1PSID</code> — giá trị dài, bắt đầu bằng <code>g.a000...</code></li>
              <li><code>__Secure-1PSIDTS</code> — giá trị bắt đầu bằng <code>sidts-...</code></li>
            </ul>
            (Không nhầm với <code>__Secure-1PAPISID</code>/<code>SAPISID</code> — tên rất giống nhưng khác giá trị, giá trị đúng luôn dài hơn nhiều.)
          </li>
          <li>Bấm đúp vào ô <b>Value</b> để chọn hết chữ, <code>Ctrl+C</code> copy.</li>
          <li>Vào <b>Quản lý Gemini → Tài khoản</b>, bấm <b>+ Thêm tài khoản</b>, dán 2 giá trị vào đúng ô tương ứng.</li>
        </ol>

        <v-alert type="warning" variant="tonal" density="compact" class="mt-4">
          <code>__Secure-1PSIDTS</code> là cookie ngắn hạn — nếu tài khoản đó
          <b>cũng đang mở/đăng nhập ở 1 trình duyệt thật khác</b> cùng lúc,
          Google có thể cấp cookie mới cho phiên đó và huỷ luôn phiên đang
          dùng ở đây, gây lỗi "UNAUTHENTICATED". Tránh dùng song song 2 nơi
          cùng 1 tài khoản khi đang test.
        </v-alert>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel value="api">
      <v-expansion-panel-title>
        <v-icon class="mr-2">mdi-api</v-icon>
        Cách gọi API cho dự án khác
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <p class="mb-3">
          Chỉ 1 API duy nhất, gọi thẳng qua <code>gen.tnsolve.com</code>
          (không cần biết gì về TN_Solve-Server/Mongo/Python phía sau) — có
          hoặc không gửi <code>accountId</code> sẽ quyết định cách hoạt động.
        </p>

        <h4 class="mb-1">Cách 1 — Không cần biết trước tài khoản, tự xoay vòng, KHÔNG nhớ hội thoại</h4>
        <div class="code-block mb-4">
          <v-btn
            size="x-small"
            variant="text"
            icon="mdi-content-copy"
            class="copy-btn"
            @click="onCopy(curlPool)"
          />
          <pre>{{ curlPool }}</pre>
        </div>
        <p class="text-caption text-medium-emphasis mb-4">
          Trả về: <code>{ "text": "...", "accountLabel": "..." }</code>
        </p>

        <h4 class="mb-1">Cách 2 — Ghim đúng 1 tài khoản, CÓ NHỚ hội thoại nhiều lượt</h4>
        <div class="code-block mb-2">
          <v-btn
            size="x-small"
            variant="text"
            icon="mdi-content-copy"
            class="copy-btn"
            @click="onCopy(curlPinned)"
          />
          <pre>{{ curlPinned }}</pre>
        </div>
        <p class="text-caption text-medium-emphasis mb-2">
          Trả về: <code>{ "text": "...", "chatMetadata": [...] }</code> — lưu
          lại <code>chatMetadata</code>, gửi <b>nguyên vẹn</b> vào lượt gọi kế
          tiếp (giữ nguyên <code>accountId</code>) để nối tiếp đúng hội thoại
          đó. Bỏ trống/để <code>null</code> = bắt đầu hội thoại mới.
        </p>
        <p class="text-caption text-medium-emphasis">
          Lấy <code>accountId</code> bằng nút 📋 copy ở mỗi dòng trong trang
          <b>Tài khoản</b>.
        </p>

        <v-divider class="my-4" />

        <h4 class="mb-1">File đính kèm (tuỳ chọn, cả 2 cách trên)</h4>
        <p class="text-caption text-medium-emphasis mb-2">
          Field <code>files</code> — generic, không giới hạn loại (ảnh/video/tài liệu...):
        </p>
        <div class="code-block mb-2">
          <pre>"files": [{ "data": "&lt;base64&gt;", "mimeType": "video/mp4", "filename": "clip.mp4" }]</pre>
        </div>
        <table class="doc-table">
          <tbody>
            <tr><td>1 file tối đa</td><td>80MB</td></tr>
            <tr><td>Tổng file/request</td><td>100MB</td></tr>
            <tr><td>Số file/request</td><td>10</td></tr>
          </tbody>
        </table>
        <p class="text-caption text-medium-emphasis mt-2">
          Vượt quá bị từ chối ngay (413) kèm thông báo rõ ràng, không âm thầm cắt bớt.
        </p>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style scoped>
.doc-steps li {
  margin-bottom: 8px;
}

.doc-steps ul {
  padding-left: 20px;
}

.code-block {
  position: relative;
  background: #1e1e1e;
  border-radius: 8px;
  padding: 12px 44px 12px 14px;
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
  color: #d4d4d4;
  font-family: "Consolas", "Courier New", monospace;
  font-size: 12.5px;
  white-space: pre-wrap;
  word-break: break-word;
}

.copy-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  color: #d4d4d4 !important;
}

.doc-table {
  border-collapse: collapse;
  font-size: 13px;
}

.doc-table td {
  padding: 4px 12px 4px 0;
}

code {
  background: rgba(0, 0, 0, 0.06);
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 0.9em;
}
</style>
