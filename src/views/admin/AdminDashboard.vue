<template>
  <div class="dashboard">
    <div class="page-container">

      <!-- Header -->
      <div class="page-header">
        <div>
          <p class="page-eyebrow">✦ TỔNG QUAN HỆ THỐNG</p>
          <h1 class="page-title">Trang Quản Trị</h1>
          <p class="page-sub">Quản lý hệ thống thư viện và yêu cầu mượn sách</p>
        </div>
        <div class="header-date">
          <i class="fas fa-calendar-alt"></i>
          {{ currentDate }}
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="state-box">
        <div class="spinner"></div>
        <p>Đang tải thống kê...</p>
      </div>

      <template v-else>

        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon stat-icon--yellow">
              <i class="fas fa-clock"></i>
            </div>
            <div class="stat-body">
              <span class="stat-label">Chờ duyệt</span>
              <span class="stat-num">{{ stats.pending }}</span>
            </div>
            <router-link to="/admin/pending" class="stat-link">
              Xem ngay <i class="fas fa-arrow-right"></i>
            </router-link>
          </div>

          <div class="stat-card">
            <div class="stat-icon stat-icon--green">
              <i class="fas fa-book-reader"></i>
            </div>
            <div class="stat-body">
              <span class="stat-label">Đang mượn</span>
              <span class="stat-num">{{ stats.currentBorrows }}</span>
            </div>
            <router-link to="/admin/approved" class="stat-link">
              Xem ngay <i class="fas fa-arrow-right"></i>
            </router-link>
          </div>

          <div class="stat-card">
            <div class="stat-icon stat-icon--brown">
              <i class="fas fa-book"></i>
            </div>
            <div class="stat-body">
              <span class="stat-label">Tổng số sách</span>
              <span class="stat-num">{{ stats.totalBooks }}</span>
            </div>
            <router-link to="/admin/manage-sach" class="stat-link">
              Quản lý <i class="fas fa-arrow-right"></i>
            </router-link>
          </div>

          <div class="stat-card">
            <div class="stat-icon stat-icon--blue">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-body">
              <span class="stat-label">Người dùng</span>
              <span class="stat-num">{{ stats.totalUsers }}</span>
            </div>
            <span class="stat-link muted">Tổng cộng</span>
          </div>
        </div>

        <!-- Secondary stats row -->
        <div class="secondary-stats">
          <div class="sec-stat">
            <span class="sec-label">Tổng đã duyệt</span>
            <span class="sec-num">{{ stats.approved }}</span>
          </div>
          <div class="sec-divider"></div>
          <div class="sec-stat">
            <span class="sec-label">Đã trả</span>
            <span class="sec-num">{{ stats.returned }}</span>
          </div>
          <div class="sec-divider"></div>
          <div class="sec-stat">
            <span class="sec-label">Đang mượn</span>
            <span class="sec-num">{{ stats.currentBorrows }}</span>
          </div>
          <div class="sec-divider"></div>
          <div class="sec-stat">
            <span class="sec-label">Chờ xử lý</span>
            <span class="sec-num sec-num--warn">{{ stats.pending }}</span>
          </div>
        </div>

        <!-- Quick access -->
        <div class="section-header">
          <p class="section-eyebrow">✦ TRUY CẬP NHANH</p>
          <h2 class="section-title">Chức Năng Quản Trị</h2>
        </div>

        <div class="action-grid">
          <router-link to="/admin/pending" class="action-card">
            <div class="action-card-top">
              <div class="action-icon action-icon--yellow">
                <i class="fas fa-clock"></i>
              </div>
              <span v-if="stats.pending > 0" class="action-badge">{{ stats.pending }}</span>
            </div>
            <h4 class="action-title">Yêu Cầu Đang Chờ</h4>
            <p class="action-desc">Duyệt các yêu cầu mượn sách mới từ độc giả</p>
            <span class="action-cta">Duyệt ngay <i class="fas fa-arrow-right"></i></span>
          </router-link>

          <router-link to="/admin/manage-sach" class="action-card">
            <div class="action-card-top">
              <div class="action-icon action-icon--brown">
                <i class="fas fa-book"></i>
              </div>
            </div>
            <h4 class="action-title">Quản Lý Sách</h4>
            <p class="action-desc">Thêm, chỉnh sửa, xoá sách trong hệ thống</p>
            <span class="action-cta">Quản lý <i class="fas fa-arrow-right"></i></span>
          </router-link>
          
          <router-link to="/admin/manage-nxb" class="action-card">
            <div class="action-card-top">
              <div class="action-icon action-icon--purple">
               <i class="fas fa-building"></i>
              </div>
            </div>
            <h4 class="action-title">Quản Lý NXB</h4>
            <p class="action-desc">Thêm, chỉnh sửa, xoá nhà xuất bản trong hệ thống</p>
            <span class="action-cta">Quản lý <i class="fas fa-arrow-right"></i></span>
          </router-link>

          <router-link to="/admin/approved" class="action-card">
            <div class="action-card-top">
              <div class="action-icon action-icon--green">
                <i class="fas fa-check-circle"></i>
              </div>
            </div>
            <h4 class="action-title">Lịch Sử Đã Duyệt</h4>
            <p class="action-desc">Xem và quản lý các yêu cầu đã được duyệt</p>
            <span class="action-cta">Xem lịch sử <i class="fas fa-arrow-right"></i></span>
          </router-link>

          <router-link to="/admin/borrow-all" class="action-card">
            <div class="action-card-top">
              <div class="action-icon action-icon--blue">
                <i class="fas fa-list-alt"></i>
              </div>
            </div>
            <h4 class="action-title">Tất Cả Lịch Sử Mượn</h4>
            <p class="action-desc">Xem toàn bộ lịch sử mượn sách trong hệ thống</p>
            <span class="action-cta">Xem tất cả <i class="fas fa-arrow-right"></i></span>
          </router-link>
        </div>

        <!-- ══ THỐNG KÊ BIỂU ĐỒ ══ -->
        <div class="section-header" style="margin-top:3rem">
          <p class="section-eyebrow">✦ PHÂN TÍCH DỮ LIỆU</p>
          <h2 class="section-title">Thống Kê Chi Tiết</h2>
        </div>

        <div v-if="loadingChart" class="state-box" style="padding:3rem">
          <div class="spinner"></div>
          <p>Đang tải biểu đồ...</p>
        </div>

        <template v-else-if="chartData">
          <!-- Row 1: cột tháng + donut -->
          <div class="chart-row">
            <div class="chart-card chart-wide">
              <div class="chart-header">
                <h3 class="chart-title"><i class="fas fa-chart-bar me-2"></i>Lượt mượn theo tháng</h3>
                <span class="chart-badge">{{ currentYear }}</span>
              </div>
              <div class="bar-chart">
                <div v-for="item in chartData.chartThang" :key="item.thang" class="bar-col">
                  <span class="bar-val">{{ item.soLuot || '' }}</span>
                  <div class="bar" :style="{ height: barHeight(item.soLuot) }" :title="`${item.thang}: ${item.soLuot} lượt`"></div>
                  <span class="bar-label">{{ item.thang }}</span>
                </div>
              </div>
            </div>

            <div class="chart-card chart-narrow">
              <div class="chart-header">
                <h3 class="chart-title"><i class="fas fa-chart-pie me-2"></i>Trạng thái mượn</h3>
              </div>
              <div class="donut-wrap">
                <svg viewBox="0 0 120 120" class="donut-svg">
                  <circle cx="60" cy="60" r="45" fill="none" stroke="#f0ebe4" stroke-width="18"/>
                  <circle
                    v-for="(seg, i) in donutSegments" :key="i"
                    cx="60" cy="60" r="45" fill="none"
                    :stroke="seg.color" stroke-width="18"
                    :stroke-dasharray="`${seg.dash} ${seg.gap}`"
                    :stroke-dashoffset="seg.offset"
                  />
                <text x="60" y="56" text-anchor="middle" font-size="13" font-weight="700" fill="#1a120e" 
                  style="transform: rotate(90deg); transform-origin: 60px 56px;">
                  {{ stats.approved + stats.returned + stats.pending }}
                </text>
                <text x="60" y="70" text-anchor="middle" font-size="7" fill="#9a8a84" 
                  style="transform: rotate(90deg); transform-origin: 60px 70px;">
                  tổng
                </text>
                </svg>
              </div>
              <div class="donut-legend">
                <div v-for="(item, i) in chartData.chartTrangThai" :key="i" class="legend-item">
                  <span class="legend-dot" :style="{ background: donutColors[i] }"></span>
                  <span class="legend-label">{{ item.label }}</span>
                  <span class="legend-val">{{ item.value }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Row 2: top sách + top user -->
          <div class="chart-row">
            <div class="chart-card">
              <div class="chart-header">
                <h3 class="chart-title"><i class="fas fa-trophy me-2"></i>Top 5 sách mượn nhiều</h3>
              </div>
              <div class="top-list">
                <div v-for="(item, i) in chartData.topSach" :key="i" class="top-item">
                  <div class="top-rank" :class="`rank-${i+1}`">{{ i + 1 }}</div>
                  <div class="top-info">
                    <p class="top-name">{{ item.tenSach }}</p>
                    <p class="top-sub">{{ item.tacGia || 'Chưa rõ tác giả' }}</p>
                  </div>
                  <div class="top-bar-wrap">
                    <div class="top-bar" :style="{ width: topBarWidth(item.soLuot, chartData.topSach) }"></div>
                  </div>
                  <span class="top-count">{{ item.soLuot }}</span>
                </div>
                <div v-if="!chartData.topSach.length" class="empty-hint">Chưa có dữ liệu</div>
              </div>
            </div>

            <div class="chart-card">
              <div class="chart-header">
                <h3 class="chart-title"><i class="fas fa-users me-2"></i>Top 5 độc giả tích cực</h3>
              </div>
              <div class="top-list">
                <div v-for="(item, i) in chartData.topUser" :key="i" class="top-item">
                  <div class="top-rank" :class="`rank-${i+1}`">{{ i + 1 }}</div>
                  <div class="top-info">
                    <p class="top-name">{{ item.hoTen }}</p>
                    <p class="top-sub">{{ item.soLuot }} lượt mượn</p>
                  </div>
                  <div class="top-bar-wrap">
                    <div class="top-bar top-bar--user" :style="{ width: topBarWidth(item.soLuot, chartData.topUser) }"></div>
                  </div>
                  <span class="top-count">{{ item.soLuot }}</span>
                </div>
                <div v-if="!chartData.topUser.length" class="empty-hint">Chưa có dữ liệu</div>
              </div>
            </div>
          </div>
        </template>
        <!-- ══ END BIỂU ĐỒ ══ -->

      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAdminStore } from "../../stores/adminStore";
