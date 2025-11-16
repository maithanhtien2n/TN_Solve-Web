import { defineComponent, ref, watch, resolveComponent, mergeProps, unref, isRef, withCtx, createTextVNode, createVNode, renderSlot, createBlock, createCommentVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { u as useDevice } from './index-BKshJpnN.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CommonDialog",
  __ssrInlineRender: true,
  props: {
    title: { type: String, default: "Ch\u01B0a c\xF3 title" },
    width: { type: String, default: "600" }
  },
  emits: ["change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const { isMobile } = useDevice();
    const emits = __emit;
    const display = ref(false);
    const onDisplay = (event) => {
      display.value = event;
    };
    watch(display, (newValue) => {
      emits("change", newValue);
    });
    __expose({ onDisplay });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_v_dialog = resolveComponent("v-dialog");
      const _component_v_card = resolveComponent("v-card");
      const _component_v_toolbar = resolveComponent("v-toolbar");
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_icon = resolveComponent("v-icon");
      const _component_v_card_text = resolveComponent("v-card-text");
      _push(ssrRenderComponent(_component_v_dialog, mergeProps({
        modelValue: unref(display),
        "onUpdate:modelValue": ($event) => isRef(display) ? display.value = $event : null,
        scrollable: "",
        transition: "dialog-bottom-transition",
        width: __props.width,
        fullscreen: Boolean(unref(isMobile))
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_v_card, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (__props.title) {
                    _push3(ssrRenderComponent(_component_v_toolbar, {
                      title: _ctx.$t(__props.title),
                      class: "py-0 px-0"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="mr-4"${_scopeId3}>`);
                          _push4(ssrRenderComponent(_component_v_btn, {
                            size: "40",
                            variant: "tonal",
                            icon: "",
                            onClick: ($event) => display.value = false
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_v_icon, { size: "24" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`mdi-close`);
                                    } else {
                                      return [
                                        createTextVNode("mdi-close")
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_v_icon, { size: "24" }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-close")
                                    ]),
                                    _: 1
                                  })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`</div>`);
                        } else {
                          return [
                            createVNode("div", { class: "mr-4" }, [
                              createVNode(_component_v_btn, {
                                size: "40",
                                variant: "tonal",
                                icon: "",
                                onClick: ($event) => display.value = false
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_v_icon, { size: "24" }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-close")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["onClick"])
                            ])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(_component_v_card_text, { class: "pa-4 pt-3 mb-2" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push4, _parent4, _scopeId3);
                      } else {
                        return [
                          renderSlot(_ctx.$slots, "default")
                        ];
                      }
                    }),
                    _: 3
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    __props.title ? (openBlock(), createBlock(_component_v_toolbar, {
                      key: 0,
                      title: _ctx.$t(__props.title),
                      class: "py-0 px-0"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "mr-4" }, [
                          createVNode(_component_v_btn, {
                            size: "40",
                            variant: "tonal",
                            icon: "",
                            onClick: ($event) => display.value = false
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_v_icon, { size: "24" }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-close")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ])
                      ]),
                      _: 1
                    }, 8, ["title"])) : createCommentVNode("", true),
                    createVNode(_component_v_card_text, { class: "pa-4 pt-3 mb-2" }, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "default")
                      ]),
                      _: 3
                    })
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_v_card, null, {
                default: withCtx(() => [
                  __props.title ? (openBlock(), createBlock(_component_v_toolbar, {
                    key: 0,
                    title: _ctx.$t(__props.title),
                    class: "py-0 px-0"
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "mr-4" }, [
                        createVNode(_component_v_btn, {
                          size: "40",
                          variant: "tonal",
                          icon: "",
                          onClick: ($event) => display.value = false
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_v_icon, { size: "24" }, {
                              default: withCtx(() => [
                                createTextVNode("mdi-close")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["onClick"])
                      ])
                    ]),
                    _: 1
                  }, 8, ["title"])) : createCommentVNode("", true),
                  createVNode(_component_v_card_text, { class: "pa-4 pt-3 mb-2" }, {
                    default: withCtx(() => [
                      renderSlot(_ctx.$slots, "default")
                    ]),
                    _: 3
                  })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CommonDialog.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=CommonDialog-CSwcOS1W.mjs.map
