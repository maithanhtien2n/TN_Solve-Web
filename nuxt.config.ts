import { resolve } from "path";

const siteUrl = "https://tnsolve.com";

export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: false },
  compatibilityDate: "2025-09-17",
  runtimeConfig: { public: { siteUrl } },
  modules: [
    "@pinia/nuxt",
    "nuxt-simple-robots",
    "nuxt-simple-sitemap",
  ],
  sitemap: {
    autoLastmod: true,
    exclude: ["/admin/**"],
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
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "author", content: "TN Solve" },
        { name: "robots", content: "index, follow" },
        {
          name: "keywords",
          content:
            "tạo video AI, TN Solve, video AI tự động, Veo, Grok, công cụ tạo video, AI video generator",
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
