<script setup lang="ts">
const router = useRouter();

const { onGetterUserData: userData } = useAppStore();
const { onGetterMasterData } = useMasterDataStore();

const dashboard = computed(() => onGetterMasterData.value["dashboard"]);
// User thường (chưa mở khóa CTV) xem trang tiến độ; PARTNER/ADMIN xem dashboard đầy đủ
const showFullDashboard = computed(() =>
  [EnumAccountRole.PARTNER, EnumAccountRole.ADMIN].includes(
    userData.value?.role
  )
);
// Trùng với COMMISSION_TIER ở backend (src/core/constants/options.ts) — hiện
// tĩnh ở đây vì bậc hoa hồng ít khi đổi, user thường chưa gọi được API dashboard.
const commissionTiers = [
  { name: "Tiêu chuẩn", requirement: "1-5 người/tháng", rate: "15%" },
  { name: "Bạc", requirement: "6-15 người/tháng", rate: "20%" },
  { name: "Vàng", requirement: "16-30 người/tháng", rate: "25%" },
  { name: "Kim Cương", requirement: "31+ người/tháng", rate: "30%" },
];

const referralProgress = computed(() => userData.value?.referralProgress);
const progressPercent = computed(() => {
  if (!referralProgress.value?.required) return 0;
  return Math.min(
    100,
    (referralProgress.value.count / referralProgress.value.required) * 100
  );
});

const isCopied = ref<boolean>(false);
const onCopyReferralLink = async () => {
  if (!userData.value?.referralLink) return;
  try {
    await navigator.clipboard.writeText(userData.value.referralLink);
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy referral link: ", err);
  }
};

