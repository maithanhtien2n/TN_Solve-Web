<script setup lang="ts">
import { authService } from "~/services/app";

import AppLogin from "./AppLogin.vue";

const router = useRouter();
const localePath = useLocalePath();

const { isMobile } = useDevice();

const {
  onGetterUserData: userData,
  onGetterDisplayLogin: displayLogin,
  onActionSetSystemPopup,
} = useAppStore();

const menus = computed(() => {
  const items = [
    {
      title: "Tài khoản",
      value: "account",
      icon: "mdi-account-circle-outline",
    },
    {
      title: "Thư viện của tôi",
      value: "video",
      icon: "mdi-image-multiple-outline",
    },
    {
      title: "Cài đặt",
      value: "setting",
      icon: "mdi-cog-outline",
    },
    {
      title: "Đăng xuất",
      value: "logout",
      icon: "mdi-logout",
      size: 21,
    },
  ];

  if (userData.value?.role === EnumAccountRole.ADMIN) {
    items.splice(2, 0, {
      title: "Trang quản trị",
      value: "admin",
      icon: "mdi-shield-account-outline",
    });
  } else if (userData.value?.role === "partner") {
    items.splice(2, 0, {
      title: "Cộng tác viên",
      value: "partner",
      icon: "mdi-account-multiple-outline",
    });
  }

  return items;
});

const onClickMenuItem = (value: string) => {
  if (value === "logout") {
    authService.logout().then(() => {
      window.location.href = "/";
    });
    return;
  } else if (value === "account") {
    onActionSetSystemPopup({
      type: "info",
      content: "Tính năng đang được phát triển!",
    });
    return;
  } else {
    router.push(localePath(`/${value}`));
  }
};
</script>

<template>
  <AppLogin />

  <div
    class="sticky top-0 right-0 left-0 w-100 py-2"
    style="
      z-index: 999;
      box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
      background: linear-gradient(90deg, rgb(211 233 255), rgb(211 233 255));
    "
  >
    <v-container max-width="1400">
      <div class="d-flex align-center justify-space-between ga-3">
        <div>
          <v-img
            src="/images/tn-solve-logo.png"
            lazy-src="/images/tn-solve-logo.png"
            :class="`${
              isMobile ? 'w-6rem' : 'w-8rem'
            } h-3rem b-radius-1 cursor-pointer`"
            @click="router.push(localePath('/'))"
          />
        </div>

        <div class="d-flex align-center ga-4">
          <v-chip
            v-if="
              userData?.name &&
              (userData?.settings?.testAmount !== null ||
                userData?.serviceExpiry)
            "
            variant="tonal"
            class="font-bold"
            :color="
              userData?.remainingTime
                ? 'green' // 1. Trả phí & Còn hạn: Màu xanh lá
                : userData?.settings?.testAmount
                ? 'primary' // 2. Dùng thử & Còn lượt: Màu xanh dương (hoặc 'blue')
                : 'red' // 3. Hết hạn / Hết lượt: Màu đỏ
            "
            :size="isMobile ? 'small' : 'default'"
          >
            <span v-if="userData?.serviceExpiry">
              {{
                userData?.remainingTime
                  ? `${$t("Còn")} ${userData?.remainingTime}`
                  : $t("Đã hết hạn")
              }}
            </span>

            <span v-else>
              Còn {{ userData?.settings.testAmount }} lượt dùng thử
            </span>
          </v-chip>

          <template v-if="Object.values(userData || {})?.length">
            <v-menu location="bottom right">
              <template v-slot:activator="{ props }">
                <v-avatar v-bind="props" size="44" class="cursor-pointer">
                  <v-img
                    loading="lazy"
                    :src="userData.avatar || '/images/avatar-default.jpg'"
                  >
                    <template #placeholder>
                      <v-img src=" /images/avatar-default.jpg" />
                    </template>
                  </v-img>
                </v-avatar>
              </template>

              <v-card min-width="200">
                <v-list @click.stop>
                  <v-list-item>
                    <template #title>
                      <h3 class="font-bold" style="font-size: 1.1rem">
                        {{ userData.name }}
                      </h3>
                    </template>

                    <template
                      v-if="userData?.role !== EnumAccountRole.ADMIN"
                      #subtitle
                    >
                      <div class="mt-2">
                        <v-icon size="15">mdi-assistant</v-icon>
                        {{
                          `${userData.settings?.credit || 0} ${$t("tín dụng")}`
                        }}
                      </div>
                    </template>
                  </v-list-item>
                </v-list>

                <v-divider />

                <v-list>
                  <v-list-item
                    v-for="(item, index) in menus"
                    :key="index"
                    :value="item.value"
                    @click="onClickMenuItem(item.value)"
                  >
                    <div class="d-flex align-center ga-4">
                      <v-icon
                        :icon="item.icon"
                        :size="item.size"
                        :color="`${item.value === 'logout' ? 'red' : ''}`"
                      />
                      <label
                        class="cursor-pointer"
                        :class="{ 'text-red': item.value === 'logout' }"
                      >
                        {{ $t(item.title) }}
                      </label>
                    </div>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </template>

          <div
            v-else
            class="cta-button cursor-pointer"
            @click="displayLogin = true"
          >
            <h3>{{ $t("Đăng nhập") }}</h3>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<style scoped>
.text-active {
  color: #3974af !important;
}

.cta-button {
  display: inline-block;
  background: #fff;
  color: black;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  text-decoration: none;
  font-size: 1rem;
  transition: opacity 0.3s ease;
  user-select: none;
}

.cta-button:hover {
  opacity: 0.9;
}

@media (max-width: 600px) {
  .cta-button {
    padding: 0.4rem 1rem !important;
  }
}
</style>
