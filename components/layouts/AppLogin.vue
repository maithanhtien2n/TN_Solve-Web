<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const { onGetterDisplayLogin: displayLogin } = useAppStore();

const loading = ref<string>("Đăng nhập với Google");

const onClickLogin = async (type: string = "google") => {
  if (loading.value !== "Đăng nhập với Google") return;

  const isApp = !!(window as any).electronAPI?.isElectron;
  const targetPath = (route.query?.redirect as string) || "/";

  if (isApp) {
    loading.value = "Đang mở trình duyệt...";
    const authUrl = getGoogleAuthUrl(targetPath, true);
    (window as any).electronAPI.openExternal(authUrl);
  } else {
    loading.value = "Đang chuyển hướng...";
    const authUrl = getGoogleAuthUrl(targetPath);
    window.location.href = authUrl;

    setTimeout(() => {
      loading.value = "Đăng nhập với Google";
    }, 3000);
  }
};

watch(
  () => displayLogin.value,
  (newVal: any) => {
    if (newVal) loading.value = "Đăng nhập với Google";
    else {
      router.replace({ query: {} });
    }
  }
);

useHead({
  script: [
    {
      async: true,
      defer: true,
      src: "https://accounts.google.com/gsi/client",
    },
  ],
});
</script>

<template>
  <v-dialog
    v-model="displayLogin"
    scrollable
    max-width="880"
    max-height="90%"
    transition="dialog-bottom-transition"
  >
    <div class="lc">
      <!-- Left panel -->
      <div class="lc-left">
        <div class="lc-left__blob" />
        <div class="lc-left__blob2" />

        <div class="lc-left__top">
          <v-img src="/images/tn-solve-icon.png" lazy-src="/images/tn-solve-icon.png" class="lc-logo" />
        </div>

        <p class="lc-feat-title">Thông tin được lấy từ Google</p>

        <div class="lc-features">
          <div class="lc-feat">
            <span class="lc-feat__check"><svg width="11" height="11" viewBox="0 0 12 12" fill="none"><polyline points="1.5,6 4.5,9 10.5,3" stroke="#1565c0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            <span>Tên & ảnh đại diện từ tài khoản Google</span>
          </div>
          <div class="lc-feat">
            <span class="lc-feat__check"><svg width="11" height="11" viewBox="0 0 12 12" fill="none"><polyline points="1.5,6 4.5,9 10.5,3" stroke="#1565c0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            <span>Địa chỉ email để xác định tài khoản</span>
          </div>
          <div class="lc-feat">
            <span class="lc-feat__check"><svg width="11" height="11" viewBox="0 0 12 12" fill="none"><polyline points="1.5,6 4.5,9 10.5,3" stroke="#1565c0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            <span>Không truy cập email, danh bạ hay dữ liệu khác</span>
          </div>
        </div>

      </div>

      <!-- Right panel -->
      <div class="lc-right">
        <div class="lc-right__orb" />
        <div class="lc-right__orb2" />

        <button class="lc-close" @click="displayLogin = false">
          <v-icon size="20">mdi-close</v-icon>
        </button>

        <div class="lc-form">
          <h2 class="lc-title">CHÀO MỪNG!</h2>
          <p class="lc-sub">Đăng nhập để bắt đầu tạo video AI</p>

          <button
            class="lc-google"
            :class="{ 'lc-google--busy': loading !== 'Đăng nhập với Google' }"
            @click="onClickLogin('google')"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>{{ loading }}</span>
          </button>

          <p class="lc-terms">
            Bằng cách đăng nhập, bạn đồng ý với
            <a href="/dieu-khoan" target="_blank">Điều khoản dịch vụ</a>
          </p>
        </div>
      </div>
    </div>
  </v-dialog>
</template>

<style scoped>
.lc {
  display: flex;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(0,0,0,0.2);
  min-height: 480px;
}

/* ─── BG patterns ──────────────────────────────────────── */
.lc-left::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-repeat: repeat;
  background-size: 100px 100px;
  opacity: 0.07;
}

.lc-right::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-repeat: repeat;
  background-size: 100px 100px;
  opacity: 0.02;
}

