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

      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAdminStore } from "../../stores/adminStore";
import adminService from "../../services/adminService";
import statsService from "../../services/statsService";

const adminStore = useAdminStore();
const loading = ref(false);
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
      pending: statsData.totalPendingBorrows,
      approved: statsData.totalApprovedBorrows,
      totalBooks: allBooks.length,
      totalUsers: allUsers.length,
      returned: statsData.totalReturnedBorrows,
      currentBorrows: statsData.totalCurrentBorrows,
    };
  } catch (error) {
    console.error("Error loading dashboard stats:", error);
    stats.value = { pending: 0, approved: 0, totalBooks: 0, totalUsers: 0, returned: 0, currentBorrows: 0 };
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  adminStore.initialize();
  if (adminStore.isLoggedIn) loadDashboardStats();
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
.sec-label {
  font-size: 0.78rem;
  color: #9a8a84;
  letter-spacing: 0.05em;
}
.sec-num {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a120e;
}
.sec-num--warn { color: #92620a; }
.sec-divider {
  width: 1px;
  height: 36px;
  background: #ece8e3;
  flex-shrink: 0;
}

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

/* ── RESPONSIVE ── */
@media (max-width: 1024px) {
  .stats-grid  { grid-template-columns: repeat(2, 1fr); }
  .action-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .page-container { padding: 0 1rem; }
  .stats-grid  { grid-template-columns: repeat(2, 1fr); }
  .action-grid { grid-template-columns: 1fr; }
  .secondary-stats { flex-wrap: wrap; padding: 1rem; }
  .sec-divider { display: none; }
  .sec-stat { flex: 0 0 50%; border-bottom: 1px solid #ece8e3; padding: 0.75rem; }
}
</style>