import { f as formatCurrency, g as getRankColor } from './helper-QcO-vDIR.mjs';
import { c as commissionTier } from './constants-B3HUeYES.mjs';
import { E as EnumAccountRole } from './enum-kAdbNx_J.mjs';
import { defineComponent, computed, resolveComponent, mergeProps, withCtx, createTextVNode, unref, createVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, createSlots, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useRouter$1, f as useLocalePath } from './server.mjs';
import { u as useAppStore } from './app.store-CsbFmGtW.mjs';
import { u as useMasterDataStore } from './master-data-ZBucjABo.mjs';
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
    const router = useRouter$1();
    const localePath = useLocalePath();
    const { onGetterUserData: userData } = useAppStore();
    const { onGetterMasterData } = useMasterDataStore();
    const dashboard = computed(() => onGetterMasterData.value["dashboard"]);
    const onClickViewDashboardPartnerDetail = (id) => {
      var _a;
      if (((_a = userData.value) == null ? void 0 : _a.role) !== EnumAccountRole.ADMIN) return;
      if (id) router.push(localePath(`/partner?id=${id}`));
      (void 0).location.reload();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_v_container = resolveComponent("v-container");
      const _component_v_row = resolveComponent("v-row");
      const _component_v_col = resolveComponent("v-col");
      const _component_v_card = resolveComponent("v-card");
      const _component_v_card_text = resolveComponent("v-card-text");
      const _component_v_icon = resolveComponent("v-icon");
      const _component_v_card_title = resolveComponent("v-card-title");
      const _component_v_card_subtitle = resolveComponent("v-card-subtitle");
      const _component_v_sheet = resolveComponent("v-sheet");
      const _component_v_list = resolveComponent("v-list");
      const _component_v_list_item = resolveComponent("v-list-item");
      const _component_v_avatar = resolveComponent("v-avatar");
      _push(ssrRenderComponent(_component_v_container, mergeProps({ class: "ma-0 pa-0" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_v_row, { dense: "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                var _a, _b;
                if (_push3) {
                  _push3(ssrRenderComponent(_component_v_col, {
                    cols: "12",
                    lg: "5"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_v_card, {
                          variant: "flat",
                          color: "primary",
                          class: "text-white",
                          height: "100%"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_v_card_text, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<div class="d-flex align-center mb-1"${_scopeId5}>`);
                                    _push6(ssrRenderComponent(_component_v_icon, {
                                      size: "x-large",
                                      class: "opacity-75 mr-3"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`mdi-cash-clock`);
                                        } else {
                                          return [
                                            createTextVNode("mdi-cash-clock")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(`<div class="text-h6 font-bold"${_scopeId5}>S\u1ED1 d\u01B0 ch\u1EDD thanh to\xE1n</div></div><div class="text-h3 font-bold mt-4"${_scopeId5}>${ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(unref(dashboard).pendingBalance))}</div><div class="text-body-2 opacity-80 mt-1"${_scopeId5}> S\u1EBD \u0111\u01B0\u1EE3c thanh to\xE1n v\xE0o k\u1EF3 t\u1EDBi </div>`);
                                  } else {
                                    return [
                                      createVNode("div", { class: "d-flex align-center mb-1" }, [
                                        createVNode(_component_v_icon, {
                                          size: "x-large",
                                          class: "opacity-75 mr-3"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-cash-clock")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode("div", { class: "text-h6 font-bold" }, "S\u1ED1 d\u01B0 ch\u1EDD thanh to\xE1n")
                                      ]),
                                      createVNode("div", { class: "text-h3 font-bold mt-4" }, toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(unref(dashboard).pendingBalance)), 1),
                                      createVNode("div", { class: "text-body-2 opacity-80 mt-1" }, " S\u1EBD \u0111\u01B0\u1EE3c thanh to\xE1n v\xE0o k\u1EF3 t\u1EDBi ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_v_card_text, null, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "d-flex align-center mb-1" }, [
                                      createVNode(_component_v_icon, {
                                        size: "x-large",
                                        class: "opacity-75 mr-3"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-cash-clock")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode("div", { class: "text-h6 font-bold" }, "S\u1ED1 d\u01B0 ch\u1EDD thanh to\xE1n")
                                    ]),
                                    createVNode("div", { class: "text-h3 font-bold mt-4" }, toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(unref(dashboard).pendingBalance)), 1),
                                    createVNode("div", { class: "text-body-2 opacity-80 mt-1" }, " S\u1EBD \u0111\u01B0\u1EE3c thanh to\xE1n v\xE0o k\u1EF3 t\u1EDBi ")
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
                          createVNode(_component_v_card, {
                            variant: "flat",
                            color: "primary",
                            class: "text-white",
                            height: "100%"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_v_card_text, null, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "d-flex align-center mb-1" }, [
                                    createVNode(_component_v_icon, {
                                      size: "x-large",
                                      class: "opacity-75 mr-3"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-cash-clock")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode("div", { class: "text-h6 font-bold" }, "S\u1ED1 d\u01B0 ch\u1EDD thanh to\xE1n")
                                  ]),
                                  createVNode("div", { class: "text-h3 font-bold mt-4" }, toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(unref(dashboard).pendingBalance)), 1),
                                  createVNode("div", { class: "text-body-2 opacity-80 mt-1" }, " S\u1EBD \u0111\u01B0\u1EE3c thanh to\xE1n v\xE0o k\u1EF3 t\u1EDBi ")
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
                  _push3(ssrRenderComponent(_component_v_col, {
                    cols: "12",
                    md: "6",
                    lg: "3"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_v_card, {
                          variant: "tonal",
                          color: "green-darken-1",
                          height: "100%"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_v_card_text, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<div class="d-flex align-center mb-1"${_scopeId5}>`);
                                    _push6(ssrRenderComponent(_component_v_icon, {
                                      size: "large",
                                      class: "mr-3"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`mdi-check-decagram`);
                                        } else {
                                          return [
                                            createTextVNode("mdi-check-decagram")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(`<div class="text-subtitle-1 font-bold text-grey-darken-3"${_scopeId5}> T\u1ED5ng \u0111\xE3 thanh to\xE1n </div></div><div class="text-h4 font-bold text-grey-darken-4 mt-4"${_scopeId5}>${ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(unref(dashboard).paidBalance))}</div>`);
                                  } else {
                                    return [
                                      createVNode("div", { class: "d-flex align-center mb-1" }, [
                                        createVNode(_component_v_icon, {
                                          size: "large",
                                          class: "mr-3"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-check-decagram")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode("div", { class: "text-subtitle-1 font-bold text-grey-darken-3" }, " T\u1ED5ng \u0111\xE3 thanh to\xE1n ")
                                      ]),
                                      createVNode("div", { class: "text-h4 font-bold text-grey-darken-4 mt-4" }, toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(unref(dashboard).paidBalance)), 1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_v_card_text, null, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "d-flex align-center mb-1" }, [
                                      createVNode(_component_v_icon, {
                                        size: "large",
                                        class: "mr-3"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-check-decagram")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode("div", { class: "text-subtitle-1 font-bold text-grey-darken-3" }, " T\u1ED5ng \u0111\xE3 thanh to\xE1n ")
                                    ]),
                                    createVNode("div", { class: "text-h4 font-bold text-grey-darken-4 mt-4" }, toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(unref(dashboard).paidBalance)), 1)
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
                          createVNode(_component_v_card, {
                            variant: "tonal",
                            color: "green-darken-1",
                            height: "100%"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_v_card_text, null, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "d-flex align-center mb-1" }, [
                                    createVNode(_component_v_icon, {
                                      size: "large",
                                      class: "mr-3"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-check-decagram")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode("div", { class: "text-subtitle-1 font-bold text-grey-darken-3" }, " T\u1ED5ng \u0111\xE3 thanh to\xE1n ")
                                  ]),
                                  createVNode("div", { class: "text-h4 font-bold text-grey-darken-4 mt-4" }, toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(unref(dashboard).paidBalance)), 1)
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
                  _push3(ssrRenderComponent(_component_v_col, {
                    cols: "12",
                    md: "6",
                    lg: "4"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_v_row, { dense: "" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_v_col, { cols: "12" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_v_card, {
                                      variant: "tonal",
                                      color: "purple-darken-1"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_v_card_text, null, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`<div class="d-flex align-center"${_scopeId7}>`);
                                                _push8(ssrRenderComponent(_component_v_icon, {
                                                  size: "large",
                                                  class: "mr-3"
                                                }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(`mdi-account-group`);
                                                    } else {
                                                      return [
                                                        createTextVNode("mdi-account-group")
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(`<div${_scopeId7}><div class="text-body-2 text-grey-darken-2"${_scopeId7}> T\u1ED5ng ng\u01B0\u1EDDi \u0111\xE3 gi\u1EDBi thi\u1EC7u \u0111\xE3 thu\xEA </div><div class="text-h5 font-bold text-grey-darken-4"${_scopeId7}>${ssrInterpolate(unref(dashboard).totalReferrals)}</div></div></div>`);
                                              } else {
                                                return [
                                                  createVNode("div", { class: "d-flex align-center" }, [
                                                    createVNode(_component_v_icon, {
                                                      size: "large",
                                                      class: "mr-3"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("mdi-account-group")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode("div", null, [
                                                      createVNode("div", { class: "text-body-2 text-grey-darken-2" }, " T\u1ED5ng ng\u01B0\u1EDDi \u0111\xE3 gi\u1EDBi thi\u1EC7u \u0111\xE3 thu\xEA "),
                                                      createVNode("div", { class: "text-h5 font-bold text-grey-darken-4" }, toDisplayString(unref(dashboard).totalReferrals), 1)
                                                    ])
                                                  ])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_v_card_text, null, {
                                              default: withCtx(() => [
                                                createVNode("div", { class: "d-flex align-center" }, [
                                                  createVNode(_component_v_icon, {
                                                    size: "large",
                                                    class: "mr-3"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-account-group")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode("div", null, [
                                                    createVNode("div", { class: "text-body-2 text-grey-darken-2" }, " T\u1ED5ng ng\u01B0\u1EDDi \u0111\xE3 gi\u1EDBi thi\u1EC7u \u0111\xE3 thu\xEA "),
                                                    createVNode("div", { class: "text-h5 font-bold text-grey-darken-4" }, toDisplayString(unref(dashboard).totalReferrals), 1)
                                                  ])
                                                ])
                                              ]),
                                              _: 1
                                            })
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_v_card, {
                                        variant: "tonal",
                                        color: "purple-darken-1"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_v_card_text, null, {
                                            default: withCtx(() => [
                                              createVNode("div", { class: "d-flex align-center" }, [
                                                createVNode(_component_v_icon, {
                                                  size: "large",
                                                  class: "mr-3"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("mdi-account-group")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode("div", null, [
                                                  createVNode("div", { class: "text-body-2 text-grey-darken-2" }, " T\u1ED5ng ng\u01B0\u1EDDi \u0111\xE3 gi\u1EDBi thi\u1EC7u \u0111\xE3 thu\xEA "),
                                                  createVNode("div", { class: "text-h5 font-bold text-grey-darken-4" }, toDisplayString(unref(dashboard).totalReferrals), 1)
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
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_v_col, { cols: "12" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_v_card, {
                                      variant: "tonal",
                                      color: "amber-darken-1"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_v_card_text, null, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`<div class="d-flex align-center"${_scopeId7}>`);
                                                _push8(ssrRenderComponent(_component_v_icon, {
                                                  size: "large",
                                                  class: "mr-3"
                                                }, {
                                                  default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                    if (_push9) {
                                                      _push9(`mdi-star-circle`);
                                                    } else {
                                                      return [
                                                        createTextVNode("mdi-star-circle")
                                                      ];
                                                    }
                                                  }),
                                                  _: 1
                                                }, _parent8, _scopeId7));
                                                _push8(`<div${_scopeId7}><div class="text-body-2 text-grey-darken-2"${_scopeId7}> B\u1EADc th\xE1ng n\xE0y </div><div class="text-h5 font-bold text-grey-darken-4"${_scopeId7}>${ssrInterpolate(unref(dashboard).estimatedRate)}</div></div></div>`);
                                              } else {
                                                return [
                                                  createVNode("div", { class: "d-flex align-center" }, [
                                                    createVNode(_component_v_icon, {
                                                      size: "large",
                                                      class: "mr-3"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("mdi-star-circle")
                                                      ]),
                                                      _: 1
                                                    }),
                                                    createVNode("div", null, [
                                                      createVNode("div", { class: "text-body-2 text-grey-darken-2" }, " B\u1EADc th\xE1ng n\xE0y "),
                                                      createVNode("div", { class: "text-h5 font-bold text-grey-darken-4" }, toDisplayString(unref(dashboard).estimatedRate), 1)
                                                    ])
                                                  ])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_component_v_card_text, null, {
                                              default: withCtx(() => [
                                                createVNode("div", { class: "d-flex align-center" }, [
                                                  createVNode(_component_v_icon, {
                                                    size: "large",
                                                    class: "mr-3"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-star-circle")
                                                    ]),
                                                    _: 1
                                                  }),
                                                  createVNode("div", null, [
                                                    createVNode("div", { class: "text-body-2 text-grey-darken-2" }, " B\u1EADc th\xE1ng n\xE0y "),
                                                    createVNode("div", { class: "text-h5 font-bold text-grey-darken-4" }, toDisplayString(unref(dashboard).estimatedRate), 1)
                                                  ])
                                                ])
                                              ]),
                                              _: 1
                                            })
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_v_card, {
                                        variant: "tonal",
                                        color: "amber-darken-1"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_v_card_text, null, {
                                            default: withCtx(() => [
                                              createVNode("div", { class: "d-flex align-center" }, [
                                                createVNode(_component_v_icon, {
                                                  size: "large",
                                                  class: "mr-3"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("mdi-star-circle")
                                                  ]),
                                                  _: 1
                                                }),
                                                createVNode("div", null, [
                                                  createVNode("div", { class: "text-body-2 text-grey-darken-2" }, " B\u1EADc th\xE1ng n\xE0y "),
                                                  createVNode("div", { class: "text-h5 font-bold text-grey-darken-4" }, toDisplayString(unref(dashboard).estimatedRate), 1)
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
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_v_col, { cols: "12" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_v_card, {
                                      variant: "tonal",
                                      color: "purple-darken-1"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_v_card_text, null, {
                                          default: withCtx(() => [
                                            createVNode("div", { class: "d-flex align-center" }, [
                                              createVNode(_component_v_icon, {
                                                size: "large",
                                                class: "mr-3"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-account-group")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode("div", null, [
                                                createVNode("div", { class: "text-body-2 text-grey-darken-2" }, " T\u1ED5ng ng\u01B0\u1EDDi \u0111\xE3 gi\u1EDBi thi\u1EC7u \u0111\xE3 thu\xEA "),
                                                createVNode("div", { class: "text-h5 font-bold text-grey-darken-4" }, toDisplayString(unref(dashboard).totalReferrals), 1)
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
                                }),
                                createVNode(_component_v_col, { cols: "12" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_v_card, {
                                      variant: "tonal",
                                      color: "amber-darken-1"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_v_card_text, null, {
                                          default: withCtx(() => [
                                            createVNode("div", { class: "d-flex align-center" }, [
                                              createVNode(_component_v_icon, {
                                                size: "large",
                                                class: "mr-3"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-star-circle")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode("div", null, [
                                                createVNode("div", { class: "text-body-2 text-grey-darken-2" }, " B\u1EADc th\xE1ng n\xE0y "),
                                                createVNode("div", { class: "text-h5 font-bold text-grey-darken-4" }, toDisplayString(unref(dashboard).estimatedRate), 1)
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
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_v_row, { dense: "" }, {
                            default: withCtx(() => [
                              createVNode(_component_v_col, { cols: "12" }, {
                                default: withCtx(() => [
                                  createVNode(_component_v_card, {
                                    variant: "tonal",
                                    color: "purple-darken-1"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_v_card_text, null, {
                                        default: withCtx(() => [
                                          createVNode("div", { class: "d-flex align-center" }, [
                                            createVNode(_component_v_icon, {
                                              size: "large",
                                              class: "mr-3"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-account-group")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode("div", null, [
                                              createVNode("div", { class: "text-body-2 text-grey-darken-2" }, " T\u1ED5ng ng\u01B0\u1EDDi \u0111\xE3 gi\u1EDBi thi\u1EC7u \u0111\xE3 thu\xEA "),
                                              createVNode("div", { class: "text-h5 font-bold text-grey-darken-4" }, toDisplayString(unref(dashboard).totalReferrals), 1)
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
                              }),
                              createVNode(_component_v_col, { cols: "12" }, {
                                default: withCtx(() => [
                                  createVNode(_component_v_card, {
                                    variant: "tonal",
                                    color: "amber-darken-1"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_v_card_text, null, {
                                        default: withCtx(() => [
                                          createVNode("div", { class: "d-flex align-center" }, [
                                            createVNode(_component_v_icon, {
                                              size: "large",
                                              class: "mr-3"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-star-circle")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode("div", null, [
                                              createVNode("div", { class: "text-body-2 text-grey-darken-2" }, " B\u1EADc th\xE1ng n\xE0y "),
                                              createVNode("div", { class: "text-h5 font-bold text-grey-darken-4" }, toDisplayString(unref(dashboard).estimatedRate), 1)
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
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_v_col, {
                    cols: "12",
                    class: "mt-4"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_v_card, { variant: "outlined" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_v_card_title, { class: "text-h6" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`C\xE1c b\u1EADc hoa h\u1ED3ng`);
                                  } else {
                                    return [
                                      createTextVNode("C\xE1c b\u1EADc hoa h\u1ED3ng")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_v_card_subtitle, { class: "text-wrap" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(` Hoa h\u1ED3ng v\u0129nh vi\u1EC5n \u0111\u01B0\u1EE3c ch\u1ED1t cu\u1ED1i th\xE1ng d\u1EF1a tr\xEAn s\u1ED1 gi\u1EDBi thi\u1EC7u m\u1EDBi. `);
                                  } else {
                                    return [
                                      createTextVNode(" Hoa h\u1ED3ng v\u0129nh vi\u1EC5n \u0111\u01B0\u1EE3c ch\u1ED1t cu\u1ED1i th\xE1ng d\u1EF1a tr\xEAn s\u1ED1 gi\u1EDBi thi\u1EC7u m\u1EDBi. ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_v_card_text, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_v_row, { dense: "" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`<!--[-->`);
                                          ssrRenderList("commissionTier" in _ctx ? _ctx.commissionTier : unref(commissionTier), (tier) => {
                                            _push7(ssrRenderComponent(_component_v_col, {
                                              key: tier.name,
                                              cols: "12",
                                              sm: "3"
                                            }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_component_v_sheet, {
                                                    height: "100%",
                                                    variant: "tonal",
                                                    class: "pa-3 rounded-lg d-flex flex-column justify-center align-center"
                                                  }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(`<div class="text-caption text-grey-darken-1"${_scopeId8}>${ssrInterpolate(tier.name)}</div><div class="font-bold text-blue-darken-1 text-subtitle-1"${_scopeId8}>${ssrInterpolate(tier.rate)}</div><div class="text-caption text-medium-emphasis"${_scopeId8}> (${ssrInterpolate(tier.requirement)}) </div>`);
                                                      } else {
                                                        return [
                                                          createVNode("div", { class: "text-caption text-grey-darken-1" }, toDisplayString(tier.name), 1),
                                                          createVNode("div", { class: "font-bold text-blue-darken-1 text-subtitle-1" }, toDisplayString(tier.rate), 1),
                                                          createVNode("div", { class: "text-caption text-medium-emphasis" }, " (" + toDisplayString(tier.requirement) + ") ", 1)
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_component_v_sheet, {
                                                      height: "100%",
                                                      variant: "tonal",
                                                      class: "pa-3 rounded-lg d-flex flex-column justify-center align-center"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode("div", { class: "text-caption text-grey-darken-1" }, toDisplayString(tier.name), 1),
                                                        createVNode("div", { class: "font-bold text-blue-darken-1 text-subtitle-1" }, toDisplayString(tier.rate), 1),
                                                        createVNode("div", { class: "text-caption text-medium-emphasis" }, " (" + toDisplayString(tier.requirement) + ") ", 1)
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          });
                                          _push7(`<!--]-->`);
                                        } else {
                                          return [
                                            (openBlock(true), createBlock(Fragment, null, renderList("commissionTier" in _ctx ? _ctx.commissionTier : unref(commissionTier), (tier) => {
                                              return openBlock(), createBlock(_component_v_col, {
                                                key: tier.name,
                                                cols: "12",
                                                sm: "3"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_v_sheet, {
                                                    height: "100%",
                                                    variant: "tonal",
                                                    class: "pa-3 rounded-lg d-flex flex-column justify-center align-center"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode("div", { class: "text-caption text-grey-darken-1" }, toDisplayString(tier.name), 1),
                                                      createVNode("div", { class: "font-bold text-blue-darken-1 text-subtitle-1" }, toDisplayString(tier.rate), 1),
                                                      createVNode("div", { class: "text-caption text-medium-emphasis" }, " (" + toDisplayString(tier.requirement) + ") ", 1)
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 2
                                              }, 1024);
                                            }), 128))
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_v_row, { dense: "" }, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList("commissionTier" in _ctx ? _ctx.commissionTier : unref(commissionTier), (tier) => {
                                            return openBlock(), createBlock(_component_v_col, {
                                              key: tier.name,
                                              cols: "12",
                                              sm: "3"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_v_sheet, {
                                                  height: "100%",
                                                  variant: "tonal",
                                                  class: "pa-3 rounded-lg d-flex flex-column justify-center align-center"
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode("div", { class: "text-caption text-grey-darken-1" }, toDisplayString(tier.name), 1),
                                                    createVNode("div", { class: "font-bold text-blue-darken-1 text-subtitle-1" }, toDisplayString(tier.rate), 1),
                                                    createVNode("div", { class: "text-caption text-medium-emphasis" }, " (" + toDisplayString(tier.requirement) + ") ", 1)
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1024);
                                          }), 128))
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_v_card_title, { class: "text-h6" }, {
                                  default: withCtx(() => [
                                    createTextVNode("C\xE1c b\u1EADc hoa h\u1ED3ng")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_v_card_subtitle, { class: "text-wrap" }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Hoa h\u1ED3ng v\u0129nh vi\u1EC5n \u0111\u01B0\u1EE3c ch\u1ED1t cu\u1ED1i th\xE1ng d\u1EF1a tr\xEAn s\u1ED1 gi\u1EDBi thi\u1EC7u m\u1EDBi. ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_v_card_text, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_v_row, { dense: "" }, {
                                      default: withCtx(() => [
                                        (openBlock(true), createBlock(Fragment, null, renderList("commissionTier" in _ctx ? _ctx.commissionTier : unref(commissionTier), (tier) => {
                                          return openBlock(), createBlock(_component_v_col, {
                                            key: tier.name,
                                            cols: "12",
                                            sm: "3"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_v_sheet, {
                                                height: "100%",
                                                variant: "tonal",
                                                class: "pa-3 rounded-lg d-flex flex-column justify-center align-center"
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode("div", { class: "text-caption text-grey-darken-1" }, toDisplayString(tier.name), 1),
                                                  createVNode("div", { class: "font-bold text-blue-darken-1 text-subtitle-1" }, toDisplayString(tier.rate), 1),
                                                  createVNode("div", { class: "text-caption text-medium-emphasis" }, " (" + toDisplayString(tier.requirement) + ") ", 1)
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1024);
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
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_v_card, { variant: "outlined" }, {
                            default: withCtx(() => [
                              createVNode(_component_v_card_title, { class: "text-h6" }, {
                                default: withCtx(() => [
                                  createTextVNode("C\xE1c b\u1EADc hoa h\u1ED3ng")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_v_card_subtitle, { class: "text-wrap" }, {
                                default: withCtx(() => [
                                  createTextVNode(" Hoa h\u1ED3ng v\u0129nh vi\u1EC5n \u0111\u01B0\u1EE3c ch\u1ED1t cu\u1ED1i th\xE1ng d\u1EF1a tr\xEAn s\u1ED1 gi\u1EDBi thi\u1EC7u m\u1EDBi. ")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_v_card_text, null, {
                                default: withCtx(() => [
                                  createVNode(_component_v_row, { dense: "" }, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList("commissionTier" in _ctx ? _ctx.commissionTier : unref(commissionTier), (tier) => {
                                        return openBlock(), createBlock(_component_v_col, {
                                          key: tier.name,
                                          cols: "12",
                                          sm: "3"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_v_sheet, {
                                              height: "100%",
                                              variant: "tonal",
                                              class: "pa-3 rounded-lg d-flex flex-column justify-center align-center"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode("div", { class: "text-caption text-grey-darken-1" }, toDisplayString(tier.name), 1),
                                                createVNode("div", { class: "font-bold text-blue-darken-1 text-subtitle-1" }, toDisplayString(tier.rate), 1),
                                                createVNode("div", { class: "text-caption text-medium-emphasis" }, " (" + toDisplayString(tier.requirement) + ") ", 1)
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1024);
                                      }), 128))
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
                  }, _parent3, _scopeId2));
                  if (Array.isArray(unref(dashboard).leaderboard) && ((_a = unref(dashboard).leaderboard) == null ? void 0 : _a.length)) {
                    _push3(ssrRenderComponent(_component_v_col, {
                      cols: "12",
                      class: "mt-4"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_v_card, { variant: "outlined" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_v_card_title, { class: "text-h6" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_v_icon, {
                                        color: "amber-darken-1",
                                        class: "mr-2"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`mdi-trophy`);
                                          } else {
                                            return [
                                              createTextVNode("mdi-trophy")
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(` B\u1EA3ng x\u1EBFp h\u1EA1ng CTV c\u1EE7a th\xE1ng `);
                                    } else {
                                      return [
                                        createVNode(_component_v_icon, {
                                          color: "amber-darken-1",
                                          class: "mr-2"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-trophy")
                                          ]),
                                          _: 1
                                        }),
                                        createTextVNode(" B\u1EA3ng x\u1EBFp h\u1EA1ng CTV c\u1EE7a th\xE1ng ")
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(_component_v_card_subtitle, { class: "text-wrap" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(` B\u1EA3ng x\u1EBFp h\u1EA1ng \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt d\u1EF1a tr\xEAn s\u1ED1 gi\u1EDBi thi\u1EC7u (\u0111\xE3 thu\xEA) m\u1EDBi trong th\xE1ng n\xE0y. `);
                                    } else {
                                      return [
                                        createTextVNode(" B\u1EA3ng x\u1EBFp h\u1EA1ng \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt d\u1EF1a tr\xEAn s\u1ED1 gi\u1EDBi thi\u1EC7u (\u0111\xE3 thu\xEA) m\u1EDBi trong th\xE1ng n\xE0y. ")
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(_component_v_card_text, { class: "ma-0 px-0 pt-0" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_v_list, {
                                        lines: "one",
                                        "max-width": "400"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<!--[-->`);
                                            ssrRenderList(unref(dashboard).leaderboard, (item, index) => {
                                              var _a2, _b2, _c;
                                              _push7(ssrRenderComponent(_component_v_list_item, {
                                                class: ["mt-3 py-2", {
                                                  "bg-grey-lighten-2": ((_a2 = unref(dashboard)) == null ? void 0 : _a2.accountId) && (item == null ? void 0 : item._id) === ((_b2 = unref(dashboard)) == null ? void 0 : _b2.accountId),
                                                  "cursor-pointer": ((_c = unref(userData)) == null ? void 0 : _c.role) === ("EnumAccountRole" in _ctx ? _ctx.EnumAccountRole : unref(EnumAccountRole)).ADMIN
                                                }],
                                                key: item.id,
                                                title: item.name,
                                                subtitle: `${item.count} l\u01B0\u1EE3t gi\u1EDBi thi\u1EC7u`,
                                                onClick: ($event) => onClickViewDashboardPartnerDetail(item._id)
                                              }, createSlots({
                                                prepend: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(ssrRenderComponent(_component_v_avatar, {
                                                      color: ("getRankColor" in _ctx ? _ctx.getRankColor : unref(getRankColor))(index + 1)
                                                    }, {
                                                      default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                        if (_push9) {
                                                          _push9(`<span class="text-white font-bold"${_scopeId8}>${ssrInterpolate(index + 1)}</span>`);
                                                        } else {
                                                          return [
                                                            createVNode("span", { class: "text-white font-bold" }, toDisplayString(index + 1), 1)
                                                          ];
                                                        }
                                                      }),
                                                      _: 2
                                                    }, _parent8, _scopeId7));
                                                  } else {
                                                    return [
                                                      createVNode(_component_v_avatar, {
                                                        color: ("getRankColor" in _ctx ? _ctx.getRankColor : unref(getRankColor))(index + 1)
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode("span", { class: "text-white font-bold" }, toDisplayString(index + 1), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1032, ["color"])
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, [
                                                index === 0 ? {
                                                  name: "append",
                                                  fn: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                    if (_push8) {
                                                      _push8(ssrRenderComponent(_component_v_icon, { color: "amber-darken-2" }, {
                                                        default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                          if (_push9) {
                                                            _push9(`mdi-crown`);
                                                          } else {
                                                            return [
                                                              createTextVNode("mdi-crown")
                                                            ];
                                                          }
                                                        }),
                                                        _: 2
                                                      }, _parent8, _scopeId7));
                                                    } else {
                                                      return [
                                                        createVNode(_component_v_icon, { color: "amber-darken-2" }, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-crown")
                                                          ]),
                                                          _: 1
                                                        })
                                                      ];
                                                    }
                                                  }),
                                                  key: "0"
                                                } : void 0
                                              ]), _parent7, _scopeId6));
                                            });
                                            _push7(`<!--]-->`);
                                          } else {
                                            return [
                                              (openBlock(true), createBlock(Fragment, null, renderList(unref(dashboard).leaderboard, (item, index) => {
                                                var _a2, _b2, _c;
                                                return openBlock(), createBlock(_component_v_list_item, {
                                                  class: ["mt-3 py-2", {
                                                    "bg-grey-lighten-2": ((_a2 = unref(dashboard)) == null ? void 0 : _a2.accountId) && (item == null ? void 0 : item._id) === ((_b2 = unref(dashboard)) == null ? void 0 : _b2.accountId),
                                                    "cursor-pointer": ((_c = unref(userData)) == null ? void 0 : _c.role) === ("EnumAccountRole" in _ctx ? _ctx.EnumAccountRole : unref(EnumAccountRole)).ADMIN
                                                  }],
                                                  key: item.id,
                                                  title: item.name,
                                                  subtitle: `${item.count} l\u01B0\u1EE3t gi\u1EDBi thi\u1EC7u`,
                                                  onClick: ($event) => onClickViewDashboardPartnerDetail(item._id)
                                                }, createSlots({
                                                  prepend: withCtx(() => [
                                                    createVNode(_component_v_avatar, {
                                                      color: ("getRankColor" in _ctx ? _ctx.getRankColor : unref(getRankColor))(index + 1)
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode("span", { class: "text-white font-bold" }, toDisplayString(index + 1), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["color"])
                                                  ]),
                                                  _: 2
                                                }, [
                                                  index === 0 ? {
                                                    name: "append",
                                                    fn: withCtx(() => [
                                                      createVNode(_component_v_icon, { color: "amber-darken-2" }, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-crown")
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    key: "0"
                                                  } : void 0
                                                ]), 1032, ["title", "class", "subtitle", "onClick"]);
                                              }), 128))
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(_component_v_list, {
                                          lines: "one",
                                          "max-width": "400"
                                        }, {
                                          default: withCtx(() => [
                                            (openBlock(true), createBlock(Fragment, null, renderList(unref(dashboard).leaderboard, (item, index) => {
                                              var _a2, _b2, _c;
                                              return openBlock(), createBlock(_component_v_list_item, {
                                                class: ["mt-3 py-2", {
                                                  "bg-grey-lighten-2": ((_a2 = unref(dashboard)) == null ? void 0 : _a2.accountId) && (item == null ? void 0 : item._id) === ((_b2 = unref(dashboard)) == null ? void 0 : _b2.accountId),
                                                  "cursor-pointer": ((_c = unref(userData)) == null ? void 0 : _c.role) === ("EnumAccountRole" in _ctx ? _ctx.EnumAccountRole : unref(EnumAccountRole)).ADMIN
                                                }],
                                                key: item.id,
                                                title: item.name,
                                                subtitle: `${item.count} l\u01B0\u1EE3t gi\u1EDBi thi\u1EC7u`,
                                                onClick: ($event) => onClickViewDashboardPartnerDetail(item._id)
                                              }, createSlots({
                                                prepend: withCtx(() => [
                                                  createVNode(_component_v_avatar, {
                                                    color: ("getRankColor" in _ctx ? _ctx.getRankColor : unref(getRankColor))(index + 1)
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode("span", { class: "text-white font-bold" }, toDisplayString(index + 1), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["color"])
                                                ]),
                                                _: 2
                                              }, [
                                                index === 0 ? {
                                                  name: "append",
                                                  fn: withCtx(() => [
                                                    createVNode(_component_v_icon, { color: "amber-darken-2" }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("mdi-crown")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ]),
                                                  key: "0"
                                                } : void 0
                                              ]), 1032, ["title", "class", "subtitle", "onClick"]);
                                            }), 128))
                                          ]),
                                          _: 1
                                        })
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_v_card_title, { class: "text-h6" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_v_icon, {
                                        color: "amber-darken-1",
                                        class: "mr-2"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-trophy")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" B\u1EA3ng x\u1EBFp h\u1EA1ng CTV c\u1EE7a th\xE1ng ")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_v_card_subtitle, { class: "text-wrap" }, {
                                    default: withCtx(() => [
                                      createTextVNode(" B\u1EA3ng x\u1EBFp h\u1EA1ng \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt d\u1EF1a tr\xEAn s\u1ED1 gi\u1EDBi thi\u1EC7u (\u0111\xE3 thu\xEA) m\u1EDBi trong th\xE1ng n\xE0y. ")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_v_card_text, { class: "ma-0 px-0 pt-0" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_v_list, {
                                        lines: "one",
                                        "max-width": "400"
                                      }, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(unref(dashboard).leaderboard, (item, index) => {
                                            var _a2, _b2, _c;
                                            return openBlock(), createBlock(_component_v_list_item, {
                                              class: ["mt-3 py-2", {
                                                "bg-grey-lighten-2": ((_a2 = unref(dashboard)) == null ? void 0 : _a2.accountId) && (item == null ? void 0 : item._id) === ((_b2 = unref(dashboard)) == null ? void 0 : _b2.accountId),
                                                "cursor-pointer": ((_c = unref(userData)) == null ? void 0 : _c.role) === ("EnumAccountRole" in _ctx ? _ctx.EnumAccountRole : unref(EnumAccountRole)).ADMIN
                                              }],
                                              key: item.id,
                                              title: item.name,
                                              subtitle: `${item.count} l\u01B0\u1EE3t gi\u1EDBi thi\u1EC7u`,
                                              onClick: ($event) => onClickViewDashboardPartnerDetail(item._id)
                                            }, createSlots({
                                              prepend: withCtx(() => [
                                                createVNode(_component_v_avatar, {
                                                  color: ("getRankColor" in _ctx ? _ctx.getRankColor : unref(getRankColor))(index + 1)
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode("span", { class: "text-white font-bold" }, toDisplayString(index + 1), 1)
                                                  ]),
                                                  _: 2
                                                }, 1032, ["color"])
                                              ]),
                                              _: 2
                                            }, [
                                              index === 0 ? {
                                                name: "append",
                                                fn: withCtx(() => [
                                                  createVNode(_component_v_icon, { color: "amber-darken-2" }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-crown")
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                key: "0"
                                              } : void 0
                                            ]), 1032, ["title", "class", "subtitle", "onClick"]);
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
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_v_card, { variant: "outlined" }, {
                              default: withCtx(() => [
                                createVNode(_component_v_card_title, { class: "text-h6" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_v_icon, {
                                      color: "amber-darken-1",
                                      class: "mr-2"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-trophy")
                                      ]),
                                      _: 1
                                    }),
                                    createTextVNode(" B\u1EA3ng x\u1EBFp h\u1EA1ng CTV c\u1EE7a th\xE1ng ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_v_card_subtitle, { class: "text-wrap" }, {
                                  default: withCtx(() => [
                                    createTextVNode(" B\u1EA3ng x\u1EBFp h\u1EA1ng \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt d\u1EF1a tr\xEAn s\u1ED1 gi\u1EDBi thi\u1EC7u (\u0111\xE3 thu\xEA) m\u1EDBi trong th\xE1ng n\xE0y. ")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_v_card_text, { class: "ma-0 px-0 pt-0" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_v_list, {
                                      lines: "one",
                                      "max-width": "400"
                                    }, {
                                      default: withCtx(() => [
                                        (openBlock(true), createBlock(Fragment, null, renderList(unref(dashboard).leaderboard, (item, index) => {
                                          var _a2, _b2, _c;
                                          return openBlock(), createBlock(_component_v_list_item, {
                                            class: ["mt-3 py-2", {
                                              "bg-grey-lighten-2": ((_a2 = unref(dashboard)) == null ? void 0 : _a2.accountId) && (item == null ? void 0 : item._id) === ((_b2 = unref(dashboard)) == null ? void 0 : _b2.accountId),
                                              "cursor-pointer": ((_c = unref(userData)) == null ? void 0 : _c.role) === ("EnumAccountRole" in _ctx ? _ctx.EnumAccountRole : unref(EnumAccountRole)).ADMIN
                                            }],
                                            key: item.id,
                                            title: item.name,
                                            subtitle: `${item.count} l\u01B0\u1EE3t gi\u1EDBi thi\u1EC7u`,
                                            onClick: ($event) => onClickViewDashboardPartnerDetail(item._id)
                                          }, createSlots({
                                            prepend: withCtx(() => [
                                              createVNode(_component_v_avatar, {
                                                color: ("getRankColor" in _ctx ? _ctx.getRankColor : unref(getRankColor))(index + 1)
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode("span", { class: "text-white font-bold" }, toDisplayString(index + 1), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["color"])
                                            ]),
                                            _: 2
                                          }, [
                                            index === 0 ? {
                                              name: "append",
                                              fn: withCtx(() => [
                                                createVNode(_component_v_icon, { color: "amber-darken-2" }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("mdi-crown")
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              key: "0"
                                            } : void 0
                                          ]), 1032, ["title", "class", "subtitle", "onClick"]);
                                        }), 128))
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
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    createVNode(_component_v_col, {
                      cols: "12",
                      lg: "5"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_v_card, {
                          variant: "flat",
                          color: "primary",
                          class: "text-white",
                          height: "100%"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_v_card_text, null, {
                              default: withCtx(() => [
                                createVNode("div", { class: "d-flex align-center mb-1" }, [
                                  createVNode(_component_v_icon, {
                                    size: "x-large",
                                    class: "opacity-75 mr-3"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-cash-clock")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode("div", { class: "text-h6 font-bold" }, "S\u1ED1 d\u01B0 ch\u1EDD thanh to\xE1n")
                                ]),
                                createVNode("div", { class: "text-h3 font-bold mt-4" }, toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(unref(dashboard).pendingBalance)), 1),
                                createVNode("div", { class: "text-body-2 opacity-80 mt-1" }, " S\u1EBD \u0111\u01B0\u1EE3c thanh to\xE1n v\xE0o k\u1EF3 t\u1EDBi ")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_v_col, {
                      cols: "12",
                      md: "6",
                      lg: "3"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_v_card, {
                          variant: "tonal",
                          color: "green-darken-1",
                          height: "100%"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_v_card_text, null, {
                              default: withCtx(() => [
                                createVNode("div", { class: "d-flex align-center mb-1" }, [
                                  createVNode(_component_v_icon, {
                                    size: "large",
                                    class: "mr-3"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-check-decagram")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode("div", { class: "text-subtitle-1 font-bold text-grey-darken-3" }, " T\u1ED5ng \u0111\xE3 thanh to\xE1n ")
                                ]),
                                createVNode("div", { class: "text-h4 font-bold text-grey-darken-4 mt-4" }, toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(unref(dashboard).paidBalance)), 1)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_v_col, {
                      cols: "12",
                      md: "6",
                      lg: "4"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_v_row, { dense: "" }, {
                          default: withCtx(() => [
                            createVNode(_component_v_col, { cols: "12" }, {
                              default: withCtx(() => [
                                createVNode(_component_v_card, {
                                  variant: "tonal",
                                  color: "purple-darken-1"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_v_card_text, null, {
                                      default: withCtx(() => [
                                        createVNode("div", { class: "d-flex align-center" }, [
                                          createVNode(_component_v_icon, {
                                            size: "large",
                                            class: "mr-3"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-account-group")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode("div", null, [
                                            createVNode("div", { class: "text-body-2 text-grey-darken-2" }, " T\u1ED5ng ng\u01B0\u1EDDi \u0111\xE3 gi\u1EDBi thi\u1EC7u \u0111\xE3 thu\xEA "),
                                            createVNode("div", { class: "text-h5 font-bold text-grey-darken-4" }, toDisplayString(unref(dashboard).totalReferrals), 1)
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
                            }),
                            createVNode(_component_v_col, { cols: "12" }, {
                              default: withCtx(() => [
                                createVNode(_component_v_card, {
                                  variant: "tonal",
                                  color: "amber-darken-1"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_v_card_text, null, {
                                      default: withCtx(() => [
                                        createVNode("div", { class: "d-flex align-center" }, [
                                          createVNode(_component_v_icon, {
                                            size: "large",
                                            class: "mr-3"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-star-circle")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode("div", null, [
                                            createVNode("div", { class: "text-body-2 text-grey-darken-2" }, " B\u1EADc th\xE1ng n\xE0y "),
                                            createVNode("div", { class: "text-h5 font-bold text-grey-darken-4" }, toDisplayString(unref(dashboard).estimatedRate), 1)
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
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_v_col, {
                      cols: "12",
                      class: "mt-4"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_v_card, { variant: "outlined" }, {
                          default: withCtx(() => [
                            createVNode(_component_v_card_title, { class: "text-h6" }, {
                              default: withCtx(() => [
                                createTextVNode("C\xE1c b\u1EADc hoa h\u1ED3ng")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_v_card_subtitle, { class: "text-wrap" }, {
                              default: withCtx(() => [
                                createTextVNode(" Hoa h\u1ED3ng v\u0129nh vi\u1EC5n \u0111\u01B0\u1EE3c ch\u1ED1t cu\u1ED1i th\xE1ng d\u1EF1a tr\xEAn s\u1ED1 gi\u1EDBi thi\u1EC7u m\u1EDBi. ")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_v_card_text, null, {
                              default: withCtx(() => [
                                createVNode(_component_v_row, { dense: "" }, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList("commissionTier" in _ctx ? _ctx.commissionTier : unref(commissionTier), (tier) => {
                                      return openBlock(), createBlock(_component_v_col, {
                                        key: tier.name,
                                        cols: "12",
                                        sm: "3"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_v_sheet, {
                                            height: "100%",
                                            variant: "tonal",
                                            class: "pa-3 rounded-lg d-flex flex-column justify-center align-center"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode("div", { class: "text-caption text-grey-darken-1" }, toDisplayString(tier.name), 1),
                                              createVNode("div", { class: "font-bold text-blue-darken-1 text-subtitle-1" }, toDisplayString(tier.rate), 1),
                                              createVNode("div", { class: "text-caption text-medium-emphasis" }, " (" + toDisplayString(tier.requirement) + ") ", 1)
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 2
                                      }, 1024);
                                    }), 128))
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
                    Array.isArray(unref(dashboard).leaderboard) && ((_b = unref(dashboard).leaderboard) == null ? void 0 : _b.length) ? (openBlock(), createBlock(_component_v_col, {
                      key: 0,
                      cols: "12",
                      class: "mt-4"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_v_card, { variant: "outlined" }, {
                          default: withCtx(() => [
                            createVNode(_component_v_card_title, { class: "text-h6" }, {
                              default: withCtx(() => [
                                createVNode(_component_v_icon, {
                                  color: "amber-darken-1",
                                  class: "mr-2"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-trophy")
                                  ]),
                                  _: 1
                                }),
                                createTextVNode(" B\u1EA3ng x\u1EBFp h\u1EA1ng CTV c\u1EE7a th\xE1ng ")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_v_card_subtitle, { class: "text-wrap" }, {
                              default: withCtx(() => [
                                createTextVNode(" B\u1EA3ng x\u1EBFp h\u1EA1ng \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt d\u1EF1a tr\xEAn s\u1ED1 gi\u1EDBi thi\u1EC7u (\u0111\xE3 thu\xEA) m\u1EDBi trong th\xE1ng n\xE0y. ")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_v_card_text, { class: "ma-0 px-0 pt-0" }, {
                              default: withCtx(() => [
                                createVNode(_component_v_list, {
                                  lines: "one",
                                  "max-width": "400"
                                }, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(unref(dashboard).leaderboard, (item, index) => {
                                      var _a2, _b2, _c;
                                      return openBlock(), createBlock(_component_v_list_item, {
                                        class: ["mt-3 py-2", {
                                          "bg-grey-lighten-2": ((_a2 = unref(dashboard)) == null ? void 0 : _a2.accountId) && (item == null ? void 0 : item._id) === ((_b2 = unref(dashboard)) == null ? void 0 : _b2.accountId),
                                          "cursor-pointer": ((_c = unref(userData)) == null ? void 0 : _c.role) === ("EnumAccountRole" in _ctx ? _ctx.EnumAccountRole : unref(EnumAccountRole)).ADMIN
                                        }],
                                        key: item.id,
                                        title: item.name,
                                        subtitle: `${item.count} l\u01B0\u1EE3t gi\u1EDBi thi\u1EC7u`,
                                        onClick: ($event) => onClickViewDashboardPartnerDetail(item._id)
                                      }, createSlots({
                                        prepend: withCtx(() => [
                                          createVNode(_component_v_avatar, {
                                            color: ("getRankColor" in _ctx ? _ctx.getRankColor : unref(getRankColor))(index + 1)
                                          }, {
                                            default: withCtx(() => [
                                              createVNode("span", { class: "text-white font-bold" }, toDisplayString(index + 1), 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["color"])
                                        ]),
                                        _: 2
                                      }, [
                                        index === 0 ? {
                                          name: "append",
                                          fn: withCtx(() => [
                                            createVNode(_component_v_icon, { color: "amber-darken-2" }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-crown")
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          key: "0"
                                        } : void 0
                                      ]), 1032, ["title", "class", "subtitle", "onClick"]);
                                    }), 128))
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
                    })) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_v_row, { dense: "" }, {
                default: withCtx(() => {
                  var _a;
                  return [
                    createVNode(_component_v_col, {
                      cols: "12",
                      lg: "5"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_v_card, {
                          variant: "flat",
                          color: "primary",
                          class: "text-white",
                          height: "100%"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_v_card_text, null, {
                              default: withCtx(() => [
                                createVNode("div", { class: "d-flex align-center mb-1" }, [
                                  createVNode(_component_v_icon, {
                                    size: "x-large",
                                    class: "opacity-75 mr-3"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-cash-clock")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode("div", { class: "text-h6 font-bold" }, "S\u1ED1 d\u01B0 ch\u1EDD thanh to\xE1n")
                                ]),
                                createVNode("div", { class: "text-h3 font-bold mt-4" }, toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(unref(dashboard).pendingBalance)), 1),
                                createVNode("div", { class: "text-body-2 opacity-80 mt-1" }, " S\u1EBD \u0111\u01B0\u1EE3c thanh to\xE1n v\xE0o k\u1EF3 t\u1EDBi ")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_v_col, {
                      cols: "12",
                      md: "6",
                      lg: "3"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_v_card, {
                          variant: "tonal",
                          color: "green-darken-1",
                          height: "100%"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_v_card_text, null, {
                              default: withCtx(() => [
                                createVNode("div", { class: "d-flex align-center mb-1" }, [
                                  createVNode(_component_v_icon, {
                                    size: "large",
                                    class: "mr-3"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-check-decagram")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode("div", { class: "text-subtitle-1 font-bold text-grey-darken-3" }, " T\u1ED5ng \u0111\xE3 thanh to\xE1n ")
                                ]),
                                createVNode("div", { class: "text-h4 font-bold text-grey-darken-4 mt-4" }, toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(unref(dashboard).paidBalance)), 1)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_v_col, {
                      cols: "12",
                      md: "6",
                      lg: "4"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_v_row, { dense: "" }, {
                          default: withCtx(() => [
                            createVNode(_component_v_col, { cols: "12" }, {
                              default: withCtx(() => [
                                createVNode(_component_v_card, {
                                  variant: "tonal",
                                  color: "purple-darken-1"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_v_card_text, null, {
                                      default: withCtx(() => [
                                        createVNode("div", { class: "d-flex align-center" }, [
                                          createVNode(_component_v_icon, {
                                            size: "large",
                                            class: "mr-3"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-account-group")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode("div", null, [
                                            createVNode("div", { class: "text-body-2 text-grey-darken-2" }, " T\u1ED5ng ng\u01B0\u1EDDi \u0111\xE3 gi\u1EDBi thi\u1EC7u \u0111\xE3 thu\xEA "),
                                            createVNode("div", { class: "text-h5 font-bold text-grey-darken-4" }, toDisplayString(unref(dashboard).totalReferrals), 1)
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
                            }),
                            createVNode(_component_v_col, { cols: "12" }, {
                              default: withCtx(() => [
                                createVNode(_component_v_card, {
                                  variant: "tonal",
                                  color: "amber-darken-1"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_v_card_text, null, {
                                      default: withCtx(() => [
                                        createVNode("div", { class: "d-flex align-center" }, [
                                          createVNode(_component_v_icon, {
                                            size: "large",
                                            class: "mr-3"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-star-circle")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode("div", null, [
                                            createVNode("div", { class: "text-body-2 text-grey-darken-2" }, " B\u1EADc th\xE1ng n\xE0y "),
                                            createVNode("div", { class: "text-h5 font-bold text-grey-darken-4" }, toDisplayString(unref(dashboard).estimatedRate), 1)
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
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_v_col, {
                      cols: "12",
                      class: "mt-4"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_v_card, { variant: "outlined" }, {
                          default: withCtx(() => [
                            createVNode(_component_v_card_title, { class: "text-h6" }, {
                              default: withCtx(() => [
                                createTextVNode("C\xE1c b\u1EADc hoa h\u1ED3ng")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_v_card_subtitle, { class: "text-wrap" }, {
                              default: withCtx(() => [
                                createTextVNode(" Hoa h\u1ED3ng v\u0129nh vi\u1EC5n \u0111\u01B0\u1EE3c ch\u1ED1t cu\u1ED1i th\xE1ng d\u1EF1a tr\xEAn s\u1ED1 gi\u1EDBi thi\u1EC7u m\u1EDBi. ")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_v_card_text, null, {
                              default: withCtx(() => [
                                createVNode(_component_v_row, { dense: "" }, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList("commissionTier" in _ctx ? _ctx.commissionTier : unref(commissionTier), (tier) => {
                                      return openBlock(), createBlock(_component_v_col, {
                                        key: tier.name,
                                        cols: "12",
                                        sm: "3"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_v_sheet, {
                                            height: "100%",
                                            variant: "tonal",
                                            class: "pa-3 rounded-lg d-flex flex-column justify-center align-center"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode("div", { class: "text-caption text-grey-darken-1" }, toDisplayString(tier.name), 1),
                                              createVNode("div", { class: "font-bold text-blue-darken-1 text-subtitle-1" }, toDisplayString(tier.rate), 1),
                                              createVNode("div", { class: "text-caption text-medium-emphasis" }, " (" + toDisplayString(tier.requirement) + ") ", 1)
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 2
                                      }, 1024);
                                    }), 128))
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
                    Array.isArray(unref(dashboard).leaderboard) && ((_a = unref(dashboard).leaderboard) == null ? void 0 : _a.length) ? (openBlock(), createBlock(_component_v_col, {
                      key: 0,
                      cols: "12",
                      class: "mt-4"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_v_card, { variant: "outlined" }, {
                          default: withCtx(() => [
                            createVNode(_component_v_card_title, { class: "text-h6" }, {
                              default: withCtx(() => [
                                createVNode(_component_v_icon, {
                                  color: "amber-darken-1",
                                  class: "mr-2"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-trophy")
                                  ]),
                                  _: 1
                                }),
                                createTextVNode(" B\u1EA3ng x\u1EBFp h\u1EA1ng CTV c\u1EE7a th\xE1ng ")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_v_card_subtitle, { class: "text-wrap" }, {
                              default: withCtx(() => [
                                createTextVNode(" B\u1EA3ng x\u1EBFp h\u1EA1ng \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt d\u1EF1a tr\xEAn s\u1ED1 gi\u1EDBi thi\u1EC7u (\u0111\xE3 thu\xEA) m\u1EDBi trong th\xE1ng n\xE0y. ")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_v_card_text, { class: "ma-0 px-0 pt-0" }, {
                              default: withCtx(() => [
                                createVNode(_component_v_list, {
                                  lines: "one",
                                  "max-width": "400"
                                }, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(unref(dashboard).leaderboard, (item, index) => {
                                      var _a2, _b, _c;
                                      return openBlock(), createBlock(_component_v_list_item, {
                                        class: ["mt-3 py-2", {
                                          "bg-grey-lighten-2": ((_a2 = unref(dashboard)) == null ? void 0 : _a2.accountId) && (item == null ? void 0 : item._id) === ((_b = unref(dashboard)) == null ? void 0 : _b.accountId),
                                          "cursor-pointer": ((_c = unref(userData)) == null ? void 0 : _c.role) === ("EnumAccountRole" in _ctx ? _ctx.EnumAccountRole : unref(EnumAccountRole)).ADMIN
                                        }],
                                        key: item.id,
                                        title: item.name,
                                        subtitle: `${item.count} l\u01B0\u1EE3t gi\u1EDBi thi\u1EC7u`,
                                        onClick: ($event) => onClickViewDashboardPartnerDetail(item._id)
                                      }, createSlots({
                                        prepend: withCtx(() => [
                                          createVNode(_component_v_avatar, {
                                            color: ("getRankColor" in _ctx ? _ctx.getRankColor : unref(getRankColor))(index + 1)
                                          }, {
                                            default: withCtx(() => [
                                              createVNode("span", { class: "text-white font-bold" }, toDisplayString(index + 1), 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["color"])
                                        ]),
                                        _: 2
                                      }, [
                                        index === 0 ? {
                                          name: "append",
                                          fn: withCtx(() => [
                                            createVNode(_component_v_icon, { color: "amber-darken-2" }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-crown")
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          key: "0"
                                        } : void 0
                                      ]), 1032, ["title", "class", "subtitle", "onClick"]);
                                    }), 128))
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
                    })) : createCommentVNode("", true)
                  ];
                }),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/partner/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BHxTEmFS.mjs.map
