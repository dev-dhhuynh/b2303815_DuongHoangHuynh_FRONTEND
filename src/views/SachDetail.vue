<template>
  <div class="book-detail-page">
    <div class="container py-5">

      <!-- Loading -->
      <div v-if="loading" class="state-card text-center py-5">
        <div class="spinner-ring mb-3"></div>
        <p class="text-muted fw-medium">Đang tải thông tin sách...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="state-card text-center py-5">
        <div class="state-icon error mb-3"><i class="fas fa-exclamation-triangle"></i></div>
        <h5 class="fw-semibold mb-1">Không thể tải sách</h5>
        <p class="text-muted mb-3">{{ error }}</p>
        <router-link to="/sach" class="btn-back-link">
          <i class="fas fa-arrow-left me-2"></i>Quay lại danh sách
        </router-link>
      </div>

      <!-- Not Found -->
      <div v-else-if="!book" class="state-card text-center py-5">
        <div class="state-icon mb-3"><i class="fas fa-book"></i></div>
        <h5 class="fw-semibold mb-1">Không tìm thấy sách</h5>
        <p class="text-muted mb-3">Sách bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <router-link to="/sach" class="btn-back-link">
          <i class="fas fa-arrow-left me-2"></i>Quay lại danh sách
        </router-link>
      </div>

      <!-- Book Detail -->
      <div v-else>

        <!-- Breadcrumb -->
        <nav class="breadcrumb-wrap mb-4">
          <router-link to="/sach" class="breadcrumb-link">
            <i class="fas fa-book me-1"></i>Danh sách sách
          </router-link>
          <i class="fas fa-chevron-right breadcrumb-sep"></i>
          <span class="breadcrumb-current">{{ book.TenSach }}</span>
        </nav>

        <!-- Main Card -->
        <div class="detail-card">
          <div class="detail-grid">

            <!-- Cover Column -->
            <div class="cover-col">
              <div class="cover-wrap">
                <img
                  v-if="book.HinhBia"
                  :src="getImageUrl(book.HinhBia)"
                  :alt="book.TenSach"
                  class="book-cover"
                />
                <div v-else class="cover-placeholder">
                  <i class="fas fa-book-open"></i>
                  <span>Chưa có ảnh bìa</span>
                </div>
              </div>

              <!-- Availability Badge -->
              <div class="avail-badge" :class="book.SoQuyen > 0 ? 'available' : 'unavailable'">
                <i :class="book.SoQuyen > 0 ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                {{ book.SoQuyen > 0 ? `Còn ${book.SoQuyen} quyển` : 'Hết sách' }}
              </div>
            </div>

            <!-- Info Column -->
            <div class="info-col">
              <h1 class="book-title">{{ book.TenSach }}</h1>

              <!-- Meta Grid -->
              <div class="meta-grid">
                <div class="meta-item">
                  <div class="meta-icon"><i class="fas fa-user-edit"></i></div>
                  <div>
                    <div class="meta-label">Tác giả</div>
                    <div class="meta-value">{{ book.TacGia || 'Đang cập nhật' }}</div>
                  </div>
                </div>
                <div class="meta-item">
                  <div class="meta-icon"><i class="fas fa-calendar-alt"></i></div>
                  <div>
                    <div class="meta-label">Năm xuất bản</div>
                    <div class="meta-value">{{ book.NamXuatBan || 'Đang cập nhật' }}</div>
                  </div>
                </div>
                <div v-if="book.DonGia" class="meta-item">
                  <div class="meta-icon"><i class="fas fa-tag"></i></div>
                  <div>
                    <div class="meta-label">Giá bìa</div>
                    <div class="meta-value">{{ formatCurrency(book.DonGia) }}</div>
                  </div>
                </div>
                <div v-if="book.MaNXB" class="meta-item">
                  <div class="meta-icon"><i class="fas fa-building"></i></div>
                  <div>
                    <div class="meta-label">Nhà xuất bản</div>
                    <div class="meta-value">{{ book.MaNXB.TenNXB || 'Đang cập nhật' }}</div>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div v-if="book.MoTa" class="description-box">
                <div class="desc-header">
                  <i class="fas fa-align-left me-2"></i>Mô tả
                </div>
                <p class="desc-text">{{ book.MoTa }}</p>
              </div>

              <!-- Divider -->
              <div class="action-divider"></div>

              <!-- Borrow Message -->
              <Transition name="slide-down">
                <div v-if="borrowMessage" class="borrow-message" :class="borrowMsgType">
                  <i :class="borrowMsgIcon" class="me-2"></i>{{ borrowMessage }}
                </div>
              </Transition>

              <!-- Action Buttons -->
              <div class="action-row">
                <router-link v-if="!userStore.user" to="/login" class="btn-borrow">
                  <i class="fas fa-sign-in-alt me-2"></i>Đăng nhập để mượn
                </router-link>

                <button
                  v-else
                  @click="borrow"
                  class="btn-borrow"
                  :class="{ unavailable: !canBorrow }"
                  :disabled="loadingBorrow || !canBorrow"
                >
                  <span v-if="loadingBorrow" class="btn-spinner"></span>
                  <i v-else class="fas fa-hand-holding me-2"></i>
                  {{ borrowButtonText }}
                </button>

                <router-link to="/sach" class="btn-secondary-action">
                  <i class="fas fa-arrow-left me-2"></i>Quay lại
                </router-link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import sachService from "../services/sachService";
