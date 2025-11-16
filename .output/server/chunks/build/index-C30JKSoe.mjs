import { _ as __nuxt_component_0 } from './ConfirmDialog-Df9nJcuZ.mjs';
import { _ as _sfc_main$1 } from './ButtonCreateVideo-Dut5_jms.mjs';
import { defineComponent, reactive, ref, resolveComponent, unref, mergeProps, withCtx, createTextVNode, createVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderStyle, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { p as productService } from './product-BGXEFPOO.mjs';
import { _ as _export_sfc, e as useI18n } from './server.mjs';
import { u as useDevice, a as useSeo } from './index-BKshJpnN.mjs';
import { d as downloadVideo } from './helper-QcO-vDIR.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const { width, isMobile } = useDevice();
    const params = reactive({
      search: "",
      page: 1,
      limit: 24
    });
    const products = ref({});
    const loading = ref("");
    const loadMore = ref(null);
    const confirmDialogRef = ref(null);
    const onGetProducts = async (loadingType = "") => {
      loading.value = loadingType;
      await productService.getProductMyLibrary(params).then((res) => {
        var _a, _b;
        if (params.page === 1) {
          products.value = res.data;
        } else {
          products.value = {
            ...products.value || {},
            docs: [...((_a = products.value) == null ? void 0 : _a.docs) || [], ...((_b = res.data) == null ? void 0 : _b.docs) || []]
          };
        }
      }).finally(() => {
        loading.value = "";
      });
    };
    const onClickDotMenuItem = (type, data) => {
      if (type === "download-video") {
        downloadVideo(data.video, data.title);
        return;
      } else if (type === "delete-video") {
        confirmDialogRef.value.show({
          noTransMsg: true,
          message: t("B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n xo\xE1 video n\xE0y kh\xF4ng?"),
          onConfirm: async () => {
            try {
              await productService.actionProduct({
                ids: [data._id],
                action: "delete"
              });
              params.page = 1;
              await onGetProducts();
            } catch (error) {
              console.error(error);
            }
          }
        });
        return;
      }
    };
    useSeo({
      title: t("Th\u01B0 vi\u1EC7n c\u1EE7a t\xF4i"),
      description: "N\u1EC1n t\u1EA3ng AI gi\xFAp b\u1EA1n t\u1EA1o video chuy\xEAn nghi\u1EC7p ch\u1EC9 trong v\xE0i ph\xFAt",
      image: "/images/page-video.png"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_v_progress_circular = resolveComponent("v-progress-circular");
      const _component_ConfirmDialog = __nuxt_component_0;
      const _component_v_row = resolveComponent("v-row");
      const _component_v_col = resolveComponent("v-col");
      const _component_router_link = resolveComponent("router-link");
      const _component_v_skeleton_loader = resolveComponent("v-skeleton-loader");
      const _component_v_icon = resolveComponent("v-icon");
      const _component_v_menu = resolveComponent("v-menu");
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_card = resolveComponent("v-card");
      const _component_v_list = resolveComponent("v-list");
      const _component_v_list_item = resolveComponent("v-list-item");
      const _component_ButtonCreateVideo = _sfc_main$1;
      if (Boolean(unref(loading) === "list")) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "d-flex justify-center flex-column align-center ga-3 pt-10 pb-16" }, _attrs))} data-v-25ab6b44>`);
        _push(ssrRenderComponent(_component_v_progress_circular, {
          width: "2",
          size: "40",
          color: "primary",
          indeterminate: ""
        }, null, _parent));
        _push(` ${ssrInterpolate(_ctx.$t("\u0110ang t\u1EA3i d\u1EEF li\u1EC7u..."))}</div>`);
      } else {
        _push(`<div${ssrRenderAttrs(_attrs)} data-v-25ab6b44>`);
        _push(ssrRenderComponent(_component_ConfirmDialog, {
          ref_key: "confirmDialogRef",
          ref: confirmDialogRef
        }, null, _parent));
        _push(`<div class="mb-4" data-v-25ab6b44><span class="text-error" data-v-25ab6b44> \u26A0\uFE0F L\u01B0u \xFD: Th\u1EDDi gian l\u01B0u tr\u1EEF cho video \u0111\xE3 t\u1EA1o l\xE0 12 gi\u1EDD. Xin qu\xFD kh\xE1ch vui l\xF2ng t\u1EA3i xu\u1ED1ng v\xE0 l\u01B0u tr\u1EEF \u0111\u1EC3 tr\xE1nh m\u1EA5t m\xE1t d\u1EEF li\u1EC7u. </span></div>`);
        _push(ssrRenderComponent(_component_v_row, { dense: unref(isMobile) }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<!--[-->`);
              ssrRenderList(unref(products).docs, (item, index2) => {
                _push2(ssrRenderComponent(_component_v_col, {
                  key: index2,
                  lg: "4",
                  md: "6",
                  sm: "12",
                  cols: "12"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_router_link, {
                        class: "d-flex cursor-pointer un-select video-card",
                        style: { "border-radius": "6px", "box-shadow": "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px" },
                        to: `/video/${item._id}`
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            if (item.state === "success" && item.video) {
                              _push4(`<div class="relative d-flex" data-v-25ab6b44${_scopeId3}><video class="cursor-pointer bg-black" style="${ssrRenderStyle([
                                { "border-radius": "6px 0 0 6px" },
                                item.frameRate === "Kh\u1ED5 ngang (16:9)" ? { "object-fit": "cover" } : {}
                              ])}"${ssrRenderAttr("width", unref(width) > 650 ? 160 : 140)}${ssrRenderAttr("height", unref(width) > 650 ? 101.25 : 90)} data-v-25ab6b44${_scopeId3}><source${ssrRenderAttr("src", item.video)} type="video/mp4" data-v-25ab6b44${_scopeId3}></video><span class="video-duration" data-v-25ab6b44${_scopeId3}>${ssrInterpolate(item.videoDuration)}</span></div>`);
                            } else if (item.state === "primary") {
                              _push4(`<div class="relative" data-v-25ab6b44${_scopeId3}>`);
                              _push4(ssrRenderComponent(_component_v_skeleton_loader, {
                                style: [{ "border-radius": "6px 0 0 6px" }, {
                                  width: unref(width) > 650 ? "160px" : "140px",
                                  height: unref(width) > 650 ? "101.25px" : "90px"
                                }]
                              }, null, _parent4, _scopeId3));
                              _push4(`<div class="absolute d-flex flex-column align-center justify-center ga-2 bg-opacity-90" style="${ssrRenderStyle({ "top": "0", "left": "0", "right": "0", "bottom": "0" })}" data-v-25ab6b44${_scopeId3}>`);
                              _push4(ssrRenderComponent(_component_v_icon, {
                                size: "24",
                                color: "blue"
                              }, {
                                default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                  if (_push5) {
                                    _push5(`mdi-progress-helper`);
                                  } else {
                                    return [
                                      createTextVNode("mdi-progress-helper")
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent4, _scopeId3));
                              _push4(`</div></div>`);
                            } else {
                              _push4(`<div class="d-flex align-center justify-center cursor-pointer ga-1 bg-grey-lighten-3" style="${ssrRenderStyle([{ "border-radius": "6px 0 0 6px" }, {
                                width: unref(width) > 650 ? "160px" : "140px",
                                height: unref(width) > 650 ? "101.25px" : "90px"
                              }])}" data-v-25ab6b44${_scopeId3}>`);
                              _push4(ssrRenderComponent(_component_v_icon, {
                                size: "24",
                                color: "error"
                              }, {
                                default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                  if (_push5) {
                                    _push5(`mdi-alert-circle-outline`);
                                  } else {
                                    return [
                                      createTextVNode("mdi-alert-circle-outline")
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent4, _scopeId3));
                              _push4(`</div>`);
                            }
                            _push4(`<div class="d-flex flex-column flex-1 pa-3 pt-2" data-v-25ab6b44${_scopeId3}><h4 class="video-card-title font-bold line-clamp-2 cursor-pointer mb-1" style="${ssrRenderStyle({ "line-height": "1.4rem" })}" data-v-25ab6b44${_scopeId3}>${ssrInterpolate(item.title)}</h4><small data-v-25ab6b44${_scopeId3}>${ssrInterpolate(item.createdAt)}</small></div>`);
                            _push4(ssrRenderComponent(_component_v_menu, { location: "bottom right" }, {
                              activator: withCtx(({ props }, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(_component_v_btn, mergeProps({ ref_for: true }, props, {
                                    size: "40",
                                    variant: "text",
                                    icon: "mdi-dots-vertical",
                                    onClick: () => {
                                    }
                                  }), null, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(_component_v_btn, mergeProps({ ref_for: true }, props, {
                                      size: "40",
                                      variant: "text",
                                      icon: "mdi-dots-vertical",
                                      onClick: withModifiers(() => {
                                      }, ["prevent", "stop"])
                                    }), null, 16, ["onClick"])
                                  ];
                                }
                              }),
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(_component_v_card, { "min-width": "200" }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(_component_v_list, null, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(`<!--[-->`);
                                              ssrRenderList([
                                                {
                                                  title: "T\u1EA3i video",
                                                  value: "download-video",
                                                  icon: "mdi-tray-arrow-down"
                                                },
                                                {
                                                  title: "Xo\xE1 video",
                                                  value: "delete-video",
                                                  icon: "mdi-delete-outline"
                                                }
                                              ], (menu, index22) => {
                                                _push7(ssrRenderComponent(_component_v_list_item, {
                                                  key: index22,
                                                  value: menu.value,
                                                  class: {
                                                    disabled: item.state === "primary" || menu.value === "download-video" && item.state === "error"
                                                  },
                                                  onClick: ($event) => onClickDotMenuItem(menu.value, item)
                                                }, {
                                                  default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                    if (_push8) {
                                                      _push8(`<div class="d-flex align-center ga-4" data-v-25ab6b44${_scopeId7}>`);
                                                      _push8(ssrRenderComponent(_component_v_icon, {
                                                        icon: menu.icon,
                                                        color: `${menu.value === "delete-video" ? "red" : ""}`
                                                      }, null, _parent8, _scopeId7));
                                                      _push8(`<label class="${ssrRenderClass([{ "text-red": menu.value === "delete-video" }, "cursor-pointer"])}" data-v-25ab6b44${_scopeId7}>${ssrInterpolate(_ctx.$t(menu.title))}</label></div>`);
                                                    } else {
                                                      return [
                                                        createVNode("div", { class: "d-flex align-center ga-4" }, [
                                                          createVNode(_component_v_icon, {
                                                            icon: menu.icon,
                                                            color: `${menu.value === "delete-video" ? "red" : ""}`
                                                          }, null, 8, ["icon", "color"]),
                                                          createVNode("label", {
                                                            class: ["cursor-pointer", { "text-red": menu.value === "delete-video" }]
                                                          }, toDisplayString(_ctx.$t(menu.title)), 3)
                                                        ])
                                                      ];
                                                    }
                                                  }),
                                                  _: 2
                                                }, _parent7, _scopeId6));
                                              });
                                              _push7(`<!--]-->`);
                                            } else {
                                              return [
                                                (openBlock(), createBlock(Fragment, null, renderList([
                                                  {
                                                    title: "T\u1EA3i video",
                                                    value: "download-video",
                                                    icon: "mdi-tray-arrow-down"
                                                  },
                                                  {
                                                    title: "Xo\xE1 video",
                                                    value: "delete-video",
                                                    icon: "mdi-delete-outline"
                                                  }
                                                ], (menu, index22) => {
                                                  return createVNode(_component_v_list_item, {
                                                    key: index22,
                                                    value: menu.value,
                                                    class: {
                                                      disabled: item.state === "primary" || menu.value === "download-video" && item.state === "error"
                                                    },
                                                    onClick: ($event) => onClickDotMenuItem(menu.value, item)
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode("div", { class: "d-flex align-center ga-4" }, [
                                                        createVNode(_component_v_icon, {
                                                          icon: menu.icon,
                                                          color: `${menu.value === "delete-video" ? "red" : ""}`
                                                        }, null, 8, ["icon", "color"]),
                                                        createVNode("label", {
                                                          class: ["cursor-pointer", { "text-red": menu.value === "delete-video" }]
                                                        }, toDisplayString(_ctx.$t(menu.title)), 3)
                                                      ])
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["value", "class", "onClick"]);
                                                }), 64))
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(_component_v_list, null, {
                                            default: withCtx(() => [
                                              (openBlock(), createBlock(Fragment, null, renderList([
                                                {
                                                  title: "T\u1EA3i video",
                                                  value: "download-video",
                                                  icon: "mdi-tray-arrow-down"
                                                },
                                                {
                                                  title: "Xo\xE1 video",
                                                  value: "delete-video",
                                                  icon: "mdi-delete-outline"
                                                }
                                              ], (menu, index22) => {
                                                return createVNode(_component_v_list_item, {
                                                  key: index22,
                                                  value: menu.value,
                                                  class: {
                                                    disabled: item.state === "primary" || menu.value === "download-video" && item.state === "error"
                                                  },
                                                  onClick: ($event) => onClickDotMenuItem(menu.value, item)
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode("div", { class: "d-flex align-center ga-4" }, [
                                                      createVNode(_component_v_icon, {
                                                        icon: menu.icon,
                                                        color: `${menu.value === "delete-video" ? "red" : ""}`
                                                      }, null, 8, ["icon", "color"]),
                                                      createVNode("label", {
                                                        class: ["cursor-pointer", { "text-red": menu.value === "delete-video" }]
                                                      }, toDisplayString(_ctx.$t(menu.title)), 3)
                                                    ])
                                                  ]),
                                                  _: 2
                                                }, 1032, ["value", "class", "onClick"]);
                                              }), 64))
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(_component_v_card, { "min-width": "200" }, {
                                      default: withCtx(() => [
                                        createVNode(_component_v_list, null, {
                                          default: withCtx(() => [
                                            (openBlock(), createBlock(Fragment, null, renderList([
                                              {
                                                title: "T\u1EA3i video",
                                                value: "download-video",
                                                icon: "mdi-tray-arrow-down"
                                              },
                                              {
                                                title: "Xo\xE1 video",
                                                value: "delete-video",
                                                icon: "mdi-delete-outline"
                                              }
                                            ], (menu, index22) => {
                                              return createVNode(_component_v_list_item, {
                                                key: index22,
                                                value: menu.value,
                                                class: {
                                                  disabled: item.state === "primary" || menu.value === "download-video" && item.state === "error"
                                                },
                                                onClick: ($event) => onClickDotMenuItem(menu.value, item)
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode("div", { class: "d-flex align-center ga-4" }, [
                                                    createVNode(_component_v_icon, {
                                                      icon: menu.icon,
                                                      color: `${menu.value === "delete-video" ? "red" : ""}`
                                                    }, null, 8, ["icon", "color"]),
                                                    createVNode("label", {
                                                      class: ["cursor-pointer", { "text-red": menu.value === "delete-video" }]
                                                    }, toDisplayString(_ctx.$t(menu.title)), 3)
                                                  ])
                                                ]),
                                                _: 2
                                              }, 1032, ["value", "class", "onClick"]);
                                            }), 64))
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else {
                            return [
                              item.state === "success" && item.video ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "relative d-flex"
                              }, [
                                (openBlock(), createBlock("video", {
                                  class: "cursor-pointer bg-black",
                                  style: [
                                    { "border-radius": "6px 0 0 6px" },
                                    item.frameRate === "Kh\u1ED5 ngang (16:9)" ? { "object-fit": "cover" } : {}
                                  ],
                                  key: item.video,
                                  width: unref(width) > 650 ? 160 : 140,
                                  height: unref(width) > 650 ? 101.25 : 90
                                }, [
                                  createVNode("source", {
                                    src: item.video,
                                    type: "video/mp4"
                                  }, null, 8, ["src"])
                                ], 12, ["width", "height"])),
                                createVNode("span", { class: "video-duration" }, toDisplayString(item.videoDuration), 1)
                              ])) : item.state === "primary" ? (openBlock(), createBlock("div", {
                                key: 1,
                                class: "relative"
                              }, [
                                createVNode(_component_v_skeleton_loader, {
                                  style: [{ "border-radius": "6px 0 0 6px" }, {
                                    width: unref(width) > 650 ? "160px" : "140px",
                                    height: unref(width) > 650 ? "101.25px" : "90px"
                                  }]
                                }, null, 8, ["style"]),
                                createVNode("div", {
                                  class: "absolute d-flex flex-column align-center justify-center ga-2 bg-opacity-90",
                                  style: { "top": "0", "left": "0", "right": "0", "bottom": "0" }
                                }, [
                                  createVNode(_component_v_icon, {
                                    size: "24",
                                    color: "blue"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-progress-helper")
                                    ]),
                                    _: 1
                                  })
                                ])
                              ])) : (openBlock(), createBlock("div", {
                                key: 2,
                                class: "d-flex align-center justify-center cursor-pointer ga-1 bg-grey-lighten-3",
                                style: [{ "border-radius": "6px 0 0 6px" }, {
                                  width: unref(width) > 650 ? "160px" : "140px",
                                  height: unref(width) > 650 ? "101.25px" : "90px"
                                }]
                              }, [
                                createVNode(_component_v_icon, {
                                  size: "24",
                                  color: "error"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-alert-circle-outline")
                                  ]),
                                  _: 1
                                })
                              ], 4)),
                              createVNode("div", { class: "d-flex flex-column flex-1 pa-3 pt-2" }, [
                                createVNode("h4", {
                                  class: "video-card-title font-bold line-clamp-2 cursor-pointer mb-1",
                                  style: { "line-height": "1.4rem" }
                                }, toDisplayString(item.title), 1),
                                createVNode("small", null, toDisplayString(item.createdAt), 1)
                              ]),
                              createVNode(_component_v_menu, { location: "bottom right" }, {
                                activator: withCtx(({ props }) => [
                                  createVNode(_component_v_btn, mergeProps({ ref_for: true }, props, {
                                    size: "40",
                                    variant: "text",
                                    icon: "mdi-dots-vertical",
                                    onClick: withModifiers(() => {
                                    }, ["prevent", "stop"])
                                  }), null, 16, ["onClick"])
                                ]),
                                default: withCtx(() => [
                                  createVNode(_component_v_card, { "min-width": "200" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_v_list, null, {
                                        default: withCtx(() => [
                                          (openBlock(), createBlock(Fragment, null, renderList([
                                            {
                                              title: "T\u1EA3i video",
                                              value: "download-video",
                                              icon: "mdi-tray-arrow-down"
                                            },
                                            {
                                              title: "Xo\xE1 video",
                                              value: "delete-video",
                                              icon: "mdi-delete-outline"
                                            }
                                          ], (menu, index22) => {
                                            return createVNode(_component_v_list_item, {
                                              key: index22,
                                              value: menu.value,
                                              class: {
                                                disabled: item.state === "primary" || menu.value === "download-video" && item.state === "error"
                                              },
                                              onClick: ($event) => onClickDotMenuItem(menu.value, item)
                                            }, {
                                              default: withCtx(() => [
                                                createVNode("div", { class: "d-flex align-center ga-4" }, [
                                                  createVNode(_component_v_icon, {
                                                    icon: menu.icon,
                                                    color: `${menu.value === "delete-video" ? "red" : ""}`
                                                  }, null, 8, ["icon", "color"]),
                                                  createVNode("label", {
                                                    class: ["cursor-pointer", { "text-red": menu.value === "delete-video" }]
                                                  }, toDisplayString(_ctx.$t(menu.title)), 3)
                                                ])
                                              ]),
                                              _: 2
                                            }, 1032, ["value", "class", "onClick"]);
                                          }), 64))
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_router_link, {
                          class: "d-flex cursor-pointer un-select video-card",
                          style: { "border-radius": "6px", "box-shadow": "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px" },
                          to: `/video/${item._id}`
                        }, {
                          default: withCtx(() => [
                            item.state === "success" && item.video ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "relative d-flex"
                            }, [
                              (openBlock(), createBlock("video", {
                                class: "cursor-pointer bg-black",
                                style: [
                                  { "border-radius": "6px 0 0 6px" },
                                  item.frameRate === "Kh\u1ED5 ngang (16:9)" ? { "object-fit": "cover" } : {}
                                ],
                                key: item.video,
                                width: unref(width) > 650 ? 160 : 140,
                                height: unref(width) > 650 ? 101.25 : 90
                              }, [
                                createVNode("source", {
                                  src: item.video,
                                  type: "video/mp4"
                                }, null, 8, ["src"])
                              ], 12, ["width", "height"])),
                              createVNode("span", { class: "video-duration" }, toDisplayString(item.videoDuration), 1)
                            ])) : item.state === "primary" ? (openBlock(), createBlock("div", {
                              key: 1,
                              class: "relative"
                            }, [
                              createVNode(_component_v_skeleton_loader, {
                                style: [{ "border-radius": "6px 0 0 6px" }, {
                                  width: unref(width) > 650 ? "160px" : "140px",
                                  height: unref(width) > 650 ? "101.25px" : "90px"
                                }]
                              }, null, 8, ["style"]),
                              createVNode("div", {
                                class: "absolute d-flex flex-column align-center justify-center ga-2 bg-opacity-90",
                                style: { "top": "0", "left": "0", "right": "0", "bottom": "0" }
                              }, [
                                createVNode(_component_v_icon, {
                                  size: "24",
                                  color: "blue"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-progress-helper")
                                  ]),
                                  _: 1
                                })
                              ])
                            ])) : (openBlock(), createBlock("div", {
                              key: 2,
                              class: "d-flex align-center justify-center cursor-pointer ga-1 bg-grey-lighten-3",
                              style: [{ "border-radius": "6px 0 0 6px" }, {
                                width: unref(width) > 650 ? "160px" : "140px",
                                height: unref(width) > 650 ? "101.25px" : "90px"
                              }]
                            }, [
                              createVNode(_component_v_icon, {
                                size: "24",
                                color: "error"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-alert-circle-outline")
                                ]),
                                _: 1
                              })
                            ], 4)),
                            createVNode("div", { class: "d-flex flex-column flex-1 pa-3 pt-2" }, [
                              createVNode("h4", {
                                class: "video-card-title font-bold line-clamp-2 cursor-pointer mb-1",
                                style: { "line-height": "1.4rem" }
                              }, toDisplayString(item.title), 1),
                              createVNode("small", null, toDisplayString(item.createdAt), 1)
                            ]),
                            createVNode(_component_v_menu, { location: "bottom right" }, {
                              activator: withCtx(({ props }) => [
                                createVNode(_component_v_btn, mergeProps({ ref_for: true }, props, {
                                  size: "40",
                                  variant: "text",
                                  icon: "mdi-dots-vertical",
                                  onClick: withModifiers(() => {
                                  }, ["prevent", "stop"])
                                }), null, 16, ["onClick"])
                              ]),
                              default: withCtx(() => [
                                createVNode(_component_v_card, { "min-width": "200" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_v_list, null, {
                                      default: withCtx(() => [
                                        (openBlock(), createBlock(Fragment, null, renderList([
                                          {
                                            title: "T\u1EA3i video",
                                            value: "download-video",
                                            icon: "mdi-tray-arrow-down"
                                          },
                                          {
                                            title: "Xo\xE1 video",
                                            value: "delete-video",
                                            icon: "mdi-delete-outline"
                                          }
                                        ], (menu, index22) => {
                                          return createVNode(_component_v_list_item, {
                                            key: index22,
                                            value: menu.value,
                                            class: {
                                              disabled: item.state === "primary" || menu.value === "download-video" && item.state === "error"
                                            },
                                            onClick: ($event) => onClickDotMenuItem(menu.value, item)
                                          }, {
                                            default: withCtx(() => [
                                              createVNode("div", { class: "d-flex align-center ga-4" }, [
                                                createVNode(_component_v_icon, {
                                                  icon: menu.icon,
                                                  color: `${menu.value === "delete-video" ? "red" : ""}`
                                                }, null, 8, ["icon", "color"]),
                                                createVNode("label", {
                                                  class: ["cursor-pointer", { "text-red": menu.value === "delete-video" }]
                                                }, toDisplayString(_ctx.$t(menu.title)), 3)
                                              ])
                                            ]),
                                            _: 2
                                          }, 1032, ["value", "class", "onClick"]);
                                        }), 64))
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1032, ["to"])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]--><div data-v-25ab6b44${_scopeId}></div>`);
            } else {
              return [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(products).docs, (item, index2) => {
                  return openBlock(), createBlock(_component_v_col, {
                    key: index2,
                    lg: "4",
                    md: "6",
                    sm: "12",
                    cols: "12"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_router_link, {
                        class: "d-flex cursor-pointer un-select video-card",
                        style: { "border-radius": "6px", "box-shadow": "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px" },
                        to: `/video/${item._id}`
                      }, {
                        default: withCtx(() => [
                          item.state === "success" && item.video ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "relative d-flex"
                          }, [
                            (openBlock(), createBlock("video", {
                              class: "cursor-pointer bg-black",
                              style: [
                                { "border-radius": "6px 0 0 6px" },
                                item.frameRate === "Kh\u1ED5 ngang (16:9)" ? { "object-fit": "cover" } : {}
                              ],
                              key: item.video,
                              width: unref(width) > 650 ? 160 : 140,
                              height: unref(width) > 650 ? 101.25 : 90
                            }, [
                              createVNode("source", {
                                src: item.video,
                                type: "video/mp4"
                              }, null, 8, ["src"])
                            ], 12, ["width", "height"])),
                            createVNode("span", { class: "video-duration" }, toDisplayString(item.videoDuration), 1)
                          ])) : item.state === "primary" ? (openBlock(), createBlock("div", {
                            key: 1,
                            class: "relative"
                          }, [
                            createVNode(_component_v_skeleton_loader, {
                              style: [{ "border-radius": "6px 0 0 6px" }, {
                                width: unref(width) > 650 ? "160px" : "140px",
                                height: unref(width) > 650 ? "101.25px" : "90px"
                              }]
                            }, null, 8, ["style"]),
                            createVNode("div", {
                              class: "absolute d-flex flex-column align-center justify-center ga-2 bg-opacity-90",
                              style: { "top": "0", "left": "0", "right": "0", "bottom": "0" }
                            }, [
                              createVNode(_component_v_icon, {
                                size: "24",
                                color: "blue"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-progress-helper")
                                ]),
                                _: 1
                              })
                            ])
                          ])) : (openBlock(), createBlock("div", {
                            key: 2,
                            class: "d-flex align-center justify-center cursor-pointer ga-1 bg-grey-lighten-3",
                            style: [{ "border-radius": "6px 0 0 6px" }, {
                              width: unref(width) > 650 ? "160px" : "140px",
                              height: unref(width) > 650 ? "101.25px" : "90px"
                            }]
                          }, [
                            createVNode(_component_v_icon, {
                              size: "24",
                              color: "error"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("mdi-alert-circle-outline")
                              ]),
                              _: 1
                            })
                          ], 4)),
                          createVNode("div", { class: "d-flex flex-column flex-1 pa-3 pt-2" }, [
                            createVNode("h4", {
                              class: "video-card-title font-bold line-clamp-2 cursor-pointer mb-1",
                              style: { "line-height": "1.4rem" }
                            }, toDisplayString(item.title), 1),
                            createVNode("small", null, toDisplayString(item.createdAt), 1)
                          ]),
                          createVNode(_component_v_menu, { location: "bottom right" }, {
                            activator: withCtx(({ props }) => [
                              createVNode(_component_v_btn, mergeProps({ ref_for: true }, props, {
                                size: "40",
                                variant: "text",
                                icon: "mdi-dots-vertical",
                                onClick: withModifiers(() => {
                                }, ["prevent", "stop"])
                              }), null, 16, ["onClick"])
                            ]),
                            default: withCtx(() => [
                              createVNode(_component_v_card, { "min-width": "200" }, {
                                default: withCtx(() => [
                                  createVNode(_component_v_list, null, {
                                    default: withCtx(() => [
                                      (openBlock(), createBlock(Fragment, null, renderList([
                                        {
                                          title: "T\u1EA3i video",
                                          value: "download-video",
                                          icon: "mdi-tray-arrow-down"
                                        },
                                        {
                                          title: "Xo\xE1 video",
                                          value: "delete-video",
                                          icon: "mdi-delete-outline"
                                        }
                                      ], (menu, index22) => {
                                        return createVNode(_component_v_list_item, {
                                          key: index22,
                                          value: menu.value,
                                          class: {
                                            disabled: item.state === "primary" || menu.value === "download-video" && item.state === "error"
                                          },
                                          onClick: ($event) => onClickDotMenuItem(menu.value, item)
                                        }, {
                                          default: withCtx(() => [
                                            createVNode("div", { class: "d-flex align-center ga-4" }, [
                                              createVNode(_component_v_icon, {
                                                icon: menu.icon,
                                                color: `${menu.value === "delete-video" ? "red" : ""}`
                                              }, null, 8, ["icon", "color"]),
                                              createVNode("label", {
                                                class: ["cursor-pointer", { "text-red": menu.value === "delete-video" }]
                                              }, toDisplayString(_ctx.$t(menu.title)), 3)
                                            ])
                                          ]),
                                          _: 2
                                        }, 1032, ["value", "class", "onClick"]);
                                      }), 64))
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1032, ["to"])
                    ]),
                    _: 2
                  }, 1024);
                }), 128)),
                createVNode("div", {
                  ref_key: "loadMore",
                  ref: loadMore
                }, null, 512)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_ButtonCreateVideo, { style: { "margin-top": "2rem" } }, null, _parent));
        _push(`</div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/video/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-25ab6b44"]]);

export { index as default };
//# sourceMappingURL=index-C30JKSoe.mjs.map
