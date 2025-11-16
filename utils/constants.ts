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
  { value: EnumCommissionStatus.CANCELLED, title: "Đã hủy" },
];

export const commissionTier = [
  { name: "Tiêu chuẩn", requirement: "1-5 người", rate: "15%" },
  { name: "Bạc", requirement: "6-15 người", rate: "20%" },
  { name: "Vàng", requirement: "16-30 người", rate: "25%" },
  { name: "Kim Cương", requirement: "31+ người", rate: "30%" },
];
