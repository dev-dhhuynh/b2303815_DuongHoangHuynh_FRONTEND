<template>
  <div class="pending-page">
    <div class="container py-5">

      <!-- Page Header -->
      <div class="page-header mb-5">
        <div class="d-flex align-items-center gap-3 mb-2">
          <div class="header-icon">
            <i class="fas fa-hourglass-half"></i>
          </div>
          <div>
            <h1 class="page-title mb-0">Yêu cầu chờ duyệt</h1>
            <p class="page-subtitle mb-0">Xét duyệt các yêu cầu mượn sách từ độc giả</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="state-card text-center py-5">
        <div class="custom-spinner mb-3">
          <div class="spinner-ring"></div>
        </div>
        <p class="text-muted fw-medium">Đang tải danh sách yêu cầu...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="pendingRequests.length === 0" class="state-card text-center py-5">
        <div class="empty-icon mb-3">
          <i class="fas fa-inbox"></i>
        </div>
        <h5 class="fw-semibold text-dark mb-1">Không có yêu cầu nào</h5>
        <p class="text-muted mb-0">Tất cả yêu cầu mượn sách đã được xử lý.</p>
      </div>

      <!-- Requests Table -->
      <div v-else class="table-card">
        <div class="table-card-header">
          <div class="d-flex align-items-center gap-2">
            <i class="fas fa-list-ul"></i>
            <span class="fw-semibold">Danh sách yêu cầu</span>
          </div>
          <span class="badge-count">{{ pendingRequests.length }} yêu cầu</span>
        </div>

        <div class="table-responsive">
          <table class="table custom-table mb-0">
            <thead>
              <tr>
                <th>Độc giả</th>
                <th>Sách yêu cầu</th>
                <th>Ngày yêu cầu</th>
                <th>Ngày trả dự kiến</th>
                <th class="text-center">Số lượng</th>
                <th class="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in pendingRequests" :key="request._id" class="table-row">
                <td>
                  <div class="user-cell">
                    <div class="user-avatar">
                      {{ getInitials(request.MaDocGia?.HoLot, request.MaDocGia?.Ten) }}
                    </div>
                    <div>
                      <div class="fw-semibold text-dark">
                        {{ request.MaDocGia?.HoLot }} {{ request.MaDocGia?.Ten }}
                      </div>
                      <div class="text-muted small">{{ request.MaDocGia?.email }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="book-cell">
                    <div class="book-icon"><i class="fas fa-book"></i></div>
                    <div>
                      <div class="fw-semibold text-dark">{{ request.MaSach?.TenSach }}</div>
                      <div class="text-muted small">{{ request.MaSach?.TacGia }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="date-badge">
                    <i class="fas fa-calendar-alt me-1"></i>
                    {{ formatDate(request.createdAt) }}
                  </span>
                </td>
                <td>
                  <span class="date-badge return">
                    <i class="fas fa-calendar-check me-1"></i>
                    {{ formatDate(request.NgayTraDuKien) }}
                  </span>
                </td>
                <td class="text-center">
                  <span
                    class="qty-badge"
                    :class="request.MaSach?.SoQuyen > 0 ? 'qty-available' : 'qty-empty'"
                  >
                    {{ request.MaSach?.SoQuyen || 0 }}
                  </span>
                </td>
                <td class="text-center">
                  <div class="d-flex justify-content-center gap-2">
                    <button
                      @click="approveRequest(request._id)"
                      class="action-btn approve-btn"
                      :disabled="processingRequest === request._id || request.MaSach?.SoQuyen <= 0"
                      :title="request.MaSach?.SoQuyen <= 0 ? 'Sách đã hết' : 'Duyệt yêu cầu'"
                    >
                      <span v-if="processingRequest === request._id" class="spinner-border spinner-border-sm"></span>
                      <i v-else class="fas fa-check"></i>
                      <span>Duyệt</span>
                    </button>
                    <button
                      @click="rejectRequest(request._id)"
                      class="action-btn reject-btn"
                      :disabled="processingRequest === request._id"
                    >
                      <span v-if="processingRequest === request._id" class="spinner-border spinner-border-sm"></span>
                      <i v-else class="fas fa-times"></i>
                      <span>Từ chối</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- Confirm Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showConfirmModal" class="modal-overlay" @click.self="closeConfirmModal">
          <div class="confirm-modal" :class="confirmAction">
            <div class="confirm-modal-header" :class="confirmAction">
              <div class="modal-header-icon">
                <i :class="confirmAction === 'approve' ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
              </div>
              <h5 class="mb-0 fw-bold">{{ modalTitle }}</h5>
              <button class="modal-close-btn" @click="closeConfirmModal">
                <i class="fas fa-times"></i>
              </button>
            </div>

            <div class="confirm-modal-body">
              <p class="confirm-message">
                Bạn có chắc chắn muốn
                <strong>{{ confirmAction === 'approve' ? 'duyệt' : 'từ chối' }}</strong>
                yêu cầu mượn sách này?
              </p>

              <div v-if="selectedRequest" class="request-info-card">
                <div class="info-row">
                  <i class="fas fa-user me-2 text-muted"></i>
                  <span class="text-muted">Độc giả:</span>
                  <strong class="ms-1">{{ selectedRequest.MaDocGia?.HoLot }} {{ selectedRequest.MaDocGia?.Ten }}</strong>
                </div>
                <div class="info-row">
                  <i class="fas fa-book me-2 text-muted"></i>
                  <span class="text-muted">Sách:</span>
                  <strong class="ms-1">{{ selectedRequest.MaSach?.TenSach }}</strong>
                </div>
                <div class="info-row">
                  <i class="fas fa-layer-group me-2 text-muted"></i>
                  <span class="text-muted">Số lượng có sẵn:</span>
                  <strong class="ms-1" :class="selectedRequest.MaSach?.SoQuyen > 0 ? 'text-success' : 'text-danger'">
                    {{ selectedRequest.MaSach?.SoQuyen || 0 }}
                  </strong>
                </div>
              </div>

              <div
                v-if="confirmAction === 'approve' && selectedRequest?.MaSach?.SoQuyen <= 0"
                class="warning-box"
              >
                <i class="fas fa-exclamation-triangle me-2"></i>
                Sách đã hết, không thể duyệt yêu cầu!
              </div>
            </div>

            <div class="confirm-modal-footer">
              <button class="btn-cancel" @click="closeConfirmModal">
                <i class="fas fa-arrow-left me-1"></i> Huỷ bỏ
              </button>
              <button
                class="btn-confirm"
                :class="confirmAction"
                @click="executeConfirmAction"
                :disabled="processingRequest === selectedRequestId || (confirmAction === 'approve' && selectedRequest?.MaSach?.SoQuyen <= 0)"
              >
                <span v-if="processingRequest === selectedRequestId" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else :class="confirmAction === 'approve' ? 'fas fa-check me-1' : 'fas fa-times me-1'"></i>
                {{ confirmButtonText }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Toast Container -->
    <div class="toast-stack" id="toastStack"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAdminStore } from "../../stores/adminStore";
import adminService from "../../services/adminService";

const adminStore = useAdminStore();

const pendingRequests = ref([]);
const loading = ref(false);
const processingRequest = ref("");

const showConfirmModal = ref(false);
const confirmAction = ref("");
const selectedRequestId = ref("");
const selectedRequest = ref(null);

const modalTitle = computed(() =>
  confirmAction.value === "approve" ? "Xác nhận duyệt yêu cầu" : "Xác nhận từ chối yêu cầu"
);

const confirmButtonText = computed(() =>
  confirmAction.value === "approve" ? "Xác nhận duyệt" : "Xác nhận từ chối"
);

const getInitials = (hoLot, ten) => {
  const first = hoLot ? hoLot[0] : "";
  const last = ten ? ten[0] : "";
  return (first + last).toUpperCase() || "?";
};

const loadPendingRequests = async () => {
  try {
    loading.value = true;
    const response = await adminService.getPendingBorrows(adminStore.token);
    pendingRequests.value = response;
  } catch (error) {
    console.error("Error loading pending requests:", error);
    showToast("error", "Lỗi khi tải danh sách: " + (error.response?.data?.message || error.message));
  } finally {
    loading.value = false;
  }
};

const approveRequest = (requestId) => {
  const request = pendingRequests.value.find((r) => r._id === requestId);
  if (!request) return;
  if (request.MaSach?.SoQuyen <= 0) {
    showToast("warning", "Sách đã hết, không thể duyệt!");
    return;
  }
  selectedRequestId.value = requestId;
  selectedRequest.value = request;
  confirmAction.value = "approve";
  showConfirmModal.value = true;
};

const rejectRequest = (requestId) => {
  const request = pendingRequests.value.find((r) => r._id === requestId);
  if (!request) return;
  selectedRequestId.value = requestId;
  selectedRequest.value = request;
  confirmAction.value = "reject";
  showConfirmModal.value = true;
};

const executeConfirmAction = async () => {
  if (!selectedRequestId.value) return;
  try {
    processingRequest.value = selectedRequestId.value;
    if (confirmAction.value === "approve") {
      await adminService.approveBorrow(adminStore.token, selectedRequestId.value);
      showToast("success", "Đã duyệt yêu cầu mượn sách thành công!");
    } else {
      await adminService.rejectBorrow(adminStore.token, selectedRequestId.value);
      showToast("info", "Đã từ chối yêu cầu mượn sách.");
    }
    closeConfirmModal();
    await loadPendingRequests();
  } catch (error) {
    showToast("error", "Lỗi: " + (error.response?.data?.message || error.message));
  } finally {
    processingRequest.value = "";
  }
};

const closeConfirmModal = () => {
  if (processingRequest.value) return;
  showConfirmModal.value = false;
  selectedRequestId.value = "";
  selectedRequest.value = null;
  confirmAction.value = "";
};

const showToast = (type, message) => {
  const stack = document.getElementById("toastStack");
  if (!stack) return;
  const icons = { success: "check-circle", warning: "exclamation-triangle", error: "times-circle", info: "info-circle" };
  const toast = document.createElement("div");
  toast.className = `lib-toast lib-toast--${type}`;
  toast.innerHTML = `<i class="fas fa-${icons[type] || "info-circle"}"></i><span>${message}</span>`;
  stack.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("visible"));
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 350);
  }, 3200);
};

