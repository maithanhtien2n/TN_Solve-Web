<script setup lang="ts">
import { authService } from "~/services/app";

import AppLogin from "./AppLogin.vue";

const route = useRoute();
const router = useRouter();

const { isMobile } = useDevice();

const {
  onGetterUserData: userData,
  onGetterDisplayLogin: displayLogin,
  onGetterDisplayPopupBuyCredit,
} = useAppStore();

const navItems = [
  { title: "Trang chủ", path: "/", icon: "mdi-home-outline" },
  { title: "Cộng đồng", path: "/video/public", icon: "mdi-earth" },
  { title: "Đăng ký", path: "/payment", icon: "mdi-tag-outline" },
];

const isActive = (path: string) => route.path === path;

const navTrackRef = ref<HTMLElement | null>(null);
const pillStyle = ref({ left: "4px", width: "0px" });

const updatePill = () => {
  if (!navTrackRef.value) return;
  const activeIndex = navItems.findIndex((i) => isActive(i.path));
  const items = navTrackRef.value.querySelectorAll<HTMLElement>(".nav-item");
  const el = items[activeIndex];
  if (el) {
    pillStyle.value = { left: el.offsetLeft + "px", width: el.offsetWidth + "px" };
  }
};

watch(() => route.path, () => nextTick(updatePill));
onMounted(() => nextTick(updatePill));

const menus = computed(() => {
  let items = [
    { title: "Tài khoản", value: "account", icon: "mdi-account-circle-outline" },
    { title: "Thư viện của tôi", value: "video", icon: "mdi-image-multiple-outline" },
    {
      title: userData.value?.serviceExpiry ? "Gia hạn dịch vụ" : "Đăng ký dịch vụ",
      value: "payment",
      icon: userData.value?.serviceExpiry ? "mdi-calendar-sync" : "mdi-tag-plus-outline",
    },
    { title: "Mua tín dụng", value: "buy-credit", icon: "mdi-credit-card-outline" },
    { title: "Đăng xuất", value: "logout", icon: "mdi-logout", size: 21 },
  ];

  if (!userData.value?.remainingTime)
    items = items.filter((i) => i.value !== "buy-credit");

  if (userData.value?.role === EnumAccountRole.ADMIN) {
    items.splice(1, 0, { title: "Trang quản trị", value: "admin", icon: "mdi-shield-account-outline" });
    items = items.filter((i) => i.value !== "account");
  } else if (userData.value?.role === "partner") {
    items.splice(4, 0, { title: "Cộng tác viên", value: "partner", icon: "mdi-account-multiple-outline" });
  }

  return items;
});

const statusLabel = computed(() => {
  if (userData.value?.role === EnumAccountRole.ADMIN) return { text: "Admin", ok: true };
  if (userData.value?.serviceExpiry)
    return userData.value?.remainingTime
      ? { text: `Còn ${userData.value.remainingTime}`, ok: true }
      : { text: "Hết hạn", ok: false };
  if (userData.value?.settings?.testAmount != null)
    return { text: `${userData.value.settings.testAmount} lượt thử`, ok: true };
  return null;
});

const onClickMenuItem = (value: string) => {
  if (value === "logout") {
    authService.logout().then(() => {
      window.location.href = "/";
      if ((window as any)?.electronAPI?.logout) (window as any).electronAPI.logout({});
    });
  } else if (value === "buy-credit") {
    onGetterDisplayPopupBuyCredit.value = true;
  } else {
    router.push(`/${value}`);
  }
};
</script>

