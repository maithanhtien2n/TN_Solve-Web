<script setup lang="ts">
const { locale } = useI18n();

const languageMenu = [
  { name: "Lào", code: "la", flag: "https://flagcdn.com/w40/la.png" },
  { name: "Việt Nam", code: "vi", flag: "https://flagcdn.com/w40/vn.png" },
];

const langCurrent = languageMenu.find((x: any) => x.code == locale.value);
const selectedLanguage = ref(langCurrent?.flag);

const onSelectedLanguage = (event: any) => {
  selectedLanguage.value = event.flag;
  locale.value = event.code;

  if (locale.value === "lo") document.body.classList.add("lang-la");
  else document.body.classList.remove("lang-la");
};

onMounted(() => {
  if (locale.value === "lo") document.body.classList.add("lang-la");
  else document.body.classList.remove("lang-la");
});
</script>

<template>
  <div class="flex-1 d-flex justify-end">
    <v-menu class="pa-0">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          variant="text"
          style="width: 0px !important ; padding: 0px !important"
        >
          <v-img
            width="25"
            :src="selectedLanguage"
            :lazy-src="selectedLanguage"
          />
          <v-icon>mdi-menu-down</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in languageMenu"
          :key="index"
          @click="onSelectedLanguage(item)"
        >
          <v-img :src="item.flag" :lazy-src="item.flag" />
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<style scoped>
:deep(.v-list-item--density-default.v-list-item--one-line) {
  min-height: 2.3rem !important;
}
</style>
