import { defineComponent, ref, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';
import { e as useI18n } from './server.mjs';
import { a as useSeo } from './index-BKshJpnN.mjs';
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
import '@vueuse/core';
import './v3-CpJW8Kui.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "features",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const content = ref(`
  <div>
    <h1 class="text-h5 text-md-h4 font-weight-bold mb-1">T\xEDnh n\u0103ng N\u1ED5i b\u1EADt</h1>
    <p class="text-grey-darken-1 mb-6">Kh\xE1m ph\xE1 s\u1EE9c m\u1EA1nh c\u1EE7a AI trong vi\u1EC7c t\u1EA1o video v\u1EDBi TN Solve</p>
    
    <p class="mb-6">
      <b>Tool Video TN Solve</b> \u0111\u01B0\u1EE3c thi\u1EBFt k\u1EBF \u0111\u1EC3 bi\u1EBFn \xFD t\u01B0\u1EDFng c\u1EE7a b\u1EA1n th\xE0nh video chuy\xEAn nghi\u1EC7p m\u1ED9t c\xE1ch nhanh ch\xF3ng. D\u01B0\u1EDBi \u0111\xE2y l\xE0 c\xE1c t\xEDnh n\u0103ng ch\xEDnh b\u1EA1n c\xF3 th\u1EC3 s\u1EED d\u1EE5ng:
    </p>

    <div 
      class="pa-4 mb-8" 
      style="background-color: #E8F5E9; border-left: 5px solid #4CAF50; border-radius: 4px;"
    >
      <h4 class="text-h6 mb-2 text-green-darken-2 d-flex align-center">
        <i class="mdi mdi-star-circle-outline mr-3" style="font-size: 28px;"></i>
        T\u1EEB \xDD t\u01B0\u1EDFng \u0111\u1EBFn Video ch\u1EC9 trong v\xE0i c\xFA click
      </h4>
      <p class="mb-0">C\xF4ng c\u1EE5 c\u1EE7a ch\xFAng t\xF4i cung c\u1EA5p \u0111\u1EA7y \u0111\u1EE7 c\xE1c t\xF9y ch\u1ECDn t\u1EEB c\u01A1 b\u1EA3n \u0111\u1EBFn n\xE2ng cao \u0111\u1EC3 video c\u1EE7a b\u1EA1n tr\u1EDF n\xEAn \u0111\u1ED9c \u0111\xE1o v\xE0 ch\xEDnh x\xE1c theo \xFD mu\u1ED1n.</p>
    </div>

    <div id="features" class="section-anchor"></div>
    <h2 class="text-h5 font-weight-bold mt-10 mb-4">Danh s\xE1ch T\xEDnh n\u0103ng Ch\xEDnh</h2>
    
    <ul style="list-style: none; padding-left: 0;">
      
      <li class="d-flex align-start mb-5">
        <i class="mdi mdi-text-long text-primary mr-4" style="font-size: 30px; line-height: 1.5;"></i>
        <span>
          <strong class="text-body-1">T\u1EA1o video t\u1EEB V\u0103n b\u1EA3n (Prompt)</strong><br>
          Ch\u1EC9 c\u1EA7n nh\u1EADp m\xF4 t\u1EA3 chi ti\u1EBFt (prompt) v\u1EC1 k\u1ECBch b\u1EA3n, b\u1ED1i c\u1EA3nh, nh\xE2n v\u1EADt, h\xE0nh \u0111\u1ED9ng... AI c\u1EE7a ch\xFAng t\xF4i s\u1EBD ph\xE2n t\xEDch v\xE0 t\u1EA1o ra video d\u1EF1a tr\xEAn y\xEAu c\u1EA7u c\u1EE7a b\u1EA1n.
        </span>
      </li>
      
      <li class="d-flex align-start mb-5">
        <i class="mdi mdi-image-move text-primary mr-4" style="font-size: 30px; line-height: 1.5;"></i>
        <span>
          <strong class="text-body-1">T\u1EA1o video t\u1EEB \u1EA2nh (Ch\u1EBF \u0111\u1ED9 "Ch\u1EE7 th\u1EC3 c\u1EE7a t\xF4i")</strong><br>
          T\u1EA3i l\xEAn h\xECnh \u1EA3nh c\u1EE7a m\u1ED9t ch\u1EE7 th\u1EC3 (ng\u01B0\u1EDDi ho\u1EB7c v\u1EADt) v\xE0 AI s\u1EBD t\u1EA1o ra video v\u1EDBi ch\u1EE7 th\u1EC3 \u0111\xF3 \u0111ang th\u1EF1c hi\u1EC7n c\xE1c h\xE0nh \u0111\u1ED9ng theo m\xF4 t\u1EA3 trong prompt c\u1EE7a b\u1EA1n.
        </span>
      </li>

      <li class="d-flex align-start mb-5">
        <i class="mdi mdi-aspect-ratio text-primary mr-4" style="font-size: 30px; line-height: 1.5;"></i>
        <span>
          <strong class="text-body-1">T\xF9y ch\u1ECDn T\u1EF7 l\u1EC7 Khung h\xECnh</strong><br>
          D\u1EC5 d\xE0ng ch\u1ECDn l\u1EF1a gi\u1EEFa <b>Kh\u1ED5 ngang (16:9)</b> cho YouTube/PC v\xE0 <b>Kh\u1ED5 d\u1ECDc (9:16)</b> cho TikTok, Reels, v\xE0 Shorts.
        </span>
      </li>
      
      <li class="d-flex align-start mb-5">
        <i class="mdi mdi-movie-open-play-outline text-primary mr-4" style="font-size: 30px; line-height: 1.5;"></i>
        <span>
          <strong class="text-body-1">\u0110a d\u1EA1ng Ch\u1EBF \u0111\u1ED9 S\xE1ng t\u1EA1o</strong><br>
          Ch\u1ECDn t\u1EEB c\xE1c ch\u1EBF \u0111\u1ED9 nh\u01B0 "L\xE0m phim", "Video ng\u1EAFn", ho\u1EB7c "Ch\u1EE7 th\u1EC3 c\u1EE7a t\xF4i" \u0111\u1EC3 AI t\u1ED1i \u01B0u h\xF3a k\u1EBFt qu\u1EA3 \u0111\u1EA7u ra theo \u0111\xFAng m\u1EE5c \u0111\xEDch c\u1EE7a b\u1EA1n.
        </span>
      </li>

      <li class="d-flex align-start mb-5">
        <i class="mdi mdi-microphone-variant text-primary mr-4" style="font-size: 30px; line-height: 1.5;"></i>
        <span>
          <strong class="text-body-1">Nhi\u1EC1u Phong c\xE1ch Video</strong><br>
          H\u1ED7 tr\u1EE3 nhi\u1EC1u phong c\xE1ch \xE2m thanh v\xE0 n\u1ED9i dung nh\u01B0 "Thuy\u1EBFt minh", "\u0110\u1ED9c tho\u1EA1i", "\u0110\xE1nh gi\xE1 s\u1EA3n ph\u1EA9m", "ASMR", "Th\u1ECFa m\xE3n"... \u0111\u1EC3 video c\u1EE7a b\u1EA1n th\xEAm ph\u1EA7n l\xF4i cu\u1ED1n.
        </span>
      </li>

      <li class="d-flex align-start mb-5">
        <i class="mdi mdi-timer-outline text-primary mr-4" style="font-size: 30px; line-height: 1.5;"></i>
        <span>
          <strong class="text-body-1">T\xF9y ch\u1EC9nh Th\u1EDDi l\u01B0\u1EE3ng</strong><br>
          B\u1EA1n to\xE0n quy\u1EC1n quy\u1EBFt \u0111\u1ECBnh \u0111\u1ED9 d\xE0i ch\xEDnh x\xE1c cho video c\u1EE7a m\xECnh, t\u1EEB v\xE0i gi\xE2y (00:08) cho \u0111\u1EBFn v\xE0i ph\xFAt (01:04) ho\u1EB7c h\u01A1n.
        </span>
      </li>
      
      <li class="d-flex align-start mb-5">
        <i class="mdi mdi-brain text-primary mr-4" style="font-size: 30px; line-height: 1.5;"></i>
        <span>
          <strong class="text-body-1">L\u1EF1a ch\u1ECDn M\xF4 h\xECnh AI</strong><br>
          Ch\u1ECDn l\u1EF1a gi\u1EEFa c\xE1c m\xF4 h\xECnh AI kh\xE1c nhau (v\xED d\u1EE5: "Veo 3 - Fast") \u0111\u1EC3 c\xE2n b\u1EB1ng gi\u1EEFa t\u1ED1c \u0111\u1ED9 t\u1EA1o video v\xE0 ch\u1EA5t l\u01B0\u1EE3ng h\xECnh \u1EA3nh mong mu\u1ED1n.
        </span>
      </li>
    </ul>

    <div 
      class="pa-4 mt-6 mb-8" 
      style="border: 1px solid #4CAF50; background-color: #E8F5E9; border-radius: 4px;"
    >
      <p class="d-flex align-center text-green-darken-3" style="margin: 0; font-size: 1.1rem; line-height: 1.6;">
        <i class="mdi mdi-cloud-check-outline mr-3" style="font-size: 24px;"></i>
        <b>Pro-tip: Tool ch\u1EA1y ng\u1EA7m!</b>
      </p>
      <p class="text-green-darken-4 mb-0 mt-2">
        B\u1EA1n c\xF3 th\u1EC3 d\xF9ng tool tr\xEAn c\u1EA3 <b>\u0111i\u1EC7n tho\u1EA1i v\xE0 m\xE1y t\xEDnh</b>. Sau khi nh\u1EA5n "T\u1EA1o video", b\u1EA1n c\xF3 th\u1EC3 <b>t\u1EAFt website, t\u1EAFt wifi</b>. AI v\u1EABn ch\u1EA1y ng\u1EA7m tr\xEAn m\xE1y ch\u1EE7. Khi n\xE0o xong, b\u1EA1n ch\u1EC9 c\u1EA7n \u0111\u0103ng nh\u1EADp l\u1EA1i v\xE0 v\xE0o <b>"Th\u01B0 vi\u1EC7n c\u1EE7a t\xF4i"</b> \u0111\u1EC3 l\u1EA5y video.
      </p>
    </div>
    
    <div id="cta" class="section-anchor"></div>
    <h2 class="text-h5 font-weight-bold mt-10 mb-4">B\u1EA1n \u0111\xE3 s\u1EB5n s\xE0ng?</h2>
    <p class="mb-4">
      T\u1EA5t c\u1EA3 c\xE1c t\xEDnh n\u0103ng n\xE0y \u0111\u1EC1u c\xF3 trong g\xF3i 99.000 VN\u0110/th\xE1ng.
    </p>
    
    <a href="/" style="text-decoration: none;">
      <div 
        class="d-inline-flex align-center justify-center pa-3 px-6" 
        style="background-color: #29B6F6; color: white; border-radius: 8px; font-weight: 500;"
      >
        <i class="mdi mdi-creation mr-2" style="font-size: 20px;"></i>
        T\u1EA1o video ngay
      </div>
    </a>

    <style>
      .section-anchor {
        display: block;
        position: relative;
        top: -80px;
        visibility: hidden;
      }
    </style>
  </div>
`);
    useSeo({
      title: t("T\xEDnh n\u0103ng"),
      description: "N\u1EC1n t\u1EA3ng AI gi\xFAp b\u1EA1n t\u1EA1o video chuy\xEAn nghi\u1EC7p ch\u1EC9 trong v\xE0i ph\xFAt",
      image: "/images/page-home.png"
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(_attrs)}>${(_a = unref(content)) != null ? _a : ""}</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/features.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=features-CJuQelte.mjs.map
