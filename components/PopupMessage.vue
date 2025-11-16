<script setup lang="ts">
import { useAppStore } from "@/stores/app.store";

const { onGetterSystemPopup: systemPopup } = useAppStore();
</script>

<template>
  <v-dialog
    v-model="systemPopup.display"
    width="auto"
    style="z-index: 99999999999999999"
  >
    <v-card title="">
      <template #item>
        <div class="d-flex flex-column align-center mb-2">
          <i
            v-if="systemPopup.type == 'success'"
            class="mdi mdi-check-circle-outline"
            style="font-size: 2rem; color: #10b981"
          />

          <i
            v-else-if="systemPopup.type == 'error' || !systemPopup.type"
            class="mdi mdi-close-circle-outline"
            style="font-size: 2rem; color: #ef4444"
          />

          <i
            v-else-if="systemPopup.type == 'info'"
            class="mdi mdi-alert-circle-outline"
            style="font-size: 2rem; color: #3b82f6"
          />

          <i
            v-else-if="systemPopup.type == 'warning'"
            class="mdi mdi-alert-outline"
            style="font-size: 2rem; color: #f59e0b"
          />

          <span
            v-if="systemPopup?.content"
            v-html="$t(systemPopup?.content)"
            class="text-center"
            style="white-space: pre-line"
          />
        </div>
      </template>

      <template #actions>
        <v-btn
          text="OK"
          class="w-100"
          variant="tonal"
          @click="systemPopup.display = false"
        />
      </template>
    </v-card>
  </v-dialog>
</template>

<style scoped>
:deep(.v-card-item) {
  padding-bottom: 10px !important;
}

:deep(.v-card) {
  min-width: 23rem;
  max-width: 23rem;
}

/* Responsive */
@media only screen and (max-width: 500px) {
  :deep(.v-card) {
    min-width: 20rem !important;
    max-width: auto !important;
  }
}
</style>
