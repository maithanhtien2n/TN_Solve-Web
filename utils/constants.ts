export const langs = ["vi", "lo", "en"] as const;

export const statusOptions = [
  { value: null, title: "Tất cả" },
  { value: EnumStatus.ACTIVE, title: "Hoạt động" },
  { value: EnumStatus.INACTIVE, title: "Tạm ngưng" },
];

export const expiryStatusOptions = [
  { value: null, title: "Tất cả" },
  { value: EnumStatus.ACTIVE, title: "Hoạt động" },
  { value: EnumStatus.EXPIRED, title: "Đã hết hạn" },
];

export const commissionStatusOptions = [
  { value: null, title: "Tất cả" },
  { value: EnumCommissionStatus.AWAITING_RATE, title: "Chờ chốt %" },
  { value: EnumCommissionStatus.PENDING, title: "Chờ thanh toán" },
  { value: EnumCommissionStatus.PAID, title: "Đã thanh toán" },
  // { value: EnumCommissionStatus.CANCELLED, title: "Đã hủy" },
];
