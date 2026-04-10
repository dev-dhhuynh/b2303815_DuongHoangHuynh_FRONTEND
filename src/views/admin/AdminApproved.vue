<template>
  <div class="approved-page">
    <div class="page-container">

      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">
            <i class="fas fa-check-circle"></i> Lịch Sử Đã Duyệt
          </h1>
          <p class="page-sub">Xem tất cả yêu cầu mượn sách đã từng được duyệt (bao gồm cả đã trả)</p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="state-box">
        <div class="spinner"></div>
        <p>Đang tải yêu cầu...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="alert-error">
        <i class="fas fa-exclamation-triangle"></i>
        {{ error }}
        <button @click="loadApprovedRequests" class="btn-retry">
          <i class="fas fa-redo"></i> Thử lại
        </button>
      </div>

      <!-- Empty -->
      <div v-else-if="approvedRequests.length === 0" class="state-box">
        <i class="fas fa-check-circle state-icon"></i>
        <h4>Không có yêu cầu nào đã duyệt</h4>
        <p>Chưa có yêu cầu mượn sách nào được duyệt.</p>
        <div class="state-actions">
          <router-link to="/admin/pending" class="btn-primary-sm">
            <i class="fas fa-clock"></i> Kiểm tra yêu cầu chờ
          </router-link>
          <button @click="loadApprovedRequests" class="btn-ghost-sm">
            <i class="fas fa-redo"></i> Tải lại
          </button>
        </div>
      </div>

      <!-- Table -->
      <div v-else class="table-card">

        <!-- Card header -->
        <div class="table-card-header">
          <div>
            <h5 class="table-card-title">
              <i class="fas fa-history"></i>
              Lịch sử đã duyệt
              <span class="count-badge">{{ approvedRequests.length }}</span>
            </h5>
            <p class="table-card-sub">
              <span class="pill pill--green">{{ getCountByStatus('approved') }} đang mượn</span>
              <span class="pill pill--gray">{{ getCountByStatus('returned') }} đã trả</span>
              <span class="pill pill--red">{{ getCountByStatus('overdue') }} quá hạn</span>
            </p>
          </div>
        </div>

        <!-- Table -->
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Độc giả</th>
                <th>Sách</th>
                <th>Ngày mượn</th>
                <th>Ngày trả dự kiến</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in approvedRequests" :key="request._id">

                <!-- Độc giả -->
                <td>
                  <span class="td-main" v-if="request.MaDocGia">
                    {{ request.MaDocGia.HoLot }} {{ request.MaDocGia.Ten }}
                  </span>
                  <span v-else class="td-muted">Đang tải...</span>
                  <span class="td-sub" v-if="request.MaDocGia?.email">
                    {{ request.MaDocGia.email }}
                  </span>
                </td>

                <!-- Sách -->
                <td>
                  <span class="td-main" v-if="request.MaSach">{{ request.MaSach.TenSach }}</span>
                  <span v-else class="td-muted">Đang tải...</span>
                  <span class="td-sub" v-if="request.MaSach?.TacGia">
                    {{ request.MaSach.TacGia }}
                  </span>
                </td>

                <!-- Ngày mượn -->
                <td class="td-date">{{ formatDate(request.NgayMuon) }}</td>

                <!-- Ngày trả dự kiến -->
                <td class="td-date">
                  {{ formatDate(request.NgayTraDuKien) }}
                  <span v-if="isOverdue(request)" class="overdue-tag">
                    <i class="fas fa-exclamation-triangle"></i> Quá hạn
                  </span>
                </td>

                <!-- Trạng thái -->
                <td>
                  <span v-if="request.status === 'returned'" class="status-badge status--gray">
                    <i class="fas fa-check-circle"></i> Đã trả
                  </span>
                  <span v-else-if="request.status === 'overdue'" class="status-badge status--red">
                    <i class="fas fa-exclamation-triangle"></i> Quá hạn
                  </span>
                  <span v-else class="status-badge status--green">
                    <i class="fas fa-book"></i> Đang mượn
                  </span>
                  <span v-if="request.NgayTraThucTe" class="td-sub mt-1">
                    Trả: {{ formatDate(request.NgayTraThucTe) }}
                  </span>
                </td>

                <!-- Thao tác -->
                <td>
                  <button
                    v-if="request.status !== 'returned'"
                    @click="markAsReturned(request._id)"
                    class="btn-return"
                    :disabled="processingRequest === request._id"
                  >
                    <span v-if="processingRequest === request._id" class="spinner-sm"></span>
                    <i v-else class="fas fa-undo"></i>
                    Đánh dấu đã trả
                  </button>
                  <span v-else class="returned-label">
                    <i class="fas fa-check-circle"></i> Đã trả
                  </span>
                </td>

              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAdminStore } from "../../stores/adminStore";
