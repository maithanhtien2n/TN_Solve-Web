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
    // Mở bằng trình duyệt mặc định của hệ thống (Chrome/Edge/Safari)
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
    max-width="500"
    max-height="90%"
    transition="dialog-bottom-transition"
  >
    <v-card
      rounded="xl"
      style="
        background: linear-gradient(135deg, #ffe5ec, #e0f7fa);
        padding-bottom: 10rem;
      "
    >
      <v-card-title class="d-flex justify-space-between align-center pb-0">
        <v-btn
          icon="mdi-close"
          variant="tonal"
          class="opacity-0"
          style="cursor: default"
        />
        <v-btn
          icon="mdi-close"
          variant="text"
          size="44"
          @click="displayLogin = false"
        />
      </v-card-title>

      <v-card-text>
        <div class="d-flex flex-column ga-10 w-100">
          <div class="d-flex flex-column align-center ga-3">
            <v-img
              class="w-10rem"
              src="/images/tn-solve-icon.png"
              lazy-src="/images/tn-solve-icon.png"
            />
            <h2 class="font-bold text-center">
              {{ $t("Đăng nhập") }}
            </h2>
          </div>

          <div
            class="ripple-effect py-3 ga-2"
            :class="{ disabled: Boolean(loading !== 'Đăng nhập với Google') }"
            @click="onClickLogin('google')"
          >
            <v-icon size="23">mdi-google</v-icon>
            <h3>
              {{ $t(loading) }}
            </h3>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.ripple-effect {
  width: 100%;
  margin: auto;
  display: flex;
  cursor: pointer;
  overflow: hidden;
  max-width: 20rem;
  font-size: 1.05rem;
  position: relative;
  align-items: center;
  border-radius: 10rem;
  justify-content: center;
  background-color: white;
}

.ripple-effect::after {
  top: 50%;
  left: 50%;
  content: "";
  width: 200%;
  height: 200%;
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  pointer-events: none;
  animation: ripple 0.6s linear;
  background: rgba(0, 0, 0, 0.1);
  transform: translate(-50%, -50%) scale(0);
}

.ripple-effect:active::after {
  transform: translate(-50%, -50%) scale(1);
}
</style>
