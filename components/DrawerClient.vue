<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();

const { t } = useI18n();
const { isMobile } = useDevice();

const display = ref(false);
const open = ref<string[]>([]);

const menus = computed<any>(() => [
  { title: "TRANG CHỦ", route: "/" },
  { title: "DỊCH VỤ", icon: "", route: "/service" },
  { title: "KHÓA HỌC", icon: "", route: "/courses" },
  { title: "LIÊN HỆ", route: "/contact" },
]);

const onDisplay = (value: boolean) => {
  display.value = value;
};

const onSelectMenuItem = (event: any) => {
  const route = event.id;

  if (route !== "/") {
    useAppStore().onActionSetSystemPopup({
      type: "info",
      content: "Tính năng đang được phát triển!",
    });

    return;
  }
  if (route) router.push(localePath(route));
};

onMounted(() => {
  for (const menu of menus.value) {
    if (menu.children) {
      const match = menu.children.find(
        (child: any) => localePath(child.route) === route.path
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
    width="300"
    :temporary="true"
    style="z-index: 9999"
  >
    <template v-slot:prepend>
      <div class="d-flex align-center justify-space-between">
        <div
          class="d-flex align-center pl-3 ga-2 font-bold text-primary"
          style="height: 60px; font-size: 1.3rem"
        >
          <v-icon>mdi-flower-outline</v-icon>
          TN SOLVE
        </div>

        <div class="mr-3">
          <v-btn size="44" variant="tonal" icon @click="display = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </div>

      <v-divider />
    </template>

    <v-list
      nav
      v-model:opened="open"
      open-strategy="single"
      @click:select="onSelectMenuItem"
    >
      <template v-for="(menu, index) in menus" :key="index">
        <v-list-group v-if="menu?.children" :value="menu.route">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :prepend-icon="menu.icon">
              <template #default>
                <span>{{ menu.title }}</span>
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
              <span>{{ i.title }}</span>
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
  </v-navigation-drawer>

  <v-overlay v-if="isMobile" v-model="display" />
</template>
