<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { couponService } from "~/services/coupon";

const route = useRoute();

const { t } = useI18n();

const { onGetterMasterData } = useMasterDataStore();

const headers = [
  { title: "Tên mã giảm giá", key: "name", sortable: false },
  { title: "Mã giảm giá", key: "code", sortable: false },
  {
    title: "Giá trị giảm",
    key: "discountValue",
    align: "end",
    sortable: false,
  },
  { title: "Ngày và giờ bắt đầu", key: "startDateFormat", sortable: false },
  { title: "Ngày và giờ kết thúc", key: "endDateFormat", sortable: false },
  { title: "Giới hạn sử dụng", key: "usageLimit", sortable: false },
  { title: "Đối tượng áp dụng", key: "conditionType", sortable: false },
  { title: "Trạng thái", key: "status", align: "center", sortable: false },
  { title: "Cập nhật", key: "updatedAt", sortable: false },
  { title: "Thao tác", key: "action", align: "center", sortable: false },
];

const data = ref<any>({});
const loading = ref<string>("");
const dataTableRef = ref<any>(null);
const commonDialogRef = ref<any>(null);
const confirmDialogRef = ref<any>(null);

const statusItems = computed(() =>
  expiryStatusOptions?.map((x: any) => ({ ...x, title: t(x.title) }))
);
const discountTypeOptions = computed(
  () =>
    onGetterMasterData.value["discount-type"]?.map((x: any) => ({
      title: t(x.title),
      value: x.value,
    })) || []
);
const conditionTypeOptions = computed(
  () =>
    onGetterMasterData.value["condition-type"]?.map((x: any) => ({
      title: t(x.title),
      value: x.value,
    })) || []
);

const {
  values: formData,
  handleSubmit,
  resetForm,
} = useForm({
  initialValues: {
    _id: null,
    name: "",
    code: "",
    description: "",
    discountType: EnumDiscountType.FIXED,
    discountValue: null,
    startDate: getNowInLocalFormat(),
    endDate: "",
    usageLimit: null,
    limitPerAccount: null,
    conditionType: [],
  },
  validationSchema: {
    name(value: any) {
      if (!value) return t("Vui lòng nhập tên mã giảm giá");
      return true;
    },

    code(value: any) {
      if (!value) return t("Vui lòng nhập mã giảm giá");
      return true;
    },

    description(value: any) {
      if (!value) return t("Vui lòng nhập mô tả");
      return true;
    },

    discountType(value: any) {
      if (!value) return t("Vui lòng chọn loại giảm giá");
      return true;
    },

    discountValue(value: any) {
      if (!value) return t("Vui lòng nhập giá trị giảm giá");
      if (value <= 0) return t("Giá trị giảm giá phải lớn hơn 0");
      return true;
    },

    startDate(value: any) {
      if (!value) return t("Vui lòng chọn ngày bắt đầu");

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const start = new Date(value);

      if (start < today) {
        return t("Ngày bắt đầu không được nhỏ hơn ngày hiện tại");
      }

      return true;
    },

    endDate(value: any, { form }: any) {
      if (!value) return t("Vui lòng chọn ngày kết thúc");

      const end = new Date(value);

      // Kiểm tra ngày kết thúc >= ngày hiện tại
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (end < today) {
        return t("Ngày kết thúc không được nhỏ hơn ngày hiện tại");
      }

      // Kiểm tra ngày kết thúc >= ngày bắt đầu
      const startValue = form.startDate;
      if (startValue) {
        const start = new Date(startValue);
        if (end < start) {
          return t("Ngày kết thúc không được nhỏ hơn ngày bắt đầu");
        }
      }

      return true;
    },

    usageLimit(value: any) {
      if (!value) return t("Vui lòng nhập giới hạn sử dụng");
      return true;
    },
  },
});

const _id = useField("_id");
const name = useField("name");
const code = useField("code");
const description = useField("description");
const discountType = useField("discountType");
const discountValue = useField<number>("discountValue");
const startDate = useField("startDate");
const endDate = useField("endDate");
const usageLimit = useField<number>("usageLimit");
const limitPerAccount = useField<number>("limitPerAccount");
const conditionType = useField<string[]>("conditionType");

