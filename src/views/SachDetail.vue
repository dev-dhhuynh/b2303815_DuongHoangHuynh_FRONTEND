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

                <!-- NÚT QR -->
                <button class="btn-qr" @click="showQR = true" title="Xem mã QR">
                  <i class="fas fa-qrcode me-2"></i>Mã QR
                </button>

                <router-link to="/sach" class="btn-secondary-action">
                  <i class="fas fa-arrow-left me-2"></i>Quay lại
                </router-link>
              </div>

            </div>
          </div>
        </div>

        <!-- RELATED BOOKS - CÙNG TÁC GIẢ -->
        <div v-if="relatedBooks.length > 0" class="related-section">
          <div class="related-header">
            <div class="related-tag">✦ GỢI Ý</div>
            <h3 class="related-title">
              Sách cùng tác giả <span class="related-author">"{{ book.TacGia }}"</span>
            </h3>
          </div>
          <div class="related-grid">
            <div
              v-for="rb in relatedBooks"
              :key="rb._id"
              class="related-card"
              @click="goToBook(rb._id)"
            >
              <div class="related-cover">
                <img
                  v-if="rb.HinhBia"
                  :src="getImageUrl(rb.HinhBia)"
                  :alt="rb.TenSach"
                />
                <div v-else class="related-cover-placeholder">
                  <i class="fas fa-book-open"></i>
                </div>
              </div>
              <div class="related-info">
                <p class="related-name">{{ rb.TenSach }}</p>
                <p class="related-year">{{ rb.NamXuatBan }}</p>
                <span class="related-avail" :class="rb.SoQuyen > 0 ? 'avail' : 'unavail'">
                  {{ rb.SoQuyen > 0 ? 'Còn sách' : 'Hết sách' }}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- QR MODAL -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showQR" class="qr-overlay" @click.self="showQR = false">
          <div class="qr-modal">
            <div class="qr-modal-header">
              <div>
                <p class="qr-tag">✦ MÃ QR SÁCH</p>
                <h3 class="qr-title">{{ book?.TenSach }}</h3>
              </div>
              <button class="qr-close" @click="showQR = false">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="qr-body">
              <canvas ref="qrCanvas" class="qr-canvas"></canvas>
              <p class="qr-hint">Quét mã để mở trang chi tiết sách</p>
              <p class="qr-url">{{ bookUrl }}</p>
            </div>
            <div class="qr-footer">
              <button class="btn-download-qr" @click="downloadQR">
                <i class="fas fa-download me-2"></i>Tải xuống QR
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import QRCode from "qrcode";
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
const showQR         = ref(false);
const qrCanvas       = ref(null);
const relatedBooks   = ref([]);

const bookUrl = computed(() =>
  `${window.location.origin}/sach/${route.params.id}`
);

// Vẽ QR lên canvas khi modal mở
watch(showQR, async (val) => {
  if (!val) return;
  await nextTick();
  if (qrCanvas.value) {
    QRCode.toCanvas(qrCanvas.value, bookUrl.value, {
      width: 220,
      margin: 2,
      color: { dark: '#2c2420', light: '#faf8f5' }
    });
  }
});

const downloadQR = () => {
  if (!qrCanvas.value) return;
  const link = document.createElement('a');
  link.download = `QR_${book.value?.TenSach || 'sach'}.png`;
  link.href = qrCanvas.value.toDataURL('image/png');
  link.click();
};

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

const goToBook = (id) => {
  router.push(`/sach/${id}`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const loadRelatedBooks = async (tacGia, currentId) => {
  try {
    const all = await sachService.getAll();
    relatedBooks.value = all
      .filter(b => b.TacGia === tacGia && b._id !== currentId)
      .slice(0, 4);
  } catch (e) {
    console.error('Không tải được sách liên quan:', e);
  }
};

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
    loading.value = true;
    error.value = "";
    book.value = await sachService.getOne(route.params.id);
    await loadRelatedBooks(book.value.TacGia, book.value._id);
  } catch (err) {
    error.value = err.response?.data?.message || "Không thể tải thông tin sách";
  } finally {
    loading.value = false;
  }
};

// Reload khi chuyển sang sách khác cùng tác giả
watch(() => route.params.id, () => {
  loadBook();
});

onMounted(() => loadBook());
</script>

<style scoped>
/* ── Tokens ── */
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

/* ── States ── */
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

