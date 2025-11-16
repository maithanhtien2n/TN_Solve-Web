import { _ as _sfc_main$1 } from './CommonDialog-CSwcOS1W.mjs';
import { f as formatCurrency } from './helper-QcO-vDIR.mjs';
import { defineComponent, ref, computed, reactive, resolveComponent, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, createBlock, openBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderClass } from 'vue/server-renderer';
import { u as useAppStore, a as appService } from './app.store-CsbFmGtW.mjs';
import { u as useDevice } from './index-BKshJpnN.mjs';
import 'pinia';
import 'axios';
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
import 'vue-router';
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
import './v3-CpJW8Kui.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const MIN_PAYOUT_AMOUNT = 1e5;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "payment",
  __ssrInlineRender: true,
  setup(__props) {
    var _a, _b, _c;
    const { width } = useDevice();
    const { onGetterUserData, onActionGetUserData } = useAppStore();
    const isCopied = ref(false);
    const commonDialogRef = ref(null);
    const paymentInfo = computed(
      () => {
        var _a2, _b2;
        return ((_b2 = (_a2 = onGetterUserData.value) == null ? void 0 : _a2.settings) == null ? void 0 : _b2.paymentInfo) || {};
      }
    );
    const formData = reactive({
      bankName: ((_a = paymentInfo.value) == null ? void 0 : _a.bankName) || "",
      accountName: ((_b = paymentInfo.value) == null ? void 0 : _b.accountName) || "",
      accountNumber: ((_c = paymentInfo.value) == null ? void 0 : _c.accountNumber) || ""
    });
    const loading = ref("");
    const onResetForm = () => {
      var _a2, _b2, _c2, _d;
      formData.bankName = ((_a2 = paymentInfo.value) == null ? void 0 : _a2.bankName) || "";
      formData.accountName = ((_b2 = paymentInfo.value) == null ? void 0 : _b2.accountName) || "";
      formData.accountNumber = ((_c2 = paymentInfo.value) == null ? void 0 : _c2.accountNumber) || "";
      (_d = commonDialogRef.value) == null ? void 0 : _d.onDisplay(true);
    };
    const onSavePaymentInfo = async () => {
      loading.value = "save-payment-info";
      await appService.saveSetting({ paymentInfo: JSON.stringify(formData) }).then(async () => {
        var _a2;
        await onActionGetUserData();
        (_a2 = commonDialogRef.value) == null ? void 0 : _a2.onDisplay(false);
      }).finally(() => {
        loading.value = "";
      });
    };
    const onCopyReferralLink = async () => {
      var _a2, _b2;
      if (!((_a2 = onGetterUserData.value) == null ? void 0 : _a2.referralLink)) return;
      try {
        await (void 0).clipboard.writeText((_b2 = onGetterUserData.value) == null ? void 0 : _b2.referralLink);
        isCopied.value = true;
        setTimeout(() => {
          isCopied.value = false;
        }, 2e3);
      } catch (err) {
        console.error("Failed to copy referral code: ", err);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_v_container = resolveComponent("v-container");
      const _component_CommonDialog = _sfc_main$1;
      const _component_v_text_field = resolveComponent("v-text-field");
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_row = resolveComponent("v-row");
      const _component_v_col = resolveComponent("v-col");
      const _component_v_card = resolveComponent("v-card");
      const _component_v_card_item = resolveComponent("v-card-item");
      const _component_v_card_title = resolveComponent("v-card-title");
      const _component_v_icon = resolveComponent("v-icon");
      const _component_v_card_text = resolveComponent("v-card-text");
      const _component_v_sheet = resolveComponent("v-sheet");
      const _component_v_list_item = resolveComponent("v-list-item");
      const _component_v_divider = resolveComponent("v-divider");
      _push(ssrRenderComponent(_component_v_container, mergeProps({
        fluid: "",
        class: "ma-0 pa-0"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_CommonDialog, {
              ref_key: "commonDialogRef",
              ref: commonDialogRef,
              title: "Th\xF4ng tin thanh to\xE1n",
              width: "500"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="mt-3"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_v_text_field, {
                    modelValue: unref(formData).bankName,
                    "onUpdate:modelValue": ($event) => unref(formData).bankName = $event,
                    class: "w-100",
                    variant: "outlined",
                    label: _ctx.$t("T\xEAn ng\xE2n h\xE0ng (V\xED d\u1EE5: ACB, Vietcombank...)")
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_v_text_field, {
                    modelValue: unref(formData).accountName,
                    "onUpdate:modelValue": ($event) => unref(formData).accountName = $event,
                    class: "w-100",
                    variant: "outlined",
                    label: _ctx.$t("T\xEAn ch\u1EE7 t\xE0i kho\u1EA3n (Vi\u1EBFt hoa, kh\xF4ng d\u1EA5u)")
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_v_text_field, {
                    modelValue: unref(formData).accountNumber,
                    "onUpdate:modelValue": ($event) => unref(formData).accountNumber = $event,
                    class: "w-100",
                    variant: "outlined",
                    label: _ctx.$t("S\u1ED1 t\xE0i kho\u1EA3n")
                  }, null, _parent3, _scopeId2));
                  _push3(`</div><div class="d-flex ga-3 mt-6"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_v_btn, {
                    text: "H\u1EE7y b\u1ECF",
                    class: "flex-1",
                    variant: "tonal",
                    color: "primary",
                    style: { "height": "48px" },
                    onClick: ($event) => {
                      var _a2;
                      return (_a2 = unref(commonDialogRef)) == null ? void 0 : _a2.onDisplay(false);
                    }
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_v_btn, {
                    text: "L\u01B0u th\xF4ng tin",
                    class: "flex-1",
                    variant: "flat",
                    color: "primary",
                    style: { "height": "48px" },
                    disabled: Boolean(
                      !unref(formData).bankName || !unref(formData).accountName || !unref(formData).accountNumber
                    ),
                    loading: Boolean(unref(loading) === "save-payment-info"),
                    onClick: onSavePaymentInfo
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "mt-3" }, [
                      createVNode(_component_v_text_field, {
                        modelValue: unref(formData).bankName,
                        "onUpdate:modelValue": ($event) => unref(formData).bankName = $event,
                        class: "w-100",
                        variant: "outlined",
                        label: _ctx.$t("T\xEAn ng\xE2n h\xE0ng (V\xED d\u1EE5: ACB, Vietcombank...)")
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "label"]),
                      createVNode(_component_v_text_field, {
                        modelValue: unref(formData).accountName,
                        "onUpdate:modelValue": ($event) => unref(formData).accountName = $event,
                        class: "w-100",
                        variant: "outlined",
                        label: _ctx.$t("T\xEAn ch\u1EE7 t\xE0i kho\u1EA3n (Vi\u1EBFt hoa, kh\xF4ng d\u1EA5u)")
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "label"]),
                      createVNode(_component_v_text_field, {
                        modelValue: unref(formData).accountNumber,
                        "onUpdate:modelValue": ($event) => unref(formData).accountNumber = $event,
                        class: "w-100",
                        variant: "outlined",
                        label: _ctx.$t("S\u1ED1 t\xE0i kho\u1EA3n")
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "label"])
                    ]),
                    createVNode("div", { class: "d-flex ga-3 mt-6" }, [
                      createVNode(_component_v_btn, {
                        text: "H\u1EE7y b\u1ECF",
                        class: "flex-1",
                        variant: "tonal",
                        color: "primary",
                        style: { "height": "48px" },
                        onClick: ($event) => {
                          var _a2;
                          return (_a2 = unref(commonDialogRef)) == null ? void 0 : _a2.onDisplay(false);
                        }
                      }, null, 8, ["onClick"]),
                      createVNode(_component_v_btn, {
                        text: "L\u01B0u th\xF4ng tin",
                        class: "flex-1",
                        variant: "flat",
                        color: "primary",
                        style: { "height": "48px" },
                        disabled: Boolean(
                          !unref(formData).bankName || !unref(formData).accountName || !unref(formData).accountNumber
                        ),
                        loading: Boolean(unref(loading) === "save-payment-info"),
                        onClick: onSavePaymentInfo
                      }, null, 8, ["disabled", "loading"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_v_row, {
              justify: "center",
              class: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_v_col, {
                    cols: "12",
                    md: "10",
                    lg: "7"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_v_card, {
                          variant: "outlined",
                          class: ["py-3 pb-6", `${unref(width) > 550 ? "px-2" : "px-0"}`]
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_v_card_item, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_v_card_title, { class: "d-flex align-center" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_component_v_icon, { class: "mr-2" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`mdi-bank`);
                                              } else {
                                                return [
                                                  createTextVNode("mdi-bank")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(` Th\xF4ng tin thanh to\xE1n `);
                                        } else {
                                          return [
                                            createVNode(_component_v_icon, { class: "mr-2" }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-bank")
                                              ]),
                                              _: 1
                                            }),
                                            createTextVNode(" Th\xF4ng tin thanh to\xE1n ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_v_card_title, { class: "d-flex align-center" }, {
                                        default: withCtx(() => [
                                          createVNode(_component_v_icon, { class: "mr-2" }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-bank")
                                            ]),
                                            _: 1
                                          }),
                                          createTextVNode(" Th\xF4ng tin thanh to\xE1n ")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_v_card_text, { class: "mt-3 pb-0" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    if (!unref(paymentInfo).bankName || !unref(paymentInfo).accountName || !unref(paymentInfo).accountNumber) {
                                      _push6(ssrRenderComponent(_component_v_sheet, {
                                        color: "orange",
                                        variant: "tonal",
                                        class: "pa-4 d-flex align-center justify-space-between rounded-lg"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<div${_scopeId6}><div class="font-bold"${_scopeId6}>${ssrInterpolate(_ctx.$t("B\u1EA0N CH\u01AFA TH\xCAM NG\xC2N H\xC0NG"))}</div><div class="mt-1"${_scopeId6}>${ssrInterpolate(_ctx.$t("Vui l\xF2ng th\xEAm th\xF4ng tin \u0111\u1EC3 c\xF3 th\u1EC3 r\xFAt ti\u1EC1n."))}</div></div>`);
                                            _push7(ssrRenderComponent(_component_v_btn, {
                                              icon: "",
                                              variant: "text",
                                              style: { "height": "48px" },
                                              onClick: ($event) => {
                                                var _a2;
                                                return (_a2 = unref(commonDialogRef)) == null ? void 0 : _a2.onDisplay(true);
                                              }
                                            }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_component_v_icon, null, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(`mdi-plus-circle-outline`);
                                                      } else {
                                                        return [
                                                          createTextVNode("mdi-plus-circle-outline")
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_component_v_icon, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode("mdi-plus-circle-outline")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode("div", null, [
                                                createVNode("div", { class: "font-bold" }, toDisplayString(_ctx.$t("B\u1EA0N CH\u01AFA TH\xCAM NG\xC2N H\xC0NG")), 1),
                                                createVNode("div", { class: "mt-1" }, toDisplayString(_ctx.$t("Vui l\xF2ng th\xEAm th\xF4ng tin \u0111\u1EC3 c\xF3 th\u1EC3 r\xFAt ti\u1EC1n.")), 1)
                                              ]),
                                              createVNode(_component_v_btn, {
                                                icon: "",
                                                variant: "text",
                                                style: { "height": "48px" },
                                                onClick: ($event) => {
                                                  var _a2;
                                                  return (_a2 = unref(commonDialogRef)) == null ? void 0 : _a2.onDisplay(true);
                                                }
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_v_icon, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-plus-circle-outline")
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }, 8, ["onClick"])
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      _push6(ssrRenderComponent(_component_v_sheet, {
                                        variant: "outlined",
                                        class: "rounded-lg"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_v_list_item, { class: "pa-0" }, {
                                              append: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_component_v_btn, {
                                                    icon: "",
                                                    variant: "text",
                                                    style: { "height": "48px" },
                                                    onClick: ($event) => onResetForm()
                                                  }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(_component_v_icon, null, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(`mdi-pencil-outline`);
                                                            } else {
                                                              return [
                                                                createTextVNode("mdi-pencil-outline")
                                                              ];
                                                            }
                                                          }),
                                                          _: 1
                                                        }, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(_component_v_icon, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode("mdi-pencil-outline")
                                                            ]),
                                                            _: 1
                                                          })
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_component_v_btn, {
                                                      icon: "",
                                                      variant: "text",
                                                      style: { "height": "48px" },
                                                      onClick: ($event) => onResetForm()
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(_component_v_icon, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode("mdi-pencil-outline")
                                                          ]),
                                                          _: 1
                                                        })
                                                      ]),
                                                      _: 1
                                                    }, 8, ["onClick"])
                                                  ];
                                                }
                                              }),
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                var _a2, _b2, _c2, _d, _e, _f;
                                                if (_push8) {
                                                  _push8(`<h3 class="font-bold"${_scopeId7}>${ssrInterpolate((_a2 = unref(paymentInfo)) == null ? void 0 : _a2.accountName)}</h3><h3${_scopeId7}>${ssrInterpolate((_b2 = unref(paymentInfo)) == null ? void 0 : _b2.accountNumber)}</h3><h3${_scopeId7}>${ssrInterpolate((_c2 = unref(paymentInfo)) == null ? void 0 : _c2.bankName)}</h3>`);
                                                } else {
                                                  return [
                                                    createVNode("h3", { class: "font-bold" }, toDisplayString((_d = unref(paymentInfo)) == null ? void 0 : _d.accountName), 1),
                                                    createVNode("h3", null, toDisplayString((_e = unref(paymentInfo)) == null ? void 0 : _e.accountNumber), 1),
                                                    createVNode("h3", null, toDisplayString((_f = unref(paymentInfo)) == null ? void 0 : _f.bankName), 1)
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_v_list_item, { class: "pa-0" }, {
                                                append: withCtx(() => [
                                                  createVNode(_component_v_btn, {
                                                    icon: "",
                                                    variant: "text",
                                                    style: { "height": "48px" },
                                                    onClick: ($event) => onResetForm()
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_v_icon, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode("mdi-pencil-outline")
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  }, 8, ["onClick"])
                                                ]),
                                                default: withCtx(() => {
                                                  var _a2, _b2, _c2;
                                                  return [
                                                    createVNode("h3", { class: "font-bold" }, toDisplayString((_a2 = unref(paymentInfo)) == null ? void 0 : _a2.accountName), 1),
                                                    createVNode("h3", null, toDisplayString((_b2 = unref(paymentInfo)) == null ? void 0 : _b2.accountNumber), 1),
                                                    createVNode("h3", null, toDisplayString((_c2 = unref(paymentInfo)) == null ? void 0 : _c2.bankName), 1)
                                                  ];
                                                }),
                                                _: 1
                                              })
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    }
                                  } else {
                                    return [
                                      !unref(paymentInfo).bankName || !unref(paymentInfo).accountName || !unref(paymentInfo).accountNumber ? (openBlock(), createBlock(_component_v_sheet, {
                                        key: 0,
                                        color: "orange",
                                        variant: "tonal",
                                        class: "pa-4 d-flex align-center justify-space-between rounded-lg"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode("div", null, [
                                            createVNode("div", { class: "font-bold" }, toDisplayString(_ctx.$t("B\u1EA0N CH\u01AFA TH\xCAM NG\xC2N H\xC0NG")), 1),
                                            createVNode("div", { class: "mt-1" }, toDisplayString(_ctx.$t("Vui l\xF2ng th\xEAm th\xF4ng tin \u0111\u1EC3 c\xF3 th\u1EC3 r\xFAt ti\u1EC1n.")), 1)
                                          ]),
                                          createVNode(_component_v_btn, {
                                            icon: "",
                                            variant: "text",
                                            style: { "height": "48px" },
                                            onClick: ($event) => {
                                              var _a2;
                                              return (_a2 = unref(commonDialogRef)) == null ? void 0 : _a2.onDisplay(true);
                                            }
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_v_icon, null, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-plus-circle-outline")
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }, 8, ["onClick"])
                                        ]),
                                        _: 1
                                      })) : (openBlock(), createBlock(_component_v_sheet, {
                                        key: 1,
                                        variant: "outlined",
                                        class: "rounded-lg"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_v_list_item, { class: "pa-0" }, {
                                            append: withCtx(() => [
                                              createVNode(_component_v_btn, {
                                                icon: "",
                                                variant: "text",
                                                style: { "height": "48px" },
                                                onClick: ($event) => onResetForm()
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_v_icon, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode("mdi-pencil-outline")
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }, 8, ["onClick"])
                                            ]),
                                            default: withCtx(() => {
                                              var _a2, _b2, _c2;
                                              return [
                                                createVNode("h3", { class: "font-bold" }, toDisplayString((_a2 = unref(paymentInfo)) == null ? void 0 : _a2.accountName), 1),
                                                createVNode("h3", null, toDisplayString((_b2 = unref(paymentInfo)) == null ? void 0 : _b2.accountNumber), 1),
                                                createVNode("h3", null, toDisplayString((_c2 = unref(paymentInfo)) == null ? void 0 : _c2.bankName), 1)
                                              ];
                                            }),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }))
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_v_card_text, { class: "pb-7" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<h3 class="mb-2 font-bold"${_scopeId5}>${ssrInterpolate(_ctx.$t("LINK G\u1EDAI THI\u1EC6U C\u1EE6A B\u1EA0N"))}</h3>`);
                                    _push6(ssrRenderComponent(_component_v_text_field, {
                                      modelValue: unref(onGetterUserData).referralLink,
                                      "onUpdate:modelValue": ($event) => unref(onGetterUserData).referralLink = $event,
                                      readonly: "",
                                      "hide-details": "",
                                      variant: "outlined",
                                      title: "Sao ch\xE9p m\xE3",
                                      style: { "cursor": "pointer" },
                                      color: unref(isCopied) ? "success" : "default",
                                      "append-inner-icon": unref(isCopied) ? "mdi-check" : "mdi-content-copy",
                                      "onClick:appendInner": ($event) => onCopyReferralLink()
                                    }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode("h3", { class: "mb-2 font-bold" }, toDisplayString(_ctx.$t("LINK G\u1EDAI THI\u1EC6U C\u1EE6A B\u1EA0N")), 1),
                                      createVNode(_component_v_text_field, {
                                        modelValue: unref(onGetterUserData).referralLink,
                                        "onUpdate:modelValue": ($event) => unref(onGetterUserData).referralLink = $event,
                                        readonly: "",
                                        "hide-details": "",
                                        variant: "outlined",
                                        title: "Sao ch\xE9p m\xE3",
                                        style: { "cursor": "pointer" },
                                        color: unref(isCopied) ? "success" : "default",
                                        "append-inner-icon": unref(isCopied) ? "mdi-check" : "mdi-content-copy",
                                        "onClick:appendInner": ($event) => onCopyReferralLink()
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "color", "append-inner-icon", "onClick:appendInner"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_v_divider, { class: "my-3 mx-4" }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_v_card_text, { class: "text-center" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  var _a2, _b2, _c2, _d, _e, _f;
                                  if (_push6) {
                                    _push6(`<div class="text-grey-darken-1"${_scopeId5}>S\u1ED1 d\u01B0 c\xF3 th\u1EC3 r\xFAt</div><h1 class="font-bold text-success-darken-1 my-2"${_scopeId5}>${ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))((_a2 = unref(onGetterUserData)) == null ? void 0 : _a2.pendingBalance))}</h1><div style="${ssrRenderStyle({ "border-radius": "6px", "margin": "auto", "max-width": "26rem" })}" class="${ssrRenderClass([{
                                      disabled: Boolean(
                                        ((_b2 = unref(onGetterUserData)) == null ? void 0 : _b2.pendingBalance) < MIN_PAYOUT_AMOUNT
                                      )
                                    }, "w-100 cta-button justify-center mt-6"])}"${_scopeId5}>`);
                                    _push6(ssrRenderComponent(_component_v_icon, { size: "27" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`mdi-bank-transfer-out`);
                                        } else {
                                          return [
                                            createTextVNode("mdi-bank-transfer-out")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(`<h3${_scopeId5}>${ssrInterpolate(_ctx.$t("Y\xEAu c\u1EA7u r\xFAt ti\u1EC1n"))}</h3></div>`);
                                    if (((_c2 = unref(onGetterUserData)) == null ? void 0 : _c2.pendingBalance) < MIN_PAYOUT_AMOUNT) {
                                      _push6(`<div class="text-caption text-error mt-2"${_scopeId5}> (${ssrInterpolate(`${_ctx.$t("S\u1ED1 d\u01B0 t\u1ED1i thi\u1EC3u \u0111\u1EC3 r\xFAt l\xE0")} ${("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(
                                        MIN_PAYOUT_AMOUNT
                                      )}`)} ) </div>`);
                                    } else {
                                      _push6(`<!---->`);
                                    }
                                  } else {
                                    return [
                                      createVNode("div", { class: "text-grey-darken-1" }, "S\u1ED1 d\u01B0 c\xF3 th\u1EC3 r\xFAt"),
                                      createVNode("h1", { class: "font-bold text-success-darken-1 my-2" }, toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))((_d = unref(onGetterUserData)) == null ? void 0 : _d.pendingBalance)), 1),
                                      createVNode("div", {
                                        class: ["w-100 cta-button justify-center mt-6", {
                                          disabled: Boolean(
                                            ((_e = unref(onGetterUserData)) == null ? void 0 : _e.pendingBalance) < MIN_PAYOUT_AMOUNT
                                          )
                                        }],
                                        style: { "border-radius": "6px", "margin": "auto", "max-width": "26rem" }
                                      }, [
                                        createVNode(_component_v_icon, { size: "27" }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-bank-transfer-out")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode("h3", null, toDisplayString(_ctx.$t("Y\xEAu c\u1EA7u r\xFAt ti\u1EC1n")), 1)
                                      ], 2),
                                      ((_f = unref(onGetterUserData)) == null ? void 0 : _f.pendingBalance) < MIN_PAYOUT_AMOUNT ? (openBlock(), createBlock("div", {
                                        key: 0,
                                        class: "text-caption text-error mt-2"
                                      }, " (" + toDisplayString(`${_ctx.$t("S\u1ED1 d\u01B0 t\u1ED1i thi\u1EC3u \u0111\u1EC3 r\xFAt l\xE0")} ${("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(
                                        MIN_PAYOUT_AMOUNT
                                      )}`) + " ) ", 1)) : createCommentVNode("", true)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_v_card_item, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_v_card_title, { class: "d-flex align-center" }, {
                                      default: withCtx(() => [
                                        createVNode(_component_v_icon, { class: "mr-2" }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-bank")
                                          ]),
                                          _: 1
                                        }),
                                        createTextVNode(" Th\xF4ng tin thanh to\xE1n ")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_v_card_text, { class: "mt-3 pb-0" }, {
                                  default: withCtx(() => [
                                    !unref(paymentInfo).bankName || !unref(paymentInfo).accountName || !unref(paymentInfo).accountNumber ? (openBlock(), createBlock(_component_v_sheet, {
                                      key: 0,
                                      color: "orange",
                                      variant: "tonal",
                                      class: "pa-4 d-flex align-center justify-space-between rounded-lg"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("div", null, [
                                          createVNode("div", { class: "font-bold" }, toDisplayString(_ctx.$t("B\u1EA0N CH\u01AFA TH\xCAM NG\xC2N H\xC0NG")), 1),
                                          createVNode("div", { class: "mt-1" }, toDisplayString(_ctx.$t("Vui l\xF2ng th\xEAm th\xF4ng tin \u0111\u1EC3 c\xF3 th\u1EC3 r\xFAt ti\u1EC1n.")), 1)
                                        ]),
                                        createVNode(_component_v_btn, {
                                          icon: "",
                                          variant: "text",
                                          style: { "height": "48px" },
                                          onClick: ($event) => {
                                            var _a2;
                                            return (_a2 = unref(commonDialogRef)) == null ? void 0 : _a2.onDisplay(true);
                                          }
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_v_icon, null, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-plus-circle-outline")
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }, 8, ["onClick"])
                                      ]),
                                      _: 1
                                    })) : (openBlock(), createBlock(_component_v_sheet, {
                                      key: 1,
                                      variant: "outlined",
                                      class: "rounded-lg"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_v_list_item, { class: "pa-0" }, {
                                          append: withCtx(() => [
                                            createVNode(_component_v_btn, {
                                              icon: "",
                                              variant: "text",
                                              style: { "height": "48px" },
                                              onClick: ($event) => onResetForm()
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(_component_v_icon, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode("mdi-pencil-outline")
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }, 8, ["onClick"])
                                          ]),
                                          default: withCtx(() => {
                                            var _a2, _b2, _c2;
                                            return [
                                              createVNode("h3", { class: "font-bold" }, toDisplayString((_a2 = unref(paymentInfo)) == null ? void 0 : _a2.accountName), 1),
                                              createVNode("h3", null, toDisplayString((_b2 = unref(paymentInfo)) == null ? void 0 : _b2.accountNumber), 1),
                                              createVNode("h3", null, toDisplayString((_c2 = unref(paymentInfo)) == null ? void 0 : _c2.bankName), 1)
                                            ];
                                          }),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }))
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_v_card_text, { class: "pb-7" }, {
                                  default: withCtx(() => [
                                    createVNode("h3", { class: "mb-2 font-bold" }, toDisplayString(_ctx.$t("LINK G\u1EDAI THI\u1EC6U C\u1EE6A B\u1EA0N")), 1),
                                    createVNode(_component_v_text_field, {
                                      modelValue: unref(onGetterUserData).referralLink,
                                      "onUpdate:modelValue": ($event) => unref(onGetterUserData).referralLink = $event,
                                      readonly: "",
                                      "hide-details": "",
                                      variant: "outlined",
                                      title: "Sao ch\xE9p m\xE3",
                                      style: { "cursor": "pointer" },
                                      color: unref(isCopied) ? "success" : "default",
                                      "append-inner-icon": unref(isCopied) ? "mdi-check" : "mdi-content-copy",
                                      "onClick:appendInner": ($event) => onCopyReferralLink()
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "color", "append-inner-icon", "onClick:appendInner"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_v_divider, { class: "my-3 mx-4" }),
                                createVNode(_component_v_card_text, { class: "text-center" }, {
                                  default: withCtx(() => {
                                    var _a2, _b2, _c2;
                                    return [
                                      createVNode("div", { class: "text-grey-darken-1" }, "S\u1ED1 d\u01B0 c\xF3 th\u1EC3 r\xFAt"),
                                      createVNode("h1", { class: "font-bold text-success-darken-1 my-2" }, toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))((_a2 = unref(onGetterUserData)) == null ? void 0 : _a2.pendingBalance)), 1),
                                      createVNode("div", {
                                        class: ["w-100 cta-button justify-center mt-6", {
                                          disabled: Boolean(
                                            ((_b2 = unref(onGetterUserData)) == null ? void 0 : _b2.pendingBalance) < MIN_PAYOUT_AMOUNT
                                          )
                                        }],
                                        style: { "border-radius": "6px", "margin": "auto", "max-width": "26rem" }
                                      }, [
                                        createVNode(_component_v_icon, { size: "27" }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-bank-transfer-out")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode("h3", null, toDisplayString(_ctx.$t("Y\xEAu c\u1EA7u r\xFAt ti\u1EC1n")), 1)
                                      ], 2),
                                      ((_c2 = unref(onGetterUserData)) == null ? void 0 : _c2.pendingBalance) < MIN_PAYOUT_AMOUNT ? (openBlock(), createBlock("div", {
                                        key: 0,
                                        class: "text-caption text-error mt-2"
                                      }, " (" + toDisplayString(`${_ctx.$t("S\u1ED1 d\u01B0 t\u1ED1i thi\u1EC3u \u0111\u1EC3 r\xFAt l\xE0")} ${("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(
                                        MIN_PAYOUT_AMOUNT
                                      )}`) + " ) ", 1)) : createCommentVNode("", true)
                                    ];
                                  }),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_v_card_text, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<h2 class="mb-2 font-bold"${_scopeId4}>L\u01B0u \xFD khi r\xFAt ti\u1EC1n</h2><ul class="pl-5 text-medium-emphasis"${_scopeId4}><li${_scopeId4}> S\u1ED1 d\u01B0 t\u1ED1i thi\u1EC3u \u0111\u1EC3 th\u1EF1c hi\u1EC7n y\xEAu c\u1EA7u l\xE0 <b${_scopeId4}>${ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(MIN_PAYOUT_AMOUNT))}</b>. </li><li${_scopeId4}> C\xE1c y\xEAu c\u1EA7u r\xFAt ti\u1EC1n s\u1EBD \u0111\u01B0\u1EE3c x\u1EED l\xFD v\xE0 thanh to\xE1n v\xE0o <b${_scopeId4}>ng\xE0y 15</b> h\xE0ng th\xE1ng. </li><li${_scopeId4}> Vui l\xF2ng \u0111\u1EA3m b\u1EA3o th\xF4ng tin ng\xE2n h\xE0ng ch\xEDnh x\xE1c. Ch\xFAng t\xF4i kh\xF4ng ch\u1ECBu tr\xE1ch nhi\u1EC7m n\u1EBFu b\u1EA1n nh\u1EADp sai th\xF4ng tin. </li><li${_scopeId4}> S\u1ED1 d\u01B0 ch\u1EDD thanh to\xE1n (\`PENDING\`) m\u1EDBi \u0111\u01B0\u1EE3c t\xEDnh v\xE0o s\u1ED1 d\u01B0 c\xF3 th\u1EC3 r\xFAt. C\xE1c kho\u1EA3n &quot;Ch\u1EDD ch\u1ED1t %&quot; s\u1EBD \u0111\u01B0\u1EE3c x\u1EED l\xFD v\xE0o cu\u1ED1i th\xE1ng. </li></ul>`);
                            } else {
                              return [
                                createVNode("h2", { class: "mb-2 font-bold" }, "L\u01B0u \xFD khi r\xFAt ti\u1EC1n"),
                                createVNode("ul", { class: "pl-5 text-medium-emphasis" }, [
                                  createVNode("li", null, [
                                    createTextVNode(" S\u1ED1 d\u01B0 t\u1ED1i thi\u1EC3u \u0111\u1EC3 th\u1EF1c hi\u1EC7n y\xEAu c\u1EA7u l\xE0 "),
                                    createVNode("b", null, toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(MIN_PAYOUT_AMOUNT)), 1),
                                    createTextVNode(". ")
                                  ]),
                                  createVNode("li", null, [
                                    createTextVNode(" C\xE1c y\xEAu c\u1EA7u r\xFAt ti\u1EC1n s\u1EBD \u0111\u01B0\u1EE3c x\u1EED l\xFD v\xE0 thanh to\xE1n v\xE0o "),
                                    createVNode("b", null, "ng\xE0y 15"),
                                    createTextVNode(" h\xE0ng th\xE1ng. ")
                                  ]),
                                  createVNode("li", null, " Vui l\xF2ng \u0111\u1EA3m b\u1EA3o th\xF4ng tin ng\xE2n h\xE0ng ch\xEDnh x\xE1c. Ch\xFAng t\xF4i kh\xF4ng ch\u1ECBu tr\xE1ch nhi\u1EC7m n\u1EBFu b\u1EA1n nh\u1EADp sai th\xF4ng tin. "),
                                  createVNode("li", null, ' S\u1ED1 d\u01B0 ch\u1EDD thanh to\xE1n (`PENDING`) m\u1EDBi \u0111\u01B0\u1EE3c t\xEDnh v\xE0o s\u1ED1 d\u01B0 c\xF3 th\u1EC3 r\xFAt. C\xE1c kho\u1EA3n "Ch\u1EDD ch\u1ED1t %" s\u1EBD \u0111\u01B0\u1EE3c x\u1EED l\xFD v\xE0o cu\u1ED1i th\xE1ng. ')
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_v_card, {
                            variant: "outlined",
                            class: ["py-3 pb-6", `${unref(width) > 550 ? "px-2" : "px-0"}`]
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_v_card_item, null, {
                                default: withCtx(() => [
                                  createVNode(_component_v_card_title, { class: "d-flex align-center" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_v_icon, { class: "mr-2" }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-bank")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" Th\xF4ng tin thanh to\xE1n ")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(_component_v_card_text, { class: "mt-3 pb-0" }, {
                                default: withCtx(() => [
                                  !unref(paymentInfo).bankName || !unref(paymentInfo).accountName || !unref(paymentInfo).accountNumber ? (openBlock(), createBlock(_component_v_sheet, {
                                    key: 0,
                                    color: "orange",
                                    variant: "tonal",
                                    class: "pa-4 d-flex align-center justify-space-between rounded-lg"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("div", null, [
                                        createVNode("div", { class: "font-bold" }, toDisplayString(_ctx.$t("B\u1EA0N CH\u01AFA TH\xCAM NG\xC2N H\xC0NG")), 1),
                                        createVNode("div", { class: "mt-1" }, toDisplayString(_ctx.$t("Vui l\xF2ng th\xEAm th\xF4ng tin \u0111\u1EC3 c\xF3 th\u1EC3 r\xFAt ti\u1EC1n.")), 1)
                                      ]),
                                      createVNode(_component_v_btn, {
                                        icon: "",
                                        variant: "text",
                                        style: { "height": "48px" },
                                        onClick: ($event) => {
                                          var _a2;
                                          return (_a2 = unref(commonDialogRef)) == null ? void 0 : _a2.onDisplay(true);
                                        }
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_v_icon, null, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-plus-circle-outline")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"])
                                    ]),
                                    _: 1
                                  })) : (openBlock(), createBlock(_component_v_sheet, {
                                    key: 1,
                                    variant: "outlined",
                                    class: "rounded-lg"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_v_list_item, { class: "pa-0" }, {
                                        append: withCtx(() => [
                                          createVNode(_component_v_btn, {
                                            icon: "",
                                            variant: "text",
                                            style: { "height": "48px" },
                                            onClick: ($event) => onResetForm()
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_v_icon, null, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-pencil-outline")
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }, 8, ["onClick"])
                                        ]),
                                        default: withCtx(() => {
                                          var _a2, _b2, _c2;
                                          return [
                                            createVNode("h3", { class: "font-bold" }, toDisplayString((_a2 = unref(paymentInfo)) == null ? void 0 : _a2.accountName), 1),
                                            createVNode("h3", null, toDisplayString((_b2 = unref(paymentInfo)) == null ? void 0 : _b2.accountNumber), 1),
                                            createVNode("h3", null, toDisplayString((_c2 = unref(paymentInfo)) == null ? void 0 : _c2.bankName), 1)
                                          ];
                                        }),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }))
                                ]),
                                _: 1
                              }),
                              createVNode(_component_v_card_text, { class: "pb-7" }, {
                                default: withCtx(() => [
                                  createVNode("h3", { class: "mb-2 font-bold" }, toDisplayString(_ctx.$t("LINK G\u1EDAI THI\u1EC6U C\u1EE6A B\u1EA0N")), 1),
                                  createVNode(_component_v_text_field, {
                                    modelValue: unref(onGetterUserData).referralLink,
                                    "onUpdate:modelValue": ($event) => unref(onGetterUserData).referralLink = $event,
                                    readonly: "",
                                    "hide-details": "",
                                    variant: "outlined",
                                    title: "Sao ch\xE9p m\xE3",
                                    style: { "cursor": "pointer" },
                                    color: unref(isCopied) ? "success" : "default",
                                    "append-inner-icon": unref(isCopied) ? "mdi-check" : "mdi-content-copy",
                                    "onClick:appendInner": ($event) => onCopyReferralLink()
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "color", "append-inner-icon", "onClick:appendInner"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_v_divider, { class: "my-3 mx-4" }),
                              createVNode(_component_v_card_text, { class: "text-center" }, {
                                default: withCtx(() => {
                                  var _a2, _b2, _c2;
                                  return [
                                    createVNode("div", { class: "text-grey-darken-1" }, "S\u1ED1 d\u01B0 c\xF3 th\u1EC3 r\xFAt"),
                                    createVNode("h1", { class: "font-bold text-success-darken-1 my-2" }, toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))((_a2 = unref(onGetterUserData)) == null ? void 0 : _a2.pendingBalance)), 1),
                                    createVNode("div", {
                                      class: ["w-100 cta-button justify-center mt-6", {
                                        disabled: Boolean(
                                          ((_b2 = unref(onGetterUserData)) == null ? void 0 : _b2.pendingBalance) < MIN_PAYOUT_AMOUNT
                                        )
                                      }],
                                      style: { "border-radius": "6px", "margin": "auto", "max-width": "26rem" }
                                    }, [
                                      createVNode(_component_v_icon, { size: "27" }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-bank-transfer-out")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode("h3", null, toDisplayString(_ctx.$t("Y\xEAu c\u1EA7u r\xFAt ti\u1EC1n")), 1)
                                    ], 2),
                                    ((_c2 = unref(onGetterUserData)) == null ? void 0 : _c2.pendingBalance) < MIN_PAYOUT_AMOUNT ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "text-caption text-error mt-2"
                                    }, " (" + toDisplayString(`${_ctx.$t("S\u1ED1 d\u01B0 t\u1ED1i thi\u1EC3u \u0111\u1EC3 r\xFAt l\xE0")} ${("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(
                                      MIN_PAYOUT_AMOUNT
                                    )}`) + " ) ", 1)) : createCommentVNode("", true)
                                  ];
                                }),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["class"]),
                          createVNode(_component_v_card_text, null, {
                            default: withCtx(() => [
                              createVNode("h2", { class: "mb-2 font-bold" }, "L\u01B0u \xFD khi r\xFAt ti\u1EC1n"),
                              createVNode("ul", { class: "pl-5 text-medium-emphasis" }, [
                                createVNode("li", null, [
                                  createTextVNode(" S\u1ED1 d\u01B0 t\u1ED1i thi\u1EC3u \u0111\u1EC3 th\u1EF1c hi\u1EC7n y\xEAu c\u1EA7u l\xE0 "),
                                  createVNode("b", null, toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(MIN_PAYOUT_AMOUNT)), 1),
                                  createTextVNode(". ")
                                ]),
                                createVNode("li", null, [
                                  createTextVNode(" C\xE1c y\xEAu c\u1EA7u r\xFAt ti\u1EC1n s\u1EBD \u0111\u01B0\u1EE3c x\u1EED l\xFD v\xE0 thanh to\xE1n v\xE0o "),
                                  createVNode("b", null, "ng\xE0y 15"),
                                  createTextVNode(" h\xE0ng th\xE1ng. ")
                                ]),
                                createVNode("li", null, " Vui l\xF2ng \u0111\u1EA3m b\u1EA3o th\xF4ng tin ng\xE2n h\xE0ng ch\xEDnh x\xE1c. Ch\xFAng t\xF4i kh\xF4ng ch\u1ECBu tr\xE1ch nhi\u1EC7m n\u1EBFu b\u1EA1n nh\u1EADp sai th\xF4ng tin. "),
                                createVNode("li", null, ' S\u1ED1 d\u01B0 ch\u1EDD thanh to\xE1n (`PENDING`) m\u1EDBi \u0111\u01B0\u1EE3c t\xEDnh v\xE0o s\u1ED1 d\u01B0 c\xF3 th\u1EC3 r\xFAt. C\xE1c kho\u1EA3n "Ch\u1EDD ch\u1ED1t %" s\u1EBD \u0111\u01B0\u1EE3c x\u1EED l\xFD v\xE0o cu\u1ED1i th\xE1ng. ')
                              ])
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
                      md: "10",
                      lg: "7"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_v_card, {
                          variant: "outlined",
                          class: ["py-3 pb-6", `${unref(width) > 550 ? "px-2" : "px-0"}`]
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_v_card_item, null, {
                              default: withCtx(() => [
                                createVNode(_component_v_card_title, { class: "d-flex align-center" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_v_icon, { class: "mr-2" }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-bank")
                                      ]),
                                      _: 1
                                    }),
                                    createTextVNode(" Th\xF4ng tin thanh to\xE1n ")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_v_card_text, { class: "mt-3 pb-0" }, {
                              default: withCtx(() => [
                                !unref(paymentInfo).bankName || !unref(paymentInfo).accountName || !unref(paymentInfo).accountNumber ? (openBlock(), createBlock(_component_v_sheet, {
                                  key: 0,
                                  color: "orange",
                                  variant: "tonal",
                                  class: "pa-4 d-flex align-center justify-space-between rounded-lg"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("div", null, [
                                      createVNode("div", { class: "font-bold" }, toDisplayString(_ctx.$t("B\u1EA0N CH\u01AFA TH\xCAM NG\xC2N H\xC0NG")), 1),
                                      createVNode("div", { class: "mt-1" }, toDisplayString(_ctx.$t("Vui l\xF2ng th\xEAm th\xF4ng tin \u0111\u1EC3 c\xF3 th\u1EC3 r\xFAt ti\u1EC1n.")), 1)
                                    ]),
                                    createVNode(_component_v_btn, {
                                      icon: "",
                                      variant: "text",
                                      style: { "height": "48px" },
                                      onClick: ($event) => {
                                        var _a2;
                                        return (_a2 = unref(commonDialogRef)) == null ? void 0 : _a2.onDisplay(true);
                                      }
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_v_icon, null, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-plus-circle-outline")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"])
                                  ]),
                                  _: 1
                                })) : (openBlock(), createBlock(_component_v_sheet, {
                                  key: 1,
                                  variant: "outlined",
                                  class: "rounded-lg"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_v_list_item, { class: "pa-0" }, {
                                      append: withCtx(() => [
                                        createVNode(_component_v_btn, {
                                          icon: "",
                                          variant: "text",
                                          style: { "height": "48px" },
                                          onClick: ($event) => onResetForm()
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(_component_v_icon, null, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-pencil-outline")
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }, 8, ["onClick"])
                                      ]),
                                      default: withCtx(() => {
                                        var _a2, _b2, _c2;
                                        return [
                                          createVNode("h3", { class: "font-bold" }, toDisplayString((_a2 = unref(paymentInfo)) == null ? void 0 : _a2.accountName), 1),
                                          createVNode("h3", null, toDisplayString((_b2 = unref(paymentInfo)) == null ? void 0 : _b2.accountNumber), 1),
                                          createVNode("h3", null, toDisplayString((_c2 = unref(paymentInfo)) == null ? void 0 : _c2.bankName), 1)
                                        ];
                                      }),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }))
                              ]),
                              _: 1
                            }),
                            createVNode(_component_v_card_text, { class: "pb-7" }, {
                              default: withCtx(() => [
                                createVNode("h3", { class: "mb-2 font-bold" }, toDisplayString(_ctx.$t("LINK G\u1EDAI THI\u1EC6U C\u1EE6A B\u1EA0N")), 1),
                                createVNode(_component_v_text_field, {
                                  modelValue: unref(onGetterUserData).referralLink,
                                  "onUpdate:modelValue": ($event) => unref(onGetterUserData).referralLink = $event,
                                  readonly: "",
                                  "hide-details": "",
                                  variant: "outlined",
                                  title: "Sao ch\xE9p m\xE3",
                                  style: { "cursor": "pointer" },
                                  color: unref(isCopied) ? "success" : "default",
                                  "append-inner-icon": unref(isCopied) ? "mdi-check" : "mdi-content-copy",
                                  "onClick:appendInner": ($event) => onCopyReferralLink()
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "color", "append-inner-icon", "onClick:appendInner"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_v_divider, { class: "my-3 mx-4" }),
                            createVNode(_component_v_card_text, { class: "text-center" }, {
                              default: withCtx(() => {
                                var _a2, _b2, _c2;
                                return [
                                  createVNode("div", { class: "text-grey-darken-1" }, "S\u1ED1 d\u01B0 c\xF3 th\u1EC3 r\xFAt"),
                                  createVNode("h1", { class: "font-bold text-success-darken-1 my-2" }, toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))((_a2 = unref(onGetterUserData)) == null ? void 0 : _a2.pendingBalance)), 1),
                                  createVNode("div", {
                                    class: ["w-100 cta-button justify-center mt-6", {
                                      disabled: Boolean(
                                        ((_b2 = unref(onGetterUserData)) == null ? void 0 : _b2.pendingBalance) < MIN_PAYOUT_AMOUNT
                                      )
                                    }],
                                    style: { "border-radius": "6px", "margin": "auto", "max-width": "26rem" }
                                  }, [
                                    createVNode(_component_v_icon, { size: "27" }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-bank-transfer-out")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode("h3", null, toDisplayString(_ctx.$t("Y\xEAu c\u1EA7u r\xFAt ti\u1EC1n")), 1)
                                  ], 2),
                                  ((_c2 = unref(onGetterUserData)) == null ? void 0 : _c2.pendingBalance) < MIN_PAYOUT_AMOUNT ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "text-caption text-error mt-2"
                                  }, " (" + toDisplayString(`${_ctx.$t("S\u1ED1 d\u01B0 t\u1ED1i thi\u1EC3u \u0111\u1EC3 r\xFAt l\xE0")} ${("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(
                                    MIN_PAYOUT_AMOUNT
                                  )}`) + " ) ", 1)) : createCommentVNode("", true)
                                ];
                              }),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["class"]),
                        createVNode(_component_v_card_text, null, {
                          default: withCtx(() => [
                            createVNode("h2", { class: "mb-2 font-bold" }, "L\u01B0u \xFD khi r\xFAt ti\u1EC1n"),
                            createVNode("ul", { class: "pl-5 text-medium-emphasis" }, [
                              createVNode("li", null, [
                                createTextVNode(" S\u1ED1 d\u01B0 t\u1ED1i thi\u1EC3u \u0111\u1EC3 th\u1EF1c hi\u1EC7n y\xEAu c\u1EA7u l\xE0 "),
                                createVNode("b", null, toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(MIN_PAYOUT_AMOUNT)), 1),
                                createTextVNode(". ")
                              ]),
                              createVNode("li", null, [
                                createTextVNode(" C\xE1c y\xEAu c\u1EA7u r\xFAt ti\u1EC1n s\u1EBD \u0111\u01B0\u1EE3c x\u1EED l\xFD v\xE0 thanh to\xE1n v\xE0o "),
                                createVNode("b", null, "ng\xE0y 15"),
                                createTextVNode(" h\xE0ng th\xE1ng. ")
                              ]),
                              createVNode("li", null, " Vui l\xF2ng \u0111\u1EA3m b\u1EA3o th\xF4ng tin ng\xE2n h\xE0ng ch\xEDnh x\xE1c. Ch\xFAng t\xF4i kh\xF4ng ch\u1ECBu tr\xE1ch nhi\u1EC7m n\u1EBFu b\u1EA1n nh\u1EADp sai th\xF4ng tin. "),
                              createVNode("li", null, ' S\u1ED1 d\u01B0 ch\u1EDD thanh to\xE1n (`PENDING`) m\u1EDBi \u0111\u01B0\u1EE3c t\xEDnh v\xE0o s\u1ED1 d\u01B0 c\xF3 th\u1EC3 r\xFAt. C\xE1c kho\u1EA3n "Ch\u1EDD ch\u1ED1t %" s\u1EBD \u0111\u01B0\u1EE3c x\u1EED l\xFD v\xE0o cu\u1ED1i th\xE1ng. ')
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
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_CommonDialog, {
                ref_key: "commonDialogRef",
                ref: commonDialogRef,
                title: "Th\xF4ng tin thanh to\xE1n",
                width: "500"
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "mt-3" }, [
                    createVNode(_component_v_text_field, {
                      modelValue: unref(formData).bankName,
                      "onUpdate:modelValue": ($event) => unref(formData).bankName = $event,
                      class: "w-100",
                      variant: "outlined",
                      label: _ctx.$t("T\xEAn ng\xE2n h\xE0ng (V\xED d\u1EE5: ACB, Vietcombank...)")
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "label"]),
                    createVNode(_component_v_text_field, {
                      modelValue: unref(formData).accountName,
                      "onUpdate:modelValue": ($event) => unref(formData).accountName = $event,
                      class: "w-100",
                      variant: "outlined",
                      label: _ctx.$t("T\xEAn ch\u1EE7 t\xE0i kho\u1EA3n (Vi\u1EBFt hoa, kh\xF4ng d\u1EA5u)")
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "label"]),
                    createVNode(_component_v_text_field, {
                      modelValue: unref(formData).accountNumber,
                      "onUpdate:modelValue": ($event) => unref(formData).accountNumber = $event,
                      class: "w-100",
                      variant: "outlined",
                      label: _ctx.$t("S\u1ED1 t\xE0i kho\u1EA3n")
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "label"])
                  ]),
                  createVNode("div", { class: "d-flex ga-3 mt-6" }, [
                    createVNode(_component_v_btn, {
                      text: "H\u1EE7y b\u1ECF",
                      class: "flex-1",
                      variant: "tonal",
                      color: "primary",
                      style: { "height": "48px" },
                      onClick: ($event) => {
                        var _a2;
                        return (_a2 = unref(commonDialogRef)) == null ? void 0 : _a2.onDisplay(false);
                      }
                    }, null, 8, ["onClick"]),
                    createVNode(_component_v_btn, {
                      text: "L\u01B0u th\xF4ng tin",
                      class: "flex-1",
                      variant: "flat",
                      color: "primary",
                      style: { "height": "48px" },
                      disabled: Boolean(
                        !unref(formData).bankName || !unref(formData).accountName || !unref(formData).accountNumber
                      ),
                      loading: Boolean(unref(loading) === "save-payment-info"),
                      onClick: onSavePaymentInfo
                    }, null, 8, ["disabled", "loading"])
                  ])
                ]),
                _: 1
              }, 512),
              createVNode(_component_v_row, {
                justify: "center",
                class: ""
              }, {
                default: withCtx(() => [
                  createVNode(_component_v_col, {
                    cols: "12",
                    md: "10",
                    lg: "7"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_v_card, {
                        variant: "outlined",
                        class: ["py-3 pb-6", `${unref(width) > 550 ? "px-2" : "px-0"}`]
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_v_card_item, null, {
                            default: withCtx(() => [
                              createVNode(_component_v_card_title, { class: "d-flex align-center" }, {
                                default: withCtx(() => [
                                  createVNode(_component_v_icon, { class: "mr-2" }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-bank")
                                    ]),
                                    _: 1
                                  }),
                                  createTextVNode(" Th\xF4ng tin thanh to\xE1n ")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_v_card_text, { class: "mt-3 pb-0" }, {
                            default: withCtx(() => [
                              !unref(paymentInfo).bankName || !unref(paymentInfo).accountName || !unref(paymentInfo).accountNumber ? (openBlock(), createBlock(_component_v_sheet, {
                                key: 0,
                                color: "orange",
                                variant: "tonal",
                                class: "pa-4 d-flex align-center justify-space-between rounded-lg"
                              }, {
                                default: withCtx(() => [
                                  createVNode("div", null, [
                                    createVNode("div", { class: "font-bold" }, toDisplayString(_ctx.$t("B\u1EA0N CH\u01AFA TH\xCAM NG\xC2N H\xC0NG")), 1),
                                    createVNode("div", { class: "mt-1" }, toDisplayString(_ctx.$t("Vui l\xF2ng th\xEAm th\xF4ng tin \u0111\u1EC3 c\xF3 th\u1EC3 r\xFAt ti\u1EC1n.")), 1)
                                  ]),
                                  createVNode(_component_v_btn, {
                                    icon: "",
                                    variant: "text",
                                    style: { "height": "48px" },
                                    onClick: ($event) => {
                                      var _a2;
                                      return (_a2 = unref(commonDialogRef)) == null ? void 0 : _a2.onDisplay(true);
                                    }
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_v_icon, null, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-plus-circle-outline")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["onClick"])
                                ]),
                                _: 1
                              })) : (openBlock(), createBlock(_component_v_sheet, {
                                key: 1,
                                variant: "outlined",
                                class: "rounded-lg"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_v_list_item, { class: "pa-0" }, {
                                    append: withCtx(() => [
                                      createVNode(_component_v_btn, {
                                        icon: "",
                                        variant: "text",
                                        style: { "height": "48px" },
                                        onClick: ($event) => onResetForm()
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_v_icon, null, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-pencil-outline")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"])
                                    ]),
                                    default: withCtx(() => {
                                      var _a2, _b2, _c2;
                                      return [
                                        createVNode("h3", { class: "font-bold" }, toDisplayString((_a2 = unref(paymentInfo)) == null ? void 0 : _a2.accountName), 1),
                                        createVNode("h3", null, toDisplayString((_b2 = unref(paymentInfo)) == null ? void 0 : _b2.accountNumber), 1),
                                        createVNode("h3", null, toDisplayString((_c2 = unref(paymentInfo)) == null ? void 0 : _c2.bankName), 1)
                                      ];
                                    }),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }))
                            ]),
                            _: 1
                          }),
                          createVNode(_component_v_card_text, { class: "pb-7" }, {
                            default: withCtx(() => [
                              createVNode("h3", { class: "mb-2 font-bold" }, toDisplayString(_ctx.$t("LINK G\u1EDAI THI\u1EC6U C\u1EE6A B\u1EA0N")), 1),
                              createVNode(_component_v_text_field, {
                                modelValue: unref(onGetterUserData).referralLink,
                                "onUpdate:modelValue": ($event) => unref(onGetterUserData).referralLink = $event,
                                readonly: "",
                                "hide-details": "",
                                variant: "outlined",
                                title: "Sao ch\xE9p m\xE3",
                                style: { "cursor": "pointer" },
                                color: unref(isCopied) ? "success" : "default",
                                "append-inner-icon": unref(isCopied) ? "mdi-check" : "mdi-content-copy",
                                "onClick:appendInner": ($event) => onCopyReferralLink()
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "color", "append-inner-icon", "onClick:appendInner"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_v_divider, { class: "my-3 mx-4" }),
                          createVNode(_component_v_card_text, { class: "text-center" }, {
                            default: withCtx(() => {
                              var _a2, _b2, _c2;
                              return [
                                createVNode("div", { class: "text-grey-darken-1" }, "S\u1ED1 d\u01B0 c\xF3 th\u1EC3 r\xFAt"),
                                createVNode("h1", { class: "font-bold text-success-darken-1 my-2" }, toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))((_a2 = unref(onGetterUserData)) == null ? void 0 : _a2.pendingBalance)), 1),
                                createVNode("div", {
                                  class: ["w-100 cta-button justify-center mt-6", {
                                    disabled: Boolean(
                                      ((_b2 = unref(onGetterUserData)) == null ? void 0 : _b2.pendingBalance) < MIN_PAYOUT_AMOUNT
                                    )
                                  }],
                                  style: { "border-radius": "6px", "margin": "auto", "max-width": "26rem" }
                                }, [
                                  createVNode(_component_v_icon, { size: "27" }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-bank-transfer-out")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode("h3", null, toDisplayString(_ctx.$t("Y\xEAu c\u1EA7u r\xFAt ti\u1EC1n")), 1)
                                ], 2),
                                ((_c2 = unref(onGetterUserData)) == null ? void 0 : _c2.pendingBalance) < MIN_PAYOUT_AMOUNT ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "text-caption text-error mt-2"
                                }, " (" + toDisplayString(`${_ctx.$t("S\u1ED1 d\u01B0 t\u1ED1i thi\u1EC3u \u0111\u1EC3 r\xFAt l\xE0")} ${("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(
                                  MIN_PAYOUT_AMOUNT
                                )}`) + " ) ", 1)) : createCommentVNode("", true)
                              ];
                            }),
                            _: 1
                          })
                        ]),
                        _: 1
                      }, 8, ["class"]),
                      createVNode(_component_v_card_text, null, {
                        default: withCtx(() => [
                          createVNode("h2", { class: "mb-2 font-bold" }, "L\u01B0u \xFD khi r\xFAt ti\u1EC1n"),
                          createVNode("ul", { class: "pl-5 text-medium-emphasis" }, [
                            createVNode("li", null, [
                              createTextVNode(" S\u1ED1 d\u01B0 t\u1ED1i thi\u1EC3u \u0111\u1EC3 th\u1EF1c hi\u1EC7n y\xEAu c\u1EA7u l\xE0 "),
                              createVNode("b", null, toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(MIN_PAYOUT_AMOUNT)), 1),
                              createTextVNode(". ")
                            ]),
                            createVNode("li", null, [
                              createTextVNode(" C\xE1c y\xEAu c\u1EA7u r\xFAt ti\u1EC1n s\u1EBD \u0111\u01B0\u1EE3c x\u1EED l\xFD v\xE0 thanh to\xE1n v\xE0o "),
                              createVNode("b", null, "ng\xE0y 15"),
                              createTextVNode(" h\xE0ng th\xE1ng. ")
                            ]),
                            createVNode("li", null, " Vui l\xF2ng \u0111\u1EA3m b\u1EA3o th\xF4ng tin ng\xE2n h\xE0ng ch\xEDnh x\xE1c. Ch\xFAng t\xF4i kh\xF4ng ch\u1ECBu tr\xE1ch nhi\u1EC7m n\u1EBFu b\u1EA1n nh\u1EADp sai th\xF4ng tin. "),
                            createVNode("li", null, ' S\u1ED1 d\u01B0 ch\u1EDD thanh to\xE1n (`PENDING`) m\u1EDBi \u0111\u01B0\u1EE3c t\xEDnh v\xE0o s\u1ED1 d\u01B0 c\xF3 th\u1EC3 r\xFAt. C\xE1c kho\u1EA3n "Ch\u1EDD ch\u1ED1t %" s\u1EBD \u0111\u01B0\u1EE3c x\u1EED l\xFD v\xE0o cu\u1ED1i th\xE1ng. ')
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
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/partner/payment.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=payment-CEltrEMK.mjs.map
