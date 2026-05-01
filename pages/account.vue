<script setup lang="ts">
import { accountService } from "~/services/account";

const { isMobile } = useDevice();
const { onGetterUserData: userData } = useAppStore();

const tab = ref("packages");
const packageHistory = ref<any>([]);
const creditHistory = ref<any>([]);

onMounted(async () => {
  await accountService.getMyPackageHistory({}).then((res) => {
    packageHistory.value = res.data;
  });

  await accountService.getMyCreditHistory({}).then((res) => {
    creditHistory.value = res.data;
  });
});

definePageMeta({ middleware: "auth" });
</script>

<template>
  <div
    v-if="!userData?.email"
    class="d-flex justify-center flex-column align-center ga-3 pt-10 pb-16"
  >
    <v-progress-circular width="2" size="40" color="primary" indeterminate />
    {{ $t("Đang tải dữ liệu...") }}
  </div>

  <v-container v-else fluid class="pa-0 bg-white">
    <v-row no-gutters>
      <v-col cols="12">
        <!-- 1. Phần Profile -->
        <v-card
          variant="flat"
          class="rounded-0 w-100 bg-white border-bottom pt-5"
        >
          <v-row
            align="center"
            justify="center"
            :class="isMobile ? 'mb-4' : 'mb-10'"
            no-gutters
          >
            <v-col cols="12" md="3" class="text-center">
              <v-avatar size="140" class="border-lg elevation-1">
                <v-img :src="userData?.avatar" cover />
              </v-avatar>
              <h2 class="text-h5 mt-4 font-weight-bold">
                {{ userData?.name }}
              </h2>
            </v-col>

            <v-col cols="12" md="6" :class="isMobile ? 'mt-7' : ''">
              <div
                v-if="!isMobile"
                class="text-overline text-primary font-weight-bold mb-7"
              >
                Thông tin tài khoản
              </div>

              <v-row dense>
                <v-col cols="12">
                  <!-- SỬA LỖI: Dùng :model-value thay vì v-model cho dữ liệu Store readonly -->
                  <v-text-field
                    :model-value="userData?.name"
                    label="Họ và tên"
                    variant="outlined"
                    density="comfortable"
                    readonly
                    bg-color="grey-lighten-5"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    :model-value="userData?.email"
                    label="Email"
                    variant="outlined"
                    density="comfortable"
                    readonly
                    bg-color="grey-lighten-5"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>

        <!-- 2. Hệ thống Tabs -->
        <div class="bg-white border-bottom">
          <v-tabs v-model="tab" color="primary" align-tabs="start">
            <v-tab value="packages" class="text-none font-weight-bold">
              <v-icon start>mdi-package-variant-closed</v-icon> Lịch sử gói
            </v-tab>
            <v-tab value="credits" class="text-none font-weight-bold">
              <v-icon start>mdi-database-clock-outline</v-icon> Lịch sử tín dụng
            </v-tab>
          </v-tabs>
        </div>

        <!-- 3. Nội dung bảng -->
        <v-card variant="flat" class="rounded-0 w-100 bg-white">
          <v-window v-model="tab">
            <v-window-item value="packages">
              <v-table hover class="custom-table">
                <thead>
                  <tr>
                    <th class="text-left column-1 text-nowrap">GÓI MUA</th>
                    <th class="text-left column-2 text-nowrap">GIÁ TIỀN</th>
                    <th class="text-right column-3 text-nowrap">TRẠNG THÁI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in packageHistory" :key="item.id">
                    <td class="column-1 py-4">
                      <span class="font-bold text-nowrap">
                        {{ item.note }}
                      </span>
                      <br />
                      <small class="text-nowrap">
                        {{ item.serviceStartDate }} - {{ item.serviceExpiry }}
                      </small>
                    </td>
                    <td
                      class="text-left column-2 text-grey-darken-1 text-nowrap"
                    >
                      <span class="font-bold text-primary text-nowrap">
                        {{ formatCurrency(item.price) }}
                      </span>
                      <br />
                      <small v-if="+item.discount" class="text-red">
                        Có mã giảm
                        {{ formatCurrency(+item.discount) }}
                      </small>
                    </td>
                    <td class="text-right column-3 py-4">
                      <v-chip :class="`text-${item.statusColor}`">
                        {{ item.statusText }}
                      </v-chip>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-window-item>

            <v-window-item value="credits">
              <v-table hover class="custom-table">
                <thead>
                  <tr>
                    <th class="text-left column-1 text-nowrap">SỐ TÍN DỤNG</th>
                    <th class="text-left column-2 text-nowrap">GIÁ TIỀN</th>
                    <th class="text-right column-3 text-nowrap">THỜI GIAN</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in creditHistory" :key="item.id">
                    <td class="column-1">
                      <span class="font-bold text-nowrap py-4">
                        {{
                          item.creditAmount === -1
                            ? "Không giới hạn 💎"
                            : `Mua ${item.creditAmount}💎`
                        }}

                        <span
                          v-if="[11000, 24000].includes(item.creditAmount)"
                          class="text-nowrap"
                        >
                          {{
                            `(+ ${
                              item.creditAmount === 11000 ? "1,000" : "4,000"
                            } KM)`
                          }}
                        </span>
                      </span>
                      <br />
                      <small
                        v-if="item.creditAmount === -1"
                        class="text-nowrap"
                      >
                        {{ item.serviceStartDate }} - {{ item.serviceExpiry }}
                      </small>
                    </td>
                    <td
                      class="text-left column-2 text-grey-darken-1 text-nowrap"
                    >
                      <span class="font-bold text-primary text-nowrap">
                        {{ formatCurrency(item.price) }}
                      </span>
                      <br />
                      <small v-if="+item.discount" class="text-red">
                        Có mã giảm
                        {{ formatCurrency(+item.discount) }}
                      </small>
                    </td>
                    <td
                      class="text-right column-3 font-weight-bold text-success text-nowrap"
                    >
                      {{ item.serviceStartDate }}
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-card {
  border-radius: 0 !important;
}
.border-bottom {
  border-bottom: 1px solid #e0e0e0 !important;
}

/* Chia cột 3 phần đều nhau */
.column-1 {
  width: 50%;
  padding-left: 15px !important;
}
.column-2 {
  width: 25%;
}
.column-3 {
  width: 25%;
  padding-right: 15px !important;
}

.custom-table {
  background: white !important;
  width: 100%;
}

.custom-table :deep(th) {
  height: 52px !important;
  font-size: 0.75rem !important;
  color: #757575 !important;
  text-transform: uppercase;
  letter-spacing: 1px !important;
  background-color: #fcfcfc !important;
}

.custom-table :deep(td) {
  height: 60px !important;
  font-size: 0.95rem !important;
  border-bottom: 1px solid #f5f5f5 !important;
}

:deep(.v-window__container) {
  height: auto !important;
}
</style>
