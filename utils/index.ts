import { useWindowSize, useLocalStorage } from "@vueuse/core";

export const referralId = useLocalStorage<string>("referralId", "");

const GOOGLE_CLIENT_ID =
  "396019793466-q7fs9crp5bop6ui642elijh8hpf8f7ck.apps.googleusercontent.com";
const GOOGLE_REDIRECT_URI =
  import.meta.env.VITE_API_URL === "http://localhost:3000"
    ? "http://localhost:5173"
    : "https://teacher.tnsolve.com";

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
      client_id: GOOGLE_CLIENT_ID,
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

export function redirectToGoogleAuth(path: string) {
  const encodedState = btoa(`${path}`);

  // Các tham số cố định
  const response_type = "code";
  const scope = "openid%20profile%20email";
  const access_type = "offline";
  const prompt = "select_account";

  // Xây dựng URL
  const googleAuthUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${GOOGLE_REDIRECT_URI}` +
    `&response_type=${response_type}` +
    `&scope=${scope}` +
    `&access_type=${access_type}` +
    `&prompt=${prompt}` +
    `&state=${encodedState}`;

  window.location.href = googleAuthUrl;
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
