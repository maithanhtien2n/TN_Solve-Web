import { useWindowSize, useLocalStorage } from "@vueuse/core";

export const referralId = useLocalStorage<string>("referralId", "");

export const GOOGLE_CLIENT_ID =
  "396019793466-q7fs9crp5bop6ui642elijh8hpf8f7ck.apps.googleusercontent.com";
export const GOOGLE_REDIRECT_URI =
  import.meta.env.VITE_API_URL === "http://localhost:3000"
    ? "http://localhost:5173"
    : "https://tnsolve.com";

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

  // Xây dựng URL chuẩn
  const googleAuthUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${GOOGLE_REDIRECT_URI}` +
    `&response_type=${response_type}` +
    `&scope=${scope}` +
    `&access_type=${access_type}` +
    `&prompt=${prompt}` +
    `&state=${encodedState}`;

  // 1. Kiểm tra User Agent để xem có phải Webview không
  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera;

  // Regex kiểm tra các Webview phổ biến (Facebook, Zalo, Instagram, Android Webview gốc)
  const isWebView = /wv|Android.*Version\/|Instagram|FBAN|FBAV|Zalo|Line/i.test(
    userAgent
  );
  const isAndroid = /Android/i.test(userAgent);

  // 2. Xử lý logic chuyển hướng
  if (isWebView && isAndroid) {
    // Kỹ thuật dùng Intent để buộc Android mở Chrome
    // Cấu trúc: intent://<url_bỏ_https>#Intent;scheme=https;package=com.android.chrome;end;
    const urlWithoutProtocol = googleAuthUrl.replace("https://", "");
    const intentUrl = `intent://${urlWithoutProtocol}#Intent;scheme=https;package=com.android.chrome;end`;

    window.location.href = intentUrl;
  } else {
    // Các trường hợp còn lại (PC, iOS, hoặc trình duyệt mobile thường)
    // Lưu ý: iOS Webview không cho phép force mở Safari bằng code,
    // bạn nên hiển thị popup hướng dẫn user bấm "Open in Browser" nếu ở trên iOS.
    window.location.href = googleAuthUrl;
  }
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