/* ── Breadcrumb ── */
.breadcrumb-wrap { display: flex; align-items: center; gap: 8px; font-size: .85rem; }
.breadcrumb-link { color: var(--brand); text-decoration: none; font-weight: 500; transition: color .2s; }
.breadcrumb-link:hover { color: var(--brand-dark); }
.breadcrumb-sep  { color: var(--text-muted); font-size: .7rem; }
.breadcrumb-current { color: var(--text-muted); }

/* ── Detail Card ── */
.detail-card {
  background: var(--surface); border-radius: 20px;
  border: 1px solid var(--border); box-shadow: var(--shadow); overflow: hidden;
}
.detail-grid { display: grid; grid-template-columns: 280px 1fr; gap: 0; }

/* ── Cover Column ── */
.cover-col {
  background: linear-gradient(160deg, var(--brand-light) 0%, #F0EAE0 100%);
  padding: 2.5rem 2rem;
  display: flex; flex-direction: column; align-items: center; gap: 1.25rem;
  border-right: 1px solid var(--border);
}
.cover-wrap { width: 100%; max-width: 220px; border-radius: 10px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,.15); }
.book-cover { width: 100%; display: block; object-fit: cover; aspect-ratio: 3/4; }
.cover-placeholder {
  aspect-ratio: 3/4; width: 100%; background: #F0EAE0;
  border: 2px dashed #D5C8B8; border-radius: 10px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 10px; color: #A0917E;
}
.cover-placeholder i { font-size: 3.5rem; }
.cover-placeholder span { font-size: .85rem; }
.avail-badge {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 7px 16px; border-radius: 20px; font-size: .82rem; font-weight: 600;
}
.avail-badge.available   { background: var(--success-bg); color: var(--success); }
.avail-badge.unavailable { background: var(--danger-bg);  color: var(--danger);  }

/* ── Info Column ── */
.info-col { padding: 2.5rem; }
.book-title { font-size: 1.75rem; font-weight: 800; color: var(--text); letter-spacing: -.5px; line-height: 1.3; margin-bottom: 1.75rem; }

/* ── Meta Grid ── */
.meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: .85rem; margin-bottom: 1.75rem; }
.meta-item { display: flex; align-items: flex-start; gap: 12px; background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; }
.meta-icon { width: 34px; height: 34px; flex-shrink: 0; background: var(--brand-light); color: var(--brand); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: .85rem; }
.meta-label { font-size: .72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: .4px; margin-bottom: 2px; }
.meta-value { font-size: .9rem; font-weight: 600; color: var(--text); }

/* ── Description ── */
.description-box { background: var(--bg); border: 1px solid var(--border); border-left: 4px solid var(--brand); border-radius: 0 10px 10px 0; padding: 1rem 1.25rem; margin-bottom: 1.5rem; }
.desc-header { font-size: .78rem; font-weight: 700; color: var(--brand); text-transform: uppercase; letter-spacing: .5px; margin-bottom: .5rem; }
.desc-text { font-size: .9rem; color: var(--text-muted); line-height: 1.7; margin: 0; }

