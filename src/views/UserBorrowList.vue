<template>
  <div class="borrow-list-page">
    <div class="container py-5">

      <!-- Page Header -->
      <div class="page-header mb-5">
        <div class="header-left">
          <div class="header-icon"><i class="fas fa-book-reader"></i></div>
          <div>
            <h1 class="page-title mb-0">Sách đã mượn</h1>
            <p class="page-subtitle mb-0">Theo dõi lịch sử và trạng thái mượn sách của bạn</p>
          </div>
        </div>
        <router-link to="/sach" class="btn-explore">
          <i class="fas fa-search me-2"></i>Mượn thêm sách
        </router-link>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="state-card text-center py-5">
        <div class="spinner-ring mb-3"></div>
        <p class="text-muted fw-medium">Đang tải danh sách sách đã mượn...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="state-card text-center py-5">
        <div class="state-icon error mb-3"><i class="fas fa-exclamation-triangle"></i></div>
        <h5 class="fw-semibold mb-1">Không thể tải dữ liệu</h5>
        <p class="text-muted">{{ error }}</p>
      </div>

      <!-- Empty -->
      <div v-else-if="borrowList.length === 0" class="state-card text-center py-5">
        <div class="state-icon mb-3"><i class="fas fa-book-open"></i></div>
        <h5 class="fw-semibold mb-1">Chưa có sách nào được mượn</h5>
        <p class="text-muted mb-3">Hãy mượn sách để bắt đầu hành trình đọc sách nhé!</p>
        <router-link to="/sach" class="btn-cta">
          <i class="fas fa-compass me-2"></i>Khám phá sách ngay
        </router-link>
      </div>

      <!-- Main Content -->
      <div v-else>

        <!-- Filter Tabs -->
        <div class="filter-bar mb-4">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            class="filter-tab"
            :class="{ active: filterStatus === tab.value }"
            @click="filterStatus = tab.value"
          >
            <i :class="tab.icon" class="me-1"></i>
            {{ tab.label }}
            <span class="tab-count" :class="{ active: filterStatus === tab.value }">
              {{ tab.value === '' ? borrowList.length : getCountByStatus(tab.value) }}
            </span>
          </button>
        </div>

        <!-- Cards Grid -->
        <div v-if="filteredBorrows.length === 0" class="state-card text-center py-4">
          <p class="text-muted mb-0">Không có yêu cầu nào trong mục này.</p>
        </div>

        <div v-else class="borrow-grid">
          <div
            v-for="borrow in filteredBorrows"
            :key="borrow._id"
            class="borrow-card"
          >
            <!-- Card Header -->
            <div class="bc-header">
              <div class="bc-book-icon"><i class="fas fa-book"></i></div>
              <span class="bc-status-badge" :class="borrow.status">
                <i :class="statusIcon(borrow.status)" class="me-1"></i>
                {{ getStatusText(borrow.status) }}
              </span>
            </div>

            <!-- Book Title -->
            <h5 class="bc-title">{{ borrow.MaSach?.TenSach || 'Đang tải...' }}</h5>
            <p class="bc-author" v-if="borrow.MaSach?.TacGia">
              <i class="fas fa-user-edit me-1"></i>{{ borrow.MaSach.TacGia }}
            </p>

            <!-- Date Info -->
            <div class="bc-dates">
              <div class="date-row">
                <span class="date-label"><i class="fas fa-paper-plane me-1"></i>Ngày yêu cầu</span>
                <span class="date-val">{{ formatDate(borrow.createdAt) }}</span>
              </div>
              <div v-if="borrow.NgayMuon" class="date-row">
                <span class="date-label"><i class="fas fa-hand-holding me-1"></i>Ngày mượn</span>
                <span class="date-val">{{ formatDate(borrow.NgayMuon) }}</span>
              </div>
              <div v-if="borrow.NgayTraDuKien" class="date-row">
                <span class="date-label"><i class="fas fa-flag me-1"></i>Hạn trả</span>
                <span class="date-val" :class="{ overdue: isOverdue(borrow) }">
                  {{ formatDate(borrow.NgayTraDuKien) }}
                  <span v-if="isOverdue(borrow)" class="overdue-tag">Quá hạn</span>
                </span>
              </div>
              <div v-if="borrow.NgayTra" class="date-row">
                <span class="date-label"><i class="fas fa-undo me-1"></i>Ngày trả</span>
                <span class="date-val">{{ formatDate(borrow.NgayTra) }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="bc-actions">
              <router-link
                v-if="borrow.MaSach?._id"
                :to="'/sach/' + borrow.MaSach._id"
                class="bc-btn view"
              >
                <i class="fas fa-eye me-1"></i>Xem sách
              </router-link>

              <button
                v-if="borrow.status === 'approved'"
                @click="openReturnModal(borrow)"
                class="bc-btn return"
                :disabled="processingReturn === borrow._id"
              >
                <span v-if="processingReturn === borrow._id" class="btn-spinner"></span>
                <i v-else class="fas fa-undo me-1"></i>
                Trả sách
              </button>

              <span v-else-if="borrow.status === 'pending'" class="bc-status-chip pending">
                <i class="fas fa-hourglass-half me-1"></i>Chờ duyệt
              </span>
              <span v-else-if="borrow.status === 'returned'" class="bc-status-chip returned">
                <i class="fas fa-check me-1"></i>Đã hoàn trả
              </span>
              <span v-else-if="borrow.status === 'rejected'" class="bc-status-chip rejected">
                <i class="fas fa-times me-1"></i>Đã từ chối
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Return Confirm Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showReturnModal" class="modal-overlay" @click.self="showReturnModal = false">
          <div class="confirm-modal">
            <div class="confirm-modal-header">
              <div class="modal-header-icon"><i class="fas fa-undo"></i></div>
              <h5 class="mb-0 fw-bold">Xác nhận trả sách</h5>
              <button class="modal-close-btn" @click="showReturnModal = false">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="confirm-modal-body">
              <p class="confirm-message">Bạn có chắc chắn muốn trả sách này không?</p>
              <div class="request-info-card" v-if="returningBorrow">
                <div class="info-row">
                  <i class="fas fa-book me-2 text-muted"></i>
                  <span class="text-muted">Sách:</span>
                  <strong class="ms-1">{{ returningBorrow.MaSach?.TenSach }}</strong>
                </div>
                <div class="info-row" v-if="returningBorrow.NgayTraDuKien">
                  <i class="fas fa-flag me-2 text-muted"></i>
                  <span class="text-muted">Hạn trả:</span>
                  <strong class="ms-1">{{ formatDate(returningBorrow.NgayTraDuKien) }}</strong>
                </div>
              </div>
            </div>
            <div class="confirm-modal-footer">
              <button class="btn-cancel" @click="showReturnModal = false">
                <i class="fas fa-arrow-left me-1"></i>Huỷ
              </button>
              <button class="btn-confirm-return" @click="confirmReturn" :disabled="processingReturn">
                <span v-if="processingReturn" class="btn-spinner"></span>
                <i v-else class="fas fa-undo me-1"></i>
                Xác nhận trả
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Toast -->
    <div class="toast-stack" id="toastStack"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "../stores/userStore";
import { useRouter } from "vue-router";
import muonService from "../services/muonService";

const userStore = useUserStore();
const router    = useRouter();

const borrowList      = ref([]);
const loading         = ref(false);
const error           = ref("");
const filterStatus    = ref("");
const processingReturn = ref("");
const showReturnModal  = ref(false);
const returningBorrow  = ref(null);

const tabs = [
  { value: "",         label: "Tất cả",    icon: "fas fa-list" },
  { value: "pending",  label: "Chờ duyệt", icon: "fas fa-hourglass-half" },
  { value: "approved", label: "Đang mượn", icon: "fas fa-book-reader" },
  { value: "returned", label: "Đã trả",    icon: "fas fa-check-circle" },
  { value: "rejected", label: "Từ chối",   icon: "fas fa-times-circle" },
];

const filteredBorrows = computed(() =>
  filterStatus.value ? borrowList.value.filter((b) => b.status === filterStatus.value) : borrowList.value
);

const getCountByStatus  = (s) => borrowList.value.filter((b) => b.status === s).length;
const getStatusText = (s) => ({ pending: "Chờ duyệt", approved: "Đang mượn", returned: "Đã trả", rejected: "Từ chối" }[s] || s);
const statusIcon    = (s) => ({ pending: "fas fa-hourglass-half", approved: "fas fa-book-reader", returned: "fas fa-check-circle", rejected: "fas fa-times-circle" }[s] || "fas fa-circle");

const isOverdue = (borrow) =>
  borrow.status === "approved" && borrow.NgayTraDuKien && new Date(borrow.NgayTraDuKien) < new Date();

const formatDate = (d) => {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" }); }
  catch { return "—"; }
};

const loadBorrowList = async () => {
  if (!userStore.user) { router.push("/login"); return; }
  try {
    loading.value = true; error.value = "";
    borrowList.value = await muonService.getUserBorrows();
  } catch (err) {
    error.value = "Không thể tải danh sách: " + (err.response?.data?.message || err.message);
  } finally {
    loading.value = false;
  }
};

const openReturnModal = (borrow) => {
  returningBorrow.value = borrow;
  showReturnModal.value = true;
};

const confirmReturn = async () => {
  if (!returningBorrow.value) return;
  try {
    processingReturn.value = returningBorrow.value._id;
    await muonService.returnBook(returningBorrow.value._id);
    showReturnModal.value = false;
    showToast("success", "Đã gửi yêu cầu trả sách thành công!");
    await loadBorrowList();
  } catch (err) {
    showToast("error", "Lỗi khi trả sách: " + (err.response?.data?.message || err.message));
  } finally {
    processingReturn.value = "";
  }
};

const showToast = (type, message) => {
  const stack = document.getElementById("toastStack");
  if (!stack) return;
  const icons = { success: "check-circle", error: "times-circle", warning: "exclamation-triangle" };
  const el = document.createElement("div");
  el.className = `lib-toast lib-toast--${type}`;
  el.innerHTML = `<i class="fas fa-${icons[type] || "info-circle"}"></i><span>${message}</span>`;
  stack.appendChild(el);
  requestAnimationFrame(() => el.classList.add("visible"));
  setTimeout(() => { el.classList.remove("visible"); setTimeout(() => el.remove(), 350); }, 3200);
};

onMounted(() => {
  userStore.user ? loadBorrowList() : router.push("/login");
});
</script>

<style scoped>
/* ── Tokens ─────────────────────────────────────────── */
.borrow-list-page {
  --brand:       #8B3A3A;
  --brand-dark:  #6B2C2C;
  --brand-light: #FDF0F0;
  --success:     #27AE60;
  --success-bg:  #EAFAF1;
  --danger:      #E74C3C;
  --danger-bg:   #FDEDEC;
  --warning:     #F39C12;
  --warning-bg:  #FEF9E7;
  --info:        #2980B9;
  --info-bg:     #EBF5FB;
  --text:        #1A1A2E;
  --text-muted:  #6C757D;
  --border:      #E8E8F0;
  --surface:     #FFFFFF;
  --bg:          #F5F4F2;
  --radius:      12px;
  --shadow:      0 2px 16px rgba(0,0,0,.08);
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: var(--bg);
  min-height: 100vh;
}

/* ── Page Header ─────────────────────────────────────── */
.page-header {
  display: flex; align-items: center; justify-content: space-between;
  gap: 1rem; flex-wrap: wrap;
  padding-bottom: 1.5rem; border-bottom: 2px solid var(--border);
}
.header-left { display: flex; align-items: center; gap: 1rem; }
.header-icon {
  width: 52px; height: 52px; flex-shrink: 0;
  background: var(--brand); color: #fff; border-radius: var(--radius);
  display: flex; align-items: center; justify-content: center; font-size: 1.3rem;
  box-shadow: 0 4px 12px rgba(139,58,58,.3);
}
.page-title   { font-size: 1.75rem; font-weight: 700; color: var(--text); letter-spacing: -.5px; }
.page-subtitle { color: var(--text-muted); font-size: .9rem; }

.btn-explore {
  display: inline-flex; align-items: center;
  padding: 10px 22px; border-radius: 10px;
  border: 1.5px solid var(--brand); background: var(--brand-light); color: var(--brand);
  font-size: .9rem; font-weight: 600; text-decoration: none;
  transition: all .2s;
}
.btn-explore:hover { background: var(--brand); color: #fff; }

/* ── State Cards ─────────────────────────────────────── */
.state-card {
  background: var(--surface); border-radius: var(--radius);
  border: 1px solid var(--border); box-shadow: var(--shadow);
}
.state-icon {
  width: 72px; height: 72px; margin: 0 auto; border-radius: 50%;
  background: var(--brand-light); color: var(--brand);
  display: flex; align-items: center; justify-content: center; font-size: 1.8rem;
}
.state-icon.error { background: var(--danger-bg); color: var(--danger); }
.spinner-ring {
  width: 44px; height: 44px; margin: 0 auto;
  border: 3px solid var(--border); border-top-color: var(--brand);
  border-radius: 50%; animation: spin .8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.btn-cta {
  display: inline-flex; align-items: center;
  padding: 10px 24px; border-radius: 10px; border: none;
  background: var(--brand); color: #fff;
  font-size: .9rem; font-weight: 600; text-decoration: none;
  box-shadow: 0 4px 12px rgba(139,58,58,.3); transition: all .2s;
}
.btn-cta:hover { background: var(--brand-dark); transform: translateY(-1px); }

/* ── Filter Bar ──────────────────────────────────────── */
.filter-bar {
  display: flex; gap: .5rem; flex-wrap: wrap;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: .75rem 1rem;
  box-shadow: var(--shadow);
}
.filter-tab {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 16px; border-radius: 20px; border: 1.5px solid transparent;
  background: transparent; color: var(--text-muted);
  font-size: .83rem; font-weight: 600; cursor: pointer;
  transition: all .2s;
}
.filter-tab:hover { background: var(--brand-light); color: var(--brand); border-color: #F5C6C6; }
.filter-tab.active { background: var(--brand); color: #fff; border-color: var(--brand); }

.tab-count {
  background: rgba(0,0,0,.1); color: inherit;
  padding: 1px 8px; border-radius: 10px; font-size: .75rem;
}
.filter-tab.active .tab-count { background: rgba(255,255,255,.25); color: #fff; }

/* ── Borrow Grid ─────────────────────────────────────── */
.borrow-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem;
}
@media (max-width: 768px) { .borrow-grid { grid-template-columns: 1fr; } }

/* ── Borrow Card ─────────────────────────────────────── */
.borrow-card {
  background: var(--surface); border-radius: 14px;
  border: 1px solid var(--border); box-shadow: var(--shadow);
  padding: 1.25rem; display: flex; flex-direction: column; gap: .75rem;
  transition: transform .2s, box-shadow .2s;
}
.borrow-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,.1); }

.bc-header { display: flex; align-items: center; justify-content: space-between; }
.bc-book-icon {
  width: 36px; height: 36px;
  background: var(--brand-light); color: var(--brand);
  border-radius: 8px; display: flex; align-items: center; justify-content: center;
  font-size: .9rem;
}

/* Status badges */
.bc-status-badge {
  display: inline-flex; align-items: center;
  padding: 4px 12px; border-radius: 20px;
  font-size: .75rem; font-weight: 700;
}
.bc-status-badge.pending  { background: var(--warning-bg); color: #856404; }
.bc-status-badge.approved { background: var(--success-bg); color: var(--success); }
.bc-status-badge.returned { background: var(--info-bg);    color: var(--info); }
.bc-status-badge.rejected { background: var(--danger-bg);  color: var(--danger); }

.bc-title  { font-size: 1rem; font-weight: 700; color: var(--text); margin: 0; line-height: 1.4; }
.bc-author { font-size: .82rem; color: var(--text-muted); margin: 0; }

/* Dates */
.bc-dates { display: flex; flex-direction: column; gap: 5px; }
.date-row {
  display: flex; align-items: center; justify-content: space-between;
  font-size: .82rem; padding: 5px 0;
  border-bottom: 1px dashed var(--border);
}
.date-row:last-child { border-bottom: none; }
.date-label { color: var(--text-muted); }
.date-val   { font-weight: 600; color: var(--text); }
.date-val.overdue { color: var(--danger); }
.overdue-tag {
  display: inline-block; background: var(--danger-bg);
  color: var(--danger); font-size: .7rem; font-weight: 700;
  padding: 1px 7px; border-radius: 10px; margin-left: 6px;
}

/* Actions */
.bc-actions {
  display: flex; align-items: center; gap: .6rem;
  padding-top: .75rem; border-top: 1px solid var(--border);
  flex-wrap: wrap;
}
.bc-btn {
  display: inline-flex; align-items: center;
  padding: 7px 16px; border-radius: 8px; border: none;
  font-size: .82rem; font-weight: 600; cursor: pointer;
  text-decoration: none; transition: all .2s;
}
.bc-btn.view   { background: var(--brand-light); color: var(--brand); border: 1px solid #F5C6C6; }
.bc-btn.view:hover { background: var(--brand); color: #fff; }
.bc-btn.return { background: var(--success-bg); color: var(--success); border: 1px solid #A9DFBF; }
.bc-btn.return:hover:not(:disabled) { background: var(--success); color: #fff; }
.bc-btn:disabled { opacity: .55; cursor: not-allowed; }

.bc-status-chip {
  display: inline-flex; align-items: center;
  padding: 6px 14px; border-radius: 8px;
  font-size: .8rem; font-weight: 600;
}
.bc-status-chip.pending  { background: var(--warning-bg); color: #856404; }
.bc-status-chip.returned { background: var(--info-bg);    color: var(--info); }
.bc-status-chip.rejected { background: var(--danger-bg);  color: var(--danger); }

.btn-spinner {
  width: 14px; height: 14px; margin-right: 6px;
  border: 2px solid rgba(255,255,255,.4); border-top-color: #fff;
  border-radius: 50%; animation: spin .75s linear infinite; flex-shrink: 0;
}

/* ── Confirm Modal ───────────────────────────────────── */
.modal-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(20,20,40,.55); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; padding: 1rem;
}
.confirm-modal {
  background: var(--surface); border-radius: 16px;
  width: 100%; max-width: 440px; box-shadow: 0 8px 40px rgba(0,0,0,.14); overflow: hidden;
}
.confirm-modal-header {
  display: flex; align-items: center; gap: 12px;
  padding: 1.25rem 1.5rem; background: var(--success); color: #fff; position: relative;
}
.modal-header-icon {
  width: 36px; height: 36px; background: rgba(255,255,255,.2); border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0;
}
.modal-close-btn {
  position: absolute; right: 1.25rem; top: 50%; transform: translateY(-50%);
  background: rgba(255,255,255,.2); border: none; color: #fff;
  width: 30px; height: 30px; border-radius: 50%; cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: background .2s;
}
.modal-close-btn:hover { background: rgba(255,255,255,.35); }
.confirm-modal-body { padding: 1.5rem; }
.confirm-message { color: var(--text); margin-bottom: 1rem; }
.request-info-card {
  background: var(--bg); border: 1px solid var(--border); border-radius: 10px;
  padding: 1rem; display: flex; flex-direction: column; gap: .5rem;
}
.info-row { display: flex; align-items: center; font-size: .88rem; }
.confirm-modal-footer {
  display: flex; justify-content: flex-end; gap: .75rem;
  padding: 1rem 1.5rem; border-top: 1px solid var(--border); background: #FAFAFA;
}
.btn-cancel {
  padding: 8px 20px; border-radius: 8px; border: 1px solid var(--border);
  background: var(--surface); color: var(--text-muted);
  font-size: .9rem; font-weight: 500; cursor: pointer; transition: all .2s;
}
.btn-cancel:hover { background: var(--border); }
.btn-confirm-return {
  padding: 8px 22px; border-radius: 8px; border: none;
  background: var(--success); color: #fff;
  font-size: .9rem; font-weight: 600; cursor: pointer;
  display: flex; align-items: center; transition: all .2s;
}
.btn-confirm-return:hover:not(:disabled) { background: #229954; }
.btn-confirm-return:disabled { opacity: .6; cursor: not-allowed; }

/* ── Modal Transition ────────────────────────────────── */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity .25s ease; }
.modal-fade-enter-active .confirm-modal, .modal-fade-leave-active .confirm-modal { transition: transform .25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from .confirm-modal { transform: scale(.93) translateY(12px); }

/* ── Toast ───────────────────────────────────────────── */
.toast-stack {
  position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 10000;
  display: flex; flex-direction: column; gap: .5rem; pointer-events: none;
}

/* Responsive */
@media (max-width: 576px) {
  .page-header { flex-direction: column; align-items: flex-start; }
  .filter-bar  { padding: .6rem; }
}
</style>

<style>
.lib-toast {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 18px; border-radius: 10px;
  font-size: .88rem; font-weight: 500;
  box-shadow: 0 4px 20px rgba(0,0,0,.15);
  opacity: 0; transform: translateX(20px);
  transition: opacity .3s ease, transform .3s ease;
  pointer-events: auto; min-width: 260px; max-width: 360px;
}
.lib-toast.visible { opacity: 1; transform: translateX(0); }
.lib-toast--success { background: #EAFAF1; color: #1E8449; border-left: 4px solid #27AE60; }
.lib-toast--error   { background: #FDEDEC; color: #922B21; border-left: 4px solid #E74C3C; }
.lib-toast--warning { background: #FEF9E7; color: #856404; border-left: 4px solid #F39C12; }
</style>