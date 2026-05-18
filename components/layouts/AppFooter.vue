<script setup lang="ts">
const router = useRouter();

const currentYear = new Date().getFullYear();
const version = ref<string | null>(null);

const onClickNavigate = (value: string) => {
  if (!value) {
    useAppStore().onActionSetSystemPopup({ type: "info", content: "Tính năng đang được phát triển!" });
    return;
  } else if (value === "tutorial") {
    window.open("https://youtu.be/dCb8hL7wLAM", "_blank");
  } else if (value === "tnsolve-teacher") {
    window.open("https://teacher.tnsolve.com", "_blank");
  } else if (value === "download-tool") {
    window.open("https://github.com/maithanhtien2n/tnsolve_release/releases", "_blank");
  } else if (value === "contact") {
    window.open("https://zalo.me/0343027232", "_blank");
  } else if (value === "zalo-group") {
    window.open("https://zalo.me/g/p8hls5tonlfkqmyfndmx", "_blank");
  } else if (value === "facebook-group") {
    window.open("https://www.facebook.com/groups/1175744533986396", "_blank");
  } else {
    router.push(`/${value}`);
  }
};

onMounted(async () => {
  try {
    const ver = await (window as any).electronAPI?.getAppVersion();
    version.value = ver;
  } catch {}
});
</script>

<template>
  <footer class="app-footer">
    <v-container max-width="1400">
      <div class="footer-grid">

        <!-- Brand -->
        <div class="footer-brand">
          <v-img
            src="/images/tn-solve-icon.png"
            lazy-src="/images/tn-solve-logo.png"
            width="120"
            height="44"
            class="mb-4"
          />
          <p class="brand-tagline">
            Nền tảng AI giúp bạn tạo video chuyên nghiệp chỉ trong vài phút.
          </p>
          <!-- Social icons -->
          <div class="social-row">
            <a href="https://www.tiktok.com/@tnsolve" target="_blank" class="social-icon">
              <img src="/images/icon-tiktok.png" style="width:18px;height:18px;object-fit:contain" />
            </a>
            <a href="https://www.facebook.com/tnsolve2025" target="_blank" class="social-icon">
              <img src="/images/icon-facebook.png" style="width:18px;height:18px;object-fit:contain" />
            </a>
            <a href="https://www.youtube.com/@tiencodeweb" target="_blank" class="social-icon">
              <img src="/images/icon-youtube.png" style="width:18px;height:18px;object-fit:contain" />
            </a>
          </div>
        </div>

        <!-- Links: Bắt đầu -->
        <div class="footer-col">
          <div class="col-title">Bắt đầu sử dụng</div>
          <div class="col-links">
            <a class="col-link" @click="onClickNavigate('tutorial')">Hướng dẫn sử dụng</a>
            <a class="col-link" @click="onClickNavigate('payment')">Đăng ký / Gia hạn</a>
            <a class="col-link" @click="onClickNavigate('terms')">Điều khoản & Thanh toán</a>
          </div>
        </div>

        <!-- Links: Trợ giúp -->
        <div class="footer-col">
          <div class="col-title">Trợ giúp</div>
          <div class="col-links">
            <a class="col-link" @click="onClickNavigate('documents')">Trợ lý viết câu lệnh</a>
            <a class="col-link" @click="onClickNavigate('zalo-group')">Nhóm hỗ trợ Zalo</a>
            <a class="col-link" @click="onClickNavigate('facebook-group')">Nhóm Facebook</a>
          </div>
        </div>

      </div>

      <!-- Bottom -->
      <div class="footer-bottom">
        <span v-if="version" class="footer-version">v{{ version }}</span>
        <span class="footer-copy-main">© {{ currentYear }} <strong>TN Solve</strong></span>
        <span class="footer-sep">·</span>
        <span class="footer-copy-sub">Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ.</span>
      </div>
    </v-container>
  </footer>
</template>

<style scoped>
/* ─── Shell ──────────────────────────────────────────── */
.app-footer {
  background: #fff;
  border-top: 1px solid #e2e8f0;
  margin-top: 3rem;
  padding-top: 3rem;
}

/* ─── Grid ───────────────────────────────────────────── */
.footer-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr;
  gap: 48px;
  padding-bottom: 3rem;
  border-bottom: 1px solid #f0f0f0;
}

@media (max-width: 768px) {
  .footer-grid { grid-template-columns: 1fr 1fr; gap: 24px; padding-bottom: 1.5rem; }
  .footer-brand { grid-column: 1 / -1; }
  .app-footer { padding-top: 1.5rem; }
  .footer-bottom { padding: 14px 0; }
}

@media (max-width: 480px) {
  .footer-grid { grid-template-columns: 1fr; }
}

/* ─── Brand ──────────────────────────────────────────── */
.brand-tagline {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 20px;
  max-width: 280px;
}

/* ─── Social ─────────────────────────────────────────── */
.social-row {
  display: flex;
  gap: 10px;
}

.social-icon {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: #fff;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.18s, border-color 0.18s, box-shadow 0.18s;
  cursor: pointer;
}

.social-icon:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

/* ─── Columns ────────────────────────────────────────── */
.col-title {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #374151;
  margin-bottom: 16px;
}

.col-links {
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.col-link {
  font-size: 0.875rem;
  color: #475569;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.18s;
  line-height: 1.4;
}

.col-link:hover {
  color: #1e88e5;
}

/* ─── Bottom ─────────────────────────────────────────── */
.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px 0;
  font-size: 0.9rem;
  color: #475569;
  flex-wrap: wrap;
  text-align: center;
}

.footer-version {
  background: #fff;
  border: 1px solid #e2e8f0;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  color: #64748b;
}

.footer-copy-main strong { color: #475569; }
.footer-copy-main, .footer-copy-sub, .footer-sep { color: #475569; font-size: 0.9rem; }

@media (max-width: 768px) {
  .footer-bottom { flex-direction: column; gap: 4px; }
  .footer-sep { display: none; }
}
</style>
