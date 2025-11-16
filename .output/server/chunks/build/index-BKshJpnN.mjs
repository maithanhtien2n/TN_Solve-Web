import { useLocalStorage } from '@vueuse/core';
import { ref, computed } from 'vue';
import { b as useRuntimeConfig, g as useRoute$1 } from './server.mjs';
import { u as useHead } from './v3-CpJW8Kui.mjs';

const referralId = useLocalStorage("referralId", "");
function useDevice() {
  const width = ref(0);
  const height = ref(0);
  const isMobile = computed(() => width.value < 930);
  return { width, height, isMobile };
}
function loginGoogle() {
  return new Promise((resolve, reject) => {
    const client = (void 0).google.accounts.oauth2.initTokenClient({
      client_id: "681037770554-al2b5mj25ch8amdjpirl6gti75sqc3kd.apps.googleusercontent.com",
      scope: "openid profile email",
      callback: (tokenResponse) => {
        if (tokenResponse == null ? void 0 : tokenResponse.access_token) {
          resolve(tokenResponse.access_token);
        } else {
          reject(new Error("Failed to retrieve access token"));
        }
      },
      error_callback: (error) => {
        reject(error);
      }
    });
    client.requestAccessToken({ prompt: "select_account" });
  });
}
function useSeo({
  title,
  description,
  image
}) {
  const config = useRuntimeConfig();
  const siteUrl = config.public.siteUrl;
  const route = useRoute$1();
  const url = siteUrl + route.fullPath;
  useHead({
    title,
    meta: [
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: image || `${siteUrl}/default-og.jpg` },
      // optional: Twitter Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image || `${siteUrl}/default-og.jpg` }
    ],
    link: [{ rel: "canonical", href: url }]
  });
}

export { useSeo as a, loginGoogle as l, referralId as r, useDevice as u };
//# sourceMappingURL=index-BKshJpnN.mjs.map
