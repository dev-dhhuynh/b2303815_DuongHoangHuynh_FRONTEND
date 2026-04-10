<template>
  <div class="profile-page">

    <!-- NOT LOGGED IN -->
    <div v-if="!userStore.user" class="empty-state">
      <div class="empty-inner">
        <div class="empty-icon">
          <i class="fas fa-user-slash"></i>
        </div>
        <h2 class="empty-title">Chưa đăng nhập</h2>
        <p class="empty-desc">Vui lòng đăng nhập để xem thông tin cá nhân</p>
        <router-link to="/login" class="btn-primary-hero">
          <i class="fas fa-sign-in-alt"></i> Đăng Nhập Ngay
        </router-link>
      </div>
    </div>

    <!-- MAIN PROFILE -->
    <div v-else class="profile-container">

      <!-- Header -->
      <div class="profile-header">
        <p class="section-tag">✦ TÀI KHOẢN CỦA BẠN</p>
        <h1 class="profile-title">Thông Tin Cá Nhân</h1>
        <p class="profile-sub">Quản lý thông tin tài khoản của bạn</p>
      </div>

      <div class="profile-grid">

        <!-- LEFT: Avatar + Actions -->
        <aside class="profile-sidebar">
          <div class="avatar-card">
            <div class="avatar-circle">
              <i class="fas fa-user"></i>
            </div>
            <h3 class="avatar-name">{{ userStore.user.HoLot }} {{ userStore.user.Ten }}</h3>
            <p class="avatar-id">Mã độc giả: {{ userStore.user.MaDocGia || 'Chưa có' }}</p>

            <div class="sidebar-actions">
              <button class="btn-edit" @click="openEditModal">
                <i class="fas fa-edit"></i> Chỉnh Sửa
              </button>
              <router-link to="/lich-su-muon" class="btn-ghost-sm">
                <i class="fas fa-book"></i> Lịch Sử Mượn
              </router-link>
              <button class="btn-danger-sm" @click="logout">
                <i class="fas fa-sign-out-alt"></i> Đăng Xuất
              </button>
            </div>
          </div>

          <!-- Stats -->
          <div class="stats-card">
            <p class="stats-label">✦ THỐNG KÊ MƯỢN SÁCH</p>
            <div class="stats-list">
              <div class="stat-row">
                <span class="stat-name">Chờ duyệt</span>
                <span class="stat-val pending">{{ stats.pending }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-name">Đang mượn</span>
                <span class="stat-val borrowing">{{ stats.approved }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-name">Đã trả</span>
                <span class="stat-val returned">{{ stats.returned }}</span>
              </div>
            </div>
          </div>
        </aside>

        <!-- RIGHT: Info Fields -->
        <main class="profile-main">
          <div v-if="error" class="notice-bar">
            <i class="fas fa-exclamation-circle"></i>
            {{ error }}
          </div>

          <div class="info-card">
            <p class="card-section-tag">✦ THÔNG TIN CƠ BẢN</p>

            <div class="info-grid">
              <div class="info-field full">
                <label>Họ và tên</label>
                <div class="field-val">{{ userStore.user.HoLot }} {{ userStore.user.Ten }}</div>
              </div>
              <div class="info-field">
                <label>Email</label>
                <div class="field-val">{{ userStore.user.email || 'Chưa cập nhật' }}</div>
              </div>
              <div class="info-field">
                <label>Điện thoại</label>
                <div class="field-val">{{ userStore.user.DienThoai || 'Chưa cập nhật' }}</div>
              </div>
              <div class="info-field">
                <label>Ngày sinh</label>
                <div class="field-val">{{ formatDate(userStore.user.NgaySinh) || 'Chưa cập nhật' }}</div>
              </div>
              <div class="info-field">
                <label>Giới tính</label>
                <div class="field-val">{{ formatGender(userStore.user.Phai) }}</div>
              </div>
              <div class="info-field full">
                <label>Địa chỉ</label>
                <div class="field-val">{{ userStore.user.DiaChi || 'Chưa cập nhật' }}</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- EDIT MODAL -->
    <Teleport to="body">
      <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
        <div class="modal-box">
          <div class="modal-head">
            <div>
              <p class="section-tag" style="margin-bottom:0.25rem">✦ CHỈNH SỬA</p>
              <h3 class="modal-title">Cập Nhật Thông Tin</h3>
            </div>
            <button class="modal-close" @click="closeEditModal">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="modal-body-content">
            <div v-if="editError" class="notice-bar">
              <i class="fas fa-exclamation-circle"></i> {{ editError }}
            </div>

            <form @submit.prevent="saveProfile">
              <div class="form-grid">
                <div class="form-field">
                  <label>Họ <span class="req">*</span></label>
                  <input v-model="editForm.HoLot" type="text" required placeholder="Nhập họ" />
                </div>
                <div class="form-field">
                  <label>Tên <span class="req">*</span></label>
                  <input v-model="editForm.Ten" type="text" required placeholder="Nhập tên" />
                </div>
                <div class="form-field full">
                  <label>Email <span class="req">*</span></label>
                  <input v-model="editForm.email" type="email" required placeholder="email@example.com" />
                </div>
                <div class="form-field">
                  <label>Điện thoại <span class="req">*</span></label>
                  <input v-model="editForm.DienThoai" type="tel" required placeholder="0xxxxxxxxx" />
                </div>
                <div class="form-field">
                  <label>Ngày sinh</label>
                  <input v-model="editForm.NgaySinh" type="date" />
                </div>
                <div class="form-field full">
                  <label>Giới tính</label>
                  <div class="radio-group">
                    <label class="radio-opt">
                      <input v-model="editForm.Phai" type="radio" value="Nam" /> Nam
                    </label>
                    <label class="radio-opt">
                      <input v-model="editForm.Phai" type="radio" value="Nu" /> Nữ
                    </label>
                    <label class="radio-opt">
                      <input v-model="editForm.Phai" type="radio" value="Khac" /> Khác
                    </label>
                  </div>
                </div>
                <div class="form-field full">
                  <label>Địa chỉ</label>
                  <textarea v-model="editForm.DiaChi" rows="2" placeholder="Nhập địa chỉ..."></textarea>
                </div>
              </div>

              <!-- Password Section -->
              <div class="password-section">
                <p class="pwd-label">✦ ĐỔI MẬT KHẨU <span style="font-weight:400;opacity:.6">(tùy chọn)</span></p>
                <div class="form-grid">
                  <div class="form-field">
                    <label>Mật khẩu mới</label>
                    <input v-model="editForm.newPassword" type="password" placeholder="Để trống nếu không đổi" minlength="6" />
                  </div>
                  <div class="form-field">
                    <label>Xác nhận mật khẩu</label>
                    <input v-model="editForm.confirmPassword" type="password" placeholder="Nhập lại mật khẩu mới" />
                    <span v-if="passwordMismatch" class="field-err">Mật khẩu không khớp</span>
                  </div>
                </div>
              </div>

              <div class="modal-footer-btns">
                <button type="button" class="btn-ghost-sm" @click="closeEditModal" :disabled="savingProfile">Huỷ</button>
                <button type="submit" class="btn-edit" :disabled="savingProfile">
                  <span v-if="savingProfile"><i class="fas fa-spinner fa-spin"></i></span>
                  <span v-else><i class="fas fa-save"></i> Lưu Thay Đổi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- TOAST -->
    <div v-if="toast.show" class="toast-notif" :class="toast.type">
      <i :class="toast.icon"></i> {{ toast.message }}
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'
import muonService from '../services/muonService'
import docgiaService from '../services/docgiaService'

const userStore = useUserStore()
const router = useRouter()

const stats = ref({ pending: 0, approved: 0, returned: 0, rejected: 0 })
const loading = ref(false)
const error = ref('')
const showEditModal = ref(false)
const savingProfile = ref(false)
const editError = ref('')

const editForm = ref({
  HoLot: '', Ten: '', email: '', DienThoai: '',
  NgaySinh: '', Phai: 'Khac', DiaChi: '',
  newPassword: '', confirmPassword: ''
})

const toast = ref({ show: false, type: '', message: '', icon: '' })

const passwordMismatch = computed(() =>
  editForm.value.newPassword &&
  editForm.value.confirmPassword &&
  editForm.value.newPassword !== editForm.value.confirmPassword
)

const openEditModal = () => {
  if (!userStore.user) return
  editForm.value = {
    HoLot: userStore.user.HoLot || '',
    Ten: userStore.user.Ten || '',
    email: userStore.user.email || '',
    DienThoai: userStore.user.DienThoai || '',
    NgaySinh: formatDateForInput(userStore.user.NgaySinh),
    Phai: userStore.user.Phai || 'Khac',
    DiaChi: userStore.user.DiaChi || '',
    newPassword: '', confirmPassword: ''
  }
  editError.value = ''
  showEditModal.value = true
}

const closeEditModal = () => {
  if (savingProfile.value) return
  showEditModal.value = false
  editError.value = ''
}

const saveProfile = async () => {
  if (passwordMismatch.value) { editError.value = 'Mật khẩu xác nhận không khớp'; return }
  if (!editForm.value.HoLot || !editForm.value.Ten || !editForm.value.email || !editForm.value.DienThoai) {
    editError.value = 'Vui lòng điền đầy đủ các trường bắt buộc'; return
  }
  try {
    savingProfile.value = true
    editError.value = ''
    const updateData = {
      HoLot: editForm.value.HoLot, Ten: editForm.value.Ten,
      email: editForm.value.email, DienThoai: editForm.value.DienThoai,
      NgaySinh: editForm.value.NgaySinh || null,
      Phai: editForm.value.Phai, DiaChi: editForm.value.DiaChi || ''
    }
    if (editForm.value.newPassword) updateData.password = editForm.value.newPassword
    const result = await docgiaService.updateProfile(updateData)
    if (result.success) {
      userStore.user = result.user
      localStorage.setItem('userData', JSON.stringify(result.user))
      showToast('success', 'Cập nhật thông tin thành công!')
      closeEditModal()
      await loadBorrowStats()
    } else {
      editError.value = result.message || 'Cập nhật thất bại'
    }
  } catch (err) {
    editError.value = err.response?.data?.message || 'Lỗi khi cập nhật thông tin'
  } finally {
    savingProfile.value = false
  }
}

const showToast = (type, message) => {
  const icons = { success: 'fas fa-check-circle', error: 'fas fa-exclamation-circle', warning: 'fas fa-exclamation-triangle', info: 'fas fa-info-circle' }
  toast.value = { show: true, type, message, icon: icons[type] || icons.info }
  setTimeout(() => { toast.value.show = false }, 3000)
}

const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  } catch { return '' }
}

