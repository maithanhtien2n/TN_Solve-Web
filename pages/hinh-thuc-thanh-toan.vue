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
    <PolicySection icon="mdi-web" title="Thanh toán trực tuyến">
      <p>Chúng tôi cung cấp dịch vụ thanh toán trực tuyến qua các cổng thanh toán như <strong>Pay 2S</strong> vào tài khoản Hộ Kinh Doanh của chúng tôi. Quý khách có thể chọn phương thức thanh toán này trên trang Thanh Toán. Sau khi thanh toán trực tuyến, đơn hàng của khách hàng sẽ được tự động xác nhận và chúng tôi thực hiện giao hàng cho quý khách.</p>

      <div class="pay-steps">
        <div class="pay-step">
          <div class="step-num">1</div>
          <span>Chọn gói & nhấn <strong>Thanh toán</strong></span>
        </div>
        <div class="pay-step">
          <div class="step-num">2</div>
          <span>Chuyển khoản vào tài khoản bên cạnh</span>
        </div>
        <div class="pay-step">
          <div class="step-num">3</div>
          <span>Dịch vụ tự động kích hoạt sau xác nhận</span>
        </div>
      </div>
    </PolicySection>

    <PolicySection icon="mdi-bank-outline" title="Thông tin tài khoản">
      <p>Tất cả thanh toán đều chuyển vào tài khoản hộ kinh doanh:</p>

      <div class="bank-card">
        <div class="bank-card__header">
          <div class="bank-card__logo">
            <v-icon size="24" color="#fff">mdi-bank</v-icon>
          </div>
          <span class="bank-card__bank-name">Ngân hàng Quân đội (MBBank)</span>
        </div>
        <div class="bank-card__divider" />
        <div class="bank-card__field">
          <span class="bank-card__label">Tên tài khoản</span>
          <span class="bank-card__val">HỘ KINH DOANH TN SOLVE</span>
        </div>
        <div class="bank-card__field">
          <span class="bank-card__label">Số tài khoản</span>
          <span class="bank-card__acc">083027232</span>
        </div>
      </div>
    </PolicySection>
  </PolicyPage>
</template>

<style scoped>
.pay-steps {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.pay-step {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  color: #475569;
}

.step-num {
  width: 24px; height: 24px;
  border-radius: 50%;
  background: #1565c0;
  color: #fff;
  font-weight: 700;
  font-size: 0.75rem;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

/* Bank card */
.bank-card {
  background: linear-gradient(135deg, #1565c0 0%, #1e88e5 100%);
  border-radius: 14px;
  padding: 16px 18px;
  color: #fff;
  box-shadow: 0 6px 20px rgba(21, 101, 192, 0.25);
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bank-card__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bank-card__logo {
  width: 38px; height: 38px;
  border-radius: 10px;
  background: rgba(255,255,255,0.18);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.bank-card__bank-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: rgba(255,255,255,0.85);
}

.bank-card__divider {
  height: 1px;
  background: rgba(255,255,255,0.2);
}

.bank-card__field { display: flex; flex-direction: column; gap: 2px; }
.bank-card__label { font-size: 0.66rem; color: rgba(255,255,255,0.55); text-transform: uppercase; letter-spacing: 0.5px; }
.bank-card__val { font-size: 0.95rem; font-weight: 700; }
.bank-card__acc { font-size: 1.5rem; font-weight: 800; letter-spacing: 2px; }
</style>