async function loadItems(event: any) {
  const params = { ...event };

  loading.value = "load-table";
  await couponService
    .getAllCoupon(params)
    .then((res) => {
      if (res.data) data.value = res.data;
    })
    .finally(() => {
      loading.value = "";
    });
}

const onResetForm = async (event: any) => {
  resetForm({
    values: {
      _id: event?._id || null,
      name: event?.name || "",
      code: event?.code || "",
      description: event?.description || "",
      discountType: event?.discountType || EnumDiscountType.FIXED,
      discountValue: event?.discountValue || null,
      startDate: event?.startDate || getNowInLocalFormat(),
      endDate: event?.endDate || "",
      usageLimit: event?.usageLimit || null,
      limitPerAccount: event?.limitPerAccount || null,
      conditionType: event?.conditionType || [],
    },
  });
};

const onAction = async (event: any) => {
  if (event.action === "add") {
    onResetForm({});
    commonDialogRef.value?.onDisplay(true);
  } else if (event.action === "update") {
    onResetForm(event.item);
    commonDialogRef.value?.onDisplay(true);
  } else if (event.action === "switch") {
    const payload: any = {
      ids: [event.item._id],
      action: event.isActive ? "active" : "inactive",
    };

    loading.value = "switch-" + event.item._id;
    await couponService
      .actionCoupon(payload)
      .then(() => {
        dataTableRef.value?.loadItems();
      })
      .finally(() => {
        loading.value = "";
      });
  }
};

const onSubmit = handleSubmit(async (values: any) => {
  const payload: any = { ...values };

  loading.value = "submit-form";
  await couponService
    .saveCoupon(payload)
    .then(async () => {
      commonDialogRef.value?.onDisplay(false);
      dataTableRef.value?.loadItems();
      onResetForm({});
    })
    .finally(() => {
      loading.value = "";
    });
});

definePageMeta({ layout: "admin", title: "Mã giảm giá" });
</script>

