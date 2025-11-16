import { _ as _sfc_main$1 } from './CommonDialog-CSwcOS1W.mjs';
import { _ as _sfc_main$2 } from './DataTable-Cfx4fCxn.mjs';
import { E as EnumAccountRole } from './enum-kAdbNx_J.mjs';
import { defineComponent, computed, ref, reactive, resolveComponent, withCtx, unref, createVNode, createBlock, createCommentVNode, toDisplayString, openBlock, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrInterpolate } from 'vue/server-renderer';
import { a as accountService } from './account-Cwp5COvj.mjs';
import { _ as __nuxt_component_0 } from './ConfirmDialog-Df9nJcuZ.mjs';
import { _ as _export_sfc, g as useRoute$1, e as useI18n } from './server.mjs';
import { u as useMasterDataStore } from './master-data-ZBucjABo.mjs';
import { s as statusOptions } from './constants-B3HUeYES.mjs';
import { f as formatCurrency } from './helper-QcO-vDIR.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AccountTable",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const { t } = useI18n();
    const { onGetterMasterData } = useMasterDataStore();
    const headers = computed(() => {
      const item = [
        { title: "H\u1ECD v\xE0 t\xEAn", key: "name", sortable: false },
        { title: "Email", key: "email", sortable: false },
        { title: "Th\u1EDDi h\u1EA1n c\xF2n l\u1EA1i", key: "remainingTime", sortable: false },
        { title: "Ng\xE0y tham gia", key: "createdAt", sortable: false },
        { title: "Ng\u01B0\u1EDDi gi\u1EDBi thi\u1EC7u", key: "referral.name", sortable: false },
        { title: "C\u1EADp nh\u1EADt", key: "updatedAt", sortable: false },
        { title: "Tr\u1EA1ng th\xE1i", key: "status", align: "center", sortable: false },
        { title: "Thao t\xE1c", key: "action", align: "center", sortable: false }
      ];
      if (role.value === EnumAccountRole.ADMIN) {
        item.splice(4, 1);
        item.pop();
      }
      return item;
    });
    const data = ref({});
    const loading = ref("");
    const dataTableRef = ref(null);
    const commonDialogRef = ref(null);
    const confirmDialogRef = ref(null);
    const role = computed(() => {
      var _a, _b;
      return ((_b = (_a = route.path) == null ? void 0 : _a.split("/")) == null ? void 0 : _b.pop()) || "user";
    });
    const formData = reactive({
      name: "",
      email: "",
      referral: { _id: null },
      price: 69e3,
      rentalMonths: 1
    });
    const statusItems = computed(
      () => {
        var _a;
        return (_a = statusOptions) == null ? void 0 : _a.map((x) => ({ ...x, title: t(x.title) }));
      }
    );
    const priceOptions = computed(
      () => role.value === "user" ? [
        { title: "60.000 VND", value: 6e4 },
        { title: "69,000 VND", value: 69e3 },
        { title: "99,000 VND", value: 99e3 }
      ] : [{ title: "99,000 VND", value: 99e3 }]
    );
    const rentalMonthsOptions = computed(
      () => {
        var _a;
        return ((_a = onGetterMasterData.value["rental-months"]) == null ? void 0 : _a.map((x) => ({
          title: t(x.title),
          value: x.value
        }))) || [];
      }
    );
    const totalPrice = computed(
      () => formatCurrency(formData.price * formData.rentalMonths)
    );
    async function loadItems(event) {
      const params = { ...event, role: role.value };
      loading.value = "load-table";
      await accountService.getAllAccount(params).then((res) => {
        if (res.data) data.value = res.data;
      }).finally(() => {
        loading.value = "";
      });
    }
    const onResetForm = async (item) => {
      formData.accountId = item._id;
      formData.name = item.name;
      formData.email = item.email;
      formData.referral = item.remainingTime === "Ch\u01B0a t\u1EEBng \u0111\u0103ng k\xFD" && item.referral ? item.referral : { isReferral: false };
      formData.price = role.value !== "user" ? 99e3 : 69e3;
      formData.rentalMonths = 1;
      formData.remainingTime = item.remainingTime || "Ch\u01B0a t\u1EEBng \u0111\u0103ng k\xFD";
    };
    const onAction = async (event) => {
      if (event.action == "view") {
        onResetForm(event.item);
      }
    };
    const onClickRegisterService = (event) => {
      onResetForm(event);
      commonDialogRef.value.onDisplay(true);
    };
    const onConfirmRegisterService = async () => {
      let payload = {
        accountId: formData.accountId,
        price: formData.price,
        rentalMonths: formData.rentalMonths
      };
      confirmDialogRef.value.show({
        message: "B\u1EA1n c\xF3 ch\u1EAFc mu\u1ED1n \u0111\u0103ng k\xFD \u0111\u1ECBch v\u1EE5 cho kh\xE1ch h\xE0ng?",
        noTransMsg: true,
        onConfirm: async () => {
          await accountService.serviceRegistration(payload).then(() => {
            var _a;
            onResetForm({});
            (_a = dataTableRef.value) == null ? void 0 : _a.loadItems();
            commonDialogRef.value.onDisplay(false);
          });
        }
      });
    };
    const onClickViewInfoPartner = (item) => {
      (void 0).open(`https://tnsolve.com/partner?id=${item == null ? void 0 : item._id}`, "_blank");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CommonDialog = _sfc_main$1;
      const _component_v_avatar = resolveComponent("v-avatar");
      const _component_v_img = resolveComponent("v-img");
      const _component_v_divider = resolveComponent("v-divider");
      const _component_v_select = resolveComponent("v-select");
      const _component_v_btn = resolveComponent("v-btn");
      const _component_DataTable = _sfc_main$2;
      const _component_v_icon = resolveComponent("v-icon");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(__nuxt_component_0, {
        ref_key: "confirmDialogRef",
        ref: confirmDialogRef
      }, null, _parent));
      _push(ssrRenderComponent(_component_CommonDialog, {
        ref_key: "commonDialogRef",
        ref: commonDialogRef,
        title: "\u0110\u0103ng k\xFD d\u1ECBch v\u1EE5",
        width: "500"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d;
          if (_push2) {
            _push2(`<div class="d-flex flex-column ga-3" style="${ssrRenderStyle({ "min-height": "24rem" })}" data-v-fc7926a6${_scopeId}><div data-v-fc7926a6${_scopeId}><h3 class="font-bold mb-1" data-v-fc7926a6${_scopeId}>Th\xF4ng tin ng\u01B0\u1EDDi d\xF9ng</h3><h4 data-v-fc7926a6${_scopeId}>${ssrInterpolate(unref(formData).name)}</h4><h4 data-v-fc7926a6${_scopeId}>${ssrInterpolate(unref(formData).email)}</h4></div>`);
            if (unref(formData).referral.name && unref(formData).remainingTime === "Ch\u01B0a t\u1EEBng \u0111\u0103ng k\xFD") {
              _push2(`<div style="${ssrRenderStyle({ "margin-top": "-10px" })}" data-v-fc7926a6${_scopeId}><div data-v-fc7926a6${_scopeId}><div class="text-blue mb-2" data-v-fc7926a6${_scopeId}>Ng\u01B0\u1EDDi gi\u1EDBi thi\u1EC7u:</div>`);
              if (unref(formData).referral.name) {
                _push2(`<div class="d-flex align-center ga-2 py-2 px-3" style="${ssrRenderStyle({ "background-color": "#8d8d8d" })}" data-v-fc7926a6${_scopeId}>`);
                _push2(ssrRenderComponent(_component_v_avatar, null, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    var _a2, _b2, _c2, _d2;
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_v_img, {
                        src: ((_a2 = unref(formData).referral) == null ? void 0 : _a2.avatar) || "/images/avatar-default.jpg",
                        "lazy-src": ((_b2 = unref(formData).referral) == null ? void 0 : _b2.avatar) || "/images/avatar-default.jpg"
                      }, {
                        placeholder: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_component_v_img, { src: "/images/avatar-default.jpg" }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(_component_v_img, { src: "/images/avatar-default.jpg" })
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_v_img, {
                          src: ((_c2 = unref(formData).referral) == null ? void 0 : _c2.avatar) || "/images/avatar-default.jpg",
                          "lazy-src": ((_d2 = unref(formData).referral) == null ? void 0 : _d2.avatar) || "/images/avatar-default.jpg"
                        }, {
                          placeholder: withCtx(() => [
                            createVNode(_component_v_img, { src: "/images/avatar-default.jpg" })
                          ]),
                          _: 1
                        }, 8, ["src", "lazy-src"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`<div class="d-flex flex-column" style="${ssrRenderStyle({ "color": "#fff" })}" data-v-fc7926a6${_scopeId}><span data-v-fc7926a6${_scopeId}>${ssrInterpolate((_a = unref(formData).referral) == null ? void 0 : _a.name)}</span><span data-v-fc7926a6${_scopeId}>${ssrInterpolate((_b = unref(formData).referral) == null ? void 0 : _b.email)}</span></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_v_divider, { class: "mt-1" }, null, _parent2, _scopeId));
            _push2(`<div data-v-fc7926a6${_scopeId}><h3 class="font-bold" data-v-fc7926a6${_scopeId}>Th\xF4ng tin thanh to\xE1n</h3>`);
            _push2(ssrRenderComponent(_component_v_select, {
              modelValue: unref(formData).price,
              "onUpdate:modelValue": ($event) => unref(formData).price = $event,
              "hide-details": "",
              class: "w-100 mt-4",
              variant: "outlined",
              "item-title": "title",
              "item-value": "value",
              items: unref(priceOptions),
              label: _ctx.$t("Gi\xE1 g\xF3i")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_v_select, {
              modelValue: unref(formData).rentalMonths,
              "onUpdate:modelValue": ($event) => unref(formData).rentalMonths = $event,
              class: "w-100 mt-4",
              variant: "outlined",
              "item-title": "title",
              "item-value": "value",
              items: unref(rentalMonthsOptions),
              label: _ctx.$t("Th\u1EDDi h\u1EA1n \u0111\u0103ng k\xFD")
            }, null, _parent2, _scopeId));
            _push2(`</div><h3 class="mb-4 bg-brown-lighten-5 px-4 py-2" data-v-fc7926a6${_scopeId}> T\u1ED5ng c\u1ED9ng: ${ssrInterpolate(unref(totalPrice))}</h3></div><div class="d-flex ga-3 mt-6" data-v-fc7926a6${_scopeId}>`);
            _push2(ssrRenderComponent(_component_v_btn, {
              text: "H\u1EE7y b\u1ECF",
              class: "flex-1",
              variant: "tonal",
              color: "primary",
              style: { "height": "48px" },
              onClick: ($event) => {
                var _a2;
                return (_a2 = unref(commonDialogRef)) == null ? void 0 : _a2.onDisplay(false);
              }
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_v_btn, {
              text: "\u0110\u0103ng k\xFD",
              class: "flex-1",
              variant: "flat",
              color: "primary",
              style: { "height": "48px" },
              onClick: onConfirmRegisterService
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", {
                class: "d-flex flex-column ga-3",
                style: { "min-height": "24rem" }
              }, [
                createVNode("div", null, [
                  createVNode("h3", { class: "font-bold mb-1" }, "Th\xF4ng tin ng\u01B0\u1EDDi d\xF9ng"),
                  createVNode("h4", null, toDisplayString(unref(formData).name), 1),
                  createVNode("h4", null, toDisplayString(unref(formData).email), 1)
                ]),
                unref(formData).referral.name && unref(formData).remainingTime === "Ch\u01B0a t\u1EEBng \u0111\u0103ng k\xFD" ? (openBlock(), createBlock("div", {
                  key: 0,
                  style: { "margin-top": "-10px" }
                }, [
                  createVNode("div", null, [
                    createVNode("div", { class: "text-blue mb-2" }, "Ng\u01B0\u1EDDi gi\u1EDBi thi\u1EC7u:"),
                    unref(formData).referral.name ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "d-flex align-center ga-2 py-2 px-3",
                      style: { "background-color": "#8d8d8d" }
                    }, [
                      createVNode(_component_v_avatar, null, {
                        default: withCtx(() => {
                          var _a2, _b2;
                          return [
                            createVNode(_component_v_img, {
                              src: ((_a2 = unref(formData).referral) == null ? void 0 : _a2.avatar) || "/images/avatar-default.jpg",
                              "lazy-src": ((_b2 = unref(formData).referral) == null ? void 0 : _b2.avatar) || "/images/avatar-default.jpg"
                            }, {
                              placeholder: withCtx(() => [
                                createVNode(_component_v_img, { src: "/images/avatar-default.jpg" })
                              ]),
                              _: 1
                            }, 8, ["src", "lazy-src"])
                          ];
                        }),
                        _: 1
                      }),
                      createVNode("div", {
                        class: "d-flex flex-column",
                        style: { "color": "#fff" }
                      }, [
                        createVNode("span", null, toDisplayString((_c = unref(formData).referral) == null ? void 0 : _c.name), 1),
                        createVNode("span", null, toDisplayString((_d = unref(formData).referral) == null ? void 0 : _d.email), 1)
                      ])
                    ])) : createCommentVNode("", true)
                  ])
                ])) : createCommentVNode("", true),
                createVNode(_component_v_divider, { class: "mt-1" }),
                createVNode("div", null, [
                  createVNode("h3", { class: "font-bold" }, "Th\xF4ng tin thanh to\xE1n"),
                  createVNode(_component_v_select, {
                    modelValue: unref(formData).price,
                    "onUpdate:modelValue": ($event) => unref(formData).price = $event,
                    "hide-details": "",
                    class: "w-100 mt-4",
                    variant: "outlined",
                    "item-title": "title",
                    "item-value": "value",
                    items: unref(priceOptions),
                    label: _ctx.$t("Gi\xE1 g\xF3i")
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "label"]),
                  createVNode(_component_v_select, {
                    modelValue: unref(formData).rentalMonths,
                    "onUpdate:modelValue": ($event) => unref(formData).rentalMonths = $event,
                    class: "w-100 mt-4",
                    variant: "outlined",
                    "item-title": "title",
                    "item-value": "value",
                    items: unref(rentalMonthsOptions),
                    label: _ctx.$t("Th\u1EDDi h\u1EA1n \u0111\u0103ng k\xFD")
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "label"])
                ]),
                createVNode("h3", { class: "mb-4 bg-brown-lighten-5 px-4 py-2" }, " T\u1ED5ng c\u1ED9ng: " + toDisplayString(unref(totalPrice)), 1)
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
                  text: "\u0110\u0103ng k\xFD",
                  class: "flex-1",
                  variant: "flat",
                  color: "primary",
                  style: { "height": "48px" },
                  onClick: onConfirmRegisterService
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_DataTable, {
        ref_key: "dataTableRef",
        ref: dataTableRef,
        filters: [
          {
            label: "Tr\u1EA1ng th\xE1i",
            field: "status",
            type: "select",
            items: unref(statusItems)
          }
        ],
        showSelect: false,
        actions: [],
        rowActions: ["register"],
        headers: unref(headers),
        data: unref(data),
        loading: Boolean(unref(loading) == "load-table"),
        onChange: loadItems,
        onAction
      }, {
        "row-name": withCtx(({ item }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div style="${ssrRenderStyle({ "min-width": "14rem" })}" data-v-fc7926a6${_scopeId}>${ssrInterpolate(item.name)}</div>`);
          } else {
            return [
              createVNode("div", { style: { "min-width": "14rem" } }, toDisplayString(item.name), 1)
            ];
          }
        }),
        "row-action": withCtx(({ item }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(role) === ("EnumAccountRole" in _ctx ? _ctx.EnumAccountRole : unref(EnumAccountRole)).PARTNER) {
              _push2(ssrRenderComponent(_component_v_btn, {
                icon: "",
                size: "40",
                variant: "text",
                onClick: ($event) => onClickViewInfoPartner(item)
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_v_icon, { size: "20" }, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`mdi-eye-outline`);
                        } else {
                          return [
                            createTextVNode("mdi-eye-outline")
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_v_icon, { size: "20" }, {
                        default: withCtx(() => [
                          createTextVNode("mdi-eye-outline")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_v_btn, {
              icon: "",
              size: "40",
              variant: "text",
              onClick: ($event) => onClickRegisterService(item)
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_v_icon, { size: "20" }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`mdi-account-plus-outline`);
                      } else {
                        return [
                          createTextVNode("mdi-account-plus-outline")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_v_icon, { size: "20" }, {
                      default: withCtx(() => [
                        createTextVNode("mdi-account-plus-outline")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              unref(role) === ("EnumAccountRole" in _ctx ? _ctx.EnumAccountRole : unref(EnumAccountRole)).PARTNER ? (openBlock(), createBlock(_component_v_btn, {
                key: 0,
                icon: "",
                size: "40",
                variant: "text",
                onClick: ($event) => onClickViewInfoPartner(item)
              }, {
                default: withCtx(() => [
                  createVNode(_component_v_icon, { size: "20" }, {
                    default: withCtx(() => [
                      createTextVNode("mdi-eye-outline")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["onClick"])) : createCommentVNode("", true),
              createVNode(_component_v_btn, {
                icon: "",
                size: "40",
                variant: "text",
                onClick: ($event) => onClickRegisterService(item)
              }, {
                default: withCtx(() => [
                  createVNode(_component_v_icon, { size: "20" }, {
                    default: withCtx(() => [
                      createTextVNode("mdi-account-plus-outline")
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
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/AccountTable.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AccountTable = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-fc7926a6"]]);

export { AccountTable as A };
//# sourceMappingURL=AccountTable-DpxC4uMn.mjs.map
