<script setup lang="ts">
const router = useRouter();

const currentYear = new Date().getFullYear();
const version = ref<string | null>(null);

const onClickNavigate = (value: string) => {
  if (!value) {
    useAppStore().onActionSetSystemPopup({
      type: "info",
      content: "Tính năng đang được phát triển!",
    });
    return;
  } else if (value === "tutorial") {
    window.open("https://youtu.be/dCb8hL7wLAM", "_blank");
  } else if (value === "tnsolve-teacher") {
    window.open("https://teacher.tnsolve.com", "_blank");
  } else if (value === "contact") {
    window.open("https://zalo.me/0343027232", "_blank");
  } else if (value === "zalo-group") {
    window.open("https://zalo.me/g/p8hls5tonlfkqmyfndmx", "_blank");
  } else if (value === "facebook-group") {
    window.open("https://www.facebook.com/groups/1175744533986396", "_blank");
  } else if (value === "download-tool") {
    window.open(
      "https://github.com/maithanhtien2n/tnsolve_release/releases",
      "_blank",
    );
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
    <v-container max-width="1200">
      <!-- Brand header — centered -->
      <div class="footer-brand">
        <v-img
          src="/images/tn-solve-icon.png"
          lazy-src="/images/tn-solve-logo.png"
          width="170"
          height="74"
          class="mb-3"
        />
        <p class="brand-tagline">
          Nền tảng AI giúp bạn tạo video chuyên nghiệp chỉ trong vài phút.
        </p>
        <div class="social-row">
          <a
            href="https://www.tiktok.com/@tnsolve"
            target="_blank"
            class="social-icon"
          >
            <img
              src="/images/icon-tiktok.png"
              style="width: 16px; height: 16px; object-fit: contain"
            />
          </a>
          <a
            href="https://www.facebook.com/tnsolve2025"
            target="_blank"
            class="social-icon"
          >
            <img
              src="/images/icon-facebook.png"
              style="width: 16px; height: 16px; object-fit: contain"
            />
          </a>
          <a
            href="https://www.youtube.com/@tiencodeweb"
            target="_blank"
            class="social-icon"
          >
            <img
              src="/images/icon-youtube.png"
              style="width: 16px; height: 16px; object-fit: contain"
            />
          </a>
        </div>
      </div>

      <!-- 4-column grid -->
      <div class="footer-grid">
        <!-- Thông tin doanh nghiệp -->
        <div class="footer-col">
          <div class="col-title">HỘ KINH DOANH TN SOLVE</div>
          <div class="col-links">
            <p class="biz-line">GPKD số 054200002629</p>
            <p class="biz-line">Đăng ký ngày 26/04/2026</p>
            <p class="biz-line">113 Đường Võ Văn Tần, P. Bình Kiến, Đắk Lắk</p>
            <a class="biz-line">0343 027 232</a>
            <a class="biz-line">maithanhtien0612@gmail.com</a>
          </div>
        </div>

        <!-- Chính sách -->
        <div class="footer-col">
          <div class="col-title">CHÍNH SÁCH</div>
          <div class="col-links">
            <a class="col-link" @click="onClickNavigate('dieu-khoan')"
              >Điều khoản & quy định chung</a
            >
            <a class="col-link" @click="onClickNavigate('chinh-sach-bao-mat')"
              >Chính sách bảo mật</a
            >
            <a class="col-link" @click="onClickNavigate('hinh-thuc-thanh-toan')"
              >Hình thức thanh toán</a
            >
            <a class="col-link" @click="onClickNavigate('chinh-sach-giao-nhan')"
              >Chính sách giao nhận</a
            >
            <a class="col-link" @click="onClickNavigate('chinh-sach-bao-hanh')"
              >Chính sách bảo hành & đổi trả</a
            >
          </div>
        </div>

        <!-- Hỗ trợ -->
        <div class="footer-col">
          <div class="col-title">HỖ TRỢ</div>
          <div class="col-links">
            <a class="col-link" @click="onClickNavigate('tutorial')"
              >Video hướng dẫn</a
            >
            <a class="col-link" @click="onClickNavigate('')"
              >Câu hỏi thường gặp</a
            >
            <a class="col-link" @click="onClickNavigate('contact')"
              >Liên hệ Zalo</a
            >
            <a class="col-link" @click="onClickNavigate('zalo-group')"
              >Nhóm hỗ trợ Zalo</a
            >
            <a class="col-link" @click="onClickNavigate('facebook-group')"
              >Nhóm Facebook</a
            >
          </div>
        </div>
      </div>

      <!-- Bottom -->
      <div class="footer-bottom">
        <span class="footer-copy"
          >© {{ currentYear }} <strong>TN Solve</strong> — Tất cả quyền được bảo
          lưu.</span
        >
        <span v-if="version" class="footer-version">v{{ version }}</span>
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
  padding-top: 1rem;
}

/* ─── Brand header ───────────────────────────────────── */
.footer-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 0 2.5rem;
  margin-bottom: 2.5rem;
  position: relative;
}

.footer-brand::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #1565c0, #1e88e5);
  border-radius: 2px;
}

.brand-tagline {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
  text-align: center;
}

.social-row {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.social-icon {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.15s,
    border-color 0.15s,
    box-shadow 0.15s;
  cursor: pointer;
  text-decoration: none;
}

.social-icon:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
  box-shadow: 0 2px 8px rgba(21, 101, 192, 0.1);
}

/* ─── Grid ───────────────────────────────────────────── */
.footer-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 36px;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e9eef5;
}

@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 28px;
  }
}

@media (max-width: 900px) {
  .app-footer {
    padding-top: 0.8rem;
  }
  .footer-brand {
    padding-bottom: 1.5rem;
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 480px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

/* ─── Columns ────────────────────────────────────────── */
.col-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 14px;
}

.col-links {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.col-link {
  font-size: 0.855rem;
  color: #334155;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.15s;
  line-height: 1.4;
}

.col-link:hover {
  color: #1e88e5;
}

.col-link--social {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ─── Biz lines ──────────────────────────────────────── */
.biz-line {
  font-size: 0.82rem;
  color: #475569;
  margin: 0;
  line-height: 1.55;
}

.biz-line strong {
  color: #1e293b;
}

/* ─── Bottom ─────────────────────────────────────────── */
.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 0;
  flex-wrap: wrap;
}

.footer-copy {
  font-size: 0.8rem;
  color: #64748b;
}

.footer-copy strong {
  color: #334155;
}

.footer-version {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #64748b;
}

@media (max-width: 768px) {
  .footer-bottom {
    justify-content: center;
    flex-direction: column;
    gap: 6px;
    text-align: center;
  }
}
</style>
