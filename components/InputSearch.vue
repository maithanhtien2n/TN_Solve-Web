<script setup lang="ts">
import { ref } from 'vue'

const keywords = ref('')

defineProps({
  placeholder: { type: String, default: 'Bạn muốn website như thế nào?' },
  maxWidth: { type: String, default: '30rem' },
})

const emits = defineEmits(['search'])

const onSearch = () => {
  emits('search', keywords.value)
}

defineExpose({ keywords })
</script>

<template>
  <div
    class="d-flex align-center pr-1 pl-5"
    style="background-color: #f0f2f5; border-radius: 3rem; overflow: hidden"
    :style="{ maxWidth }"
  >
    <input
      v-model="keywords"
      :placeholder="$t(placeholder)"
      class="flex-1 py-3"
      style="outline: none"
      @keypress.enter="onSearch"
    />

    <v-btn icon variant="text" size="40" @click="onSearch">
      <v-icon color="cursor-pointer">mdi-magnify</v-icon>
    </v-btn>
  </div>
</template>
