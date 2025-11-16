import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderStyle } from 'vue/server-renderer';
import { p as publicAssetsURL } from '../_/nitro.mjs';
import { _ as _export_sfc, e as useI18n } from './server.mjs';
import { a as useSeo } from './index-BKshJpnN.mjs';
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

const _imports_0 = publicAssetsURL("/images/qr-payment.png");
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "pricing",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    useSeo({
      title: t("\u0110\u0103ng k\xED g\xF3i d\u1ECBch v\u1EE5"),
      description: "N\u1EC1n t\u1EA3ng AI gi\xFAp b\u1EA1n t\u1EA1o video chuy\xEAn nghi\u1EC7p ch\u1EC9 trong v\xE0i ph\xFAt",
      image: "/images/page-video.png"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-xl mx-auto" }, _attrs))} data-v-3bb2e85a><h1 class="text-2xl font-bold text-center text-gray-800 mb-6" data-v-3bb2e85a> Thanh To\xE1n G\xF3i D\u1ECBch V\u1EE5 </h1><div class="text-center" data-v-3bb2e85a><img${ssrRenderAttr("src", _imports_0)} alt="qr-thanh-toan" style="${ssrRenderStyle({ "height": "40rem" })}" data-v-3bb2e85a></div><div class="mt-8 p-4 bg-green-50 border-l-4 border-green-500 text-green-800 rounded-md shadow-inner" data-v-3bb2e85a><p class="font-bold mb-1" data-v-3bb2e85a>\u23F0 L\u01B0u \xFD quan tr\u1ECDng:</p><ul class="list-disc ml-5 space-y-1 text-sm" data-v-3bb2e85a><li data-v-3bb2e85a> Vui l\xF2ng **nh\u1EADp email t\xE0i kho\u1EA3n** c\u1EE7a b\u1EA1n v\xE0o n\u1ED9i dung chuy\u1EC3n kho\u1EA3n \u0111\u1EC3 ch\xFAng t\xF4i c\xF3 th\u1EC3 **thi\u1EBFt l\u1EADp v\xE0 k\xEDch ho\u1EA1t** d\u1ECBch v\u1EE5. </li><li data-v-3bb2e85a> G\xF3i d\u1ECBch v\u1EE5 c\u1EE7a b\u1EA1n s\u1EBD \u0111\u01B0\u1EE3c **k\xEDch ho\u1EA1t t\u1EF1 \u0111\u1ED9ng** sau **5-10 ph\xFAt** k\u1EC3 t\u1EEB khi giao d\u1ECBch th\xE0nh c\xF4ng. </li><li data-v-3bb2e85a> N\u1EBFu sau 10 ph\xFAt g\xF3i ch\u01B0a \u0111\u01B0\u1EE3c k\xEDch ho\u1EA1t, vui l\xF2ng li\xEAn h\u1EC7 Zalo h\u1ED7 tr\u1EE3: <a${ssrRenderAttr("href", `https://zalo.me/0343027232`)} target="_blank" class="font-extrabold text-green-700 hover:underline" data-v-3bb2e85a> 034 302 7232 </a> \u0111\u1EC3 \u0111\u01B0\u1EE3c h\u1ED7 tr\u1EE3 nhanh nh\u1EA5t. </li></ul></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pricing.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const pricing = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3bb2e85a"]]);

export { pricing as default };
//# sourceMappingURL=pricing-Cpf0ML7D.mjs.map
