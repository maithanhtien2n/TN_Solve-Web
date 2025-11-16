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
  __name: "tutorial",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const content = ref(`
  <div>
    <h1 class="text-h5 text-md-h4 font-weight-bold mb-1">H\u01B0\u1EDBng d\u1EABn s\u1EED d\u1EE5ng Tool</h1>
    <p class="text-grey-darken-1 mb-6">T\u1EEB A-Z: C\xE1ch l\xE0m ch\u1EE7 tool v\xE0 b\xED quy\u1EBFt vi\u1EBFt prompt hi\u1EC7u qu\u1EA3</p>
    
    <p class="mb-6">
      Ch\xE0o m\u1EEBng b\u1EA1n \u0111\u1EBFn v\u1EDBi <b>Tool Video TN Solve</b>! Trang n\xE0y s\u1EBD h\u01B0\u1EDBng d\u1EABn b\u1EA1n t\u1EEBng b\u01B0\u1EDBc \u0111\u1EC3 t\u1EA1o ra video AI \u0111\u1EA7u ti\xEAn v\xE0 chia s\u1EBB c\xE1c m\u1EB9o vi\u1EBFt prompt \u0111\u1EC3 video \u0111\u1EA1t ch\u1EA5t l\u01B0\u1EE3ng cao nh\u1EA5t.
    </p>

    <div 
      class="pa-4 mb-8" 
      style="background-color: #E3F2FD; border-left: 5px solid #1E88E5; border-radius: 4px;"
    >
      <h4 class="text-h6 mb-2 text-primary d-flex align-center">
        <i class="mdi mdi-rocket-launch-outline mr-3" style="font-size: 28px;"></i>
        Quy tr\xECnh 3 b\u01B0\u1EDBc \u0111\u01A1n gi\u1EA3n
      </h4>
      <p class="mb-0"><b>1. C\xE0i \u0111\u1EB7t:</b> Ch\u1ECDn c\xE1c th\xF4ng s\u1ED1 cho video (K\xEDch th\u01B0\u1EDBc, Ch\u1EBF \u0111\u1ED9...).<br>
                       <b>2. Ra l\u1EC7nh:</b> Vi\u1EBFt m\xF4 t\u1EA3 (prompt) th\u1EADt chi ti\u1EBFt cho AI.<br>
                       <b>3. Ho\xE0n t\u1EA5t:</b> Nh\u1EA5n "T\u1EA1o video" v\xE0 ch\u1EDD nh\u1EADn k\u1EBFt qu\u1EA3.</p>
    </div>

    <div id="cac-buoc" class="section-anchor"></div>
    <h2 class="text-h5 font-weight-bold mt-10 mb-4">1. H\u01B0\u1EDBng d\u1EABn t\u1EEBng b\u01B0\u1EDBc tr\xEAn Form</h2>
    <p class="mb-4">\u0110\xE2y l\xE0 gi\u1EA3i th\xEDch cho t\u1EEBng tr\u01B0\u1EDDng th\xF4ng tin b\u1EA1n th\u1EA5y tr\xEAn trang "T\u1EA1o video":</p>
    
    <ul style="list-style: none; padding-left: 0;">
      <li class="d-flex align-start mb-4">
        <i class="mdi mdi-numeric-1-circle text-primary mr-4" style="font-size: 26px; line-height: 1.5;"></i>
        <span><strong>Ti\xEAu \u0111\u1EC1 (*):</strong> \u0110\u1EB7t t\xEAn \u0111\u1EC3 b\u1EA1n d\u1EC5 d\xE0ng qu\u1EA3n l\xFD video trong "Th\u01B0 vi\u1EC7n".</span>
      </li>
      
      <li class="d-flex align-start mb-4">
        <i class="mdi mdi-numeric-2-circle text-primary mr-4" style="font-size: 26px; line-height: 1.5;"></i>
        <span><strong>C\xE0i \u0111\u1EB7t c\u01A1 b\u1EA3n (M\xF4 h\xECnh, T\u1EF7 l\u1EC7, Th\u1EDDi l\u01B0\u1EE3ng):</strong>
          <ul class="pl-5 mt-2">
            <li><b>M\xF4 h\xECnh:</b> "Veo 3 - Fast" l\xE0 l\u1EF1a ch\u1ECDn c\xE2n b\u1EB1ng, cho t\u1ED1c \u0111\u1ED9 nhanh.</li>
            <li><b>T\u1EF7 l\u1EC7:</b> 16:9 (video ngang) ho\u1EB7c 9:16 (video d\u1ECDc). <b>L\u01B0u \xFD:</b> T\u1EF7 l\u1EC7 9:16 l\xE0 b\u1EAFt bu\u1ED9c cho "Ch\u1EBF \u0111\u1ED9 Video ng\u1EAFn".</li>
            <li><b>Th\u1EDDi l\u01B0\u1EE3ng:</b> Ch\u1ECDn m\u1ED1c th\u1EDDi gian b\u1EA1n mu\u1ED1n (v\xED d\u1EE5 "00:24" cho 24 gi\xE2y). Tool h\u1ED7 tr\u1EE3 t\u1EEB 8 gi\xE2y \u0111\u1EBFn 10 ph\xFAt 08 gi\xE2y theo c\xE1c m\u1ED1c c\xF3 s\u1EB5n.</li>
          </ul>
        </span>
      </li>
      
      <li class="d-flex align-start mb-4">
        <i class="mdi mdi-numeric-3-circle text-primary mr-4" style="font-size: 26px; line-height: 1.5;"></i>
        <span>
          <strong>Ch\u1ECDn Ch\u1EBF \u0111\u1ED9 (Quan tr\u1ECDng):</strong>
          <ul class="pl-5 mt-2">
            <li>Ch\u1ECDn <b>"L\xE0m phim"</b> n\u1EBFu b\u1EA1n c\xF3 k\u1ECBch b\u1EA3n, c\u1ED1t truy\u1EC7n (l\xE0m phim ho\u1EA1t h\xECnh r\u1EA5t t\u1ED1t). B\u1EA1n c\xF3 th\u1EC3 ch\u1ECDn t\u1EF7 l\u1EC7 16:9 ho\u1EB7c 9:16.</li>
            <li>Ch\u1ECDn <b>"Video ng\u1EAFn"</b> n\u1EBFu b\u1EA1n mu\u1ED1n video viral, ASMR. <b>(Ch\u1EBF \u0111\u1ED9 n\xE0y s\u1EBD t\u1EF1 \u0111\u1ED9ng kh\xF3a T\u1EF7 l\u1EC7 khung h\xECnh v\u1EC1 9:16).</b></li>
            <li>Ch\u1ECDn <b>"Ch\u1EE7 th\u1EC3 c\u1EE7a t\xF4i"</b> n\u1EBFu b\u1EA1n mu\u1ED1n video n\xF3i v\u1EC1 1 s\u1EA3n ph\u1EA9m/nh\xE2n v\u1EADt. (<b>L\u01B0u \xFD:</b> Ph\u1EA3i t\u1EA3i \u1EA3nh c\u1EE7a ch\u1EE7 th\u1EC3 l\xEAn). B\u1EA1n c\xF3 th\u1EC3 ch\u1ECDn t\u1EF7 l\u1EC7 16:9 ho\u1EB7c 9:16.</li>
          </ul>
        </span>
      </li>

      <li class="d-flex align-start mb-4">
        <i class="mdi mdi-numeric-4-circle text-primary mr-4" style="font-size: 26px; line-height: 1.5;"></i>
        <span><strong>Ch\u1ECDn Phong c\xE1ch:</strong>
          <ul class="pl-5 mt-2">
            <li>\u0110\u1EC3 <b>"M\u1EB7c \u0111\u1ECBnh"</b> n\u1EBFu b\u1EA1n mu\u1ED1n AI t\u1EF1 quy\u1EBFt \u0111\u1ECBnh d\u1EF1a tr\xEAn prompt.</li>
            <li>Ch\u1ECDn <b>"\u0110\xE1nh gi\xE1"</b> n\u1EBFu l\xE0m video review, b\xE1n h\xE0ng.</li>
            <li>Ch\u1ECDn <b>"\u0110\u1ED9c tho\u1EA1i"</b> n\u1EBFu mu\u1ED1n nh\xE2n v\u1EADt trong video t\u1EF1 n\xF3i chuy\u1EC7n.</li>
            <li>Ch\u1ECDn <b>"ASMR / Th\u1ECFa m\xE3n"</b> (th\u01B0\u1EDDng d\xF9ng v\u1EDBi "Ch\u1EBF \u0111\u1ED9 Video ng\u1EAFn").</li>
          </ul>
        </span>
      </li>
      
      <li class="d-flex align-start mb-4">
        <i class="mdi mdi-numeric-5-circle text-primary mr-4" style="font-size: 26px; line-height: 1.5;"></i>
        <span><strong>Vi\u1EBFt Prompt (*):</strong> \u0110\xE2y l\xE0 b\u01B0\u1EDBc quan tr\u1ECDng nh\u1EA5t. H\xE3y xem c\xE1c m\u1EB9o v\xE0 video v\xED d\u1EE5 \u1EDF m\u1EE5c 2.</span>
      </li>

      <li class="d-flex align-start mb-4">
        <i class="mdi mdi-numeric-6-circle text-primary mr-4" style="font-size: 26px; line-height: 1.5;"></i>
        <span><strong>Ho\xE0n t\u1EA5t:</strong> Nh\u1EA5n n\xFAt <b>"T\u1EA1o video"</b>. Video s\u1EBD \u0111\u01B0\u1EE3c x\u1EED l\xFD v\xE0 s\u1EDBm c\xF3 m\u1EB7t trong "Th\u01B0 vi\u1EC7n c\u1EE7a t\xF4i".</span>
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
    
    <div id="prompt" class="section-anchor"></div>
    <h2 class="text-h5 font-weight-bold mt-10 mb-4">2. B\xED quy\u1EBFt Vi\u1EBFt Prompt (K\xE8m Video V\xED d\u1EE5)</h2>
    <p class="mb-4">Prompt (l\u1EDDi nh\u1EAFc) l\xE0 m\u1EC7nh l\u1EC7nh c\u1EE7a b\u1EA1n cho AI. Prompt c\xE0ng chi ti\u1EBFt, video c\xE0ng \u0111\xFAng \xFD b\u1EA1n. AI c\u1EE7a ch\xFAng t\xF4i hi\u1EC3u t\u1ED1t nh\u1EA5t c\xE1c prompt m\xF4 t\u1EA3 theo c\u1EA5u tr\xFAc:</p>
    
    <div 
      class="pa-4 mt-6 mb-8" 
      style="border: 1px solid #FB8C00; background-color: #FFF3E0; border-radius: 4px;"
    >
      <p class="d-flex align-center text-warning-darken-3" style="margin: 0; font-size: 1.1rem; line-height: 1.6;">
        <i class="mdi mdi-lightbulb-on-outline mr-3" style="font-size: 24px;"></i>
        <b>M\u1EB9o V\xE0ng:</b> <i>"B\u1ED1i c\u1EA3nh + Ch\u1EE7 th\u1EC3 + H\xE0nh \u0111\u1ED9ng + C\u1EA3m x\xFAc/Phong c\xE1ch"</i>
      </p>
    </div>

    <div class="mt-4 pa-4" style="border: 1px solid #e0e0e0; border-radius: 4px;">
      <h4 class="text-h6 mb-3">V\xED d\u1EE5 1: Ch\u1EBF \u0111\u1ED9 "Video ng\u1EAFn" (Th\u1ECFa m\xE3n)</h4>
      <p class="mb-3"><b>C\xE0i \u0111\u1EB7t:</b> <i>Ch\u1EBF \u0111\u1ED9 (Video ng\u1EAFn), T\u1EF7 l\u1EC7 (<b>T\u1EF1 \u0111\u1ED9ng 9:16</b>), Phong c\xE1ch (Th\u1ECFa m\xE3n), Th\u1EDDi l\u01B0\u1EE3ng (00:16)</i></p>
      <div class="pa-3 mb-4" style="background-color: #f5f5f5; border-radius: 4px; font-family: 'Courier New', monospace;">
        <b>PROMPT:</b> "C\u1EADn c\u1EA3nh, quay t\u1EEB tr\xEAn xu\u1ED1ng, m\u1ED9t con dao s\u1EAFc \u0111ang c\u1EAFt m\u1ED9t kh\u1ED1i x\xE0 ph\xF2ng m\xE0u c\u1EA7u v\u1ED3ng th\xE0nh t\u1EEBng l\xE1t m\u1ECFng. C\xE1c l\xE1t x\xE0 ph\xF2ng r\u01A1i xu\u1ED1ng. \xC2m thanh x\u1EAFt x\xE0 ph\xF2ng ch\xE2n th\u1EF1c, th\u1ECFa m\xE3n, gi\xF2n tan."
      </div>
      
      <video controls style="max-height: 640px; width: auto; max-width: 100%; display: block; margin: 0 auto; border-radius: 8px;">
        <source src="/videos/video-ngan-test.mp4" type="video/mp4">
        Tr\xECnh duy\u1EC7t c\u1EE7a b\u1EA1n kh\xF4ng h\u1ED7 tr\u1EE3 video.
      </video>
      <p class="text-center text-caption text-grey-darken-1 mt-2"><em>(V\xED d\u1EE5 v\u1EC1 ch\u1EBF \u0111\u1ED9 "Video ng\u1EAFn")</em></p>
    </div>

    <div class="mt-8 pa-4" style="border: 1px solid #e0e0e0; border-radius: 4px;">
      <h4 class="text-h6 mb-3">V\xED d\u1EE5 2: Ch\u1EBF \u0111\u1ED9 "L\xE0m phim" (Ho\u1EA1t h\xECnh)</h4>
      <p class="mb-3"><b>C\xE0i \u0111\u1EB7t:</b> <i>T\u1EF7 l\u1EC7 (16:9), Ch\u1EBF \u0111\u1ED9 (L\xE0m phim), Phong c\xE1ch (M\u1EB7c \u0111\u1ECBnh), Th\u1EDDi l\u01B0\u1EE3ng (00:48)</i></p>
      <div class="pa-3 mb-4" style="background-color: #f5f5f5; border-radius: 4px; font-family: 'Courier New', monospace;">
        <b>PROMPT:</b> "Phong c\xE1ch ho\u1EA1t h\xECnh 3D Pixar. C\u1EA3nh 1: M\u1ED9t ch\xFA m\xE8o l\xF4ng cam, m\u1EADp m\u1EA1p, \u0111eo k\xEDnh r\xE2m, \u0111ang ch\u01A1i \u0111\xE0n guitar \u0111i\u1EC7n tr\xEAn s\xE2n kh\u1EA5u r\u1EF1c r\u1EE1 \xE1nh \u0111\xE8n. C\u1EA3nh 2: Quay c\u1EADn m\u1EB7t ch\xFA m\xE8o \u0111ang h\xE1t say s\u01B0a. C\u1EA3nh 3: \u0110\xE1m \u0111\xF4ng kh\xE1n gi\u1EA3 (l\xE0 nh\u1EEFng con ch\xF3) \u1EDF d\u01B0\u1EDBi \u0111ang h\xF2 reo, v\u1EABy tay."
      </div>
      
      <video controls style="max-height: 640px; width: auto; max-width: 100%; display: block; margin: 0 auto; border-radius: 8px;">
        <source src="/videos/video-lam-phim-test.mp4" type="video/mp4">
        Tr\xECnh duy\u1EC7t c\u1EE7a b\u1EA1n kh\xF4ng h\u1ED7 tr\u1EE3 video.
      </video>
      <p class="text-center text-caption text-grey-darken-1 mt-2"><em>(V\xED d\u1EE5 v\u1EC1 ch\u1EBF \u0111\u1ED9 "L\xE0m phim")</em></p>
    </div>
    
    <div class="mt-8 pa-4" style="border: 1px solid #e0e0e0; border-radius: 4px;">
      <h4 class="text-h6 mb-3">V\xED d\u1EE5 3: Ch\u1EBF \u0111\u1ED9 "Ch\u1EE7 th\u1EC3 c\u1EE7a t\xF4i" (Review s\u1EA3n ph\u1EA9m)</h4>
      <p class="mb-3"><b>C\xE0i \u0111\u1EB7t:</b> <i>T\u1EF7 l\u1EC7 (9:16), Ch\u1EBF \u0111\u1ED9 (Ch\u1EE7 th\u1EC3 c\u1EE7a t\xF4i), Phong c\xE1ch (\u0110\xE1nh gi\xE1), Th\u1EDDi l\u01B0\u1EE3ng (00:32)</i><br>
      <b>\u1EA2nh t\u1EA3i l\xEAn:</b> <i>(\u1EA2nh ch\u1EE5p chai serum X)</i></p>
      <div class="pa-3 mb-4" style="background-color: #f5f5f5; border-radius: 4px; font-family: 'Courier New', monospace;">
        <b>PROMPT:</b> "Video qu\u1EA3ng c\xE1o s\u1EA3n ph\u1EA9m serum X. M\u1EDF \u0111\u1EA7u quay c\u1EADn c\u1EA3nh chai serum xoay tr\xF2n, \xE1nh s\xE1ng chi\u1EBFu l\u1EA5p l\xE1nh. Gi\u1ECDng thuy\u1EBFt minh n\u1EEF chuy\xEAn nghi\u1EC7p: 'B\u1EA1n m\u1EC7t m\u1ECFi v\xEC th\xE2m m\u1EE5n? \u0110\xE3 c\xF3 serum X, chi\u1EBFt xu\u1EA5t 100% thi\xEAn nhi\xEAn, gi\u1EA3m th\xE2m m\u1EE5n ch\u1EC9 sau 7 ng\xE0y.' Hi\u1EC7n text 'Gi\u1EA3m gi\xE1 50%' l\xEAn m\xE0n h\xECnh. Gi\u1ECDng n\xF3i ti\u1EBFp: 'Gi\xE1 g\u1ED1c 500k nay ch\u1EC9 c\xF2n 200k. Mua ngay!'"
      </div>
      
      <video controls style="max-height: 640px; width: auto; max-width: 100%; display: block; margin: 0 auto; border-radius: 8px;">
        <source src="/videos/video-chu-the-cua-toi-test.mp4" type="video/mp4">
        Tr\xECnh duy\u1EC7t c\u1EE7a b\u1EA1n kh\xF4ng h\u1ED7 tr\u1EE3 video.
      </video>
      <p class="text-center text-caption text-grey-darken-1 mt-2"><em>(V\xED d\u1EE5 v\u1EC1 ch\u1EBF \u0111\u1ED9 "Ch\u1EE7 th\u1EC3 c\u1EE7a t\xF4i")</em></p>
    </div>

    <div id="lien-he" class="section-anchor"></div>
    <h2 class="text-h5 font-weight-bold mt-10 mb-4">3. C\u1EA7n h\u1ED7 tr\u1EE3 th\xEAm?</h2>
    <p class="mb-4">N\u1EBFu c\xF3 b\u1EA5t k\u1EF3 th\u1EAFc m\u1EAFc n\xE0o trong qu\xE1 tr\xECnh s\u1EED d\u1EE5ng, \u0111\u1EEBng ng\u1EA7n ng\u1EA1i, h\xE3y li\xEAn h\u1EC7 ngay v\u1EDBi ch\xFAng t\xF4i:</p>
    
    <div class="mt-4" style="border: 1px solid #e0e0e0; border-radius: 4px;">
      <ul style="list-style: none; padding: 8px 0;">
        <li class="pa-4 d-flex align-center">
          <i class="mdi mdi-zalo mr-4" style="font-size: 28px; color: #0068FF;"></i>
          <div>
            <strong class="text-body-1">K\xEAnh \u01B0u ti\xEAn (Zalo)</strong><br>
            <span class="text-grey-darken-1">034 302 7232</span>
          </div>
        </li>
        <li class="pa-4 d-flex align-center">
          <i class="mdi mdi-facebook mr-4" style="font-size: 28px; color: #1877F2;"></i>
          <div>
            <strong class="text-body-1">Fanpage Facebook</strong><br>
            <span class="text-grey-darken-1">Tien Code Web</span>
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
      title: t("H\u01B0\u1EDBng d\u1EABn s\u1EED d\u1EE5ng"),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tutorial.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=tutorial-OK80mHUE.mjs.map
