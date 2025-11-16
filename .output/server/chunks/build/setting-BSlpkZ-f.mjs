import { defineComponent, ref, computed, reactive, watch, resolveComponent, withCtx, unref, createTextVNode, createVNode, toDisplayString, createBlock, openBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';
import { u as useAppStore, a as appService } from './app.store-CsbFmGtW.mjs';
import { e as useI18n } from './server.mjs';
import { a as useSeo } from './index-BKshJpnN.mjs';
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
  __name: "setting",
  __ssrInlineRender: true,
  setup(__props) {
    var _a, _b, _c;
    const { t } = useI18n();
    const { onGetterUserData, onActionGetUserData } = useAppStore();
    const loading = ref(false);
    const userData = computed(() => onGetterUserData.value || {});
    const formData = reactive({
      geminiCookies: ((_a = userData.value.settings) == null ? void 0 : _a.geminiCookies) || "",
      flowCookies: ((_b = userData.value.settings) == null ? void 0 : _b.flowCookies) || "",
      isCreateSpeed: ((_c = userData.value.settings) == null ? void 0 : _c.isCreateSpeed) || false
    });
    const onSubmit = async () => {
      loading.value = true;
      await appService.saveSetting(formData).then(async () => {
        await onActionGetUserData();
      }).finally(() => {
        loading.value = false;
      });
    };
    watch(userData, (newValue) => {
      var _a2, _b2, _c2;
      formData.geminiCookies = ((_a2 = newValue.settings) == null ? void 0 : _a2.geminiCookies) || "";
      formData.flowCookies = ((_b2 = newValue.settings) == null ? void 0 : _b2.flowCookies) || "";
      formData.isCreateSpeed = ((_c2 = newValue.settings) == null ? void 0 : _c2.isCreateSpeed) || false;
    });
    useSeo({
      title: t("C\xE0i \u0111\u1EB7t"),
      description: "N\u1EC1n t\u1EA3ng AI gi\xFAp b\u1EA1n t\u1EA1o video chuy\xEAn nghi\u1EC7p ch\u1EC9 trong v\xE0i ph\xFAt",
      image: "/images/page-setting.png"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_v_row = resolveComponent("v-row");
      const _component_v_col = resolveComponent("v-col");
      const _component_v_text_field = resolveComponent("v-text-field");
      const _component_v_icon = resolveComponent("v-icon");
      const _component_v_checkbox = resolveComponent("v-checkbox");
      const _component_v_progress_circular = resolveComponent("v-progress-circular");
      _push(ssrRenderComponent(_component_v_row, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b2, _c2, _d;
          if (_push2) {
            _push2(ssrRenderComponent(_component_v_col, { cols: "12" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_v_text_field, {
                    modelValue: unref(formData).flowCookies,
                    "onUpdate:modelValue": ($event) => unref(formData).flowCookies = $event,
                    "hide-details": "",
                    class: "w-100",
                    variant: "outlined",
                    label: _ctx.$t("Flow cookies (d\xF9ng t\xE0i kho\u1EA3n ri\xEAng)"),
                    readonly: Boolean(false)
                  }, null, _parent3, _scopeId2));
                  _push3(`<a target="_blank" rel="noopener noreferrer" href="https://youtu.be/__iDjAhIPHc?si=5Nlz-1aHRggWlPXf"${_scopeId2}>${ssrInterpolate(_ctx.$t("C\xE1ch l\u1EA5y Flow cookies"))} `);
                  _push3(ssrRenderComponent(_component_v_icon, { class: "text-error ml-1" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`mdi-youtube`);
                      } else {
                        return [
                          createTextVNode("mdi-youtube")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</a>`);
                } else {
                  return [
                    createVNode(_component_v_text_field, {
                      modelValue: unref(formData).flowCookies,
                      "onUpdate:modelValue": ($event) => unref(formData).flowCookies = $event,
                      "hide-details": "",
                      class: "w-100",
                      variant: "outlined",
                      label: _ctx.$t("Flow cookies (d\xF9ng t\xE0i kho\u1EA3n ri\xEAng)"),
                      readonly: Boolean(false)
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "label", "readonly"]),
                    createVNode("a", {
                      target: "_blank",
                      rel: "noopener noreferrer",
                      href: "https://youtu.be/__iDjAhIPHc?si=5Nlz-1aHRggWlPXf"
                    }, [
                      createTextVNode(toDisplayString(_ctx.$t("C\xE1ch l\u1EA5y Flow cookies")) + " ", 1),
                      createVNode(_component_v_icon, { class: "text-error ml-1" }, {
                        default: withCtx(() => [
                          createTextVNode("mdi-youtube")
                        ]),
                        _: 1
                      })
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (unref(userData).role === "admin" || ((_b2 = (_a2 = unref(userData)) == null ? void 0 : _a2.settings) == null ? void 0 : _b2.flowCookies)) {
              _push2(ssrRenderComponent(_component_v_col, { cols: "12" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_v_checkbox, {
                      modelValue: unref(formData).isCreateSpeed,
                      "onUpdate:modelValue": ($event) => unref(formData).isCreateSpeed = $event,
                      "hide-details": "",
                      label: _ctx.$t("T\u1EA1o video t\u1ED1c \u0111\u1ED9 cao"),
                      style: { "margin-left": "-10px", "margin-top": "-1rem", "margin-bottom": "-10px" }
                    }, null, _parent3, _scopeId2));
                    _push3(`<small${_scopeId2}>${ssrInterpolate("L\u01B0u \xFD: n\u1EBFu t\xEDch v\xE0o ch\u1EBF \u0111\u1ED9 n\xE0y c\xF3 th\u1EC3 g\xE2y ra l\u1ED7i: \u274C \u0110ang c\xF3 nhi\u1EC1u ng\u01B0\u1EDDi t\u1EA1o video v\xE0o l\xFAc n\xE0y, vui l\xF2ng \u0111\u1EE3i m\u1ED9t ch\xFAt r\u1ED3i th\u1EED l\u1EA1i!")}</small></div>`);
                  } else {
                    return [
                      createVNode("div", null, [
                        createVNode(_component_v_checkbox, {
                          modelValue: unref(formData).isCreateSpeed,
                          "onUpdate:modelValue": ($event) => unref(formData).isCreateSpeed = $event,
                          "hide-details": "",
                          label: _ctx.$t("T\u1EA1o video t\u1ED1c \u0111\u1ED9 cao"),
                          style: { "margin-left": "-10px", "margin-top": "-1rem", "margin-bottom": "-10px" }
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "label"]),
                        createVNode("small", null, toDisplayString("L\u01B0u \xFD: n\u1EBFu t\xEDch v\xE0o ch\u1EBF \u0111\u1ED9 n\xE0y c\xF3 th\u1EC3 g\xE2y ra l\u1ED7i: \u274C \u0110ang c\xF3 nhi\u1EC1u ng\u01B0\u1EDDi t\u1EA1o video v\xE0o l\xFAc n\xE0y, vui l\xF2ng \u0111\u1EE3i m\u1ED9t ch\xFAt r\u1ED3i th\u1EED l\u1EA1i!"))
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_v_col, {
              cols: "12",
              lg: "3",
              md: "4",
              class: "mt-6"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="cta-button w-100 justify-center" style="${ssrRenderStyle({ "border-radius": "6px" })}"${_scopeId2}>`);
                  if (unref(loading)) {
                    _push3(ssrRenderComponent(_component_v_progress_circular, {
                      width: "2",
                      size: "23",
                      color: "white",
                      indeterminate: ""
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(ssrRenderComponent(_component_v_icon, { size: "27" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`mdi-content-save-cog`);
                        } else {
                          return [
                            createTextVNode("mdi-content-save-cog")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  }
                  _push3(`<h3${_scopeId2}>${ssrInterpolate(_ctx.$t("L\u01B0u c\xE0i \u0111\u1EB7t"))}</h3></div>`);
                } else {
                  return [
                    createVNode("div", {
                      class: "cta-button w-100 justify-center",
                      style: { "border-radius": "6px" },
                      onClick: onSubmit
                    }, [
                      unref(loading) ? (openBlock(), createBlock(_component_v_progress_circular, {
                        key: 0,
                        width: "2",
                        size: "23",
                        color: "white",
                        indeterminate: ""
                      })) : (openBlock(), createBlock(_component_v_icon, {
                        key: 1,
                        size: "27"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("mdi-content-save-cog")
                        ]),
                        _: 1
                      })),
                      createVNode("h3", null, toDisplayString(_ctx.$t("L\u01B0u c\xE0i \u0111\u1EB7t")), 1)
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_v_col, { cols: "12" }, {
                default: withCtx(() => [
                  createVNode(_component_v_text_field, {
                    modelValue: unref(formData).flowCookies,
                    "onUpdate:modelValue": ($event) => unref(formData).flowCookies = $event,
                    "hide-details": "",
                    class: "w-100",
                    variant: "outlined",
                    label: _ctx.$t("Flow cookies (d\xF9ng t\xE0i kho\u1EA3n ri\xEAng)"),
                    readonly: Boolean(false)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "label", "readonly"]),
                  createVNode("a", {
                    target: "_blank",
                    rel: "noopener noreferrer",
                    href: "https://youtu.be/__iDjAhIPHc?si=5Nlz-1aHRggWlPXf"
                  }, [
                    createTextVNode(toDisplayString(_ctx.$t("C\xE1ch l\u1EA5y Flow cookies")) + " ", 1),
                    createVNode(_component_v_icon, { class: "text-error ml-1" }, {
                      default: withCtx(() => [
                        createTextVNode("mdi-youtube")
                      ]),
                      _: 1
                    })
                  ])
                ]),
                _: 1
              }),
              unref(userData).role === "admin" || ((_d = (_c2 = unref(userData)) == null ? void 0 : _c2.settings) == null ? void 0 : _d.flowCookies) ? (openBlock(), createBlock(_component_v_col, {
                key: 0,
                cols: "12"
              }, {
                default: withCtx(() => [
                  createVNode("div", null, [
                    createVNode(_component_v_checkbox, {
                      modelValue: unref(formData).isCreateSpeed,
                      "onUpdate:modelValue": ($event) => unref(formData).isCreateSpeed = $event,
                      "hide-details": "",
                      label: _ctx.$t("T\u1EA1o video t\u1ED1c \u0111\u1ED9 cao"),
                      style: { "margin-left": "-10px", "margin-top": "-1rem", "margin-bottom": "-10px" }
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "label"]),
                    createVNode("small", null, toDisplayString("L\u01B0u \xFD: n\u1EBFu t\xEDch v\xE0o ch\u1EBF \u0111\u1ED9 n\xE0y c\xF3 th\u1EC3 g\xE2y ra l\u1ED7i: \u274C \u0110ang c\xF3 nhi\u1EC1u ng\u01B0\u1EDDi t\u1EA1o video v\xE0o l\xFAc n\xE0y, vui l\xF2ng \u0111\u1EE3i m\u1ED9t ch\xFAt r\u1ED3i th\u1EED l\u1EA1i!"))
                  ])
                ]),
                _: 1
              })) : createCommentVNode("", true),
              createVNode(_component_v_col, {
                cols: "12",
                lg: "3",
                md: "4",
                class: "mt-6"
              }, {
                default: withCtx(() => [
                  createVNode("div", {
                    class: "cta-button w-100 justify-center",
                    style: { "border-radius": "6px" },
                    onClick: onSubmit
                  }, [
                    unref(loading) ? (openBlock(), createBlock(_component_v_progress_circular, {
                      key: 0,
                      width: "2",
                      size: "23",
                      color: "white",
                      indeterminate: ""
                    })) : (openBlock(), createBlock(_component_v_icon, {
                      key: 1,
                      size: "27"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("mdi-content-save-cog")
                      ]),
                      _: 1
                    })),
                    createVNode("h3", null, toDisplayString(_ctx.$t("L\u01B0u c\xE0i \u0111\u1EB7t")), 1)
                  ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/setting.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=setting-BSlpkZ-f.mjs.map
