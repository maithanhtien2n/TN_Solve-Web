import { useWindowSize, useLocalStorage } from "@vueuse/core";

export const referralId = useLocalStorage<string>("referralId", "");

export function useDevice() {
  const width = ref(0);
  const height = ref(0);

  const isMobile = computed(() => width.value < 930);

  onMounted(() => {
    const size = useWindowSize();
    width.value = size.width.value;
    height.value = size.height.value;

    watch(size.width, (val) => (width.value = val));
    watch(size.height, (val) => (height.value = val));
  });

  return { width, height, isMobile };
}

export function loginGoogle(): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = (window as any).google.accounts.oauth2.initTokenClient({
      client_id:
        "681037770554-al2b5mj25ch8amdjpirl6gti75sqc3kd.apps.googleusercontent.com",
      scope: "openid profile email",
      callback: (tokenResponse: any) => {
        if (tokenResponse?.access_token) {
          resolve(tokenResponse.access_token);
        } else {
          reject(new Error("Failed to retrieve access token"));
        }
      },
      error_callback: (error: any) => {
        reject(error);
      },
    });

    client.requestAccessToken({ prompt: "select_account" });
  });
}

export function useSeo({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image?: string;
}) {
  const config = useRuntimeConfig();
  const siteUrl = config.public.siteUrl;

  // 👇 Lấy path hiện tại từ Nuxt
  const route = useRoute();
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
      { name: "twitter:image", content: image || `${siteUrl}/default-og.jpg` },
    ],
    link: [{ rel: "canonical", href: url }],
  });
}
