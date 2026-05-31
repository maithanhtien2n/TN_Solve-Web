<script setup lang="ts">
import { accountService } from "~/services/account";

const stats = ref<any>(null);

const now = new Date();
const monthLabel = now.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });

onMounted(() => {
  accountService.getDashboardStats().then((res) => { stats.value = res.data; }).catch(() => {});
});

definePageMeta({ layout: "admin", title: "Tổng quan" });
</script>

<template>
  <div class="db-wrap">

    <!-- Skeleton -->
    <template v-if="!stats">
      <div class="db-grid db-grid--4">
        <v-skeleton-loader v-for="i in 4" :key="i" type="card" height="100" rounded="lg" />
      </div>
      <div class="db-grid db-grid--3">
        <v-skeleton-loader v-for="i in 6" :key="i" type="card" height="90" rounded="lg" />
      </div>
    </template>

    <template v-else>

      <!-- Row 1: Highlight -->
      <div class="db-grid db-grid--4">
        <div class="db-card db-card--blue">
          <div class="db-card-icon"><v-icon size="20">mdi-account-group-outline</v-icon></div>
          <div class="db-card-content">
            <div class="db-label">Tổng người dùng</div>
            <div class="db-value">{{ stats.totalUsers?.toLocaleString("vi-VN") }}</div>
            <div class="db-sub">+{{ stats.newUsersThisMonth }} mới {{ monthLabel }}</div>
          </div>
        </div>

        <div class="db-card db-card--purple">
          <div class="db-card-icon"><v-icon size="20">mdi-package-variant-closed</v-icon></div>
          <div class="db-card-content">
            <div class="db-label">Gói đang hoạt động</div>
            <div class="db-value">{{ stats.activeSubscriptions?.toLocaleString("vi-VN") }}</div>
            <div class="db-sub">/ {{ stats.totalSubscriptions?.toLocaleString("vi-VN") }} tổng gói</div>
          </div>
        </div>

        <div class="db-card db-card--green">
          <div class="db-card-icon"><v-icon size="20">mdi-trending-up</v-icon></div>
          <div class="db-card-content">
            <div class="db-label">Doanh thu {{ monthLabel }}</div>
            <div class="db-value">{{ formatCurrency(stats.totalRevenueThisMonth) }}</div>
            <div class="db-sub">Gói: {{ formatCurrency(stats.revenueThisMonth) }} · Tín dụng: {{ formatCurrency(stats.creditRevenueThisMonth) }}</div>
          </div>
        </div>

        <div class="db-card db-card--teal">
          <div class="db-card-icon"><v-icon size="20">mdi-cash-multiple</v-icon></div>
          <div class="db-card-content">
            <div class="db-label">Tổng doanh thu</div>
            <div class="db-value">{{ formatCurrency(stats.totalRevenueAllTime) }}</div>
            <div class="db-sub">Tích lũy từ trước đến nay</div>
          </div>
        </div>
      </div>

      <!-- Row 2: Chi tiết -->
      <div class="db-grid db-grid--3">

        <div class="db-stat" @click="navigateTo('/admin/accounts/partner')" style="cursor:pointer">
          <div class="db-stat-icon" style="background:#f3e8ff;color:#7c3aed">
            <v-icon size="18">mdi-handshake-outline</v-icon>
          </div>
          <div>
            <div class="db-stat-label">Cộng tác viên</div>
            <div class="db-stat-value" style="color:#7c3aed">{{ stats.totalPartners?.toLocaleString("vi-VN") }}</div>
          </div>
        </div>

        <div class="db-stat" @click="navigateTo('/admin/credit-history')" style="cursor:pointer">
          <div class="db-stat-icon" style="background:#e0f2fe;color:#0284c7">
            <v-icon size="18">mdi-circle-multiple-outline</v-icon>
          </div>
          <div>
            <div class="db-stat-label">GD tín dụng {{ monthLabel }}</div>
            <div class="db-stat-value" style="color:#0284c7">{{ stats.creditTxThisMonth?.toLocaleString("vi-VN") }} giao dịch</div>
          </div>
        </div>

        <div
          class="db-stat"
          :class="{ 'db-stat--alert': stats.pendingRefunds > 0 }"
          @click="navigateTo('/admin/refund-requests')"
          style="cursor:pointer"
        >
          <div class="db-stat-icon" :style="{ background: stats.pendingRefunds > 0 ? '#fee2e2' : '#f1f5f9', color: stats.pendingRefunds > 0 ? '#dc2626' : '#64748b' }">
            <v-icon size="18">mdi-cash-refund</v-icon>
          </div>
          <div>
            <div class="db-stat-label">Hoàn tiền chờ duyệt</div>
            <div class="db-stat-value" :style="{ color: stats.pendingRefunds > 0 ? '#dc2626' : '#64748b' }">
              {{ stats.pendingRefunds }} yêu cầu
            </div>
          </div>
        </div>

        <div class="db-stat">
          <div class="db-stat-icon" style="background:#d1fae5;color:#059669">
            <v-icon size="18">mdi-check-circle-outline</v-icon>
          </div>
          <div>
            <div class="db-stat-label">Đã duyệt hoàn tiền</div>
            <div class="db-stat-value" style="color:#059669">{{ stats.approvedRefunds }} yêu cầu</div>
          </div>
        </div>

        <div class="db-stat" @click="navigateTo('/admin/transaction-history')" style="cursor:pointer">
          <div class="db-stat-icon" style="background:#fef3c7;color:#d97706">
            <v-icon size="18">mdi-account-cash-outline</v-icon>
          </div>
          <div>
            <div class="db-stat-label">Hoa hồng chờ thanh toán</div>
            <div class="db-stat-value" style="color:#d97706">{{ formatCurrency(stats.pendingCommissions) }}</div>
          </div>
        </div>

        <div class="db-stat">
          <div class="db-stat-icon" style="background:#ecfdf5;color:#059669">
            <v-icon size="18">mdi-cash-check</v-icon>
          </div>
          <div>
            <div class="db-stat-label">Hoa hồng đã thanh toán</div>
            <div class="db-stat-value" style="color:#059669">{{ formatCurrency(stats.paidCommissions) }}</div>
          </div>
        </div>

      </div>

      <!-- Row 3: Bảng gần đây -->
      <div class="db-grid db-grid--2">

        <!-- Gói thuê gần đây -->
        <div class="db-table-card">
          <div class="db-table-header">
            <v-icon size="16" color="primary">mdi-package-variant-closed</v-icon>
            Gói thuê gần đây
            <span class="db-link ml-auto" @click="navigateTo('/admin/service-rentals')">Xem tất cả</span>
          </div>
          <div class="db-table-scroll">
            <table class="db-table">
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Gói</th>
                  <th class="text-right">Tiền</th>
                  <th>Hết hạn</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r, i) in stats.recentRentals" :key="i">
                  <td class="text-nowrap">{{ r.customerInfo }}</td>
                  <td class="text-nowrap">{{ r.note }}</td>
                  <td class="text-right text-nowrap" style="color:#dc2626">{{ formatCurrency(r.price) }}</td>
                  <td class="text-nowrap text-medium-emphasis">{{ r.serviceExpiry }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Người dùng mới -->
        <div class="db-table-card">
          <div class="db-table-header">
            <v-icon size="16" color="success">mdi-account-plus-outline</v-icon>
            Người dùng mới đăng ký
            <span class="db-link ml-auto" @click="navigateTo('/admin/accounts/user')">Xem tất cả</span>
          </div>
          <div class="db-table-scroll">
            <table class="db-table">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Ngày đăng ký</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(u, i) in stats.recentUsers" :key="i">
                  <td class="text-nowrap font-weight-medium">{{ u.name }}</td>
                  <td class="text-nowrap text-medium-emphasis">{{ u.email }}</td>
                  <td class="text-nowrap text-medium-emphasis">{{ u.createdAt }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </template>
  </div>
</template>

<style scoped>
.db-wrap { display: flex; flex-direction: column; gap: 14px; }

/* Grid */
.db-grid { display: grid; gap: 14px; }
.db-grid--4 { grid-template-columns: repeat(4, 1fr); }
.db-grid--3 { grid-template-columns: repeat(3, 1fr); }

@media (max-width: 1100px) { .db-grid--4 { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 800px)  { .db-grid--3 { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px)  {
  .db-grid--4, .db-grid--3, .db-grid--2 { grid-template-columns: 1fr; }
}
.db-grid--2 { grid-template-columns: repeat(2, 1fr); }
@media (max-width: 800px) { .db-grid--2 { grid-template-columns: 1fr; } }

/* Highlight card */
.db-card {
  border-radius: 14px;
  padding: 18px 20px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  color: #fff;
}
.db-card--blue   { background: linear-gradient(135deg, #1e88e5, #42a5f5); }
.db-card--purple { background: linear-gradient(135deg, #7c3aed, #a78bfa); }
.db-card--green  { background: linear-gradient(135deg, #059669, #34d399); }
.db-card--teal   { background: linear-gradient(135deg, #0284c7, #38bdf8); }

.db-card-icon {
  width: 40px; height: 40px;
  background: rgba(255,255,255,0.2);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.db-label { font-size: 0.72rem; opacity: 0.85; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.db-value { font-size: 1.5rem; font-weight: 800; line-height: 1.2; margin-bottom: 2px; }
.db-sub   { font-size: 0.72rem; opacity: 0.8; }

/* Stat card */
.db-stat {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.04);
  transition: box-shadow 0.15s;
}
.db-stat:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.09); }
.db-stat--alert { border-color: #fecaca; }

.db-stat-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.db-stat-label { font-size: 0.73rem; color: #94a3b8; font-weight: 500; margin-bottom: 3px; }
.db-stat-value { font-size: 1rem; font-weight: 700; }
.db-link { font-size: 0.875rem; color: #1e88e5; cursor: pointer; }
.db-link:hover { text-decoration: underline; }

/* Table card */
.db-table-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 6px rgba(0,0,0,0.04);
}
.db-table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.db-table-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #f0f0f0;
}
.db-table {
  width: 100%;
  border-collapse: collapse;
}
.db-table th {
  padding: 10px 14px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  text-align: left;
  white-space: nowrap;
}
.db-table td {
  padding: 12px 14px;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #f8f8f8;
}
.db-table tr:last-child td { border-bottom: none; }
.db-table tr:hover td { background: #fafcff; }
</style>
