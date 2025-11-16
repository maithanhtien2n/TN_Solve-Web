<template>
  <h1 class="intro-title">
    <slot />
  </h1>

  <div class="intro-divider"></div>
</template>

<style scoped>
.intro-title {
  font-size: 2rem;
  line-height: 1.2;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.7rem;
  animation: fadeInDown 1s ease;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.intro-divider {
  width: 80px;
  height: 5px;
  background: #0984e3;
  margin: 2rem auto;
  margin-top: 0rem;
  border-radius: 2px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .intro-title {
    font-size: 1.5rem;
  }
}
</style>
