<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";

const show = ref(true);
const canvasRef = ref<HTMLCanvasElement | null>(null);

let ctx: CanvasRenderingContext2D | null = null;
let rafId = 0;

let startTime = 0;
const DURATION_MS = 5200;
const FADE_START_MS = 3600;

// ===== Scene objects =====
type Rocket = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetY: number;
  hue: number;
  alive: boolean;
};

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  hue: number;
  size: number;
};

const rockets: Rocket[] = [];
const sparks: Spark[] = [];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

function resizeCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;

  ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function spawnRocket() {
  const x = rand(window.innerWidth * 0.15, window.innerWidth * 0.85);
  const y = window.innerHeight + rand(10, 60);
  const targetY = rand(window.innerHeight * 0.18, window.innerHeight * 0.45);
  const hue = rand(0, 360);

  rockets.push({
    x,
    y,
    vx: rand(-0.35, 0.35),
    vy: rand(-10.5, -8.2),
    targetY,
    hue,
    alive: true,
  });
}

function explode(x: number, y: number, hue: number) {
  const count = Math.floor(rand(90, 140));
  for (let i = 0; i < count; i++) {
    const angle = rand(0, Math.PI * 2);
    const speed = rand(1.2, 5.4);

    sparks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: rand(55, 95),
      hue: hue + rand(-18, 18),
      size: rand(1.1, 2.4),
    });
  }

  // sparkle nhỏ
  const sparkleCount = Math.floor(rand(20, 35));
  for (let i = 0; i < sparkleCount; i++) {
    const angle = rand(0, Math.PI * 2);
    const speed = rand(0.6, 2.2);
    sparks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: rand(35, 55),
      hue: hue + rand(-10, 10),
      size: rand(0.8, 1.5),
    });
  }
}

function drawBackdrop(alpha: number) {
  if (!ctx) return;

  ctx.globalAlpha = 1 * alpha;
  const g = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
  g.addColorStop(0, "rgba(6, 12, 28, 0.92)");
  g.addColorStop(1, "rgba(2, 6, 16, 0.92)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  // bloom nhẹ ở giữa để chữ nổi (premium)
  ctx.globalAlpha = 0.18 * alpha;
  const r = ctx.createRadialGradient(
    window.innerWidth * 0.5,
    window.innerHeight * 0.42,
    10,
    window.innerWidth * 0.5,
    window.innerHeight * 0.42,
    Math.min(window.innerWidth, window.innerHeight) * 0.7
  );
  r.addColorStop(0, "rgba(59, 130, 246, 0.14)"); // xanh brand nhẹ
  r.addColorStop(0.45, "rgba(245, 158, 11, 0.10)"); // vàng Tết rất nhẹ
  r.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = r;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  ctx.globalAlpha = 1;
}

function tick(now: number) {
  const canvas = canvasRef.value;
  if (!canvas || !ctx) return;

  if (!startTime) startTime = now;
  const elapsed = now - startTime;

  let a = 1;
  if (elapsed >= FADE_START_MS) {
    const t = (elapsed - FADE_START_MS) / (DURATION_MS - FADE_START_MS);
    a = clamp(1 - t, 0, 1);
  }

  // Nền + trail mềm
  drawBackdrop(a);

  // spawn rocket
  if (elapsed < 2600) {
    if (Math.random() < 0.16) spawnRocket();
  }

  // Rockets
  for (let i = rockets.length - 1; i >= 0; i--) {
    const r = rockets[i];
    if (!r.alive) {
      rockets.splice(i, 1);
      continue;
    }

    // trail rocket
    ctx.globalAlpha = 0.9 * a;
    ctx.beginPath();
    ctx.strokeStyle = `hsla(${r.hue}, 95%, 65%, ${0.8 * a})`;
    ctx.lineWidth = 2;
    ctx.moveTo(r.x, r.y);
    ctx.lineTo(r.x - r.vx * 3, r.y - r.vy * 3);
    ctx.stroke();

    // update
    r.x += r.vx;
    r.y += r.vy;
    r.vy += 0.12;
    r.vx *= 0.995;

    // head
    ctx.globalAlpha = 1 * a;
    ctx.beginPath();
    ctx.fillStyle = `hsl(${r.hue}, 95%, 65%)`;
    ctx.arc(r.x, r.y, 2.3, 0, Math.PI * 2);
    ctx.fill();

    if (r.y <= r.targetY || r.vy > -2.2) {
      r.alive = false;
      explode(r.x, r.y, r.hue);
    }
  }

  // Sparks
  for (let i = sparks.length - 1; i >= 0; i--) {
    const p = sparks[i];
    p.life += 1;

    p.vy += 0.04;
    p.vx *= 0.985;
    p.vy *= 0.985;
    p.x += p.vx;
    p.y += p.vy;

    const t = p.life / p.maxLife;
    const lifeA = clamp(1 - t, 0, 1);

    // trail
    ctx.globalAlpha = lifeA * 0.75 * a;
    ctx.strokeStyle = `hsla(${p.hue}, 95%, 65%, ${lifeA * a})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x - p.vx * 2.2, p.y - p.vy * 2.2);
    ctx.stroke();

    // core
    ctx.globalAlpha = lifeA * a;
    ctx.fillStyle = `hsla(${p.hue}, 95%, 70%, ${lifeA * a})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    if (p.life >= p.maxLife) sparks.splice(i, 1);
  }

  ctx.globalAlpha = 1;

  if (elapsed >= DURATION_MS) {
    show.value = false;
    cancelAnimationFrame(rafId);
    return;
  }

  rafId = requestAnimationFrame(tick);
}

onMounted(() => {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  rafId = requestAnimationFrame(tick);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeCanvas);
  cancelAnimationFrame(rafId);
});
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="tet-intro" aria-hidden="true">
      <canvas ref="canvasRef" class="tet-canvas"></canvas>

      <!-- Text: premium cinematic (không hộp popup) -->
      <div class="tet-text">
        <div class="tet-title">
          Chúc mừng năm mới<br />
          <span class="tet-year">2026</span>
        </div>

        <div class="tet-sub">
          TN Solve kính chúc bạn một năm sáng tạo bứt phá, video bùng nổ và
          thành công vượt mong đợi.
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.tet-intro {
  position: fixed;
  inset: 0;
  z-index: 99999;
  pointer-events: none;

  /* fade toàn màn */
  animation: tet-fade-out 5.2s ease forwards;
}

