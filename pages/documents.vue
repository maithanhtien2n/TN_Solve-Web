<script setup lang="ts">
const { t } = useI18n();

const { onGetterUserData: userData } = useAppStore();

const registered = computed(() => Boolean(userData.value?.serviceExpiry));

const documents = [
  {
    title: "Xây dựng prompt làm phim",
    value:
      "https://gemini.google.com/gem/1N5gq8noXc4PoHYznA4vSmItVqGbn_hPQ?usp=sharing",
  },
  {
    title: "Xây dựng video nhân hóa nhân vật về sức khỏe (💎)",
    value:
      "https://gemini.google.com/gem/1-IBDvyXN9FZpRF9eBy9w1GePlMbnVuGS?usp=sharing",
    required: true,
  },
];

const onClickDocument = (item: any) => {
  if (
    userData.value?.role !== EnumAccountRole.ADMIN &&
    item.required &&
    !registered.value
  ) {
    useAppStore().onActionSetSystemPopup({
      type: "info",
      content: "Vui lòng đăng ký dịch vụ để sử dụng trợ lý!",
    });
  } else {
    window.open(item.value, "_blank");
  }
};

useSeo({
  title: t("Tài liệu"),
  description:
    "Nền tảng AI giúp bạn tạo video chuyên nghiệp chỉ trong vài phút",
  image: "/images/page-home.png",
});

definePageMeta({ middleware: "auth" });
</script>

<template>
  <div>
    <h2 class="font-bold">{{ $t("Chatbot trợ lý tạo video") }}</h2>

    <div class="mt-4 d-flex flex-column ga-2">
      <template v-for="(item, index) in documents" :key="index">
        <span
          class="text-blue cursor-pointer"
          style="text-decoration: underline"
          @click="onClickDocument(item)"
        >
          {{ item.title }}
        </span>
      </template>
    </div>
  </div>
</template>
