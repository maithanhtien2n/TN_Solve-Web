import { defineComponent, resolveComponent, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useRouter$1, f as useLocalePath } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ButtonCreateVideo",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter$1();
    useLocalePath();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_v_icon = resolveComponent("v-icon");
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "sticky d-flex justify-center",
        style: { "bottom": "2rem" }
      }, _attrs))}><div class="cta-button" style="${ssrRenderStyle({ "border-radius": "6px" })}">`);
      _push(ssrRenderComponent(_component_v_icon, { size: "27" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`mdi-image-filter-tilt-shift`);
          } else {
            return [
              createTextVNode("mdi-image-filter-tilt-shift")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h3>${ssrInterpolate(_ctx.$t("T\u1EA1o video"))}</h3></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ButtonCreateVideo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=ButtonCreateVideo-Dut5_jms.mjs.map
