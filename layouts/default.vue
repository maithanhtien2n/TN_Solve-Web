<script setup lang="ts">
import { accountService, authService, masterDataService } from "~/services/app";

import AppHeader from "~/components/layouts/AppHeader.vue";
import AppFooter from "~/components/layouts/AppFooter.vue";

const route = useRoute();
const router = useRouter();
const { isMobile } = useDevice();

// Link nhóm Zalo hiển thị ở popup "Thanh toán thành công!" — admin chỉnh được
// ở Admin > Cài đặt > Thông tin chung (mục "Link nhóm Zalo"), không cần
// deploy code mỗi lần đổi link.
const zaloGroupLink = ref("https://zalo.me/g/p8hls5tonlfkqmyfndmx");
onMounted(async () => {
  try {
    const res = await masterDataService.getZaloGroupLink();
    if (res.data?.link) zaloGroupLink.value = res.data.link;
  } catch (_) {}
});

const {
  onActionGetUserData,
  onGetterUserData: userData,
  onGetterDisplayPopupBuyCredit,
  onGetterDisplayLogin: displayLogin,
} = useAppStore();
const { onActionAllMasterDataClient } = useMasterDataStore();

const loading = ref(true);
const commonDialogPaymentRef = ref<any>(null);
const paidSummary = ref<any>(null);

