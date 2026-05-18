<template>
  <div class="app-loading">
    <!-- Animated background orbs -->
    <div class="orb orb-1" />
    <div class="orb orb-2" />
    <div class="orb orb-3" />

    <!-- Grid overlay -->
    <div class="grid-overlay" />

    <!-- Content -->
    <div class="loading-content">
      <div class="logo-wrap">
        <img src="/images/tn-solve-icon.png" alt="TN Solve" class="logo" />
      </div>

      <!-- Dots loader -->
      <div class="dots">
        <span class="dot" />
        <span class="dot" />
        <span class="dot" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-loading {
  position: fixed;
  inset: 0;
  z-index: 999999999999;
  overflow: hidden;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ─── Orbs ─────────────────────────────────────────── */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: rgba(30, 136, 229, 0.1);
  top: -120px;
  right: -80px;
  animation: drift1 8s ease-in-out infinite;
}

.orb-2 {
  width: 380px;
  height: 380px;
  background: rgba(99, 179, 237, 0.08);
  bottom: -100px;
  left: -60px;
  animation: drift2 10s ease-in-out infinite;
}

.orb-3 {
  width: 260px;
  height: 260px;
  background: rgba(21, 101, 192, 0.07);
  top: 40%;
  left: 35%;
  animation: drift3 12s ease-in-out infinite;
}

@keyframes drift1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%       { transform: translate(-40px, 30px) scale(1.08); }
}
@keyframes drift2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%       { transform: translate(30px, -25px) scale(1.06); }
}
@keyframes drift3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%       { transform: translate(-20px, 20px) scale(1.1); }
}

/* ─── Grid ──────────────────────────────────────────── */
.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(30,136,229,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(30,136,229,0.05) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}

/* ─── Content ───────────────────────────────────────── */
.loading-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
}

/* ─── Logo ──────────────────────────────────────────── */
.logo-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 14rem;
  height: auto;
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.1); }
}

/* ─── Dots ──────────────────────────────────────────── */
.dots {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1e88e5;
  animation: bounce 1.2s ease-in-out infinite;
}

.dot:nth-child(1) { animation-delay: 0s;    }
.dot:nth-child(2) { animation-delay: 0.18s; }
.dot:nth-child(3) { animation-delay: 0.36s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0.7); opacity: 0.45; }
  40%           { transform: scale(1.2); opacity: 1;    }
}

/* ─── Mobile ────────────────────────────────────────── */
@media (max-width: 600px) {
  .logo { width: 10rem; }
  .orb-1 { width: 300px; height: 300px; }
  .orb-2 { width: 220px; height: 220px; }
}
</style>
