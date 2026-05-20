<script setup lang="ts">
const display = ref(false);

onMounted(() => {
  display.value = true;
});
</script>

<template>
  <v-dialog
    v-model="display"
    width="520"
    persistent
    transition="dialog-top-transition"
    style="z-index: 9999"
  >
    <v-card rounded="xl" class="announcement-card">
      <!-- Header -->
      <div class="announcement-header pa-5 pb-4">
        <div class="d-flex align-center" style="gap: 16px">
          <v-avatar color="warning" size="52" class="icon-pulse flex-shrink-0">
            <v-icon size="28" color="white">mdi-wrench-clock</v-icon>
          </v-avatar>
          <div style="padding-left: 4px">
            <div class="text-overline text-warning font-weight-bold" style="letter-spacing: 0.1em">
              Thông báo hệ thống
            </div>
            <div class="text-h6 font-weight-bold text-grey-darken-3">
              Bảo trì & Nâng cấp Tool
            </div>
          </div>
        </div>
      </div>

      <v-divider />

      <!-- Body -->
      <v-card-text class="pa-5">
        <p class="text-body-1 text-grey-darken-2 mb-4">
          Chào mọi người ạ,
        </p>

        <p class="text-body-2 text-grey-darken-2 mb-4" style="line-height: 1.7">
          Hiện tại hệ thống tool đang gặp một số lỗi kỹ thuật phát sinh do
          <strong>veo3 update</strong>. Để đảm bảo trải nghiệm tốt nhất và lâu
          dài cho mọi người, em xin phép tạm đóng tool trong tối đa
          <strong>2 ngày</strong> để tập trung làm lại cấu trúc luồng cho thật
          ổn định.
        </p>

        <v-alert
          type="warning"
          variant="tonal"
          border="start"
          rounded="lg"
          class="mb-4"
          density="compact"
        >
          <div class="d-flex align-center" style="gap: 8px">
            <v-icon size="20" style="flex-shrink: 0">mdi-clock-outline</v-icon>
            <span class="text-body-2 font-weight-medium">
              Dự kiến hoàn thành: <strong>tối đa 2 ngày</strong>
            </span>
          </div>
        </v-alert>

        <v-sheet
          color="green-lighten-5"
          rounded="lg"
          class="pa-4 mb-4"
          border
        >
          <div class="d-flex align-center mb-1" style="gap: 8px">
            <v-icon color="success" size="20" style="flex-shrink: 0">mdi-gift-outline</v-icon>
            <span class="text-body-2 font-weight-bold text-success-darken-1">
              Ưu đãi bù đắp thời gian gián đoạn
            </span>
          </div>
          <p class="text-body-2 text-grey-darken-2 mb-0" style="line-height: 1.6">
            Ngay sau khi mở lại, em sẽ cộng bù
            <v-chip color="success" size="x-small" variant="tonal" class="mx-1 font-weight-bold">
              x2
            </v-chip>
            số ngày bảo trì vào tài khoản của <strong>tất cả thành viên</strong>.
          </p>
        </v-sheet>

        <p class="text-body-2 text-grey-darken-1 text-center mb-0" style="line-height: 1.6">
          Rất mong mọi người thông cảm cho sự bất tiện này và kiên nhẫn đợi em
          hoàn thiện nhé. Em cảm ơn cả nhà rất nhiều!
          <strong>@All</strong>
        </p>
      </v-card-text>

      <v-divider />

      <!-- Footer -->
      <v-card-actions class="pa-4">
        <v-btn
          block
          color="warning"
          variant="flat"
          size="large"
          rounded="lg"
          class="font-weight-bold"
          @click="display = false"
        >
          Tôi đã hiểu
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.announcement-card {
  overflow: hidden;
}

.announcement-header {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.icon-pulse {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(245, 158, 11, 0);
  }
}
</style>
