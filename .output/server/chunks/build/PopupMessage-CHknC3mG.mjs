import { u as useAppStore, b as api } from './app.store-CsbFmGtW.mjs';
import { defineComponent, mergeProps, resolveComponent, unref, withCtx, createVNode, createBlock, createCommentVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrRenderStyle } from 'vue/server-renderer';
import { p as publicAssetsURL } from '../_/nitro.mjs';
import { _ as _export_sfc } from './server.mjs';

const authService = {
  async login(payload) {
    return await api.post("/auth/login", payload);
  },
  async logout() {
    return await api.post("/auth/logout");
  },
  async partnerRegister(payload) {
    return await api.post("/auth/partner-register", payload, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
  async getInfoFromImage(payload, signal) {
    return await api.post("/auth/documents-parse", payload, { signal });
  }
};
const _imports_0 = publicAssetsURL("/images/tn-solve-icon.png");
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-loading w-100 h-screen d-flex align-center justify-center" }, _attrs))} data-v-9fb0cb8e><img${ssrRenderAttr("src", _imports_0)} alt="Loading..." class="logo" data-v-9fb0cb8e></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppLoading.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-9fb0cb8e"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PopupMessage",
  __ssrInlineRender: true,
  setup(__props) {
    const { onGetterSystemPopup: systemPopup } = useAppStore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_v_dialog = resolveComponent("v-dialog");
      const _component_v_card = resolveComponent("v-card");
      const _component_v_btn = resolveComponent("v-btn");
      _push(ssrRenderComponent(_component_v_dialog, mergeProps({
        modelValue: unref(systemPopup).display,
        "onUpdate:modelValue": ($event) => unref(systemPopup).display = $event,
        width: "auto",
        style: { "z-index": "99999999999999999" }
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_v_card, { title: "" }, {
              item: withCtx((_2, _push3, _parent3, _scopeId2) => {
                var _a, _b, _c, _d, _e;
                if (_push3) {
                  _push3(`<div class="d-flex flex-column align-center mb-2" data-v-aaeb518f${_scopeId2}>`);
                  if (unref(systemPopup).type == "success") {
                    _push3(`<i class="mdi mdi-check-circle-outline" style="${ssrRenderStyle({ "font-size": "2rem", "color": "#10b981" })}" data-v-aaeb518f${_scopeId2}></i>`);
                  } else if (unref(systemPopup).type == "error" || !unref(systemPopup).type) {
                    _push3(`<i class="mdi mdi-close-circle-outline" style="${ssrRenderStyle({ "font-size": "2rem", "color": "#ef4444" })}" data-v-aaeb518f${_scopeId2}></i>`);
                  } else if (unref(systemPopup).type == "info") {
                    _push3(`<i class="mdi mdi-alert-circle-outline" style="${ssrRenderStyle({ "font-size": "2rem", "color": "#3b82f6" })}" data-v-aaeb518f${_scopeId2}></i>`);
                  } else if (unref(systemPopup).type == "warning") {
                    _push3(`<i class="mdi mdi-alert-outline" style="${ssrRenderStyle({ "font-size": "2rem", "color": "#f59e0b" })}" data-v-aaeb518f${_scopeId2}></i>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  if ((_a = unref(systemPopup)) == null ? void 0 : _a.content) {
                    _push3(`<span class="text-center" style="${ssrRenderStyle({ "white-space": "pre-line" })}" data-v-aaeb518f${_scopeId2}>${(_c = _ctx.$t((_b = unref(systemPopup)) == null ? void 0 : _b.content)) != null ? _c : ""}</span>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "d-flex flex-column align-center mb-2" }, [
                      unref(systemPopup).type == "success" ? (openBlock(), createBlock("i", {
                        key: 0,
                        class: "mdi mdi-check-circle-outline",
                        style: { "font-size": "2rem", "color": "#10b981" }
                      })) : unref(systemPopup).type == "error" || !unref(systemPopup).type ? (openBlock(), createBlock("i", {
                        key: 1,
                        class: "mdi mdi-close-circle-outline",
                        style: { "font-size": "2rem", "color": "#ef4444" }
                      })) : unref(systemPopup).type == "info" ? (openBlock(), createBlock("i", {
                        key: 2,
                        class: "mdi mdi-alert-circle-outline",
                        style: { "font-size": "2rem", "color": "#3b82f6" }
                      })) : unref(systemPopup).type == "warning" ? (openBlock(), createBlock("i", {
                        key: 3,
                        class: "mdi mdi-alert-outline",
                        style: { "font-size": "2rem", "color": "#f59e0b" }
                      })) : createCommentVNode("", true),
                      ((_d = unref(systemPopup)) == null ? void 0 : _d.content) ? (openBlock(), createBlock("span", {
                        key: 4,
                        innerHTML: _ctx.$t((_e = unref(systemPopup)) == null ? void 0 : _e.content),
                        class: "text-center",
                        style: { "white-space": "pre-line" }
                      }, null, 8, ["innerHTML"])) : createCommentVNode("", true)
                    ])
                  ];
                }
              }),
              actions: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_v_btn, {
                    text: "OK",
                    class: "w-100",
                    variant: "tonal",
                    onClick: ($event) => unref(systemPopup).display = false
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_v_btn, {
                      text: "OK",
                      class: "w-100",
                      variant: "tonal",
                      onClick: ($event) => unref(systemPopup).display = false
                    }, null, 8, ["onClick"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_v_card, { title: "" }, {
                item: withCtx(() => {
                  var _a, _b;
                  return [
                    createVNode("div", { class: "d-flex flex-column align-center mb-2" }, [
                      unref(systemPopup).type == "success" ? (openBlock(), createBlock("i", {
                        key: 0,
                        class: "mdi mdi-check-circle-outline",
                        style: { "font-size": "2rem", "color": "#10b981" }
                      })) : unref(systemPopup).type == "error" || !unref(systemPopup).type ? (openBlock(), createBlock("i", {
                        key: 1,
                        class: "mdi mdi-close-circle-outline",
                        style: { "font-size": "2rem", "color": "#ef4444" }
                      })) : unref(systemPopup).type == "info" ? (openBlock(), createBlock("i", {
                        key: 2,
                        class: "mdi mdi-alert-circle-outline",
                        style: { "font-size": "2rem", "color": "#3b82f6" }
                      })) : unref(systemPopup).type == "warning" ? (openBlock(), createBlock("i", {
                        key: 3,
                        class: "mdi mdi-alert-outline",
                        style: { "font-size": "2rem", "color": "#f59e0b" }
                      })) : createCommentVNode("", true),
                      ((_a = unref(systemPopup)) == null ? void 0 : _a.content) ? (openBlock(), createBlock("span", {
                        key: 4,
                        innerHTML: _ctx.$t((_b = unref(systemPopup)) == null ? void 0 : _b.content),
                        class: "text-center",
                        style: { "white-space": "pre-line" }
                      }, null, 8, ["innerHTML"])) : createCommentVNode("", true)
                    ])
                  ];
                }),
                actions: withCtx(() => [
                  createVNode(_component_v_btn, {
                    text: "OK",
                    class: "w-100",
                    variant: "tonal",
                    onClick: ($event) => unref(systemPopup).display = false
                  }, null, 8, ["onClick"])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PopupMessage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-aaeb518f"]]);

export { __nuxt_component_0 as _, __nuxt_component_1 as a, authService as b };
//# sourceMappingURL=PopupMessage-CHknC3mG.mjs.map
