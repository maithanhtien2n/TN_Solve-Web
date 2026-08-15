import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

const api = axios.create({
  timeout: 70000,
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined" && config.headers) {
    const csrf = useCookie<string | null>("csrf_token");

    if (csrf?.value) {
      config.headers["X-CSRF-Token"] = csrf.value;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response?.data?.message && response?.data?.message !== "Success") {
      const { $toast } = useNuxtApp();
      $toast.success(response.data.message);
    }

    return response.data;
  },
  (error) => {
    // Request nền (polling) tự đánh dấu bằng query param (KHÔNG dùng header
    // tuỳ ý — sẽ kích hoạt CORS preflight mà server chưa khai allowedHeaders
    // cho header lạ, khiến mọi request loại này fail hẳn — xem product.ts).
    // 1 lỗi thoáng qua giữa các lượt poll không nên làm phiền người dùng bằng
    // popup, tự thử lại ở lượt kế tiếp là đủ. KHÔNG áp dụng cho nhánh 403 bên
    // dưới — session hết hạn thật vẫn phải đăng xuất dù request đó là poll
    // nền hay không.
    const isSilent = error.config?.params?.silentError === 1;

    if (
      !isSilent &&
      !error.request.responseURL.includes("/accounts/me") &&
      !["ERR_CANCELED"].includes(error.code) &&
      ![401].includes(error.status)
    ) {
      if (
        !useRoute().path.includes("/admin") &&
        typeof error.response?.data?.message === "string" &&
        error.response?.data?.message.includes("đăng ký gói dịch vụ")
      ) {
        useRouter().push("/dang-ky-dich-vu");
      }

      if (
        !useRoute().path.includes("/admin") &&
        typeof error.response?.data?.message === "string" &&
        error.response?.data?.message.includes(
          "Tín dụng hiện tại của bạn không đủ"
        )
      ) {
        useAppStore().onGetterDisplayPopupBuyCredit.value = true;
      }

      useAppStore().onActionSetSystemPopup({
        type: "error",
        content: error.response?.data?.message || error.message,
      });
    }

    // 403 gọi logout
    if (
      !error.request.responseURL.includes("/accounts/me") &&
      [403].includes(error.status)
    ) {
      useAppStore().onGetterUserData.value = undefined;
      useRouter().replace("/");
    }

    if (
      [
        "❌ Tài khoản đã bị tạm dừng!",
        "❌ Tài khoản bị đình chỉ do vi phạm!",
        "❌ Tài khoản đã bị xoá!",
        "❌ Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại để tiếp tục!",
      ].includes(error.response?.data?.message)
    ) {
      useAppStore().onActionSetSystemPopup({
        type: "error",
        content: error.response?.data?.message || error.message,
      });
    }

    return Promise.reject(error);
  }
);

export default api;
