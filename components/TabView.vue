<script setup lang="ts">
const props = defineProps<{
  tabs: { title: string; value: string }[];
  defaultIndex?: number;
}>();

const emits = defineEmits<{
  (e: "change", value: string): void;
}>();

const activeIndex = ref(0);

const setActiveTab = (index: number) => {
  activeIndex.value = index;
  emits("change", props.tabs[index].value);
};

onMounted(() => {
  if (
    props.defaultIndex !== undefined &&
    props.defaultIndex >= 0 &&
    props.defaultIndex < props.tabs.length
  ) {
    activeIndex.value = props.defaultIndex;
  }
});
</script>
<template>
  <div class="tabs-modern-container">
    <div class="tabs-modern-header">
      <button
        v-for="(tab, index) in props.tabs"
        :key="index"
        :class="['tab-modern-button', { active: activeIndex === index }]"
        @click="setActiveTab(index)"
      >
        {{ tab.title }}
      </button>
    </div>

    <slot />
  </div>
</template>

<style scoped>
.tabs-modern-header {
  display: flex;
  background-color: #f0f4f8;
  margin-bottom: 1rem;
  border-radius: 6px;
  overflow: hidden;
}

.tab-modern-button {
  flex-grow: 1;
  padding: 12px 18px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: #6b7280;
  transition: all 0.3s ease-in-out;
  text-align: center;
  user-select: none;
}

.tab-modern-button:hover:not(.active) {
  background-color: #e2e8f0;
  color: #374151;
}

.tab-modern-button.active {
  background-color: #0984e3;
  color: #ffffff;
}
</style>
