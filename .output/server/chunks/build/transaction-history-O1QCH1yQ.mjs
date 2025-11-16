import { _ as __nuxt_component_0 } from './ConfirmDialog-Df9nJcuZ.mjs';
import { _ as _sfc_main$1 } from './DataTable-Cfx4fCxn.mjs';
import { f as formatCurrency } from './helper-QcO-vDIR.mjs';
import { defineComponent, ref, computed, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { a as accountService } from './account-Cwp5COvj.mjs';
import { _ as _export_sfc, g as useRoute$1, e as useI18n } from './server.mjs';
import { u as useMasterDataStore } from './master-data-ZBucjABo.mjs';
import { a as commissionStatusOptions } from './constants-B3HUeYES.mjs';
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
  __name: "transaction-history",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute$1();
    const { t } = useI18n();
    const { onGetterMasterData } = useMasterDataStore();
    const headers = [
      { title: "Th\xF4ng tin kh\xE1ch h\xE0ng", key: "customerInfo", sortable: false },
      { title: "Chi ti\u1EBFt g\xF3i", key: "rentalNote", sortable: false },
      { title: "Hoa h\u1ED3ng (%)", key: "commissionRate", sortable: false },
      {
        title: "Gi\xE1 g\xF3i",
        key: "basePrice",
        align: "end",
        sortable: false
      },
      {
        title: "Th\xE0nh ti\u1EC1n",
        key: "paymentAmount",
        align: "end",
        sortable: false
      },
      {
        title: "Ti\u1EC1n nh\u1EADn \u0111\u01B0\u1EE3c",
        key: "commissionAmount",
        align: "end",
        sortable: false
      },
      { title: "Ng\xE0y giao d\u1ECBch", key: "createdAt", sortable: false },
      {
        title: "Tr\u1EA1ng th\xE1i",
        key: "status",
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
        return (_a = commissionStatusOptions) == null ? void 0 : _a.map((x) => ({ ...x, title: t(x.title) }));
      }
    );
    const transactionMonthsItems = computed(
      () => {
        var _a;
        return ((_a = onGetterMasterData.value["transaction-months"]) == null ? void 0 : _a.map((x) => ({
          title: t(x.title),
          value: x.value
        }))) || [];
      }
    );
    async function loadItems(event) {
      const params = { ...event };
      loading.value = "load-table";
      await accountService.getTransactionHistory(params).then((res) => {
        if (res.data) data.value = res.data;
      }).finally(() => {
        loading.value = "";
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ConfirmDialog = __nuxt_component_0;
      const _component_DataTable = _sfc_main$1;
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
            label: "Th\u1EDDi gian",
            field: "monthYear",
            type: "select",
            items: unref(transactionMonthsItems)
          },
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
        headers,
        data: unref(data),
        loading: Boolean(unref(loading) == "load-table"),
        onChange: loadItems
      }, {
        "row-basePrice": withCtx(({ item }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-red" data-v-316332c1${_scopeId}>${ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(item.basePrice))}</div>`);
          } else {
            return [
              createVNode("div", { class: "text-red" }, toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(item.basePrice)), 1)
            ];
          }
        }),
        "row-paymentAmount": withCtx(({ item }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-red" data-v-316332c1${_scopeId}>${ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(item.paymentAmount))}</div>`);
          } else {
            return [
              createVNode("div", { class: "text-red" }, toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(item.paymentAmount)), 1)
            ];
          }
        }),
        "row-commissionAmount": withCtx(({ item }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text-error" data-v-316332c1${_scopeId}>${ssrInterpolate(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(item.commissionAmount))}</div>`);
          } else {
            return [
              createVNode("div", { class: "text-error" }, toDisplayString(("formatCurrency" in _ctx ? _ctx.formatCurrency : unref(formatCurrency))(item.commissionAmount)), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/partner/transaction-history.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const transactionHistory = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-316332c1"]]);

export { transactionHistory as default };
//# sourceMappingURL=transaction-history-O1QCH1yQ.mjs.map
