<script setup lang="ts">
defineProps<{
  num?: string | number;
  title: string;
  icon?: string;
}>();
</script>

<template>
  <div class="ps">
    <div class="ps-header">
      <div v-if="num" class="ps-num">{{ num }}</div>
      <v-icon v-else-if="icon" size="18" color="#1565c0">{{ icon }}</v-icon>
      <h2 class="ps-title">{{ title }}</h2>
    </div>
    <div class="ps-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.ps {
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e8eef6;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.ps-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: #f8faff;
  border-bottom: 1px solid #e8eef6;
}

.ps-num {
  width: 26px; height: 26px;
  border-radius: 8px;
  background: #1565c0;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ps-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.ps-body {
  padding: 16px 20px;
  font-size: 0.88rem;
  color: #475569;
  line-height: 1.75;
}

.ps-body :deep(p) { margin: 0 0 8px; }
.ps-body :deep(p:last-child) { margin-bottom: 0; }
.ps-body :deep(ul) { padding-left: 18px; margin: 4px 0 0; }
.ps-body :deep(li) { margin-bottom: 5px; }
.ps-body :deep(a) { color: #1e88e5; text-decoration: none; }
.ps-body :deep(a:hover) { text-decoration: underline; }
.ps-body :deep(strong) { color: #1e293b; }
</style>
