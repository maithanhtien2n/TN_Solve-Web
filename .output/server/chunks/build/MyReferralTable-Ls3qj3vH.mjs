import { _ as __nuxt_component_0 } from './ConfirmDialog-Df9nJcuZ.mjs';
import { _ as _sfc_main$1 } from './DataTable-Cfx4fCxn.mjs';
import { defineComponent, ref, computed, unref, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { a as accountService } from './account-Cwp5COvj.mjs';
import { _ as _export_sfc, g as useRoute$1, e as useI18n } from './server.mjs';
import { u as useMasterDataStore } from './master-data-ZBucjABo.mjs';
import { s as statusOptions } from './constants-B3HUeYES.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "MyReferralTable",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const { t } = useI18n();
    const { onGetterMasterData } = useMasterDataStore();
    const headers = [
      { title: "H\u1ECD v\xE0 t\xEAn", key: "name", sortable: false },
      { title: "Email", key: "email", sortable: false },
      // { title: "Hoa hồng (%)", key: "commissionRate", sortable: false },
      { title: "Th\u1EDDi h\u1EA1n c\xF2n l\u1EA1i", key: "remainingTime", sortable: false },
      { title: "Ng\xE0y tham gia", key: "createdAt", sortable: false },
      { title: "C\u1EADp nh\u1EADt", key: "updatedAt", sortable: false },
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
        return (_a = statusOptions) == null ? void 0 : _a.map((x) => ({ ...x, title: t(x.title) }));
      }
    );
    async function loadItems(event) {
      var _a, _b;
      const params = { ...event, role: ((_b = (_a = route.path) == null ? void 0 : _a.split("/")) == null ? void 0 : _b.pop()) || "user" };
      loading.value = "load-table";
      await accountService.getMyReferralList(params).then((res) => {
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
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/partner/MyReferralTable.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const MyReferralTable = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-48fc5251"]]);

export { MyReferralTable as M };
//# sourceMappingURL=MyReferralTable-Ls3qj3vH.mjs.map