import adminService from "../../services/adminService";
import statsService from "../../services/statsService";
import api from "../../services/api";

const isBookMenuOpen = ref(false); // menu quản lý
const adminStore = useAdminStore();
const loading      = ref(false);
const loadingChart = ref(false);
const chartData    = ref(null);
const currentYear  = new Date().getFullYear();

const stats = ref({
  pending: 0,
  approved: 0,
  totalBooks: 0,
  totalUsers: 0,
  returned: 0,
  currentBorrows: 0,
});

const currentDate = computed(() => {
  return new Date().toLocaleDateString("vi-VN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
});

// ── Donut ──
const donutColors = ['#e8a87c', '#7c3d2d', '#27ae60', '#c0392b'];

const donutSegments = computed(() => {
  if (!chartData.value) return [];
  const circ  = 2 * Math.PI * 45;
  const total = chartData.value.chartTrangThai.reduce((s, i) => s + i.value, 0) || 1;
  let offset  = circ * 0.25;
  return chartData.value.chartTrangThai.map((item, i) => {
    const dash = (item.value / total) * circ;
    const seg  = { color: donutColors[i], dash, gap: circ - dash, offset };
    offset -= dash;
    return seg;
  });
});

// ── Bar chart ──
const maxThang = computed(() =>
  Math.max(...(chartData.value?.chartThang.map(t => t.soLuot) || [1]), 1)
);
const barHeight = (val) => {
  const pct = Math.round((val / maxThang.value) * 100);
  return `${Math.max(pct, val > 0 ? 4 : 0)}%`;
};
const topBarWidth = (val, list) => {
  const max = Math.max(...list.map(i => i.soLuot), 1);
  return `${Math.round((val / max) * 100)}%`;
};

// ── Load stats cũ (giữ nguyên) ──
const loadDashboardStats = async () => {
  try {
    loading.value = true;
    let statsData = null;
    try {
      statsData = await statsService.getAdminStats();
    } catch {
      statsData = {
        totalPendingBorrows: 0,
        totalApprovedBorrows: 0,
        totalReturnedBorrows: 0,
        totalCurrentBorrows: 0,
      };
    }
    const [allBooks, allUsers] = await Promise.all([
      adminService.getAllBooks(adminStore.token),
      adminService.getAllReaders(adminStore.token),
    ]);
    stats.value = {
      pending:        statsData.totalPendingBorrows,
      approved:       statsData.totalApprovedBorrows,
      totalBooks:     allBooks.length,
      totalUsers:     allUsers.length,
      returned:       statsData.totalReturnedBorrows,
      currentBorrows: statsData.totalCurrentBorrows,
    };
  } catch (error) {
    console.error("Error loading dashboard stats:", error);
    stats.value = { pending: 0, approved: 0, totalBooks: 0, totalUsers: 0, returned: 0, currentBorrows: 0 };
  } finally {
    loading.value = false;
  }
};

// ── Load chart data mới ──
const loadChartData = async () => {
  try {
    loadingChart.value = true;
    const { data } = await api.get('/stats/dashboard');
    chartData.value = data;
  } catch (err) {
    console.error('Error loading chart data:', err);
  } finally {
    loadingChart.value = false;
  }
};

onMounted(() => {
  adminStore.initialize();
  if (adminStore.isLoggedIn) {
    loadDashboardStats();
    loadChartData();
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

/* ── PAGE ── */
.dashboard {
  font-family: 'DM Sans', sans-serif;
  background: #f7f7f5;
  min-height: 100vh;
  padding: 2.5rem 0 5rem;
}
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* ── HEADER ── */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}
.page-eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: #7c3d2d;
  font-weight: 500;
  margin: 0 0 0.4rem;
}
.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: #1a120e;
  margin: 0 0 0.3rem;
}
.page-sub { color: #9a8a84; font-size: 0.9rem; margin: 0; }
.header-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #9a8a84;
  background: #fff;
  border: 1px solid #e8e0d8;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  white-space: nowrap;
}
.header-date i { color: #7c3d2d; }

/* ── LOADING ── */
.state-box {
  text-align: center;
  padding: 5rem 2rem;
  color: #9a8a84;
}
.spinner {
  width: 36px; height: 36px;
  border: 3px solid #e8e0d8;
  border-top-color: #7c3d2d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── STATS GRID ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}
.stat-card {
  background: #fff;
  border: 1px solid #ece8e3;
  border-radius: 14px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: box-shadow 0.2s, transform 0.2s;
}
.stat-card:hover {
  box-shadow: 0 8px 28px rgba(44, 36, 32, 0.09);
  transform: translateY(-3px);
}
.stat-icon {
  width: 46px; height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}
.stat-icon--yellow { background: #fef9ec; color: #92620a; }
.stat-icon--green  { background: #eaf5ec; color: #2d6a3f; }
.stat-icon--brown  { background: #f8f0ec; color: #7c3d2d; }
.stat-icon--blue   { background: #eaf2fb; color: #1a5490; }
.stat-body {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
}
.stat-label {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9a8a84;
}
.stat-num {
  font-family: 'Playfair Display', serif;
  font-size: 2.4rem;
  font-weight: 700;
  color: #1a120e;
  line-height: 1;
}
.stat-link {
  font-size: 0.8rem;
  color: #7c3d2d;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: gap 0.2s;
}
.stat-link:hover { gap: 0.5rem; }
.stat-link.muted { color: #c9b5af; pointer-events: none; }

/* ── SECONDARY STATS ── */
.secondary-stats {
  background: #fff;
  border: 1px solid #ece8e3;
  border-radius: 12px;
  padding: 1.1rem 2rem;
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 3rem;
}
.sec-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  flex: 1;
  padding: 0.4rem 1rem;
}
.sec-label { font-size: 0.78rem; color: #9a8a84; letter-spacing: 0.05em; }
.sec-num {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a120e;
}
.sec-num--warn { color: #92620a; }
.sec-divider { width: 1px; height: 36px; background: #ece8e3; flex-shrink: 0; }

/* ── SECTION HEADER ── */
.section-header { margin-bottom: 1.5rem; }
.section-eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: #7c3d2d;
  font-weight: 500;
  margin: 0 0 0.4rem;
}
.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a120e;
  margin: 0;
}

/* ── ACTION GRID ── */
.action-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}
.action-card {
  background: #fff;
  border: 1px solid #ece8e3;
  border-radius: 14px;
  padding: 1.5rem;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
  position: relative;
  overflow: hidden;
}
.action-card::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, #7c3d2d, #c0522a);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s ease;
}
.action-card:hover {
  box-shadow: 0 10px 32px rgba(44, 36, 32, 0.1);
  transform: translateY(-4px);
  border-color: #d4c4bc;
}
.action-card:hover::after { transform: scaleX(1); }
.action-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.4rem;
}
.action-icon {
  width: 48px; height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}
.action-icon--yellow { background: #fef9ec; color: #92620a; }
.action-icon--brown  { background: #f8f0ec; color: #7c3d2d; }
.action-icon--green  { background: #eaf5ec; color: #2d6a3f; }
.action-icon--blue   { background: #eaf2fb; color: #1a5490; }
.action-badge {
  background: #7c3d2d;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  min-width: 24px;
  text-align: center;
}
.action-title {
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  font-weight: 700;
  color: #1a120e;
  margin: 0;
}
.action-desc {
  font-size: 0.83rem;
  color: #9a8a84;
  line-height: 1.6;
  margin: 0;
  flex: 1;
}
.action-cta {
  font-size: 0.8rem;
  color: #7c3d2d;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.25rem;
  transition: gap 0.2s;
}
.action-card:hover .action-cta { gap: 0.55rem; }

/* ── BIỂU ĐỒ ── */
.chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}
.chart-card {
  background: #fff;
  border: 1px solid #ece8e3;
  border-radius: 14px;
  padding: 1.5rem;
}
.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}
.chart-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a120e;
  margin: 0;
  font-family: 'DM Sans', sans-serif;
}
.chart-badge {
  font-size: 0.75rem;
  color: #9a8a84;
  background: #f5f1ec;
  padding: 0.2rem 0.7rem;
  border-radius: 20px;
}
.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 160px;
  padding-top: 20px;
}
.bar-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 4px;
  height: 100%;
  justify-content: flex-end;
}
.bar-val   { font-size: 0.62rem; color: #9a8a84; min-height: 14px; }
.bar {
  width: 100%;
  background: #7c3d2d;
  border-radius: 4px 4px 0 0;
  min-height: 2px;
  transition: height 0.4s ease;
  cursor: pointer;
}
.bar:hover { background: #5c2d1f; }
.bar-label { font-size: 0.62rem; color: #9a8a84; white-space: nowrap; }
.donut-wrap { display: flex; justify-content: center; margin-bottom: 1rem; }
.donut-svg  { width: 130px; height: 130px; transform: rotate(-90deg); }
.donut-legend { display: flex; flex-direction: column; gap: 0.5rem; }
.legend-item  { display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; }
.legend-dot   { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.legend-label { flex: 1; color: #4a3530; }
.legend-val   { font-weight: 600; color: #1a120e; }
.top-list { display: flex; flex-direction: column; gap: 0.65rem; }
.top-item { display: flex; align-items: center; gap: 0.75rem; }
.top-rank {
  width: 26px; height: 26px;
  border-radius: 6px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.78rem; font-weight: 700;
  background: #f5f1ec; color: #9a8a84;
}
.top-rank.rank-1 { background: #fef9ec; color: #92620a; }
.top-rank.rank-2 { background: #f5f1ec; color: #6b5c55; }
.top-rank.rank-3 { background: #f8f0ec; color: #7c3d2d; }
.top-info { flex: 0 0 150px; min-width: 0; }
.top-name { font-size: 0.82rem; font-weight: 600; color: #1a120e; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.top-sub  { font-size: 0.72rem; color: #9a8a84; margin: 0; }
.top-bar-wrap { flex: 1; background: #f5f1ec; border-radius: 4px; height: 6px; overflow: hidden; }
.top-bar       { height: 100%; background: #7c3d2d; border-radius: 4px; transition: width 0.5s ease; }
.top-bar--user { background: #2d6a3f; }
.top-count { font-size: 0.82rem; font-weight: 700; color: #1a120e; min-width: 24px; text-align: right; }
.empty-hint { font-size: 0.85rem; color: #9a8a84; text-align: center; padding: 1.5rem 0; }

/* ── RESPONSIVE ── */
@media (max-width: 1024px) {
  .stats-grid  { grid-template-columns: repeat(2, 1fr); }
  .action-grid { grid-template-columns: repeat(2, 1fr); }
  .chart-row   { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .page-container { padding: 0 1rem; }
  .stats-grid     { grid-template-columns: repeat(2, 1fr); }
  .action-grid    { grid-template-columns: 1fr; }
  .secondary-stats { flex-wrap: wrap; padding: 1rem; }
  .sec-divider    { display: none; }
  .sec-stat       { flex: 0 0 50%; border-bottom: 1px solid #ece8e3; padding: 0.75rem; }
  .top-info       { flex: 0 0 100px; }
}

</style>