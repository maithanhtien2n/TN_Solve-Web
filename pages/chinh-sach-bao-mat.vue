<script setup lang="ts">
useSeo({
  title: "Chính sách bảo mật thông tin",
  description: "Chính sách bảo mật thông tin cá nhân của khách hàng tại TN Solve.",
  image: "/images/page-home.png",
  keywords: "chính sách bảo mật TN Solve, bảo vệ thông tin cá nhân",
});
</script>

<template>
  <PolicyPage
    title="Chính sách bảo mật thông tin"
    updated="Cập nhật lần cuối: Ngày 26 tháng 04 năm 2026"
    icon="mdi-shield-lock-outline"
    color="#0f766e"
  >
    <div class="pol-notice">
      <v-icon size="16" color="#0f766e">mdi-information-outline</v-icon>
      Trước khi đặt hàng hoặc sử dụng dịch vụ, bạn bắt buộc phải đồng ý với chính sách bảo vệ thông tin cá nhân của chúng tôi.
    </div>

    <PolicySection num="1" title="Mục đích thu thập thông tin cá nhân">
      <p>Chúng tôi chỉ thu thập thông tin cá nhân với các mục đích sau:</p>
      <ul>
        <li>Xác nhận danh tính người dùng</li>
        <li>Xử lý đơn hàng và cung cấp dịch vụ</li>
        <li>Cải thiện trải nghiệm khách hàng</li>
        <li>Tùy chỉnh trải nghiệm sử dụng</li>
      </ul>
    </PolicySection>

    <PolicySection num="2" title="Phạm vi sử dụng thông tin">
      <p>Thông tin cá nhân của khách hàng không được chia sẻ, tiết lộ hoặc bán cho bất kỳ bên thứ ba nào mà không có sự đồng ý rõ ràng từ khách hàng.</p>
    </PolicySection>

    <PolicySection num="3" title="Những người hoặc tổ chức có thể tiếp cận thông tin">
      <ul>
        <li>Ban quản trị của HỘ KINH DOANH TN SOLVE</li>
        <li>Đối tác dịch vụ (trong phạm vi được đề ra)</li>
        <li>Cơ quan chức năng thực thi pháp luật (khi có yêu cầu pháp lý)</li>
      </ul>
    </PolicySection>

    <PolicySection num="4" title="Thời gian lưu trữ thông tin">
      <p>Thông tin cá nhân được lưu trữ trong thời gian khách hàng sử dụng dịch vụ và trong thời gian cần thiết để đáp ứng mục đích thu thập.</p>
    </PolicySection>

    <PolicySection num="5" title="Thông tin đơn vị thu thập và quản lý">
      <ul>
        <li><strong>HỘ KINH DOANH TN SOLVE</strong> — GPKD số 054200002629, Đăng ký ngày: 26/04/2026, Nơi cấp: UBND Phường Bình Kiến</li>
        <li>Địa chỉ: 113 Đường Võ Văn Tần, Phường Bình Kiến, Tỉnh Đắk Lắk, Việt Nam</li>
        <li>Điện thoại: <a href="tel:0343027232">0343027232</a></li>
        <li>Email: <a href="mailto:maithanhtien0612@gmail.com">maithanhtien0612@gmail.com</a></li>
        <li>Người đại diện: MAI THANH TIỆN</li>
      </ul>
    </PolicySection>

    <PolicySection num="6" title="Quản lý dữ liệu cá nhân">
      <p>Khách hàng có quyền tiếp cận và chỉnh sửa thông tin cá nhân bằng cách đăng nhập vào tài khoản hoặc liên hệ trực tiếp với chúng tôi.</p>
    </PolicySection>

    <PolicySection num="7" title="Cơ chế tiếp nhận và giải quyết khiếu nại">
      <ul>
        <li>Hotline: <a href="tel:0343027232">0343027232</a></li>
        <li>Email: <a href="mailto:maithanhtien0612@gmail.com">maithanhtien0612@gmail.com</a></li>
      </ul>
      <p>Chúng tôi cam kết phản hồi trong vòng 24 giờ.</p>
    </PolicySection>

    <PolicySection num="8" title="Cam kết bảo mật thông tin khách hàng">
      <p>Thông tin cá nhân được cam kết bảo mật tuyệt đối, không chia sẻ cho bên thứ ba khi không có sự cho phép. Trong trường hợp bị tấn công dẫn đến mất dữ liệu, chúng tôi sẽ thông báo kịp thời cho cơ quan chức năng và người tiêu dùng.</p>
    </PolicySection>
  </PolicyPage>
</template>

<style scoped>
.pol-notice {
  grid-column: 1 / -1;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.85rem;
  color: #0f766e;
  background: #f0fdf9;
  border: 1px solid #99f6e4;
  border-radius: 10px;
  padding: 12px 16px;
  line-height: 1.6;
}
</style>
