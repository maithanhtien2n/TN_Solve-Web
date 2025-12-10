<script setup lang="ts">
import DrawerSystem from "~/components/layouts/DrawerSystem.vue";

const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();

const { t } = useI18n();
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
      meta: { title: t("Tài khoản") },
    } as unknown as any);
  }

  if (matched.length === 1 && matched[0].path.includes("/admin/videos")) {
    matched.unshift({
      path: "/admin/videos",
      meta: { title: t("Thước phim") },
    } as unknown as any);
  }

  if (
    matched.length === 1 &&
    matched[0].path.includes("/partner/my-referral")
  ) {
    matched.unshift({
      path: "/partner/my-referral",
      meta: { title: t("Quản lý giới thiệu") },
    } as unknown as any);
  }

  return [
    {
      // title: t("Trang chủ"),
      disabled: false,
      href: "/",
    },
    ...matched.map((item: any, index) => ({
      title: t(item.meta?.title || ""),
      disabled: index === matched.length - 1,
      // href: item.path,
    })),
  ];
});

onMounted(async () => {
  try {
    await onActionGetUserData()
      .then(async () => {
        await Promise.all([
          onActionAllMasterDataClient({
            type: "dashboard",
            accountId:
              userData.value?.role === EnumAccountRole.ADMIN
                ? route.query.id
                : null,
          }),
          onActionAllMasterDataClient({ type: "transaction-months" }),
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
      .finally(() => {
        if (
          ![EnumAccountRole.ADMIN, EnumAccountRole.PARTNER].includes(
            userData.value?.role
          )
        )
          router.push("/notfound");
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
