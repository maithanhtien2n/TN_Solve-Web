<script setup lang="ts">
import { accountService } from "~/services/account";
import { appService } from "~/services/app";

const { onGetterUserData: userData, onActionGetUserData } = useAppStore();

useSeo({ title: "Cài đặt", description: "Cài đặt tài khoản TN Solve" });
useHead({ meta: [{ name: "robots", content: "noindex, nofollow" }] });

const apiKey = ref("");
const apiKeyLoading = ref(false);
const apiKeyCopied = ref(false);
const confirmRegenerate = ref(false);

const displayApiKey = computed(() => apiKey.value || userData.value?.apiKey || "");
const maskedApiKey = computed(() => {
  const key = displayApiKey.value;
  if (!key) return "";
  return "•".repeat(20) + key.slice(-8);
});
const usePersonalResource = ref(false);

watch(() => userData.value?.settings?.usePersonalResource, (val) => {
  if (val !== undefined) usePersonalResource.value = Boolean(val);
}, { immediate: true });

const onGetPersonalToken = async () => {
  apiKeyLoading.value = true;
  await accountService.getPersonalToken()
    .then((res) => { apiKey.value = res?.data?.token || ""; confirmRegenerate.value = false; })
    .finally(() => { apiKeyLoading.value = false; });
};

const onCopyApiKey = () => {
  if (!displayApiKey.value) return;
  navigator.clipboard.writeText(displayApiKey.value);
  apiKeyCopied.value = true;
  setTimeout(() => (apiKeyCopied.value = false), 2000);
};

const onTogglePersonalResource = async (val: boolean) => {
  await appService.saveSetting({ usePersonalResource: val });
  await onActionGetUserData();
};

const hasExtensionFile = ref(false);
const extensionUpdatedAt = ref<string | null>(null);
const extensionUrlCopied = ref(false);

