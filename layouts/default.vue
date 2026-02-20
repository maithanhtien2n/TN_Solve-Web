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
const { onGetterMasterData, onActionAllMasterDataClient } =
  useMasterDataStore();

const loading = ref(true);
const commonDialogRef = ref<any>(null);

const client = computed<boolean>(() => {
  const win = window as any;
  return !!(win.electronAPI && win.electronAPI.isElectron);
});

const pathArray = computed(() => {
  const parts = route.path.split("/");
  const filteredParts = parts.filter((i) => i);
  return filteredParts.slice(1);
});

const appVersionDownload = computed(
  () => onGetterMasterData.value["app-version"] || ""
);

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
    case "documents": {
      return "Tài liệu";
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
    const { state, code, scope, authuser } = route.query;

    if (!userData.value?.name && state && code && scope && authuser) {
      const decodedState = JSON.parse(atob(state as string));

      if (!client.value && decodedState.target === "app") {
        window.location.href = `tnsolve://?state=${state}&code=${code}&scope=${scope}&authuser=${authuser}`;
        setTimeout(() => {
          window.location.href = "/";
          window.close();
        }, 3000);
        return;
      }

      let payload: any = {
        type: "google",
        credential: route.query?.code,
        redirectUri: GOOGLE_REDIRECT_URI,
      };

      if (referralId.value) payload.ref = referralId.value;
      if (!payload.ref && route.query?.code) payload.code = route.query.code;

      await authService.login(payload).then(() => {
        router.replace(decodedState.redirect);
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
          // await appService.restartProcess().catch(() => null);

          if (
            (window as any).electronAPI &&
            (window as any).electronAPI.sendEmailToSocket &&
            userData.value?.email
          ) {
            (window as any).electronAPI.sendEmailToSocket(
              userData.value?.email
            );
          } else {
            console.error("Không tìm thấy electronAPI hoặc sendEmailToSocket");
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

    await onActionAllMasterDataClient({ type: "app-version", download: true });

    if (
      userData.value?.role &&
      userData.value?.role !== EnumAccountRole.ADMIN &&
      !isMobile.value
    ) {
      commonDialogRef.value?.onDisplay(!client.value);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 300);
  }
});

// onMounted(() => {
//   commonDialogRef.value?.onDisplay(!client.value);
// });
</script>

<template>
  <AppLoading v-if="loading || !breadcrumbsItems || !breadcrumbsItems.length" />

  <v-app>
    <CommonDialog
      ref="commonDialogRef"
      title="Thông báo từ TN SOLVE"
      width="530"
    >
      <v-card-text>
        <div class="d-flex flex-column align-center mb-6">
          <v-icon color="warning" size="64" class="mb-2">
            mdi-shield-alert-outline
          </v-icon>
          <h3 class="text-h5 font-weight-bold text-center">
            THÔNG BÁO QUAN TRỌNG
          </h3>
        </div>

        <div class="text-body-1 line-height-relaxed text-grey-darken-3">
          <p class="mb-4">
            Để tối ưu tốc độ <strong>tạo Video AI tự động</strong> và đảm bảo hệ
            thống hoạt động <strong>ổn định</strong>, chúng tôi đã phát hành
            phiên bản công cụ <strong>cài đặt trực tiếp trên máy tính</strong>.
          </p>

          <v-alert type="warning" variant="tonal" border="start" class="mb-4">
            <strong>Khuyến nghị:</strong> Sử dụng công cụ chạy trên máy cá nhân
            giúp hạn chế gián đoạn, giảm lỗi khi xử lý video và đảm bảo trải
            nghiệm ổn định nhất trong quá trình sử dụng.
          </v-alert>

          <!-- <p class="text-body-2 text-grey-darken-1 mb-4 text-center">
            <i>(Hỗ trợ <strong>.exe</strong> cho Windows)</i>
          </p> -->
        </div>

        <v-divider class="my-10"></v-divider>

        <div class="d-flex flex-column gap-3">
          <a
            class="download-btn justify-center"
            :href="appVersionDownload"
            target="_blank"
            rel="noopener"
          >
            <v-icon size="22" class="icon-win">mdi-microsoft-windows</v-icon>
            <span :style="{ 'font-size': isMobile ? '1rem' : '1.2rem' }">
              Tải công cụ TN Solve cho Windows
            </span>
          </a>

          <!-- <a
            target="_blank"
            href="https://youtube.com/shorts/NasjgxOiTXY?si=EvCKjKwMthEC73Zv"
            class="text-center mt-3"
          >
            Xem Video Hướng Dẫn Cài Đặt
          </a> -->
        </div>
      </v-card-text>
    </CommonDialog>

    <PopupBuyCredit />
    <PopupMessage />

    <AppHeader />

    <v-main>
      <v-container max-width="1400" class="mt-4">
        <div :class="{ 'mx-4': isMobile }">
          <v-breadcrumbs
            v-show="
              ![
                `${localePath('/')}`,
                `${localePath('/video/public')}`,
              ].includes(route.path) &&
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