const loadBorrowStats = async () => {
  if (!userStore.user) return
  try {
    loading.value = true
    error.value = ''
    const borrowRecords = await muonService.getUserBorrows()
    stats.value = {
      pending: borrowRecords.filter(r => r.status === 'pending').length,
      approved: borrowRecords.filter(r => r.status === 'approved').length,
      returned: borrowRecords.filter(r => r.status === 'returned').length,
      rejected: borrowRecords.filter(r => r.status === 'rejected').length
    }
  } catch (err) {
    error.value = 'Không thể tải thống kê: ' + (err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })
  } catch { return '' }
}

const formatGender = (gender) => {
  if (!gender) return 'Chưa cập nhật'
  return { M: 'Nam', Nam: 'Nam', F: 'Nữ', Nu: 'Nữ', Nữ: 'Nữ', Khac: 'Khác', Khác: 'Khác' }[gender] || gender
}

const logout = () => {
  if (confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
    userStore.logout()
    router.push('/')
  }
}

onMounted(() => { if (userStore.user) loadBorrowStats() })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

/* ── ROOT ── */
.profile-page {
  font-family: 'DM Sans', sans-serif;
  background: #faf8f5;
  color: #2c2420;
  min-height: 100vh;
  padding-bottom: 4rem;
}

/* ── EMPTY STATE ── */
.empty-state {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.empty-inner {
  text-align: center;
  max-width: 400px;
}
.empty-icon {
  width: 80px;
  height: 80px;
  background: #f0ebe4;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #7c3d2d;
  margin: 0 auto 1.5rem;
}
.empty-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a120e;
  margin: 0 0 0.5rem;
}
.empty-desc {
  color: #9a8a84;
  margin-bottom: 2rem;
}

