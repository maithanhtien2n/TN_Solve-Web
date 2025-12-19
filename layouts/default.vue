<script setup lang="ts">
import { accountService, appService, authService } from "~/services/app";

import AppHeader from "~/components/layouts/AppHeader.vue";
import AppFooter from "~/components/layouts/AppFooter.vue";

const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();

const { t } = useI18n();
const { isMobile } = useDevice();

const {
  onActionGetUserData,
  onGetterUserData: userData,
  onGetterDisplayPopupBuyCredit,
  onGetterDisplayLogin: displayLogin,
} = useAppStore();
const { onActionAllMasterDataClient } = useMasterDataStore();

const loading = ref(true);

const client = computed<boolean>(() => {
  const userAgent = navigator.userAgent;
  return Boolean(userAgent.includes("TNSolve"));
});

const pathArray = computed(() => {
  const parts = route.path.split("/");
  const filteredParts = parts.filter((i) => i);
  return filteredParts.slice(1);
});

const onReturnTitle = (title: string) => {
  switch (title) {
    case "create": {
      return "Tạo video";
    }
    case "video": {
      return "Thư viện của tôi";
    }
    case "setting": {
      return "Cài đặt";
    }
    case "terms": {
      return "Chính sách";
    }
    case "payment": {
      return "Đăng ký dịch vụ";
    }
    case "tutorial": {
      return "Hướng dẫn";
    }
    case "features": {
      return "Tính năng";
    }
    default: {
      return "Chi tiết";
    }
  }
};

const breadcrumbsItems = computed(() => {
  return [
    {
      title: t("Trang chủ"),
      disabled: false,
      href: "/",
    },
    ...pathArray.value.map((part, index) => ({
      title: t(onReturnTitle(part)),
      disabled: index === pathArray.value.length - 1,
      href: `/${pathArray.value.slice(0, index + 1).join("/")}`,
    })),
  ];
});

onMounted(async () => {
  try {
    if (
      !userData.value?.name &&
      route.query?.state &&
      route.query?.code &&
      route.query?.scope &&
      route.query?.authuser
    ) {
      let payload: any = {
        type: "google",
        credential: route.query?.code,
        redirectUri: GOOGLE_REDIRECT_URI,
      };

      if (referralId.value) payload.ref = referralId.value;
      if (!payload.ref && route.query?.code) payload.code = route.query.code;

      await authService.login(payload).then(() => {
        const redirect = atob(route.query?.state as string);
        router.replace(redirect);
      });
    }

    let params: any = {};

    if (route.query?.ref && typeof route.query?.ref === "string") {
      const accountInfoRes = await accountService
        .checkPartner({
          accountId: route.query?.ref,
        })
        .catch(() => null);

      if (accountInfoRes && accountInfoRes?.data?._id) {
        referralId.value = accountInfoRes?.data?._id;
        router.replace({ path: route.path });
      }
    }

    if (referralId.value) params.ref = referralId.value;
    if (!params.ref && route.query?.code) params.code = route.query.code;

    if (route.query?.message === "giao-dich-thanh-cong") {
      await onActionGetUserData(params)
        .then(() => {
          router.replace(localePath("/"));
        })
        .catch(() => {});
    }

    await onActionGetUserData(params)
      .then(async () => {
        if (route.query?.action === "buy-credit") {
          onGetterDisplayPopupBuyCredit.value = true;
          router.replace({ query: { action: undefined } });
        }

        const redirect = route.query.redirect as string;
        if (redirect) router.replace(redirect);

        await Promise.all([
          onActionAllMasterDataClient({ type: "model-video" }),
          onActionAllMasterDataClient({ type: "frame-rate" }),
          onActionAllMasterDataClient({ type: "video-mode" }),
          onActionAllMasterDataClient({ type: "video-style" }),
          onActionAllMasterDataClient({ type: "video-duration" }),
          onActionAllMasterDataClient({ type: "rental-months" }),
        ]);

        if (client.value) {
          await appService.restartProcess().catch(() => null);

          if ((window as any).electronAPI) {
            const email = userData.value?.email || "";
            if (email) {
              (window as any).electronAPI.sendEmailToSocket(email);
            }
          }
        }
      })
      .catch(() => {
        const isAuth = Boolean(route.meta?.middleware === "auth");
        if (isAuth || route.query.action === "buy-credit") {
          displayLogin.value = true;
          router.replace(
            localePath(`/?redirect=${removeLocalePrefixStrict(route.fullPath)}`)
          );
        }
      });
  } catch (error) {
    console.error(error);
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 300);
  }
});
</script>

<template>
  <AppLoading v-if="loading || !breadcrumbsItems || !breadcrumbsItems.length" />

  <v-app>
    <PopupBuyCredit />
    <PopupMessage />

    <AppHeader />

    <v-main>
      <v-container max-width="1400" class="mt-4">
        <div :class="{ 'mx-4': isMobile }">
          <v-breadcrumbs
            v-show="
              ![`${localePath('/')}`].includes(route.path) &&
              breadcrumbsItems &&
              breadcrumbsItems.length
            "
            :items="breadcrumbsItems"
            class="mb-6"
          >
            <template #prepend>
              <v-icon icon="mdi-home-outline" />
            </template>
          </v-breadcrumbs>

          <NuxtPage />
        </div>
      </v-container>
    </v-main>

    <AppFooter />
  </v-app>
</template>

<style scoped>
@media (max-width: 930px) {
  .v-container {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .swiper-slide-container {
    border-radius: 0 !important;
  }
}
</style>