const formatDate = (dateString) => {
  if (!dateString) return "—";
  try {
    return new Date(dateString).toLocaleDateString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" });
  } catch {
    return "—";
  }
};

onMounted(() => {
  loadPendingRequests();
});
</script>

<style scoped>
/* ── Design Tokens ─────────────────────────────────── */
.pending-page {
  --brand:      #8B3A3A;
  --brand-dark: #6B2C2C;
  --brand-light:#FDF0F0;
  --accent:     #C0392B;
  --success:    #27AE60;
  --success-bg: #EAFAF1;
  --danger:     #E74C3C;
  --danger-bg:  #FDEDEC;
  --warning:    #F39C12;
  --warning-bg: #FEF9E7;
  --info:       #2980B9;
  --info-bg:    #EBF5FB;
  --text:       #1A1A2E;
  --text-muted: #6C757D;
  --border:     #E8E8F0;
  --surface:    #FFFFFF;
  --bg:         #F5F4F2;
  --radius:     12px;
  --shadow:     0 2px 16px rgba(0,0,0,0.08);
  --shadow-lg:  0 8px 40px rgba(0,0,0,0.14);
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: var(--bg);
  min-height: 100vh;
}

/* ── Page Header ────────────────────────────────────── */
.page-header { border-bottom: 2px solid var(--border); padding-bottom: 1.5rem; }