<template>
  <AppLogin />

  <header class="app-header">
    <v-container max-width="1400">
      <div class="header-inner">

        <!-- Logo -->
        <v-img
          src="/images/tn-solve-logo.png"
          lazy-src="/images/tn-solve-logo.png"
          :width="isMobile ? 96 : 128"
          height="48"
          class="logo flex-grow-0 cursor-pointer"
          @click="router.push('/')"
        />

        <!-- Nav desktop -->
        <nav v-if="!isMobile" class="header-nav">
          <div ref="navTrackRef" class="nav-track">
            <div class="nav-pill" :style="pillStyle" />
            <div
              v-for="item in navItems"
              :key="item.path"
              class="nav-item"
              :class="{ 'nav-item--active': isActive(item.path) }"
              @click="router.push(item.path)"
            >
              {{ item.title }}
            </div>
          </div>
        </nav>

        <!-- Right -->
        <div class="header-right">

          <!-- Status badge -->
          <div v-if="statusLabel" class="status-badge" :class="statusLabel.ok ? 'status-badge--ok' : 'status-badge--ex'">
            <span class="status-pulse" />
            {{ statusLabel.text }}
          </div>

          <!-- Logged in -->
          <template v-if="Object.values(userData || {})?.length">
            <v-menu location="bottom end" :offset="10">
              <template #activator="{ props }">
                <button v-bind="props" class="avatar-btn">
                  <v-avatar size="34">
                    <v-img loading="lazy" :src="userData.avatar || '/images/avatar-default.jpg'">
                      <template #placeholder><v-img src="/images/avatar-default.jpg" /></template>
                    </v-img>
                  </v-avatar>
                  <v-icon size="14" class="avatar-chevron">mdi-chevron-down</v-icon>
                </button>
              </template>

              <v-card min-width="230" rounded="xl" elevation="8" class="menu-card">
                <div class="menu-header">
                  <v-avatar size="44" class="menu-avatar">
                    <v-img loading="lazy" :src="userData.avatar || '/images/avatar-default.jpg'" />
                  </v-avatar>
                  <div>
                    <div class="menu-name">{{ userData.name }}</div>
                    <div class="menu-credit" v-if="userData?.role !== EnumAccountRole.ADMIN">
                      <span v-if="userData.settings?.unlimitedVideo">
                        💎 <v-icon size="12">mdi-infinity</v-icon> {{ userData.settings.unlimitedVideo }} ngày
                      </span>
                      <span v-else>
                        💎 {{ (userData.settings?.credit || 0).toLocaleString("vi-VN") }} tín dụng
                      </span>
                    </div>
                  </div>
                </div>

                <v-divider />

                <v-list density="compact" class="menu-list py-1">
                  <v-list-item
                    v-for="item in menus"
                    :key="item.value"
                    rounded="lg"
                    class="mx-2 my-0"
                    @click="onClickMenuItem(item.value)"
                  >
                    <template #prepend>
                      <v-icon
                        :icon="item.icon"
                        :size="item.size || 18"
                        :color="item.value === 'logout' ? '#ef4444' : '#475569'"
                      />
                    </template>
                    <v-list-item-title
                      :class="item.value === 'logout' ? 'logout-item' : 'menu-item-title'"
                    >
                      {{ item.title }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </template>

          <!-- Login -->
          <button v-else class="login-btn" @click="displayLogin = true">
            Đăng nhập
          </button>
        </div>
      </div>
    </v-container>
  </header>
</template>

<style scoped>
/* ─── Shell ──────────────────────────────────────────── */
.app-header {
  position: sticky;
  top: 0;
  z-index: 999;
  background: linear-gradient(90deg, #d6eaf8 0%, #e3f2fd 45%, #bbdefb 100%);
  border-bottom: 1px solid rgba(30, 136, 229, 0.2);
  box-shadow: 0 2px 12px rgba(30, 136, 229, 0.15);
}

.header-inner {
  display: flex;
  align-items: center;
  height: 64px;
  gap: 0;
  position: relative;
}

/* ─── Logo ───────────────────────────────────────────── */
.logo {
  flex-shrink: 0;
  margin-right: 32px;
  border-radius: 6px;
}

/* ─── Nav ────────────────────────────────────────────── */
.header-nav {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.nav-track {
  position: relative;
  display: flex;
  align-items: center;
  gap: 2px;
  background: rgba(255,255,255,0.45);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,0.7);
  border-radius: 999px;
  padding: 4px;
}

.nav-pill {
  position: absolute;
  top: 4px;
  bottom: 4px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(21,101,192,0.15);
  transition: left 0.28s cubic-bezier(0.34, 1.2, 0.64, 1), width 0.28s cubic-bezier(0.34, 1.2, 0.64, 1);
  pointer-events: none;
}

.nav-item {
  position: relative;
  z-index: 1;
  padding: 6px 18px;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 500;
  color: #1e6abf;
  cursor: pointer;
  transition: color 0.2s;
  white-space: nowrap;
  user-select: none;
}

.nav-item:hover {
  color: #0d47a1;
}

.nav-item--active {
  color: #1565c0;
  font-weight: 700;
}

/* ─── Right ──────────────────────────────────────────── */
.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

/* ─── Status badge ───────────────────────────────────── */
.status-badge {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.status-badge--ok {
  background: rgba(5,150,105,0.12);
  color: #065f46;
  border: 1px solid rgba(5,150,105,0.25);
}

.status-badge--ex {
  background: rgba(239,68,68,0.1);
  color: #b91c1c;
  border: 1px solid rgba(239,68,68,0.2);
}

.status-pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

/* ─── Avatar button ──────────────────────────────────── */
.avatar-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 3px 8px 3px 3px;
  cursor: pointer;
  transition: background 0.18s, border-color 0.18s;
}

.avatar-btn:hover {
  background: #e2e8f0;
  border-color: #cbd5e1;
}

.avatar-chevron {
  color: #94a3b8 !important;
}

/* ─── Dropdown menu ──────────────────────────────────── */
.menu-card {
  border: 1px solid #f0f0f0 !important;
  overflow: hidden;
}

.menu-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
}

.menu-avatar {
  border: 2px solid #e5e7eb;
  flex-shrink: 0;
}

.menu-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.3;
}

.menu-credit {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 2px;
}

.menu-item-title {
  font-size: 0.875rem !important;
  color: #374151;
}

.logout-item {
  font-size: 0.875rem !important;
  color: #ef4444;
}

/* ─── Login ──────────────────────────────────────────── */
.login-btn {
  padding: 7px 18px;
  border-radius: 8px;
  background: #1e88e5;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.18s, transform 0.15s;
}

.login-btn:hover {
  background: #1565c0;
  transform: translateY(-1px);
}
</style>
