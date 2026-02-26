<script setup lang="ts">
import { authService } from "~/services/auth";

const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();

const { width, isMobile } = useDevice();

const { onGetterUserData: userData } = useAppStore();

const display = ref(false);
const open = ref<string[]>([]);

const layoutName = computed(() => route.meta.layout || "");
const routeName = computed(() => route.name?.toString().split("___")[0]);
const menus = computed<any>(() => {
  const items = [
    {
      title: "Tổng quan",
      icon: "mdi-view-dashboard-outline",
      route: "/admin",
    },
    {
      role: [EnumAccountRole.ADMIN],
      title: "Tài khoản",
      icon: "mdi-account-circle-outline",
      route: "accounts",
      children: [
        {
          title: "Người dùng",
          route: "/admin/accounts/user",
        },
        {
          title: "Khách hàng",
          route: "/admin/accounts/customer",
        },
        {
          title: "Cộng tác viên",
          route: "/admin/accounts/partner",
        },
        {
          title: "Quản trị viên",
          route: "/admin/accounts/admin",
        },
      ],
    },
    {
      role: [EnumAccountRole.ADMIN],
      title: "Thước phim",
      icon: "mdi-movie-open-outline",
      route: "videos",
      children: [
        {
          title: "Đang tạo",
          route: "/admin/videos/in-progress",
        },
        {
          title: "Tạo bị lỗi",
          route: "/admin/videos/error",
        },
        {
          title: "Hoàn thành",
          route: "/admin/videos/complete",
        },
      ],
    },
    {
      role: [EnumAccountRole.ADMIN],
      title: "Mã giảm giá",
      icon: "mdi-ticket-percent-outline",
      route: "/admin/coupon",
    },
    {
      role: [EnumAccountRole.ADMIN],
      title: "Gói cho thuê",
      icon: "mdi-package-variant-closed",
      route: "/admin/service-rentals",
    },
    {
      role: [EnumAccountRole.ADMIN],
      title: "Lịch sử giao dịch",
      icon: "mdi-cash-clock",
      route: "/admin/transaction-history",
    },
    {
      role: [EnumAccountRole.ADMIN],
      title: "Quản lý dữ liệu",
      icon: "mdi-database-outline",
      route: "master-data",
      children: [
        {
          title: "Tài khoản Grok",
          route: "/admin/master-data/account-create-video-grok",
        },
        {
          title: "Tài khoản Veo3 (Basic)",
          route: "/admin/master-data/account-create-video-basic",
        },
        {
          title: "Tài khoản Veo3 (Advanced)",
          route: "/admin/master-data/account-create-video-advanced",
        },
        {
          title: "Tài khoản Nano banana",
          route: "/admin/master-data/account-create-image",
        },
      ],
    },
    {
      role: [EnumAccountRole.ADMIN],
      title: "Cài đặt",
      icon: "mdi-cog-outline",
      route: "settings",
      children: [
        {
          title: "Thông tin chung",
          route: "/admin/settings/general",
        },
      ],
    },

    // ------------------PARTNER--------------------
    {
      role: [EnumAccountRole.PARTNER],
      title: "Tổng quan",
      icon: "mdi-view-dashboard-outline",
      route: "/partner",
    },
    {
      role: [EnumAccountRole.PARTNER],
      title: "Quản lý giới thiệu",
      icon: "mdi-account-group-outline",
      route: "my-referral",
      children: [
        {
          title: "Người dùng",
          route: "/partner/my-referral/user",
        },
        {
          title: "Khách hàng",
          route: "/partner/my-referral/customer",
        },
      ],
    },
    {
      role: [EnumAccountRole.PARTNER],
      title: "Lịch sử giao dịch",
      icon: "mdi-cash-clock",
      route: "/partner/transaction-history",
    },
    {
      role: [EnumAccountRole.PARTNER],
      title: "Thanh toán",
      icon: "mdi-credit-card-outline",
      route: "/partner/payment",
    },
    {
      role: [EnumAccountRole.ADMIN, EnumAccountRole.PARTNER],
      title: "TN SOLVE",
      icon: "mdi-video-stabilization",
      route: "home",
    },
  ];

  return items.filter((x) => x.role?.includes(userData.value?.role));
});

const onDisplay = (value: boolean) => {
  display.value = value;
};

const onSelectMenuItem = (event: any) => {
  if (event.id === "home") router.push(localePath("/"));
  else if (event.id) router.push(localePath(event.id));
};

const onClickLogout = () => {
  authService.logout().then(() => {
    window.location.href = `/`;
  });
};

onMounted(() => {
  for (const menu of menus.value) {
    if (menu.children) {
      const match = menu.children.find(
        (child: any) => localePath(child.route) === route.fullPath
      );
      if (match) {
        open.value = [menu.route];
        break;
      }
    }
  }
});

defineExpose({ onDisplay });
</script>

<template>
  <v-navigation-drawer
    v-model="display"
    location="left"
    width="270"
    :temporary="Boolean(width < 1024)"
    :permanent="!Boolean(width < 1024)"
    style="
      background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
      z-index: 9999;
    "
  >
    <template v-slot:prepend>
      <v-list-item lines="two">
        <template #prepend>
          <v-avatar>
            <v-img
              :src="userData?.avatar || '/images/avatar-default.jpg'"
              :lazy-src="userData?.avatar || '/images/avatar-default.jpg'"
            >
              <template #placeholder>
                <v-img src="/images/avatar-default.jpg" />
              </template>
            </v-img>
          </v-avatar>
        </template>

        <template #default>
          <div class="d-flex flex-column">
            <span>{{ userData?.name }}</span>
          </div>
        </template>
      </v-list-item>

      <v-divider />
    </template>

    <v-list
      v-model:opened="open"
      nav
      open-strategy="single"
      @click:select="onSelectMenuItem"
    >
      <template v-for="(menu, index) in menus" :key="index">
        <v-list-group v-if="menu?.children" :value="menu.route">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :prepend-icon="menu.icon">
              <template #default>
                <span>{{ $t(menu.title) }}</span>
              </template>
            </v-list-item>
          </template>

          <v-list-item
            v-for="(i, idex) in menu.children"
            :key="idex"
            color="primary"
            :active="localePath(i.route) == route.fullPath"
            :value="i.route"
          >
            <template #default>
              <span>{{ $t(i.title) }}</span>
            </template>
          </v-list-item>
        </v-list-group>

        <v-list-item
          v-else
          color="primary"
          :prepend-icon="menu.icon"
          :value="menu.route"
          :active="localePath(menu.route) == route.fullPath"
        >
          <template #default>
            <span>{{ $t(menu.title) }}</span>
          </template>
        </v-list-item>
      </template>
    </v-list>

    <template v-slot:append>
      <v-list nav>
        <v-list-item
          prepend-icon="mdi-logout"
          value="logout"
          class="text-red bg-white"
          @click="onClickLogout"
        >
          <template #default>
            <span>{{ $t("Đăng xuất") }}</span>
          </template>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>

  <v-overlay v-if="isMobile" v-model="display" style="z-index: 9 !important" />
</template>
