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
  __name: "terms",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const content = ref(`
  <div>
    <h1 class="text-h5 text-md-h4 font-bold mb-1">Ch\xEDnh s\xE1ch & \u0110i\u1EC1u kho\u1EA3n</h1>
    <p class="text-grey-darken-1 mb-6">C\u1EADp nh\u1EADt l\u1EA7n cu\u1ED1i: [Ng\xE0y 5 th\xE1ng 11 n\u0103m 2025]</p>
    
    <p class="mb-6">
      Ch\xE0o m\u1EEBng b\u1EA1n \u0111\u1EBFn v\u1EDBi <b>Tool Video TN Solve</b>! C\u1EA3m \u01A1n b\u1EA1n \u0111\xE3 tin d\xF9ng. Khi b\u1EA1n chuy\u1EC3n kho\u1EA3n thanh to\xE1n v\xE0 s\u1EED d\u1EE5ng tool, b\u1EA1n \u0111\u1ED3ng \xFD v\u1EDBi c\xE1c quy \u0111\u1ECBnh \u0111\u01A1n gi\u1EA3n v\xE0 r\xF5 r\xE0ng d\u01B0\u1EDBi \u0111\xE2y.
    </p>

    <div id="tom-tat" class="section-anchor"></div>
    <div 
      class="pa-4 mb-8" 
      style="background-color: #E3F2FD; border-left: 5px solid #1E88E5; border-radius: 4px;"
    >
      <h4 class="text-h6 mb-2 text-primary d-flex align-center">
        <i class="mdi mdi-information-outline mr-3" style="font-size: 28px;"></i>
        T\xF3m t\u1EAFt nhanh (Nh\u1EEFng \u0111i\u1EC1u quan tr\u1ECDng nh\u1EA5t)
      </h4>
      <ul class="pl-10">
        <li><strong>Video c\u1EE7a b\u1EA1n l\xE0 c\u1EE7a b\u1EA1n:</strong> B\u1EA1n to\xE0n quy\u1EC1n s\u1EDF h\u1EEFu v\xE0 s\u1EED d\u1EE5ng video (k\u1EC3 c\u1EA3 m\u1EE5c \u0111\xEDch th\u01B0\u01A1ng m\u1EA1i).</li>
        <li><strong>Thanh to\xE1n th\u1EE7 c\xF4ng (99k/th\xE1ng):</strong> B\u1EA1n chuy\u1EC3n kho\u1EA3n tr\u1EF1c ti\u1EBFp, ch\xFAng t\xF4i k\xEDch ho\u1EA1t t\xE0i kho\u1EA3n theo s\u1ED1 th\xE1ng b\u1EA1n tr\u1EA3.</li>
        <li><strong>Gia h\u1EA1n:</strong> H\u1EBFt h\u1EA1n tool s\u1EBD t\u1EF1 kh\xF3a. B\u1EA1n c\u1EA7n li\xEAn h\u1EC7 l\u1EA1i ch\xFAng t\xF4i \u0111\u1EC3 gia h\u1EA1n.</li>
        <li><strong>B\u1EA3o m\u1EADt & Ch\u01A1i \u0111\u1EB9p:</strong> Ch\xFAng t\xF4i kh\xF4ng b\xE1n d\u1EEF li\u1EC7u c\u1EE7a b\u1EA1n v\xE0 mong b\u1EA1n kh\xF4ng d\xF9ng tool \u0111\u1EC3 l\xE0m vi\u1EC7c x\u1EA5u.</li>
      </ul>
    </div>

    <div id="thanh-toan" class="section-anchor"></div>
    <h2 class="text-h5 font-weight-bold mt-10 mb-4">1. \u0110\u0103ng k\xFD & Thanh to\xE1n (G\xF3i 99k/th\xE1ng)</h2>
    <p class="mb-4">M\xF4 h\xECnh c\u1EE7a ch\xFAng t\xF4i r\u1EA5t \u0111\u01A1n gi\u1EA3n v\xE0 d\u1EF1a tr\xEAn s\u1EF1 tin t\u01B0\u1EDFng:</p>
    
    <ul style="list-style: none; padding-left: 0;">
      <li class="d-flex align-start mb-4">
        <i class="mdi mdi-numeric-1-circle text-primary mr-4" style="font-size: 26px; line-height: 1.5;"></i>
        <span><strong>Li\xEAn h\u1EC7:</strong> B\u1EA1n li\xEAn h\u1EC7 v\u1EDBi ch\xFAng t\xF4i (qua Zalo/Fanpage) \u0111\u1EC3 nh\u1EADn th\xF4ng tin thanh to\xE1n.</span>
      </li>
      <li class="d-flex align-start mb-4">
        <i class="mdi mdi-numeric-2-circle text-primary mr-4" style="font-size: 26px; line-height: 1.5;"></i>
        <span><strong>Thanh to\xE1n:</strong> B\u1EA1n chuy\u1EC3n kho\u1EA3n tr\u1EF1c ti\u1EBFp 99.000 VN\u0110/th\xE1ng. (VD: 3 th\xE1ng l\xE0 297.000 VN\u0110).</span>
      </li>
      <li class="d-flex align-start mb-4">
        <i class="mdi mdi-numeric-3-circle text-primary mr-4" style="font-size: 26px; line-height: 1.5;"></i>
        <span><strong>K\xEDch ho\u1EA1t:</strong> Ch\xFAng t\xF4i s\u1EBD k\xEDch ho\u1EA1t g\xF3i thu\xEA cho t\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n ngay khi nh\u1EADn \u0111\u01B0\u1EE3c thanh to\xE1n.</span>
      </li>
      <li class="d-flex align-start mb-4">
        <i class="mdi mdi-numeric-4-circle text-primary mr-4" style="font-size: 26px; line-height: 1.5;"></i>
        <span><strong>H\u1EBFt h\u1EA1n:</strong> Khi h\u1EBFt th\u1EDDi gian, t\xE0i kho\u1EA3n s\u1EBD t\u1EF1 \u0111\u1ED9ng kh\xF4ng th\u1EC3 t\u1EA1o video m\u1EDBi.</span>
      </li>
      <li class="d-flex align-start mb-4">
        <i class="mdi mdi-numeric-5-circle text-primary mr-4" style="font-size: 26px; line-height: 1.5;"></i>
        <span><strong>Gia h\u1EA1n:</strong> B\u1EA1n ch\u1EC9 c\u1EA7n li\xEAn h\u1EC7 l\u1EA1i v\u1EDBi ch\xFAng t\xF4i v\xE0 thanh to\xE1n cho chu k\u1EF3 ti\u1EBFp theo.</span>
      </li>
    </ul>
    
    <div 
      class="pa-4 mt-6" 
      style="border: 1px solid #FB8C00; background-color: #FFF3E0; border-radius: 4px;"
    >
      <p class="d-flex align-center text-warning-darken-3" style="margin: 0;">
        <i class="mdi mdi-cash-remove mr-3" style="font-size: 24px;"></i>
        L\u01B0u \xFD v\u1EC1 Ho\xE0n ti\u1EC1n: V\xEC chi ph\xED m\xE1y ch\u1EE7 AI r\u1EA5t t\u1ED1n k\xE9m, ch\xFAng t\xF4i kh\xF4ng h\u1ED7 tr\u1EE3 ho\xE0n ti\u1EC1n sau khi t\xE0i kho\u1EA3n \u0111\xE3 \u0111\u01B0\u1EE3c k\xEDch ho\u1EA1t.
      </p>
    </div>


    <div id="quyen-so-huu" class="section-anchor"></div>
    <h2 class="text-h5 font-weight-bold mt-10 mb-4">2. Quy\u1EC1n S\u1EDF h\u1EEFu Video</h2>
    <p class="mb-4">
      <strong>N\u1ED9i dung c\u1EE7a b\u1EA1n:</strong> M\u1ECDi n\u1ED9i dung (v\u0103n b\u1EA3n, h\xECnh \u1EA3nh, v.v.) b\u1EA1n t\u1EA3i l\xEAn \u0111\u1EC1u l\xE0 c\u1EE7a b\u1EA1n.
    </p>
    <p class="mb-4">
      <strong>Video do AI t\u1EA1o ra:</strong> B\u1EA1n l\xE0 ch\u1EE7 s\u1EDF h\u1EEFu c\u1EE7a video cu\u1ED1i c\xF9ng. B\u1EA1n \u0111\u01B0\u1EE3c c\u1EA5p ph\xE9p \u0111\u1EA7y \u0111\u1EE7 (k\u1EC3 c\u1EA3 quy\u1EC1n th\u01B0\u01A1ng m\u1EA1i) \u0111\u1EC3 s\u1EED d\u1EE5ng, chia s\u1EBB, ho\u1EB7c b\xE1n c\xE1c video b\u1EA1n t\u1EA1o ra trong th\u1EDDi gian t\xE0i kho\u1EA3n c\xF2n h\u1EA1n.
    </p>

    <div id="bao-mat" class="section-anchor"></div>
    <h2 class="text-h5 font-weight-bold mt-10 mb-4">3. Ch\xEDnh s\xE1ch B\u1EA3o m\u1EADt</h2>
    <p class="mb-4">
      Ch\xFAng t\xF4i ch\u1EC9 thu th\u1EADp th\xF4ng tin t\xE0i kho\u1EA3n c\u01A1 b\u1EA3n (email) v\xE0 n\u1ED9i dung b\u1EA1n t\u1EA3i l\xEAn \u0111\u1EC3 AI x\u1EED l\xFD.
    </p>
    <p class="mb-4">
      <strong>Cam k\u1EBFt:</strong> Ch\xFAng t\xF4i <strong>KH\xD4NG</strong> b\xE1n ho\u1EB7c chia s\u1EBB th\xF4ng tin c\xE1 nh\xE2n c\u1EE7a b\u1EA1n cho b\u1EA5t k\u1EF3 b\xEAn th\u1EE9 ba n\xE0o. D\u1EEF li\u1EC7u c\u1EE7a b\u1EA1n ch\u1EC9 d\xF9ng \u0111\u1EC3 duy tr\xEC d\u1ECBch v\u1EE5.
    </p>

    <div id="quy-tac" class="section-anchor"></div>
    <h2 class="text-h5 font-weight-bold mt-10 mb-4">4. Quy t\u1EAFc S\u1EED d\u1EE5ng</h2>
    <p class="mb-4">Vui l\xF2ng kh\xF4ng s\u1EED d\u1EE5ng d\u1ECBch v\u1EE5 c\u1EE7a ch\xFAng t\xF4i \u0111\u1EC3 t\u1EA1o ra n\u1ED9i dung:</p>
    <ul class="pl-6 mb-4">
      <li>Vi ph\u1EA1m ph\xE1p lu\u1EADt Vi\u1EC7t Nam.</li>
      <li>C\xF3 t\xEDnh ch\u1EA5t th\xF9 \u0111\u1ECBch, b\u1EA1o l\u1EF1c, ho\u1EB7c ph\xE2n bi\u1EC7t \u0111\u1ED1i x\u1EED.</li>
      <li>Vi ph\u1EA1m b\u1EA3n quy\u1EC1n ho\u1EB7c th\u01B0\u01A1ng hi\u1EC7u c\u1EE7a ng\u01B0\u1EDDi kh\xE1c.</li>
      <li>T\u1EA1o th\xF4ng tin sai l\u1EC7ch (deepfake) c\xF3 m\u1EE5c \u0111\xEDch g\xE2y h\u1EA1i.</li>
    </ul>
    <p>Ch\xFAng t\xF4i c\xF3 quy\u1EC1n kh\xF3a t\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n (k\u1EC3 c\u1EA3 khi c\xF2n h\u1EA1n) n\u1EBFu ph\xE1t hi\u1EC7n vi ph\u1EA1m nghi\xEAm tr\u1ECDng.</p>

    <div id="lien-he" class="section-anchor"></div>
    <h2 class="text-h5 font-weight-bold mt-10 mb-4">5. Li\xEAn h\u1EC7 \u0111\u1EC3 \u0110\u0103ng k\xFD & H\u1ED7 tr\u1EE3</h2>
    <p class="mb-4">\u0110\xE2y l\xE0 k\xEAnh ch\xEDnh th\u1EE9c \u0111\u1EC3 b\u1EA1n \u0111\u0103ng k\xFD, gia h\u1EA1n v\xE0 nh\u1EADn h\u1ED7 tr\u1EE3 khi c\u1EA7n:</p>
    
    <div class="mt-4" style="border: 1px solid #e0e0e0; border-radius: 4px;">
      <ul style="list-style: none; padding: 8px 0;">
        <li class="pa-4 d-flex align-center">
          <i class="mdi mdi-zalo mr-4" style="font-size: 28px; color: #0068FF;"></i>
          <div>
            <strong class="text-body-1">K\xEAnh \u01B0u ti\xEAn (Zalo)</strong><br>
            <span class="text-grey-darken-1">034 302 7232</span>
          </div>
        </li>
        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 0 16px;">
        <li class="pa-4 d-flex align-center">
          <i class="mdi mdi-facebook mr-4" style="font-size: 28px; color: #1877F2;"></i>
          <div>
            <strong class="text-body-1">Fanpage Facebook</strong><br>
            <span class="text-grey-darken-1">Tien Code Web</span>
          </div>
        </li>
        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 0 16px;">
        <li class="pa-4 d-flex align-center">
          <i class="mdi mdi-email-outline mr-4" style="font-size: 28px;"></i>
          <div>
            <strong class="text-body-1">Email H\u1ED7 tr\u1EE3</strong><br>
            <span class="text-grey-darken-1">maithanhtien2n@gmail.com</span>
          </div>
        </li>
      </ul>
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
        top: -80px; /* \u0110i\u1EC1u ch\u1EC9nh b\u1EB1ng chi\u1EC1u cao header c\u1EE7a b\u1EA1n */
        visibility: hidden;
      }
    </style>
  </div>
`);
    useSeo({
      title: t("Ch\xEDnh s\xE1ch"),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/terms.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=terms-DIYt9ALW.mjs.map
