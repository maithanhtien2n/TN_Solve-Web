<template>
  <div class="app-loading w-100 h-screen d-flex align-center justify-center">
    <img src="/images/tn-solve-icon.png" alt="Loading..." class="logo" />
  </div>
</template>

<style scoped>
.app-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 999999999999;
  background-color: #fff;
}

.logo {
  width: 14rem;
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

@media only screen and (max-width: 600px) {
  .logo {
    width: 10rem !important;
  }
}
</style>
