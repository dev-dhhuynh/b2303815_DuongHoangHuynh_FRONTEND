<template>
  <div class="borrow-all-page">
    <div class="page-container">

      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">
            <i class="fas fa-list"></i> Tất Cả Bản Ghi Mượn
          </h1>
          <p class="page-sub">Xem lịch sử mượn sách toàn hệ thống</p>
        </div>
      </div>

      <!-- Filter bar -->
      <div class="filter-bar">
        <div class="filter-left">
          <label class="filter-label">Lọc theo trạng thái</label>
          <select v-model="filterStatus" class="filter-select">
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đang mượn</option>
            <option value="returned">Đã trả</option>
            <option value="rejected">Từ chối</option>
          </select>
        </div>
        <div class="filter-right">
          <span class="total-label">Tổng số bản ghi</span>
          <span class="total-badge">{{ filteredBorrows.length }}</span>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="state-box">
        <div class="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>

      <!-- Empty -->
      <div v-else-if="allBorrows.length === 0" class="state-box">
        <i class="fas fa-inbox state-icon"></i>
        <h4>Không có bản ghi mượn sách nào</h4>
        <p>Chưa có yêu cầu mượn sách nào trong hệ thống.</p>
      </div>

      <!-- Table -->
      <div v-else class="table-card">

        <div class="table-card-header">
          <h5 class="table-card-title">
            <i class="fas fa-history"></i>
            Lịch sử mượn sách
            <span class="count-badge">{{ filteredBorrows.length }}</span>
          </h5>
        </div>

        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Độc giả</th>
                <th>Sách</th>
                <th>Ngày yêu cầu</th>
                <th>Ngày mượn</th>
                <th>Ngày trả</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in filteredBorrows" :key="record._id">

                <!-- Độc giả -->
                <td>
                  <span
                    v-if="record.MaDocGia && typeof record.MaDocGia === 'object'"
                    class="td-main"
                  >
                    {{ record.MaDocGia.HoLot }} {{ record.MaDocGia.Ten }}
                  </span>
                  <span v-else class="td-error">
                    <i class="fas fa-exclamation-circle"></i> Không có thông tin độc giả
                  </span>
                  <span class="td-sub" v-if="record.MaDocGia?.email">
                    {{ record.MaDocGia.email }}
                  </span>
                </td>

                <!-- Sách -->
                <td>
                  <span
                    v-if="record.MaSach && typeof record.MaSach === 'object'"
                    class="td-main"
                  >
                    {{ record.MaSach.TenSach }}
                  </span>
                  <span v-else class="td-error">
                    <i class="fas fa-exclamation-circle"></i> Không có thông tin sách
                  </span>
                  <span class="td-sub" v-if="record.MaSach?.TacGia">
                    {{ record.MaSach.TacGia }}
                  </span>
                </td>

                <!-- Dates -->
                <td class="td-date">{{ formatDate(record.createdAt) }}</td>
                <td class="td-date">{{ formatDate(record.NgayMuon) }}</td>
                <td class="td-date">{{ formatDate(record.NgayTra) }}</td>

                <!-- Status -->
                <td>
                  <span class="status-badge" :class="getStatusClass(record.status)">
                    {{ getStatusText(record.status) }}
                  </span>
                </td>

                <!-- Action -->
                <td>
                  <button
                    v-if="record.status === 'returned' || record.status === 'rejected'"
                    @click="deleteRecord(record._id)"
                    class="btn-delete"
                    :disabled="deletingRecord === record._id"
                    title="Xoá bản ghi này"
                  >
                    <span v-if="deletingRecord === record._id" class="spinner-sm"></span>
                    <i v-else class="fas fa-trash"></i>
                  </button>
                  <span v-else class="no-action">Không thể xoá</span>
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
import { ref, computed, onMounted } from "vue";
import { useAdminStore } from "../../stores/adminStore";
import adminService from "../../services/adminService";

const adminStore = useAdminStore();

const allBorrows = ref([]);
const loading = ref(false);
const filterStatus = ref("");
const error = ref("");
const deletingRecord = ref("");

const filteredBorrows = computed(() => {
  if (!filterStatus.value) return allBorrows.value;
  return allBorrows.value.filter((r) => r.status === filterStatus.value);
});

const deleteRecord = async (recordId) => {
  if (!confirm("⚠️ Bạn có chắc chắn muốn xoá vĩnh viễn bản ghi này?\n\nHành động này không thể hoàn tác!")) return;

  try {
    deletingRecord.value = recordId;
    const response = await fetch(`http://localhost:3000/api/muon/${recordId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminStore.token}` },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Lỗi khi xoá bản ghi");
    }
    alert("✅ Đã xoá bản ghi thành công!");
    await loadAllBorrows();
  } catch (error) {
    alert("Lỗi khi xoá bản ghi: " + error.message);
  } finally {
    deletingRecord.value = "";
  }
};

