<script setup lang="ts">
const { t } = useI18n();

useSeo({
  title: t("Đăng kí gói dịch vụ"),
  description:
    "Nền tảng AI giúp bạn tạo video chuyên nghiệp chỉ trong vài phút",
  image: "/images/page-video.png",
});

definePageMeta({ middleware: "auth" });
</script>

<template>
  <div class="max-w-xl mx-auto">
    <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">
      Thanh Toán Gói Dịch Vụ
    </h1>

    <div class="text-center">
      <img
        src="/images/qr-payment.png"
        alt="qr-thanh-toan"
        style="height: 40rem"
      />
    </div>

    <div
      class="mt-8 p-4 bg-green-50 border-l-4 border-green-500 text-green-800 rounded-md shadow-inner"
    >
      <p class="font-bold mb-1">⏰ Lưu ý quan trọng:</p>
      <ul class="list-disc ml-5 space-y-1 text-sm">
        <li>
          Vui lòng **nhập email tài khoản** của bạn vào nội dung chuyển khoản để
          chúng tôi có thể **thiết lập và kích hoạt** dịch vụ.
        </li>
        <li>
          Gói dịch vụ của bạn sẽ được **kích hoạt tự động** sau **5-10 phút** kể
          từ khi giao dịch thành công.
        </li>
        <li>
          Nếu sau 10 phút gói chưa được kích hoạt, vui lòng liên hệ Zalo hỗ trợ:
          <a
            :href="`https://zalo.me/0343027232`"
            target="_blank"
            class="font-extrabold text-green-700 hover:underline"
          >
            034 302 7232
          </a>
          để được hỗ trợ nhanh nhất.
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* Cần có Tailwind CSS hoặc các styles tương đương để hiển thị giao diện này */
.UiDivider {
  height: 1px;
  background-color: #e5e7eb; /* gray-200 */
}
</style>
