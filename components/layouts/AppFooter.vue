<script setup lang="ts">
const router = useRouter();
const localePath = useLocalePath();

const currentYear = new Date().getFullYear();

const version = ref<string | null>(null);

const onClickNavigate = (value: string) => {
  if (!value) {
    useAppStore().onActionSetSystemPopup({
      type: "info",
      content: "Tính năng đang được phát triển!",
    });
    return;
  } else if (value === "tnsolve-teacher") {
    window.open("https://teacher.tnsolve.com", "_blank");
  } else if (value === "download-tool") {
    window.open(
      "https://github.com/maithanhtien2n/tnsolve_release/releases",
      "_blank"
    );
  } else {
    if (value === "contact") {
      window.open("https://zalo.me/0343027232", "_blank");
    } else if (value === "zalo-group") {
      window.open("https://zalo.me/g/tuhmrl934", "_blank");
    } else {
      router.push(localePath(`/${value}`));
    }
  }
};

onMounted(async () => {
  try {
    const ver = await (window as any).electronAPI?.getAppVersion();
    version.value = ver;
  } catch (error) {
    console.error("Lỗi lấy version:", error);
  }
});
</script>

<template>
  <footer style="background-color: #ddd; padding-top: 2.4rem; margin-top: 3rem">
    <v-container max-width="1400">
      <v-row>
        <v-col cols="12" lg="6">
          <div>
            <v-img
              src="/images/tn-solve-icon.png"
              lazy-src="/images/tn-solve-logo.png"
              :class="`w-10rem  b-radius-1`"
            />
          </div>

          <p class="tagline mt-2">
            {{
              $t(
                "Nền tảng AI giúp bạn tạo video chuyên nghiệp chỉ trong vài phút"
              )
            }}
          </p>

          <span v-if="version">{{ $t("Phiên bản") }} {{ version }}</span>
        </v-col>

        <v-col cols="12" lg="6">
          <v-row>
            <v-col cols="6" lg="4">
              <div class="footer-section footer-links">
                <h4>Sản phẩm</h4>
                <nav>
                  <a
                    v-for="(item, index) in [
                      { title: 'Tính năng', value: 'features' },
                      { title: 'Hướng dẫn', value: 'tutorial' },
                      { title: 'Đăng ký dịch vụ', value: 'payment' },
                      { title: 'TN Solve Teacher', value: 'tnsolve-teacher' },
                    ]"
                    :key="index"
                    class="cursor-pointer"
                    @click="onClickNavigate(item.value)"
                  >
                    {{ item.title }}
                  </a>
                </nav>
              </div>
            </v-col>

            <v-col cols="6" lg="4">
              <div class="footer-section footer-links">
                <h4>Tài nguyên</h4>
                <nav>
                  <a
                    v-for="(item, index) in [
                      { title: 'Liên hệ Zalo', value: 'contact' },
                      { title: 'Tham gia nhóm Zalo', value: 'zalo-group' },
                      { title: 'Chính sách', value: 'terms' },
                      { title: 'Tải công cụ về máy', value: 'download-tool' },
                    ]"
                    :key="index"
                    class="cursor-pointer"
                    @click="onClickNavigate(item.value)"
                  >
                    {{ item.title }}
                  </a>
                </nav>
              </div>
            </v-col>

            <v-col cols="6" lg="4">
              <div class="footer-section footer-links">
                <h4>Kết nối</h4>

                <nav>
                  <a
                    target="_blank"
                    href="https://www.tiktok.com/@tiencodeweb"
                    class="d-flex align-center ga-2"
                  >
                    <img src="/images/icon-tiktok.png" style="width: 1.3rem" />
                    <span style="margin-bottom: 2.6px">@tiencodeweb</span>
                  </a>

                  <a
                    target="_blank"
                    href="https://www.youtube.com/@tiencodeweb"
                    class="d-flex align-center ga-2"
                  >
                    <img src="/images/icon-youtube.png" style="width: 1.3rem" />
                    <span style="margin-bottom: 2.6px">@tiencodeweb</span>
                  </a>
                </nav>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <div class="footer-bottom">
        <span>
          &copy; {{ currentYear }} TN Solve. Cảm ơn bạn đã tin tưởng và sử dụng
          dịch vụ của chúng tôi.
        </span>
      </div>
    </v-container>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: #f1f1f1;
  color: #374151;
  padding: 1.3rem 1rem;
  width: 100%;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
}

.footer-brand .logo {
  margin-bottom: 1rem;
}

.footer-links h4 {
  color: #1f2937;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.footer-links nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-links a {
  color: #374151;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: #0984e3;
}

.footer-bottom {
  max-width: 1400px;
  margin: 0 auto;
  padding-top: 1.3rem;
  padding-bottom: 1.3rem;
  margin-top: 2rem;
  text-align: center;
  font-size: 0.85rem;
  color: #6b7280;
  border-top: 1px solid #e5e7eb;
}
</style>
