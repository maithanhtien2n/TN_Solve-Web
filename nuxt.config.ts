import { resolve } from "path";

const siteUrl = "https://tnsolve.com";

export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: false },
  compatibilityDate: "2025-09-17",
  runtimeConfig: { public: { siteUrl } },
  // Site config chuẩn của hệ sinh thái Nuxt SEO (nuxt-site-config) — nuxt-simple-sitemap
  // và nuxt-simple-robots đều dựa vào đây để dựng URL tuyệt đối. Trước đây dự án chỉ có
  // runtimeConfig.public.siteUrl (dùng riêng cho useSeo()), sitemap module không đọc được
  // nên phải tự đoán host từ request -> ra URL sai dạng "http://[:5173/..." khi chạy dev.
  site: {
    url: siteUrl,
    name: "TN Solve",
  },
  modules: [
    "@pinia/nuxt",
    "nuxt-simple-robots",
    "nuxt-simple-sitemap",
  ],
  sitemap: {
    autoLastmod: true,
    exclude: ["/admin/**", "/doanh-thu"],
  },
  robots: {
    disallow: ["/admin"],
    sitemap: ["/sitemap.xml"],
  },

  css: [
    "vuetify/styles",
    "plyr/dist/plyr.css",
    resolve(__dirname, "assets/css/main.css"),
    resolve(__dirname, "assets/css/base.css"),
  ],

  build: {
    transpile: ["vuetify"],
  },

  vite: {
    ssr: {
      noExternal: ["vuetify", "form-data"],
    },
    optimizeDeps: {
      include: ["swiper"],
    },
  },

  app: {
    head: {
      titleTemplate: "%s | TN Solve",
      htmlAttrs: { lang: "vi" },
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          // [2026-08-31] interactive-widget=resizes-content: fix widget chat
          // full màn hình trên mobile bị header/nội dung "trôi" lên khi bàn
          // phím ảo bật — mặc định (không có cờ này) 1 số Chrome Android xử
          // lý bàn phím kiểu "đè lên nội dung" thay vì co lại đúng, khiến
          // 100dvh không co theo bàn phím như mong đợi mà trình duyệt tự
          // cuộn/dịch cả trang lên để lộ ô input, kéo luôn phần header (đang
          // position:fixed) trôi mất khỏi màn hình. Cờ này (Chrome 108+, các
          // trình duyệt cũ hơn tự bỏ qua, không lỗi) ép layout/visual
          // viewport co đúng theo bàn phím -> 100dvh phản ứng đúng.
          content:
            "width=device-width, initial-scale=1, interactive-widget=resizes-content",
        },
        { name: "author", content: "TN Solve" },
        { name: "robots", content: "index, follow" },
        {
          name: "keywords",
          content:
            "tạo video AI, TN Solve, video AI tự động, công cụ tạo video, AI video generator",
        },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "vi_VN" },
        { property: "og:site_name", content: "TN Solve" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      ],
      script: [
        {
          src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5256006208836790",
          async: true,
          crossorigin: "anonymous",
        },
      ],
    },
  },
});