.tet-canvas {
  position: absolute;
  inset: 0;
}

/* ===== TEXT PREMIUM ===== */
.tet-text {
  position: absolute;
  left: 50%;
  top: 46%;
  transform: translate(-50%, -50%);
  text-align: center;
  padding: 0;
  background: transparent;
  border: none;
  box-shadow: none;
  backdrop-filter: none;

  animation: tet-text-pop 5.2s ease forwards;
}

.tet-title {
  font-size: 46px;
  font-weight: 720;
  letter-spacing: 1.2px;
  line-height: 1.02;

  /* vàng premium */
  background: linear-gradient(180deg, #fff7d6, #fbbf24);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  text-shadow: 0 0 18px rgba(251, 191, 36, 0.35),
    0 0 70px rgba(251, 191, 36, 0.18);
}

.tet-year {
  display: inline-block;
  margin-top: 6px;
  font-size: 0.86em;
  letter-spacing: 4px;
}

.tet-sub {
  margin-top: 18px;
  font-size: 15px;
  font-weight: 520;
  letter-spacing: 0.35px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.86);

  max-width: 620px;
  margin-left: auto;
  margin-right: auto;
}

/* Mobile */
@media (max-width: 600px) {
  .tet-title {
    font-size: 28px;
    letter-spacing: 0.8px;
  }
  .tet-year {
    letter-spacing: 2.6px;
  }
  .tet-sub {
    font-size: 12px;
    max-width: 340px;
    margin-top: 14px;
  }
}

/* Pop in nhẹ + fade out */
@keyframes tet-text-pop {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) translateY(6px);
  }
  12% {
    opacity: 1;
    transform: translate(-50%, -50%) translateY(0);
  }
  72% {
    opacity: 1;
    transform: translate(-50%, -50%) translateY(0);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) translateY(6px);
  }
}

@keyframes tet-fade-out {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  74% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