/* ── Actions ── */
.action-divider { border-top: 1px solid var(--border); margin-bottom: 1.25rem; }
.borrow-message { padding: 10px 14px; border-radius: 8px; font-size: .88rem; margin-bottom: 1.1rem; display: flex; align-items: center; }
.borrow-message.success { background: var(--success-bg); color: #1E8449; border: 1px solid #A9DFBF; }
.borrow-message.warning { background: var(--warning-bg); color: #856404; border: 1px solid #FDEBD0; }
.borrow-message.danger  { background: var(--danger-bg);  color: #922B21; border: 1px solid #F5B7B1; }
.action-row { display: flex; align-items: center; gap: .85rem; flex-wrap: wrap; }

.btn-borrow {
  display: inline-flex; align-items: center;
  padding: 12px 28px; border-radius: 10px; border: none;
  background: var(--brand); color: #fff;
  font-size: .95rem; font-weight: 700; cursor: pointer; text-decoration: none;
  box-shadow: 0 4px 14px rgba(139,58,58,.3); transition: all .2s;
}
.btn-borrow:hover:not(:disabled) { background: var(--brand-dark); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(139,58,58,.4); }
.btn-borrow:disabled, .btn-borrow.unavailable { background: #C8C8D0; box-shadow: none; cursor: not-allowed; }

.btn-qr {
  display: inline-flex; align-items: center;
  padding: 12px 22px; border-radius: 10px;
  border: 1.5px solid var(--brand); background: var(--brand-light);
  color: var(--brand); font-size: .9rem; font-weight: 600; cursor: pointer;
  transition: all .2s;
}
.btn-qr:hover { background: var(--brand); color: #fff; }

.btn-secondary-action {
  display: inline-flex; align-items: center;
  padding: 12px 22px; border-radius: 10px;
  border: 1.5px solid var(--border); background: var(--surface); color: var(--text-muted);
  font-size: .9rem; font-weight: 600; text-decoration: none; transition: all .2s;
}
.btn-secondary-action:hover { background: var(--bg); color: var(--text); border-color: #C8C8D0; }

.btn-spinner { width: 17px; height: 17px; margin-right: 8px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: spin .75s linear infinite; flex-shrink: 0; }

/* ── RELATED BOOKS ── */
.related-section {
  margin-top: 2.5rem;
  background: var(--surface);
  border-radius: 20px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  padding: 2rem;
}
.related-header {
  margin-bottom: 1.5rem;
}
.related-tag {
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  color: var(--brand);
  font-weight: 600;
  margin-bottom: 0.35rem;
}
.related-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}
.related-author {
  color: var(--brand);
}
.related-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
.related-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}
.related-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  border-color: var(--brand);
}
.related-cover {
  width: 100%;
  aspect-ratio: 3/4;
  overflow: hidden;
  background: var(--brand-light);
}
.related-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.related-card:hover .related-cover img {
  transform: scale(1.05);
}
.related-cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--brand);
  font-size: 2rem;
  opacity: 0.4;
}
.related-info {
  padding: 0.75rem;
}
.related-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 0.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}
.related-year {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0 0 0.5rem;
}
.related-avail {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}
.related-avail.avail {
  background: var(--success-bg);
  color: var(--success);
}
.related-avail.unavail {
  background: var(--danger-bg);
  color: var(--danger);
}

/* ── QR Modal ── */
.qr-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(26,18,14,.55);
  display: flex; align-items: center; justify-content: center; padding: 1.5rem;
}
.qr-modal {
  background: #faf8f5; border-radius: 12px;
  border: 1px solid #e8e0d8; width: 100%; max-width: 340px;
  box-shadow: 0 16px 48px rgba(44,36,32,.2);
}
.qr-modal-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 1.25rem 1.5rem 1rem; border-bottom: 1px solid #e8e0d8;
}
.qr-tag { font-size: .7rem; letter-spacing: .18em; color: #7c3d2d; font-weight: 500; margin: 0 0 .2rem; }
.qr-title { font-size: 1rem; font-weight: 700; color: #1a120e; margin: 0; line-height: 1.4; max-width: 220px; }
.qr-close { background: none; border: none; color: #9a8a84; font-size: 1rem; cursor: pointer; padding: .25rem; transition: color .2s; }
.qr-close:hover { color: #2c2420; }
.qr-body { padding: 1.5rem; display: flex; flex-direction: column; align-items: center; gap: .75rem; }
.qr-canvas { border-radius: 8px; border: 1px solid #e8e0d8; }
.qr-hint { font-size: .8rem; color: #9a8a84; margin: 0; }
.qr-url { font-size: .72rem; color: #b0a09a; margin: 0; word-break: break-all; text-align: center; }
.qr-footer { padding: .75rem 1.5rem 1.25rem; display: flex; justify-content: center; }
.btn-download-qr {
  display: inline-flex; align-items: center;
  padding: 9px 22px; border-radius: 8px; border: none;
  background: #7c3d2d; color: #fff;
  font-size: .85rem; font-weight: 600; cursor: pointer; transition: background .2s;
}
.btn-download-qr:hover { background: #5c2d1f; }

/* ── Transitions ── */
.slide-down-enter-active, .slide-down-leave-active { transition: all .3s ease; }
.slide-down-enter-from, .slide-down-leave-to       { opacity: 0; transform: translateY(-8px); }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity .2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to       { opacity: 0; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .detail-grid { grid-template-columns: 1fr; }
  .cover-col   { border-right: none; border-bottom: 1px solid var(--border); padding: 2rem 1.5rem; }
  .info-col    { padding: 1.75rem 1.5rem; }
  .meta-grid   { grid-template-columns: 1fr; }
  .book-title  { font-size: 1.4rem; }
  .related-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .related-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>