<script setup lang="ts">
import { appService } from "~/services/app";

const { t } = useI18n();

const { onGetterUserData, onActionGetUserData } = useAppStore();

const loading = ref<boolean>(false);
const existsAccount = ref<boolean>(false);

const userData = computed(() => onGetterUserData.value || {});

const client = computed<boolean>(() => {
  const win = window as any;
  return !!(win?.electronAPI && win?.electronAPI?.isElectron);
});

const formData = reactive<any>({
  useMyAccount: userData.value.settings?.useMyAccount || false,
  safeMode: userData.value.settings?.safeMode || false,
  flowCookies: userData.value.settings?.flowCookies || "",
  geminiCookies: userData.value.settings?.geminiCookies || "",
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

const disabledAction = ref<boolean>(false);
const onClickLoginAccount = async () => {
  if (client.value && (window as any)?.electronAPI) {
    try {
      disabledAction.value = true;
      await (window as any)?.electronAPI?.loginAccount({
        accountId: userData.value._id,
      });
      const existsAcc = await (window as any).electronAPI?.getAccount();
      existsAccount.value = existsAcc;
    } catch (error) {
      console.error("Lỗi lấy version:", error);
    } finally {
      disabledAction.value = false;
    }
  }
};

const onClickDeleteAccount = async () => {
  if (client.value && (window as any)?.electronAPI) {
    try {
      disabledAction.value = true;
      await (window as any).electronAPI?.closeAccount();
      await (window as any)?.electronAPI?.deleteAccount({
        accountId: userData.value._id,
      });
      const existsAcc = await (window as any).electronAPI?.getAccount();
      existsAccount.value = existsAcc;
    } catch (error) {
      console.error("Lỗi lấy version:", error);
    } finally {
      disabledAction.value = false;
    }
  }
};

watch(userData, (newValue) => {
  formData.useMyAccount = newValue.settings?.useMyAccount || false;
  formData.safeMode = newValue.settings?.safeMode || false;
  formData.flowCookies = newValue.settings?.flowCookies || "";
  formData.geminiCookies = newValue.settings?.geminiCookies || "";
  formData.isCreateSpeed = newValue.settings?.isCreateSpeed || false;
});

onMounted(async () => {
  try {
    const existsAcc = await (window as any).electronAPI?.getAccount();
    existsAccount.value = existsAcc;
  } catch (error) {
    console.error("Lỗi lấy version:", error);
  }
});

onUnmounted(() => {
  (window as any).electronAPI?.closeAccount();
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

    <!-- <v-col cols="12">
      <div>
        <v-checkbox
          v-model="formData.safeMode"
          hide-details
          :label="$t('Chế độ tạo video an toàn')"
          style="margin-left: -10px; margin-top: -1rem; margin-bottom: -10px"
        />
      </div>
    </v-col> -->

    <v-col v-if="client" cols="12">
      <div>
        <h3>{{ $t("Tài khoản veo3 cá nhân") }}</h3>
        <span class="text-caption">
          {{
            $t(
              "Sử dụng tài khoản veo3 của bạn để tạo video, giúp tăng tốc độ tạo video và tránh giới hạn từ tài khoản dùng chung."
            )
          }}
        </span>

        <div
          v-if="existsAccount"
          class="mt-3 d-flex align-center"
          :class="{ disabled: disabledAction }"
        >
          <span class="text-red cursor-pointer" @click="onClickDeleteAccount">
            {{ $t("Xóa tài khoản Veo3") }}
          </span>
        </div>

        <div v-else class="mt-3" :class="{ disabled: disabledAction }">
          <span class="text-blue cursor-pointer" @click="onClickLoginAccount">
            {{ $t("Đăng nhập tài khoản Veo3") }}
          </span>
        </div>
      </div>
    </v-col>

    <!-- <v-col
      cols="12"
      :class="{ disabled: Boolean(formData.useMyAccount || formData.safeMode) }"
    >
      <v-text-field
        v-model="formData.flowCookies"
        hide-details
        class="w-100 mb-2"
        variant="outlined"
        :label="$t('Flow cookies (dùng tài khoản riêng)')"
        :readonly="Boolean(formData.useMyAccount || formData.safeMode)"
      />

      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://youtu.be/p-SmfiBTorU?si=zHwUfNkVTAzrdbZM"
      >
        {{ $t("Cách lấy Flow cookies") }}
        <v-icon class="text-error ml-1">mdi-youtube</v-icon>
      </a>
      <div>
        {{
          "Lưu ý: cookies chỉ có thời hạn 1 ngày kể từ lúc sao chép dán vào, nên mọi người nhớ thay thường xuyên để tránh bị lỗi nhé!"
        }}
      </div>
    </v-col> -->

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

    <!-- <v-col cols="12" lg="3" md="4" class="mt-6">
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
    </v-col> -->
  </v-row>
</template>