import muonService from "../services/muonService";
import { useUserStore } from "../stores/userStore";

const route     = useRoute();
const router    = useRouter();
const userStore = useUserStore();

const book           = ref(null);
const loading        = ref(true);
const loadingBorrow  = ref(false);
const error          = ref("");
const borrowMessage  = ref("");
const borrowMsgType  = ref("");

const borrowMsgIcon = computed(() => ({
  success: "fas fa-check-circle",
  warning: "fas fa-exclamation-triangle",
  danger:  "fas fa-times-circle",
}[borrowMsgType.value] || "fas fa-info-circle"));

const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  return `http://localhost:3000${imagePath}`;
};

const canBorrow = computed(() => userStore.isLoggedIn && book.value?.SoQuyen > 0);

const borrowButtonText = computed(() => {
  if (loadingBorrow.value)       return "Đang xử lý...";
  if (book.value?.SoQuyen <= 0)  return "Hết sách";
  return "Mượn sách";
});

const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

const borrow = async () => {
  if (!userStore.isLoggedIn) { router.push("/login"); return; }
  if (!book.value || book.value.SoQuyen <= 0) {
    borrowMessage.value = "Sách hiện không có sẵn để mượn";
    borrowMsgType.value = "warning"; return;
  }
  try {
    loadingBorrow.value = true;
    borrowMessage.value = "";
    await muonService.requestBorrow({
      MaSach: book.value._id,
      NgayTraDuKien: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });
    borrowMessage.value = "Yêu cầu mượn sách đã được gửi! Vui lòng chờ admin duyệt.";
    borrowMsgType.value = "success";
    setTimeout(() => loadBook(), 2000);
  } catch (err) {
    borrowMessage.value = err.response?.data?.message || "Mượn sách thất bại. Vui lòng thử lại.";
    borrowMsgType.value = "danger";
  } finally {
    loadingBorrow.value = false;
  }
};

const loadBook = async () => {
  try {
    loading.value = true; error.value = "";
    book.value = await sachService.getOne(route.params.id);
  } catch (err) {
    error.value = err.response?.data?.message || "Không thể tải thông tin sách";
  } finally {
    loading.value = false;
  }
};

onMounted(() => loadBook());
</script>

<style scoped>
/* ── Tokens ─────────────────────────────────────────── */
.book-detail-page {
  --brand:       #8B3A3A;
  --brand-dark:  #6B2C2C;
  --brand-light: #FDF0F0;
  --success:     #27AE60;
  --success-bg:  #EAFAF1;
  --danger:      #E74C3C;
  --danger-bg:   #FDEDEC;
  --warning:     #F39C12;
  --warning-bg:  #FEF9E7;
  --text:        #1A1A2E;
  --text-muted:  #6C757D;
  --border:      #E8E8F0;
  --surface:     #FFFFFF;
  --bg:          #F5F4F2;
  --radius:      14px;
  --shadow:      0 4px 24px rgba(0,0,0,.08);
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: var(--bg);
  min-height: 100vh;
}

