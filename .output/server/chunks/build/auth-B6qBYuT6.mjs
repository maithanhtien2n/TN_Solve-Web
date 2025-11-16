import { i as defineNuxtRouteMiddleware, a as useNuxtApp, n as navigateTo } from './server.mjs';
import { u as useAppStore } from './app.store-CsbFmGtW.mjs';
import 'vue';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import 'node:path';
import 'node:crypto';
import 'pinia';
import 'vue-router';
import 'vue/server-renderer';
import 'axios';
import 'combined-stream';
import 'util';
import 'path';
import 'http';
import 'https';
import 'url';
import 'fs';
import 'stream';
import 'crypto';
import 'mime-types';
import 'asynckit';
import 'es-set-tostringtag';
import 'hasown';

const auth = defineNuxtRouteMiddleware((to, from) => {
  const appStore = useAppStore();
  const { onGetterDisplayLogin: displayLogin, onGetterUserData: userData } = appStore;
  const nuxtApp = useNuxtApp();
  const localePath = nuxtApp.$localePath;
  const isNotLoggedIn = typeof userData.value === "object" && !Object.values(userData.value || {}).length;
  if (isNotLoggedIn) {
    displayLogin.value = true;
    return navigateTo(localePath(`/?redirect=${to.fullPath}`));
  }
});

export { auth as default };
//# sourceMappingURL=auth-B6qBYuT6.mjs.map
