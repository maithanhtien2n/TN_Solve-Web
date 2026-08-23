<script setup lang="ts">
// Card dùng chung cho các mục "Ảnh yêu cầu"/"Thông tin yêu cầu" của video
// Cửa hàng (thu-vien-cua-toi/[id].vue) — gom 1 chỗ style nền/viền/bo góc/
// đổ bóng/label để mọi nơi dùng luôn đồng bộ, sửa 1 lần áp dụng khắp nơi.
// compact: giảm khoảng cách label -> nội dung, dùng cho nội dung dạng CHỮ
// ("Thông tin yêu cầu") — giữ nguyên khoảng cách mặc định cho nội dung dạng
// LƯỚI ẢNH ("Ảnh yêu cầu"), 2 loại nội dung cần khoảng cách khác nhau.
withDefaults(defineProps<{ label: string; compact?: boolean }>(), {
  compact: false,
});
</script>

<template>
  <div class="store-field-card">
    <div class="store-field-card-label" :class="{ 'store-field-card-label--compact': compact }">
      {{ label }}
    </div>
    <slot />
  </div>
</template>

<style scoped>
.store-field-card {
  padding: 10px 12px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid #d0dae6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  /* v-row (Vuetify) tự mang margin âm bù gutter — nếu không chặn, phần âm đó
     ăn lẹm vào padding dưới/2 bên của card (VD khung ảnh yêu cầu dùng v-row),
     khiến khoảng cách nhìn hụt hẳn so với padding khai báo. */
  overflow: hidden;
}

.store-field-card-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 10px;
}

.store-field-card-label--compact {
  margin-bottom: 4px;
}
</style>
