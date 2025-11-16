import { resolve } from "path";
import { fileURLToPath } from "url";

const siteUrl = "https://tnsolve.com";

export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: false },
  compatibilityDate: "2025-09-17",
  runtimeConfig: { public: { siteUrl } },
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/i18n",
    "nuxt-simple-robots",
    "nuxt-simple-sitemap",
  ],
  sitemap: {
    // xsl: false,
    autoI18n: true,
    autoLastmod: true,
    exclude: ["/admin/**", "/lo/admin/**", "/vi/admin/**", "/en/admin/**"],
  },
  robots: {
    disallow: ["/admin", "/lo/admin", "/vi/admin", "/en/admin"],
    sitemap: ["/sitemap.xml"],
  },

  css: [
    "vuetify/styles",
    "plyr/dist/plyr.css",
    resolve(__dirname, "assets/css/main.css"),
    resolve(__dirname, "assets/css/base.css"),
  ],

  // I18n
  i18n: {
    strategy: "prefix",
    defaultLocale: "vi",
    locales: [
      { code: "vi", name: "VietNam" },
      { code: "lo", name: "Laos" },
      { code: "en", name: "English" },
    ],
    vueI18n: fileURLToPath(new URL("./i18n/index.ts", import.meta.url)),
    bundle: { optimizeTranslationDirective: false },
  },

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
      meta: [
        { name: "charset", content: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "author", content: "TN Solve" },
        { property: "og:type", content: "website" },
      ],
      link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],

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