const onCopyExtensionUrl = () => {
  navigator.clipboard.writeText("chrome://extensions");
  extensionUrlCopied.value = true;
  setTimeout(() => (extensionUrlCopied.value = false), 2000);
};

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 10) return "Vừa xong";
  if (diff < 60) return `${diff} giây trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 7 * 86400) return `${Math.floor(diff / 86400)} ngày trước`;
  if (diff < 30 * 86400) return `${Math.floor(diff / (7 * 86400))} tuần trước`;
  if (diff < 365 * 86400) return `${Math.floor(diff / (30 * 86400))} tháng trước`;
  return `${Math.floor(diff / (365 * 86400))} năm trước`;
}

onMounted(async () => {
  const base = import.meta.env.VITE_API_URL;
  const res = await fetch(`${base}/api/common/setting-file-info?title=${encodeURIComponent("File build Extensions TN Solve")}`);
  const json = await res.json();
  hasExtensionFile.value = json?.data?.hasFile ?? false;
  extensionUpdatedAt.value = json?.data?.updatedAt ?? null;
});

const onDownloadExtension = () => {
  const base = import.meta.env.VITE_API_URL;
  const url = `${base}/api/common/setting-file-download?title=${encodeURIComponent("File build Extensions TN Solve")}`;
  window.open(url, "_blank");
};

definePageMeta({ middleware: "auth" });
</script>

<template>
  <div v-if="!userData?.email" class="d-flex justify-center flex-column align-center ga-3 pt-10 pb-16">
    <v-progress-circular width="2" size="40" color="primary" indeterminate />
    Đang tải dữ liệu...
  </div>

  <div v-else class="sw">
    <div class="sw-card">

      <!-- Extension download row -->
      <template v-if="hasExtensionFile">
        <div class="sw-row sw-row--desktop-only">
          <div class="sw-row-left">
            <div class="sw-row-icon" style="background: linear-gradient(135deg, #5b21b6, #8b5cf6);">
              <v-icon color="white" size="15">mdi-puzzle-outline</v-icon>
            </div>
            <div>
              <div class="sw-row-label">Extensions TN Solve</div>
              <div v-if="extensionUpdatedAt" class="sw-row-sub" style="display: flex; align-items: center; gap: 3px; line-height: 1;">
                <v-icon size="11" style="margin-top: 1px;">mdi-clock-outline</v-icon>
                <span>{{ timeAgo(extensionUpdatedAt) }}</span>
              </div>
            </div>
          </div>
          <button class="sw-btn-primary" style="background: #7c3aed;" @click="onDownloadExtension">
            <v-icon size="14">mdi-download</v-icon>
            Tải xuống
          </button>
        </div>
        <div class="sw-chrome-row sw-row--desktop-only">
          <div class="sw-chrome-url" style="line-height: 1;" @click="onCopyExtensionUrl" :title="extensionUrlCopied ? 'Đã sao chép!' : 'Nhấn để sao chép'">
            <v-icon size="13" style="color: #7c3aed; line-height: 1; vertical-align: middle;">mdi-google-chrome</v-icon>
            <span style="line-height: 1; vertical-align: middle;">chrome://extensions</span>
            <v-icon size="13" style="line-height: 1; vertical-align: middle;" :color="extensionUrlCopied ? '#059669' : '#94a3b8'">{{ extensionUrlCopied ? 'mdi-check' : 'mdi-content-copy' }}</v-icon>
          </div>
        </div>
        <div class="sw-sep sw-row--desktop-only" />
      </template>

      <!-- TN Solve Gen row -->
      <div class="sw-row sw-row--desktop-only">
        <div class="sw-row-left">
          <div class="sw-row-icon" style="background: linear-gradient(135deg, #5b21b6, #8b5cf6);">
            <v-icon color="white" size="15">mdi-open-in-new</v-icon>
          </div>
          <div class="sw-row-label">TN Solve Gen</div>
        </div>
        <a href="https://gen.tnsolve.com" target="_blank" class="sw-btn-primary" style="background: #7c3aed; text-decoration: none;">
          <v-icon size="14">mdi-open-in-new</v-icon>
          Mở
        </a>
      </div>
      <div class="sw-sep sw-row--desktop-only" />

      <!-- Toggle row -->
      <div class="sw-row">
        <div class="sw-row-left">
          <div class="sw-row-icon">
            <v-icon color="white" size="15">mdi-lightning-bolt-outline</v-icon>
          </div>
          <div class="sw-row-label">Sử dụng tài nguyên cá nhân</div>
        </div>
        <v-checkbox
          v-model="usePersonalResource"
          color="#1e88e5"
          density="compact"
          hide-details
          @update:model-value="(v) => onTogglePersonalResource(Boolean(v))"
        />
      </div>

      <div class="sw-sep" />

      <!-- API Key row -->
      <div class="sw-row sw-row--apikey">
        <div class="sw-row-left">
          <div class="sw-row-icon">
            <v-icon color="white" size="15">mdi-key-outline</v-icon>
          </div>
          <div class="sw-row-label">API Key</div>
        </div>

        <div v-if="displayApiKey" class="sw-apikey-wrap">
          <div class="sw-apikey">
            <v-icon size="14" color="#94a3b8">mdi-key-variant</v-icon>
            <code class="sw-apikey-val">{{ maskedApiKey }}</code>
          </div>
          <button class="sw-apikey-btn" :class="{ 'sw-apikey-btn--ok': apiKeyCopied }" title="Sao chép" @click="onCopyApiKey">
            <v-icon size="15">{{ apiKeyCopied ? "mdi-check" : "mdi-content-copy" }}</v-icon>
          </button>
          <button class="sw-apikey-btn" title="Tạo mới API Key" :disabled="apiKeyLoading" @click="confirmRegenerate = true">
            <v-progress-circular v-if="apiKeyLoading" width="2" size="13" color="#64748b" indeterminate />
            <v-icon v-else size="15">mdi-refresh</v-icon>
          </button>
        </div>

        <button v-if="!displayApiKey" class="sw-btn-primary" :disabled="apiKeyLoading" @click="onGetPersonalToken()">
          <v-progress-circular v-if="apiKeyLoading" width="2" size="12" color="white" indeterminate />
          <template v-else>
            <v-icon size="14">mdi-plus</v-icon>
            Tạo API Key
          </template>
        </button>
      </div>

      <div class="sw-sep" />

      <!-- YouTube tutorial -->
      <div class="sw-youtube">
        <iframe
          src="https://www.youtube.com/embed/EUTa7K9PMuU"
          title="Hướng dẫn sử dụng TN Solve"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />
      </div>

    </div>
  </div>

  <!-- Confirm dialog -->
  <v-dialog v-model="confirmRegenerate" max-width="400">
    <v-card rounded="xl" elevation="0" border>
      <div class="sw-dialog-head">
        <div class="sw-dialog-icon"><v-icon color="white" size="15">mdi-alert-outline</v-icon></div>
        <div>
          <div class="sw-dialog-title">Tạo mới API Key?</div>
          <div class="sw-dialog-sub">Hành động này không thể hoàn tác</div>
        </div>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" size="small" density="compact" @click="confirmRegenerate = false" />
      </div>
      <div class="sw-dialog-body">
        Key cũ sẽ bị <strong style="color:#dc2626">vô hiệu hóa ngay lập tức</strong>. Mọi ứng dụng đang dùng key cũ sẽ ngừng hoạt động.
      </div>
      <div class="sw-dialog-foot">
        <button class="sw-btn-ghost" @click="confirmRegenerate = false">Hủy</button>
        <button class="sw-btn-primary" :disabled="apiKeyLoading" @click="onGetPersonalToken">
          <v-progress-circular v-if="apiKeyLoading" width="2" size="12" color="white" indeterminate />
          <template v-else><v-icon size="14">mdi-refresh</v-icon> Xác nhận</template>
        </button>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.sw { padding-bottom: 24px; }

/* ── Card ────────────────────────────────────────────── */
.sw-card {
  background: #fff;
  border-radius: 14px;
  border: 1px solid #eef0f3;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  overflow: hidden;
}

.sw-sep { height: 1px; background: #f3f4f6; }

/* ── Row ─────────────────────────────────────────────── */
.sw-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 16px 20px;
}

.sw-row--col {
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.sw-row-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sw-row-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: linear-gradient(135deg, #1565c0, #42a5f5);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(30,136,229,0.28);
}

.sw-row-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
}

.sw-row-sub {
  font-size: 0.775rem;
  color: #94a3b8;
  margin-top: 1px;
}

@media (max-width: 768px) {
  .sw-row--desktop-only { display: none; }
}

/* ── Chrome URL chip ─────────────────────────────────── */
.sw-chrome-row {
  padding: 0 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sw-chrome-url {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #ede9fe;
  background: #f5f3ff;
  color: #6d28d9;
  font-size: 0.775rem;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-weight: 500;
  cursor: pointer;
  transition: all .13s;
  white-space: nowrap;
}

.sw-chrome-url:hover { background: #ede9fe; border-color: #c4b5fd; }

/* ── API Key ─────────────────────────────────────────── */
.sw-apikey-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.sw-apikey {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
  background: #f8fafc;
  border: 1px solid #e8ecf0;
  border-radius: 9px;
  padding: 7px 7px 7px 12px;
}

.sw-apikey-val {
  flex: 1;
  font-size: 0.78rem;
  font-family: 'Fira Code', 'Courier New', monospace;
  color: #334155;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
}

@media (max-width: 480px) {
  .sw-row--apikey {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .sw-apikey-wrap {
    width: 100%;
  }
}

.sw-apikey-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #64748b;
  cursor: pointer;
  flex-shrink: 0;
  transition: all .13s;
}

.sw-apikey-btn:hover { background: #f1f5f9; color: #1e88e5; border-color: #bfdbfe; }
.sw-apikey-btn--ok { background: #ecfdf5 !important; color: #059669 !important; border-color: #a7f3d0 !important; }

/* ── Buttons ─────────────────────────────────────────── */
.sw-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  background: #1e88e5;
  color: #fff;
  font-size: 0.835rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background .13s, transform .1s;
}

.sw-btn-primary:hover:not(:disabled) { background: #1565c0; transform: translateY(-1px); }
.sw-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.sw-btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  background: transparent;
  color: #64748b;
  font-size: 0.835rem;
  font-weight: 600;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: background .13s;
}

.sw-btn-ghost:hover { background: #f1f5f9; }

/* ── YouTube ─────────────────────────────────────────── */
.sw-youtube {
  padding: 16px 20px;
}

.sw-youtube iframe {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 10px;
  display: block;
}

/* ── Dialog ──────────────────────────────────────────── */
.sw-dialog-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 20px 14px;
  border-bottom: 1px solid #f3f4f6;
}

.sw-dialog-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #b45309, #fbbf24);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sw-dialog-title { font-size: 0.9rem; font-weight: 700; color: #0f172a; }
.sw-dialog-sub   { font-size: 0.735rem; color: #94a3b8; margin-top: 1px; }

.sw-dialog-body {
  padding: 16px 20px;
  font-size: 0.855rem;
  color: #475569;
  line-height: 1.7;
}

.sw-dialog-foot {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 0 20px 18px;
}
</style>
