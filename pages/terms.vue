<script setup lang="ts">
const { t } = useI18n();

const content = ref<string>(`
  <div>
    <h1 class="text-h5 text-md-h4 font-bold mb-1">Điều khoản & Thanh toán</h1>
    <p class="text-grey-darken-1 mb-6">Cập nhật lần cuối: Ngày 31 tháng 01 năm 2026</p>
    
    <p class="mb-6">
      Chào mừng bạn đến với <b>Tool Video TN Solve</b>. Để đảm bảo quyền lợi của đôi bên, vui lòng đọc kỹ các quy định về chi phí và sử dụng dưới đây.
    </p>

    <div id="tom-tat" class="pa-4 mb-8" style="background-color: #E8F5E9; border-left: 5px solid #4CAF50; border-radius: 4px;">
      <h4 class="text-h6 mb-2 text-success d-flex align-center">
        <i class="mdi mdi-flash-outline mr-3" style="font-size: 28px;"></i>
        Thông tin quan trọng
      </h4>
      <ul class="pl-10">
        <li><strong>Dùng thử trước:</strong> Bạn có thể trải nghiệm tool miễn phí trước khi quyết định mua.</li>
        <li><strong>Sở hữu video:</strong> Video bạn tạo ra thuộc toàn quyền sở hữu của bạn.</li>
        <li><strong>Bảo mật:</strong> Chúng tôi không bán dữ liệu của bạn cho bất kỳ bên thứ ba nào.</li>
      </ul>
    </div>

    <div id="gia-ca" class="section-anchor"></div>
    <h2 class="text-h5 font-weight-bold mt-10 mb-4">1. Chi phí & Hệ thống tín dụng</h2>
    <div class="v-table v-table--has-top v-table--has-bottom theme--light mb-6">
      <table class="w-100" style="border-collapse: collapse; border: 1px solid #eee;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th class="text-left pa-3">Gói dịch vụ</th>
            <th class="text-left pa-3">Chi phí</th>
            <th class="text-left pa-3">Quyền lợi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="pa-3 border-bottom"><strong>Gói Đăng ký</strong></td>
            <td class="pa-3 border-bottom">99.000 VNĐ</td>
            <td class="pa-3 border-bottom">Kích hoạt tài khoản + <strong>4.000 tín dụng</strong></td>
          </tr>
          <tr>
            <td class="pa-3 border-bottom"><strong>Mua lẻ tín dụng</strong></td>
            <td class="pa-3 border-bottom">10.000 VNĐ</td>
            <td class="pa-3 border-bottom">Thêm <strong>2.000 tín dụng</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="mb-4 italic text-grey-darken-2">* Tín dụng sẽ được trừ dần dựa trên số lượng/thời lượng video bạn tạo.</p>

    <div id="hoan-tien" class="section-anchor"></div>
    <div class="pa-4 mt-6" style="border: 1px solid #FB8C00; background-color: #FFF3E0; border-radius: 4px;">
      <h3 class="text-h6 font-weight-bold mb-2 text-warning-darken-4 d-flex align-center">
        <i class="mdi mdi-alert-circle-outline mr-2"></i> Chính sách Không hoàn tiền
      </h3>
      <p class="mb-0">
        TN Solve cung cấp <strong>chế độ dùng thử miễn phí</strong> để khách hàng kiểm tra tính năng và chất lượng trước khi thanh toán. Do đó, sau khi bạn đã đăng ký gói hoặc mua thêm tín dụng, chúng tôi <strong>không hỗ trợ hoàn trả tiền</strong> với bất kỳ lý do gì.
      </p>
    </div>

    <div id="quyen-so-huu" class="section-anchor"></div>
    <h2 class="text-h5 font-weight-bold mt-10 mb-4">2. Quyền & Trách nhiệm</h2>
    <ul class="pl-6">
      <li class="mb-2"><strong>Quyền sở hữu:</strong> Bạn có quyền sử dụng video cho mục đích cá nhân hoặc thương mại (YouTube, TikTok, quảng cáo...).</li>
      <li class="mb-2"><strong>Bảo mật:</strong> Tài khoản của bạn là duy nhất. Vui lòng không chia sẻ tài khoản cho nhiều người dùng chung.</li>
      <li class="mb-2"><strong>Nội dung cấm:</strong> Không sử dụng tool để tạo nội dung vi phạm pháp luật, đồi trụy, lừa đảo (deepfake) hoặc công kích cá nhân/tổ chức.</li>
    </ul>

    <div class="pa-4 mt-8 text-center" style="background-color: #f9f9f9; border-radius: 8px;">
      <p class="mb-0">Mọi thắc mắc về kích hoạt tài khoản hoặc lỗi kỹ thuật, vui lòng liên hệ Zalo hỗ trợ để được xử lý nhanh nhất.</p>
    </div>

    <style>
      .section-anchor {
        display: block;
        position: relative;
        top: -80px;
        visibility: hidden;
      }
      .border-bottom { border-bottom: 1px solid #eee; }
    </style>
  </div>
`);

useSeo({
  title: t("Chính sách & Điều khoản"),
  description: "Nền tảng AI giúp bạn tạo video chuyên nghiệp chỉ với 99k",
  image: "/images/page-home.png",
});
</script>

<template>
  <div v-html="content" />
</template>
