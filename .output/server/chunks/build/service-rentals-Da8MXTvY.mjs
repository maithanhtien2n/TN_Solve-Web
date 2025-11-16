import { _ as __nuxt_component_0 } from './ConfirmDialog-Df9nJcuZ.mjs';
import { _ as _sfc_main$1 } from './DataTable-Cfx4fCxn.mjs';
import { f as formatCurrency } from './helper-QcO-vDIR.mjs';
import { defineComponent, ref, computed, resolveComponent, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { a as accountService } from './account-Cwp5COvj.mjs';
import { _ as _export_sfc, g as useRoute$1, e as useI18n } from './server.mjs';
import { u as useMasterDataStore } from './master-data-ZBucjABo.mjs';
import { e as expiryStatusOptions } from './constants-B3HUeYES.mjs';
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
import './index-BKshJpnN.mjs';
import '@vueuse/core';
import './v3-CpJW8Kui.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import 'node:path';
import 'node:crypto';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import './enum-kAdbNx_J.mjs';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "service-rentals",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const { t } = useI18n();
    const { onGetterMasterData } = useMasterDataStore();
    const headers = [
      { title: "H\u1ECD v\xE0 t\xEAn", key: "accountId.name", sortable: false },
      { title: "Chi ti\u1EBFt g\xF3i", key: "note", sortable: false },
      { title: "Ng\xE0y b\u1EAFt \u0111\u1EA7u", key: "serviceStartDate", sortable: false },
      { title: "Ng\xE0y h\u1EBFt h\u1EA1n", key: "serviceExpiry", sortable: false },
      // { title: "Thời hạn đăng ký", key: "rentalMonths", sortable: false },
      { title: "Gi\xE1 g\xF3i", key: "basePrice", align: "end", sortable: false },
      { title: "Th\xE0nh ti\u1EC1n", key: "price", align: "end", sortable: false },
      { title: "C\u1EADp nh\u1EADt", key: "updatedAt", sortable: false },
      {
        title: "Tr\u1EA1ng th\xE1i",
        key: "expiryStatus",
        align: "center",
        sortable: false
      }
    ];
    const data = ref({});
    const loading = ref("");
    const dataTableRef = ref(null);
    const confirmDialogRef = ref(null);
    const statusItems = computed(
      () => {
        var _a;
        return (_a = expiryStatusOptions) == null ? void 0 : _a.map((x) => ({ ...x, title: t(x.title) }));
      }
    );
    computed(
      () => {
        var _a;
        return ((_a = onGetterMasterData.value["rental-months"]) == null ? void 0 : _a.map((x) => ({
          title: t(x.title),
          value: x.value
        }))) || [];
      }
    );
    async function loadItems(event) {
      var _a, _b;
      const params = {
        ...event,
        expiry: ((_b = (_a = route.path) == null ? void 0 : _a.split("/")) == null ? void 0 : _b.pop()) || "active"
      };
      loading.value = "load-table";
      await accountService.getAllServiceRental(params).then((res) => {
        if (res.data) data.value = res.data;
      }).finally(() => {
        loading.value = "";
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ConfirmDialog = __nuxt_component_0;
      const _component_DataTable = _sfc_main$1;
      const _component_v_chip = resolveComponent("v-chip");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_ConfirmDialog, {
        ref_key: "confirmDialogRef",
        ref: confirmDialogRef
      }, null, _parent));
      _push(ssrRenderComponent(_component_DataTable, {
        ref_key: "dataTableRef",
        ref: dataTableRef,
        filters: [
          {
            label: "Tr\u1EA1ng th\xE1i",
            field: "expiryStatus",
            type: "select",
            items: unref(statusItems)
          }
        ],
        showSelect: false,
        actions: [],
        rowActions: ["register"],
        headers,
        data: unref(data),
        loading: Boolean(unref(loading) == "load-table"),
        onChange: loadItems
      }, {
        "row-basePrice": withCtx(({ item }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-red" data-v-1b0306e3${_scopeId}>${ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(item.basePrice))}</div>`);
          } else {
            return [
              createVNode("div", { class: "text-red" }, toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(item.basePrice)), 1)
            ];
          }
        }),
        "row-price": withCtx(({ item }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-error" data-v-1b0306e3${_scopeId}>${ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(item.price))}</div>`);
          } else {
            return [
              createVNode("div", { class: "text-error" }, toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(item.price)), 1)
            ];
          }
        }),
        "row-expiryStatus": withCtx(({ item }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_v_chip, {
              color: (item == null ? void 0 : item.expiryStatus) == "\u0110\xE3 h\u1EBFt h\u1EA1n" ? "red" : "success"
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(_ctx.$t(item == null ? void 0 : item.expiryStatus))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(_ctx.$t(item == null ? void 0 : item.expiryStatus)), 1)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_v_chip, {
                color: (item == null ? void 0 : item.expiryStatus) == "\u0110\xE3 h\u1EBFt h\u1EA1n" ? "red" : "success"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(_ctx.$t(item == null ? void 0 : item.expiryStatus)), 1)
                ]),
                _: 2
              }, 1032, ["color"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/service-rentals.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const serviceRentals = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1b0306e3"]]);

export { serviceRentals as default };
//# sourceMappingURL=service-rentals-Da8MXTvY.mjs.map