// Khớp TEST_AMOUNT ở core/constants/common.ts (server) — xem giải thích đầy
// đủ ở doi-tac/thanh-toan.vue (cùng cơ chế).
const REFERRAL_TEST_AMOUNT = 3;
const isCodeCopied = ref<boolean>(false);
const onCopyReferralCode = async () => {
  if (!userData.value?._id) return;
  try {
    await navigator.clipboard.writeText(userData.value._id);
    isCodeCopied.value = true;
    setTimeout(() => {
      isCodeCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy referral code: ", err);
  }
};

const onClickViewDashboardPartnerDetail = (id: string) => {
  if (userData.value?.role !== EnumAccountRole.ADMIN) return;
  router.push(`/doi-tac?id=${id}`);
  // window.location.href = `https://tnsolve.com/partner?id=${id}`;
};

// Popup hướng dẫn kiếm tiền Affiliate — hiện mỗi lần vào trang /doi-tac
const tutorialDialogRef = ref<any>(null);
onMounted(() => {
  tutorialDialogRef.value?.onDisplay(true);
});

definePageMeta({ layout: "partner", title: "Tổng quan" });
</script>

<template>
  <CommonDialog
    ref="tutorialDialogRef"
    title="Hướng dẫn kiếm tiền Affiliate từ TN Solve"
    width="900"
  >
    <div class="tutorial-video-wrapper">
      <iframe
        src="https://www.youtube.com/embed/xHkhOqqIaxE"
        title="HƯỚNG DẪN KIẾM TIỀN AFFILIATE TỪ TOOL TN SOLVE"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      />
    </div>
  </CommonDialog>

  <v-container v-if="!showFullDashboard" class="ma-0 pa-0">
    <v-row justify="center">
      <v-col cols="12" md="9" lg="7">
        <v-card class="ctv-card" elevation="3">
          <div class="ctv-hero">
            <div class="ctv-hero-glow"></div>
            <div class="ctv-hero-badge">
              <v-icon size="34" color="white">mdi-trophy-award</v-icon>
            </div>
            <h2 class="ctv-hero-title">Trở thành Cộng tác viên</h2>
            <p class="ctv-hero-subtitle">
              Chia sẻ link giới thiệu của bạn. Khi có đủ
              {{ referralProgress?.required || 3 }} người đăng ký
              <b>thuê gói</b> thành công, bạn sẽ chính thức trở thành
              <b>Cộng tác viên</b> và bắt đầu nhận hoa hồng từ mỗi lượt giới
              thiệu.
            </p>
          </div>

          <v-card-text class="ctv-body">
            <div class="ctv-progress-row">
              <div class="ctv-ring">
                <v-progress-circular
                  :model-value="progressPercent"
                  :size="104"
                  :width="9"
                  color="primary"
                  bg-color="#e8ecf3"
                >
                  <span class="ctv-ring-count">
                    {{ referralProgress?.count || 0 }}<small>/{{ referralProgress?.required || 3 }}</small>
                  </span>
                </v-progress-circular>
              </div>

              <div class="ctv-progress-info">
                <div class="ctv-steps">
                  <div
                    v-for="i in referralProgress?.required || 3"
                    :key="i"
                    class="ctv-step"
                    :class="{ done: i <= (referralProgress?.count || 0) }"
                  >
                    <v-icon size="18">
                      {{ i <= (referralProgress?.count || 0) ? "mdi-check-bold" : "mdi-account-outline" }}
                    </v-icon>
                  </div>
                </div>

                <div class="ctv-hint">
                  <template v-if="(referralProgress?.count || 0) >= (referralProgress?.required || 3)">
                    🎉 Bạn đã đủ điều kiện — đang xử lý mở khóa!
                  </template>
                  <template v-else>
                    Còn thiếu
                    <b class="text-primary">{{
                      Math.max(
                        0,
                        (referralProgress?.required || 3) - (referralProgress?.count || 0)
                      )
                    }}</b>
                    người thuê gói nữa để mở khóa hoa hồng giới thiệu.
                  </template>
                </div>
              </div>
            </div>

            <v-divider class="my-5" />

            <h3 class="mb-1 font-bold">CÁC BẬC HOA HỒNG</h3>
            <div class="ctv-tiers-note">
              Hoa hồng được tính <b>vĩnh viễn</b> — người bạn giới thiệu càng
              gia hạn thêm gói ở các tháng sau, bạn vẫn tiếp tục nhận hoa hồng
              theo đúng mức này, không chỉ lần mua đầu tiên.
            </div>
            <div class="ctv-tiers">
              <div v-for="tier in commissionTiers" :key="tier.name" class="ctv-tier">
                <div class="ctv-tier-name">{{ tier.name }}</div>
                <div class="ctv-tier-rate">{{ tier.rate }}</div>
                <div class="ctv-tier-req">({{ tier.requirement }})</div>
              </div>
            </div>

            <v-divider class="my-5" />

            <h3 class="mb-2 font-bold">LINK GIỚI THIỆU CỦA BẠN</h3>
            <v-text-field
              readonly
              hide-details
              variant="outlined"
              title="Sao chép link"
              style="cursor: pointer"
              :color="isCopied ? 'success' : 'default'"
              :model-value="userData?.referralLink"
              :append-inner-icon="isCopied ? 'mdi-check' : 'mdi-content-copy'"
              @click:append-inner="onCopyReferralLink()"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-container v-else class="ma-0 pa-0">
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

            <span v-if="dashboard.lastMonthPayment" class="mt-3">
              {{ formatCurrency(dashboard.lastMonthPayment) }} (tháng trước)
            </span>
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
          <v-card-text>
            <v-row dense>
              <v-col cols="12" md="6">
                <h3 class="mb-2 font-bold">MÃ GIỚI THIỆU (KHÁCH NHẬP ĐƯỢC GIẢM 10.000Đ)</h3>
                <v-text-field
                  readonly
                  hide-details
                  flat
                  variant="solo-filled"
                  bg-color="grey-lighten-3"
                  title="Sao chép mã"
                  style="cursor: pointer"
                  :color="isCodeCopied ? 'success' : 'default'"
                  :model-value="userData?._id"
                  :append-inner-icon="isCodeCopied ? 'mdi-check' : 'mdi-content-copy'"
                  @click:append-inner="onCopyReferralCode()"
                />
              </v-col>

              <v-col cols="12" md="6">
                <h3 class="mb-2 font-bold">LINK GIỚI THIỆU CỦA BẠN (KHÁCH BẤM VÀO ĐƯỢC TẶNG {{ REFERRAL_TEST_AMOUNT }} LƯỢT DÙNG THỬ)</h3>
                <v-text-field
                  readonly
                  hide-details
                  flat
                  variant="solo-filled"
                  bg-color="grey-lighten-3"
                  title="Sao chép link"
                  style="cursor: pointer"
                  :color="isCopied ? 'success' : 'default'"
                  :model-value="userData?.referralLink"
                  :append-inner-icon="isCopied ? 'mdi-check' : 'mdi-content-copy'"
                  @click:append-inner="onCopyReferralLink()"
                />
              </v-col>
            </v-row>

            <p class="mt-3 mb-0 text-medium-emphasis">
              Dùng cách nào cũng được — cả 2 đều tự gán bạn là người giới
              thiệu cho khách. Muốn khách <b>dùng thử trước</b> thì gửi
              <b>link</b>, muốn <b>kích thích khách mua ngay</b> thì gửi
              <b>mã giảm giá</b>.
            </p>
          </v-card-text>
        </v-card>
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
                :class="{
                  'bg-grey-lighten-2':
                    dashboard?.accountId &&
                    dashboard?.accountId === item?.partnerId,
                  'cursor-pointer': userData?.role === EnumAccountRole.ADMIN,
                }"
                @click="onClickViewDashboardPartnerDetail(item.partnerId)"
              >
                <template #prepend>
                  <v-avatar :color="getRankColor(+index + 1)">
                    <span class="text-white font-bold">
                      {{ +index + 1 }}
                    </span>
                  </v-avatar>
                </template>

                <template #append v-if="index === 0">
                  <v-icon color="amber-darken-2">mdi-crown</v-icon>
                </template>

                <template #title>
                  <span>{{ item.name }}</span>
                  <br />
                  <small class="text-grey-darken-2">
                    {{ `${item.count} lượt giới thiệu` }}
                  </small>
                </template>

                <!-- <template #subtitle>
                  <span>{{ `${item.count} lượt giới thiệu` }}</span>
                </template> -->
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.tutorial-video-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* tỉ lệ 16:9 */
}