.header-icon {
  width: 52px; height: 52px;
  background: var(--brand);
  color: #fff;
  border-radius: var(--radius);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(139,58,58,.3);
}

.page-title  { font-size: 1.75rem; font-weight: 700; color: var(--text); letter-spacing: -0.5px; }
.page-subtitle { color: var(--text-muted); font-size: 0.9rem; }

/* ── State Cards (loading / empty) ─────────────────── */
.state-card {
  background: var(--surface);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.custom-spinner { display: flex; justify-content: center; }
.spinner-ring {
  width: 44px; height: 44px;
  border: 3px solid var(--border);
  border-top-color: var(--brand);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.empty-icon {
  width: 72px; height: 72px;
  background: var(--brand-light);
  color: var(--brand);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.8rem;
  margin: 0 auto;
}

/* ── Table Card ─────────────────────────────────────── */
.table-card {
  background: var(--surface);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.table-card-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.5rem;
  background: var(--brand);
  color: #fff;
  font-size: 0.95rem;
}

.badge-count {
  background: rgba(255,255,255,.2);
  color: #fff;
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

/* ── Custom Table ───────────────────────────────────── */
.custom-table thead th {
  background: #FAFAFA;
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  padding: 0.85rem 1.2rem;
  border-bottom: 2px solid var(--border);
  border-top: none;
  white-space: nowrap;
}

.custom-table tbody td {
  padding: 1rem 1.2rem;
  vertical-align: middle;
  border-bottom: 1px solid var(--border);
}

.table-row { transition: background 0.15s ease; }
.table-row:hover { background: var(--brand-light); }
.table-row:last-child td { border-bottom: none; }

/* ── Cell Styles ────────────────────────────────────── */
.user-cell, .book-cell { display: flex; align-items: center; gap: 0.75rem; }

.user-avatar {
  width: 38px; height: 38px; flex-shrink: 0;
  background: var(--brand);
  color: #fff;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.book-icon {
  width: 38px; height: 38px; flex-shrink: 0;
  background: var(--brand-light);
  color: var(--brand);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.9rem;
}

.date-badge {
  display: inline-flex; align-items: center;
  background: #F0F0F5;
  color: var(--text-muted);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 500;
  white-space: nowrap;
}
.date-badge.return { background: #EDF7F0; color: #2E7D5E; }

.qty-badge {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 36px; height: 28px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0 10px;
}
.qty-available { background: var(--success-bg); color: var(--success); }
.qty-empty     { background: var(--danger-bg);  color: var(--danger);  }

/* ── Action Buttons ─────────────────────────────────── */
.action-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 14px;
  border-radius: 7px;
  border: none;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.approve-btn { background: var(--success-bg); color: var(--success); }
.approve-btn:hover:not(:disabled) { background: var(--success); color: #fff; transform: translateY(-1px); box-shadow: 0 4px 10px rgba(39,174,96,.3); }
.reject-btn  { background: var(--danger-bg); color: var(--danger); }
.reject-btn:hover:not(:disabled) { background: var(--danger); color: #fff; transform: translateY(-1px); box-shadow: 0 4px 10px rgba(231,76,60,.3); }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

/* ── Modal Overlay ──────────────────────────────────── */
.modal-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(10, 8, 8, 0.75);   /* ← đậm hơn */
  backdrop-filter: blur(6px);          /* ← blur mạnh hơn */
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
}

.confirm-modal {
  background: #FFFFFF;                 /* ← trắng đục, không rgba */
  border-radius: 16px;
  width: 100%; max-width: 460px;
  box-shadow: 0 12px 48px rgba(0,0,0,0.35);  /* ← shadow đậm hơn */
  display: flex;
  flex-direction: column;
  border: 1px solid #D8D8E8; 
}

.confirm-modal-header {
  display: flex; align-items: center; gap: 12px;
  padding: 1.25rem 1.5rem;
  color: #fff;
  position: relative;
}
.confirm-modal-header.approve {
  background: #7c3d2d;        /* ← đỏ nâu hợp theme, thay vì var(--success) */
  color: #fff;
}
.confirm-modal-header.reject {
  background: #922B21;
  color: #fff;
}

.modal-header-icon {
  width: 36px; height: 36px;
  background: rgba(255,255,255,.2);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.modal-close-btn {
  position: absolute; right: 1.25rem; top: 50%; transform: translateY(-50%);
  background: rgba(255,255,255,.2); border: none;
  color: #fff; width: 30px; height: 30px;
  border-radius: 50%; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
}
.modal-close-btn:hover { background: rgba(255,255,255,.35); }

.confirm-modal-body { padding: 1.5rem; }
.confirm-message { color: var(--text); margin-bottom: 1rem; }

.request-info-card {
  background: #F0EEE8;                 /* ← đậm hơn var(--bg) */
  border: 1px solid #D8D8E8;
  border-radius: 10px;
  padding: 1rem;
  display: flex; flex-direction: column; gap: 0.5rem;
}
.info-row { display: flex; align-items: center; font-size: 0.88rem; }

.warning-box {
  display: flex; align-items: center;
  background: var(--warning-bg);
  color: #856404;
  border: 1px solid #FFEAA7;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.88rem;
  margin-top: 0.75rem;
}

.confirm-modal-footer {
  display: flex; justify-content: flex-end; gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #D8D8E8;
  background: #EDEBE7;                 /* ← xám ấm thay vì #FAFAFA */
  border-radius: 0 0 16px 16px;
  flex-shrink: 0;
}

.btn-cancel {
  padding: 8px 20px; border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--surface); color: var(--text-muted);
  font-size: 0.9rem; font-weight: 500; cursor: pointer;
  transition: all 0.2s;
}
.btn-cancel:hover { background: var(--border); color: var(--text); }

.btn-confirm {
  padding: 8px 22px; border-radius: 8px; border: none;
  font-size: 0.9rem; font-weight: 600; cursor: pointer;
  display: flex; align-items: center;
  color: #fff; transition: all 0.2s;
}
.btn-confirm.approve {
  background: #F0EEE8;        /* ← nền xám ấm */
  color: #1A1A2E;             /* ← chữ đen */
  border: 1.5px solid #D8D8E8;
}
.btn-confirm.approve:hover:not(:disabled) {
  background: #7c3d2d;        /* ← nền đỏ nâu khi hover */
  color: #fff;
  border-color: #7c3d2d;
  box-shadow: 0 4px 12px rgba(124,61,45,.35);
}
.btn-confirm.reject {
  background: #F0EEE8;
  color: #1A1A2E;
  border: 1.5px solid #D8D8E8;
}
.btn-confirm.reject:hover:not(:disabled) {
  background: #7c3d2d;
  color: #fff;
  border-color: #7c3d2d;
  box-shadow: 0 4px 12px rgba(124,61,45,.35);
}
.btn-confirm:disabled { opacity: 0.6; cursor: not-allowed; }

/* ── Modal Transition ───────────────────────────────── */
.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.25s ease; }
.modal-fade-enter-active .confirm-modal,
.modal-fade-leave-active .confirm-modal { transition: transform 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from .confirm-modal { transform: scale(0.93) translateY(12px); }
.modal-fade-leave-to   .confirm-modal { transform: scale(0.95) translateY(8px); }

/* ── Toast ──────────────────────────────────────────── */
.toast-stack {
  position: fixed; bottom: 1.5rem; right: 1.5rem;
  z-index: 10000;
  display: flex; flex-direction: column; gap: 0.5rem;
  pointer-events: none;
}
</style>

<!-- Global toast styles (unscoped) -->
<style>
.lib-toast {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 18px;
  border-radius: 10px;
  font-size: 0.88rem; font-weight: 500;
  box-shadow: 0 4px 20px rgba(0,0,0,.15);
  opacity: 0; transform: translateX(20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: auto;
  min-width: 260px; max-width: 360px;
}
.lib-toast.visible { opacity: 1; transform: translateX(0); }
.lib-toast--success { background: #EAFAF1; color: #1E8449; border-left: 4px solid #27AE60; }
.lib-toast--warning { background: #FEF9E7; color: #856404; border-left: 4px solid #F39C12; }
.lib-toast--error   { background: #FDEDEC; color: #922B21; border-left: 4px solid #E74C3C; }
.lib-toast--info    { background: #EBF5FB; color: #1A5276; border-left: 4px solid #2980B9; }
</style>