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
  } else if (value === "tutorial") {
    window.open("https://youtu.be/dCb8hL7wLAM", "_blank");
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
        </v-col>

        <v-col cols="12" lg="6">
          <v-row>
            <v-col cols="6" lg="4" md="4" sm="4">
              <div class="footer-section footer-links">
                <h4>{{ $t("Bắt đầu sử dụng") }}</h4>
                <nav>
                  <a
                    v-for="(item, index) in [
                      { title: 'Tài liệu', value: 'documents' },
                      { title: 'Hướng dẫn', value: 'tutorial' },
                      { title: 'Công cụ đa năng', value: 'tnsolve-teacher' },
                      { title: 'Đăng ký/gia hạn dịch vụ', value: 'payment' },
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

            <v-col cols="6" lg="4" md="4" sm="4">
              <div class="footer-section footer-links">
                <h4>{{ $t("Trợ giúp") }}</h4>
                <nav>
                  <a
                    v-for="(item, index) in [
                      { title: 'Chính sách', value: 'terms' },
                      ...(version
                        ? []
                        : [
                            {
                              title: 'Tải công cụ về máy',
                              value: 'download-tool',
                            },
                          ]),
                      { title: 'Liên hệ admin (zalo)', value: 'contact' },
                      { title: 'Tham gia nhóm (zalo)', value: 'zalo-group' },
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

            <v-col cols="12" lg="4" md="4" sm="4">
              <div class="footer-section footer-links">
                <h4>{{ $t("Theo dõi chúng tôi") }}</h4>

                <nav>
                  <a
                    target="_blank"
                    href="https://www.tiktok.com/@tnsolve"
                    class="d-flex align-center ga-2"
                  >
                    <img src="/images/icon-tiktok.png" style="width: 1.3rem" />
                    <span style="margin-bottom: 2.6px">@tnsolve</span>
                  </a>

                  <a
                    target="_blank"
                    href="https://www.youtube.com/@tiencodeweb"
                    class="d-flex align-center ga-2"
                  >
                    <img src="/images/icon-youtube.png" style="width: 1.3rem" />
                    <span style="margin-bottom: 2.6px">@tiencodeweb</span>
                  </a>

                  <a
                    class="cursor-pointer d-flex align-center ga-2"
                    @click="router.push(localePath('/video/public'))"
                  >
                    <img src="/images/icon-video.png" style="width: 1.2rem" />
                    <span style="margin-bottom: 1px">
                      Thước phim công khai
                    </span>
                  </a>
                </nav>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <div class="footer-bottom">
        <div v-if="version" class="font-bold text-black">
          {{ $t("Phiên bản") }} {{ version }}
        </div>
        <span>
          &copy; <span class="font-bold">{{ currentYear }} TN Solve</span>. Cảm
          ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi.
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
  color: #323336;
  border-top: 1px solid #e5e7eb;
}
</style>
