import { defineComponent, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { A as AppSystem } from './AppSystem-DsQOCQqL.mjs';
import { e as useI18n } from './server.mjs';
import { a as useSeo } from './index-BKshJpnN.mjs';
import './PopupMessage-CHknC3mG.mjs';
import './app.store-CsbFmGtW.mjs';
import 'pinia';
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
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import 'node:path';
import 'node:crypto';
import './enum-kAdbNx_J.mjs';
import './master-data-ZBucjABo.mjs';
import 'vue-router';
import '@vueuse/core';
import './v3-CpJW8Kui.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "partner",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    useSeo({
      title: t("C\u1ED9ng t\xE1c vi\xEAn"),
      description: "N\u1EC1n t\u1EA3ng AI gi\xFAp b\u1EA1n t\u1EA1o video chuy\xEAn nghi\u1EC7p ch\u1EC9 trong v\xE0i ph\xFAt",
      image: "/images/page-home.png"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AppSystem, _attrs, null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/partner.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=partner-Clrw0Pi3.mjs.map