/* ── CONTAINER ── */
.profile-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 4rem 2rem 0;
}

/* ── HEADER ── */
.profile-header {
  margin-bottom: 3rem;
}
.section-tag {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: #7c3d2d;
  font-weight: 500;
  margin-bottom: 0.5rem;
}
.profile-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.4rem;
  font-weight: 700;
  color: #1a120e;
  margin: 0 0 0.25rem;
}
.profile-sub {
  color: #9a8a84;
  font-size: 0.9rem;
  margin: 0;
}

/* ── GRID LAYOUT ── */
.profile-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  align-items: start;
}

/* ── SIDEBAR ── */
.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.avatar-card {
  background: #fff;
  border: 1px solid #e8e0d8;
  border-radius: 8px;
  padding: 2rem 1.5rem;
  text-align: center;
}
.avatar-circle {
  width: 80px;
  height: 80px;
  background: #7c3d2d;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #fff;
  margin: 0 auto 1.25rem;
  border: 4px solid #f0ebe4;
}
.avatar-name {
  font-family: 'Playfair Display', serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: #1a120e;
  margin: 0 0 0.25rem;
}
.avatar-id {
  font-size: 0.8rem;
  color: #9a8a84;
  margin: 0 0 1.5rem;
}

.sidebar-actions {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.stats-card {
  background: #fff;
  border: 1px solid #e8e0d8;
  border-left: 4px solid #7c3d2d;
  border-radius: 8px;
  padding: 1.25rem 1.5rem;
}
.stats-label {
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  color: #7c3d2d;
  font-weight: 500;
  margin-bottom: 1rem;
}
.stats-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.87rem;
}
.stat-name { color: #6b5c55; }
.stat-val {
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem;
  font-weight: 700;
  min-width: 2rem;
  text-align: right;
}
.stat-val.pending { color: #9a6b00; }
.stat-val.borrowing { color: #7c3d2d; }
.stat-val.returned { color: #2d6b3d; }

/* ── MAIN INFO ── */
.profile-main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-card {
  background: #fff;
  border: 1px solid #e8e0d8;
  border-radius: 8px;
  padding: 2rem;
}
.card-section-tag {
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  color: #7c3d2d;
  font-weight: 500;
  margin-bottom: 1.5rem;
}
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}
.info-field { display: flex; flex-direction: column; gap: 0.35rem; }
.info-field.full { grid-column: 1 / -1; }
.info-field label {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9a8a84;
  font-weight: 500;
}
.field-val {
  padding: 0.6rem 0.85rem;
  background: #faf8f5;
  border: 1px solid #e8e0d8;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #2c2420;
  min-height: 38px;
  display: flex;
  align-items: center;
}

/* ── NOTICE BAR ── */
.notice-bar {
  background: #fff8f6;
  border: 1px solid #f0c4b8;
  border-left: 4px solid #c0522a;
  border-radius: 6px;
  color: #7c3d2d;
  font-size: 0.88rem;
  padding: 0.85rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

/* ── BUTTONS ── */
.btn-primary-hero {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #7c3d2d;
  color: #fff;
  padding: 0.85rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.03em;
  transition: background 0.2s;
  border: none;
  cursor: pointer;
}
.btn-primary-hero:hover { background: #5c2d1f; }

.btn-edit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  background: #7c3d2d;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.6rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  letter-spacing: 0.03em;
  transition: background 0.2s;
  text-decoration: none;
  width: 100%;
}
.btn-edit:hover { background: #5c2d1f; }
.btn-edit:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-ghost-sm {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  background: none;
  border: 1.5px solid #c9b5af;
  color: #4a3530;
  border-radius: 4px;
  padding: 0.6rem 1rem;
  font-size: 0.85rem;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  letter-spacing: 0.03em;
  transition: all 0.2s;
  text-decoration: none;
  width: 100%;
}
.btn-ghost-sm:hover { border-color: #7c3d2d; color: #7c3d2d; }
.btn-ghost-sm:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-danger-sm {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  background: none;
  border: 1.5px solid #f0c4b8;
  color: #b94a2c;
  border-radius: 4px;
  padding: 0.6rem 1rem;
  font-size: 0.85rem;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  letter-spacing: 0.03em;
  transition: all 0.2s;
  width: 100%;
}
.btn-danger-sm:hover { background: #fff1ee; border-color: #b94a2c; }

/* ── MODAL ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(26, 18, 14, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1.5rem;
}
.modal-box {
  background: #faf8f5;
  border-radius: 8px;
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid #e8e0d8;
}
.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.75rem 2rem 1.25rem;
  border-bottom: 1px solid #e8e0d8;
}
.modal-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a120e;
  margin: 0;
}
.modal-close {
  background: none;
  border: none;
  color: #9a8a84;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.2s;
}
.modal-close:hover { color: #2c2420; }
.modal-body-content { padding: 1.75rem 2rem; }

/* ── FORM ── */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.1rem;
  margin-bottom: 1.5rem;
}
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.form-field.full { grid-column: 1 / -1; }
.form-field label {
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #6b5c55;
  font-weight: 500;
}
.form-field input,
.form-field textarea {
  padding: 0.6rem 0.85rem;
  background: #fff;
  border: 1px solid #e8e0d8;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: 'DM Sans', sans-serif;
  color: #2c2420;
  transition: border-color 0.2s;
  outline: none;
}
.form-field input:focus,
.form-field textarea:focus { border-color: #7c3d2d; }
.form-field textarea { resize: vertical; }
.req { color: #b94a2c; }
.field-err { font-size: 0.78rem; color: #b94a2c; margin-top: 0.2rem; }

.radio-group {
  display: flex;
  gap: 1.5rem;
  padding: 0.5rem 0;
}
.radio-opt {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.88rem;
  color: #4a3530;
  cursor: pointer;
  text-transform: none;
  letter-spacing: 0;
}
.radio-opt input[type="radio"] { accent-color: #7c3d2d; }

.password-section {
  border-top: 1px solid #e8e0d8;
  padding-top: 1.5rem;
  margin-bottom: 1.5rem;
}
.pwd-label {
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  color: #7c3d2d;
  font-weight: 500;
  margin-bottom: 1rem;
}
.modal-footer-btns {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  border-top: 1px solid #e8e0d8;
  padding-top: 1.25rem;
}
.modal-footer-btns .btn-ghost-sm,
.modal-footer-btns .btn-edit {
  width: auto;
  padding: 0.6rem 1.5rem;
}

/* ── TOAST ── */
.toast-notif {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  padding: 0.85rem 1.5rem;
  border-radius: 6px;
  color: #fff;
  font-size: 0.88rem;
  font-weight: 500;
  z-index: 9999;
  min-width: 280px;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  animation: slideIn 0.3s ease;
  box-shadow: 0 8px 24px rgba(44, 36, 32, 0.15);
}
.toast-notif.success { background: #2d6b3d; }
.toast-notif.error   { background: #b94a2c; }
.toast-notif.warning { background: #9a6b00; }
.toast-notif.info    { background: #4a3530; }
@keyframes slideIn {
  from { transform: translateX(120%); opacity: 0; }
  to   { transform: translateX(0);   opacity: 1; }
}

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .profile-grid { grid-template-columns: 1fr; }
  .profile-sidebar { flex-direction: row; flex-wrap: wrap; }
  .avatar-card { flex: 1; min-width: 240px; }
  .stats-card { flex: 1; min-width: 200px; }
}
@media (max-width: 640px) {
  .profile-container { padding: 2rem 1rem 0; }
  .info-grid { grid-template-columns: 1fr; }
  .form-grid { grid-template-columns: 1fr; }
  .profile-sidebar { flex-direction: column; }
  .profile-title { font-size: 1.8rem; }
}
</style>