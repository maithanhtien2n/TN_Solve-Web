<script setup lang="ts">
const { isMobile } = useDevice();

defineProps({
  title: { type: String, default: "Chưa có title" },
  width: { type: String, default: "600" },
});

const emits = defineEmits(["change"]);

const display = ref<boolean>(false);

const onDisplay = (event: boolean) => {
  display.value = event;
};

watch(display, (newValue) => {
  emits("change", newValue);
});

defineExpose({ onDisplay });
</script>

<template>
  <v-dialog
    v-model="display"
    scrollable
    transition="dialog-bottom-transition"
    :width="width"
    :fullscreen="Boolean(isMobile)"
  >
    <v-card>
      <v-toolbar v-if="title" :title="$t(title)" class="py-0 px-0">
        <div class="mr-4">
          <v-btn size="40" variant="tonal" icon @click="display = false">
            <v-icon size="24">mdi-close</v-icon>
          </v-btn>
        </div>
      </v-toolbar>

      <v-card-text class="pa-4 pt-3 mb-2">
        <slot />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