<template>
  <ConfirmDialog ref="confirmDialogRef" />

  <CommonDialog
    ref="commonDialogRef"
    :title="_id.value.value ? 'Cập nhật mã giảm giá' : 'Tạo mã giảm giá'"
    width="530"
  >
    <div class="mt-2">
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="name.value.value"
            variant="outlined"
            :label="$t(`Tên mã giảm giá`) + ' (✳)'"
            :error-messages="name.errorMessage.value"
            :hide-details="Boolean(!name.errorMessage.value)"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="code.value.value"
            variant="outlined"
            :label="$t(`Mã giảm giá`) + ' (✳)'"
            :error-messages="code.errorMessage.value"
            :hide-details="Boolean(!code.errorMessage.value)"
          />
        </v-col>

        <v-col cols="12">
          <v-textarea
            v-model="description.value.value"
            rows="3"
            variant="outlined"
            :label="$t(`Mô tả`) + ' (✳)'"
            :error-messages="description.errorMessage.value"
            :hide-details="Boolean(!description.errorMessage.value)"
          />
        </v-col>

        <v-col cols="12">
          <v-select
            v-model="discountType.value.value"
            class="w-100"
            variant="outlined"
            item-title="title"
            item-value="value"
            :items="discountTypeOptions"
            :label="$t(`Loại giảm giá`) + ' (✳)'"
            :error-messages="discountType.errorMessage.value"
            :hide-details="Boolean(!discountType.errorMessage.value)"
            @update:model-value="
              (e) => {
                discountValue.value.value =
                  e === EnumDiscountType.PERCENTAGE ? 1 : 1000;
              }
            "
          />
        </v-col>

        <v-col cols="12">
          <v-number-input
            v-model="discountValue.value.value"
            variant="outlined"
            control-variant="stacked"
            :min="
              discountType.value.value === EnumDiscountType.PERCENTAGE ? 1 : 100
            "
            :max="
              discountType.value.value === EnumDiscountType.PERCENTAGE
                ? 1000
                : 500000
            "
            :label="$t(`Giá trị giảm giá`) + ' (✳)'"
            :error-messages="discountValue.errorMessage.value"
            :hide-details="Boolean(!discountValue.errorMessage.value)"
          />
        </v-col>

        <v-col cols="12">
          <v-row dense>
            <v-col cols="6">
              <v-text-field
                v-model="startDate.value.value"
                variant="outlined"
                type="datetime-local"
                :label="$t(`Ngày và giờ bắt đầu`) + ' (✳)'"
                :error-messages="startDate.errorMessage.value"
                :hide-details="Boolean(!startDate.errorMessage.value)"
              />
            </v-col>

            <v-col cols="6">
              <v-text-field
                v-model="endDate.value.value"
                variant="outlined"
                type="datetime-local"
                :label="$t(`Ngày và giờ kết thúc`) + ' (✳)'"
                :error-messages="endDate.errorMessage.value"
                :hide-details="Boolean(!endDate.errorMessage.value)"
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <v-row dense>
            <v-col cols="6">
              <v-number-input
                v-model="usageLimit.value.value"
                variant="outlined"
                control-variant="stacked"
                :min="1"
                :label="$t(`Giới hạn sử dụng`) + ' (✳)'"
                :error-messages="usageLimit.errorMessage.value"
                :hide-details="Boolean(!usageLimit.errorMessage.value)"
              />
            </v-col>

            <v-col cols="6">
              <v-number-input
                v-model="limitPerAccount.value.value"
                variant="outlined"
                control-variant="stacked"
                :min="0"
                :label="$t(`Giới hạn với mỗi tài khoản`)"
                :error-messages="limitPerAccount.errorMessage.value"
                :hide-details="Boolean(!limitPerAccount.errorMessage.value)"
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <v-select
            v-model="conditionType.value.value"
            multiple
            class="w-100"
            variant="outlined"
            item-title="title"
            item-value="value"
            :items="conditionTypeOptions"
            :label="$t(`Đối tượng áp dụng`)"
            :error-messages="conditionType.errorMessage.value"
            :hide-details="Boolean(!conditionType.errorMessage.value)"
          />
        </v-col>
      </v-row>
    </div>

    <template #footer>
      <div
        class="cta-button w-100 justify-center"
        style="border-radius: 6px"
        @click="onSubmit"
      >
        <v-progress-circular
          v-if="Boolean(loading == 'submit-form')"
          width="2"
          size="23"
          color="white"
          indeterminate
        />

        <v-icon v-else size="27">mdi-ticket-percent-outline</v-icon>
        <h3>{{ _id.value.value ? "Cập nhật mã" : "Tạo mã" }}</h3>
      </div>
    </template>
  </CommonDialog>

  <DataTable
    ref="dataTableRef"
    :filters="[
      {
        label: 'Trạng thái',
        field: 'expiryStatus',
        type: 'select',
        items: statusItems,
      },
    ]"
    :showSelect="false"
    :actions="['add']"
    :rowActions="['register']"
    :headers="headers"
    :data="data"
    :loading="Boolean(loading == 'load-table')"
    @change="loadItems"
    @action="onAction"
  >
    <template #row-discountValue="{ item }">
      <div class="text-error">
        <span v-if="(item as any).discountType === EnumDiscountType.FIXED">
          {{ formatCurrency((item as any).discountValue) }}
        </span>

        <span v-else>{{ (item as any).discountValue }}%</span>
      </div>
    </template>

    <template #row-conditionType="{ item }">
      <span>{{ (item as any).conditionType || "Tất cả" }}</span>
    </template>

    <template #row-usageLimit="{ item }">
      <div class="d-flex ga-1">
        <span>{{ (item as any).usageLimit }}</span>
        <span v-if="(item as any).limitPerAccount">
          (Mỗi tài khoản được {{ (item as any).limitPerAccount }} lần)
        </span>
      </div>
    </template>

    <template #row-action="{ item }">
      <div class="d-flex justify-center align-center ga-2">
        <v-btn
          icon
          size="40"
          variant="text"
          @click="onAction({ action: 'update', item })"
        >
          <v-icon size="20">mdi-pencil-outline</v-icon>
        </v-btn>

        <v-switch
          hide-details
          color="primary"
          :loading="Boolean(loading == 'switch-' + (item as any)._id)"
          :model-value="(item as any).isActive"
          @update:model-value="
            (e) => {
              onAction({ action: 'switch', item, isActive: e });
            }
          "
        />
      </div>
    </template>
  </DataTable>
</template>

<style scoped>
.image-container {
  width: 100%;
  height: 10rem;
  overflow: hidden;
  border: 1px solid rgb(197 197 197);
  border-radius: 5px;
}

@media only screen and (max-width: 550px) {
  .image-container {
    height: 8rem !important;
  }
}
</style>
