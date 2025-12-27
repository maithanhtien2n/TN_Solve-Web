export enum EnumAccountRole {
  USER = "user",
  PARTNER = "partner",
  ADMIN = "admin",
}

export enum EnumStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  EXPIRED = "expired",
}

export enum EnumCommissionStatus {
  AWAITING_RATE = "awaiting_rate",
  PENDING = "pending",
  PAID = "paid",
  CANCELLED = "cancelled",
}

export enum EnumDiscountType {
  PERCENTAGE = "percentage",
  FIXED = "fixed",
}

export enum EnumConditionType {
  USER_ONLY = "user_only",
  CUSTOMER_ONLY = "customer_only",
}

export enum EnumMasterDataType {
  GEMINI_COOKIES = "gemini_cookies",
  FLOW_COOKIES = "flow_cookies",
  GEMINI_API_KEYS = "gemini_api_keys",
  APP_STORAGE_STATE = "app_storage_state",
  SYSTEM_SETTING = "system_setting",
  UPDATING_ACCOUNT = "updating_account",
  ACCOUNT_INFO = "account_info",
}