const loadAllBorrows = async () => {
  try {
    loading.value = true;
    error.value = "";
    if (!adminStore.isLoggedIn) {
      error.value = "Vui lòng đăng nhập để tiếp tục";
      return;
    }
    const response = await adminService.getAllBorrows(adminStore.token);
    allBorrows.value = response;
  } catch (err) {
    if (err.message?.includes("No admin token") || err.code === "NO_TOKEN") {
      error.value = "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.";
    } else if (err.response?.status === 401) {
      error.value = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
    } else {
      error.value = "Lỗi khi tải dữ liệu: " + (err.response?.data?.message || err.message || "Lỗi không xác định");
    }
  } finally {
    loading.value = false;
  }
};

const getStatusClass = (status) => ({
  pending:  "status--yellow",
  approved: "status--green",
  returned: "status--blue",
  rejected: "status--red",
}[status] || "status--gray");

const getStatusText = (status) => ({
  pending:  "Chờ duyệt",
  approved: "Đang mượn",
  returned: "Đã trả",
  rejected: "Từ chối",
}[status] || status);

const formatDate = (dateString) => {
  if (!dateString) return "Chưa có";
  try {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric", month: "2-digit", day: "2-digit",
    });
  } catch { return "Invalid date"; }
};

onMounted(() => loadAllBorrows());
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

/* ── PAGE ── */
.borrow-all-page {
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
  margin-bottom: 2rem;
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

/* ── FILTER BAR ── */
.filter-bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  background: #fff;
  border: 1px solid #e8e0d8;
  border-radius: 10px;
  padding: 1.1rem 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}
.filter-left {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}
.filter-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #4a3530;
  white-space: nowrap;
}
.filter-select {
  border: 1.5px solid #e8e0d8;
  border-radius: 6px;
  padding: 0.45rem 2rem 0.45rem 0.9rem;
  font-size: 0.87rem;
  font-family: 'DM Sans', sans-serif;
  color: #2c2420;
  background: #faf8f5;
  cursor: pointer;
  appearance: auto;
  transition: border-color 0.2s;
  min-width: 180px;
}
.filter-select:focus {
  outline: none;
  border-color: #7c3d2d;
}
.filter-right {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.total-label {
  font-size: 0.85rem;
  color: #9a8a84;
}
.total-badge {
  background: #7c3d2d;
  color: #fff;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.2rem 0.75rem;
  border-radius: 20px;
}

/* ── STATES ── */
.state-box {
  text-align: center;
  padding: 5rem 2rem;
  color: #9a8a84;
}
.state-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}
.state-box h4 { color: #4a3530; font-size: 1.15rem; margin-bottom: 0.5rem; }
.state-box p  { font-size: 0.9rem; margin: 0; }
.spinner {
  width: 36px; height: 36px;
  border: 3px solid #e8e0d8;
  border-top-color: #7c3d2d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}
@keyframes spin { to { transform: rotate(360deg); } }

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
  padding: 1.1rem 1.75rem;
}
.table-card-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a120e;
  margin: 0;
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

.td-main  { display: block; font-weight: 500; color: #1a120e; }
.td-sub   { display: block; font-size: 0.8rem; color: #9a8a84; margin-top: 2px; }
.td-error { display: block; font-size: 0.82rem; color: #b94a2c; }
.td-date  { white-space: nowrap; color: #4a3530; }

/* ── STATUS ── */
.status-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.77rem;
  font-weight: 500;
  padding: 0.28rem 0.75rem;
  border-radius: 20px;
  white-space: nowrap;
}
.status--yellow { background: #fef9ec; color: #92620a; }
.status--green  { background: #eaf5ec; color: #2d6a3f; }
.status--blue   { background: #eaf2fb; color: #1a5490; }
.status--red    { background: #fff1ee; color: #b94a2c; }
.status--gray   { background: #f0ebe4; color: #6b5c55; }

/* ── ACTION ── */
.btn-delete {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px; height: 34px;
  background: #fff1ee;
  border: 1.5px solid #f0c4b8;
  color: #b94a2c;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}
.btn-delete:hover:not(:disabled) {
  background: #b94a2c;
  border-color: #b94a2c;
  color: #fff;
}
.btn-delete:disabled { opacity: 0.5; cursor: not-allowed; }
.no-action {
  font-size: 0.8rem;
  color: #c9b5af;
  font-style: italic;
}
.spinner-sm {
  width: 14px; height: 14px;
  border: 2px solid rgba(185, 74, 44, 0.3);
  border-top-color: #b94a2c;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .page-container { padding: 0 1rem; }
  .page-title { font-size: 1.5rem; }
  .filter-bar { flex-direction: column; align-items: flex-start; }
  .data-table th,
  .data-table td { padding: 0.75rem 1rem; }
}
</style>