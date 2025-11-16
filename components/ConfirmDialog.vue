<script setup lang="ts">
const emits = defineEmits<{
  (e: "onNo"): void;
  (e: "onYes", data: any): void;
}>();

// Internationalization
const { t } = useI18n();

// Default configuration
const defaultConfig = {
  display: false,
  title: "Xác nhận",
  message: "Chưa có nội dung",
  noTitle: "Bỏ qua",
  yesTitle: "Đồng ý",
  data: null as any,
  noTransMsg: false,
  onConfirm: null as (() => Promise<void>) | null,
};

const loading = ref(false);

// Reactive confirm configuration
const confirmConfig = reactive({ ...defaultConfig });

// Exposed methods
function show(config: Partial<typeof defaultConfig>) {
  Object.assign(confirmConfig, defaultConfig, config, { display: true });
}

function hide() {
  confirmConfig.display = false;
}

async function onClickYes() {
  if (confirmConfig.onConfirm) {
    try {
      loading.value = true;
      await confirmConfig.onConfirm();
      emits("onYes", confirmConfig.data);
    } finally {
      loading.value = false;
      hide();
    }
  } else {
    emits("onYes", confirmConfig.data);
    hide();
  }
}

function onClickNo() {
  emits("onNo");
  hide();
}

// Expose to parent
defineExpose({ show, hide });

export type ConfirmConfig = typeof defaultConfig;
</script>

<template>
  <v-dialog
    v-model="confirmConfig.display"
    max-width="400"
    :persistent="Boolean(loading)"
    style="z-index: 99999999999999999"
  >
    <v-card class="pa-4 pt-2 rounded-lg">
      <div class="d-flex flex-column ga-4">
        <!-- Title -->
        <slot name="title" :config="confirmConfig">
          <h2 class="font-bold" style="font-size: 1.3rem">
            {{ t(confirmConfig.title) }}
          </h2>
        </slot>

        <!-- Message -->
        <slot name="content" :config="confirmConfig">
          <div
            v-if="confirmConfig.noTransMsg"
            class="whitespace-pre-line"
            v-html="confirmConfig.message"
          />
          <div v-else class="whitespace-pre-line">
            {{ t(confirmConfig.message) }}
          </div>
        </slot>

        <!-- Actions -->
        <div class="d-flex ga-3 mt-3">
          <!-- No Button -->
          <v-btn
            size="large"
            class="flex-1"
            variant="tonal"
            :disabled="Boolean(loading)"
            @click="onClickNo"
          >
            {{ t(confirmConfig.noTitle) }}
          </v-btn>

          <!-- Yes Button -->
          <slot name="btnYes" :config="confirmConfig">
            <v-btn
              size="large"
              variant="flat"
              class="flex-1"
              color="primary"
              :loading="loading"
              @click="onClickYes"
            >
              {{ t(confirmConfig.yesTitle) }}
            </v-btn>
          </slot>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.v-dialog .v-card {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
</style>
