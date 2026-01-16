<script setup lang="ts">
const { t } = useI18n();

const content = ref<string>(`
  <div>
    <h1 class="text-h5 text-md-h4 font-weight-bold mb-1">Tính năng Nổi bật</h1>
    <p class="text-grey-darken-1 mb-6">Khám phá sức mạnh của AI trong việc tạo video với TN Solve</p>
    
    <p class="mb-6">
      <b>Tool Video TN Solve</b> được thiết kế để biến ý tưởng của bạn thành video chuyên nghiệp một cách nhanh chóng. Dưới đây là các tính năng chính bạn có thể sử dụng:
    </p>

    <div 
      class="pa-4 mb-8" 
      style="background-color: #E8F5E9; border-left: 5px solid #4CAF50; border-radius: 4px;"
    >
      <h4 class="text-h6 mb-2 text-green-darken-2 d-flex align-center">
        <i class="mdi mdi-star-circle-outline mr-3" style="font-size: 28px;"></i>
        Từ Ý tưởng đến Video chỉ trong vài cú click
      </h4>
      <p class="mb-0">Công cụ của chúng tôi cung cấp đầy đủ các tùy chọn từ cơ bản đến nâng cao để video của bạn trở nên độc đáo và chính xác theo ý muốn.</p>
    </div>

    <div id="features" class="section-anchor"></div>
    <h2 class="text-h5 font-weight-bold mt-10 mb-4">Danh sách Tính năng Chính</h2>
    
    <ul style="list-style: none; padding-left: 0;">
      
      <li class="d-flex align-start mb-5">
        <i class="mdi mdi-text-long text-primary mr-4" style="font-size: 30px; line-height: 1.5;"></i>
        <span>
          <strong class="text-body-1">Tạo video từ Văn bản (Prompt)</strong><br>
          Chỉ cần nhập mô tả chi tiết (prompt) về kịch bản, bối cảnh, nhân vật, hành động... AI của chúng tôi sẽ phân tích và tạo ra video dựa trên yêu cầu của bạn.
        </span>
      </li>
      
      <li class="d-flex align-start mb-5">
        <i class="mdi mdi-image-move text-primary mr-4" style="font-size: 30px; line-height: 1.5;"></i>
        <span>
          <strong class="text-body-1">Tạo video từ Ảnh (Chế độ "Chủ thể của tôi")</strong><br>
          Tải lên hình ảnh của một chủ thể (người hoặc vật) và AI sẽ tạo ra video với chủ thể đó đang thực hiện các hành động theo mô tả trong prompt của bạn.
        </span>
      </li>

      <li class="d-flex align-start mb-5">
        <i class="mdi mdi-aspect-ratio text-primary mr-4" style="font-size: 30px; line-height: 1.5;"></i>
        <span>
          <strong class="text-body-1">Tùy chọn Tỷ lệ Khung hình</strong><br>
          Dễ dàng chọn lựa giữa <b>Khổ ngang (16:9)</b> cho YouTube/PC và <b>Khổ dọc (9:16)</b> cho TikTok, Reels, và Shorts.
        </span>
      </li>
      
      <li class="d-flex align-start mb-5">
        <i class="mdi mdi-movie-open-play-outline text-primary mr-4" style="font-size: 30px; line-height: 1.5;"></i>
        <span>
          <strong class="text-body-1">Đa dạng Chế độ Sáng tạo</strong><br>
          Chọn từ các chế độ như "Làm phim", "Video ngắn", hoặc "Chủ thể của tôi" để AI tối ưu hóa kết quả đầu ra theo đúng mục đích của bạn.
        </span>
      </li>

      <li class="d-flex align-start mb-5">
        <i class="mdi mdi-microphone-variant text-primary mr-4" style="font-size: 30px; line-height: 1.5;"></i>
        <span>
          <strong class="text-body-1">Nhiều Phong cách Video</strong><br>
          Hỗ trợ nhiều phong cách âm thanh và nội dung như "Thuyết minh", "Độc thoại", "Đánh giá sản phẩm", "ASMR", "Thỏa mãn"... để video của bạn thêm phần lôi cuốn.
        </span>
      </li>

      <li class="d-flex align-start mb-5">
        <i class="mdi mdi-timer-outline text-primary mr-4" style="font-size: 30px; line-height: 1.5;"></i>
        <span>
          <strong class="text-body-1">Tùy chỉnh Thời lượng</strong><br>
          Bạn toàn quyền quyết định độ dài chính xác cho video của mình, từ vài giây (00:08) cho đến vài phút (01:04) hoặc hơn.
        </span>
      </li>
      
      <li class="d-flex align-start mb-5">
        <i class="mdi mdi-brain text-primary mr-4" style="font-size: 30px; line-height: 1.5;"></i>
        <span>
          <strong class="text-body-1">Lựa chọn Mô hình AI</strong><br>
          Chọn lựa giữa các mô hình AI khác nhau (ví dụ: "Veo 3 - Fast") để cân bằng giữa tốc độ tạo video và chất lượng hình ảnh mong muốn.
        </span>
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
        top: -80px;
        visibility: hidden;
      }
    </style>
  </div>
`);

useSeo({
  title: t("Tính năng"),
  description:
    "Nền tảng AI giúp bạn tạo video chuyên nghiệp chỉ trong vài phút",
  image: "/images/page-home.png",
});
</script>

<template>
  <div v-html="content" />
</template>
