import { defineStore } from "pinia";
import { productService } from "~/services/app";

export const useProductStore = defineStore("product", () => {
  const params = reactive<any>({
    search: "",
    page: 1,
    limit: 12,
  });
  const products = ref<any>([]);

  const onGetterParams = computed(() => params);
  const onGetterProducts = computed(() => products);

  const onActionAllProductClient = async (payload: any) => {
    const res = await productService.getAllProductClient(payload);
    if (payload.page === 1) {
      products.value = res.data;
    } else {
      products.value = {
        ...(products.value || {}),
        docs: [...(products.value?.docs || []), ...(res.data?.docs || [])],
      };
    }

    return res;
  };

  return {
    onGetterParams,
    onGetterProducts,

    onActionAllProductClient,
  };
});
