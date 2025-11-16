import { defineComponent, ref, reactive, resolveComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, renderSlot, createBlock, openBlock, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderSlot, ssrRenderStyle, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc, e as useI18n } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ConfirmDialog",
  __ssrInlineRender: true,
  emits: ["onNo", "onYes"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const emits = __emit;
    const { t } = useI18n();
    const defaultConfig = {
      display: false,
      title: "X\xE1c nh\u1EADn",
      message: "Ch\u01B0a c\xF3 n\u1ED9i dung",
      noTitle: "B\u1ECF qua",
      yesTitle: "\u0110\u1ED3ng \xFD",
      data: null,
      noTransMsg: false,
      onConfirm: null
    };
    const loading = ref(false);
    const confirmConfig = reactive({ ...defaultConfig });
    function show(config) {
      Object.assign(confirmConfig, defaultConfig, config, { display: true });
    }
    function hide() {
      confirmConfig.display = false;
    }
    async function onClickYes() {
      if (confirmConfig.onConfirm) {
        try {
          loading.value = true;
          await confirmConfig.onConfirm();
          emits("onYes", confirmConfig.data);
        } finally {
          loading.value = false;
          hide();
        }
      } else {
        emits("onYes", confirmConfig.data);
        hide();
      }
    }
    function onClickNo() {
      emits("onNo");
      hide();
    }
    __expose({ show, hide });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_v_dialog = resolveComponent("v-dialog");
      const _component_v_card = resolveComponent("v-card");
      const _component_v_btn = resolveComponent("v-btn");
      _push(ssrRenderComponent(_component_v_dialog, mergeProps({
        modelValue: unref(confirmConfig).display,
        "onUpdate:modelValue": ($event) => unref(confirmConfig).display = $event,
        "max-width": "400",
        persistent: Boolean(unref(loading)),
        style: { "z-index": "99999999999999999" }
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_v_card, { class: "pa-4 pt-2 rounded-lg" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="d-flex flex-column ga-4" data-v-794afdc8${_scopeId2}>`);
                  ssrRenderSlot(_ctx.$slots, "title", { config: unref(confirmConfig) }, () => {
                    _push3(`<h2 class="font-bold" style="${ssrRenderStyle({ "font-size": "1.3rem" })}" data-v-794afdc8${_scopeId2}>${ssrInterpolate(unref(t)(unref(confirmConfig).title))}</h2>`);
                  }, _push3, _parent3, _scopeId2);
                  ssrRenderSlot(_ctx.$slots, "content", { config: unref(confirmConfig) }, () => {
                    var _a;
                    if (unref(confirmConfig).noTransMsg) {
                      _push3(`<div class="whitespace-pre-line" data-v-794afdc8${_scopeId2}>${(_a = unref(confirmConfig).message) != null ? _a : ""}</div>`);
                    } else {
                      _push3(`<div class="whitespace-pre-line" data-v-794afdc8${_scopeId2}>${ssrInterpolate(unref(t)(unref(confirmConfig).message))}</div>`);
                    }
                  }, _push3, _parent3, _scopeId2);
                  _push3(`<div class="d-flex ga-3 mt-3" data-v-794afdc8${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_v_btn, {
                    size: "large",
                    class: "flex-1",
                    variant: "tonal",
                    disabled: Boolean(unref(loading)),
                    onClick: onClickNo
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(unref(t)(unref(confirmConfig).noTitle))}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(unref(t)(unref(confirmConfig).noTitle)), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  ssrRenderSlot(_ctx.$slots, "btnYes", { config: unref(confirmConfig) }, () => {
                    _push3(ssrRenderComponent(_component_v_btn, {
                      size: "large",
                      variant: "flat",
                      class: "flex-1",
                      color: "primary",
                      loading: unref(loading),
                      onClick: onClickYes
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(unref(t)(unref(confirmConfig).yesTitle))}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(unref(t)(unref(confirmConfig).yesTitle)), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  }, _push3, _parent3, _scopeId2);
                  _push3(`</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "d-flex flex-column ga-4" }, [
                      renderSlot(_ctx.$slots, "title", { config: unref(confirmConfig) }, () => [
                        createVNode("h2", {
                          class: "font-bold",
                          style: { "font-size": "1.3rem" }
                        }, toDisplayString(unref(t)(unref(confirmConfig).title)), 1)
                      ], true),
                      renderSlot(_ctx.$slots, "content", { config: unref(confirmConfig) }, () => [
                        unref(confirmConfig).noTransMsg ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "whitespace-pre-line",
                          innerHTML: unref(confirmConfig).message
                        }, null, 8, ["innerHTML"])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "whitespace-pre-line"
                        }, toDisplayString(unref(t)(unref(confirmConfig).message)), 1))
                      ], true),
                      createVNode("div", { class: "d-flex ga-3 mt-3" }, [
                        createVNode(_component_v_btn, {
                          size: "large",
                          class: "flex-1",
                          variant: "tonal",
                          disabled: Boolean(unref(loading)),
                          onClick: onClickNo
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(t)(unref(confirmConfig).noTitle)), 1)
                          ]),
                          _: 1
                        }, 8, ["disabled"]),
                        renderSlot(_ctx.$slots, "btnYes", { config: unref(confirmConfig) }, () => [
                          createVNode(_component_v_btn, {
                            size: "large",
                            variant: "flat",
                            class: "flex-1",
                            color: "primary",
                            loading: unref(loading),
                            onClick: onClickYes
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(t)(unref(confirmConfig).yesTitle)), 1)
                            ]),
                            _: 1
                          }, 8, ["loading"])
                        ], true)
                      ])
                    ])
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_v_card, { class: "pa-4 pt-2 rounded-lg" }, {
                default: withCtx(() => [
                  createVNode("div", { class: "d-flex flex-column ga-4" }, [
                    renderSlot(_ctx.$slots, "title", { config: unref(confirmConfig) }, () => [
                      createVNode("h2", {
                        class: "font-bold",
                        style: { "font-size": "1.3rem" }
                      }, toDisplayString(unref(t)(unref(confirmConfig).title)), 1)
                    ], true),
                    renderSlot(_ctx.$slots, "content", { config: unref(confirmConfig) }, () => [
                      unref(confirmConfig).noTransMsg ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "whitespace-pre-line",
                        innerHTML: unref(confirmConfig).message
                      }, null, 8, ["innerHTML"])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "whitespace-pre-line"
                      }, toDisplayString(unref(t)(unref(confirmConfig).message)), 1))
                    ], true),
                    createVNode("div", { class: "d-flex ga-3 mt-3" }, [
                      createVNode(_component_v_btn, {
                        size: "large",
                        class: "flex-1",
                        variant: "tonal",
                        disabled: Boolean(unref(loading)),
                        onClick: onClickNo
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(t)(unref(confirmConfig).noTitle)), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled"]),
                      renderSlot(_ctx.$slots, "btnYes", { config: unref(confirmConfig) }, () => [
                        createVNode(_component_v_btn, {
                          size: "large",
                          variant: "flat",
                          class: "flex-1",
                          color: "primary",
                          loading: unref(loading),
                          onClick: onClickYes
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(t)(unref(confirmConfig).yesTitle)), 1)
                          ]),
                          _: 1
                        }, 8, ["loading"])
                      ], true)
                    ])
                  ])
                ]),
                _: 3
              })
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ConfirmDialog.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-794afdc8"]]);

export { __nuxt_component_0 as _ };
//# sourceMappingURL=ConfirmDialog-Df9nJcuZ.mjs.map