.tutorial-video-wrapper iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.ctv-card {
  overflow: hidden;
  border-radius: 18px;
}

.ctv-hero {
  position: relative;
  padding: 34px 28px 30px;
  text-align: center;
  color: white;
  overflow: hidden;
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 55%, #3b82f6 100%);
}

.ctv-hero-glow {
  position: absolute;
  width: 240px;
  height: 240px;
  top: -90px;
  right: -70px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.25), transparent 70%);
}

.ctv-hero-badge {
  position: relative;
  z-index: 1;
  width: 64px;
  height: 64px;
  margin: 0 auto 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.18);
}

.ctv-hero-title {
  position: relative;
  z-index: 1;
  font-size: 1.45rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.ctv-hero-subtitle {
  position: relative;
  z-index: 1;
  font-size: 0.92rem;
  line-height: 1.55;
  opacity: 0.94;
  max-width: 480px;
  margin: 0 auto;
}

.ctv-body {
  padding: 28px !important;
}

.ctv-progress-row {
  display: flex;
  align-items: center;
  gap: 28px;
  flex-wrap: wrap;
}

.ctv-ring {
  flex-shrink: 0;
}

.ctv-ring-count {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e3a8a;
}

.ctv-ring-count small {
  font-size: 0.85rem;
  font-weight: 500;
  color: #777;
}

.ctv-progress-info {
  flex: 1;
  min-width: 220px;
}

.ctv-steps {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.ctv-step {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9aa5b1;
  background: #eef1f6;
  transition: all 0.25s ease;
}

.ctv-step.done {
  color: white;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.35);
}

.ctv-hint {
  font-size: 0.92rem;
  color: #555;
}

.ctv-tiers-note {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 14px;
}

.ctv-tiers {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.ctv-tier {
  padding: 12px 8px;
  border-radius: 10px;
  text-align: center;
  background: #eef3fc;
}

.ctv-tier-name {
  font-size: 0.75rem;
  color: #667;
}

.ctv-tier-rate {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e3a8a;
  margin-top: 2px;
}

.ctv-tier-req {
  font-size: 0.72rem;
  color: #888;
  margin-top: 2px;
}

@media only screen and (max-width: 600px) {
  .ctv-hero {
    padding: 28px 20px 24px;
  }

  .ctv-progress-row {
    flex-direction: column;
    text-align: center;
  }

  .ctv-tiers {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