/* ── States ──────────────────────────────────────────── */
.state-card {
  background: var(--surface); border-radius: var(--radius);
  border: 1px solid var(--border); box-shadow: var(--shadow);
}
.state-icon {
  width: 72px; height: 72px; border-radius: 50%; margin: 0 auto;
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

.btn-back-link {
  display: inline-flex; align-items: center;
  padding: 9px 20px; border-radius: 8px;
  background: var(--brand); color: #fff;
  font-size: .88rem; font-weight: 600; text-decoration: none;
  transition: background .2s;
}
.btn-back-link:hover { background: var(--brand-dark); }

/* ── Breadcrumb ──────────────────────────────────────── */
.breadcrumb-wrap {
  display: flex; align-items: center; gap: 8px;
  font-size: .85rem;
}
.breadcrumb-link {
  color: var(--brand); text-decoration: none; font-weight: 500;
  transition: color .2s;
}
.breadcrumb-link:hover { color: var(--brand-dark); }
.breadcrumb-sep  { color: var(--text-muted); font-size: .7rem; }
.breadcrumb-current { color: var(--text-muted); }

/* ── Detail Card ─────────────────────────────────────── */
.detail-card {
  background: var(--surface); border-radius: 20px;
  border: 1px solid var(--border); box-shadow: var(--shadow);
  overflow: hidden;
}

.detail-grid {
  display: grid; grid-template-columns: 280px 1fr;
  gap: 0;
}

/* ── Cover Column ────────────────────────────────────── */
.cover-col {
  background: linear-gradient(160deg, var(--brand-light) 0%, #F0EAE0 100%);
  padding: 2.5rem 2rem;
  display: flex; flex-direction: column; align-items: center; gap: 1.25rem;
  border-right: 1px solid var(--border);
}

.cover-wrap {
  width: 100%; max-width: 220px;
  border-radius: 10px; overflow: hidden;
  box-shadow: 0 8px 30px rgba(0,0,0,.15);
}

.book-cover {
  width: 100%; display: block;
  object-fit: cover; aspect-ratio: 3/4;
}

.cover-placeholder {
  aspect-ratio: 3/4; width: 100%;
  background: #F0EAE0;
  border: 2px dashed #D5C8B8;
  border-radius: 10px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 10px; color: #A0917E;
}
.cover-placeholder i { font-size: 3.5rem; }
.cover-placeholder span { font-size: .85rem; }

.avail-badge {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 7px 16px; border-radius: 20px;
  font-size: .82rem; font-weight: 600;
}
.avail-badge.available   { background: var(--success-bg); color: var(--success); }
.avail-badge.unavailable { background: var(--danger-bg);  color: var(--danger);  }

/* ── Info Column ─────────────────────────────────────── */
.info-col { padding: 2.5rem; }

.book-title {
  font-size: 1.75rem; font-weight: 800;
  color: var(--text); letter-spacing: -.5px;
  line-height: 1.3; margin-bottom: 1.75rem;
}

/* ── Meta Grid ───────────────────────────────────────── */
.meta-grid {
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: .85rem; margin-bottom: 1.75rem;
}

.meta-item {
  display: flex; align-items: flex-start; gap: 12px;
  background: var(--bg); border: 1px solid var(--border);
  border-radius: 10px; padding: 12px 14px;
}

.meta-icon {
  width: 34px; height: 34px; flex-shrink: 0;
  background: var(--brand-light); color: var(--brand);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: .85rem;
}

.meta-label { font-size: .72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: .4px; margin-bottom: 2px; }
.meta-value { font-size: .9rem; font-weight: 600; color: var(--text); }

/* ── Description ─────────────────────────────────────── */
.description-box {
  background: var(--bg); border: 1px solid var(--border);
  border-left: 4px solid var(--brand);
  border-radius: 0 10px 10px 0;
  padding: 1rem 1.25rem; margin-bottom: 1.5rem;
}
.desc-header {
  font-size: .78rem; font-weight: 700; color: var(--brand);
  text-transform: uppercase; letter-spacing: .5px; margin-bottom: .5rem;
}
.desc-text { font-size: .9rem; color: var(--text-muted); line-height: 1.7; margin: 0; }

/* ── Actions ─────────────────────────────────────────── */
.action-divider { border-top: 1px solid var(--border); margin-bottom: 1.25rem; }

.borrow-message {
  padding: 10px 14px; border-radius: 8px;
  font-size: .88rem; margin-bottom: 1.1rem;
  display: flex; align-items: center;
}
.borrow-message.success { background: var(--success-bg); color: #1E8449; border: 1px solid #A9DFBF; }
.borrow-message.warning { background: var(--warning-bg); color: #856404; border: 1px solid #FDEBD0; }
.borrow-message.danger  { background: var(--danger-bg);  color: #922B21; border: 1px solid #F5B7B1; }

.action-row { display: flex; align-items: center; gap: .85rem; flex-wrap: wrap; }

.btn-borrow {
  display: inline-flex; align-items: center;
  padding: 12px 28px; border-radius: 10px; border: none;
  background: var(--brand); color: #fff;
  font-size: .95rem; font-weight: 700;
  cursor: pointer; text-decoration: none;
  box-shadow: 0 4px 14px rgba(139,58,58,.3);
  transition: all .2s;
}
.btn-borrow:hover:not(:disabled) {
  background: var(--brand-dark); transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(139,58,58,.4);
}
.btn-borrow:disabled, .btn-borrow.unavailable {
  background: #C8C8D0; box-shadow: none; cursor: not-allowed;
}

.btn-secondary-action {
  display: inline-flex; align-items: center;
  padding: 12px 22px; border-radius: 10px;
  border: 1.5px solid var(--border);
  background: var(--surface); color: var(--text-muted);
  font-size: .9rem; font-weight: 600; text-decoration: none;
  transition: all .2s;
}
.btn-secondary-action:hover { background: var(--bg); color: var(--text); border-color: #C8C8D0; }

.btn-spinner {
  width: 17px; height: 17px; margin-right: 8px;
  border: 2px solid rgba(255,255,255,.4); border-top-color: #fff;
  border-radius: 50%; animation: spin .75s linear infinite; flex-shrink: 0;
}

/* ── Transitions ─────────────────────────────────────── */
.slide-down-enter-active, .slide-down-leave-active { transition: all .3s ease; }
.slide-down-enter-from, .slide-down-leave-to       { opacity: 0; transform: translateY(-8px); }

/* ── Responsive ──────────────────────────────────────── */
@media (max-width: 768px) {
  .detail-grid   { grid-template-columns: 1fr; }
  .cover-col     { border-right: none; border-bottom: 1px solid var(--border); padding: 2rem 1.5rem; }
  .info-col      { padding: 1.75rem 1.5rem; }
  .meta-grid     { grid-template-columns: 1fr; }
  .book-title    { font-size: 1.4rem; }
}
</style>