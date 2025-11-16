import { defineComponent, ref, reactive, computed, resolveComponent, unref, mergeProps, withCtx, createTextVNode, createVNode, toDisplayString, createBlock, createCommentVNode, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderClass, ssrRenderList, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc, g as useRoute$1, u as useRouter$1, f as useLocalePath, e as useI18n, a as useNuxtApp } from './server.mjs';
import { d as downloadVideo } from './helper-QcO-vDIR.mjs';
import { E as EnumAccountRole } from './enum-kAdbNx_J.mjs';
import { u as useAppStore } from './app.store-CsbFmGtW.mjs';
import { p as productService } from './product-BGXEFPOO.mjs';
import { u as useDevice, a as useSeo } from './index-BKshJpnN.mjs';
import { u as useMasterDataStore } from './master-data-ZBucjABo.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import 'node:path';
import 'node:crypto';
import 'pinia';
import 'vue-router';
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
import '@vueuse/core';
import './v3-CpJW8Kui.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "VideoPlayer",
  __ssrInlineRender: true,
  props: {
    frameRate: {
      type: String,
      default: "horizontal"
    },
    src: {
      type: String,
      required: true
    },
    removeControls: {
      type: Array,
      default: () => ["settings"]
    },
    poster: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    useRoute$1();
    const props = __props;
    const loading = ref(true);
    ref(null);
    ({
      //   autopause: true,
      //   autoplay: false,
      controls: [
        "play-large",
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "settings",
        "fullscreen"
      ].filter((item) => !props.removeControls.includes(item))
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_v_skeleton_loader = resolveComponent("v-skeleton-loader");
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "video-wrapper",
        style: { "padding-top": __props.frameRate === "vertical" ? "177.78%" : "56.25%" }
      }, _attrs))} data-v-5bc27bf7><div class="video-content" data-v-5bc27bf7>`);
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_v_skeleton_loader, { style: { "width": "100%", "height": "100%" } }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div style="${ssrRenderStyle({ opacity: unref(loading) ? 0 : 1 })}" data-v-5bc27bf7><video playsinline controls data-v-5bc27bf7></video></div></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/VideoPlayer.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-5bc27bf7"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "UploadImage",
  __ssrInlineRender: true,
  props: {
    width: { type: String, default: "100%" },
    height: { type: String, default: "20rem" },
    iconUpload: { type: String, default: "mdi-folder-upload-outline" },
    textUpload: { type: String, default: "T\u1EA3i \u1EA3nh l\xEAn" },
    readonly: { type: Boolean, default: false }
  },
  emits: ["onSelectFile"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const file = ref();
    const base64 = ref("");
    const loading = ref(false);
    const onRemoveFile = () => {
      file.value = void 0;
      base64.value = "";
      emits("onSelectFile", { file: file.value, base64: base64.value });
    };
    const setValue = (value) => {
      base64.value = value;
    };
    __expose({ file, base64, setValue, hehe: "11" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_v_img = resolveComponent("v-img");
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_icon = resolveComponent("v-icon");
      const _component_v_progress_circular = resolveComponent("v-progress-circular");
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "relative",
        style: { "overflow": "hidden", "border": "1px solid rgb(197 197 197)", "border-radius": "5px" }
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      if (base64.value) {
        _push(`<div class="d-flex justify-center align-center relative" style="${ssrRenderStyle({ width: props.width, height: props.height })}">`);
        _push(ssrRenderComponent(_component_v_img, {
          src: base64.value,
          "lazy-src": base64.value,
          alt: "image-upload",
          class: "w-100 h-100",
          style: { "object-fit": "contain" }
        }, {
          placeholder: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_v_img, { src: "/images/image-default.svg" }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_v_img, { src: "/images/image-default.svg" })
              ];
            }
          }),
          _: 1
        }, _parent));
        if (!__props.readonly) {
          _push(ssrRenderComponent(_component_v_btn, {
            icon: "",
            size: "24",
            color: "black",
            style: { "position": "absolute" },
            class: "top-0 right-0 cursor-pointer"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_v_icon, {
                  size: "20",
                  onClick: onRemoveFile
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`mdi-close`);
                    } else {
                      return [
                        createTextVNode("mdi-close")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_v_icon, {
                    size: "20",
                    onClick: onRemoveFile
                  }, {
                    default: withCtx(() => [
                      createTextVNode("mdi-close")
                    ]),
                    _: 1
                  })
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<div class="d-flex justify-center align-center cursor-pointer relative" style="${ssrRenderStyle({ width: props.width, height: props.height })}">`);
        if (loading.value) {
          _push(ssrRenderComponent(_component_v_progress_circular, {
            indeterminate: "",
            size: "48",
            width: "2",
            class: "absolute"
          }, null, _parent));
        } else {
          _push(`<div class="d-flex flex-column ga-1 align-center">`);
          _push(ssrRenderComponent(_component_v_icon, {
            size: "33",
            color: "grey-darken-1"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(__props.iconUpload)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(__props.iconUpload), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<span>${ssrInterpolate(__props.textUpload)}</span></div>`);
        }
        _push(`<input type="file" accept="image/*" style="${ssrRenderStyle({ "top": "-2rem" })}" class="absolute right-0 left-0 bottom-0 cursor-pointer"></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UploadImage.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const router = useRouter$1();
    const localePath = useLocalePath();
    const { t } = useI18n();
    const { width } = useDevice();
    const { $socket } = useNuxtApp();
    const { onGetterUserData } = useAppStore();
    const { onGetterMasterData } = useMasterDataStore();
    const loading = ref("");
    const uploadImageRef = ref(null);
    const myTimeline = ref(null);
    const formData = reactive({
      title: `${t(
        "Video c\u1EE7a t\xF4i"
      )} ${(/* @__PURE__ */ new Date()).toLocaleTimeString()} ${(/* @__PURE__ */ new Date()).toLocaleDateString()}`,
      value: "",
      frameRate: "horizontal",
      modelVideo: "veo3_fast",
      videoMode: "movie",
      videoStyle: "general",
      videoDuration: "8",
      author: "",
      images: [],
      video: "",
      messages: [],
      account: {}
    });
    const productId = computed(
      () => route.params.id !== "create" ? route.params.id : null
    );
    const isError = computed(
      () => {
        var _a;
        return Boolean(
          productId.value && formData.messages.length && ((_a = formData.messages[formData.messages.length - 1]) == null ? void 0 : _a.color) === "error"
        );
      }
    );
    const videoModeOptions = computed(
      () => {
        var _a;
        return ((_a = onGetterMasterData.value["video-mode"]) == null ? void 0 : _a.map((x) => ({
          title: t(x.title),
          value: x.value
        }))) || [];
      }
    );
    const frameRateOptions = computed(
      () => {
        var _a;
        return ((_a = onGetterMasterData.value["frame-rate"]) == null ? void 0 : _a.map((x) => ({
          title: t(x.title),
          value: x.value
        }))) || [];
      }
    );
    const modelVideoOptions = computed(
      () => onGetterMasterData.value["model-video"] || []
    );
    const videoStyleOptions = computed(() => {
      var _a;
      const list = ((_a = onGetterMasterData.value["video-style"]) == null ? void 0 : _a.map((x) => ({
        title: t(x.title),
        value: x.value
      }))) || [];
      switch (formData.videoMode) {
        case "movie": {
          return list.filter(
            (x) => ["general", "monologue", "narration"].includes(x.value)
          );
        }
        case "storytelling": {
          return list.filter((x) => ["general"].includes(x.value));
        }
        case "short_form_video": {
          return list.filter(
            (x) => ["general", "satisfying", "asmr"].includes(x.value)
          );
        }
        case "my_subject": {
          return list.filter(
            (x) => ["general", "testimonial"].includes(x.value)
          );
        }
        default: {
          return list;
        }
      }
    });
    const videoDurationOptions = computed(() => {
      const allOptions = onGetterMasterData.value["video-duration"] || [];
      if (productId.value || formData.videoMode === "movie") return allOptions;
      if (["short_form_video", "my_subject"].includes(formData.videoMode)) {
        const shortVideoValues = ["1", "2", "3", "4", "5", "6", "7"];
        return allOptions.filter(
          (option) => shortVideoValues.includes(option.value)
        );
      } else if (["storytelling"].includes(formData.videoMode)) {
        const shortVideoValues = ["8", "12", "16", "20", "24"];
        return allOptions.filter(
          (option) => shortVideoValues.includes(option.value)
        );
      } else {
        const excludedValues = ["1", "2", "3", "4", "5", "6", "7"];
        return allOptions.filter(
          (option) => !excludedValues.includes(option.value)
        );
      }
    });
    const onFormatString = (value) => {
      if (!value) return;
      if (value.includes("T\u1ED5ng c\u1ED9ng c\xF3")) {
        const match = value.match(/\d+/);
        const amount = match ? match[0] : null;
        return t("T\u1ED5ng c\u1ED9ng c\xF3 {amount} c\u1EA3nh", { amount });
      } else if (value.includes("Ho\xE0n t\u1EA5t t\u1EA1o video cho")) {
        const match = value.match(/\d+/);
        const amount = match ? match[0] : null;
        return t("Ho\xE0n t\u1EA5t t\u1EA1o video cho {amount} c\u1EA3nh", { amount });
      } else if (value.includes("L\u1EA7n th\u1EED")) {
        const matches = value.match(/\d+\/\d+/g);
        if (matches && matches.length >= 2) {
          const [tryCount, sceneCount] = matches;
          return t(`L\u1EA7n th\u1EED {tryCount}: \u0111ang t\u1EA1o video cho c\u1EA3nh {sceneCount}...`, {
            tryCount,
            sceneCount
          });
        } else {
          return value;
        }
      } else if (value.includes("T\u1ED5ng th\u1EDDi gian ho\xE0n th\xE0nh")) {
        const [title, time] = value.split(":");
        return t(title) + `: ${time}`;
      } else {
        return t(value);
      }
    };
    const onGetProductDetail = async (loadingType = "") => {
      if (!productId.value) return;
      loading.value = loadingType;
      await productService.getDetailProduct({ _id: productId.value }).then((res) => {
        const data = res == null ? void 0 : res.data;
        if (data) {
          formData.title = data.title;
          formData.value = data.value;
          formData.frameRate = data.frameRate;
          formData.modelVideo = data.modelVideo;
          formData.videoMode = data.videoMode;
          formData.videoStyle = data.videoStyle;
          formData.videoDuration = data.videoDuration;
          formData.author = data.author;
          formData.images = [];
          formData.hasImage = Boolean(
            Array.isArray(data.images) && data.images.length
          );
          formData.video = data.video;
          formData.messages = data.messages || [];
          formData.account = data.account || {};
          setTimeout(() => {
            var _a;
            (_a = uploadImageRef.value) == null ? void 0 : _a.setValue(data.images[0]);
          }, 100);
        } else {
          router.replace(localePath("/video/create"));
        }
      }).catch(() => {
        router.replace(localePath("/video/create"));
      }).finally(() => {
        loading.value = "";
      });
    };
    const onSubmit = async () => {
      if (!formData.title || !formData.value) return;
      loading.value = "submit";
      if (productId.value) formData._id = productId.value;
      if (formData.videoMode !== "my_subject") {
        delete formData.images;
      }
      await productService.saveProduct(formData).then(async (res) => {
        var _a;
        const productId2 = (_a = res == null ? void 0 : res.data) == null ? void 0 : _a.productId;
        if (productId2) {
          router.replace(localePath(`/video/${productId2}`));
          onGetProductDetail();
        }
      }).catch(() => {
        loading.value = "";
      });
    };
    useSeo({
      title: t(productId.value ? "Chi ti\u1EBFt" : "T\u1EA1o video"),
      description: "N\u1EC1n t\u1EA3ng AI gi\xFAp b\u1EA1n t\u1EA1o video chuy\xEAn nghi\u1EC7p ch\u1EC9 trong v\xE0i ph\xFAt",
      image: "/images/page-detail.png"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_v_progress_circular = resolveComponent("v-progress-circular");
      const _component_v_row = resolveComponent("v-row");
      const _component_v_col = resolveComponent("v-col");
      const _component_VideoPlayer = __nuxt_component_0;
      const _component_v_icon = resolveComponent("v-icon");
      const _component_v_divider = resolveComponent("v-divider");
      const _component_UploadImage = _sfc_main$1;
      const _component_v_text_field = resolveComponent("v-text-field");
      const _component_v_select = resolveComponent("v-select");
      const _component_v_textarea = resolveComponent("v-textarea");
      const _component_v_timeline = resolveComponent("v-timeline");
      const _component_v_timeline_item = resolveComponent("v-timeline-item");
      if (Boolean(unref(loading) === "detail")) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "d-flex justify-center flex-column align-center ga-3 pt-10 pb-16" }, _attrs))} data-v-27bde93a>`);
        _push(ssrRenderComponent(_component_v_progress_circular, {
          width: "2",
          size: "40",
          color: "primary",
          indeterminate: ""
        }, null, _parent));
        _push(` ${ssrInterpolate(_ctx.$t("\u0110ang t\u1EA3i d\u1EEF li\u1EC7u..."))}</div>`);
      } else {
        _push(ssrRenderComponent(_component_v_row, _attrs, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
            if (_push2) {
              _push2(ssrRenderComponent(_component_v_col, {
                cols: "12",
                lg: "6",
                md: "6"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (unref(formData).video) {
                      _push3(`<div class="d-flex flex-column ga-3" data-v-27bde93a${_scopeId2}><div class="d-flex justify-center rem bg-black" style="${ssrRenderStyle({ "border-radius": "13px", "overflow": "hidden" })}" data-v-27bde93a${_scopeId2}>`);
                      _push3(ssrRenderComponent(_component_VideoPlayer, {
                        src: unref(formData).video,
                        frameRate: unref(formData).frameRate,
                        removeControls: ["settings"]
                      }, null, _parent3, _scopeId2));
                      _push3(`</div><div style="${ssrRenderStyle({ "border-radius": "6px" })}" class="${ssrRenderClass([{
                        disabled: !unref(formData).title || !unref(formData).value || unref(loading) === "download"
                      }, "cta-button w-100 justify-center"])}" data-v-27bde93a${_scopeId2}>`);
                      if (Boolean(unref(loading) === "download")) {
                        _push3(ssrRenderComponent(_component_v_progress_circular, {
                          width: "2",
                          size: "23",
                          color: "white",
                          indeterminate: ""
                        }, null, _parent3, _scopeId2));
                      } else {
                        _push3(ssrRenderComponent(_component_v_icon, { size: "27" }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`mdi-tray-arrow-down`);
                            } else {
                              return [
                                createTextVNode("mdi-tray-arrow-down")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent3, _scopeId2));
                      }
                      _push3(`<h3 data-v-27bde93a${_scopeId2}>${ssrInterpolate(_ctx.$t("T\u1EA3i video"))}</h3></div><h2 class="font-bold mt-2" data-v-27bde93a${_scopeId2}>${ssrInterpolate(unref(formData).title)}</h2>`);
                      _push3(ssrRenderComponent(_component_v_row, { dense: "" }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_component_v_col, { cols: "6" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                var _a2, _b2;
                                if (_push5) {
                                  _push5(`<div data-v-27bde93a${_scopeId4}><span class="font-bold" data-v-27bde93a${_scopeId4}>${ssrInterpolate(_ctx.$t("M\xF4 h\xECnh"))}:</span><br data-v-27bde93a${_scopeId4}> ${ssrInterpolate(((_a2 = unref(modelVideoOptions).find(
                                    (i) => i.value === unref(formData).modelVideo
                                  )) == null ? void 0 : _a2.title) || _ctx.$t("Ch\u01B0a c\xF3"))}</div>`);
                                } else {
                                  return [
                                    createVNode("div", null, [
                                      createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("M\xF4 h\xECnh")) + ":", 1),
                                      createVNode("br"),
                                      createTextVNode(" " + toDisplayString(((_b2 = unref(modelVideoOptions).find(
                                        (i) => i.value === unref(formData).modelVideo
                                      )) == null ? void 0 : _b2.title) || _ctx.$t("Ch\u01B0a c\xF3")), 1)
                                    ])
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(_component_v_col, { cols: "6" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                var _a2, _b2;
                                if (_push5) {
                                  _push5(`<div data-v-27bde93a${_scopeId4}><span class="font-bold" data-v-27bde93a${_scopeId4}>${ssrInterpolate(_ctx.$t("T\u1EF7 l\u1EC7 khung h\xECnh"))}:</span><br data-v-27bde93a${_scopeId4}> ${ssrInterpolate(((_a2 = unref(frameRateOptions).find(
                                    (i) => i.value === unref(formData).frameRate
                                  )) == null ? void 0 : _a2.title) || _ctx.$t("Ch\u01B0a c\xF3"))}</div>`);
                                } else {
                                  return [
                                    createVNode("div", null, [
                                      createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("T\u1EF7 l\u1EC7 khung h\xECnh")) + ":", 1),
                                      createVNode("br"),
                                      createTextVNode(" " + toDisplayString(((_b2 = unref(frameRateOptions).find(
                                        (i) => i.value === unref(formData).frameRate
                                      )) == null ? void 0 : _b2.title) || _ctx.$t("Ch\u01B0a c\xF3")), 1)
                                    ])
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(_component_v_col, { cols: "6" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                var _a2, _b2;
                                if (_push5) {
                                  _push5(`<div data-v-27bde93a${_scopeId4}><span class="font-bold" data-v-27bde93a${_scopeId4}>${ssrInterpolate(_ctx.$t("Ch\u1EBF \u0111\u1ED9"))}:</span><br data-v-27bde93a${_scopeId4}> ${ssrInterpolate(((_a2 = unref(videoModeOptions).find(
                                    (i) => i.value === unref(formData).videoMode
                                  )) == null ? void 0 : _a2.title) || _ctx.$t("Ch\u01B0a c\xF3"))}</div>`);
                                } else {
                                  return [
                                    createVNode("div", null, [
                                      createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("Ch\u1EBF \u0111\u1ED9")) + ":", 1),
                                      createVNode("br"),
                                      createTextVNode(" " + toDisplayString(((_b2 = unref(videoModeOptions).find(
                                        (i) => i.value === unref(formData).videoMode
                                      )) == null ? void 0 : _b2.title) || _ctx.$t("Ch\u01B0a c\xF3")), 1)
                                    ])
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(_component_v_col, { cols: "6" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                var _a2, _b2;
                                if (_push5) {
                                  _push5(`<div data-v-27bde93a${_scopeId4}><span class="font-bold" data-v-27bde93a${_scopeId4}>${ssrInterpolate(_ctx.$t("Phong c\xE1ch"))}:</span><br data-v-27bde93a${_scopeId4}> ${ssrInterpolate(((_a2 = unref(videoStyleOptions).find(
                                    (i) => i.value === unref(formData).videoStyle
                                  )) == null ? void 0 : _a2.title) || _ctx.$t("Ch\u01B0a c\xF3"))}</div>`);
                                } else {
                                  return [
                                    createVNode("div", null, [
                                      createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("Phong c\xE1ch")) + ":", 1),
                                      createVNode("br"),
                                      createTextVNode(" " + toDisplayString(((_b2 = unref(videoStyleOptions).find(
                                        (i) => i.value === unref(formData).videoStyle
                                      )) == null ? void 0 : _b2.title) || _ctx.$t("Ch\u01B0a c\xF3")), 1)
                                    ])
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(_component_v_col, { cols: "6" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                var _a2, _b2;
                                if (_push5) {
                                  _push5(`<div data-v-27bde93a${_scopeId4}><span class="font-bold" data-v-27bde93a${_scopeId4}>${ssrInterpolate(_ctx.$t("Th\u1EDDi l\u01B0\u1EE3ng"))}:</span><br data-v-27bde93a${_scopeId4}> ${ssrInterpolate(((_a2 = unref(videoDurationOptions).find(
                                    (i) => i.value === unref(formData).videoDuration
                                  )) == null ? void 0 : _a2.title) || _ctx.$t("Ch\u01B0a c\xF3"))}</div>`);
                                } else {
                                  return [
                                    createVNode("div", null, [
                                      createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("Th\u1EDDi l\u01B0\u1EE3ng")) + ":", 1),
                                      createVNode("br"),
                                      createTextVNode(" " + toDisplayString(((_b2 = unref(videoDurationOptions).find(
                                        (i) => i.value === unref(formData).videoDuration
                                      )) == null ? void 0 : _b2.title) || _ctx.$t("Ch\u01B0a c\xF3")), 1)
                                    ])
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(_component_v_col, { cols: "6" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                var _a2, _b2, _c2, _d2;
                                if (_push5) {
                                  _push5(`<div data-v-27bde93a${_scopeId4}><span class="font-bold" data-v-27bde93a${_scopeId4}>${ssrInterpolate(_ctx.$t("T\xE1c gi\u1EA3"))}:</span><br data-v-27bde93a${_scopeId4}> ${ssrInterpolate(((_b2 = (_a2 = unref(formData)) == null ? void 0 : _a2.account) == null ? void 0 : _b2.name) || _ctx.$t("Ch\u01B0a c\xF3"))}</div>`);
                                } else {
                                  return [
                                    createVNode("div", null, [
                                      createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("T\xE1c gi\u1EA3")) + ":", 1),
                                      createVNode("br"),
                                      createTextVNode(" " + toDisplayString(((_d2 = (_c2 = unref(formData)) == null ? void 0 : _c2.account) == null ? void 0 : _d2.name) || _ctx.$t("Ch\u01B0a c\xF3")), 1)
                                    ])
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(_component_v_divider, { class: "my-2" }, null, _parent4, _scopeId3));
                            if (unref(formData).hasImage) {
                              _push4(ssrRenderComponent(_component_v_col, { cols: "12" }, {
                                default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                  if (_push5) {
                                    _push5(`<div data-v-27bde93a${_scopeId4}><span class="font-bold" data-v-27bde93a${_scopeId4}>${ssrInterpolate(_ctx.$t("\u1EA2nh ch\u1EE7 th\u1EC3"))}:</span><br data-v-27bde93a${_scopeId4}>`);
                                    _push5(ssrRenderComponent(_component_UploadImage, {
                                      ref_key: "uploadImageRef",
                                      ref: uploadImageRef,
                                      readonly: true,
                                      height: unref(width) > 550 ? "10rem" : "8rem",
                                      iconUpload: "mdi-image-outline",
                                      textUpload: "Ch\u1ECDn \u1EA3nh",
                                      class: "mt-2 mb-1"
                                    }, null, _parent5, _scopeId4));
                                    _push5(`</div>`);
                                  } else {
                                    return [
                                      createVNode("div", null, [
                                        createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("\u1EA2nh ch\u1EE7 th\u1EC3")) + ":", 1),
                                        createVNode("br"),
                                        createVNode(_component_UploadImage, {
                                          ref_key: "uploadImageRef",
                                          ref: uploadImageRef,
                                          readonly: true,
                                          height: unref(width) > 550 ? "10rem" : "8rem",
                                          iconUpload: "mdi-image-outline",
                                          textUpload: "Ch\u1ECDn \u1EA3nh",
                                          class: "mt-2 mb-1"
                                        }, null, 8, ["height"])
                                      ])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent4, _scopeId3));
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(ssrRenderComponent(_component_v_col, { cols: "12" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                var _a2;
                                if (_push5) {
                                  _push5(`<div data-v-27bde93a${_scopeId4}><span class="font-bold" data-v-27bde93a${_scopeId4}>${ssrInterpolate(_ctx.$t("Prompt"))}:</span><br data-v-27bde93a${_scopeId4}><span style="${ssrRenderStyle({ "white-space": "pre-line" })}" data-v-27bde93a${_scopeId4}>${(_a2 = unref(formData).value) != null ? _a2 : ""}</span></div>`);
                                } else {
                                  return [
                                    createVNode("div", null, [
                                      createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("Prompt")) + ":", 1),
                                      createVNode("br"),
                                      createVNode("span", {
                                        innerHTML: unref(formData).value,
                                        style: { "white-space": "pre-line" }
                                      }, null, 8, ["innerHTML"])
                                    ])
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(_component_v_col, { cols: "6" }, {
                                default: withCtx(() => {
                                  var _a2;
                                  return [
                                    createVNode("div", null, [
                                      createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("M\xF4 h\xECnh")) + ":", 1),
                                      createVNode("br"),
                                      createTextVNode(" " + toDisplayString(((_a2 = unref(modelVideoOptions).find(
                                        (i) => i.value === unref(formData).modelVideo
                                      )) == null ? void 0 : _a2.title) || _ctx.$t("Ch\u01B0a c\xF3")), 1)
                                    ])
                                  ];
                                }),
                                _: 1
                              }),
                              createVNode(_component_v_col, { cols: "6" }, {
                                default: withCtx(() => {
                                  var _a2;
                                  return [
                                    createVNode("div", null, [
                                      createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("T\u1EF7 l\u1EC7 khung h\xECnh")) + ":", 1),
                                      createVNode("br"),
                                      createTextVNode(" " + toDisplayString(((_a2 = unref(frameRateOptions).find(
                                        (i) => i.value === unref(formData).frameRate
                                      )) == null ? void 0 : _a2.title) || _ctx.$t("Ch\u01B0a c\xF3")), 1)
                                    ])
                                  ];
                                }),
                                _: 1
                              }),
                              createVNode(_component_v_col, { cols: "6" }, {
                                default: withCtx(() => {
                                  var _a2;
                                  return [
                                    createVNode("div", null, [
                                      createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("Ch\u1EBF \u0111\u1ED9")) + ":", 1),
                                      createVNode("br"),
                                      createTextVNode(" " + toDisplayString(((_a2 = unref(videoModeOptions).find(
                                        (i) => i.value === unref(formData).videoMode
                                      )) == null ? void 0 : _a2.title) || _ctx.$t("Ch\u01B0a c\xF3")), 1)
                                    ])
                                  ];
                                }),
                                _: 1
                              }),
                              createVNode(_component_v_col, { cols: "6" }, {
                                default: withCtx(() => {
                                  var _a2;
                                  return [
                                    createVNode("div", null, [
                                      createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("Phong c\xE1ch")) + ":", 1),
                                      createVNode("br"),
                                      createTextVNode(" " + toDisplayString(((_a2 = unref(videoStyleOptions).find(
                                        (i) => i.value === unref(formData).videoStyle
                                      )) == null ? void 0 : _a2.title) || _ctx.$t("Ch\u01B0a c\xF3")), 1)
                                    ])
                                  ];
                                }),
                                _: 1
                              }),
                              createVNode(_component_v_col, { cols: "6" }, {
                                default: withCtx(() => {
                                  var _a2;
                                  return [
                                    createVNode("div", null, [
                                      createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("Th\u1EDDi l\u01B0\u1EE3ng")) + ":", 1),
                                      createVNode("br"),
                                      createTextVNode(" " + toDisplayString(((_a2 = unref(videoDurationOptions).find(
                                        (i) => i.value === unref(formData).videoDuration
                                      )) == null ? void 0 : _a2.title) || _ctx.$t("Ch\u01B0a c\xF3")), 1)
                                    ])
                                  ];
                                }),
                                _: 1
                              }),
                              createVNode(_component_v_col, { cols: "6" }, {
                                default: withCtx(() => {
                                  var _a2, _b2;
                                  return [
                                    createVNode("div", null, [
                                      createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("T\xE1c gi\u1EA3")) + ":", 1),
                                      createVNode("br"),
                                      createTextVNode(" " + toDisplayString(((_b2 = (_a2 = unref(formData)) == null ? void 0 : _a2.account) == null ? void 0 : _b2.name) || _ctx.$t("Ch\u01B0a c\xF3")), 1)
                                    ])
                                  ];
                                }),
                                _: 1
                              }),
                              createVNode(_component_v_divider, { class: "my-2" }),
                              unref(formData).hasImage ? (openBlock(), createBlock(_component_v_col, {
                                key: 0,
                                cols: "12"
                              }, {
                                default: withCtx(() => [
                                  createVNode("div", null, [
                                    createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("\u1EA2nh ch\u1EE7 th\u1EC3")) + ":", 1),
                                    createVNode("br"),
                                    createVNode(_component_UploadImage, {
                                      ref_key: "uploadImageRef",
                                      ref: uploadImageRef,
                                      readonly: true,
                                      height: unref(width) > 550 ? "10rem" : "8rem",
                                      iconUpload: "mdi-image-outline",
                                      textUpload: "Ch\u1ECDn \u1EA3nh",
                                      class: "mt-2 mb-1"
                                    }, null, 8, ["height"])
                                  ])
                                ]),
                                _: 1
                              })) : createCommentVNode("", true),
                              createVNode(_component_v_col, { cols: "12" }, {
                                default: withCtx(() => [
                                  createVNode("div", null, [
                                    createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("Prompt")) + ":", 1),
                                    createVNode("br"),
                                    createVNode("span", {
                                      innerHTML: unref(formData).value,
                                      style: { "white-space": "pre-line" }
                                    }, null, 8, ["innerHTML"])
                                  ])
                                ]),
                                _: 1
                              })
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(`</div>`);
                    } else {
                      _push3(`<div data-v-27bde93a${_scopeId2}>`);
                      _push3(ssrRenderComponent(_component_v_row, null, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2, _j2;
                          if (_push4) {
                            _push4(ssrRenderComponent(_component_v_col, { cols: "12" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(_component_v_text_field, {
                                    modelValue: unref(formData).title,
                                    "onUpdate:modelValue": ($event) => unref(formData).title = $event,
                                    "hide-details": "",
                                    class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                    variant: "outlined",
                                    label: _ctx.$t("Ti\xEAu \u0111\u1EC1") + " (\u2733)",
                                    readonly: Boolean(unref(productId))
                                  }, null, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(_component_v_text_field, {
                                      modelValue: unref(formData).title,
                                      "onUpdate:modelValue": ($event) => unref(formData).title = $event,
                                      "hide-details": "",
                                      class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                      variant: "outlined",
                                      label: _ctx.$t("Ti\xEAu \u0111\u1EC1") + " (\u2733)",
                                      readonly: Boolean(unref(productId))
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "label", "readonly", "class"])
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(_component_v_col, {
                              cols: "12",
                              lg: "6",
                              md: "6",
                              sm: "6"
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(_component_v_select, {
                                    modelValue: unref(formData).modelVideo,
                                    "onUpdate:modelValue": ($event) => unref(formData).modelVideo = $event,
                                    "hide-details": "",
                                    class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                    variant: "outlined",
                                    "item-title": "title",
                                    "item-value": "value",
                                    items: unref(modelVideoOptions),
                                    readonly: Boolean(unref(productId)),
                                    label: _ctx.$t("M\xF4 h\xECnh")
                                  }, null, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(_component_v_select, {
                                      modelValue: unref(formData).modelVideo,
                                      "onUpdate:modelValue": ($event) => unref(formData).modelVideo = $event,
                                      "hide-details": "",
                                      class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                      variant: "outlined",
                                      "item-title": "title",
                                      "item-value": "value",
                                      items: unref(modelVideoOptions),
                                      readonly: Boolean(unref(productId)),
                                      label: _ctx.$t("M\xF4 h\xECnh")
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "readonly", "class", "label"])
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(_component_v_col, {
                              cols: "12",
                              lg: "6",
                              md: "6",
                              sm: "6"
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(_component_v_select, {
                                    modelValue: unref(formData).frameRate,
                                    "onUpdate:modelValue": ($event) => unref(formData).frameRate = $event,
                                    "hide-details": "",
                                    class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                    variant: "outlined",
                                    "item-title": "title",
                                    "item-value": "value",
                                    items: unref(frameRateOptions),
                                    readonly: Boolean(unref(productId) || unref(formData).videoMode === "short_form_video"),
                                    label: _ctx.$t("T\u1EF7 l\u1EC7 khung h\xECnh")
                                  }, null, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(_component_v_select, {
                                      modelValue: unref(formData).frameRate,
                                      "onUpdate:modelValue": ($event) => unref(formData).frameRate = $event,
                                      "hide-details": "",
                                      class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                      variant: "outlined",
                                      "item-title": "title",
                                      "item-value": "value",
                                      items: unref(frameRateOptions),
                                      readonly: Boolean(unref(productId) || unref(formData).videoMode === "short_form_video"),
                                      label: _ctx.$t("T\u1EF7 l\u1EC7 khung h\xECnh")
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "readonly", "class", "label"])
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(_component_v_col, {
                              cols: "12",
                              lg: "6",
                              md: "6",
                              sm: "6"
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(_component_v_select, {
                                    modelValue: unref(formData).videoMode,
                                    "onUpdate:modelValue": [
                                      ($event) => unref(formData).videoMode = $event,
                                      () => {
                                        if (!unref(videoStyleOptions).some((x) => x.value === unref(formData).videoStyle)) {
                                          unref(formData).videoStyle = unref(videoStyleOptions)[0].value;
                                        }
                                        if (!unref(videoDurationOptions).some((x) => x.value === unref(formData).videoDuration)) {
                                          unref(formData).videoDuration = unref(videoDurationOptions)[0].value;
                                        }
                                        if (unref(formData).videoMode === "short_form_video") {
                                          unref(formData).frameRate = "vertical";
                                        }
                                      }
                                    ],
                                    "hide-details": "",
                                    class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                    variant: "outlined",
                                    "item-title": "title",
                                    "item-value": "value",
                                    items: unref(videoModeOptions),
                                    readonly: Boolean(unref(productId)),
                                    label: _ctx.$t("Ch\u1EBF \u0111\u1ED9")
                                  }, null, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(_component_v_select, {
                                      modelValue: unref(formData).videoMode,
                                      "onUpdate:modelValue": [
                                        ($event) => unref(formData).videoMode = $event,
                                        () => {
                                          if (!unref(videoStyleOptions).some((x) => x.value === unref(formData).videoStyle)) {
                                            unref(formData).videoStyle = unref(videoStyleOptions)[0].value;
                                          }
                                          if (!unref(videoDurationOptions).some((x) => x.value === unref(formData).videoDuration)) {
                                            unref(formData).videoDuration = unref(videoDurationOptions)[0].value;
                                          }
                                          if (unref(formData).videoMode === "short_form_video") {
                                            unref(formData).frameRate = "vertical";
                                          }
                                        }
                                      ],
                                      "hide-details": "",
                                      class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                      variant: "outlined",
                                      "item-title": "title",
                                      "item-value": "value",
                                      items: unref(videoModeOptions),
                                      readonly: Boolean(unref(productId)),
                                      label: _ctx.$t("Ch\u1EBF \u0111\u1ED9")
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "readonly", "class", "label"])
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(_component_v_col, {
                              cols: "12",
                              lg: "6",
                              md: "6",
                              sm: "6"
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(_component_v_select, {
                                    modelValue: unref(formData).videoStyle,
                                    "onUpdate:modelValue": ($event) => unref(formData).videoStyle = $event,
                                    "hide-details": "",
                                    class: ["w-100", {
                                      disabled: Boolean(unref(productId))
                                    }],
                                    variant: "outlined",
                                    "item-title": "title",
                                    "item-value": "value",
                                    items: unref(videoStyleOptions),
                                    readonly: Boolean(unref(productId)),
                                    label: _ctx.$t("Phong c\xE1ch")
                                  }, null, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(_component_v_select, {
                                      modelValue: unref(formData).videoStyle,
                                      "onUpdate:modelValue": ($event) => unref(formData).videoStyle = $event,
                                      "hide-details": "",
                                      class: ["w-100", {
                                        disabled: Boolean(unref(productId))
                                      }],
                                      variant: "outlined",
                                      "item-title": "title",
                                      "item-value": "value",
                                      items: unref(videoStyleOptions),
                                      readonly: Boolean(unref(productId)),
                                      label: _ctx.$t("Phong c\xE1ch")
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "readonly", "class", "label"])
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(_component_v_col, { cols: "12" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(_component_v_select, {
                                    modelValue: unref(formData).videoDuration,
                                    "onUpdate:modelValue": ($event) => unref(formData).videoDuration = $event,
                                    "hide-details": "",
                                    class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                    variant: "outlined",
                                    "item-title": "title",
                                    "item-value": "value",
                                    items: unref(videoDurationOptions),
                                    readonly: Boolean(unref(productId)),
                                    label: _ctx.$t("Th\u1EDDi l\u01B0\u1EE3ng")
                                  }, null, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(_component_v_select, {
                                      modelValue: unref(formData).videoDuration,
                                      "onUpdate:modelValue": ($event) => unref(formData).videoDuration = $event,
                                      "hide-details": "",
                                      class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                      variant: "outlined",
                                      "item-title": "title",
                                      "item-value": "value",
                                      items: unref(videoDurationOptions),
                                      readonly: Boolean(unref(productId)),
                                      label: _ctx.$t("Th\u1EDDi l\u01B0\u1EE3ng")
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "readonly", "class", "label"])
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                            if (unref(formData).videoMode === "my_subject") {
                              _push4(ssrRenderComponent(_component_v_col, { cols: "12" }, {
                                default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                  if (_push5) {
                                    _push5(ssrRenderComponent(_component_UploadImage, {
                                      ref_key: "uploadImageRef",
                                      ref: uploadImageRef,
                                      class: { disabled: Boolean(unref(productId)) },
                                      height: unref(width) > 550 ? "10rem" : "8rem",
                                      iconUpload: "mdi-image-outline",
                                      textUpload: "Ch\u1ECDn \u1EA3nh",
                                      onOnSelectFile: (event) => unref(formData).images = [event == null ? void 0 : event.file]
                                    }, {
                                      default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          if (Boolean(unref(loading) == "\u0110ang x\u1EED l\xFD th\xF4ng tin...")) {
                                            _push6(`<div class="scan-overlay" data-v-27bde93a${_scopeId5}><div class="scan-line" data-v-27bde93a${_scopeId5}></div></div>`);
                                          } else {
                                            _push6(`<!---->`);
                                          }
                                        } else {
                                          return [
                                            Boolean(unref(loading) == "\u0110ang x\u1EED l\xFD th\xF4ng tin...") ? (openBlock(), createBlock("div", {
                                              key: 0,
                                              class: "scan-overlay"
                                            }, [
                                              createVNode("div", { class: "scan-line" })
                                            ])) : createCommentVNode("", true)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent5, _scopeId4));
                                  } else {
                                    return [
                                      createVNode(_component_UploadImage, {
                                        ref_key: "uploadImageRef",
                                        ref: uploadImageRef,
                                        class: { disabled: Boolean(unref(productId)) },
                                        height: unref(width) > 550 ? "10rem" : "8rem",
                                        iconUpload: "mdi-image-outline",
                                        textUpload: "Ch\u1ECDn \u1EA3nh",
                                        onOnSelectFile: (event) => unref(formData).images = [event == null ? void 0 : event.file]
                                      }, {
                                        default: withCtx(() => [
                                          Boolean(unref(loading) == "\u0110ang x\u1EED l\xFD th\xF4ng tin...") ? (openBlock(), createBlock("div", {
                                            key: 0,
                                            class: "scan-overlay"
                                          }, [
                                            createVNode("div", { class: "scan-line" })
                                          ])) : createCommentVNode("", true)
                                        ]),
                                        _: 1
                                      }, 8, ["class", "height", "onOnSelectFile"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent4, _scopeId3));
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(ssrRenderComponent(_component_v_col, { cols: "12" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(_component_v_textarea, {
                                    modelValue: unref(formData).value,
                                    "onUpdate:modelValue": ($event) => unref(formData).value = $event,
                                    rows: "6",
                                    "auto-grow": "",
                                    "hide-details": "",
                                    class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                    variant: "outlined",
                                    label: "Prompt (\u2733)",
                                    readonly: Boolean(unref(productId))
                                  }, null, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(_component_v_textarea, {
                                      modelValue: unref(formData).value,
                                      "onUpdate:modelValue": ($event) => unref(formData).value = $event,
                                      rows: "6",
                                      "auto-grow": "",
                                      "hide-details": "",
                                      class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                      variant: "outlined",
                                      label: "Prompt (\u2733)",
                                      readonly: Boolean(unref(productId))
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "readonly", "class"])
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                            if ((!((_b2 = (_a2 = unref(formData)) == null ? void 0 : _a2.account) == null ? void 0 : _b2._id) || ((_c2 = unref(onGetterUserData)) == null ? void 0 : _c2._id) === ((_e2 = (_d2 = unref(formData)) == null ? void 0 : _d2.account) == null ? void 0 : _e2._id)) && (!unref(productId) || unref(isError))) {
                              _push4(ssrRenderComponent(_component_v_col, { cols: "12" }, {
                                default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                  var _a3, _b3;
                                  if (_push5) {
                                    _push5(`<div style="${ssrRenderStyle({ "border-radius": "6px" })}" class="${ssrRenderClass([{
                                      disabled: !unref(formData).title || !unref(formData).value || unref(loading) === "submit" || unref(formData).videoMode === "my_subject" && !((_a3 = unref(uploadImageRef)) == null ? void 0 : _a3.base64)
                                    }, "cta-button w-100 justify-center"])}" data-v-27bde93a${_scopeId4}>`);
                                    if (Boolean(unref(loading) === "submit")) {
                                      _push5(ssrRenderComponent(_component_v_progress_circular, {
                                        width: "2",
                                        size: "23",
                                        color: "white",
                                        indeterminate: ""
                                      }, null, _parent5, _scopeId4));
                                    } else {
                                      _push5(ssrRenderComponent(_component_v_icon, { size: "27" }, {
                                        default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                          if (_push6) {
                                            _push6(`mdi-image-filter-tilt-shift`);
                                          } else {
                                            return [
                                              createTextVNode("mdi-image-filter-tilt-shift")
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent5, _scopeId4));
                                    }
                                    _push5(`<h3 data-v-27bde93a${_scopeId4}>${ssrInterpolate(unref(isError) ? _ctx.$t("T\u1EA1o l\u1EA1i video") : _ctx.$t("T\u1EA1o video"))}</h3></div>`);
                                  } else {
                                    return [
                                      createVNode("div", {
                                        class: ["cta-button w-100 justify-center", {
                                          disabled: !unref(formData).title || !unref(formData).value || unref(loading) === "submit" || unref(formData).videoMode === "my_subject" && !((_b3 = unref(uploadImageRef)) == null ? void 0 : _b3.base64)
                                        }],
                                        style: { "border-radius": "6px" },
                                        onClick: ($event) => onSubmit()
                                      }, [
                                        Boolean(unref(loading) === "submit") ? (openBlock(), createBlock(_component_v_progress_circular, {
                                          key: 0,
                                          width: "2",
                                          size: "23",
                                          color: "white",
                                          indeterminate: ""
                                        })) : (openBlock(), createBlock(_component_v_icon, {
                                          key: 1,
                                          size: "27"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-image-filter-tilt-shift")
                                          ]),
                                          _: 1
                                        })),
                                        createVNode("h3", null, toDisplayString(unref(isError) ? _ctx.$t("T\u1EA1o l\u1EA1i video") : _ctx.$t("T\u1EA1o video")), 1)
                                      ], 10, ["onClick"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent4, _scopeId3));
                            } else {
                              _push4(`<!---->`);
                            }
                          } else {
                            return [
                              createVNode(_component_v_col, { cols: "12" }, {
                                default: withCtx(() => [
                                  createVNode(_component_v_text_field, {
                                    modelValue: unref(formData).title,
                                    "onUpdate:modelValue": ($event) => unref(formData).title = $event,
                                    "hide-details": "",
                                    class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                    variant: "outlined",
                                    label: _ctx.$t("Ti\xEAu \u0111\u1EC1") + " (\u2733)",
                                    readonly: Boolean(unref(productId))
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "label", "readonly", "class"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_v_col, {
                                cols: "12",
                                lg: "6",
                                md: "6",
                                sm: "6"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_v_select, {
                                    modelValue: unref(formData).modelVideo,
                                    "onUpdate:modelValue": ($event) => unref(formData).modelVideo = $event,
                                    "hide-details": "",
                                    class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                    variant: "outlined",
                                    "item-title": "title",
                                    "item-value": "value",
                                    items: unref(modelVideoOptions),
                                    readonly: Boolean(unref(productId)),
                                    label: _ctx.$t("M\xF4 h\xECnh")
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "readonly", "class", "label"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_v_col, {
                                cols: "12",
                                lg: "6",
                                md: "6",
                                sm: "6"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_v_select, {
                                    modelValue: unref(formData).frameRate,
                                    "onUpdate:modelValue": ($event) => unref(formData).frameRate = $event,
                                    "hide-details": "",
                                    class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                    variant: "outlined",
                                    "item-title": "title",
                                    "item-value": "value",
                                    items: unref(frameRateOptions),
                                    readonly: Boolean(unref(productId) || unref(formData).videoMode === "short_form_video"),
                                    label: _ctx.$t("T\u1EF7 l\u1EC7 khung h\xECnh")
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "readonly", "class", "label"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_v_col, {
                                cols: "12",
                                lg: "6",
                                md: "6",
                                sm: "6"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_v_select, {
                                    modelValue: unref(formData).videoMode,
                                    "onUpdate:modelValue": [
                                      ($event) => unref(formData).videoMode = $event,
                                      () => {
                                        if (!unref(videoStyleOptions).some((x) => x.value === unref(formData).videoStyle)) {
                                          unref(formData).videoStyle = unref(videoStyleOptions)[0].value;
                                        }
                                        if (!unref(videoDurationOptions).some((x) => x.value === unref(formData).videoDuration)) {
                                          unref(formData).videoDuration = unref(videoDurationOptions)[0].value;
                                        }
                                        if (unref(formData).videoMode === "short_form_video") {
                                          unref(formData).frameRate = "vertical";
                                        }
                                      }
                                    ],
                                    "hide-details": "",
                                    class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                    variant: "outlined",
                                    "item-title": "title",
                                    "item-value": "value",
                                    items: unref(videoModeOptions),
                                    readonly: Boolean(unref(productId)),
                                    label: _ctx.$t("Ch\u1EBF \u0111\u1ED9")
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "readonly", "class", "label"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_v_col, {
                                cols: "12",
                                lg: "6",
                                md: "6",
                                sm: "6"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_v_select, {
                                    modelValue: unref(formData).videoStyle,
                                    "onUpdate:modelValue": ($event) => unref(formData).videoStyle = $event,
                                    "hide-details": "",
                                    class: ["w-100", {
                                      disabled: Boolean(unref(productId))
                                    }],
                                    variant: "outlined",
                                    "item-title": "title",
                                    "item-value": "value",
                                    items: unref(videoStyleOptions),
                                    readonly: Boolean(unref(productId)),
                                    label: _ctx.$t("Phong c\xE1ch")
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "readonly", "class", "label"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_v_col, { cols: "12" }, {
                                default: withCtx(() => [
                                  createVNode(_component_v_select, {
                                    modelValue: unref(formData).videoDuration,
                                    "onUpdate:modelValue": ($event) => unref(formData).videoDuration = $event,
                                    "hide-details": "",
                                    class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                    variant: "outlined",
                                    "item-title": "title",
                                    "item-value": "value",
                                    items: unref(videoDurationOptions),
                                    readonly: Boolean(unref(productId)),
                                    label: _ctx.$t("Th\u1EDDi l\u01B0\u1EE3ng")
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "readonly", "class", "label"])
                                ]),
                                _: 1
                              }),
                              unref(formData).videoMode === "my_subject" ? (openBlock(), createBlock(_component_v_col, {
                                key: 0,
                                cols: "12"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_UploadImage, {
                                    ref_key: "uploadImageRef",
                                    ref: uploadImageRef,
                                    class: { disabled: Boolean(unref(productId)) },
                                    height: unref(width) > 550 ? "10rem" : "8rem",
                                    iconUpload: "mdi-image-outline",
                                    textUpload: "Ch\u1ECDn \u1EA3nh",
                                    onOnSelectFile: (event) => unref(formData).images = [event == null ? void 0 : event.file]
                                  }, {
                                    default: withCtx(() => [
                                      Boolean(unref(loading) == "\u0110ang x\u1EED l\xFD th\xF4ng tin...") ? (openBlock(), createBlock("div", {
                                        key: 0,
                                        class: "scan-overlay"
                                      }, [
                                        createVNode("div", { class: "scan-line" })
                                      ])) : createCommentVNode("", true)
                                    ]),
                                    _: 1
                                  }, 8, ["class", "height", "onOnSelectFile"])
                                ]),
                                _: 1
                              })) : createCommentVNode("", true),
                              createVNode(_component_v_col, { cols: "12" }, {
                                default: withCtx(() => [
                                  createVNode(_component_v_textarea, {
                                    modelValue: unref(formData).value,
                                    "onUpdate:modelValue": ($event) => unref(formData).value = $event,
                                    rows: "6",
                                    "auto-grow": "",
                                    "hide-details": "",
                                    class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                    variant: "outlined",
                                    label: "Prompt (\u2733)",
                                    readonly: Boolean(unref(productId))
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "readonly", "class"])
                                ]),
                                _: 1
                              }),
                              (!((_g2 = (_f2 = unref(formData)) == null ? void 0 : _f2.account) == null ? void 0 : _g2._id) || ((_h2 = unref(onGetterUserData)) == null ? void 0 : _h2._id) === ((_j2 = (_i2 = unref(formData)) == null ? void 0 : _i2.account) == null ? void 0 : _j2._id)) && (!unref(productId) || unref(isError)) ? (openBlock(), createBlock(_component_v_col, {
                                key: 1,
                                cols: "12"
                              }, {
                                default: withCtx(() => {
                                  var _a3;
                                  return [
                                    createVNode("div", {
                                      class: ["cta-button w-100 justify-center", {
                                        disabled: !unref(formData).title || !unref(formData).value || unref(loading) === "submit" || unref(formData).videoMode === "my_subject" && !((_a3 = unref(uploadImageRef)) == null ? void 0 : _a3.base64)
                                      }],
                                      style: { "border-radius": "6px" },
                                      onClick: ($event) => onSubmit()
                                    }, [
                                      Boolean(unref(loading) === "submit") ? (openBlock(), createBlock(_component_v_progress_circular, {
                                        key: 0,
                                        width: "2",
                                        size: "23",
                                        color: "white",
                                        indeterminate: ""
                                      })) : (openBlock(), createBlock(_component_v_icon, {
                                        key: 1,
                                        size: "27"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-image-filter-tilt-shift")
                                        ]),
                                        _: 1
                                      })),
                                      createVNode("h3", null, toDisplayString(unref(isError) ? _ctx.$t("T\u1EA1o l\u1EA1i video") : _ctx.$t("T\u1EA1o video")), 1)
                                    ], 10, ["onClick"])
                                  ];
                                }),
                                _: 1
                              })) : createCommentVNode("", true)
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(`</div>`);
                    }
                  } else {
                    return [
                      unref(formData).video ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "d-flex flex-column ga-3"
                      }, [
                        createVNode("div", {
                          class: "d-flex justify-center rem bg-black",
                          style: { "border-radius": "13px", "overflow": "hidden" }
                        }, [
                          createVNode(_component_VideoPlayer, {
                            src: unref(formData).video,
                            frameRate: unref(formData).frameRate,
                            removeControls: ["settings"]
                          }, null, 8, ["src", "frameRate"])
                        ]),
                        createVNode("div", {
                          class: ["cta-button w-100 justify-center", {
                            disabled: !unref(formData).title || !unref(formData).value || unref(loading) === "download"
                          }],
                          style: { "border-radius": "6px" },
                          onClick: ($event) => {
                            ("downloadVideo" in _ctx ? _ctx.downloadVideo : unref(downloadVideo))(unref(formData).video, unref(formData).title, (e) => {
                              loading.value = e;
                            });
                          }
                        }, [
                          Boolean(unref(loading) === "download") ? (openBlock(), createBlock(_component_v_progress_circular, {
                            key: 0,
                            width: "2",
                            size: "23",
                            color: "white",
                            indeterminate: ""
                          })) : (openBlock(), createBlock(_component_v_icon, {
                            key: 1,
                            size: "27"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("mdi-tray-arrow-down")
                            ]),
                            _: 1
                          })),
                          createVNode("h3", null, toDisplayString(_ctx.$t("T\u1EA3i video")), 1)
                        ], 10, ["onClick"]),
                        createVNode("h2", { class: "font-bold mt-2" }, toDisplayString(unref(formData).title), 1),
                        createVNode(_component_v_row, { dense: "" }, {
                          default: withCtx(() => [
                            createVNode(_component_v_col, { cols: "6" }, {
                              default: withCtx(() => {
                                var _a2;
                                return [
                                  createVNode("div", null, [
                                    createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("M\xF4 h\xECnh")) + ":", 1),
                                    createVNode("br"),
                                    createTextVNode(" " + toDisplayString(((_a2 = unref(modelVideoOptions).find(
                                      (i) => i.value === unref(formData).modelVideo
                                    )) == null ? void 0 : _a2.title) || _ctx.$t("Ch\u01B0a c\xF3")), 1)
                                  ])
                                ];
                              }),
                              _: 1
                            }),
                            createVNode(_component_v_col, { cols: "6" }, {
                              default: withCtx(() => {
                                var _a2;
                                return [
                                  createVNode("div", null, [
                                    createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("T\u1EF7 l\u1EC7 khung h\xECnh")) + ":", 1),
                                    createVNode("br"),
                                    createTextVNode(" " + toDisplayString(((_a2 = unref(frameRateOptions).find(
                                      (i) => i.value === unref(formData).frameRate
                                    )) == null ? void 0 : _a2.title) || _ctx.$t("Ch\u01B0a c\xF3")), 1)
                                  ])
                                ];
                              }),
                              _: 1
                            }),
                            createVNode(_component_v_col, { cols: "6" }, {
                              default: withCtx(() => {
                                var _a2;
                                return [
                                  createVNode("div", null, [
                                    createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("Ch\u1EBF \u0111\u1ED9")) + ":", 1),
                                    createVNode("br"),
                                    createTextVNode(" " + toDisplayString(((_a2 = unref(videoModeOptions).find(
                                      (i) => i.value === unref(formData).videoMode
                                    )) == null ? void 0 : _a2.title) || _ctx.$t("Ch\u01B0a c\xF3")), 1)
                                  ])
                                ];
                              }),
                              _: 1
                            }),
                            createVNode(_component_v_col, { cols: "6" }, {
                              default: withCtx(() => {
                                var _a2;
                                return [
                                  createVNode("div", null, [
                                    createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("Phong c\xE1ch")) + ":", 1),
                                    createVNode("br"),
                                    createTextVNode(" " + toDisplayString(((_a2 = unref(videoStyleOptions).find(
                                      (i) => i.value === unref(formData).videoStyle
                                    )) == null ? void 0 : _a2.title) || _ctx.$t("Ch\u01B0a c\xF3")), 1)
                                  ])
                                ];
                              }),
                              _: 1
                            }),
                            createVNode(_component_v_col, { cols: "6" }, {
                              default: withCtx(() => {
                                var _a2;
                                return [
                                  createVNode("div", null, [
                                    createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("Th\u1EDDi l\u01B0\u1EE3ng")) + ":", 1),
                                    createVNode("br"),
                                    createTextVNode(" " + toDisplayString(((_a2 = unref(videoDurationOptions).find(
                                      (i) => i.value === unref(formData).videoDuration
                                    )) == null ? void 0 : _a2.title) || _ctx.$t("Ch\u01B0a c\xF3")), 1)
                                  ])
                                ];
                              }),
                              _: 1
                            }),
                            createVNode(_component_v_col, { cols: "6" }, {
                              default: withCtx(() => {
                                var _a2, _b2;
                                return [
                                  createVNode("div", null, [
                                    createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("T\xE1c gi\u1EA3")) + ":", 1),
                                    createVNode("br"),
                                    createTextVNode(" " + toDisplayString(((_b2 = (_a2 = unref(formData)) == null ? void 0 : _a2.account) == null ? void 0 : _b2.name) || _ctx.$t("Ch\u01B0a c\xF3")), 1)
                                  ])
                                ];
                              }),
                              _: 1
                            }),
                            createVNode(_component_v_divider, { class: "my-2" }),
                            unref(formData).hasImage ? (openBlock(), createBlock(_component_v_col, {
                              key: 0,
                              cols: "12"
                            }, {
                              default: withCtx(() => [
                                createVNode("div", null, [
                                  createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("\u1EA2nh ch\u1EE7 th\u1EC3")) + ":", 1),
                                  createVNode("br"),
                                  createVNode(_component_UploadImage, {
                                    ref_key: "uploadImageRef",
                                    ref: uploadImageRef,
                                    readonly: true,
                                    height: unref(width) > 550 ? "10rem" : "8rem",
                                    iconUpload: "mdi-image-outline",
                                    textUpload: "Ch\u1ECDn \u1EA3nh",
                                    class: "mt-2 mb-1"
                                  }, null, 8, ["height"])
                                ])
                              ]),
                              _: 1
                            })) : createCommentVNode("", true),
                            createVNode(_component_v_col, { cols: "12" }, {
                              default: withCtx(() => [
                                createVNode("div", null, [
                                  createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("Prompt")) + ":", 1),
                                  createVNode("br"),
                                  createVNode("span", {
                                    innerHTML: unref(formData).value,
                                    style: { "white-space": "pre-line" }
                                  }, null, 8, ["innerHTML"])
                                ])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ])) : (openBlock(), createBlock("div", { key: 1 }, [
                        createVNode(_component_v_row, null, {
                          default: withCtx(() => {
                            var _a2, _b2, _c2, _d2, _e2;
                            return [
                              createVNode(_component_v_col, { cols: "12" }, {
                                default: withCtx(() => [
                                  createVNode(_component_v_text_field, {
                                    modelValue: unref(formData).title,
                                    "onUpdate:modelValue": ($event) => unref(formData).title = $event,
                                    "hide-details": "",
                                    class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                    variant: "outlined",
                                    label: _ctx.$t("Ti\xEAu \u0111\u1EC1") + " (\u2733)",
                                    readonly: Boolean(unref(productId))
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "label", "readonly", "class"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_v_col, {
                                cols: "12",
                                lg: "6",
                                md: "6",
                                sm: "6"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_v_select, {
                                    modelValue: unref(formData).modelVideo,
                                    "onUpdate:modelValue": ($event) => unref(formData).modelVideo = $event,
                                    "hide-details": "",
                                    class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                    variant: "outlined",
                                    "item-title": "title",
                                    "item-value": "value",
                                    items: unref(modelVideoOptions),
                                    readonly: Boolean(unref(productId)),
                                    label: _ctx.$t("M\xF4 h\xECnh")
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "readonly", "class", "label"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_v_col, {
                                cols: "12",
                                lg: "6",
                                md: "6",
                                sm: "6"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_v_select, {
                                    modelValue: unref(formData).frameRate,
                                    "onUpdate:modelValue": ($event) => unref(formData).frameRate = $event,
                                    "hide-details": "",
                                    class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                    variant: "outlined",
                                    "item-title": "title",
                                    "item-value": "value",
                                    items: unref(frameRateOptions),
                                    readonly: Boolean(unref(productId) || unref(formData).videoMode === "short_form_video"),
                                    label: _ctx.$t("T\u1EF7 l\u1EC7 khung h\xECnh")
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "readonly", "class", "label"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_v_col, {
                                cols: "12",
                                lg: "6",
                                md: "6",
                                sm: "6"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_v_select, {
                                    modelValue: unref(formData).videoMode,
                                    "onUpdate:modelValue": [
                                      ($event) => unref(formData).videoMode = $event,
                                      () => {
                                        if (!unref(videoStyleOptions).some((x) => x.value === unref(formData).videoStyle)) {
                                          unref(formData).videoStyle = unref(videoStyleOptions)[0].value;
                                        }
                                        if (!unref(videoDurationOptions).some((x) => x.value === unref(formData).videoDuration)) {
                                          unref(formData).videoDuration = unref(videoDurationOptions)[0].value;
                                        }
                                        if (unref(formData).videoMode === "short_form_video") {
                                          unref(formData).frameRate = "vertical";
                                        }
                                      }
                                    ],
                                    "hide-details": "",
                                    class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                    variant: "outlined",
                                    "item-title": "title",
                                    "item-value": "value",
                                    items: unref(videoModeOptions),
                                    readonly: Boolean(unref(productId)),
                                    label: _ctx.$t("Ch\u1EBF \u0111\u1ED9")
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "readonly", "class", "label"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_v_col, {
                                cols: "12",
                                lg: "6",
                                md: "6",
                                sm: "6"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_v_select, {
                                    modelValue: unref(formData).videoStyle,
                                    "onUpdate:modelValue": ($event) => unref(formData).videoStyle = $event,
                                    "hide-details": "",
                                    class: ["w-100", {
                                      disabled: Boolean(unref(productId))
                                    }],
                                    variant: "outlined",
                                    "item-title": "title",
                                    "item-value": "value",
                                    items: unref(videoStyleOptions),
                                    readonly: Boolean(unref(productId)),
                                    label: _ctx.$t("Phong c\xE1ch")
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "readonly", "class", "label"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_v_col, { cols: "12" }, {
                                default: withCtx(() => [
                                  createVNode(_component_v_select, {
                                    modelValue: unref(formData).videoDuration,
                                    "onUpdate:modelValue": ($event) => unref(formData).videoDuration = $event,
                                    "hide-details": "",
                                    class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                    variant: "outlined",
                                    "item-title": "title",
                                    "item-value": "value",
                                    items: unref(videoDurationOptions),
                                    readonly: Boolean(unref(productId)),
                                    label: _ctx.$t("Th\u1EDDi l\u01B0\u1EE3ng")
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "readonly", "class", "label"])
                                ]),
                                _: 1
                              }),
                              unref(formData).videoMode === "my_subject" ? (openBlock(), createBlock(_component_v_col, {
                                key: 0,
                                cols: "12"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_UploadImage, {
                                    ref_key: "uploadImageRef",
                                    ref: uploadImageRef,
                                    class: { disabled: Boolean(unref(productId)) },
                                    height: unref(width) > 550 ? "10rem" : "8rem",
                                    iconUpload: "mdi-image-outline",
                                    textUpload: "Ch\u1ECDn \u1EA3nh",
                                    onOnSelectFile: (event) => unref(formData).images = [event == null ? void 0 : event.file]
                                  }, {
                                    default: withCtx(() => [
                                      Boolean(unref(loading) == "\u0110ang x\u1EED l\xFD th\xF4ng tin...") ? (openBlock(), createBlock("div", {
                                        key: 0,
                                        class: "scan-overlay"
                                      }, [
                                        createVNode("div", { class: "scan-line" })
                                      ])) : createCommentVNode("", true)
                                    ]),
                                    _: 1
                                  }, 8, ["class", "height", "onOnSelectFile"])
                                ]),
                                _: 1
                              })) : createCommentVNode("", true),
                              createVNode(_component_v_col, { cols: "12" }, {
                                default: withCtx(() => [
                                  createVNode(_component_v_textarea, {
                                    modelValue: unref(formData).value,
                                    "onUpdate:modelValue": ($event) => unref(formData).value = $event,
                                    rows: "6",
                                    "auto-grow": "",
                                    "hide-details": "",
                                    class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                    variant: "outlined",
                                    label: "Prompt (\u2733)",
                                    readonly: Boolean(unref(productId))
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "readonly", "class"])
                                ]),
                                _: 1
                              }),
                              (!((_b2 = (_a2 = unref(formData)) == null ? void 0 : _a2.account) == null ? void 0 : _b2._id) || ((_c2 = unref(onGetterUserData)) == null ? void 0 : _c2._id) === ((_e2 = (_d2 = unref(formData)) == null ? void 0 : _d2.account) == null ? void 0 : _e2._id)) && (!unref(productId) || unref(isError)) ? (openBlock(), createBlock(_component_v_col, {
                                key: 1,
                                cols: "12"
                              }, {
                                default: withCtx(() => {
                                  var _a3;
                                  return [
                                    createVNode("div", {
                                      class: ["cta-button w-100 justify-center", {
                                        disabled: !unref(formData).title || !unref(formData).value || unref(loading) === "submit" || unref(formData).videoMode === "my_subject" && !((_a3 = unref(uploadImageRef)) == null ? void 0 : _a3.base64)
                                      }],
                                      style: { "border-radius": "6px" },
                                      onClick: ($event) => onSubmit()
                                    }, [
                                      Boolean(unref(loading) === "submit") ? (openBlock(), createBlock(_component_v_progress_circular, {
                                        key: 0,
                                        width: "2",
                                        size: "23",
                                        color: "white",
                                        indeterminate: ""
                                      })) : (openBlock(), createBlock(_component_v_icon, {
                                        key: 1,
                                        size: "27"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-image-filter-tilt-shift")
                                        ]),
                                        _: 1
                                      })),
                                      createVNode("h3", null, toDisplayString(unref(isError) ? _ctx.$t("T\u1EA1o l\u1EA1i video") : _ctx.$t("T\u1EA1o video")), 1)
                                    ], 10, ["onClick"])
                                  ];
                                }),
                                _: 1
                              })) : createCommentVNode("", true)
                            ];
                          }),
                          _: 1
                        })
                      ]))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_v_col, {
                lg: "6",
                md: "6",
                cols: "12"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div data-v-27bde93a${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_v_timeline, {
                      side: "end",
                      class: "mb-4",
                      direction: "vertical",
                      density: "compact"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<!--[-->`);
                          ssrRenderList(unref(productId) ? unref(formData).messages : [
                            {
                              title: "Ho\xE0n t\u1EA5t th\xF4ng tin",
                              dateTime: "",
                              color: "grey"
                            }
                          ], (item, index) => {
                            _push4(ssrRenderComponent(_component_v_timeline_item, {
                              "dot-color": item.color,
                              size: "small"
                            }, {
                              icon: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  if (item.color === "success") {
                                    _push5(ssrRenderComponent(_component_v_icon, {
                                      color: "white",
                                      size: "20"
                                    }, {
                                      default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          _push6(` mdi-check `);
                                        } else {
                                          return [
                                            createTextVNode(" mdi-check ")
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent5, _scopeId4));
                                  } else if (item.color === "primary") {
                                    _push5(ssrRenderComponent(_component_v_progress_circular, {
                                      color: "white",
                                      width: "2",
                                      size: "16",
                                      indeterminate: ""
                                    }, null, _parent5, _scopeId4));
                                  } else {
                                    _push5(`<!---->`);
                                  }
                                  if (item.color === "error") {
                                    _push5(ssrRenderComponent(_component_v_icon, {
                                      color: "white",
                                      size: "20"
                                    }, {
                                      default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          _push6(` mdi-close `);
                                        } else {
                                          return [
                                            createTextVNode(" mdi-close ")
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent5, _scopeId4));
                                  } else {
                                    _push5(`<!---->`);
                                  }
                                } else {
                                  return [
                                    item.color === "success" ? (openBlock(), createBlock(_component_v_icon, {
                                      key: 0,
                                      color: "white",
                                      size: "20"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" mdi-check ")
                                      ]),
                                      _: 1
                                    })) : item.color === "primary" ? (openBlock(), createBlock(_component_v_progress_circular, {
                                      key: 1,
                                      color: "white",
                                      width: "2",
                                      size: "16",
                                      indeterminate: ""
                                    })) : createCommentVNode("", true),
                                    item.color === "error" ? (openBlock(), createBlock(_component_v_icon, {
                                      key: 2,
                                      color: "white",
                                      size: "20"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" mdi-close ")
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true)
                                  ];
                                }
                              }),
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                var _a2, _b2;
                                if (_push5) {
                                  _push5(`<div data-v-27bde93a${_scopeId4}><div class="font-bold" data-v-27bde93a${_scopeId4}>${ssrInterpolate(onFormatString(item.title))}</div><div class="text-caption" data-v-27bde93a${_scopeId4}>${ssrInterpolate(item.dateTime)}</div>`);
                                  if (item.note) {
                                    _push5(`<div class="text-caption" data-v-27bde93a${_scopeId4}>${ssrInterpolate(onFormatString(item.note))}</div>`);
                                  } else {
                                    _push5(`<!---->`);
                                  }
                                  if (((_a2 = unref(onGetterUserData)) == null ? void 0 : _a2.role) === ("EnumAccountRole" in _ctx ? _ctx.EnumAccountRole : unref(EnumAccountRole)).ADMIN && item.errorMsg) {
                                    _push5(`<div class="text-caption" data-v-27bde93a${_scopeId4}>${ssrInterpolate(item.errorMsg)}</div>`);
                                  } else {
                                    _push5(`<!---->`);
                                  }
                                  _push5(`</div>`);
                                } else {
                                  return [
                                    createVNode("div", null, [
                                      createVNode("div", { class: "font-bold" }, toDisplayString(onFormatString(item.title)), 1),
                                      createVNode("div", { class: "text-caption" }, toDisplayString(item.dateTime), 1),
                                      item.note ? (openBlock(), createBlock("div", {
                                        key: 0,
                                        class: "text-caption"
                                      }, toDisplayString(onFormatString(item.note)), 1)) : createCommentVNode("", true),
                                      ((_b2 = unref(onGetterUserData)) == null ? void 0 : _b2.role) === ("EnumAccountRole" in _ctx ? _ctx.EnumAccountRole : unref(EnumAccountRole)).ADMIN && item.errorMsg ? (openBlock(), createBlock("div", {
                                        key: 1,
                                        class: "text-caption"
                                      }, toDisplayString(item.errorMsg), 1)) : createCommentVNode("", true)
                                    ])
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          });
                          _push4(`<!--]-->`);
                        } else {
                          return [
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(productId) ? unref(formData).messages : [
                              {
                                title: "Ho\xE0n t\u1EA5t th\xF4ng tin",
                                dateTime: "",
                                color: "grey"
                              }
                            ], (item, index) => {
                              return openBlock(), createBlock(_component_v_timeline_item, {
                                key: index,
                                "dot-color": item.color,
                                size: "small"
                              }, {
                                icon: withCtx(() => [
                                  item.color === "success" ? (openBlock(), createBlock(_component_v_icon, {
                                    key: 0,
                                    color: "white",
                                    size: "20"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" mdi-check ")
                                    ]),
                                    _: 1
                                  })) : item.color === "primary" ? (openBlock(), createBlock(_component_v_progress_circular, {
                                    key: 1,
                                    color: "white",
                                    width: "2",
                                    size: "16",
                                    indeterminate: ""
                                  })) : createCommentVNode("", true),
                                  item.color === "error" ? (openBlock(), createBlock(_component_v_icon, {
                                    key: 2,
                                    color: "white",
                                    size: "20"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" mdi-close ")
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true)
                                ]),
                                default: withCtx(() => {
                                  var _a2;
                                  return [
                                    createVNode("div", null, [
                                      createVNode("div", { class: "font-bold" }, toDisplayString(onFormatString(item.title)), 1),
                                      createVNode("div", { class: "text-caption" }, toDisplayString(item.dateTime), 1),
                                      item.note ? (openBlock(), createBlock("div", {
                                        key: 0,
                                        class: "text-caption"
                                      }, toDisplayString(onFormatString(item.note)), 1)) : createCommentVNode("", true),
                                      ((_a2 = unref(onGetterUserData)) == null ? void 0 : _a2.role) === ("EnumAccountRole" in _ctx ? _ctx.EnumAccountRole : unref(EnumAccountRole)).ADMIN && item.errorMsg ? (openBlock(), createBlock("div", {
                                        key: 1,
                                        class: "text-caption"
                                      }, toDisplayString(item.errorMsg), 1)) : createCommentVNode("", true)
                                    ])
                                  ];
                                }),
                                _: 2
                              }, 1032, ["dot-color"]);
                            }), 128))
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    return [
                      createVNode("div", {
                        ref_key: "myTimeline",
                        ref: myTimeline
                      }, [
                        createVNode(_component_v_timeline, {
                          side: "end",
                          class: "mb-4",
                          direction: "vertical",
                          density: "compact"
                        }, {
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(productId) ? unref(formData).messages : [
                              {
                                title: "Ho\xE0n t\u1EA5t th\xF4ng tin",
                                dateTime: "",
                                color: "grey"
                              }
                            ], (item, index) => {
                              return openBlock(), createBlock(_component_v_timeline_item, {
                                key: index,
                                "dot-color": item.color,
                                size: "small"
                              }, {
                                icon: withCtx(() => [
                                  item.color === "success" ? (openBlock(), createBlock(_component_v_icon, {
                                    key: 0,
                                    color: "white",
                                    size: "20"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" mdi-check ")
                                    ]),
                                    _: 1
                                  })) : item.color === "primary" ? (openBlock(), createBlock(_component_v_progress_circular, {
                                    key: 1,
                                    color: "white",
                                    width: "2",
                                    size: "16",
                                    indeterminate: ""
                                  })) : createCommentVNode("", true),
                                  item.color === "error" ? (openBlock(), createBlock(_component_v_icon, {
                                    key: 2,
                                    color: "white",
                                    size: "20"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" mdi-close ")
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true)
                                ]),
                                default: withCtx(() => {
                                  var _a2;
                                  return [
                                    createVNode("div", null, [
                                      createVNode("div", { class: "font-bold" }, toDisplayString(onFormatString(item.title)), 1),
                                      createVNode("div", { class: "text-caption" }, toDisplayString(item.dateTime), 1),
                                      item.note ? (openBlock(), createBlock("div", {
                                        key: 0,
                                        class: "text-caption"
                                      }, toDisplayString(onFormatString(item.note)), 1)) : createCommentVNode("", true),
                                      ((_a2 = unref(onGetterUserData)) == null ? void 0 : _a2.role) === ("EnumAccountRole" in _ctx ? _ctx.EnumAccountRole : unref(EnumAccountRole)).ADMIN && item.errorMsg ? (openBlock(), createBlock("div", {
                                        key: 1,
                                        class: "text-caption"
                                      }, toDisplayString(item.errorMsg), 1)) : createCommentVNode("", true)
                                    ])
                                  ];
                                }),
                                _: 2
                              }, 1032, ["dot-color"]);
                            }), 128))
                          ]),
                          _: 1
                        })
                      ], 512)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              if (((_b = (_a = unref(formData)) == null ? void 0 : _a.account) == null ? void 0 : _b._id) && ((_c = unref(onGetterUserData)) == null ? void 0 : _c._id) !== ((_e = (_d = unref(formData)) == null ? void 0 : _d.account) == null ? void 0 : _e._id)) {
                _push2(ssrRenderComponent(_component_v_col, {
                  cols: "12",
                  class: "mt-6"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    var _a2, _b2;
                    if (_push3) {
                      _push3(`<div class="w-100 text-center text-gray-600" data-v-27bde93a${_scopeId2}> \xA9 Th\u01B0\u1EDBc phim \u0111\u01B0\u1EE3c s\xE1ng t\u1EA1o b\u1EDFi <span class="font-bold text-black" data-v-27bde93a${_scopeId2}>${ssrInterpolate((_a2 = unref(formData).account) == null ? void 0 : _a2.name)}</span><br data-v-27bde93a${_scopeId2}> H\xE3y t\xF4n tr\u1ECDng t\xE1c gi\u1EA3 v\xE0 kh\xF4ng s\u1EED d\u1EE5ng cho c\xE1c m\u1EE5c \u0111\xEDch vi ph\u1EA1m. </div>`);
                    } else {
                      return [
                        createVNode("div", { class: "w-100 text-center text-gray-600" }, [
                          createTextVNode(" \xA9 Th\u01B0\u1EDBc phim \u0111\u01B0\u1EE3c s\xE1ng t\u1EA1o b\u1EDFi "),
                          createVNode("span", { class: "font-bold text-black" }, toDisplayString((_b2 = unref(formData).account) == null ? void 0 : _b2.name), 1),
                          createVNode("br"),
                          createTextVNode(" H\xE3y t\xF4n tr\u1ECDng t\xE1c gi\u1EA3 v\xE0 kh\xF4ng s\u1EED d\u1EE5ng cho c\xE1c m\u1EE5c \u0111\xEDch vi ph\u1EA1m. ")
                        ])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                createVNode(_component_v_col, {
                  cols: "12",
                  lg: "6",
                  md: "6"
                }, {
                  default: withCtx(() => [
                    unref(formData).video ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "d-flex flex-column ga-3"
                    }, [
                      createVNode("div", {
                        class: "d-flex justify-center rem bg-black",
                        style: { "border-radius": "13px", "overflow": "hidden" }
                      }, [
                        createVNode(_component_VideoPlayer, {
                          src: unref(formData).video,
                          frameRate: unref(formData).frameRate,
                          removeControls: ["settings"]
                        }, null, 8, ["src", "frameRate"])
                      ]),
                      createVNode("div", {
                        class: ["cta-button w-100 justify-center", {
                          disabled: !unref(formData).title || !unref(formData).value || unref(loading) === "download"
                        }],
                        style: { "border-radius": "6px" },
                        onClick: ($event) => {
                          ("downloadVideo" in _ctx ? _ctx.downloadVideo : unref(downloadVideo))(unref(formData).video, unref(formData).title, (e) => {
                            loading.value = e;
                          });
                        }
                      }, [
                        Boolean(unref(loading) === "download") ? (openBlock(), createBlock(_component_v_progress_circular, {
                          key: 0,
                          width: "2",
                          size: "23",
                          color: "white",
                          indeterminate: ""
                        })) : (openBlock(), createBlock(_component_v_icon, {
                          key: 1,
                          size: "27"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("mdi-tray-arrow-down")
                          ]),
                          _: 1
                        })),
                        createVNode("h3", null, toDisplayString(_ctx.$t("T\u1EA3i video")), 1)
                      ], 10, ["onClick"]),
                      createVNode("h2", { class: "font-bold mt-2" }, toDisplayString(unref(formData).title), 1),
                      createVNode(_component_v_row, { dense: "" }, {
                        default: withCtx(() => [
                          createVNode(_component_v_col, { cols: "6" }, {
                            default: withCtx(() => {
                              var _a2;
                              return [
                                createVNode("div", null, [
                                  createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("M\xF4 h\xECnh")) + ":", 1),
                                  createVNode("br"),
                                  createTextVNode(" " + toDisplayString(((_a2 = unref(modelVideoOptions).find(
                                    (i) => i.value === unref(formData).modelVideo
                                  )) == null ? void 0 : _a2.title) || _ctx.$t("Ch\u01B0a c\xF3")), 1)
                                ])
                              ];
                            }),
                            _: 1
                          }),
                          createVNode(_component_v_col, { cols: "6" }, {
                            default: withCtx(() => {
                              var _a2;
                              return [
                                createVNode("div", null, [
                                  createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("T\u1EF7 l\u1EC7 khung h\xECnh")) + ":", 1),
                                  createVNode("br"),
                                  createTextVNode(" " + toDisplayString(((_a2 = unref(frameRateOptions).find(
                                    (i) => i.value === unref(formData).frameRate
                                  )) == null ? void 0 : _a2.title) || _ctx.$t("Ch\u01B0a c\xF3")), 1)
                                ])
                              ];
                            }),
                            _: 1
                          }),
                          createVNode(_component_v_col, { cols: "6" }, {
                            default: withCtx(() => {
                              var _a2;
                              return [
                                createVNode("div", null, [
                                  createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("Ch\u1EBF \u0111\u1ED9")) + ":", 1),
                                  createVNode("br"),
                                  createTextVNode(" " + toDisplayString(((_a2 = unref(videoModeOptions).find(
                                    (i) => i.value === unref(formData).videoMode
                                  )) == null ? void 0 : _a2.title) || _ctx.$t("Ch\u01B0a c\xF3")), 1)
                                ])
                              ];
                            }),
                            _: 1
                          }),
                          createVNode(_component_v_col, { cols: "6" }, {
                            default: withCtx(() => {
                              var _a2;
                              return [
                                createVNode("div", null, [
                                  createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("Phong c\xE1ch")) + ":", 1),
                                  createVNode("br"),
                                  createTextVNode(" " + toDisplayString(((_a2 = unref(videoStyleOptions).find(
                                    (i) => i.value === unref(formData).videoStyle
                                  )) == null ? void 0 : _a2.title) || _ctx.$t("Ch\u01B0a c\xF3")), 1)
                                ])
                              ];
                            }),
                            _: 1
                          }),
                          createVNode(_component_v_col, { cols: "6" }, {
                            default: withCtx(() => {
                              var _a2;
                              return [
                                createVNode("div", null, [
                                  createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("Th\u1EDDi l\u01B0\u1EE3ng")) + ":", 1),
                                  createVNode("br"),
                                  createTextVNode(" " + toDisplayString(((_a2 = unref(videoDurationOptions).find(
                                    (i) => i.value === unref(formData).videoDuration
                                  )) == null ? void 0 : _a2.title) || _ctx.$t("Ch\u01B0a c\xF3")), 1)
                                ])
                              ];
                            }),
                            _: 1
                          }),
                          createVNode(_component_v_col, { cols: "6" }, {
                            default: withCtx(() => {
                              var _a2, _b2;
                              return [
                                createVNode("div", null, [
                                  createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("T\xE1c gi\u1EA3")) + ":", 1),
                                  createVNode("br"),
                                  createTextVNode(" " + toDisplayString(((_b2 = (_a2 = unref(formData)) == null ? void 0 : _a2.account) == null ? void 0 : _b2.name) || _ctx.$t("Ch\u01B0a c\xF3")), 1)
                                ])
                              ];
                            }),
                            _: 1
                          }),
                          createVNode(_component_v_divider, { class: "my-2" }),
                          unref(formData).hasImage ? (openBlock(), createBlock(_component_v_col, {
                            key: 0,
                            cols: "12"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", null, [
                                createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("\u1EA2nh ch\u1EE7 th\u1EC3")) + ":", 1),
                                createVNode("br"),
                                createVNode(_component_UploadImage, {
                                  ref_key: "uploadImageRef",
                                  ref: uploadImageRef,
                                  readonly: true,
                                  height: unref(width) > 550 ? "10rem" : "8rem",
                                  iconUpload: "mdi-image-outline",
                                  textUpload: "Ch\u1ECDn \u1EA3nh",
                                  class: "mt-2 mb-1"
                                }, null, 8, ["height"])
                              ])
                            ]),
                            _: 1
                          })) : createCommentVNode("", true),
                          createVNode(_component_v_col, { cols: "12" }, {
                            default: withCtx(() => [
                              createVNode("div", null, [
                                createVNode("span", { class: "font-bold" }, toDisplayString(_ctx.$t("Prompt")) + ":", 1),
                                createVNode("br"),
                                createVNode("span", {
                                  innerHTML: unref(formData).value,
                                  style: { "white-space": "pre-line" }
                                }, null, 8, ["innerHTML"])
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ])) : (openBlock(), createBlock("div", { key: 1 }, [
                      createVNode(_component_v_row, null, {
                        default: withCtx(() => {
                          var _a2, _b2, _c2, _d2, _e2;
                          return [
                            createVNode(_component_v_col, { cols: "12" }, {
                              default: withCtx(() => [
                                createVNode(_component_v_text_field, {
                                  modelValue: unref(formData).title,
                                  "onUpdate:modelValue": ($event) => unref(formData).title = $event,
                                  "hide-details": "",
                                  class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                  variant: "outlined",
                                  label: _ctx.$t("Ti\xEAu \u0111\u1EC1") + " (\u2733)",
                                  readonly: Boolean(unref(productId))
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "label", "readonly", "class"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_v_col, {
                              cols: "12",
                              lg: "6",
                              md: "6",
                              sm: "6"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_v_select, {
                                  modelValue: unref(formData).modelVideo,
                                  "onUpdate:modelValue": ($event) => unref(formData).modelVideo = $event,
                                  "hide-details": "",
                                  class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                  variant: "outlined",
                                  "item-title": "title",
                                  "item-value": "value",
                                  items: unref(modelVideoOptions),
                                  readonly: Boolean(unref(productId)),
                                  label: _ctx.$t("M\xF4 h\xECnh")
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "readonly", "class", "label"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_v_col, {
                              cols: "12",
                              lg: "6",
                              md: "6",
                              sm: "6"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_v_select, {
                                  modelValue: unref(formData).frameRate,
                                  "onUpdate:modelValue": ($event) => unref(formData).frameRate = $event,
                                  "hide-details": "",
                                  class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                  variant: "outlined",
                                  "item-title": "title",
                                  "item-value": "value",
                                  items: unref(frameRateOptions),
                                  readonly: Boolean(unref(productId) || unref(formData).videoMode === "short_form_video"),
                                  label: _ctx.$t("T\u1EF7 l\u1EC7 khung h\xECnh")
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "readonly", "class", "label"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_v_col, {
                              cols: "12",
                              lg: "6",
                              md: "6",
                              sm: "6"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_v_select, {
                                  modelValue: unref(formData).videoMode,
                                  "onUpdate:modelValue": [
                                    ($event) => unref(formData).videoMode = $event,
                                    () => {
                                      if (!unref(videoStyleOptions).some((x) => x.value === unref(formData).videoStyle)) {
                                        unref(formData).videoStyle = unref(videoStyleOptions)[0].value;
                                      }
                                      if (!unref(videoDurationOptions).some((x) => x.value === unref(formData).videoDuration)) {
                                        unref(formData).videoDuration = unref(videoDurationOptions)[0].value;
                                      }
                                      if (unref(formData).videoMode === "short_form_video") {
                                        unref(formData).frameRate = "vertical";
                                      }
                                    }
                                  ],
                                  "hide-details": "",
                                  class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                  variant: "outlined",
                                  "item-title": "title",
                                  "item-value": "value",
                                  items: unref(videoModeOptions),
                                  readonly: Boolean(unref(productId)),
                                  label: _ctx.$t("Ch\u1EBF \u0111\u1ED9")
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "readonly", "class", "label"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_v_col, {
                              cols: "12",
                              lg: "6",
                              md: "6",
                              sm: "6"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_v_select, {
                                  modelValue: unref(formData).videoStyle,
                                  "onUpdate:modelValue": ($event) => unref(formData).videoStyle = $event,
                                  "hide-details": "",
                                  class: ["w-100", {
                                    disabled: Boolean(unref(productId))
                                  }],
                                  variant: "outlined",
                                  "item-title": "title",
                                  "item-value": "value",
                                  items: unref(videoStyleOptions),
                                  readonly: Boolean(unref(productId)),
                                  label: _ctx.$t("Phong c\xE1ch")
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "readonly", "class", "label"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_v_col, { cols: "12" }, {
                              default: withCtx(() => [
                                createVNode(_component_v_select, {
                                  modelValue: unref(formData).videoDuration,
                                  "onUpdate:modelValue": ($event) => unref(formData).videoDuration = $event,
                                  "hide-details": "",
                                  class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                  variant: "outlined",
                                  "item-title": "title",
                                  "item-value": "value",
                                  items: unref(videoDurationOptions),
                                  readonly: Boolean(unref(productId)),
                                  label: _ctx.$t("Th\u1EDDi l\u01B0\u1EE3ng")
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "readonly", "class", "label"])
                              ]),
                              _: 1
                            }),
                            unref(formData).videoMode === "my_subject" ? (openBlock(), createBlock(_component_v_col, {
                              key: 0,
                              cols: "12"
                            }, {
                              default: withCtx(() => [
                                createVNode(_component_UploadImage, {
                                  ref_key: "uploadImageRef",
                                  ref: uploadImageRef,
                                  class: { disabled: Boolean(unref(productId)) },
                                  height: unref(width) > 550 ? "10rem" : "8rem",
                                  iconUpload: "mdi-image-outline",
                                  textUpload: "Ch\u1ECDn \u1EA3nh",
                                  onOnSelectFile: (event) => unref(formData).images = [event == null ? void 0 : event.file]
                                }, {
                                  default: withCtx(() => [
                                    Boolean(unref(loading) == "\u0110ang x\u1EED l\xFD th\xF4ng tin...") ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "scan-overlay"
                                    }, [
                                      createVNode("div", { class: "scan-line" })
                                    ])) : createCommentVNode("", true)
                                  ]),
                                  _: 1
                                }, 8, ["class", "height", "onOnSelectFile"])
                              ]),
                              _: 1
                            })) : createCommentVNode("", true),
                            createVNode(_component_v_col, { cols: "12" }, {
                              default: withCtx(() => [
                                createVNode(_component_v_textarea, {
                                  modelValue: unref(formData).value,
                                  "onUpdate:modelValue": ($event) => unref(formData).value = $event,
                                  rows: "6",
                                  "auto-grow": "",
                                  "hide-details": "",
                                  class: ["w-100", { disabled: Boolean(unref(productId)) }],
                                  variant: "outlined",
                                  label: "Prompt (\u2733)",
                                  readonly: Boolean(unref(productId))
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "readonly", "class"])
                              ]),
                              _: 1
                            }),
                            (!((_b2 = (_a2 = unref(formData)) == null ? void 0 : _a2.account) == null ? void 0 : _b2._id) || ((_c2 = unref(onGetterUserData)) == null ? void 0 : _c2._id) === ((_e2 = (_d2 = unref(formData)) == null ? void 0 : _d2.account) == null ? void 0 : _e2._id)) && (!unref(productId) || unref(isError)) ? (openBlock(), createBlock(_component_v_col, {
                              key: 1,
                              cols: "12"
                            }, {
                              default: withCtx(() => {
                                var _a3;
                                return [
                                  createVNode("div", {
                                    class: ["cta-button w-100 justify-center", {
                                      disabled: !unref(formData).title || !unref(formData).value || unref(loading) === "submit" || unref(formData).videoMode === "my_subject" && !((_a3 = unref(uploadImageRef)) == null ? void 0 : _a3.base64)
                                    }],
                                    style: { "border-radius": "6px" },
                                    onClick: ($event) => onSubmit()
                                  }, [
                                    Boolean(unref(loading) === "submit") ? (openBlock(), createBlock(_component_v_progress_circular, {
                                      key: 0,
                                      width: "2",
                                      size: "23",
                                      color: "white",
                                      indeterminate: ""
                                    })) : (openBlock(), createBlock(_component_v_icon, {
                                      key: 1,
                                      size: "27"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-image-filter-tilt-shift")
                                      ]),
                                      _: 1
                                    })),
                                    createVNode("h3", null, toDisplayString(unref(isError) ? _ctx.$t("T\u1EA1o l\u1EA1i video") : _ctx.$t("T\u1EA1o video")), 1)
                                  ], 10, ["onClick"])
                                ];
                              }),
                              _: 1
                            })) : createCommentVNode("", true)
                          ];
                        }),
                        _: 1
                      })
                    ]))
                  ]),
                  _: 1
                }),
                createVNode(_component_v_col, {
                  lg: "6",
                  md: "6",
                  cols: "12"
                }, {
                  default: withCtx(() => [
                    createVNode("div", {
                      ref_key: "myTimeline",
                      ref: myTimeline
                    }, [
                      createVNode(_component_v_timeline, {
                        side: "end",
                        class: "mb-4",
                        direction: "vertical",
                        density: "compact"
                      }, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(unref(productId) ? unref(formData).messages : [
                            {
                              title: "Ho\xE0n t\u1EA5t th\xF4ng tin",
                              dateTime: "",
                              color: "grey"
                            }
                          ], (item, index) => {
                            return openBlock(), createBlock(_component_v_timeline_item, {
                              key: index,
                              "dot-color": item.color,
                              size: "small"
                            }, {
                              icon: withCtx(() => [
                                item.color === "success" ? (openBlock(), createBlock(_component_v_icon, {
                                  key: 0,
                                  color: "white",
                                  size: "20"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" mdi-check ")
                                  ]),
                                  _: 1
                                })) : item.color === "primary" ? (openBlock(), createBlock(_component_v_progress_circular, {
                                  key: 1,
                                  color: "white",
                                  width: "2",
                                  size: "16",
                                  indeterminate: ""
                                })) : createCommentVNode("", true),
                                item.color === "error" ? (openBlock(), createBlock(_component_v_icon, {
                                  key: 2,
                                  color: "white",
                                  size: "20"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" mdi-close ")
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true)
                              ]),
                              default: withCtx(() => {
                                var _a2;
                                return [
                                  createVNode("div", null, [
                                    createVNode("div", { class: "font-bold" }, toDisplayString(onFormatString(item.title)), 1),
                                    createVNode("div", { class: "text-caption" }, toDisplayString(item.dateTime), 1),
                                    item.note ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "text-caption"
                                    }, toDisplayString(onFormatString(item.note)), 1)) : createCommentVNode("", true),
                                    ((_a2 = unref(onGetterUserData)) == null ? void 0 : _a2.role) === ("EnumAccountRole" in _ctx ? _ctx.EnumAccountRole : unref(EnumAccountRole)).ADMIN && item.errorMsg ? (openBlock(), createBlock("div", {
                                      key: 1,
                                      class: "text-caption"
                                    }, toDisplayString(item.errorMsg), 1)) : createCommentVNode("", true)
                                  ])
                                ];
                              }),
                              _: 2
                            }, 1032, ["dot-color"]);
                          }), 128))
                        ]),
                        _: 1
                      })
                    ], 512)
                  ]),
                  _: 1
                }),
                ((_g = (_f = unref(formData)) == null ? void 0 : _f.account) == null ? void 0 : _g._id) && ((_h = unref(onGetterUserData)) == null ? void 0 : _h._id) !== ((_j = (_i = unref(formData)) == null ? void 0 : _i.account) == null ? void 0 : _j._id) ? (openBlock(), createBlock(_component_v_col, {
                  key: 0,
                  cols: "12",
                  class: "mt-6"
                }, {
                  default: withCtx(() => {
                    var _a2;
                    return [
                      createVNode("div", { class: "w-100 text-center text-gray-600" }, [
                        createTextVNode(" \xA9 Th\u01B0\u1EDBc phim \u0111\u01B0\u1EE3c s\xE1ng t\u1EA1o b\u1EDFi "),
                        createVNode("span", { class: "font-bold text-black" }, toDisplayString((_a2 = unref(formData).account) == null ? void 0 : _a2.name), 1),
                        createVNode("br"),
                        createTextVNode(" H\xE3y t\xF4n tr\u1ECDng t\xE1c gi\u1EA3 v\xE0 kh\xF4ng s\u1EED d\u1EE5ng cho c\xE1c m\u1EE5c \u0111\xEDch vi ph\u1EA1m. ")
                      ])
                    ];
                  }),
                  _: 1
                })) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/video/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-27bde93a"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-CZsJJqg_.mjs.map
