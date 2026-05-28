<script setup lang="ts">
defineProps<{
  title: string;
  updated?: string;
  icon?: string;
  color?: string;
}>();
</script>

<template>
  <div class="pol">
    <!-- Hero -->
    <div class="pol-hero" :style="{ '--c': color || '#1565c0' }">
      <div class="pol-hero__orb" />
      <div class="pol-hero__orb2" />
      <div class="pol-hero__inner">
        <div class="pol-hero__icon">
          <v-icon size="28" color="#fff">{{ icon || 'mdi-file-document-outline' }}</v-icon>
        </div>
        <div>
          <h1 class="pol-hero__title">{{ title }}</h1>
          <p v-if="updated" class="pol-hero__updated">{{ updated }}</p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="pol-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.pol {
  width: 100%;
  padding: 0 0 60px;
}

/* ── Hero ─────────────────────────────────────────────── */
.pol-hero {
  position: relative;
  background: linear-gradient(135deg, color-mix(in srgb, var(--c) 85%, #000), var(--c));
  border-radius: 16px;
  padding: 36px 40px;
  margin-bottom: 32px;
  overflow: hidden;
}

.pol-hero__orb {
  position: absolute;
  width: 240px; height: 240px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%);
  top: -80px; right: -60px;
  pointer-events: none;
}

.pol-hero__orb2 {
  position: absolute;
  width: 140px; height: 140px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%);
  bottom: -40px; left: -30px;
  pointer-events: none;
}

.pol-hero__inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 20px;
}

.pol-hero__icon {
  width: 56px; height: 56px;
  border-radius: 14px;
  background: rgba(255,255,255,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pol-hero__title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 4px;
  letter-spacing: -0.3px;
}

.pol-hero__updated {
  font-size: 0.78rem;
  color: rgba(255,255,255,0.6);
  margin: 0;
}

/* ── Body ─────────────────────────────────────────────── */
.pol-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  padding: 0;
}

@media (max-width: 768px) {
  .pol-body { grid-template-columns: 1fr; }
  .pol-hero { padding: 24px 20px; border-radius: 12px; }
}
</style>
