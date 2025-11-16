<script setup lang="ts">
import { authService } from "~/services/app";

const route = useRoute();

const { onGetterDisplayLogin: displayLogin } = useAppStore();

const loading = ref<string>("Đăng nhập với Google");

const onClickLogin = async (type: string = "google") => {
  if (loading.value === "Đang đăng nhập...") return;

  try {
    const token = await loginGoogle();

    loading.value = "Đang đăng nhập...";
    let payload: any = { type, credential: token };

    if (referralId.value) payload.ref = referralId.value;
    if (!payload.ref && route.query?.code) payload.code = route.query.code;

    await authService.login(payload).then(() => {
      const redirect = route.query.redirect as string;
      window.location.href = redirect || "/";
    });
  } catch (error) {
    console.error(error);
  }
};

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

          <div class="ripple-effect py-3 ga-2" @click="onClickLogin('google')">
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
