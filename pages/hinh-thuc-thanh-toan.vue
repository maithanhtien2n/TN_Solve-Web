<script setup lang="ts">
useSeo({
  title: "Hình thức thanh toán",
  description: "Các hình thức thanh toán được chấp nhận tại TN Solve.",
  image: "/images/page-home.png",
  keywords: "hình thức thanh toán TN Solve, chuyển khoản ngân hàng",
});
</script>

<template>
  <PolicyPage
    title="Hình thức thanh toán"
    updated="Cập nhật lần cuối: Ngày 26 tháng 04 năm 2026"
    icon="mdi-credit-card-outline"
    color="#1565c0"
  >
    <PolicySection icon="mdi-bank-outline" title="Chuyển khoản ngân hàng">
      <p>Thực hiện thanh toán vào tài khoản ngân hàng của chúng tôi. Vui lòng sử dụng <strong>Mã đơn hàng</strong> của bạn trong phần nội dung chuyển khoản. Đơn hàng sẽ được kích hoạt sau khi tiền đã chuyển thành công.</p>

      <div class="bank-card">
        <div class="bank-card__logo">
          <v-icon size="28" color="#fff">mdi-bank</v-icon>
        </div>
        <div class="bank-card__info">
          <div class="bank-card__bank">Ngân hàng Quân đội (MBBank)</div>
          <div class="bank-card__row">
            <span class="bank-card__label">Tên tài khoản</span>
            <span class="bank-card__val">HỘ KINH DOANH TN SOLVE</span>
          </div>
          <div class="bank-card__row">
            <span class="bank-card__label">Số tài khoản</span>
            <span class="bank-card__acc">083027232</span>
          </div>
        </div>
      </div>

      <div class="bank-note">
        <v-icon size="14" color="#1565c0">mdi-lightbulb-outline</v-icon>
        Nội dung chuyển khoản: ghi rõ <strong>Mã đơn hàng</strong> hoặc <strong>email tài khoản</strong> để xác nhận nhanh nhất.
      </div>
    </PolicySection>

    <PolicySection icon="mdi-web" title="Thanh toán qua cổng trực tuyến">
      <p>Hệ thống hỗ trợ thanh toán trực tuyến qua cổng thanh toán tích hợp trên website. Đơn hàng được kích hoạt <strong>tự động ngay sau</strong> khi giao dịch thành công.</p>
    </PolicySection>

    <PolicySection icon="mdi-information-outline" title="Lưu ý" style="grid-column: 1 / -1">
      <ul>
        <li>Giá dịch vụ đã bao gồm thuế VAT.</li>
        <li>Vui lòng kiểm tra kỹ thông tin trước khi thanh toán.</li>
        <li>Liên hệ hỗ trợ nếu gặp vấn đề: <a href="tel:0343027232">0343027232</a></li>
      </ul>
    </PolicySection>
  </PolicyPage>
</template>

<style scoped>
.bank-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: linear-gradient(135deg, #1565c0, #1e88e5);
  border-radius: 14px;
  padding: 18px 20px;
  margin: 14px 0;
  color: #fff;
}

.bank-card__logo {
  width: 48px; height: 48px;
  border-radius: 12px;
  background: rgba(255,255,255,0.15);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.bank-card__bank {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.65);
  margin-bottom: 10px;
  font-weight: 600;
}

.bank-card__row { display: flex; flex-direction: column; margin-bottom: 6px; }
.bank-card__label { font-size: 0.68rem; color: rgba(255,255,255,0.55); }
.bank-card__val { font-size: 0.9rem; font-weight: 700; }
.bank-card__acc { font-size: 1.3rem; font-weight: 800; letter-spacing: 1px; }

.bank-note {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  font-size: 0.8rem;
  color: #334155;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 10px 14px;
  line-height: 1.6;
}
</style>