.lc-left::before {
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect x='32' y='44' width='36' height='28' rx='4' fill='none' stroke='%231565c0' stroke-width='2'/%3E%3Crect x='38' y='36' width='24' height='12' rx='12' fill='none' stroke='%231565c0' stroke-width='2'/%3E%3Ccircle cx='50' cy='59' r='3' fill='%231565c0'/%3E%3C/svg%3E"),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M50 20 L70 30 L70 50 C70 65 50 75 50 75 C50 75 30 65 30 50 L30 30 Z' fill='none' stroke='%231565c0' stroke-width='2'/%3E%3C/svg%3E");
  background-position: 0 0, 50px 50px;
}

.lc-right::before {
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='38' cy='42' r='10' fill='none' stroke='%231565c0' stroke-width='2'/%3E%3Cpath d='M44 52 L58 66' stroke='%231565c0' stroke-width='2.5' stroke-linecap='round'/%3E%3Crect x='54' y='58' width='8' height='5' rx='1' fill='none' stroke='%231565c0' stroke-width='1.5' transform='rotate(45 58 60)'/%3E%3C/svg%3E"),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect x='32' y='44' width='36' height='28' rx='4' fill='none' stroke='%231565c0' stroke-width='2'/%3E%3Crect x='38' y='36' width='24' height='12' rx='12' fill='none' stroke='%231565c0' stroke-width='2'/%3E%3Ccircle cx='50' cy='59' r='3' fill='%231565c0'/%3E%3C/svg%3E");
  background-position: 0 0, 50px 50px;
}

/* ─── Left ───────────────────────────────────────────────── */
.lc-left {
  flex: 1;
  background: #f8faff;
  padding: 40px 36px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
  border-right: 1px solid #e8eef6;
}

.lc-left__blob {
  position: absolute;
  width: 220px; height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(21,101,192,0.08) 0%, transparent 70%);
  top: -60px; right: -60px;
  pointer-events: none;
}

.lc-left__blob2 {
  position: absolute;
  width: 160px; height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(66,165,245,0.07) 0%, transparent 70%);
  bottom: -40px; left: -40px;
  pointer-events: none;
}

.lc-left__top {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.lc-logo {
  width: 140px;
  filter: drop-shadow(0 4px 12px rgba(21,101,192,0.2));
}

/* ─── Features ──────────────────────────────────────────── */
.lc-feat-title {
  font-size: 0.72rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0;
}

.lc-features {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.lc-feat {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.82rem;
  color: #334155;
  font-weight: 500;
}

.lc-feat__check {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(21,101,192,0.12);
  border: 1.5px solid rgba(21,101,192,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ─── Right ─────────────────────────────────────────────── */
.lc-right {
  flex: 1;
  background: linear-gradient(135deg, #fcc8d6, #b2ebf2);
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.lc-right__orb {
  position: absolute;
  width: 280px; height: 280px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(66,165,245,0.25) 0%, transparent 70%);
  top: -80px; right: -80px;
  pointer-events: none;
}

.lc-right__orb2 {
  position: absolute;
  width: 180px; height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99,179,237,0.15) 0%, transparent 70%);
  bottom: -40px; left: -40px;
  pointer-events: none;
}

.lc-close {
  position: absolute;
  top: 16px; right: 16px;
  width: 36px; height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(0,0,0,0.08);
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
  z-index: 1;
}

.lc-close:hover { background: rgba(0,0,0,0.14); }

.lc-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0;
  position: relative;
  z-index: 1;
}

.lc-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 4px;
  letter-spacing: -0.4px;
}

.lc-sub {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0 0 24px;
  line-height: 1.5;
}

/* ─── Google btn ─────────────────────────────────────────── */
.lc-google {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 14px 20px;
  border-radius: 14px;
  border: 1.5px solid rgba(0,0,0,0.1);
  background: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  transition: border-color 0.18s, box-shadow 0.18s;
}

.lc-google:hover {
  border-color: #93c5fd;
  box-shadow: 0 4px 16px rgba(30,136,229,0.15);
}

.lc-google--busy { opacity: 0.65; cursor: not-allowed; }

/* ─── Terms ──────────────────────────────────────────────── */
.lc-terms {
  font-size: 0.78rem;
  color: #94a3b8;
  margin: 20px 0 0;
  text-align: center;
}

.lc-terms a { color: #1e88e5; text-decoration: none; }
.lc-terms a:hover { text-decoration: underline; }

/* ─── Mobile ─────────────────────────────────────────────── */
@media (max-width: 600px) {
  .lc-left { display: none; }
  .lc-right { padding: 40px 28px; border-radius: 24px; }
}
</style>
