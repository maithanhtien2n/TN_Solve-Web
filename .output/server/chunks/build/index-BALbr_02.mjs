import { _ as _sfc_main$1 } from './ButtonCreateVideo-Dut5_jms.mjs';
import { defineComponent, resolveComponent, unref, useSSRContext } from 'vue';
import { ssrRenderAttr, ssrRenderStyle, ssrRenderComponent } from 'vue/server-renderer';
import { e as useI18n } from './server.mjs';
import { u as useDevice, a as useSeo } from './index-BKshJpnN.mjs';
import { u as useAppStore } from './app.store-CsbFmGtW.mjs';
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
import '@vueuse/core';
import './v3-CpJW8Kui.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const { width, isMobile } = useDevice();
    const { onGetterUserData: userData } = useAppStore();
    useSeo({
      title: t("Trang ch\u1EE7"),
      description: "N\u1EC1n t\u1EA3ng AI gi\xFAp b\u1EA1n t\u1EA1o video chuy\xEAn nghi\u1EC7p ch\u1EC9 trong v\xE0i ph\xFAt",
      image: "/images/page-home.png"
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      resolveComponent("v-row");
      resolveComponent("v-col");
      const _component_ButtonCreateVideo = _sfc_main$1;
      const _component_v_img = resolveComponent("v-img");
      _push(`<!--[-->`);
      {
        _push(`<!---->`);
      }
      if (!unref(userData) || unref(userData).role !== "admin" && !unref(userData).remainingTime) {
        _push(`<!--[-->`);
        if (unref(locale) === "vi") {
          _push(`<div class="my-10 d-flex flex-column align-center text-center ga-2">`);
          if (unref(isMobile)) {
            _push(`<h3 class="font-bold text-red"> \u{1F4A5} <span class="text-primary text-2xl">GI\xC1 \u01AFU \u0110\xC3I</span> \u2014 Ch\u1EC9 <span class="text-2xl text-primary">99.000\u0111/th\xE1ng</span>! </h3>`);
          } else {
            _push(`<h1 class="font-bold text-red"> \u{1F4A5} <span class="text-primary text-2xl">GI\xC1 \u01AFU \u0110\xC3I</span> \u2014 Ch\u1EC9 <span class="text-2xl text-primary">99.000\u0111/th\xE1ng</span>! </h1>`);
          }
          _push(`<p class="text-gray-600 max-w-md"> Tr\u1EA3i nghi\u1EC7m kh\xF4ng gi\u1EDBi h\u1EA1n to\xE0n b\u1ED9 t\xEDnh n\u0103ng cao c\u1EA5p, c\xF2n ch\u1EA7n ch\u1EDD g\xEC n\u1EEFa! </p><div> \u{1F4CC} \u0110\u0103ng k\xFD tr\u1EF1c ti\u1EBFp <a${ssrRenderAttr("href", "https://tnsolve.com/vi/pricing")} target="_blank" class="text-primary font-semibold hover:underline"> t\u1EA1i \u0111\xE2y </a> ho\u1EB7c li\xEAn h\u1EC7 `);
          if (unref(width) < 560) {
            _push(`<br>`);
          } else {
            _push(`<!---->`);
          }
          _push(` Zalo <a${ssrRenderAttr("href", "https://zalo.me/0343027232")} target="_blank" class="text-primary font-semibold hover:underline" style="${ssrRenderStyle({ "text-wrap": "nowrap" })}"> 034 302 7232 </a> \u0111\u1EC3 \u0111\u01B0\u1EE3c h\u1ED7 tr\u1EE3. </div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_ButtonCreateVideo, { style: { "margin-top": "2rem" } }, null, _parent));
      if ((_a = unref(userData)) == null ? void 0 : _a.serviceExpiry) {
        _push(`<div class="text-center"><div class="d-flex justify-center mt-6">`);
        _push(ssrRenderComponent(_component_v_img, {
          src: "/images/qr-zalo-group.jpg",
          class: "h-20rem"
        }, null, _parent));
        _push(`</div><a target="_blank" href="https://zalo.me/g/tuhmrl934"> B\u1EA5m v\xE0o \u0111\xE2y \u0111\u1EC3 tham gia nh\xF3m Zalo </a></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BALbr_02.mjs.map
