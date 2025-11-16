import { defineComponent, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { A as AccountTable } from './AccountTable-DpxC4uMn.mjs';
import './CommonDialog-CSwcOS1W.mjs';
import './index-BKshJpnN.mjs';
import '@vueuse/core';
import './server.mjs';
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
import './v3-CpJW8Kui.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import './DataTable-Cfx4fCxn.mjs';
import './ConfirmDialog-Df9nJcuZ.mjs';
import './app.store-CsbFmGtW.mjs';
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
import './enum-kAdbNx_J.mjs';
import './account-Cwp5COvj.mjs';
import './master-data-ZBucjABo.mjs';
import './constants-B3HUeYES.mjs';
import './helper-QcO-vDIR.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "customer",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AccountTable, _attrs, null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/accounts/customer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=customer-BsmBoSVG.mjs.map
