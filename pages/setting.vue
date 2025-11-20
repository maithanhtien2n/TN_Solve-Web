<script setup lang="ts">
import { appService } from "~/services/app";

const { t } = useI18n();

const { onGetterUserData, onActionGetUserData } = useAppStore();

const loading = ref<boolean>(false);

const userData = computed(() => onGetterUserData.value || {});

const formData = reactive<any>({
  geminiCookies: userData.value.settings?.geminiCookies || "",
  flowCookies: userData.value.settings?.flowCookies || "",
  isCreateSpeed: userData.value.settings?.isCreateSpeed || false,
});

const onSubmit = async () => {
  loading.value = true;
  await appService
    .saveSetting(formData)
    .then(async () => {
      await onActionGetUserData();
    })
    .finally(() => {
      loading.value = false;
    });
};

watch(userData, (newValue) => {
  formData.geminiCookies = newValue.settings?.geminiCookies || "";
  formData.flowCookies = newValue.settings?.flowCookies || "";
  formData.isCreateSpeed = newValue.settings?.isCreateSpeed || false;
});

useSeo({
  title: t("Cài đặt"),
  description:
    "Nền tảng AI giúp bạn tạo video chuyên nghiệp chỉ trong vài phút",
  image: "/images/page-setting.png",
});

definePageMeta({ middleware: "auth" });
</script>

<template>
  <v-row>
    <!-- <v-col cols="12">
      <v-text-field
        v-model="formData.geminiCookies"
        hide-details
        class="w-100"
        variant="outlined"
        :label="$t('Gemini cookies (dùng tài khoản riêng)')"
        :readonly="Boolean(false)"
      />
    </v-col> -->

    <v-col cols="12">
      <v-text-field
        v-model="formData.flowCookies"
        hide-details
        class="w-100"
        variant="outlined"
        :label="$t('Flow cookies (dùng tài khoản riêng)')"
        :readonly="Boolean(false)"
      />

      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://youtu.be/__iDjAhIPHc?si=5Nlz-1aHRggWlPXf"
      >
        {{ $t("Cách lấy Flow cookies") }}
        <v-icon class="text-error ml-1">mdi-youtube</v-icon>
      </a>
    </v-col>

    <!-- <v-col
      v-if="userData.role === 'admin' || userData?.settings?.flowCookies"
      cols="12"
    >
      <div>
        <v-checkbox
          v-model="formData.isCreateSpeed"
          hide-details
          :label="$t('Tạo video tốc độ cao')"
          style="margin-left: -10px; margin-top: -1rem; margin-bottom: -10px"
        />
        <small>
          {{
            "Lưu ý: nếu tích vào chế độ này có thể gây ra lỗi: ❌ Đang có nhiều người tạo video vào lúc này, vui lòng đợi một chút rồi thử lại!"
          }}
        </small>
      </div>
    </v-col> -->

    <v-col cols="12" lg="3" md="4" class="mt-6">
      <div
        class="cta-button w-100 justify-center"
        style="border-radius: 6px"
        @click="onSubmit"
      >
        <v-progress-circular
          v-if="loading"
          width="2"
          size="23"
          color="white"
          indeterminate
        />

        <v-icon v-else size="27">mdi-content-save-cog</v-icon>

        <h3>{{ $t("Lưu cài đặt") }}</h3>
      </div>
    </v-col>
  </v-row>
</template>
