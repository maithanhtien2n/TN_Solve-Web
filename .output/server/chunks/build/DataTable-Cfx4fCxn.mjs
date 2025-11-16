import { _ as __nuxt_component_0 } from './ConfirmDialog-Df9nJcuZ.mjs';
import { defineComponent, ref, reactive, computed, watch, resolveComponent, unref, isRef, withCtx, createVNode, createBlock, createCommentVNode, openBlock, Fragment, renderList, createTextVNode, toDisplayString, createSlots, withKeys, renderSlot, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrInterpolate, ssrRenderSlot, ssrRenderClass } from 'vue/server-renderer';
import { u as useAppStore } from './app.store-CsbFmGtW.mjs';
import { e as useI18n } from './server.mjs';
import { u as useDevice } from './index-BKshJpnN.mjs';
import { a as EnumStatus } from './enum-kAdbNx_J.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DataTable",
  __ssrInlineRender: true,
  props: {
    filters: { type: Array, default: () => [] },
    actions: {
      type: Array,
      default: () => ["add", "active", "inactive", "delete"]
    },
    rowActions: {
      type: Array,
      default: () => ["update", "delete"]
    },
    headers: { type: Array, default: () => [] },
    data: {
      type: Object,
      default: () => ({ docs: [], page: 1, limit: 20, totalDocs: 0 })
    },
    loading: { type: Boolean, default: false },
    showSelect: { type: Boolean, default: false },
    hideSearch: { type: Boolean, default: false }
  },
  emits: ["change", "action", "change-filter"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const appStore = useAppStore();
    const { t } = useI18n();
    const { isMobile } = useDevice();
    const props = __props;
    const emits = __emit;
    const display = ref(false);
    const selected = ref([]);
    const confirmDialogRef = ref(null);
    const params = reactive({
      search: "",
      page: 1,
      limit: 20
    });
    const dataHeaders = computed(
      () => {
        var _a;
        return Array.isArray(props.headers) && ((_a = props.headers) == null ? void 0 : _a.length) ? props.headers.map((h) => ({
          ...h,
          title: t(h.title)
        })) : [];
      }
    );
    function getNestedValue(obj, path) {
      return path.split(".").reduce((o, k) => o ? o[k] : void 0, obj) || "---";
    }
    function setDefault() {
      props.filters.forEach((filter) => {
        var _a;
        if (filter.type === "select" && ((_a = filter.items) == null ? void 0 : _a.length)) {
          if (!params[filter.field])
            params[filter.field] = filter.items[0][filter.itemValue || "value"];
        } else if (filter.type === "text") {
          if (!params[filter.field]) params[filter.field] = "";
        }
      });
    }
    function resetSelected() {
      selected.value = [];
    }
    function loadItems() {
      resetSelected();
      emits("change", params);
    }
    function search(type = "filter") {
      if (type == "search" && !params.search) return;
      params.page = 1;
      loadItems();
      display.value = false;
    }
    const onConfirmAction = (action, item) => {
      var _a, _b, _c;
      if (!(item == null ? void 0 : item._id) && !((_a = selected.value) == null ? void 0 : _a.length)) {
        appStore.onActionSetSystemPopup({
          type: "error",
          content: "Vui l\xF2ng ch\u1ECDn \xEDt nh\u1EA5t m\u1ED9t d\u1EEF li\u1EC7u \u0111\u1EC3 th\u1EF1c hi\u1EC7n thao t\xE1c n\xE0y."
        });
        return;
      }
      const items = (_b = props.data) == null ? void 0 : _b.docs.filter(
        (item2) => selected.value.includes(item2 == null ? void 0 : item2._id)
      );
      if (action === EnumStatus.ACTIVE && items.some(
        (item2) => {
          var _a2;
          return ![EnumStatus.INACTIVE].includes((_a2 = item2.status) == null ? void 0 : _a2.code);
        }
      )) {
        appStore.onActionSetSystemPopup({
          type: "error",
          content: `Vui l\xF2ng ch\u1EC9 ch\u1ECDn nh\u1EEFng d\u1EEF li\u1EC7u c\xF3 tr\u1EA1ng th\xE1i: D\u1EF1 th\u1EA3o, T\u1EA1m d\u1EEBng.`
        });
        return;
      }
      if (action === EnumStatus.INACTIVE && items.some((item2) => {
        var _a2;
        return ![EnumStatus.ACTIVE].includes((_a2 = item2.status) == null ? void 0 : _a2.code);
      })) {
        appStore.onActionSetSystemPopup({
          type: "error",
          content: `Vui l\xF2ng ch\u1EC9 ch\u1ECDn nh\u1EEFng d\u1EEF li\u1EC7u c\xF3 tr\u1EA1ng th\xE1i: Ho\u1EA1t \u0111\u1ED9ng.`
        });
        return;
      }
      let message = "";
      const amount = ((_c = selected.value) == null ? void 0 : _c.length) || 0;
      switch (action) {
        case "active":
          message = t("B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n k\xEDch ho\u1EA1t {amount} d\u1EEF li\u1EC7u?", {
            amount
          });
          break;
        case "inactive":
          message = t("B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n t\u1EA1m d\u1EEBng {amount} d\u1EEF li\u1EC7u?", {
            amount
          });
          break;
        case "delete":
          message = t("B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n x\xF3a {amount} d\u1EEF li\u1EC7u?", { amount });
          break;
      }
      confirmDialogRef.value.show({
        message,
        noTransMsg: true,
        onConfirm: async () => {
          emits("action", {
            action,
            ids: (item == null ? void 0 : item._id) ? [item._id] : selected.value
          });
        }
      });
    };
    watch(
      () => props.filters,
      () => {
        setDefault();
      },
      { immediate: true }
    );
    watch(
      () => params.search,
      () => {
        if (!params.search) emits("change", params);
      }
    );
    __expose({ params, selected, loadItems, resetSelected });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ConfirmDialog = __nuxt_component_0;
      const _component_v_navigation_drawer = resolveComponent("v-navigation-drawer");
      const _component_v_icon = resolveComponent("v-icon");
      const _component_v_divider = resolveComponent("v-divider");
      const _component_v_text_field = resolveComponent("v-text-field");
      const _component_v_select = resolveComponent("v-select");
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_data_table_server = resolveComponent("v-data-table-server");
      const _component_v_row = resolveComponent("v-row");
      const _component_v_col = resolveComponent("v-col");
      const _component_v_chip = resolveComponent("v-chip");
      const _component_v_overlay = resolveComponent("v-overlay");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_ConfirmDialog, {
        ref_key: "confirmDialogRef",
        ref: confirmDialogRef
      }, null, _parent));
      _push(ssrRenderComponent(_component_v_navigation_drawer, {
        temporary: "",
        modelValue: unref(display),
        "onUpdate:modelValue": ($event) => isRef(display) ? display.value = $event : null,
        width: !unref(isMobile) ? 330 : "560",
        location: !unref(isMobile) ? "right" : "bottom",
        style: { "z-index": "99999 !important" }
      }, {
        prepend: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="d-flex align-center ga-2 mx-3" style="${ssrRenderStyle({ "height": "64px" })}"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_v_icon, { size: "25" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`mdi-filter-variant`);
                } else {
                  return [
                    createTextVNode("mdi-filter-variant")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<h3${_scopeId}>${ssrInterpolate(_ctx.$t("B\u1ED9 l\u1ECDc"))}</h3></div>`);
          } else {
            return [
              createVNode("div", {
                class: "d-flex align-center ga-2 mx-3",
                style: { "height": "64px" }
              }, [
                createVNode(_component_v_icon, { size: "25" }, {
                  default: withCtx(() => [
                    createTextVNode("mdi-filter-variant")
                  ]),
                  _: 1
                }),
                createVNode("h3", null, toDisplayString(_ctx.$t("B\u1ED9 l\u1ECDc")), 1)
              ])
            ];
          }
        }),
        append: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="d-flex ga-2 ma-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_v_btn, {
              text: _ctx.$t("\u0110\xF3ng"),
              variant: "outlined",
              color: "primary",
              class: "flex-1",
              style: { "height": "48px" },
              onClick: ($event) => display.value = false
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_v_btn, {
              text: _ctx.$t("T\xECm ki\u1EBFm"),
              variant: "flat",
              color: "primary",
              class: "flex-1",
              style: { "height": "48px" },
              onClick: ($event) => search()
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "d-flex ga-2 ma-4" }, [
                createVNode(_component_v_btn, {
                  text: _ctx.$t("\u0110\xF3ng"),
                  variant: "outlined",
                  color: "primary",
                  class: "flex-1",
                  style: { "height": "48px" },
                  onClick: ($event) => display.value = false
                }, null, 8, ["text", "onClick"]),
                createVNode(_component_v_btn, {
                  text: _ctx.$t("T\xECm ki\u1EBFm"),
                  variant: "flat",
                  color: "primary",
                  class: "flex-1",
                  style: { "height": "48px" },
                  onClick: ($event) => search()
                }, null, 8, ["text", "onClick"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(ssrRenderComponent(_component_v_divider, null, null, _parent2, _scopeId));
            if (Array.isArray(__props.filters) && ((_a = __props.filters) == null ? void 0 : _a.length)) {
              _push2(`<div class="ma-4 d-flex flex-column ga-3 pt-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.filters, (item, index) => {
                _push2(`<!--[-->`);
                if (item.type === "text") {
                  _push2(ssrRenderComponent(_component_v_text_field, {
                    modelValue: unref(params)[item.field],
                    "onUpdate:modelValue": [($event) => unref(params)[item.field] = $event, ($event) => emits("change-filter", {
                      type: item.type,
                      field: item.field,
                      value: unref(params)[item.field]
                    })],
                    variant: "outlined",
                    density: "comfortable",
                    label: item.label ? _ctx.$t(item.label) : ""
                  }, null, _parent2, _scopeId));
                } else if (item.type === "select") {
                  _push2(ssrRenderComponent(_component_v_select, {
                    modelValue: unref(params)[item.field],
                    "onUpdate:modelValue": [($event) => unref(params)[item.field] = $event, ($event) => emits("change-filter", {
                      type: item.type,
                      field: item.field,
                      value: unref(params)[item.field]
                    })],
                    variant: "outlined",
                    density: "comfortable",
                    items: item.items,
                    label: item.label ? _ctx.$t(item.label) : "",
                    "item-title": item.itemTitle || "title",
                    "item-value": item.itemValue || "value"
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--]-->`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(_component_v_divider),
              Array.isArray(__props.filters) && ((_b = __props.filters) == null ? void 0 : _b.length) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "ma-4 d-flex flex-column ga-3 pt-2"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.filters, (item, index) => {
                  return openBlock(), createBlock(Fragment, { key: index }, [
                    item.type === "text" ? (openBlock(), createBlock(_component_v_text_field, {
                      key: 0,
                      modelValue: unref(params)[item.field],
                      "onUpdate:modelValue": [($event) => unref(params)[item.field] = $event, ($event) => emits("change-filter", {
                        type: item.type,
                        field: item.field,
                        value: unref(params)[item.field]
                      })],
                      variant: "outlined",
                      density: "comfortable",
                      label: item.label ? _ctx.$t(item.label) : ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "label"])) : item.type === "select" ? (openBlock(), createBlock(_component_v_select, {
                      key: 1,
                      modelValue: unref(params)[item.field],
                      "onUpdate:modelValue": [($event) => unref(params)[item.field] = $event, ($event) => emits("change-filter", {
                        type: item.type,
                        field: item.field,
                        value: unref(params)[item.field]
                      })],
                      variant: "outlined",
                      density: "comfortable",
                      items: item.items,
                      label: item.label ? _ctx.$t(item.label) : "",
                      "item-title": item.itemTitle || "title",
                      "item-value": item.itemValue || "value"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "label", "item-title", "item-value"])) : createCommentVNode("", true)
                  ], 64);
                }), 128))
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_v_data_table_server, {
        "item-value": "_id",
        modelValue: unref(selected),
        "onUpdate:modelValue": ($event) => isRef(selected) ? selected.value = $event : null,
        page: unref(params).page,
        "onUpdate:page": ($event) => unref(params).page = $event,
        "items-per-page": unref(params).limit,
        "onUpdate:itemsPerPage": ($event) => unref(params).limit = $event,
        headers: unref(dataHeaders),
        items: __props.data.docs,
        "items-length": __props.data.totalDocs,
        "items-per-page-options": [20, 50, 100],
        loading: __props.loading,
        "show-select": props.showSelect,
        "hide-default-footer": Boolean(!__props.data.totalDocs),
        "onUpdate:options": loadItems
      }, createSlots({
        top: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!__props.hideSearch) {
              _push2(`<div class="mb-3 d-flex flex-column ga-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_v_row, { dense: "" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_v_col, {
                      cols: "12",
                      lg: "5"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        var _a, _b;
                        if (_push4) {
                          _push4(`<div class="d-flex ga-2"${_scopeId3}>`);
                          _push4(ssrRenderComponent(_component_v_text_field, {
                            modelValue: unref(params).search,
                            "onUpdate:modelValue": ($event) => unref(params).search = $event,
                            "hide-details": "",
                            "single-line": "",
                            density: "comfortable",
                            variant: "outlined",
                            "prepend-inner-icon": "mdi-magnify",
                            label: _ctx.$t("T\xECm ki\u1EBFm"),
                            placeholder: _ctx.$t("T\xECm ki\u1EBFm"),
                            onKeyup: ($event) => search("search"),
                            "onClick:prependInner": ($event) => search("search")
                          }, null, _parent4, _scopeId3));
                          if ((_a = __props.filters) == null ? void 0 : _a.length) {
                            _push4(ssrRenderComponent(_component_v_btn, {
                              variant: "outlined",
                              color: "primary",
                              style: { "height": "48px" },
                              onClick: ($event) => display.value = true
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(_component_v_icon, { size: "19" }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`mdi-filter-variant`);
                                      } else {
                                        return [
                                          createTextVNode("mdi-filter-variant")
                                        ];
                                      }
                                    }),
                                    _: 1
                                  }, _parent5, _scopeId4));
                                  _push5(`<span class="ml-2"${_scopeId4}>${ssrInterpolate(_ctx.$t("B\u1ED9 l\u1ECDc"))}</span>`);
                                } else {
                                  return [
                                    createVNode(_component_v_icon, { size: "19" }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-filter-variant")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode("span", { class: "ml-2" }, toDisplayString(_ctx.$t("B\u1ED9 l\u1ECDc")), 1)
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div>`);
                        } else {
                          return [
                            createVNode("div", { class: "d-flex ga-2" }, [
                              createVNode(_component_v_text_field, {
                                modelValue: unref(params).search,
                                "onUpdate:modelValue": ($event) => unref(params).search = $event,
                                "hide-details": "",
                                "single-line": "",
                                density: "comfortable",
                                variant: "outlined",
                                "prepend-inner-icon": "mdi-magnify",
                                label: _ctx.$t("T\xECm ki\u1EBFm"),
                                placeholder: _ctx.$t("T\xECm ki\u1EBFm"),
                                onKeyup: withKeys(($event) => search("search"), ["enter"]),
                                "onClick:prependInner": ($event) => search("search")
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "label", "placeholder", "onKeyup", "onClick:prependInner"]),
                              ((_b = __props.filters) == null ? void 0 : _b.length) ? (openBlock(), createBlock(_component_v_btn, {
                                key: 0,
                                variant: "outlined",
                                color: "primary",
                                style: { "height": "48px" },
                                onClick: ($event) => display.value = true
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_v_icon, { size: "19" }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-filter-variant")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode("span", { class: "ml-2" }, toDisplayString(_ctx.$t("B\u1ED9 l\u1ECDc")), 1)
                                ]),
                                _: 1
                              }, 8, ["onClick"])) : createCommentVNode("", true)
                            ])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_v_col, {
                      cols: "12",
                      lg: "7",
                      md: "7"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          ssrRenderSlot(_ctx.$slots, "action", {}, () => {
                            var _a;
                            if ((_a = props.actions) == null ? void 0 : _a.length) {
                              _push4(ssrRenderComponent(_component_v_row, { dense: "" }, {
                                default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                  if (_push5) {
                                    _push5(`<div class="flex-1"${_scopeId4}></div>`);
                                    if (props.actions.includes("add")) {
                                      _push5(ssrRenderComponent(_component_v_col, {
                                        cols: "6",
                                        xl: "2",
                                        lg: "2",
                                        md: "3",
                                        sm: "3"
                                      }, {
                                        default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                          if (_push6) {
                                            _push6(ssrRenderComponent(_component_v_btn, {
                                              text: _ctx.$t("Th\xEAm m\u1EDBi"),
                                              style: { "height": "48px" },
                                              variant: "flat",
                                              color: "primary",
                                              class: "w-100",
                                              onClick: ($event) => emits("action", { action: "add" })
                                            }, null, _parent6, _scopeId5));
                                          } else {
                                            return [
                                              createVNode(_component_v_btn, {
                                                text: _ctx.$t("Th\xEAm m\u1EDBi"),
                                                style: { "height": "48px" },
                                                variant: "flat",
                                                color: "primary",
                                                class: "w-100",
                                                onClick: ($event) => emits("action", { action: "add" })
                                              }, null, 8, ["text", "onClick"])
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent5, _scopeId4));
                                    } else {
                                      _push5(`<!---->`);
                                    }
                                    if (props.actions.includes("active")) {
                                      _push5(ssrRenderComponent(_component_v_col, {
                                        cols: "6",
                                        xl: "2",
                                        lg: "2",
                                        md: "3",
                                        sm: "3"
                                      }, {
                                        default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                          if (_push6) {
                                            _push6(ssrRenderComponent(_component_v_btn, {
                                              text: _ctx.$t("K\xEDch ho\u1EA1t"),
                                              style: { "height": "48px" },
                                              variant: "flat",
                                              color: "green",
                                              class: "w-100",
                                              onClick: ($event) => onConfirmAction("active")
                                            }, null, _parent6, _scopeId5));
                                          } else {
                                            return [
                                              createVNode(_component_v_btn, {
                                                text: _ctx.$t("K\xEDch ho\u1EA1t"),
                                                style: { "height": "48px" },
                                                variant: "flat",
                                                color: "green",
                                                class: "w-100",
                                                onClick: ($event) => onConfirmAction("active")
                                              }, null, 8, ["text", "onClick"])
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent5, _scopeId4));
                                    } else {
                                      _push5(`<!---->`);
                                    }
                                    if (props.actions.includes("inactive")) {
                                      _push5(ssrRenderComponent(_component_v_col, {
                                        cols: "6",
                                        xl: "2",
                                        lg: "2",
                                        md: "3",
                                        sm: "3"
                                      }, {
                                        default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                          if (_push6) {
                                            _push6(ssrRenderComponent(_component_v_btn, {
                                              text: _ctx.$t("T\u1EA1m d\u1EEBng"),
                                              style: { "height": "48px" },
                                              variant: "flat",
                                              color: "red",
                                              class: "w-100",
                                              onClick: ($event) => onConfirmAction("inactive")
                                            }, null, _parent6, _scopeId5));
                                          } else {
                                            return [
                                              createVNode(_component_v_btn, {
                                                text: _ctx.$t("T\u1EA1m d\u1EEBng"),
                                                style: { "height": "48px" },
                                                variant: "flat",
                                                color: "red",
                                                class: "w-100",
                                                onClick: ($event) => onConfirmAction("inactive")
                                              }, null, 8, ["text", "onClick"])
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent5, _scopeId4));
                                    } else {
                                      _push5(`<!---->`);
                                    }
                                    if (props.actions.includes("delete")) {
                                      _push5(ssrRenderComponent(_component_v_col, {
                                        cols: "6",
                                        xl: "2",
                                        lg: "2",
                                        md: "3",
                                        sm: "3"
                                      }, {
                                        default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                          if (_push6) {
                                            _push6(ssrRenderComponent(_component_v_btn, {
                                              text: _ctx.$t("Xo\xE1"),
                                              style: { "height": "48px" },
                                              variant: "flat",
                                              color: "error",
                                              class: "w-100",
                                              onClick: ($event) => onConfirmAction("delete")
                                            }, null, _parent6, _scopeId5));
                                          } else {
                                            return [
                                              createVNode(_component_v_btn, {
                                                text: _ctx.$t("Xo\xE1"),
                                                style: { "height": "48px" },
                                                variant: "flat",
                                                color: "error",
                                                class: "w-100",
                                                onClick: ($event) => onConfirmAction("delete")
                                              }, null, 8, ["text", "onClick"])
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent5, _scopeId4));
                                    } else {
                                      _push5(`<!---->`);
                                    }
                                  } else {
                                    return [
                                      createVNode("div", { class: "flex-1" }),
                                      props.actions.includes("add") ? (openBlock(), createBlock(_component_v_col, {
                                        key: 0,
                                        cols: "6",
                                        xl: "2",
                                        lg: "2",
                                        md: "3",
                                        sm: "3"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_v_btn, {
                                            text: _ctx.$t("Th\xEAm m\u1EDBi"),
                                            style: { "height": "48px" },
                                            variant: "flat",
                                            color: "primary",
                                            class: "w-100",
                                            onClick: ($event) => emits("action", { action: "add" })
                                          }, null, 8, ["text", "onClick"])
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true),
                                      props.actions.includes("active") ? (openBlock(), createBlock(_component_v_col, {
                                        key: 1,
                                        cols: "6",
                                        xl: "2",
                                        lg: "2",
                                        md: "3",
                                        sm: "3"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_v_btn, {
                                            text: _ctx.$t("K\xEDch ho\u1EA1t"),
                                            style: { "height": "48px" },
                                            variant: "flat",
                                            color: "green",
                                            class: "w-100",
                                            onClick: ($event) => onConfirmAction("active")
                                          }, null, 8, ["text", "onClick"])
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true),
                                      props.actions.includes("inactive") ? (openBlock(), createBlock(_component_v_col, {
                                        key: 2,
                                        cols: "6",
                                        xl: "2",
                                        lg: "2",
                                        md: "3",
                                        sm: "3"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_v_btn, {
                                            text: _ctx.$t("T\u1EA1m d\u1EEBng"),
                                            style: { "height": "48px" },
                                            variant: "flat",
                                            color: "red",
                                            class: "w-100",
                                            onClick: ($event) => onConfirmAction("inactive")
                                          }, null, 8, ["text", "onClick"])
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true),
                                      props.actions.includes("delete") ? (openBlock(), createBlock(_component_v_col, {
                                        key: 3,
                                        cols: "6",
                                        xl: "2",
                                        lg: "2",
                                        md: "3",
                                        sm: "3"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_v_btn, {
                                            text: _ctx.$t("Xo\xE1"),
                                            style: { "height": "48px" },
                                            variant: "flat",
                                            color: "error",
                                            class: "w-100",
                                            onClick: ($event) => onConfirmAction("delete")
                                          }, null, 8, ["text", "onClick"])
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent4, _scopeId3));
                            } else {
                              _push4(`<!---->`);
                            }
                          }, _push4, _parent4, _scopeId3);
                        } else {
                          return [
                            renderSlot(_ctx.$slots, "action", {}, () => {
                              var _a;
                              return [
                                ((_a = props.actions) == null ? void 0 : _a.length) ? (openBlock(), createBlock(_component_v_row, {
                                  key: 0,
                                  dense: ""
                                }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "flex-1" }),
                                    props.actions.includes("add") ? (openBlock(), createBlock(_component_v_col, {
                                      key: 0,
                                      cols: "6",
                                      xl: "2",
                                      lg: "2",
                                      md: "3",
                                      sm: "3"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_v_btn, {
                                          text: _ctx.$t("Th\xEAm m\u1EDBi"),
                                          style: { "height": "48px" },
                                          variant: "flat",
                                          color: "primary",
                                          class: "w-100",
                                          onClick: ($event) => emits("action", { action: "add" })
                                        }, null, 8, ["text", "onClick"])
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true),
                                    props.actions.includes("active") ? (openBlock(), createBlock(_component_v_col, {
                                      key: 1,
                                      cols: "6",
                                      xl: "2",
                                      lg: "2",
                                      md: "3",
                                      sm: "3"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_v_btn, {
                                          text: _ctx.$t("K\xEDch ho\u1EA1t"),
                                          style: { "height": "48px" },
                                          variant: "flat",
                                          color: "green",
                                          class: "w-100",
                                          onClick: ($event) => onConfirmAction("active")
                                        }, null, 8, ["text", "onClick"])
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true),
                                    props.actions.includes("inactive") ? (openBlock(), createBlock(_component_v_col, {
                                      key: 2,
                                      cols: "6",
                                      xl: "2",
                                      lg: "2",
                                      md: "3",
                                      sm: "3"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_v_btn, {
                                          text: _ctx.$t("T\u1EA1m d\u1EEBng"),
                                          style: { "height": "48px" },
                                          variant: "flat",
                                          color: "red",
                                          class: "w-100",
                                          onClick: ($event) => onConfirmAction("inactive")
                                        }, null, 8, ["text", "onClick"])
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true),
                                    props.actions.includes("delete") ? (openBlock(), createBlock(_component_v_col, {
                                      key: 3,
                                      cols: "6",
                                      xl: "2",
                                      lg: "2",
                                      md: "3",
                                      sm: "3"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_v_btn, {
                                          text: _ctx.$t("Xo\xE1"),
                                          style: { "height": "48px" },
                                          variant: "flat",
                                          color: "error",
                                          class: "w-100",
                                          onClick: ($event) => onConfirmAction("delete")
                                        }, null, 8, ["text", "onClick"])
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true)
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true)
                              ];
                            })
                          ];
                        }
                      }),
                      _: 3
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_v_col, {
                        cols: "12",
                        lg: "5"
                      }, {
                        default: withCtx(() => {
                          var _a;
                          return [
                            createVNode("div", { class: "d-flex ga-2" }, [
                              createVNode(_component_v_text_field, {
                                modelValue: unref(params).search,
                                "onUpdate:modelValue": ($event) => unref(params).search = $event,
                                "hide-details": "",
                                "single-line": "",
                                density: "comfortable",
                                variant: "outlined",
                                "prepend-inner-icon": "mdi-magnify",
                                label: _ctx.$t("T\xECm ki\u1EBFm"),
                                placeholder: _ctx.$t("T\xECm ki\u1EBFm"),
                                onKeyup: withKeys(($event) => search("search"), ["enter"]),
                                "onClick:prependInner": ($event) => search("search")
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "label", "placeholder", "onKeyup", "onClick:prependInner"]),
                              ((_a = __props.filters) == null ? void 0 : _a.length) ? (openBlock(), createBlock(_component_v_btn, {
                                key: 0,
                                variant: "outlined",
                                color: "primary",
                                style: { "height": "48px" },
                                onClick: ($event) => display.value = true
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_v_icon, { size: "19" }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-filter-variant")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode("span", { class: "ml-2" }, toDisplayString(_ctx.$t("B\u1ED9 l\u1ECDc")), 1)
                                ]),
                                _: 1
                              }, 8, ["onClick"])) : createCommentVNode("", true)
                            ])
                          ];
                        }),
                        _: 1
                      }),
                      createVNode(_component_v_col, {
                        cols: "12",
                        lg: "7",
                        md: "7"
                      }, {
                        default: withCtx(() => [
                          renderSlot(_ctx.$slots, "action", {}, () => {
                            var _a;
                            return [
                              ((_a = props.actions) == null ? void 0 : _a.length) ? (openBlock(), createBlock(_component_v_row, {
                                key: 0,
                                dense: ""
                              }, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "flex-1" }),
                                  props.actions.includes("add") ? (openBlock(), createBlock(_component_v_col, {
                                    key: 0,
                                    cols: "6",
                                    xl: "2",
                                    lg: "2",
                                    md: "3",
                                    sm: "3"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_v_btn, {
                                        text: _ctx.$t("Th\xEAm m\u1EDBi"),
                                        style: { "height": "48px" },
                                        variant: "flat",
                                        color: "primary",
                                        class: "w-100",
                                        onClick: ($event) => emits("action", { action: "add" })
                                      }, null, 8, ["text", "onClick"])
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true),
                                  props.actions.includes("active") ? (openBlock(), createBlock(_component_v_col, {
                                    key: 1,
                                    cols: "6",
                                    xl: "2",
                                    lg: "2",
                                    md: "3",
                                    sm: "3"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_v_btn, {
                                        text: _ctx.$t("K\xEDch ho\u1EA1t"),
                                        style: { "height": "48px" },
                                        variant: "flat",
                                        color: "green",
                                        class: "w-100",
                                        onClick: ($event) => onConfirmAction("active")
                                      }, null, 8, ["text", "onClick"])
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true),
                                  props.actions.includes("inactive") ? (openBlock(), createBlock(_component_v_col, {
                                    key: 2,
                                    cols: "6",
                                    xl: "2",
                                    lg: "2",
                                    md: "3",
                                    sm: "3"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_v_btn, {
                                        text: _ctx.$t("T\u1EA1m d\u1EEBng"),
                                        style: { "height": "48px" },
                                        variant: "flat",
                                        color: "red",
                                        class: "w-100",
                                        onClick: ($event) => onConfirmAction("inactive")
                                      }, null, 8, ["text", "onClick"])
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true),
                                  props.actions.includes("delete") ? (openBlock(), createBlock(_component_v_col, {
                                    key: 3,
                                    cols: "6",
                                    xl: "2",
                                    lg: "2",
                                    md: "3",
                                    sm: "3"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_v_btn, {
                                        text: _ctx.$t("Xo\xE1"),
                                        style: { "height": "48px" },
                                        variant: "flat",
                                        color: "error",
                                        class: "w-100",
                                        onClick: ($event) => onConfirmAction("delete")
                                      }, null, 8, ["text", "onClick"])
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true)
                                ]),
                                _: 1
                              })) : createCommentVNode("", true)
                            ];
                          })
                        ]),
                        _: 3
                      })
                    ];
                  }
                }),
                _: 3
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              !__props.hideSearch ? (openBlock(), createBlock("div", {
                key: 0,
                class: "mb-3 d-flex flex-column ga-3"
              }, [
                createVNode(_component_v_row, { dense: "" }, {
                  default: withCtx(() => [
                    createVNode(_component_v_col, {
                      cols: "12",
                      lg: "5"
                    }, {
                      default: withCtx(() => {
                        var _a;
                        return [
                          createVNode("div", { class: "d-flex ga-2" }, [
                            createVNode(_component_v_text_field, {
                              modelValue: unref(params).search,
                              "onUpdate:modelValue": ($event) => unref(params).search = $event,
                              "hide-details": "",
                              "single-line": "",
                              density: "comfortable",
                              variant: "outlined",
                              "prepend-inner-icon": "mdi-magnify",
                              label: _ctx.$t("T\xECm ki\u1EBFm"),
                              placeholder: _ctx.$t("T\xECm ki\u1EBFm"),
                              onKeyup: withKeys(($event) => search("search"), ["enter"]),
                              "onClick:prependInner": ($event) => search("search")
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "label", "placeholder", "onKeyup", "onClick:prependInner"]),
                            ((_a = __props.filters) == null ? void 0 : _a.length) ? (openBlock(), createBlock(_component_v_btn, {
                              key: 0,
                              variant: "outlined",
                              color: "primary",
                              style: { "height": "48px" },
                              onClick: ($event) => display.value = true
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_v_icon, { size: "19" }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-filter-variant")
                                  ]),
                                  _: 1
                                }),
                                createVNode("span", { class: "ml-2" }, toDisplayString(_ctx.$t("B\u1ED9 l\u1ECDc")), 1)
                              ]),
                              _: 1
                            }, 8, ["onClick"])) : createCommentVNode("", true)
                          ])
                        ];
                      }),
                      _: 1
                    }),
                    createVNode(_component_v_col, {
                      cols: "12",
                      lg: "7",
                      md: "7"
                    }, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "action", {}, () => {
                          var _a;
                          return [
                            ((_a = props.actions) == null ? void 0 : _a.length) ? (openBlock(), createBlock(_component_v_row, {
                              key: 0,
                              dense: ""
                            }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "flex-1" }),
                                props.actions.includes("add") ? (openBlock(), createBlock(_component_v_col, {
                                  key: 0,
                                  cols: "6",
                                  xl: "2",
                                  lg: "2",
                                  md: "3",
                                  sm: "3"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_v_btn, {
                                      text: _ctx.$t("Th\xEAm m\u1EDBi"),
                                      style: { "height": "48px" },
                                      variant: "flat",
                                      color: "primary",
                                      class: "w-100",
                                      onClick: ($event) => emits("action", { action: "add" })
                                    }, null, 8, ["text", "onClick"])
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true),
                                props.actions.includes("active") ? (openBlock(), createBlock(_component_v_col, {
                                  key: 1,
                                  cols: "6",
                                  xl: "2",
                                  lg: "2",
                                  md: "3",
                                  sm: "3"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_v_btn, {
                                      text: _ctx.$t("K\xEDch ho\u1EA1t"),
                                      style: { "height": "48px" },
                                      variant: "flat",
                                      color: "green",
                                      class: "w-100",
                                      onClick: ($event) => onConfirmAction("active")
                                    }, null, 8, ["text", "onClick"])
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true),
                                props.actions.includes("inactive") ? (openBlock(), createBlock(_component_v_col, {
                                  key: 2,
                                  cols: "6",
                                  xl: "2",
                                  lg: "2",
                                  md: "3",
                                  sm: "3"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_v_btn, {
                                      text: _ctx.$t("T\u1EA1m d\u1EEBng"),
                                      style: { "height": "48px" },
                                      variant: "flat",
                                      color: "red",
                                      class: "w-100",
                                      onClick: ($event) => onConfirmAction("inactive")
                                    }, null, 8, ["text", "onClick"])
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true),
                                props.actions.includes("delete") ? (openBlock(), createBlock(_component_v_col, {
                                  key: 3,
                                  cols: "6",
                                  xl: "2",
                                  lg: "2",
                                  md: "3",
                                  sm: "3"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_v_btn, {
                                      text: _ctx.$t("Xo\xE1"),
                                      style: { "height": "48px" },
                                      variant: "flat",
                                      color: "error",
                                      class: "w-100",
                                      onClick: ($event) => onConfirmAction("delete")
                                    }, null, 8, ["text", "onClick"])
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true)
                              ]),
                              _: 1
                            })) : createCommentVNode("", true)
                          ];
                        })
                      ]),
                      _: 3
                    })
                  ]),
                  _: 3
                })
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 2
      }, [
        renderList(__props.headers, (h) => {
          return {
            name: `header.${h.key}`,
            fn: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span class="${ssrRenderClass([`text-${h.align || "start"}`, "font-bold"])}"${_scopeId}>${ssrInterpolate(_ctx.$t(h.title))}</span>`);
              } else {
                return [
                  (openBlock(), createBlock("span", {
                    class: ["font-bold", `text-${h.align || "start"}`]
                  }, toDisplayString(_ctx.$t(h.title)), 3))
                ];
              }
            })
          };
        }),
        renderList(__props.headers, (h) => {
          return {
            name: `item.${h.key}`,
            fn: withCtx((slotProps, _push2, _parent2, _scopeId) => {
              if (_push2) {
                ssrRenderSlot(_ctx.$slots, `row-${h.key}`, {
                  item: slotProps.item,
                  index: slotProps.index
                }, () => {
                  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
                  if (["createdAt", "updatedAt"].includes(h.key)) {
                    _push2(`<div class="my-4"${_scopeId}><span class="text-nowrap"${_scopeId}>${ssrInterpolate(((_a = slotProps.item) == null ? void 0 : _a[h.key]) || "---")}</span></div>`);
                  } else if (h.key == "status") {
                    _push2(`<div class="my-4"${_scopeId}>`);
                    if (((_c = (_b = slotProps.item) == null ? void 0 : _b[h.key]) == null ? void 0 : _c.color) && ((_e = (_d = slotProps.item) == null ? void 0 : _d[h.key]) == null ? void 0 : _e.name)) {
                      _push2(ssrRenderComponent(_component_v_chip, {
                        color: (_g = (_f = slotProps.item) == null ? void 0 : _f[h.key]) == null ? void 0 : _g.color
                      }, {
                        default: withCtx((_, _push3, _parent3, _scopeId2) => {
                          var _a2, _b2, _c2, _d2;
                          if (_push3) {
                            _push3(`${ssrInterpolate(_ctx.$t((_b2 = (_a2 = slotProps.item) == null ? void 0 : _a2[h.key]) == null ? void 0 : _b2.name))}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(_ctx.$t((_d2 = (_c2 = slotProps.item) == null ? void 0 : _c2[h.key]) == null ? void 0 : _d2.name)), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent2, _scopeId));
                    } else {
                      _push2(ssrRenderComponent(_component_v_chip, null, {
                        default: withCtx((_, _push3, _parent3, _scopeId2) => {
                          var _a2, _b2;
                          if (_push3) {
                            _push3(`${ssrInterpolate((_a2 = slotProps.item) == null ? void 0 : _a2[h.key])}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString((_b2 = slotProps.item) == null ? void 0 : _b2[h.key]), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent2, _scopeId));
                    }
                    _push2(`</div>`);
                  } else if (h.key == "action") {
                    _push2(`<div class="d-flex justify-center"${_scopeId}>`);
                    if (props.rowActions.includes("reload")) {
                      _push2(ssrRenderComponent(_component_v_btn, {
                        icon: "",
                        size: "40",
                        variant: "text",
                        disabled: Boolean(((_h = slotProps.item) == null ? void 0 : _h.isDelete) || ["\u274C H\xECnh \u1EA3nh t\u1EA3i l\xEAn vi ph\u1EA1m ch\xEDnh s\xE1ch, vui l\xF2ng ch\u1ECDn \u1EA3nh kh\xE1c!", "\u274C Th\u01B0\u1EDBc phim li\xEAn quan \u0111\u1EBFn ch\u1EE7 \u0111\u1EC1 nh\u1EA1y c\u1EA3m, vi ph\u1EA1m ch\xEDnh s\xE1ch n\u1ED9i dung!"].includes((_j = (_i = slotProps.item) == null ? void 0 : _i.lastMessage) == null ? void 0 : _j.note)),
                        onClick: ($event) => emits("action", { action: "reload", item: slotProps.item })
                      }, {
                        default: withCtx((_, _push3, _parent3, _scopeId2) => {
                          if (_push3) {
                            _push3(ssrRenderComponent(_component_v_icon, { size: "20" }, {
                              default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                                if (_push4) {
                                  _push4(`mdi-reload`);
                                } else {
                                  return [
                                    createTextVNode("mdi-reload")
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent3, _scopeId2));
                          } else {
                            return [
                              createVNode(_component_v_icon, { size: "20" }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-reload")
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
                    if (props.rowActions.includes("view")) {
                      _push2(ssrRenderComponent(_component_v_btn, {
                        icon: "",
                        size: "40",
                        variant: "text",
                        onClick: ($event) => emits("action", { action: "view", item: slotProps.item })
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
                    if (props.rowActions.includes("update")) {
                      _push2(ssrRenderComponent(_component_v_btn, {
                        icon: "",
                        size: "40",
                        variant: "text",
                        onClick: ($event) => emits("action", { action: "update", item: slotProps.item })
                      }, {
                        default: withCtx((_, _push3, _parent3, _scopeId2) => {
                          if (_push3) {
                            _push3(ssrRenderComponent(_component_v_icon, { size: "20" }, {
                              default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                                if (_push4) {
                                  _push4(`mdi-pencil-outline`);
                                } else {
                                  return [
                                    createTextVNode("mdi-pencil-outline")
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent3, _scopeId2));
                          } else {
                            return [
                              createVNode(_component_v_icon, { size: "20" }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-pencil-outline")
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
                    if (props.rowActions.includes("delete")) {
                      _push2(ssrRenderComponent(_component_v_btn, {
                        icon: "",
                        size: "40",
                        variant: "text",
                        color: "error",
                        onClick: ($event) => onConfirmAction("delete", slotProps.item)
                      }, {
                        default: withCtx((_, _push3, _parent3, _scopeId2) => {
                          if (_push3) {
                            _push3(ssrRenderComponent(_component_v_icon, { size: "20" }, {
                              default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                                if (_push4) {
                                  _push4(`mdi-trash-can-outline`);
                                } else {
                                  return [
                                    createTextVNode("mdi-trash-can-outline")
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent3, _scopeId2));
                          } else {
                            return [
                              createVNode(_component_v_icon, { size: "20" }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-trash-can-outline")
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
                    _push2(`</div>`);
                  } else {
                    _push2(`<div class="${ssrRenderClass([h.class, "my-4 text-nowrap"])}" style="${ssrRenderStyle({ "min-width": h.width })}"${_scopeId}>${ssrInterpolate(getNestedValue(slotProps.item, h.key))}</div>`);
                  }
                }, _push2, _parent2, _scopeId);
              } else {
                return [
                  renderSlot(_ctx.$slots, `row-${h.key}`, {
                    item: slotProps.item,
                    index: slotProps.index
                  }, () => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
                    return [
                      ["createdAt", "updatedAt"].includes(h.key) ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "my-4"
                      }, [
                        createVNode("span", { class: "text-nowrap" }, toDisplayString(((_a = slotProps.item) == null ? void 0 : _a[h.key]) || "---"), 1)
                      ])) : h.key == "status" ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "my-4"
                      }, [
                        ((_c = (_b = slotProps.item) == null ? void 0 : _b[h.key]) == null ? void 0 : _c.color) && ((_e = (_d = slotProps.item) == null ? void 0 : _d[h.key]) == null ? void 0 : _e.name) ? (openBlock(), createBlock(_component_v_chip, {
                          key: 0,
                          color: (_g = (_f = slotProps.item) == null ? void 0 : _f[h.key]) == null ? void 0 : _g.color
                        }, {
                          default: withCtx(() => {
                            var _a2, _b2;
                            return [
                              createTextVNode(toDisplayString(_ctx.$t((_b2 = (_a2 = slotProps.item) == null ? void 0 : _a2[h.key]) == null ? void 0 : _b2.name)), 1)
                            ];
                          }),
                          _: 2
                        }, 1032, ["color"])) : (openBlock(), createBlock(_component_v_chip, { key: 1 }, {
                          default: withCtx(() => {
                            var _a2;
                            return [
                              createTextVNode(toDisplayString((_a2 = slotProps.item) == null ? void 0 : _a2[h.key]), 1)
                            ];
                          }),
                          _: 2
                        }, 1024))
                      ])) : h.key == "action" ? (openBlock(), createBlock("div", {
                        key: 2,
                        class: "d-flex justify-center"
                      }, [
                        props.rowActions.includes("reload") ? (openBlock(), createBlock(_component_v_btn, {
                          key: 0,
                          icon: "",
                          size: "40",
                          variant: "text",
                          disabled: Boolean(((_h = slotProps.item) == null ? void 0 : _h.isDelete) || ["\u274C H\xECnh \u1EA3nh t\u1EA3i l\xEAn vi ph\u1EA1m ch\xEDnh s\xE1ch, vui l\xF2ng ch\u1ECDn \u1EA3nh kh\xE1c!", "\u274C Th\u01B0\u1EDBc phim li\xEAn quan \u0111\u1EBFn ch\u1EE7 \u0111\u1EC1 nh\u1EA1y c\u1EA3m, vi ph\u1EA1m ch\xEDnh s\xE1ch n\u1ED9i dung!"].includes((_j = (_i = slotProps.item) == null ? void 0 : _i.lastMessage) == null ? void 0 : _j.note)),
                          onClick: ($event) => emits("action", { action: "reload", item: slotProps.item })
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_v_icon, { size: "20" }, {
                              default: withCtx(() => [
                                createTextVNode("mdi-reload")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["disabled", "onClick"])) : createCommentVNode("", true),
                        props.rowActions.includes("view") ? (openBlock(), createBlock(_component_v_btn, {
                          key: 1,
                          icon: "",
                          size: "40",
                          variant: "text",
                          onClick: ($event) => emits("action", { action: "view", item: slotProps.item })
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
                        props.rowActions.includes("update") ? (openBlock(), createBlock(_component_v_btn, {
                          key: 2,
                          icon: "",
                          size: "40",
                          variant: "text",
                          onClick: ($event) => emits("action", { action: "update", item: slotProps.item })
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_v_icon, { size: "20" }, {
                              default: withCtx(() => [
                                createTextVNode("mdi-pencil-outline")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["onClick"])) : createCommentVNode("", true),
                        props.rowActions.includes("delete") ? (openBlock(), createBlock(_component_v_btn, {
                          key: 3,
                          icon: "",
                          size: "40",
                          variant: "text",
                          color: "error",
                          onClick: ($event) => onConfirmAction("delete", slotProps.item)
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_v_icon, { size: "20" }, {
                              default: withCtx(() => [
                                createTextVNode("mdi-trash-can-outline")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["onClick"])) : createCommentVNode("", true)
                      ])) : (openBlock(), createBlock("div", {
                        key: 3,
                        class: ["my-4 text-nowrap", h.class],
                        style: { "min-width": h.width }
                      }, toDisplayString(getNestedValue(slotProps.item, h.key)), 7))
                    ];
                  })
                ];
              }
            })
          };
        })
      ]), _parent));
      _push(ssrRenderComponent(_component_v_overlay, {
        modelValue: unref(display),
        "onUpdate:modelValue": ($event) => isRef(display) ? display.value = $event : null,
        style: { "z-index": "9999 !important" }
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DataTable.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=DataTable-Cfx4fCxn.mjs.map
