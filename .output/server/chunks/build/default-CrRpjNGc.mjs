import { _ as __nuxt_component_0, a as __nuxt_component_1, b as authService } from './PopupMessage-CHknC3mG.mjs';
import { _ as _export_sfc, g as useRoute$1, u as useRouter$1, f as useLocalePath, e as useI18n, k as __nuxt_component_2 } from './server.mjs';
import { defineComponent, ref, computed, resolveComponent, unref, withCtx, createVNode, withDirectives, vShow, createBlock, openBlock, toDisplayString, Fragment, renderList, withModifiers, mergeProps, createCommentVNode, isRef, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderClass, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderAttrs, ssrRenderAttr } from 'vue/server-renderer';
import { u as useAppStore } from './app.store-CsbFmGtW.mjs';
import { u as useDevice, l as loginGoogle, r as referralId } from './index-BKshJpnN.mjs';
import { u as useHead } from './v3-CpJW8Kui.mjs';
import { E as EnumAccountRole } from './enum-kAdbNx_J.mjs';
import { p as publicAssetsURL } from '../_/nitro.mjs';
import { u as useMasterDataStore } from './master-data-ZBucjABo.mjs';
import 'pinia';
import 'vue-router';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import 'node:path';
import 'node:crypto';
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
import '@vueuse/core';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "AppLogin",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const { onGetterDisplayLogin: displayLogin } = useAppStore();
    const loading = ref("\u0110\u0103ng nh\u1EADp v\u1EDBi Google");
    const onClickLogin = async (type = "google") => {
      var _a;
      if (loading.value === "\u0110ang \u0111\u0103ng nh\u1EADp...") return;
      try {
        const token = await loginGoogle();
        loading.value = "\u0110ang \u0111\u0103ng nh\u1EADp...";
        let payload = { type, credential: token };
        if (referralId.value) payload.ref = referralId.value;
        if (!payload.ref && ((_a = route.query) == null ? void 0 : _a.code)) payload.code = route.query.code;
        await authService.login(payload).then(() => {
          const redirect = route.query.redirect;
          (void 0).location.href = redirect || "/";
        });
      } catch (error) {
        console.error(error);
      }
    };
    useHead({
      script: [
        {
          async: true,
          defer: true,
          src: "https://accounts.google.com/gsi/client"
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_v_dialog = resolveComponent("v-dialog");
      const _component_v_card = resolveComponent("v-card");
      const _component_v_card_title = resolveComponent("v-card-title");
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_card_text = resolveComponent("v-card-text");
      const _component_v_img = resolveComponent("v-img");
      const _component_v_icon = resolveComponent("v-icon");
      _push(ssrRenderComponent(_component_v_dialog, mergeProps({
        modelValue: unref(displayLogin),
        "onUpdate:modelValue": ($event) => isRef(displayLogin) ? displayLogin.value = $event : null,
        scrollable: "",
        "max-width": "500",
        "max-height": "90%",
        transition: "dialog-bottom-transition"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_v_card, {
              rounded: "xl",
              style: { "background": "linear-gradient(135deg, #ffe5ec, #e0f7fa)", "padding-bottom": "10rem" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_v_card_title, { class: "d-flex justify-space-between align-center pb-0" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_v_btn, {
                          icon: "mdi-close",
                          variant: "tonal",
                          class: "opacity-0",
                          style: { "cursor": "default" }
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_v_btn, {
                          icon: "mdi-close",
                          variant: "text",
                          size: "44",
                          onClick: ($event) => displayLogin.value = false
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_v_btn, {
                            icon: "mdi-close",
                            variant: "tonal",
                            class: "opacity-0",
                            style: { "cursor": "default" }
                          }),
                          createVNode(_component_v_btn, {
                            icon: "mdi-close",
                            variant: "text",
                            size: "44",
                            onClick: ($event) => displayLogin.value = false
                          }, null, 8, ["onClick"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_v_card_text, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="d-flex flex-column ga-10 w-100" data-v-7c1afb72${_scopeId3}><div class="d-flex flex-column align-center ga-3" data-v-7c1afb72${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_v_img, {
                          class: "w-10rem",
                          src: "/images/tn-solve-icon.png",
                          "lazy-src": "/images/tn-solve-icon.png"
                        }, null, _parent4, _scopeId3));
                        _push4(`<h2 class="font-bold text-center" data-v-7c1afb72${_scopeId3}>${ssrInterpolate(_ctx.$t("\u0110\u0103ng nh\u1EADp"))}</h2></div><div class="ripple-effect py-3 ga-2" data-v-7c1afb72${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_v_icon, { size: "23" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`mdi-google`);
                            } else {
                              return [
                                createTextVNode("mdi-google")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`<h3 data-v-7c1afb72${_scopeId3}>${ssrInterpolate(_ctx.$t(unref(loading)))}</h3></div></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "d-flex flex-column ga-10 w-100" }, [
                            createVNode("div", { class: "d-flex flex-column align-center ga-3" }, [
                              createVNode(_component_v_img, {
                                class: "w-10rem",
                                src: "/images/tn-solve-icon.png",
                                "lazy-src": "/images/tn-solve-icon.png"
                              }),
                              createVNode("h2", { class: "font-bold text-center" }, toDisplayString(_ctx.$t("\u0110\u0103ng nh\u1EADp")), 1)
                            ]),
                            createVNode("div", {
                              class: "ripple-effect py-3 ga-2",
                              onClick: ($event) => onClickLogin("google")
                            }, [
                              createVNode(_component_v_icon, { size: "23" }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-google")
                                ]),
                                _: 1
                              }),
                              createVNode("h3", null, toDisplayString(_ctx.$t(unref(loading))), 1)
                            ], 8, ["onClick"])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_v_card_title, { class: "d-flex justify-space-between align-center pb-0" }, {
                      default: withCtx(() => [
                        createVNode(_component_v_btn, {
                          icon: "mdi-close",
                          variant: "tonal",
                          class: "opacity-0",
                          style: { "cursor": "default" }
                        }),
                        createVNode(_component_v_btn, {
                          icon: "mdi-close",
                          variant: "text",
                          size: "44",
                          onClick: ($event) => displayLogin.value = false
                        }, null, 8, ["onClick"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_v_card_text, null, {
                      default: withCtx(() => [
                        createVNode("div", { class: "d-flex flex-column ga-10 w-100" }, [
                          createVNode("div", { class: "d-flex flex-column align-center ga-3" }, [
                            createVNode(_component_v_img, {
                              class: "w-10rem",
                              src: "/images/tn-solve-icon.png",
                              "lazy-src": "/images/tn-solve-icon.png"
                            }),
                            createVNode("h2", { class: "font-bold text-center" }, toDisplayString(_ctx.$t("\u0110\u0103ng nh\u1EADp")), 1)
                          ]),
                          createVNode("div", {
                            class: "ripple-effect py-3 ga-2",
                            onClick: ($event) => onClickLogin("google")
                          }, [
                            createVNode(_component_v_icon, { size: "23" }, {
                              default: withCtx(() => [
                                createTextVNode("mdi-google")
                              ]),
                              _: 1
                            }),
                            createVNode("h3", null, toDisplayString(_ctx.$t(unref(loading))), 1)
                          ], 8, ["onClick"])
                        ])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_v_card, {
                rounded: "xl",
                style: { "background": "linear-gradient(135deg, #ffe5ec, #e0f7fa)", "padding-bottom": "10rem" }
              }, {
                default: withCtx(() => [
                  createVNode(_component_v_card_title, { class: "d-flex justify-space-between align-center pb-0" }, {
                    default: withCtx(() => [
                      createVNode(_component_v_btn, {
                        icon: "mdi-close",
                        variant: "tonal",
                        class: "opacity-0",
                        style: { "cursor": "default" }
                      }),
                      createVNode(_component_v_btn, {
                        icon: "mdi-close",
                        variant: "text",
                        size: "44",
                        onClick: ($event) => displayLogin.value = false
                      }, null, 8, ["onClick"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_v_card_text, null, {
                    default: withCtx(() => [
                      createVNode("div", { class: "d-flex flex-column ga-10 w-100" }, [
                        createVNode("div", { class: "d-flex flex-column align-center ga-3" }, [
                          createVNode(_component_v_img, {
                            class: "w-10rem",
                            src: "/images/tn-solve-icon.png",
                            "lazy-src": "/images/tn-solve-icon.png"
                          }),
                          createVNode("h2", { class: "font-bold text-center" }, toDisplayString(_ctx.$t("\u0110\u0103ng nh\u1EADp")), 1)
                        ]),
                        createVNode("div", {
                          class: "ripple-effect py-3 ga-2",
                          onClick: ($event) => onClickLogin("google")
                        }, [
                          createVNode(_component_v_icon, { size: "23" }, {
                            default: withCtx(() => [
                              createTextVNode("mdi-google")
                            ]),
                            _: 1
                          }),
                          createVNode("h3", null, toDisplayString(_ctx.$t(unref(loading))), 1)
                        ], 8, ["onClick"])
                      ])
                    ]),
                    _: 1
                  })
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
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layouts/AppLogin.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const AppLogin = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-7c1afb72"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "AppHeader",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter$1();
    const localePath = useLocalePath();
    const { isMobile } = useDevice();
    const {
      onGetterUserData: userData,
      onGetterDisplayLogin: displayLogin,
      onActionSetSystemPopup
    } = useAppStore();
    const menus = computed(() => {
      var _a, _b;
      const items = [
        {
          title: "T\xE0i kho\u1EA3n",
          value: "account",
          icon: "mdi-account-circle-outline"
        },
        {
          title: "Th\u01B0 vi\u1EC7n c\u1EE7a t\xF4i",
          value: "video",
          icon: "mdi-image-multiple-outline"
        },
        {
          title: "C\xE0i \u0111\u1EB7t",
          value: "setting",
          icon: "mdi-cog-outline"
        },
        {
          title: "\u0110\u0103ng xu\u1EA5t",
          value: "logout",
          icon: "mdi-logout",
          size: 21
        }
      ];
      if (((_a = userData.value) == null ? void 0 : _a.role) === EnumAccountRole.ADMIN) {
        items.splice(2, 0, {
          title: "Trang qu\u1EA3n tr\u1ECB",
          value: "admin",
          icon: "mdi-shield-account-outline"
        });
      } else if (((_b = userData.value) == null ? void 0 : _b.role) === "partner") {
        items.splice(2, 0, {
          title: "C\u1ED9ng t\xE1c vi\xEAn",
          value: "partner",
          icon: "mdi-account-multiple-outline"
        });
      }
      return items;
    });
    const onClickMenuItem = (value) => {
      if (value === "logout") {
        authService.logout().then(() => {
          (void 0).location.href = "/";
        });
        return;
      } else if (value === "account") {
        onActionSetSystemPopup({
          type: "info",
          content: "T\xEDnh n\u0103ng \u0111ang \u0111\u01B0\u1EE3c ph\xE1t tri\u1EC3n!"
        });
        return;
      } else {
        router.push(localePath(`/${value}`));
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_v_container = resolveComponent("v-container");
      const _component_v_img = resolveComponent("v-img");
      const _component_v_chip = resolveComponent("v-chip");
      const _component_v_menu = resolveComponent("v-menu");
      const _component_v_avatar = resolveComponent("v-avatar");
      const _component_v_card = resolveComponent("v-card");
      const _component_v_list = resolveComponent("v-list");
      const _component_v_list_item = resolveComponent("v-list-item");
      const _component_v_divider = resolveComponent("v-divider");
      const _component_v_icon = resolveComponent("v-icon");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(AppLogin, null, null, _parent));
      _push(`<div class="sticky top-0 right-0 left-0 w-100 py-2" style="${ssrRenderStyle({ "z-index": "999", "box-shadow": "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px", "background": "linear-gradient(90deg, rgb(211 233 255), rgb(211 233 255))" })}" data-v-8b190780>`);
      _push(ssrRenderComponent(_component_v_container, { "max-width": "1400" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
          if (_push2) {
            _push2(`<div class="d-flex align-center justify-space-between ga-3" data-v-8b190780${_scopeId}><div data-v-8b190780${_scopeId}>`);
            _push2(ssrRenderComponent(_component_v_img, {
              src: "/images/tn-solve-logo.png",
              "lazy-src": "/images/tn-solve-logo.png",
              class: `${unref(isMobile) ? "w-6rem" : "w-8rem"} h-3rem b-radius-1 cursor-pointer`,
              onClick: ($event) => unref(router).push(unref(localePath)("/"))
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="d-flex align-center ga-4" data-v-8b190780${_scopeId}>`);
            if (((_a = unref(userData)) == null ? void 0 : _a.name) && (((_c = (_b = unref(userData)) == null ? void 0 : _b.settings) == null ? void 0 : _c.testAmount) !== null || ((_d = unref(userData)) == null ? void 0 : _d.serviceExpiry))) {
              _push2(ssrRenderComponent(_component_v_chip, {
                variant: "tonal",
                class: "font-bold",
                color: ((_e = unref(userData)) == null ? void 0 : _e.remainingTime) ? "green" : ((_g = (_f = unref(userData)) == null ? void 0 : _f.settings) == null ? void 0 : _g.testAmount) ? "primary" : "red",
                size: unref(isMobile) ? "small" : "default"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2;
                  if (_push3) {
                    if ((_a2 = unref(userData)) == null ? void 0 : _a2.serviceExpiry) {
                      _push3(`<span data-v-8b190780${_scopeId2}>${ssrInterpolate(((_b2 = unref(userData)) == null ? void 0 : _b2.remainingTime) ? `${_ctx.$t("C\xF2n")} ${(_c2 = unref(userData)) == null ? void 0 : _c2.remainingTime}` : _ctx.$t("\u0110\xE3 h\u1EBFt h\u1EA1n"))}</span>`);
                    } else {
                      _push3(`<span data-v-8b190780${_scopeId2}> C\xF2n ${ssrInterpolate((_d2 = unref(userData)) == null ? void 0 : _d2.settings.testAmount)} l\u01B0\u1EE3t d\xF9ng th\u1EED </span>`);
                    }
                  } else {
                    return [
                      ((_e2 = unref(userData)) == null ? void 0 : _e2.serviceExpiry) ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(((_f2 = unref(userData)) == null ? void 0 : _f2.remainingTime) ? `${_ctx.$t("C\xF2n")} ${(_g2 = unref(userData)) == null ? void 0 : _g2.remainingTime}` : _ctx.$t("\u0110\xE3 h\u1EBFt h\u1EA1n")), 1)) : (openBlock(), createBlock("span", { key: 1 }, " C\xF2n " + toDisplayString((_h2 = unref(userData)) == null ? void 0 : _h2.settings.testAmount) + " l\u01B0\u1EE3t d\xF9ng th\u1EED ", 1))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if ((_h = Object.values(unref(userData) || {})) == null ? void 0 : _h.length) {
              _push2(ssrRenderComponent(_component_v_menu, { location: "bottom right" }, {
                activator: withCtx(({ props }, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_v_avatar, mergeProps(props, {
                      size: "44",
                      class: "cursor-pointer"
                    }), {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_v_img, {
                            loading: "lazy",
                            src: unref(userData).avatar || "/images/avatar-default.jpg"
                          }, {
                            placeholder: withCtx((_3, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_v_img, { src: " /images/avatar-default.jpg" }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_v_img, { src: " /images/avatar-default.jpg" })
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_v_img, {
                              loading: "lazy",
                              src: unref(userData).avatar || "/images/avatar-default.jpg"
                            }, {
                              placeholder: withCtx(() => [
                                createVNode(_component_v_img, { src: " /images/avatar-default.jpg" })
                              ]),
                              _: 1
                            }, 8, ["src"])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_v_avatar, mergeProps(props, {
                        size: "44",
                        class: "cursor-pointer"
                      }), {
                        default: withCtx(() => [
                          createVNode(_component_v_img, {
                            loading: "lazy",
                            src: unref(userData).avatar || "/images/avatar-default.jpg"
                          }, {
                            placeholder: withCtx(() => [
                              createVNode(_component_v_img, { src: " /images/avatar-default.jpg" })
                            ]),
                            _: 1
                          }, 8, ["src"])
                        ]),
                        _: 1
                      }, 16)
                    ];
                  }
                }),
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_v_card, { "min-width": "200" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_v_list, { onClick: () => {
                          } }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_v_list_item, null, {
                                  title: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<h3 class="font-bold" style="${ssrRenderStyle({ "font-size": "1.1rem" })}" data-v-8b190780${_scopeId5}>${ssrInterpolate(unref(userData).name)}</h3>`);
                                    } else {
                                      return [
                                        createVNode("h3", {
                                          class: "font-bold",
                                          style: { "font-size": "1.1rem" }
                                        }, toDisplayString(unref(userData).name), 1)
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_v_list_item, null, {
                                    title: withCtx(() => [
                                      createVNode("h3", {
                                        class: "font-bold",
                                        style: { "font-size": "1.1rem" }
                                      }, toDisplayString(unref(userData).name), 1)
                                    ]),
                                    _: 1
                                  })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_v_divider, null, null, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_v_list, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<!--[-->`);
                                ssrRenderList(unref(menus), (item, index) => {
                                  _push5(ssrRenderComponent(_component_v_list_item, {
                                    key: index,
                                    value: item.value,
                                    onClick: ($event) => onClickMenuItem(item.value)
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`<div class="d-flex align-center ga-4" data-v-8b190780${_scopeId5}>`);
                                        _push6(ssrRenderComponent(_component_v_icon, {
                                          icon: item.icon,
                                          size: item.size,
                                          color: `${item.value === "logout" ? "red" : ""}`
                                        }, null, _parent6, _scopeId5));
                                        _push6(`<label class="${ssrRenderClass([{ "text-red": item.value === "logout" }, "cursor-pointer"])}" data-v-8b190780${_scopeId5}>${ssrInterpolate(_ctx.$t(item.title))}</label></div>`);
                                      } else {
                                        return [
                                          createVNode("div", { class: "d-flex align-center ga-4" }, [
                                            createVNode(_component_v_icon, {
                                              icon: item.icon,
                                              size: item.size,
                                              color: `${item.value === "logout" ? "red" : ""}`
                                            }, null, 8, ["icon", "size", "color"]),
                                            createVNode("label", {
                                              class: ["cursor-pointer", { "text-red": item.value === "logout" }]
                                            }, toDisplayString(_ctx.$t(item.title)), 3)
                                          ])
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                });
                                _push5(`<!--]-->`);
                              } else {
                                return [
                                  (openBlock(true), createBlock(Fragment, null, renderList(unref(menus), (item, index) => {
                                    return openBlock(), createBlock(_component_v_list_item, {
                                      key: index,
                                      value: item.value,
                                      onClick: ($event) => onClickMenuItem(item.value)
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("div", { class: "d-flex align-center ga-4" }, [
                                          createVNode(_component_v_icon, {
                                            icon: item.icon,
                                            size: item.size,
                                            color: `${item.value === "logout" ? "red" : ""}`
                                          }, null, 8, ["icon", "size", "color"]),
                                          createVNode("label", {
                                            class: ["cursor-pointer", { "text-red": item.value === "logout" }]
                                          }, toDisplayString(_ctx.$t(item.title)), 3)
                                        ])
                                      ]),
                                      _: 2
                                    }, 1032, ["value", "onClick"]);
                                  }), 128))
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_v_list, {
                              onClick: withModifiers(() => {
                              }, ["stop"])
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_v_list_item, null, {
                                  title: withCtx(() => [
                                    createVNode("h3", {
                                      class: "font-bold",
                                      style: { "font-size": "1.1rem" }
                                    }, toDisplayString(unref(userData).name), 1)
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode(_component_v_divider),
                            createVNode(_component_v_list, null, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(unref(menus), (item, index) => {
                                  return openBlock(), createBlock(_component_v_list_item, {
                                    key: index,
                                    value: item.value,
                                    onClick: ($event) => onClickMenuItem(item.value)
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("div", { class: "d-flex align-center ga-4" }, [
                                        createVNode(_component_v_icon, {
                                          icon: item.icon,
                                          size: item.size,
                                          color: `${item.value === "logout" ? "red" : ""}`
                                        }, null, 8, ["icon", "size", "color"]),
                                        createVNode("label", {
                                          class: ["cursor-pointer", { "text-red": item.value === "logout" }]
                                        }, toDisplayString(_ctx.$t(item.title)), 3)
                                      ])
                                    ]),
                                    _: 2
                                  }, 1032, ["value", "onClick"]);
                                }), 128))
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_v_card, { "min-width": "200" }, {
                        default: withCtx(() => [
                          createVNode(_component_v_list, {
                            onClick: withModifiers(() => {
                            }, ["stop"])
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_v_list_item, null, {
                                title: withCtx(() => [
                                  createVNode("h3", {
                                    class: "font-bold",
                                    style: { "font-size": "1.1rem" }
                                  }, toDisplayString(unref(userData).name), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(_component_v_divider),
                          createVNode(_component_v_list, null, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(unref(menus), (item, index) => {
                                return openBlock(), createBlock(_component_v_list_item, {
                                  key: index,
                                  value: item.value,
                                  onClick: ($event) => onClickMenuItem(item.value)
                                }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "d-flex align-center ga-4" }, [
                                      createVNode(_component_v_icon, {
                                        icon: item.icon,
                                        size: item.size,
                                        color: `${item.value === "logout" ? "red" : ""}`
                                      }, null, 8, ["icon", "size", "color"]),
                                      createVNode("label", {
                                        class: ["cursor-pointer", { "text-red": item.value === "logout" }]
                                      }, toDisplayString(_ctx.$t(item.title)), 3)
                                    ])
                                  ]),
                                  _: 2
                                }, 1032, ["value", "onClick"]);
                              }), 128))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<div class="cta-button cursor-pointer" data-v-8b190780${_scopeId}><h3 data-v-8b190780${_scopeId}>${ssrInterpolate(_ctx.$t("\u0110\u0103ng nh\u1EADp"))}</h3></div>`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "d-flex align-center justify-space-between ga-3" }, [
                createVNode("div", null, [
                  createVNode(_component_v_img, {
                    src: "/images/tn-solve-logo.png",
                    "lazy-src": "/images/tn-solve-logo.png",
                    class: `${unref(isMobile) ? "w-6rem" : "w-8rem"} h-3rem b-radius-1 cursor-pointer`,
                    onClick: ($event) => unref(router).push(unref(localePath)("/"))
                  }, null, 8, ["class", "onClick"])
                ]),
                createVNode("div", { class: "d-flex align-center ga-4" }, [
                  ((_i = unref(userData)) == null ? void 0 : _i.name) && (((_k = (_j = unref(userData)) == null ? void 0 : _j.settings) == null ? void 0 : _k.testAmount) !== null || ((_l = unref(userData)) == null ? void 0 : _l.serviceExpiry)) ? (openBlock(), createBlock(_component_v_chip, {
                    key: 0,
                    variant: "tonal",
                    class: "font-bold",
                    color: ((_m = unref(userData)) == null ? void 0 : _m.remainingTime) ? "green" : ((_o = (_n = unref(userData)) == null ? void 0 : _n.settings) == null ? void 0 : _o.testAmount) ? "primary" : "red",
                    size: unref(isMobile) ? "small" : "default"
                  }, {
                    default: withCtx(() => {
                      var _a2, _b2, _c2, _d2;
                      return [
                        ((_a2 = unref(userData)) == null ? void 0 : _a2.serviceExpiry) ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(((_b2 = unref(userData)) == null ? void 0 : _b2.remainingTime) ? `${_ctx.$t("C\xF2n")} ${(_c2 = unref(userData)) == null ? void 0 : _c2.remainingTime}` : _ctx.$t("\u0110\xE3 h\u1EBFt h\u1EA1n")), 1)) : (openBlock(), createBlock("span", { key: 1 }, " C\xF2n " + toDisplayString((_d2 = unref(userData)) == null ? void 0 : _d2.settings.testAmount) + " l\u01B0\u1EE3t d\xF9ng th\u1EED ", 1))
                      ];
                    }),
                    _: 1
                  }, 8, ["color", "size"])) : createCommentVNode("", true),
                  ((_p = Object.values(unref(userData) || {})) == null ? void 0 : _p.length) ? (openBlock(), createBlock(_component_v_menu, {
                    key: 1,
                    location: "bottom right"
                  }, {
                    activator: withCtx(({ props }) => [
                      createVNode(_component_v_avatar, mergeProps(props, {
                        size: "44",
                        class: "cursor-pointer"
                      }), {
                        default: withCtx(() => [
                          createVNode(_component_v_img, {
                            loading: "lazy",
                            src: unref(userData).avatar || "/images/avatar-default.jpg"
                          }, {
                            placeholder: withCtx(() => [
                              createVNode(_component_v_img, { src: " /images/avatar-default.jpg" })
                            ]),
                            _: 1
                          }, 8, ["src"])
                        ]),
                        _: 1
                      }, 16)
                    ]),
                    default: withCtx(() => [
                      createVNode(_component_v_card, { "min-width": "200" }, {
                        default: withCtx(() => [
                          createVNode(_component_v_list, {
                            onClick: withModifiers(() => {
                            }, ["stop"])
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_v_list_item, null, {
                                title: withCtx(() => [
                                  createVNode("h3", {
                                    class: "font-bold",
                                    style: { "font-size": "1.1rem" }
                                  }, toDisplayString(unref(userData).name), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(_component_v_divider),
                          createVNode(_component_v_list, null, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(unref(menus), (item, index) => {
                                return openBlock(), createBlock(_component_v_list_item, {
                                  key: index,
                                  value: item.value,
                                  onClick: ($event) => onClickMenuItem(item.value)
                                }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "d-flex align-center ga-4" }, [
                                      createVNode(_component_v_icon, {
                                        icon: item.icon,
                                        size: item.size,
                                        color: `${item.value === "logout" ? "red" : ""}`
                                      }, null, 8, ["icon", "size", "color"]),
                                      createVNode("label", {
                                        class: ["cursor-pointer", { "text-red": item.value === "logout" }]
                                      }, toDisplayString(_ctx.$t(item.title)), 3)
                                    ])
                                  ]),
                                  _: 2
                                }, 1032, ["value", "onClick"]);
                              }), 128))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })) : (openBlock(), createBlock("div", {
                    key: 2,
                    class: "cta-button cursor-pointer",
                    onClick: ($event) => displayLogin.value = true
                  }, [
                    createVNode("h3", null, toDisplayString(_ctx.$t("\u0110\u0103ng nh\u1EADp")), 1)
                  ], 8, ["onClick"]))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layouts/AppHeader.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AppHeader = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-8b190780"]]);
const _imports_0 = publicAssetsURL("/images/icon-tiktok.png");
const _imports_1 = publicAssetsURL("/images/icon-youtube.png");
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AppFooter",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter$1();
    const localePath = useLocalePath();
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    const onClickNavigate = (value) => {
      if (!value) {
        useAppStore().onActionSetSystemPopup({
          type: "info",
          content: "T\xEDnh n\u0103ng \u0111ang \u0111\u01B0\u1EE3c ph\xE1t tri\u1EC3n!"
        });
        return;
      } else {
        if (value === "contact") {
          (void 0).open("https://zalo.me/0343027232", "_blank");
        } else if (value === "zalo-group") {
          (void 0).open("https://zalo.me/g/tuhmrl934", "_blank");
        } else {
          router.push(localePath(`/${value}`));
        }
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_v_container = resolveComponent("v-container");
      const _component_v_row = resolveComponent("v-row");
      const _component_v_col = resolveComponent("v-col");
      const _component_v_img = resolveComponent("v-img");
      _push(`<footer${ssrRenderAttrs(mergeProps({ style: { "background-color": "#ddd", "padding-top": "2.4rem", "margin-top": "3rem" } }, _attrs))} data-v-e0961aad>`);
      _push(ssrRenderComponent(_component_v_container, { "max-width": "1400" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_v_row, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_v_col, {
                    cols: "12",
                    lg: "6"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div data-v-e0961aad${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_v_img, {
                          src: "/images/tn-solve-icon.png",
                          "lazy-src": "/images/tn-solve-logo.png",
                          class: `w-10rem  b-radius-1`
                        }, null, _parent4, _scopeId3));
                        _push4(`</div><p class="tagline mt-2" data-v-e0961aad${_scopeId3}>${ssrInterpolate(_ctx.$t(
                          "N\u1EC1n t\u1EA3ng AI gi\xFAp b\u1EA1n t\u1EA1o video chuy\xEAn nghi\u1EC7p ch\u1EC9 trong v\xE0i ph\xFAt"
                        ))}</p>`);
                      } else {
                        return [
                          createVNode("div", null, [
                            createVNode(_component_v_img, {
                              src: "/images/tn-solve-icon.png",
                              "lazy-src": "/images/tn-solve-logo.png",
                              class: `w-10rem  b-radius-1`
                            })
                          ]),
                          createVNode("p", { class: "tagline mt-2" }, toDisplayString(_ctx.$t(
                            "N\u1EC1n t\u1EA3ng AI gi\xFAp b\u1EA1n t\u1EA1o video chuy\xEAn nghi\u1EC7p ch\u1EC9 trong v\xE0i ph\xFAt"
                          )), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_v_col, {
                    cols: "12",
                    lg: "6"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_v_row, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_v_col, {
                                cols: "6",
                                lg: "4"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<div class="footer-section footer-links" data-v-e0961aad${_scopeId5}><h4 data-v-e0961aad${_scopeId5}>S\u1EA3n ph\u1EA9m</h4><nav data-v-e0961aad${_scopeId5}><!--[-->`);
                                    ssrRenderList([
                                      { title: "T\xEDnh n\u0103ng", value: "features" },
                                      { title: "H\u01B0\u1EDBng d\u1EABn", value: "tutorial" },
                                      { title: "\u0110\u0103ng k\xFD g\xF3i d\u1ECBch v\u1EE5", value: "pricing" }
                                    ], (item, index) => {
                                      _push6(`<a class="cursor-pointer" data-v-e0961aad${_scopeId5}>${ssrInterpolate(item.title)}</a>`);
                                    });
                                    _push6(`<!--]--></nav></div>`);
                                  } else {
                                    return [
                                      createVNode("div", { class: "footer-section footer-links" }, [
                                        createVNode("h4", null, "S\u1EA3n ph\u1EA9m"),
                                        createVNode("nav", null, [
                                          (openBlock(), createBlock(Fragment, null, renderList([
                                            { title: "T\xEDnh n\u0103ng", value: "features" },
                                            { title: "H\u01B0\u1EDBng d\u1EABn", value: "tutorial" },
                                            { title: "\u0110\u0103ng k\xFD g\xF3i d\u1ECBch v\u1EE5", value: "pricing" }
                                          ], (item, index) => {
                                            return createVNode("a", {
                                              key: index,
                                              class: "cursor-pointer",
                                              onClick: ($event) => onClickNavigate(item.value)
                                            }, toDisplayString(item.title), 9, ["onClick"]);
                                          }), 64))
                                        ])
                                      ])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_v_col, {
                                cols: "6",
                                lg: "4"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<div class="footer-section footer-links" data-v-e0961aad${_scopeId5}><h4 data-v-e0961aad${_scopeId5}>T\xE0i nguy\xEAn</h4><nav data-v-e0961aad${_scopeId5}><!--[-->`);
                                    ssrRenderList([
                                      { title: "Li\xEAn h\u1EC7 Zalo", value: "contact" },
                                      { title: "Tham gia nh\xF3m Zalo", value: "zalo-group" },
                                      { title: "Ch\xEDnh s\xE1ch", value: "terms" }
                                    ], (item, index) => {
                                      _push6(`<a class="cursor-pointer" data-v-e0961aad${_scopeId5}>${ssrInterpolate(item.title)}</a>`);
                                    });
                                    _push6(`<!--]--></nav></div>`);
                                  } else {
                                    return [
                                      createVNode("div", { class: "footer-section footer-links" }, [
                                        createVNode("h4", null, "T\xE0i nguy\xEAn"),
                                        createVNode("nav", null, [
                                          (openBlock(), createBlock(Fragment, null, renderList([
                                            { title: "Li\xEAn h\u1EC7 Zalo", value: "contact" },
                                            { title: "Tham gia nh\xF3m Zalo", value: "zalo-group" },
                                            { title: "Ch\xEDnh s\xE1ch", value: "terms" }
                                          ], (item, index) => {
                                            return createVNode("a", {
                                              key: index,
                                              class: "cursor-pointer",
                                              onClick: ($event) => onClickNavigate(item.value)
                                            }, toDisplayString(item.title), 9, ["onClick"]);
                                          }), 64))
                                        ])
                                      ])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_v_col, {
                                cols: "6",
                                lg: "4"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<div class="footer-section footer-links" data-v-e0961aad${_scopeId5}><h4 data-v-e0961aad${_scopeId5}>K\u1EBFt n\u1ED1i</h4><nav data-v-e0961aad${_scopeId5}><a target="_blank" href="https://www.tiktok.com/@tiencodeweb" class="d-flex align-center ga-2" data-v-e0961aad${_scopeId5}><img${ssrRenderAttr("src", _imports_0)} style="${ssrRenderStyle({ "width": "1.3rem" })}" data-v-e0961aad${_scopeId5}><span style="${ssrRenderStyle({ "margin-bottom": "2.6px" })}" data-v-e0961aad${_scopeId5}>@tiencodeweb</span></a><a target="_blank" href="https://www.youtube.com/@tiencodeweb" class="d-flex align-center ga-2" data-v-e0961aad${_scopeId5}><img${ssrRenderAttr("src", _imports_1)} style="${ssrRenderStyle({ "width": "1.3rem" })}" data-v-e0961aad${_scopeId5}><span style="${ssrRenderStyle({ "margin-bottom": "2.6px" })}" data-v-e0961aad${_scopeId5}>@tiencodeweb</span></a></nav></div>`);
                                  } else {
                                    return [
                                      createVNode("div", { class: "footer-section footer-links" }, [
                                        createVNode("h4", null, "K\u1EBFt n\u1ED1i"),
                                        createVNode("nav", null, [
                                          createVNode("a", {
                                            target: "_blank",
                                            href: "https://www.tiktok.com/@tiencodeweb",
                                            class: "d-flex align-center ga-2"
                                          }, [
                                            createVNode("img", {
                                              src: _imports_0,
                                              style: { "width": "1.3rem" }
                                            }),
                                            createVNode("span", { style: { "margin-bottom": "2.6px" } }, "@tiencodeweb")
                                          ]),
                                          createVNode("a", {
                                            target: "_blank",
                                            href: "https://www.youtube.com/@tiencodeweb",
                                            class: "d-flex align-center ga-2"
                                          }, [
                                            createVNode("img", {
                                              src: _imports_1,
                                              style: { "width": "1.3rem" }
                                            }),
                                            createVNode("span", { style: { "margin-bottom": "2.6px" } }, "@tiencodeweb")
                                          ])
                                        ])
                                      ])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_v_col, {
                                  cols: "6",
                                  lg: "4"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "footer-section footer-links" }, [
                                      createVNode("h4", null, "S\u1EA3n ph\u1EA9m"),
                                      createVNode("nav", null, [
                                        (openBlock(), createBlock(Fragment, null, renderList([
                                          { title: "T\xEDnh n\u0103ng", value: "features" },
                                          { title: "H\u01B0\u1EDBng d\u1EABn", value: "tutorial" },
                                          { title: "\u0110\u0103ng k\xFD g\xF3i d\u1ECBch v\u1EE5", value: "pricing" }
                                        ], (item, index) => {
                                          return createVNode("a", {
                                            key: index,
                                            class: "cursor-pointer",
                                            onClick: ($event) => onClickNavigate(item.value)
                                          }, toDisplayString(item.title), 9, ["onClick"]);
                                        }), 64))
                                      ])
                                    ])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_v_col, {
                                  cols: "6",
                                  lg: "4"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "footer-section footer-links" }, [
                                      createVNode("h4", null, "T\xE0i nguy\xEAn"),
                                      createVNode("nav", null, [
                                        (openBlock(), createBlock(Fragment, null, renderList([
                                          { title: "Li\xEAn h\u1EC7 Zalo", value: "contact" },
                                          { title: "Tham gia nh\xF3m Zalo", value: "zalo-group" },
                                          { title: "Ch\xEDnh s\xE1ch", value: "terms" }
                                        ], (item, index) => {
                                          return createVNode("a", {
                                            key: index,
                                            class: "cursor-pointer",
                                            onClick: ($event) => onClickNavigate(item.value)
                                          }, toDisplayString(item.title), 9, ["onClick"]);
                                        }), 64))
                                      ])
                                    ])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_v_col, {
                                  cols: "6",
                                  lg: "4"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "footer-section footer-links" }, [
                                      createVNode("h4", null, "K\u1EBFt n\u1ED1i"),
                                      createVNode("nav", null, [
                                        createVNode("a", {
                                          target: "_blank",
                                          href: "https://www.tiktok.com/@tiencodeweb",
                                          class: "d-flex align-center ga-2"
                                        }, [
                                          createVNode("img", {
                                            src: _imports_0,
                                            style: { "width": "1.3rem" }
                                          }),
                                          createVNode("span", { style: { "margin-bottom": "2.6px" } }, "@tiencodeweb")
                                        ]),
                                        createVNode("a", {
                                          target: "_blank",
                                          href: "https://www.youtube.com/@tiencodeweb",
                                          class: "d-flex align-center ga-2"
                                        }, [
                                          createVNode("img", {
                                            src: _imports_1,
                                            style: { "width": "1.3rem" }
                                          }),
                                          createVNode("span", { style: { "margin-bottom": "2.6px" } }, "@tiencodeweb")
                                        ])
                                      ])
                                    ])
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_v_row, null, {
                            default: withCtx(() => [
                              createVNode(_component_v_col, {
                                cols: "6",
                                lg: "4"
                              }, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "footer-section footer-links" }, [
                                    createVNode("h4", null, "S\u1EA3n ph\u1EA9m"),
                                    createVNode("nav", null, [
                                      (openBlock(), createBlock(Fragment, null, renderList([
                                        { title: "T\xEDnh n\u0103ng", value: "features" },
                                        { title: "H\u01B0\u1EDBng d\u1EABn", value: "tutorial" },
                                        { title: "\u0110\u0103ng k\xFD g\xF3i d\u1ECBch v\u1EE5", value: "pricing" }
                                      ], (item, index) => {
                                        return createVNode("a", {
                                          key: index,
                                          class: "cursor-pointer",
                                          onClick: ($event) => onClickNavigate(item.value)
                                        }, toDisplayString(item.title), 9, ["onClick"]);
                                      }), 64))
                                    ])
                                  ])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_v_col, {
                                cols: "6",
                                lg: "4"
                              }, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "footer-section footer-links" }, [
                                    createVNode("h4", null, "T\xE0i nguy\xEAn"),
                                    createVNode("nav", null, [
                                      (openBlock(), createBlock(Fragment, null, renderList([
                                        { title: "Li\xEAn h\u1EC7 Zalo", value: "contact" },
                                        { title: "Tham gia nh\xF3m Zalo", value: "zalo-group" },
                                        { title: "Ch\xEDnh s\xE1ch", value: "terms" }
                                      ], (item, index) => {
                                        return createVNode("a", {
                                          key: index,
                                          class: "cursor-pointer",
                                          onClick: ($event) => onClickNavigate(item.value)
                                        }, toDisplayString(item.title), 9, ["onClick"]);
                                      }), 64))
                                    ])
                                  ])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_v_col, {
                                cols: "6",
                                lg: "4"
                              }, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "footer-section footer-links" }, [
                                    createVNode("h4", null, "K\u1EBFt n\u1ED1i"),
                                    createVNode("nav", null, [
                                      createVNode("a", {
                                        target: "_blank",
                                        href: "https://www.tiktok.com/@tiencodeweb",
                                        class: "d-flex align-center ga-2"
                                      }, [
                                        createVNode("img", {
                                          src: _imports_0,
                                          style: { "width": "1.3rem" }
                                        }),
                                        createVNode("span", { style: { "margin-bottom": "2.6px" } }, "@tiencodeweb")
                                      ]),
                                      createVNode("a", {
                                        target: "_blank",
                                        href: "https://www.youtube.com/@tiencodeweb",
                                        class: "d-flex align-center ga-2"
                                      }, [
                                        createVNode("img", {
                                          src: _imports_1,
                                          style: { "width": "1.3rem" }
                                        }),
                                        createVNode("span", { style: { "margin-bottom": "2.6px" } }, "@tiencodeweb")
                                      ])
                                    ])
                                  ])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_v_col, {
                      cols: "12",
                      lg: "6"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", null, [
                          createVNode(_component_v_img, {
                            src: "/images/tn-solve-icon.png",
                            "lazy-src": "/images/tn-solve-logo.png",
                            class: `w-10rem  b-radius-1`
                          })
                        ]),
                        createVNode("p", { class: "tagline mt-2" }, toDisplayString(_ctx.$t(
                          "N\u1EC1n t\u1EA3ng AI gi\xFAp b\u1EA1n t\u1EA1o video chuy\xEAn nghi\u1EC7p ch\u1EC9 trong v\xE0i ph\xFAt"
                        )), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(_component_v_col, {
                      cols: "12",
                      lg: "6"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_v_row, null, {
                          default: withCtx(() => [
                            createVNode(_component_v_col, {
                              cols: "6",
                              lg: "4"
                            }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "footer-section footer-links" }, [
                                  createVNode("h4", null, "S\u1EA3n ph\u1EA9m"),
                                  createVNode("nav", null, [
                                    (openBlock(), createBlock(Fragment, null, renderList([
                                      { title: "T\xEDnh n\u0103ng", value: "features" },
                                      { title: "H\u01B0\u1EDBng d\u1EABn", value: "tutorial" },
                                      { title: "\u0110\u0103ng k\xFD g\xF3i d\u1ECBch v\u1EE5", value: "pricing" }
                                    ], (item, index) => {
                                      return createVNode("a", {
                                        key: index,
                                        class: "cursor-pointer",
                                        onClick: ($event) => onClickNavigate(item.value)
                                      }, toDisplayString(item.title), 9, ["onClick"]);
                                    }), 64))
                                  ])
                                ])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_v_col, {
                              cols: "6",
                              lg: "4"
                            }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "footer-section footer-links" }, [
                                  createVNode("h4", null, "T\xE0i nguy\xEAn"),
                                  createVNode("nav", null, [
                                    (openBlock(), createBlock(Fragment, null, renderList([
                                      { title: "Li\xEAn h\u1EC7 Zalo", value: "contact" },
                                      { title: "Tham gia nh\xF3m Zalo", value: "zalo-group" },
                                      { title: "Ch\xEDnh s\xE1ch", value: "terms" }
                                    ], (item, index) => {
                                      return createVNode("a", {
                                        key: index,
                                        class: "cursor-pointer",
                                        onClick: ($event) => onClickNavigate(item.value)
                                      }, toDisplayString(item.title), 9, ["onClick"]);
                                    }), 64))
                                  ])
                                ])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_v_col, {
                              cols: "6",
                              lg: "4"
                            }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "footer-section footer-links" }, [
                                  createVNode("h4", null, "K\u1EBFt n\u1ED1i"),
                                  createVNode("nav", null, [
                                    createVNode("a", {
                                      target: "_blank",
                                      href: "https://www.tiktok.com/@tiencodeweb",
                                      class: "d-flex align-center ga-2"
                                    }, [
                                      createVNode("img", {
                                        src: _imports_0,
                                        style: { "width": "1.3rem" }
                                      }),
                                      createVNode("span", { style: { "margin-bottom": "2.6px" } }, "@tiencodeweb")
                                    ]),
                                    createVNode("a", {
                                      target: "_blank",
                                      href: "https://www.youtube.com/@tiencodeweb",
                                      class: "d-flex align-center ga-2"
                                    }, [
                                      createVNode("img", {
                                        src: _imports_1,
                                        style: { "width": "1.3rem" }
                                      }),
                                      createVNode("span", { style: { "margin-bottom": "2.6px" } }, "@tiencodeweb")
                                    ])
                                  ])
                                ])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="footer-bottom" data-v-e0961aad${_scopeId}><span data-v-e0961aad${_scopeId}> \xA9 ${ssrInterpolate(unref(currentYear))} TN Solve. C\u1EA3m \u01A1n b\u1EA1n \u0111\xE3 tin t\u01B0\u1EDFng v\xE0 s\u1EED d\u1EE5ng d\u1ECBch v\u1EE5 c\u1EE7a ch\xFAng t\xF4i. </span></div>`);
          } else {
            return [
              createVNode(_component_v_row, null, {
                default: withCtx(() => [
                  createVNode(_component_v_col, {
                    cols: "12",
                    lg: "6"
                  }, {
                    default: withCtx(() => [
                      createVNode("div", null, [
                        createVNode(_component_v_img, {
                          src: "/images/tn-solve-icon.png",
                          "lazy-src": "/images/tn-solve-logo.png",
                          class: `w-10rem  b-radius-1`
                        })
                      ]),
                      createVNode("p", { class: "tagline mt-2" }, toDisplayString(_ctx.$t(
                        "N\u1EC1n t\u1EA3ng AI gi\xFAp b\u1EA1n t\u1EA1o video chuy\xEAn nghi\u1EC7p ch\u1EC9 trong v\xE0i ph\xFAt"
                      )), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(_component_v_col, {
                    cols: "12",
                    lg: "6"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_v_row, null, {
                        default: withCtx(() => [
                          createVNode(_component_v_col, {
                            cols: "6",
                            lg: "4"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "footer-section footer-links" }, [
                                createVNode("h4", null, "S\u1EA3n ph\u1EA9m"),
                                createVNode("nav", null, [
                                  (openBlock(), createBlock(Fragment, null, renderList([
                                    { title: "T\xEDnh n\u0103ng", value: "features" },
                                    { title: "H\u01B0\u1EDBng d\u1EABn", value: "tutorial" },
                                    { title: "\u0110\u0103ng k\xFD g\xF3i d\u1ECBch v\u1EE5", value: "pricing" }
                                  ], (item, index) => {
                                    return createVNode("a", {
                                      key: index,
                                      class: "cursor-pointer",
                                      onClick: ($event) => onClickNavigate(item.value)
                                    }, toDisplayString(item.title), 9, ["onClick"]);
                                  }), 64))
                                ])
                              ])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_v_col, {
                            cols: "6",
                            lg: "4"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "footer-section footer-links" }, [
                                createVNode("h4", null, "T\xE0i nguy\xEAn"),
                                createVNode("nav", null, [
                                  (openBlock(), createBlock(Fragment, null, renderList([
                                    { title: "Li\xEAn h\u1EC7 Zalo", value: "contact" },
                                    { title: "Tham gia nh\xF3m Zalo", value: "zalo-group" },
                                    { title: "Ch\xEDnh s\xE1ch", value: "terms" }
                                  ], (item, index) => {
                                    return createVNode("a", {
                                      key: index,
                                      class: "cursor-pointer",
                                      onClick: ($event) => onClickNavigate(item.value)
                                    }, toDisplayString(item.title), 9, ["onClick"]);
                                  }), 64))
                                ])
                              ])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_v_col, {
                            cols: "6",
                            lg: "4"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "footer-section footer-links" }, [
                                createVNode("h4", null, "K\u1EBFt n\u1ED1i"),
                                createVNode("nav", null, [
                                  createVNode("a", {
                                    target: "_blank",
                                    href: "https://www.tiktok.com/@tiencodeweb",
                                    class: "d-flex align-center ga-2"
                                  }, [
                                    createVNode("img", {
                                      src: _imports_0,
                                      style: { "width": "1.3rem" }
                                    }),
                                    createVNode("span", { style: { "margin-bottom": "2.6px" } }, "@tiencodeweb")
                                  ]),
                                  createVNode("a", {
                                    target: "_blank",
                                    href: "https://www.youtube.com/@tiencodeweb",
                                    class: "d-flex align-center ga-2"
                                  }, [
                                    createVNode("img", {
                                      src: _imports_1,
                                      style: { "width": "1.3rem" }
                                    }),
                                    createVNode("span", { style: { "margin-bottom": "2.6px" } }, "@tiencodeweb")
                                  ])
                                ])
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode("div", { class: "footer-bottom" }, [
                createVNode("span", null, " \xA9 " + toDisplayString(unref(currentYear)) + " TN Solve. C\u1EA3m \u01A1n b\u1EA1n \u0111\xE3 tin t\u01B0\u1EDFng v\xE0 s\u1EED d\u1EE5ng d\u1ECBch v\u1EE5 c\u1EE7a ch\xFAng t\xF4i. ", 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</footer>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layouts/AppFooter.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AppFooter = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-e0961aad"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    useRouter$1();
    const localePath = useLocalePath();
    const { t } = useI18n();
    const { isMobile } = useDevice();
    const { onActionGetUserData, onGetterDisplayLogin: displayLogin } = useAppStore();
    const { onActionAllMasterDataClient } = useMasterDataStore();
    const loading = ref(true);
    const pathArray = computed(() => {
      const parts = route.path.split("/");
      const filteredParts = parts.filter((i) => i);
      return filteredParts.slice(1);
    });
    const onReturnTitle = (title) => {
      switch (title) {
        case "create": {
          return "T\u1EA1o video";
        }
        case "video": {
          return "Th\u01B0 vi\u1EC7n c\u1EE7a t\xF4i";
        }
        case "setting": {
          return "C\xE0i \u0111\u1EB7t";
        }
        case "terms": {
          return "Ch\xEDnh s\xE1ch";
        }
        case "pricing": {
          return "\u0110\u0103ng k\xFD g\xF3i d\u1ECBch v\u1EE5";
        }
        case "tutorial": {
          return "H\u01B0\u1EDBng d\u1EABn";
        }
        case "features": {
          return "T\xEDnh n\u0103ng";
        }
        default: {
          return "Chi ti\u1EBFt";
        }
      }
    };
    const breadcrumbsItems = computed(() => {
      return [
        {
          title: t("Trang ch\u1EE7"),
          disabled: false,
          href: "/"
        },
        ...pathArray.value.map((part, index) => ({
          title: t(onReturnTitle(part)),
          disabled: index === pathArray.value.length - 1,
          href: `/${pathArray.value.slice(0, index + 1).join("/")}`
        }))
      ];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppLoading = __nuxt_component_0;
      const _component_v_app = resolveComponent("v-app");
      const _component_PopupMessage = __nuxt_component_1;
      const _component_v_main = resolveComponent("v-main");
      const _component_v_container = resolveComponent("v-container");
      const _component_v_breadcrumbs = resolveComponent("v-breadcrumbs");
      const _component_v_icon = resolveComponent("v-icon");
      const _component_NuxtPage = __nuxt_component_2;
      _push(`<!--[-->`);
      if (unref(loading) || !unref(breadcrumbsItems) || !unref(breadcrumbsItems).length) {
        _push(ssrRenderComponent(_component_AppLoading, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_v_app, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_PopupMessage, null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(AppHeader, null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_v_main, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_v_container, {
                    "max-width": "1400",
                    class: "mt-4"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="${ssrRenderClass({ "mx-4": unref(isMobile) })}" data-v-c043ff9a${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_v_breadcrumbs, {
                          style: ![`${unref(localePath)("/")}`].includes(unref(route).path) && unref(breadcrumbsItems) && unref(breadcrumbsItems).length ? null : { display: "none" },
                          items: unref(breadcrumbsItems),
                          class: "mb-6"
                        }, {
                          prepend: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_v_icon, { icon: "mdi-home-outline" }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_v_icon, { icon: "mdi-home-outline" })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_NuxtPage, null, null, _parent4, _scopeId3));
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", {
                            class: { "mx-4": unref(isMobile) }
                          }, [
                            withDirectives(createVNode(_component_v_breadcrumbs, {
                              items: unref(breadcrumbsItems),
                              class: "mb-6"
                            }, {
                              prepend: withCtx(() => [
                                createVNode(_component_v_icon, { icon: "mdi-home-outline" })
                              ]),
                              _: 1
                            }, 8, ["items"]), [
                              [
                                vShow,
                                ![`${unref(localePath)("/")}`].includes(unref(route).path) && unref(breadcrumbsItems) && unref(breadcrumbsItems).length
                              ]
                            ]),
                            createVNode(_component_NuxtPage)
                          ], 2)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_v_container, {
                      "max-width": "1400",
                      class: "mt-4"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", {
                          class: { "mx-4": unref(isMobile) }
                        }, [
                          withDirectives(createVNode(_component_v_breadcrumbs, {
                            items: unref(breadcrumbsItems),
                            class: "mb-6"
                          }, {
                            prepend: withCtx(() => [
                              createVNode(_component_v_icon, { icon: "mdi-home-outline" })
                            ]),
                            _: 1
                          }, 8, ["items"]), [
                            [
                              vShow,
                              ![`${unref(localePath)("/")}`].includes(unref(route).path) && unref(breadcrumbsItems) && unref(breadcrumbsItems).length
                            ]
                          ]),
                          createVNode(_component_NuxtPage)
                        ], 2)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(AppFooter, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_PopupMessage),
              createVNode(AppHeader),
              createVNode(_component_v_main, null, {
                default: withCtx(() => [
                  createVNode(_component_v_container, {
                    "max-width": "1400",
                    class: "mt-4"
                  }, {
                    default: withCtx(() => [
                      createVNode("div", {
                        class: { "mx-4": unref(isMobile) }
                      }, [
                        withDirectives(createVNode(_component_v_breadcrumbs, {
                          items: unref(breadcrumbsItems),
                          class: "mb-6"
                        }, {
                          prepend: withCtx(() => [
                            createVNode(_component_v_icon, { icon: "mdi-home-outline" })
                          ]),
                          _: 1
                        }, 8, ["items"]), [
                          [
                            vShow,
                            ![`${unref(localePath)("/")}`].includes(unref(route).path) && unref(breadcrumbsItems) && unref(breadcrumbsItems).length
                          ]
                        ]),
                        createVNode(_component_NuxtPage)
                      ], 2)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(AppFooter)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c043ff9a"]]);

export { _default as default };
//# sourceMappingURL=default-CrRpjNGc.mjs.map
