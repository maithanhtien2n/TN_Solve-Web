import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

const api = axios.create({
  timeout: 70000,
  baseURL: "https://api.tnsolve.com/api",
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
      const { $toast, $i18n } = useNuxtApp();
      $toast.success($i18n.t(response.data.message));
    }

    return response.data;
  },
  (error) => {
    if (
      !error.request.responseURL.includes("/accounts/me") &&
      !["ERR_CANCELED"].includes(error.code) &&
      ![401].includes(error.status)
    ) {
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
      const { $router } = useNuxtApp();

      useAppStore().onGetterUserData.value = undefined;
      $router.replace("/");
    }

    return Promise.reject(error);
  }
);

export default api;
