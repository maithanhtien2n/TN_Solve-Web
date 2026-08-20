<script setup lang="ts">
import DrawerSystem from "~/components/layouts/DrawerSystem.vue";

const route = useRoute();
const router = useRouter();
const { width } = useDevice();

const { onGetterUserData, onActionGetUserData } = useAppStore();
const { onActionAllMasterDataClient } = useMasterDataStore();

const drawerSystemRef = ref<any>();
const loading = ref<boolean>(true);

const layoutName = computed(() => route.meta.layout || "");
const userData = computed(() => onGetterUserData.value);
const routeName = computed(() => route.name?.toString().split("___")[0]);
const breadcrumbs = computed<any>(() => {
  const matched = route.matched.slice();

  if (matched.length === 1 && matched[0].path.includes("/admin/accounts")) {
    matched.unshift({
      path: "/admin/accounts",
      meta: { title: "Tài khoản" },
    } as unknown as any);
  }

  if (matched.length === 1 && matched[0].path.includes("/admin/videos")) {
    matched.unshift({
      path: "/admin/videos",
      meta: { title: "Thước phim" },
    } as unknown as any);
  }

  if (matched.length === 1 && matched[0].path.includes("/admin/master-data")) {
    matched.unshift({
      path: "/admin/master-data",
      meta: { title: "Quản lý dữ liệu" },
    } as unknown as any);
  }

  if (matched.length === 1 && matched[0].path.includes("/admin/settings")) {
    matched.unshift({
      path: "/admin/settings",
      meta: { title: "Cài đặt" },
    } as unknown as any);
  }

  if (
    matched.length === 1 &&
    matched[0].path.includes("/doi-tac/gioi-thieu-cua-toi")
  ) {
    matched.unshift({
      path: "/doi-tac/gioi-thieu-cua-toi",
      meta: { title: "Quản lý giới thiệu" },
    } as unknown as any);
  }

  return [
    {
      disabled: false,
      href: "/",
    },
    ...matched.map((item: any, index) => ({
      title: item.meta?.title || "",
      disabled: index === matched.length - 1,
    })),
  ];
});

// "dashboard" và "banks" chỉ dành cho ADMIN/PARTNER — user thường (chưa mở khóa
// CTV) xem trang Tổng quan khác (thẻ tiến độ) và chưa được vào trang Thanh toán
// (chỉ mở khi đã đủ điều kiện kiếm tiền) nên không cần 2 API này.
// "transaction-months" đã mở cho cả user vì trang Lịch sử giao dịch vẫn cho xem.
const isPartnerOrAdmin = computed(() =>
  [EnumAccountRole.ADMIN, EnumAccountRole.PARTNER].includes(
    userData.value?.role
  )
);

watch(
  () => route.query.id,
  (newValue) => {
    if (newValue && isPartnerOrAdmin.value) {
      onActionAllMasterDataClient({
        type: "dashboard",
        accountId:
          userData.value?.role === EnumAccountRole.ADMIN ? newValue : null,
      });
    }
  }
);

// Layout "partner" cho cả user thường vào để xem tiến độ mở khóa CTV và các
// trang con (Quản lý giới thiệu, Lịch sử giao dịch) — riêng trang Thanh toán
// vẫn chỉ dành cho CTV thực sự (đã đủ điều kiện kiếm tiền). Layout "admin" vẫn
// giữ nguyên chỉ Admin/Partner như trước. Chạy lại khi đổi route vì layout
// không remount khi chuyển giữa các trang cùng layout.
const checkPagePermission = () => {
  const allowedRoles =
    layoutName.value === "partner" && route.path !== "/doi-tac/thanh-toan"
      ? [EnumAccountRole.ADMIN, EnumAccountRole.PARTNER, EnumAccountRole.USER]
      : [EnumAccountRole.ADMIN, EnumAccountRole.PARTNER];

  if (!allowedRoles.includes(userData.value?.role)) router.push("/notfound");
};

watch(() => route.path, checkPagePermission);

onMounted(async () => {
  try {
    await onActionGetUserData()
      .then(async () => {
        await Promise.all([
          isPartnerOrAdmin.value
            ? onActionAllMasterDataClient({
                type: "dashboard",
                accountId:
                  userData.value?.role === EnumAccountRole.ADMIN
                    ? route.query.id
                    : null,
              })
            : Promise.resolve(),
          onActionAllMasterDataClient({ type: "transaction-months" }),

          isPartnerOrAdmin.value
            ? onActionAllMasterDataClient({ type: "banks" }).catch(() => {})
            : Promise.resolve(),
        ]);

        if (userData.value?.role === EnumAccountRole.ADMIN) {
          await Promise.all([
            onActionAllMasterDataClient({ type: "model-video" }),
            onActionAllMasterDataClient({ type: "frame-rate" }),
            onActionAllMasterDataClient({ type: "video-mode" }),
            onActionAllMasterDataClient({ type: "video-style" }),
            onActionAllMasterDataClient({ type: "video-duration" }),
            onActionAllMasterDataClient({ type: "rental-months" }),
            onActionAllMasterDataClient({ type: "my-partner" }),
            onActionAllMasterDataClient({ type: "discount-type" }),
            onActionAllMasterDataClient({ type: "condition-type" }),
          ]);
        }
      })
      .finally(checkPagePermission);
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
  <AppLoading v-if="loading || !breadcrumbs || !breadcrumbs.length" />

  <v-layout v-else>
    <PopupMessage />
    <DrawerSystem ref="drawerSystemRef" />

    <v-main>
      <div class="header px-4">
        <div class="d-flex align-center ga-2">
          <v-img
            src="/images/main-icon.png"
            lazy-src="/images/tn-solve-icon.png"
            style="width: 2.4rem"
          />
          <h3 class="font-bold text-primary">
            {{ userData?.role?.toUpperCase() }}
          </h3>
        </div>

        <v-btn
          v-if="Boolean(width < 1024)"
          icon
          variant="text"
          size="44"
          style="margin-right: -0.7rem"
          @click="drawerSystemRef.onDisplay(true)"
        >
          <v-icon size="30">mdi-menu</v-icon>
        </v-btn>
      </div>

      <div class="ma-4">
        <v-breadcrumbs
          v-if="!['admin', 'partner'].includes(routeName || '')"
          :items="breadcrumbs"
          class="mb-4"
        >
          <template v-slot:prepend>
            <v-icon icon="mdi-home-outline" size="20" />
          </template>
        </v-breadcrumbs>

        <NuxtPage />
      </div>
    </v-main>
  </v-layout>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 7;
  display: flex;
  height: 64.6px;
  overflow: hidden;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
