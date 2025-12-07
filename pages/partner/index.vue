<script setup lang="ts">
const router = useRouter();
const localePath = useLocalePath();

const { onGetterUserData: userData } = useAppStore();
const { onGetterMasterData } = useMasterDataStore();

const dashboard = computed(() => onGetterMasterData.value["dashboard"]);

const onClickViewDashboardPartnerDetail = (id: string) => {
  if (userData.value?.role !== EnumAccountRole.ADMIN) return;
  window.location.href = `https://tnsolve.com/partner?id=${id}`;
};

definePageMeta({ layout: "partner" });
</script>

<template>
  <v-container class="ma-0 pa-0">
    <v-row dense>
      <v-col cols="12" lg="5">
        <v-card variant="flat" color="primary" class="text-white" height="100%">
          <v-card-text>
            <div class="d-flex align-center mb-1">
              <v-icon size="x-large" class="opacity-75 mr-3"
                >mdi-cash-clock</v-icon
              >
              <div class="text-h6 font-bold">Số dư chờ thanh toán</div>
            </div>
            <div class="text-h3 font-bold mt-4">
              {{ formatCurrency(dashboard.pendingBalance) }}
            </div>
            <div class="text-body-2 opacity-80 mt-1">
              Sẽ được thanh toán vào kỳ tới
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="3">
        <v-card variant="tonal" color="green-darken-1" height="100%">
          <v-card-text>
            <div class="d-flex align-center mb-1">
              <v-icon size="large" class="mr-3">mdi-check-decagram</v-icon>
              <div class="text-subtitle-1 font-bold text-grey-darken-3">
                Tổng đã thanh toán
              </div>
            </div>
            <div class="text-h4 font-bold text-grey-darken-4 mt-4">
              {{ formatCurrency(dashboard.paidBalance) }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="4">
        <v-row dense>
          <v-col cols="12">
            <v-card variant="tonal" color="purple-darken-1">
              <v-card-text>
                <div class="d-flex align-center">
                  <v-icon size="large" class="mr-3">mdi-account-group</v-icon>
                  <div>
                    <div class="text-body-2 text-grey-darken-2">
                      Tổng người giới thiệu đã thuê
                    </div>
                    <div class="text-h5 font-bold text-grey-darken-4">
                      {{ dashboard.totalReferrals }}
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card variant="tonal" color="amber-darken-1">
              <v-card-text>
                <div class="d-flex align-center">
                  <v-icon size="large" class="mr-3">mdi-star-circle</v-icon>
                  <div>
                    <div class="text-body-2 text-grey-darken-2">
                      Bậc tháng này
                    </div>
                    <div class="text-h5 font-bold text-grey-darken-4">
                      {{ dashboard.estimatedRate }}
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" class="mt-4">
        <v-card variant="outlined">
          <v-card-title class="text-h6">Các bậc hoa hồng</v-card-title>
          <v-card-subtitle class="text-wrap">
            Hoa hồng vĩnh viễn được chốt cuối tháng dựa trên số giới thiệu mới.
          </v-card-subtitle>

          <v-card-text>
            <v-row dense>
              <v-col
                v-for="tier in dashboard.commissionTier"
                :key="tier.name"
                cols="12"
                sm="3"
              >
                <v-sheet
                  height="100%"
                  variant="tonal"
                  class="pa-3 rounded-lg d-flex flex-column justify-center align-center"
                >
                  <div class="text-caption text-grey-darken-1">
                    {{ tier.name }}
                  </div>

                  <div class="font-bold text-blue-darken-1 text-subtitle-1">
                    {{ tier.rate }}
                  </div>

                  <div class="text-caption text-medium-emphasis">
                    ({{ tier.requirement }})
                  </div>
                </v-sheet>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col
        v-if="
          Array.isArray(dashboard.leaderboard) && dashboard.leaderboard?.length
        "
        cols="12"
        class="mt-4"
      >
        <v-card variant="outlined">
          <v-card-title class="text-h6">
            <v-icon color="amber-darken-1" class="mr-2">mdi-trophy</v-icon>
            Bảng xếp hạng CTV của tháng
          </v-card-title>
          <v-card-subtitle class="text-wrap">
            Bảng xếp hạng được cập nhật dựa trên số giới thiệu (đã thuê) mới
            trong tháng này.
          </v-card-subtitle>

          <v-card-text class="ma-0 px-0 pt-0">
            <v-list lines="one" max-width="400">
              <v-list-item
                v-for="(item, index) in dashboard.leaderboard"
                class="mt-3 py-2"
                :key="item.id"
                :title="item.name"
                :class="{
                  'bg-grey-lighten-2':
                    dashboard?.accountId &&
                    dashboard?.accountId === item?.partnerId,
                  'cursor-pointer': userData?.role === EnumAccountRole.ADMIN,
                }"
                :subtitle="`${item.count} lượt giới thiệu`"
                @click="onClickViewDashboardPartnerDetail(item.partnerId)"
              >
                <template #prepend>
                  <v-avatar :color="getRankColor(index + 1)">
                    <span class="text-white font-bold">
                      {{ index + 1 }}
                    </span>
                  </v-avatar>
                </template>

                <template #append v-if="index === 0">
                  <v-icon color="amber-darken-2">mdi-crown</v-icon>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
