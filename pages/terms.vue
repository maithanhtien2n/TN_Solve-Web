<script setup lang="ts">
const { t } = useI18n();

const content = ref<string>(`
  <div>
    <h1 class="text-h5 text-md-h4 font-bold mb-1">Chính sách & Điều khoản</h1>
    <p class="text-grey-darken-1 mb-6">Cập nhật lần cuối: [Ngày 31 tháng 01 năm 2026]</p>
    
    <p class="mb-6">
      Chào mừng bạn đến với <b>Tool Video TN Solve</b>! Cảm ơn bạn đã tin dùng. Khi bạn <strong>thanh toán online</strong> và sử dụng tool, bạn đồng ý với các quy định đơn giản và rõ ràng dưới đây.
    </p>

    <div id="tom-tat" class="section-anchor"></div>
    <div 
      class="pa-4 mb-8" 
      style="background-color: #E3F2FD; border-left: 5px solid #1E88E5; border-radius: 4px;"
    >
      <h4 class="text-h6 mb-2 text-primary d-flex align-center">
        <i class="mdi mdi-information-outline mr-3" style="font-size: 28px;"></i>
        Tóm tắt nhanh (Những điều quan trọng nhất)
      </h4>
      <ul class="pl-10">
        <li><strong>Video của bạn là của bạn:</strong> Bạn toàn quyền sở hữu và sử dụng video (kể cả mục đích thương mại).</li>
        <li><strong>Thanh toán online (99k/tháng):</strong> Thanh toán trực tiếp qua hệ thống, kích hoạt tự động theo số tháng bạn chọn.</li>
        <li><strong>Gia hạn:</strong> Hết hạn tool sẽ tự khóa. Bạn có thể gia hạn online bất cứ lúc nào.</li>
        <li><strong>Bảo mật & Chơi đẹp:</strong> Chúng tôi không bán dữ liệu của bạn và mong bạn không dùng tool để làm việc xấu.</li>
      </ul>
    </div>

    <div id="thanh-toan" class="section-anchor"></div>
    <h2 class="text-h5 font-weight-bold mt-10 mb-4">1. Đăng ký & Thanh toán (Gói 99k/tháng)</h2>
    <p class="mb-4">Quy trình thanh toán online rất đơn giản:</p>
    
    <ul style="list-style: none; padding-left: 0;">
      <li class="d-flex align-start mb-4">
        <span><strong>Chọn gói:</strong> Bạn chọn số tháng cần đăng ký (99.000 VNĐ/tháng).</span>
      </li>
      <li class="d-flex align-start mb-4">
        <span><strong>Thanh toán online:</strong> Bạn thanh toán trực tiếp qua hệ thống (ví dụ: 3 tháng = 297.000 VNĐ).</span>
      </li>
      <li class="d-flex align-start mb-4">
        <span><strong>Kích hoạt tự động:</strong> Sau khi thanh toán thành công, tài khoản sẽ được kích hoạt/gia hạn tự động theo thời gian bạn đã mua.</span>
      </li>
      <li class="d-flex align-start mb-4">
        <span><strong>Hết hạn:</strong> Khi hết thời gian, tài khoản sẽ tự động không thể tạo video mới cho đến khi bạn gia hạn.</span>
      </li>
      <li class="d-flex align-start mb-4">
        <span><strong>Gia hạn online:</strong> Bạn có thể gia hạn bất cứ lúc nào bằng cách thanh toán lại cho chu kỳ tiếp theo.</span>
      </li>
    </ul>

    <div 
      class="pa-4 mt-7" 
      style="border: 1px solid #90CAF9; background-color: #E3F2FD; border-radius: 4px;"
    >
      <p class="d-flex align-center text-primary" style="margin: 0;">
        <i class="mdi mdi-credit-card-check-outline mr-3" style="font-size: 24px;"></i>
        <strong>Xác nhận thanh toán:</strong> Nếu bạn đã thanh toán thành công nhưng tài khoản chưa được kích hoạt, vui lòng liên hệ hỗ trợ và cung cấp email/số điện thoại đăng ký + mã giao dịch (nếu có) để chúng tôi kiểm tra.
      </p>
    </div>
    
    <div 
      class="pa-4 mt-6" 
      style="border: 1px solid #FB8C00; background-color: #FFF3E0; border-radius: 4px;"
    >
      <p class="d-flex align-center text-warning-darken-3" style="margin: 0;">
        <i class="mdi mdi-cash-remove mr-3" style="font-size: 24px;"></i>
        Lưu ý về Hoàn tiền: Vì chi phí máy chủ AI rất tốn kém, chúng tôi không hỗ trợ hoàn tiền sau khi gói đã được kích hoạt hoặc đã phát sinh lượt xử lý.
      </p>
    </div>

    <div id="quyen-so-huu" class="section-anchor"></div>
    <h2 class="text-h5 font-weight-bold mt-10 mb-4">2. Quyền Sở hữu Video</h2>
    <p class="mb-4">
      <strong>Nội dung của bạn:</strong> Mọi nội dung (văn bản, hình ảnh, v.v.) bạn tải lên đều là của bạn.
    </p>
    <p class="mb-4">
      <strong>Video do AI tạo ra:</strong> Bạn là chủ sở hữu của video cuối cùng. Bạn được cấp phép đầy đủ (kể cả quyền thương mại) để sử dụng, chia sẻ, hoặc bán các video bạn tạo ra trong thời gian tài khoản còn hạn.
    </p>

    <div id="bao-mat" class="section-anchor"></div>
    <h2 class="text-h5 font-weight-bold mt-10 mb-4">3. Chính sách Bảo mật</h2>
    <p class="mb-4">
      Chúng tôi chỉ thu thập thông tin tài khoản cơ bản (email) và nội dung bạn tải lên để AI xử lý.
    </p>
    <p class="mb-4">
      <strong>Cam kết:</strong> Chúng tôi <strong>KHÔNG</strong> bán hoặc chia sẻ thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào. Dữ liệu của bạn chỉ dùng để duy trì dịch vụ.
    </p>

    <div id="quy-tac" class="section-anchor"></div>
    <h2 class="text-h5 font-weight-bold mt-10 mb-4">4. Quy tắc Sử dụng</h2>
    <p class="mb-4">Vui lòng không sử dụng dịch vụ của chúng tôi để tạo ra nội dung:</p>
    <ul class="pl-6 mb-4">
      <li>Vi phạm pháp luật Việt Nam.</li>
      <li>Có tính chất thù địch, bạo lực, hoặc phân biệt đối xử.</li>
      <li>Vi phạm bản quyền hoặc thương hiệu của người khác.</li>
      <li>Tạo thông tin sai lệch (deepfake) có mục đích gây hại.</li>
    </ul>
    <p>Chúng tôi có quyền khóa tài khoản của bạn (kể cả khi còn hạn) nếu phát hiện vi phạm nghiêm trọng.</p>

    <style>
      .section-anchor {
        display: block;
        position: relative;
        top: -80px; /* Điều chỉnh bằng chiều cao header của bạn */
        visibility: hidden;
      }
    </style>
  </div>
`);

useSeo({
  title: t("Chính sách"),
  description:
    "Nền tảng AI giúp bạn tạo video chuyên nghiệp chỉ trong vài phút",
  image: "/images/page-home.png",
});
</script>

<template>
  <div v-html="content" />
</template>