// Đọc lại tóm tắt gói vừa mua (lưu ở dang-ky-dich-vu.vue/PopupBuyCredit.vue
// ngay trước lúc redirect sang cổng thanh toán) để hiện đúng chi tiết gói
// trong popup "Thanh toán thành công" thay vì 1 mẫu chung chung cho mọi case.
// Xoá ngay sau khi đọc — chỉ dùng đúng 1 lần cho lượt thanh toán vừa xong.
function readPendingPaymentSummary() {
  try {
    const raw = localStorage.getItem("pendingPaymentSummary");
    localStorage.removeItem("pendingPaymentSummary");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const client = computed<boolean>(() => {
  const win = window as any;
  return !!(win.electronAPI && win.electronAPI.isElectron);
});

const pathArray = computed(() => {
  return route.path.split("/").filter((i) => i);
});

const onReturnTitle = (title: string) => {
  switch (title) {
    case "tai-khoan": {
      return "Tài khoản";
    }
    case "tao-moi": {
      return "Tạo mới";
    }
    case "thu-vien-cua-toi": {
      return "Thư viện của tôi";
    }
    case "cong-dong": {
      return "Cộng đồng";
    }
    case "cua-hang": {
      return "Cửa hàng";
    }
    case "huong-dan": {
      return "Hướng dẫn";
    }
    case "cai-dat": {
      return "Cài đặt";
    }
    case "tro-ly-ai": {
      return "Trợ lý AI";
    }
    case "dang-ky-dich-vu": {
      return "Đăng ký";
    }
    case "doi-tac": {
      return "Cộng tác viên";
    }
    case "gioi-thieu-cua-toi": {
      return "Giới thiệu của tôi";
    }
    case "lich-su-giao-dich": {
      return "Lịch sử giao dịch";
    }
    case "khach-hang": {
      return "Khách hàng";
    }
    case "nguoi-dung": {
      return "Người dùng";
    }
    case "dieu-khoan": {
      return "Điều khoản & quy định";
    }
    case "chinh-sach-bao-mat": {
      return "Chính sách bảo mật";
    }
    case "hinh-thuc-thanh-toan": {
      return "Hình thức thanh toán";
    }
    case "chinh-sach-giao-nhan": {
      return "Chính sách giao nhận";
    }
    case "chinh-sach-bao-hanh": {
      return "Chính sách bảo hành & đổi trả";
    }
    default: {
      return "Chi tiết";
    }
  }
};

const breadcrumbsItems = computed(() => {
  return [
    {
      title: "Trang chủ",
      disabled: false,
      href: "/",
    },
    ...pathArray.value.map((part, index) => ({
      title: onReturnTitle(part),
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

    const { resultCode } = route.query;

    if (resultCode !== undefined && resultCode !== null) {
      // 1. Làm sạch URL (Chuyển ngay về trang chủ)
      router.replace("/");

      // 2. Phân nhánh xử lý theo mã trạng thái
      if (resultCode === "0") {
        // 🟢 THÀNH CÔNG
        paidSummary.value = readPendingPaymentSummary();
        commonDialogPaymentRef.value?.onDisplay(true);
      } else if (resultCode === "2") {
        // 🟡 KHÁCH TỰ HỦY
        useAppStore().onActionSetSystemPopup({
          type: "warning",
          content:
            "⚠️ Bạn vừa hủy giao dịch, mã QR trước đó sẽ không còn hiệu lực!",
        });
      } else {
        // 🔴 THẤT BẠI (Các lỗi hệ thống, ngân hàng từ chối...)
        useAppStore().onActionSetSystemPopup({
          type: "error",
          content:
            "❌ Giao dịch không thành công, vui lòng kiểm tra lại tài khoản hoặc thử lại sau!",
        });
      }
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
          if (
            (window as any).electronAPI &&
            (window as any).electronAPI.sendUserData &&
            userData.value?.email
          ) {
            (window as any).electronAPI.sendUserData(
              JSON.stringify(userData.value),
            );
          } else {
            console.error("Không tìm thấy electronAPI hoặc sendUserData");
          }
        }
      })
      .catch(() => {
        const isAuth = Boolean(route.meta?.middleware === "auth");
        if (isAuth || route.query.action === "buy-credit") {
          displayLogin.value = true;
          router.replace(
            `/?redirect=${removeLocalePrefixStrict(route.fullPath)}`,
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
  <AppLoading v-if="loading || !breadcrumbsItems?.length" />

  <v-app>
    <CommonDialog
      ref="commonDialogPaymentRef"
      title="Thông báo hệ thống"
      width="450"
    >
      <v-card-text class="py-4 px-1 text-center">
        <v-avatar color="success-lighten-5" size="80" class="mb-0">
          <v-icon icon="mdi-check-circle" color="success" size="64"></v-icon>
        </v-avatar>

        <h3 class="text-h5 font-weight-bold mb-5 text-grey-darken-3">
          Thanh toán thành công!
        </h3>

        <!-- Chi tiết gói vừa mua — liệt kê đầy đủ từng mục + giá tiền, đọc từ
             pendingPaymentSummary lưu ở FE trước lúc redirect sang cổng
             thanh toán (xem readPendingPaymentSummary). -->
        <v-sheet
          v-if="paidSummary?.items?.length"
          color="grey-lighten-4"
          rounded="lg"
          class="pa-4 mb-4 text-left"
        >
          <div
            v-for="(item, idx) in paidSummary.items"
            :key="idx"
            class="d-flex align-center justify-space-between"
            :class="idx > 0 ? 'mt-2' : ''"
          >
            <span class="text-body-1 text-grey-darken-3" style="min-width: 0">{{ item.label }}</span>
            <span class="text-body-1 font-weight-bold text-red ml-2" style="white-space: nowrap; flex-shrink: 0;">
              {{ formatCurrency(item.price) }}
            </span>
          </div>

          <template v-if="paidSummary.items.length > 1">
            <v-divider class="my-2" style="border-style: dotted;" />
            <div class="d-flex align-center justify-space-between">
              <span class="text-body-1 font-weight-bold text-grey-darken-3" style="min-width: 0">Tổng cộng</span>
              <span class="text-body-1 font-weight-bold text-red ml-2" style="white-space: nowrap; flex-shrink: 0;">
                {{ formatCurrency(paidSummary.total) }}
              </span>
            </div>
          </template>
        </v-sheet>

        <p class="text-body-1 text-grey-darken-1 mb-4">
          Cảm ơn bạn đã tin dùng <strong>TN SOLVE</strong>. Để không bỏ lỡ các
          tài liệu và hướng dẫn mới nhất, mời bạn tham gia cộng đồng của chúng
          tôi.
        </p>

        <v-sheet
          color="blue-lighten-5"
          rounded="lg"
          class="pa-4 mb-6 border-dashed border-blue-lighten-3 border-md"
        >
          <div class="d-flex align-center justify-center mb-2">
            <v-icon color="blue-darken-2" class="mr-2" size="27">
              mdi-account-group
            </v-icon>
            <span
              class="font-bold text-blue-darken-3"
              style="font-size: 1.2rem"
            >
              Cộng đồng hỗ trợ Zalo
            </span>
          </div>

          <a
            target="_blank"
            :href="zaloGroupLink"
            style="font-size: 1.2rem"
          >
            {{ zaloGroupLink }}
          </a>
        </v-sheet>
      </v-card-text>
    </CommonDialog>

    <!-- <PopupAnnouncement /> -->
    <PopupBuyCredit />
    <PopupMessage />

    <AppHeader />

    <v-main>
      <v-container max-width="1400" class="mt-4">
        <div :class="{ 'mx-4': isMobile }">
          <v-breadcrumbs
            v-show="
              !['/'].includes(route.path) &&
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

.v-avatar {
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  60% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.border-dashed {
  border-style: dashed !important;
}
</style>
