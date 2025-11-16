import la from "../i18n/language/lo";
import { vi, en } from "vuetify/locale";

import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";

import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    icons: {
      defaultSet: "mdi",
      aliases,
      sets: { mdi },
    },
    theme: {
      defaultTheme: "light",
      themes: {
        light: {
          dark: false,
          colors: {
            primary: "#0984E3",
          },
        },
      },
    },
    locale: {
      locale: "vi",
      fallback: "en",
      messages: { en, vi, la },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