import adminService from "../../services/adminService";

const adminStore = useAdminStore();

const approvedRequests = ref([]);
const loading = ref(false);
const error = ref("");
const processingRequest = ref("");

const getCountByStatus = (status) => {
  return approvedRequests.value.filter((r) => r.status === status).length;
};

const isOverdue = (request) => {
  if (request.status === "returned") return false;
  return new Date(request.NgayTraDuKien) < new Date();
};

const loadApprovedRequests = async () => {
  try {
    if (!adminStore.token) {
      error.value = "Vui lòng đăng nhập lại";
      return;
    }
    loading.value = true;
    error.value = "";

    const response = await adminService.getApprovedBorrows(adminStore.token);

    approvedRequests.value = response.map((request) => {
      if (request.status === "returned") return request;
      const dueDate = new Date(request.NgayTraDuKien);
      if (dueDate < new Date()) return { ...request, status: "overdue" };
      return request;
    });
  } catch (err) {
    if (err.response?.status === 401) {
      error.value = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
    } else {
      error.value =
        "Lỗi khi tải danh sách: " +
        (err.response?.data?.message || err.message || "Unknown error");
    }
  } finally {
    loading.value = false;
  }
};

const markAsReturned = async (requestId) => {
  if (!confirm("Bạn có chắc chắn muốn đánh dấu sách đã được trả?")) return;

  try {
    processingRequest.value = requestId;
    const updatedRequest = await adminService.returnBorrow(adminStore.token, requestId);

    alert("✅ Đã đánh dấu sách đã được trả!");

    const index = approvedRequests.value.findIndex((r) => r._id === requestId);
    if (index !== -1) {
      approvedRequests.value[index] = {
        ...approvedRequests.value[index],
        status: "returned",
        NgayTraThucTe: new Date().toISOString(),
      };
    }
  } catch (err) {
    alert("Lỗi khi đánh dấu đã trả: " + (err.response?.data?.message || err.message));
  } finally {
    processingRequest.value = "";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "Chưa có";
  try {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric", month: "2-digit", day: "2-digit",
    });
  } catch {
    return "Invalid date";
  }
};

onMounted(() => loadApprovedRequests());
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

