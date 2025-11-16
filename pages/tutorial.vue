<script setup lang="ts">
const { t } = useI18n();

const content = ref<string>(`
  <div>
    <h1 class="text-h5 text-md-h4 font-weight-bold mb-1">Hướng dẫn sử dụng Tool</h1>
    <p class="text-grey-darken-1 mb-6">Từ A-Z: Cách làm chủ tool và bí quyết viết prompt hiệu quả</p>
    
    <p class="mb-6">
      Chào mừng bạn đến với <b>Tool Video TN Solve</b>! Trang này sẽ hướng dẫn bạn từng bước để tạo ra video AI đầu tiên và chia sẻ các mẹo viết prompt để video đạt chất lượng cao nhất.
    </p>

    <div 
      class="pa-4 mb-8" 
      style="background-color: #E3F2FD; border-left: 5px solid #1E88E5; border-radius: 4px;"
    >
      <h4 class="text-h6 mb-2 text-primary d-flex align-center">
        <i class="mdi mdi-rocket-launch-outline mr-3" style="font-size: 28px;"></i>
        Quy trình 3 bước đơn giản
      </h4>
      <p class="mb-0"><b>1. Cài đặt:</b> Chọn các thông số cho video (Kích thước, Chế độ...).<br>
                       <b>2. Ra lệnh:</b> Viết mô tả (prompt) thật chi tiết cho AI.<br>
                       <b>3. Hoàn tất:</b> Nhấn "Tạo video" và chờ nhận kết quả.</p>
    </div>

    <div id="cac-buoc" class="section-anchor"></div>
    <h2 class="text-h5 font-weight-bold mt-10 mb-4">1. Hướng dẫn từng bước trên Form</h2>
    <p class="mb-4">Đây là giải thích cho từng trường thông tin bạn thấy trên trang "Tạo video":</p>
    
    <ul style="list-style: none; padding-left: 0;">
      <li class="d-flex align-start mb-4">
        <i class="mdi mdi-numeric-1-circle text-primary mr-4" style="font-size: 26px; line-height: 1.5;"></i>
        <span><strong>Tiêu đề (*):</strong> Đặt tên để bạn dễ dàng quản lý video trong "Thư viện".</span>
      </li>
      
      <li class="d-flex align-start mb-4">
        <i class="mdi mdi-numeric-2-circle text-primary mr-4" style="font-size: 26px; line-height: 1.5;"></i>
        <span><strong>Cài đặt cơ bản (Mô hình, Tỷ lệ, Thời lượng):</strong>
          <ul class="pl-5 mt-2">
            <li><b>Mô hình:</b> "Veo 3 - Fast" là lựa chọn cân bằng, cho tốc độ nhanh.</li>
            <li><b>Tỷ lệ:</b> 16:9 (video ngang) hoặc 9:16 (video dọc). <b>Lưu ý:</b> Tỷ lệ 9:16 là bắt buộc cho "Chế độ Video ngắn".</li>
            <li><b>Thời lượng:</b> Chọn mốc thời gian bạn muốn (ví dụ "00:24" cho 24 giây). Tool hỗ trợ từ 8 giây đến 10 phút 08 giây theo các mốc có sẵn.</li>
          </ul>
        </span>
      </li>
      
      <li class="d-flex align-start mb-4">
        <i class="mdi mdi-numeric-3-circle text-primary mr-4" style="font-size: 26px; line-height: 1.5;"></i>
        <span>
          <strong>Chọn Chế độ (Quan trọng):</strong>
          <ul class="pl-5 mt-2">
            <li>Chọn <b>"Làm phim"</b> nếu bạn có kịch bản, cốt truyện (làm phim hoạt hình rất tốt). Bạn có thể chọn tỷ lệ 16:9 hoặc 9:16.</li>
            <li>Chọn <b>"Video ngắn"</b> nếu bạn muốn video viral, ASMR. <b>(Chế độ này sẽ tự động khóa Tỷ lệ khung hình về 9:16).</b></li>
            <li>Chọn <b>"Chủ thể của tôi"</b> nếu bạn muốn video nói về 1 sản phẩm/nhân vật. (<b>Lưu ý:</b> Phải tải ảnh của chủ thể lên). Bạn có thể chọn tỷ lệ 16:9 hoặc 9:16.</li>
          </ul>
        </span>
      </li>

      <li class="d-flex align-start mb-4">
        <i class="mdi mdi-numeric-4-circle text-primary mr-4" style="font-size: 26px; line-height: 1.5;"></i>
        <span><strong>Chọn Phong cách:</strong>
          <ul class="pl-5 mt-2">
            <li>Để <b>"Mặc định"</b> nếu bạn muốn AI tự quyết định dựa trên prompt.</li>
            <li>Chọn <b>"Đánh giá"</b> nếu làm video review, bán hàng.</li>
            <li>Chọn <b>"Độc thoại"</b> nếu muốn nhân vật trong video tự nói chuyện.</li>
            <li>Chọn <b>"ASMR / Thỏa mãn"</b> (thường dùng với "Chế độ Video ngắn").</li>
          </ul>
        </span>
      </li>
      
      <li class="d-flex align-start mb-4">
        <i class="mdi mdi-numeric-5-circle text-primary mr-4" style="font-size: 26px; line-height: 1.5;"></i>
        <span><strong>Viết Prompt (*):</strong> Đây là bước quan trọng nhất. Hãy xem các mẹo và video ví dụ ở mục 2.</span>
      </li>

      <li class="d-flex align-start mb-4">
        <i class="mdi mdi-numeric-6-circle text-primary mr-4" style="font-size: 26px; line-height: 1.5;"></i>
        <span><strong>Hoàn tất:</strong> Nhấn nút <b>"Tạo video"</b>. Video sẽ được xử lý và sớm có mặt trong "Thư viện của tôi".</span>
      </li>
    </ul>

    <div 
      class="pa-4 mt-6 mb-8" 
      style="border: 1px solid #4CAF50; background-color: #E8F5E9; border-radius: 4px;"
    >
      <p class="d-flex align-center text-green-darken-3" style="margin: 0; font-size: 1.1rem; line-height: 1.6;">
        <i class="mdi mdi-cloud-check-outline mr-3" style="font-size: 24px;"></i>
        <b>Pro-tip: Tool chạy ngầm!</b>
      </p>
      <p class="text-green-darken-4 mb-0 mt-2">
        Bạn có thể dùng tool trên cả <b>điện thoại và máy tính</b>. Sau khi nhấn "Tạo video", bạn có thể <b>tắt website, tắt wifi</b>. AI vẫn chạy ngầm trên máy chủ. Khi nào xong, bạn chỉ cần đăng nhập lại và vào <b>"Thư viện của tôi"</b> để lấy video.
      </p>
    </div>
    
    <div id="prompt" class="section-anchor"></div>
    <h2 class="text-h5 font-weight-bold mt-10 mb-4">2. Bí quyết Viết Prompt (Kèm Video Ví dụ)</h2>
    <p class="mb-4">Prompt (lời nhắc) là mệnh lệnh của bạn cho AI. Prompt càng chi tiết, video càng đúng ý bạn. AI của chúng tôi hiểu tốt nhất các prompt mô tả theo cấu trúc:</p>
    
    <div 
      class="pa-4 mt-6 mb-8" 
      style="border: 1px solid #FB8C00; background-color: #FFF3E0; border-radius: 4px;"
    >
      <p class="d-flex align-center text-warning-darken-3" style="margin: 0; font-size: 1.1rem; line-height: 1.6;">
        <i class="mdi mdi-lightbulb-on-outline mr-3" style="font-size: 24px;"></i>
        <b>Mẹo Vàng:</b> <i>"Bối cảnh + Chủ thể + Hành động + Cảm xúc/Phong cách"</i>
      </p>
    </div>

    <div class="mt-4 pa-4" style="border: 1px solid #e0e0e0; border-radius: 4px;">
      <h4 class="text-h6 mb-3">Ví dụ 1: Chế độ "Video ngắn" (Thỏa mãn)</h4>
      <p class="mb-3"><b>Cài đặt:</b> <i>Chế độ (Video ngắn), Tỷ lệ (<b>Tự động 9:16</b>), Phong cách (Thỏa mãn), Thời lượng (00:16)</i></p>
      <div class="pa-3 mb-4" style="background-color: #f5f5f5; border-radius: 4px; font-family: 'Courier New', monospace;">
        <b>PROMPT:</b> "Cận cảnh, quay từ trên xuống, một con dao sắc đang cắt một khối xà phòng màu cầu vồng thành từng lát mỏng. Các lát xà phòng rơi xuống. Âm thanh xắt xà phòng chân thực, thỏa mãn, giòn tan."
      </div>
      
      <video controls style="max-height: 640px; width: auto; max-width: 100%; display: block; margin: 0 auto; border-radius: 8px;">
        <source src="/videos/video-ngan-test.mp4" type="video/mp4">
        Trình duyệt của bạn không hỗ trợ video.
      </video>
      <p class="text-center text-caption text-grey-darken-1 mt-2"><em>(Ví dụ về chế độ "Video ngắn")</em></p>
    </div>

    <div class="mt-8 pa-4" style="border: 1px solid #e0e0e0; border-radius: 4px;">
      <h4 class="text-h6 mb-3">Ví dụ 2: Chế độ "Làm phim" (Hoạt hình)</h4>
      <p class="mb-3"><b>Cài đặt:</b> <i>Tỷ lệ (16:9), Chế độ (Làm phim), Phong cách (Mặc định), Thời lượng (00:48)</i></p>
      <div class="pa-3 mb-4" style="background-color: #f5f5f5; border-radius: 4px; font-family: 'Courier New', monospace;">
        <b>PROMPT:</b> "Phong cách hoạt hình 3D Pixar. Cảnh 1: Một chú mèo lông cam, mập mạp, đeo kính râm, đang chơi đàn guitar điện trên sân khấu rực rỡ ánh đèn. Cảnh 2: Quay cận mặt chú mèo đang hát say sưa. Cảnh 3: Đám đông khán giả (là những con chó) ở dưới đang hò reo, vẫy tay."
      </div>
      
      <video controls style="max-height: 640px; width: auto; max-width: 100%; display: block; margin: 0 auto; border-radius: 8px;">
        <source src="/videos/video-lam-phim-test.mp4" type="video/mp4">
        Trình duyệt của bạn không hỗ trợ video.
      </video>
      <p class="text-center text-caption text-grey-darken-1 mt-2"><em>(Ví dụ về chế độ "Làm phim")</em></p>
    </div>
    
    <div class="mt-8 pa-4" style="border: 1px solid #e0e0e0; border-radius: 4px;">
      <h4 class="text-h6 mb-3">Ví dụ 3: Chế độ "Chủ thể của tôi" (Review sản phẩm)</h4>
      <p class="mb-3"><b>Cài đặt:</b> <i>Tỷ lệ (9:16), Chế độ (Chủ thể của tôi), Phong cách (Đánh giá), Thời lượng (00:32)</i><br>
      <b>Ảnh tải lên:</b> <i>(Ảnh chụp chai serum X)</i></p>
      <div class="pa-3 mb-4" style="background-color: #f5f5f5; border-radius: 4px; font-family: 'Courier New', monospace;">
        <b>PROMPT:</b> "Video quảng cáo sản phẩm serum X. Mở đầu quay cận cảnh chai serum xoay tròn, ánh sáng chiếu lấp lánh. Giọng thuyết minh nữ chuyên nghiệp: 'Bạn mệt mỏi vì thâm mụn? Đã có serum X, chiết xuất 100% thiên nhiên, giảm thâm mụn chỉ sau 7 ngày.' Hiện text 'Giảm giá 50%' lên màn hình. Giọng nói tiếp: 'Giá gốc 500k nay chỉ còn 200k. Mua ngay!'"
      </div>
      
      <video controls style="max-height: 640px; width: auto; max-width: 100%; display: block; margin: 0 auto; border-radius: 8px;">
        <source src="/videos/video-chu-the-cua-toi-test.mp4" type="video/mp4">
        Trình duyệt của bạn không hỗ trợ video.
      </video>
      <p class="text-center text-caption text-grey-darken-1 mt-2"><em>(Ví dụ về chế độ "Chủ thể của tôi")</em></p>
    </div>

    <div id="lien-he" class="section-anchor"></div>
    <h2 class="text-h5 font-weight-bold mt-10 mb-4">3. Cần hỗ trợ thêm?</h2>
    <p class="mb-4">Nếu có bất kỳ thắc mắc nào trong quá trình sử dụng, đừng ngần ngại, hãy liên hệ ngay với chúng tôi:</p>
    
    <div class="mt-4" style="border: 1px solid #e0e0e0; border-radius: 4px;">
      <ul style="list-style: none; padding: 8px 0;">
        <li class="pa-4 d-flex align-center">
          <i class="mdi mdi-zalo mr-4" style="font-size: 28px; color: #0068FF;"></i>
          <div>
            <strong class="text-body-1">Kênh ưu tiên (Zalo)</strong><br>
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
    <h2 class="text-h5 font-weight-bold mt-10 mb-4">Bạn đã sẵn sàng?</h2>
    <p class="mb-4">
      Tất cả các tính năng này đều có trong gói 99.000 VNĐ/tháng.
    </p>
    
    <a href="/" style="text-decoration: none;">
      <div 
        class="d-inline-flex align-center justify-center pa-3 px-6" 
        style="background-color: #29B6F6; color: white; border-radius: 8px; font-weight: 500;"
      >
        <i class="mdi mdi-creation mr-2" style="font-size: 20px;"></i>
        Tạo video ngay
      </div>
    </a>

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
  title: t("Hướng dẫn sử dụng"),
  description:
    "Nền tảng AI giúp bạn tạo video chuyên nghiệp chỉ trong vài phút",
  image: "/images/page-home.png",
});
</script>

<template>
  <div v-html="content" />
</template>
