<script setup lang="ts">
import { accountService } from "~/services/app";

import AppHeader from "~/components/layouts/AppHeader.vue";
import AppFooter from "~/components/layouts/AppFooter.vue";

const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();

const { t } = useI18n();
const { isMobile } = useDevice();

const { onActionGetUserData, onGetterDisplayLogin: displayLogin } =
  useAppStore();
const { onActionAllMasterDataClient } = useMasterDataStore();

const loading = ref(true);
const commonDialogRef = ref<any>(null);

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
      return "Đăng ký gói dịch vụ";
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
    let params: any = {};

    if (route.query?.ref && typeof route.query?.ref === "string") {
      const accountInfoRes = await accountService
        .checkPartner({
          accountId: route.query?.ref,
        })
        .catch(() => null);

      if (accountInfoRes && accountInfoRes?.data?._id) {
        referralId.value = accountInfoRes?.data?._id;
        router.replace("/");
      }
    }

    if (referralId.value) params.ref = referralId.value;
    if (!params.ref && route.query?.code) params.code = route.query.code;

    await onActionGetUserData(params)
      .then(async () => {
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
      })
      .catch(() => {
        const isAuth = Boolean(route.meta?.middleware === "auth");
        if (isAuth) {
          displayLogin.value = true;
          router.replace(localePath(`/?redirect=${route.fullPath}`));
        }
      });

    commonDialogRef.value?.onDisplay(true);
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
    <PopupMessage />

    <CommonDialog
      ref="commonDialogRef"
      width="800"
      title="🔔 Thông báo quan trọng!"
    >
      <div style="padding: 1rem">
        <h2
          style="
            color: #ffc300;
            border-bottom: 2px solid #ffc300;
            margin-top: -5px;
          "
          class="mb-4 pb-4"
        >
          &#128226; Thông báo Nóng về Chi Phí Tín Dụng Veo 3 (Mọi người làm
          video chú ý giúp Em nhé!)
        </h2>

        <p>Chào cả nhà mình,</p>

        <p>
          Cảm ơn mọi người rất nhiều vì đã ủng hộ công cụ tạo video tự động dùng
          dịch vụ của <strong>Veo 3</strong> mà Em cung cấp!
        </p>

        <p>
          Trước đây, Veo 3 Fast là <strong>miễn phí (0 tín dụng/video)</strong>,
          giúp mọi người làm video thoải mái.
        </p>

        <p>
          Tuy nhiên, do lượng người dùng tăng đột biến, bên cung cấp dịch vụ Veo
          3 đang bị quá tải và họ vừa đưa ra một thông báo thay đổi chính sách:
        </p>

        <blockquote
          style="
            background-color: #f9f9f9;
            border-left: 5px solid #007bff;
            margin: 15px 0;
            padding: 10px 15px;
          "
        >
          <p style="margin: 0">
            <strong
              >Vì quá tải, Veo 3 Fast sẽ bắt đầu tính 10 tín dụng/video.</strong
            >
          </p>
        </blockquote>

        <p>
          Em xin lỗi mọi người về sự thay đổi đột ngột và bất tiện này từ phía
          nhà cung cấp Veo 3.
        </p>

        <h3 style="color: #28a745">&#127873; Phương án Hỗ trợ từ Em</h3>

        <p>
          Để mọi người vẫn tiếp tục tạo được video ổn thỏa, Em xin gửi tặng mọi
          người chút hỗ trợ:
        </p>

        <ul style="list-style-type: none; padding-left: 0">
          <li style="margin-bottom: 10px">
            &#10003; <strong>Tặng ngay 4000 tín dụng</strong> vào mỗi tài khoản
            để mọi người sử dụng cho dịch vụ Veo 3 Fast (tương đương
            <strong>400 cảnh</strong>).
          </li>
          <li>
            &#10003; Nếu mọi người dùng hết 4000 tín dụng này mà vẫn cần làm
            video,
            <strong
              >tool đã tích hợp chế độ để mọi người liên kết tài khoản Veo 3 cá
              nhân bên ngoài</strong
            >
            vào hệ thống để tiếp tục sử dụng.
          </li>
        </ul>

        <p style="text-align: center; margin-top: 25px">
          <strong>Mong mọi người</strong> thông cảm và tiếp tục ủng hộ Em nhé!
        </p>
      </div>
    </CommonDialog>

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