/* ── PAGE ── */
.approved-page {
  font-family: 'DM Sans', sans-serif;
  background: #faf8f5;
  min-height: 100vh;
  padding: 2.5rem 0 4rem;
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
  margin-bottom: 2rem;
  gap: 1rem;
}
.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.9rem;
  font-weight: 700;
  color: #1a120e;
  margin: 0 0 0.35rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.page-title i { color: #7c3d2d; font-size: 1.5rem; }
.page-sub { color: #9a8a84; font-size: 0.9rem; margin: 0; }

/* ── STATES ── */
.state-box {
  text-align: center;
  padding: 5rem 2rem;
  color: #9a8a84;
}
.state-icon { font-size: 3rem; margin-bottom: 1rem; display: block; }
.state-box h4 { color: #4a3530; font-size: 1.15rem; margin-bottom: 0.5rem; }
.state-box p { font-size: 0.9rem; margin-bottom: 1.5rem; }
.state-actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }

.spinner {
  width: 36px; height: 36px;
  border: 3px solid #e8e0d8;
  border-top-color: #7c3d2d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── ALERT ── */
.alert-error {
  background: #fff1ee;
  border: 1px solid #f0c4b8;
  border-left: 4px solid #c0522a;
  border-radius: 6px;
  padding: 1rem 1.25rem;
  color: #7c3d2d;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}
.btn-retry {
  margin-left: auto;
  background: none;
  border: 1.5px solid #c0522a;
  color: #7c3d2d;
  border-radius: 4px;
  padding: 0.35rem 0.9rem;
  font-size: 0.83rem;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: background 0.2s;
}
.btn-retry:hover { background: #fff1ee; }

/* ── BUTTONS ── */
.btn-primary-sm {
  background: #7c3d2d;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.55rem 1.25rem;
  font-size: 0.85rem;
  font-family: 'DM Sans', sans-serif;
  text-decoration: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: background 0.2s;
}
.btn-primary-sm:hover { background: #5c2d1f; }
.btn-ghost-sm {
  background: none;
  border: 1.5px solid #c9b5af;
  color: #4a3530;
  border-radius: 4px;
  padding: 0.55rem 1.25rem;
  font-size: 0.85rem;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.2s;
}
.btn-ghost-sm:hover { border-color: #7c3d2d; color: #7c3d2d; }

/* ── TABLE CARD ── */
.table-card {
  background: #fff;
  border: 1px solid #e8e0d8;
  border-radius: 12px;
  overflow: hidden;
}
.table-card-header {
  background: #f5f1ec;
  border-bottom: 1px solid #e8e0d8;
  padding: 1.25rem 1.75rem;
}
.table-card-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: #1a120e;
  margin: 0 0 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.table-card-title i { color: #7c3d2d; }
.count-badge {
  background: #7c3d2d;
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.78rem;
  font-weight: 500;
  padding: 0.15rem 0.6rem;
  border-radius: 20px;
}
.table-card-sub {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin: 0;
}

/* Pills */
.pill {
  font-size: 0.75rem;
  padding: 0.2rem 0.7rem;
  border-radius: 20px;
  font-weight: 500;
}
.pill--green { background: #eaf5ec; color: #2d6a3f; }
.pill--gray  { background: #f0ebe4; color: #6b5c55; }
.pill--red   { background: #fff1ee; color: #b94a2c; }

/* ── TABLE ── */
.table-wrap { overflow-x: auto; }
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
}
.data-table thead tr {
  border-bottom: 2px solid #ede8e3;
}
.data-table th {
  padding: 0.9rem 1.25rem;
  text-align: left;
  font-size: 0.78rem;
  font-weight: 600;
  color: #7c3d2d;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  white-space: nowrap;
  background: #faf8f5;
}
.data-table tbody tr {
  border-bottom: 1px solid #f0ebe4;
  transition: background 0.15s;
}
.data-table tbody tr:last-child { border-bottom: none; }
.data-table tbody tr:hover { background: #fdf9f7; }
.data-table td {
  padding: 1rem 1.25rem;
  vertical-align: top;
  color: #2c2420;
}

.td-main { display: block; font-weight: 500; color: #1a120e; }
.td-sub  { display: block; font-size: 0.8rem; color: #9a8a84; margin-top: 2px; }
.td-muted { color: #b0a09a; font-style: italic; }
.td-date { white-space: nowrap; color: #4a3530; }

/* ── STATUS BADGES ── */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  font-weight: 500;
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
}
.status--green { background: #eaf5ec; color: #2d6a3f; }
.status--gray  { background: #f0ebe4; color: #6b5c55; }
.status--red   { background: #fff1ee; color: #b94a2c; }

.overdue-tag {
  display: block;
  font-size: 0.78rem;
  color: #b94a2c;
  margin-top: 4px;
}
.mt-1 { margin-top: 4px; }

/* ── ACTION BUTTONS ── */
.btn-return {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #f5f1ec;
  border: 1.5px solid #c9b5af;
  color: #4a3530;
  border-radius: 4px;
  padding: 0.45rem 0.9rem;
  font-size: 0.82rem;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.btn-return:hover:not(:disabled) {
  background: #7c3d2d;
  border-color: #7c3d2d;
  color: #fff;
}
.btn-return:disabled { opacity: 0.6; cursor: not-allowed; }

.returned-label {
  color: #2d6a3f;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.spinner-sm {
  width: 14px; height: 14px;
  border: 2px solid rgba(124, 61, 45, 0.3);
  border-top-color: #7c3d2d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .page-container { padding: 0 1rem; }
  .page-title { font-size: 1.5rem; }
  .data-table th,
  .data-table td { padding: 0.75rem 1rem; }
}
</style>