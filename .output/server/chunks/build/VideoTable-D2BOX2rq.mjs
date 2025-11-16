import { _ as _sfc_main$1 } from './DataTable-Cfx4fCxn.mjs';
import { defineComponent, ref, reactive, computed, resolveComponent, unref, withCtx, createTextVNode, createVNode, createBlock, createCommentVNode, toDisplayString, openBlock, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrInterpolate } from 'vue/server-renderer';
import { u as useAppStore } from './app.store-CsbFmGtW.mjs';
import { p as productService } from './product-BGXEFPOO.mjs';
import { _ as __nuxt_component_0 } from './ConfirmDialog-Df9nJcuZ.mjs';
import { _ as _export_sfc, g as useRoute$1, e as useI18n } from './server.mjs';
import { u as useMasterDataStore } from './master-data-ZBucjABo.mjs';
import { s as statusOptions } from './constants-B3HUeYES.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "VideoTable",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const { t } = useI18n();
    const { onGetterMasterData } = useMasterDataStore();
    const headers = [
      { title: "Ti\xEAu \u0111\u1EC1", key: "title", sortable: false },
      { title: "M\xF4 h\xECnh", key: "modelVideoTitle", sortable: false },
      { title: "T\u1EF7 l\u1EC7 khung h\xECnh", key: "frameRateTitle", sortable: false },
      { title: "Ch\u1EBF \u0111\u1ED9", key: "videoModeTitle", sortable: false },
      { title: "Phong c\xE1ch", key: "videoStyleTitle", sortable: false },
      {
        title: "Th\u1EDDi l\u01B0\u1EE3ng",
        key: "videoDurationTitle",
        align: "center",
        sortable: false
      },
      { title: "T\xE1c gi\u1EA3", key: "account.name", sortable: false },
      { title: "C\u1EADp nh\u1EADt", key: "updatedAt", sortable: false },
      { title: "Tr\u1EA1ng th\xE1i", key: "status", align: "center", sortable: false },
      { title: "Thao t\xE1c", key: "action", align: "center", sortable: false }
    ];
    const data = ref({});
    const loading = ref("");
    const dataTableRef = ref(null);
    const confirmDialogRef = ref(null);
    const params = reactive({
      modelVideo: null,
      frameRate: null,
      videoMode: null,
      videoStyle: null,
      videoDuration: null,
      status: null
    });
    const modelVideoItems = computed(() => [
      { title: "T\u1EA5t c\u1EA3", value: null },
      ...onGetterMasterData.value["model-video"] || []
    ]);
    const frameRateItems = computed(
      () => {
        var _a;
        return ((_a = [
          { title: "T\u1EA5t c\u1EA3", value: null },
          ...onGetterMasterData.value["frame-rate"]
        ]) == null ? void 0 : _a.map((x) => ({
          title: t(x.title),
          value: x.value
        }))) || [];
      }
    );
    const videoModeItems = computed(
      () => {
        var _a;
        return ((_a = [
          { title: "T\u1EA5t c\u1EA3", value: null },
          ...onGetterMasterData.value["video-mode"]
        ]) == null ? void 0 : _a.map((x) => ({
          title: t(x.title),
          value: x.value
        }))) || [];
      }
    );
    const videoStyleItems = computed(() => {
      var _a;
      const list = ((_a = [
        { title: "T\u1EA5t c\u1EA3", value: null },
        ...onGetterMasterData.value["video-style"]
      ]) == null ? void 0 : _a.map((x) => ({
        title: t(x.title),
        value: x.value
      }))) || [];
      switch (params.videoMode) {
        case "movie": {
          return list.filter(
            (x) => [null, "general", "monologue", "narration"].includes(x.value)
          );
        }
        case "storytelling": {
          return list.filter((x) => [null, "general"].includes(x.value));
        }
        case "short_form_video": {
          return list.filter(
            (x) => [null, "general", "satisfying", "asmr"].includes(x.value)
          );
        }
        case "my_subject": {
          return list.filter(
            (x) => [null, "general", "testimonial"].includes(x.value)
          );
        }
        default: {
          return list;
        }
      }
    });
    const videoDurationItems = computed(() => {
      const allOptions = [
        { title: "T\u1EA5t c\u1EA3", value: null },
        ...onGetterMasterData.value["video-duration"]
      ];
      if (params.videoMode === "movie") {
        return allOptions;
      } else if (["short_form_video", "my_subject"].includes(params.videoMode)) {
        const shortVideoValues = [null, "1", "2", "3", "4", "5", "6", "7"];
        return allOptions.filter(
          (option) => shortVideoValues.includes(option.value)
        );
      } else if (["storytelling"].includes(params.videoMode)) {
        const shortVideoValues = [null, "8", "12", "16", "20", "24"];
        return allOptions.filter(
          (option) => shortVideoValues.includes(option.value)
        );
      } else {
        return allOptions;
      }
    });
    const statusItems = computed(
      () => {
        var _a;
        return (_a = statusOptions.filter((x) => x.value !== "all")) == null ? void 0 : _a.map((x) => ({ ...x, title: t(x.title) }));
      }
    );
    async function loadItems(event) {
      var _a, _b;
      const params2 = {
        ...event,
        state: ((_b = (_a = route.path) == null ? void 0 : _a.split("/")) == null ? void 0 : _b.pop()) || "in-progress"
      };
      loading.value = "load-table";
      await productService.getAllProduct(params2).then((res) => {
        if (res.data) data.value = res.data;
      }).finally(() => {
        loading.value = "";
      });
    }
    const onClickRestartVideo = async (item) => {
      var _a;
      if (!item || !item._id) return;
      await productService.saveProduct(item);
      await ((_a = dataTableRef.value) == null ? void 0 : _a.loadItems());
    };
    const onAction = async (event) => {
      var _a, _b;
      if (event.action == "reload") {
        onClickRestartVideo(event.item);
      } else if (event.action == "view") {
        if ((_a = event == null ? void 0 : event.item) == null ? void 0 : _a.link) {
          (void 0).open((_b = event == null ? void 0 : event.item) == null ? void 0 : _b.link, "_blank");
        } else {
          useAppStore().onActionSetSystemPopup({
            type: "error",
            content: "Th\u01B0\u1EDBc phim kh\xF4ng t\u1ED3n t\u1EA1i!"
          });
        }
      }
    };
    const onChangeFilter = (event) => {
      params[event.field] = event.value;
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_DataTable = _sfc_main$1;
      const _component_v_icon = resolveComponent("v-icon");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(__nuxt_component_0, {
        ref_key: "confirmDialogRef",
        ref: confirmDialogRef
      }, null, _parent));
      _push(ssrRenderComponent(_component_DataTable, {
        ref_key: "dataTableRef",
        ref: dataTableRef,
        filters: [
          {
            label: "M\xF4 h\xECnh",
            field: "modelVideo",
            type: "select",
            items: unref(modelVideoItems)
          },
          {
            label: "T\u1EF7 l\u1EC7 khung h\xECnh",
            field: "frameRate",
            type: "select",
            items: unref(frameRateItems)
          },
          {
            label: "Ch\u1EBF \u0111\u1ED9",
            field: "videoMode",
            type: "select",
            items: unref(videoModeItems)
          },
          {
            label: "Phong c\xE1ch",
            field: "videoStyle",
            type: "select",
            items: unref(videoStyleItems)
          },
          {
            label: "Th\u1EDDi l\u01B0\u1EE3ng",
            field: "videoDuration",
            type: "select",
            items: unref(videoDurationItems)
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
        rowActions: ((_b = (_a = unref(route).path) == null ? void 0 : _a.split("/")) == null ? void 0 : _b.pop()) === "error" ? ["reload", "view"] : ["view"],
        headers,
        data: unref(data),
        loading: Boolean(unref(loading) == "load-table"),
        onChange: loadItems,
        onAction,
        onChangeFilter
      }, {
        "row-title": withCtx(({ item }, _push2, _parent2, _scopeId) => {
          var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
          if (_push2) {
            _push2(`<div class="d-flex flex-column ga-1 py-4" data-v-68908076${_scopeId}><span style="${ssrRenderStyle({ "min-width": "14rem" })}" data-v-68908076${_scopeId}>${ssrInterpolate(item.title)}</span>`);
            if (item.state === "primary") {
              _push2(`<div class="text-primary" style="${ssrRenderStyle({ "border-radius": "1rem" })}" data-v-68908076${_scopeId}><div class="text-caption" data-v-68908076${_scopeId}>${ssrInterpolate((_a2 = item == null ? void 0 : item.lastMessage) == null ? void 0 : _a2.title)}</div>`);
              if ((_b2 = item == null ? void 0 : item.lastMessage) == null ? void 0 : _b2.note) {
                _push2(`<div class="text-caption" data-v-68908076${_scopeId}>${ssrInterpolate((_c = item == null ? void 0 : item.lastMessage) == null ? void 0 : _c.note)}</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else if (item.state === "error") {
              _push2(`<div class="text-red" style="${ssrRenderStyle({ "border-radius": "1rem" })}" data-v-68908076${_scopeId}>`);
              if ((_d = item == null ? void 0 : item.lastMessage) == null ? void 0 : _d.note) {
                _push2(`<div class="text-caption" data-v-68908076${_scopeId}>${ssrInterpolate((_e = item == null ? void 0 : item.lastMessage) == null ? void 0 : _e.note)}</div>`);
              } else {
                _push2(`<!---->`);
              }
              if ((_f = item == null ? void 0 : item.lastMessage) == null ? void 0 : _f.errorMsg) {
                _push2(`<div class="text-caption" data-v-68908076${_scopeId}>${ssrInterpolate((_g = item == null ? void 0 : item.lastMessage) == null ? void 0 : _g.errorMsg)}</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else if (item.state === "success") {
              _push2(`<div class="text-success" style="${ssrRenderStyle({ "border-radius": "1rem" })}" data-v-68908076${_scopeId}>`);
              if ((_h = item == null ? void 0 : item.lastMessage) == null ? void 0 : _h.note) {
                _push2(`<div class="text-caption" data-v-68908076${_scopeId}>${ssrInterpolate((_i = item == null ? void 0 : item.lastMessage) == null ? void 0 : _i.note)}</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (item.isDelete) {
              _push2(`<div class="text-red d-flex align-center ga-1" data-v-68908076${_scopeId}>`);
              _push2(ssrRenderComponent(_component_v_icon, { size: "20" }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`mdi-delete-outline`);
                  } else {
                    return [
                      createTextVNode("mdi-delete-outline")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`<span style="${ssrRenderStyle({ "font-size": "0.8rem" })}" data-v-68908076${_scopeId}>Kh\xE1ch h\xE0ng \u0111\xE3 x\xF3a video n\xE0y</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "d-flex flex-column ga-1 py-4" }, [
                createVNode("span", { style: { "min-width": "14rem" } }, toDisplayString(item.title), 1),
                item.state === "primary" ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "text-primary",
                  style: { "border-radius": "1rem" }
                }, [
                  createVNode("div", { class: "text-caption" }, toDisplayString((_j = item == null ? void 0 : item.lastMessage) == null ? void 0 : _j.title), 1),
                  ((_k = item == null ? void 0 : item.lastMessage) == null ? void 0 : _k.note) ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "text-caption"
                  }, toDisplayString((_l = item == null ? void 0 : item.lastMessage) == null ? void 0 : _l.note), 1)) : createCommentVNode("", true)
                ])) : item.state === "error" ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "text-red",
                  style: { "border-radius": "1rem" }
                }, [
                  ((_m = item == null ? void 0 : item.lastMessage) == null ? void 0 : _m.note) ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "text-caption"
                  }, toDisplayString((_n = item == null ? void 0 : item.lastMessage) == null ? void 0 : _n.note), 1)) : createCommentVNode("", true),
                  ((_o = item == null ? void 0 : item.lastMessage) == null ? void 0 : _o.errorMsg) ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "text-caption"
                  }, toDisplayString((_p = item == null ? void 0 : item.lastMessage) == null ? void 0 : _p.errorMsg), 1)) : createCommentVNode("", true)
                ])) : item.state === "success" ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "text-success",
                  style: { "border-radius": "1rem" }
                }, [
                  ((_q = item == null ? void 0 : item.lastMessage) == null ? void 0 : _q.note) ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "text-caption"
                  }, toDisplayString((_r = item == null ? void 0 : item.lastMessage) == null ? void 0 : _r.note), 1)) : createCommentVNode("", true)
                ])) : createCommentVNode("", true),
                item.isDelete ? (openBlock(), createBlock("div", {
                  key: 3,
                  class: "text-red d-flex align-center ga-1"
                }, [
                  createVNode(_component_v_icon, { size: "20" }, {
                    default: withCtx(() => [
                      createTextVNode("mdi-delete-outline")
                    ]),
                    _: 1
                  }),
                  createVNode("span", { style: { "font-size": "0.8rem" } }, "Kh\xE1ch h\xE0ng \u0111\xE3 x\xF3a video n\xE0y")
                ])) : createCommentVNode("", true)
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/VideoTable.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const VideoTable = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-68908076"]]);

export { VideoTable as V };
//# sourceMappingURL=VideoTable-D2BOX2rq.mjs.map
