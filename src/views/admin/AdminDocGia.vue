<template>
  <div class="page-wrap">

    <!-- Header -->
    <div class="page-header">
      <div>
        <p class="page-tag">✦ QUẢN LÝ</p>
        <h1 class="page-title">Độc Giả</h1>
      </div>
      <!-- <button class="btn-primary" @click="openAdd">
        <i class="fas fa-plus"></i> Thêm độc giả
      </button> -->
    </div>

    <!-- Search + filter -->
    <div class="toolbar">
      <div class="search-wrap">
        <i class="fas fa-search search-icon"></i>
        <input
          v-model="search"
          class="search-input"
          placeholder="Tìm theo tên, email, số điện thoại..."
        />
        <button v-if="search" class="search-clear" @click="search = ''">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="filter-wrap">
        <select v-model="filterPhai" class="filter-select">
          <option value="">Tất cả giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nu">Nữ</option>
          <option value="Khac">Khác</option>
        </select>
      </div>
    </div>

    <!-- Stats bar -->
    <div class="stats-bar">
      <div class="stat-chip">
        <span class="stat-num">{{ filtered.length }}</span>
        <span class="stat-label">kết quả</span>
      </div>
      <div class="stat-chip">
        <span class="stat-num">{{ list.length }}</span>
        <span class="stat-label">tổng độc giả</span>
      </div>
    </div>

    <!-- Table -->
    <div class="table-wrap">
      <div v-if="loading" class="table-loading">
        <i class="fas fa-spinner fa-spin"></i> Đang tải...
      </div>

      <table v-else class="data-table">
        <thead>
          <tr>
            <th>Mã ĐG</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Điện thoại</th>
            <th>Giới tính</th>
            <th>Ngày sinh</th>
            <th>Địa chỉ</th>
            <th style="text-align:center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filtered.length === 0">
            <td colspan="8" class="table-empty">
              <i class="fas fa-user-slash"></i>
              <p>Không tìm thấy độc giả nào</p>
            </td>
          </tr>
          <tr v-for="dg in paginated" :key="dg._id" class="table-row">
            <td><span class="badge-id">{{ dg.MaDocGia }}</span></td>
            <td class="td-name">{{ dg.HoLot }} {{ dg.Ten }}</td>
            <td class="td-muted">{{ dg.email }}</td>
            <td class="td-muted">{{ dg.DienThoai }}</td>
            <td>
              <span class="badge-gender" :class="genderClass(dg.Phai)">
                {{ genderLabel(dg.Phai) }}
              </span>
            </td>
            <td class="td-muted">{{ formatDate(dg.NgaySinh) }}</td>
            <td class="td-muted td-addr">{{ dg.DiaChi || '—' }}</td>
            <td class="td-actions">
              <button class="action-btn edit" @click="openEdit(dg)" title="Sửa">
                <i class="fas fa-pen"></i>
              </button>
              <button class="action-btn delete" @click="openDelete(dg)" title="Xóa">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination" v-if="totalPages > 1">
      <button class="page-btn" :disabled="page === 1" @click="page--">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button
        v-for="p in totalPages" :key="p"
        class="page-btn"
        :class="{ active: p === page }"
        @click="page = p"
      >{{ p }}</button>
      <button class="page-btn" :disabled="page === totalPages" @click="page++">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

  </div>

  <!-- ── MODAL THÊM / SỬA ── -->
  <Teleport to="body">
    <div v-if="showFormModal" class="modal-overlay" @click.self="closeForm">
      <div class="modal-box modal-lg">

        <div class="modal-head">
          <div>
            <p class="modal-tag">{{ isEdit ? '✦ CHỈNH SỬA' : '✦ THÊM MỚI' }}</p>
            <h3 class="modal-title">{{ isEdit ? 'Cập nhật độc giả' : 'Thêm độc giả' }}</h3>
          </div>
          <button class="modal-close" @click="closeForm"><i class="fas fa-times"></i></button>
        </div>

        <div class="modal-body">
          <div class="form-grid">

            <div class="form-group">
              <label class="form-label">Họ lót <span class="req">*</span></label>
              <input v-model="form.HoLot" class="form-input" placeholder="Nguyễn Văn" />
              <p v-if="errors.HoLot" class="form-error">{{ errors.HoLot }}</p>
            </div>

            <div class="form-group">
              <label class="form-label">Tên <span class="req">*</span></label>
              <input v-model="form.Ten" class="form-input" placeholder="An" />
              <p v-if="errors.Ten" class="form-error">{{ errors.Ten }}</p>
            </div>

            <div class="form-group form-full">
              <label class="form-label">Email <span class="req">*</span></label>
              <input v-model="form.email" class="form-input" type="email" placeholder="example@gmail.com" />
              <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
            </div>

            <div class="form-group">
              <label class="form-label">Số điện thoại <span class="req">*</span></label>
              <input v-model="form.DienThoai" class="form-input" placeholder="0901234567" />
              <p v-if="errors.DienThoai" class="form-error">{{ errors.DienThoai }}</p>
            </div>

            <div class="form-group">
              <label class="form-label">Giới tính</label>
              <select v-model="form.Phai" class="form-input">
                <option value="Nam">Nam</option>
                <option value="Nu">Nữ</option>
                <option value="Khac">Khác</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Ngày sinh</label>
              <input v-model="form.NgaySinh" class="form-input" type="date" />
            </div>

            <div class="form-group form-full">
              <label class="form-label">Địa chỉ</label>
              <input v-model="form.DiaChi" class="form-input" placeholder="123 Đường ABC, Quận 1, TP.HCM" />
            </div>

            <div class="form-group form-full" v-if="!isEdit">
              <label class="form-label">Mật khẩu <span class="req">*</span></label>
              <div class="input-pass-wrap">
                <input
                  v-model="form.password"
                  class="form-input"
                  :type="showPass ? 'text' : 'password'"
                  placeholder="Tối thiểu 6 ký tự"
                />
                <button type="button" class="pass-toggle" @click="showPass = !showPass">
                  <i :class="showPass ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <p v-if="errors.password" class="form-error">{{ errors.password }}</p>
            </div>

          </div>
        </div>

        <div class="modal-footer">
          <p v-if="formError" class="form-server-error">
            <i class="fas fa-exclamation-circle"></i> {{ formError }}
          </p>
          <div class="modal-footer-btns">
            <button class="btn-ghost" @click="closeForm">Huỷ</button>
            <button class="btn-primary" :disabled="submitting" @click="submitForm">
              <i :class="submitting ? 'fas fa-spinner fa-spin' : (isEdit ? 'fas fa-save' : 'fas fa-plus')"></i>
              {{ submitting ? 'Đang lưu...' : (isEdit ? 'Lưu thay đổi' : 'Thêm độc giả') }}
            </button>
          </div>
        </div>

      </div>
    </div>
  </Teleport>

  <!-- ── MODAL XÁC NHẬN XÓA ── -->
  <Teleport to="body">
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-box">
        <div class="modal-head">
          <div>
            <p class="modal-tag danger-tag">✦ XÁC NHẬN XÓA</p>
            <h3 class="modal-title">Xóa độc giả</h3>
          </div>
          <button class="modal-close" @click="showDeleteModal = false"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <p class="modal-desc">
            Bạn có chắc muốn xóa độc giả
            <strong>{{ deleteTarget?.HoLot }} {{ deleteTarget?.Ten }}</strong>
            ({{ deleteTarget?.MaDocGia }})?
          </p>
          <p class="modal-desc warn-text">
            <i class="fas fa-exclamation-triangle"></i>
            Hành động này không thể hoàn tác.
          </p>
        </div>
        <div class="modal-footer">
          <div class="modal-footer-btns">
            <button class="btn-ghost" @click="showDeleteModal = false">Huỷ</button>
            <button class="btn-danger" :disabled="submitting" @click="confirmDelete">
              <i :class="submitting ? 'fas fa-spinner fa-spin' : 'fas fa-trash'"></i>
              {{ submitting ? 'Đang xóa...' : 'Xóa' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Toast -->
  <Teleport to="body">
    <Transition name="toast-fade">
      <div v-if="toast.show" class="toast" :class="toast.type">
        <i :class="toast.type === 'success' ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
        {{ toast.msg }}
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
// import { useAdminStore } from '../stores/adminStore'
import { useAdminStore } from '../../stores/adminStore'
import axios from 'axios'

const API = 'http://localhost:3000/api'
const adminStore = useAdminStore()
const authHeader = () => ({ Authorization: `Bearer ${adminStore.token}` })

// ── State ──
const list      = ref([])
const loading   = ref(false)
const search    = ref('')
const filterPhai = ref('')
const page      = ref(1)
const PAGE_SIZE = 10

const showFormModal   = ref(false)
const showDeleteModal = ref(false)
const isEdit          = ref(false)
const submitting      = ref(false)
const showPass        = ref(false)
const deleteTarget    = ref(null)
const formError       = ref('')

const emptyForm = () => ({
  HoLot: '', Ten: '', email: '', DienThoai: '',
  Phai: 'Nam', NgaySinh: '', DiaChi: '', password: ''
})
const form   = ref(emptyForm())
const errors = ref({})

const toast = ref({ show: false, type: 'success', msg: '' })

// ── Fetch ──
const fetchAll = async () => {
  loading.value = true
  try {
    const res = await axios.get(`${API}/docgia`, { headers: authHeader() })
    list.value = res.data
  } catch (e) {
    showToast('error', 'Không tải được danh sách độc giả')
  } finally {
    loading.value = false
  }
}

onMounted(fetchAll)

// ── Computed ──
const filtered = computed(() => {
  const q = search.value.toLowerCase().trim()
  return list.value.filter(dg => {
    const matchSearch = !q || (
      `${dg.HoLot} ${dg.Ten}`.toLowerCase().includes(q) ||
      (dg.email || '').toLowerCase().includes(q) ||
      (dg.DienThoai || '').includes(q) ||
      (dg.MaDocGia || '').toLowerCase().includes(q)
    )
    const matchGender = !filterPhai.value || dg.Phai === filterPhai.value
    return matchSearch && matchGender
  })
})

const totalPages = computed(() => Math.ceil(filtered.value.length / PAGE_SIZE))
const paginated  = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE
  return filtered.value.slice(start, start + PAGE_SIZE)
})

watch([search, filterPhai], () => { page.value = 1 })

// ── Helpers ──
const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—'
const genderLabel = (p) => ({ Nam: 'Nam', Nu: 'Nữ', Khac: 'Khác' }[p] || p)
const genderClass = (p) => ({ Nam: 'gender-nam', Nu: 'gender-nu', Khac: 'gender-khac' }[p] || '')

const showToast = (type, msg) => {
  toast.value = { show: true, type, msg }
  setTimeout(() => { toast.value.show = false }, 3000)
}

// ── Validate ──
const validate = () => {
  const e = {}
  if (!form.value.HoLot.trim())     e.HoLot    = 'Vui lòng nhập họ lót'
  if (!form.value.Ten.trim())        e.Ten      = 'Vui lòng nhập tên'
  if (!form.value.email.trim())      e.email    = 'Vui lòng nhập email'
  else if (!/\S+@\S+\.\S+/.test(form.value.email)) e.email = 'Email không hợp lệ'
  if (!form.value.DienThoai.trim())  e.DienThoai = 'Vui lòng nhập số điện thoại'
  if (!isEdit.value && !form.value.password) e.password = 'Vui lòng nhập mật khẩu'
  if (!isEdit.value && form.value.password && form.value.password.length < 6)
    e.password = 'Mật khẩu tối thiểu 6 ký tự'
  errors.value = e
  return Object.keys(e).length === 0
}

// ── Open modals ──
const openAdd = () => {
  isEdit.value  = false
  form.value    = emptyForm()
  errors.value  = {}
  formError.value = ''
  showPass.value = false
  showFormModal.value = true
}

const openEdit = (dg) => {
  isEdit.value = true
  form.value = {
    _id:       dg._id,
    HoLot:     dg.HoLot     || '',
    Ten:       dg.Ten       || '',
    email:     dg.email     || '',
    DienThoai: dg.DienThoai || '',
    Phai:      dg.Phai      || 'Khac',
    NgaySinh:  dg.NgaySinh  ? dg.NgaySinh.slice(0, 10) : '',
    DiaChi:    dg.DiaChi    || '',
    password:  ''
  }
  errors.value  = {}
  formError.value = ''
  showFormModal.value = true
}

const openDelete = (dg) => {
  deleteTarget.value = dg
  showDeleteModal.value = true
}

const closeForm = () => { showFormModal.value = false }

// ── Submit ──
const submitForm = async () => {
  if (!validate()) return
  submitting.value = true
  formError.value  = ''

  try {
    if (isEdit.value) {
      // Sửa — gọi PUT /docgia/:id (admin route)
      const payload = { ...form.value }
      delete payload._id
      delete payload.password   // admin không đổi mật khẩu ở đây
      await axios.put(`${API}/docgia/${form.value._id}`, payload, { headers: authHeader() })
      showToast('success', 'Cập nhật độc giả thành công')
    } else {
      // Thêm — dùng route đăng ký (auth/register tạo tài khoản + trả token)
      await axios.post(`${API}/auth/register`, form.value)
      showToast('success', 'Thêm độc giả thành công')
    }
    closeForm()
    await fetchAll()
  } catch (e) {
    formError.value = e.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại'
  } finally {
    submitting.value = false
  }
}

const confirmDelete = async () => {
  submitting.value = true
  try {
    await axios.delete(`${API}/docgia/${deleteTarget.value._id}`, { headers: authHeader() })
    showToast('success', 'Đã xóa độc giả')
    showDeleteModal.value = false
    await fetchAll()
  } catch (e) {
    showToast('error', e.response?.data?.message || 'Xóa thất bại')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

/* ── Page ── */
.page-wrap {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'DM Sans', sans-serif;
}

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
  gap: 1rem;
}
.page-tag {
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  color: #7c3d2d;
  font-weight: 500;
  margin: 0 0 0.25rem;
  text-transform: uppercase;
}
.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: #1a120e;
  margin: 0;
}

/* ── Toolbar ── */
.toolbar {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.search-wrap {
  position: relative;
  flex: 1;
  min-width: 220px;
}
.search-icon {
  position: absolute;
  left: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9a8a84;
  font-size: 0.8rem;
}
.search-input {
  width: 100%;
  padding: 0.6rem 2.2rem 0.6rem 2.2rem;
  border: 1.5px solid #e0d8d2;
  border-radius: 6px;
  font-size: 0.88rem;
  font-family: 'DM Sans', sans-serif;
  color: #2c2420;
  background: #fff;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.search-input:focus { outline: none; border-color: #7c3d2d; }
.search-clear {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9a8a84;
  cursor: pointer;
  font-size: 0.8rem;
  padding: 0;
}
.filter-select {
  padding: 0.6rem 1rem;
  border: 1.5px solid #e0d8d2;
  border-radius: 6px;
  font-size: 0.88rem;
  font-family: 'DM Sans', sans-serif;
  color: #2c2420;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.2s;
}
.filter-select:focus { outline: none; border-color: #7c3d2d; }

/* ── Stats ── */
.stats-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.stat-chip {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  background: #faf8f5;
  border: 1px solid #e8e0d8;
  border-radius: 6px;
  padding: 0.3rem 0.75rem;
}
.stat-num { font-size: 1rem; font-weight: 700; color: #1a120e; }
.stat-label { font-size: 0.75rem; color: #9a8a84; }

/* ── Table ── */
.table-wrap {
  background: #fff;
  border: 1px solid #e8e0d8;
  border-radius: 8px;
  overflow: auto;
  margin-bottom: 1.25rem;
}
.table-loading {
  padding: 3rem;
  text-align: center;
  color: #9a8a84;
  font-size: 0.9rem;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}
.data-table th {
  padding: 0.7rem 1rem;
  text-align: left;
  font-size: 0.72rem;
  font-weight: 500;
  color: #9a8a84;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  border-bottom: 1px solid #e8e0d8;
  background: #faf8f5;
  white-space: nowrap;
}
.table-row td {
  padding: 0.8rem 1rem;
  font-size: 0.875rem;
  color: #2c2420;
  border-bottom: 1px solid #f5f1ec;
  vertical-align: middle;
}
.table-row:last-child td { border-bottom: none; }
.table-row:hover { background: #fffcfa; }

.table-empty {
  padding: 3rem 1rem !important;
  text-align: center;
  color: #9a8a84;
}
.table-empty i { font-size: 2rem; margin-bottom: 0.5rem; display: block; }
.table-empty p { margin: 0; font-size: 0.88rem; }

.badge-id {
  display: inline-block;
  background: #f0ebe4;
  color: #7c3d2d;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 0.04em;
}
.td-name { font-weight: 500; }
.td-muted { color: #6b5c55; }
.td-addr {
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.badge-gender {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 2px 10px;
  border-radius: 10px;
}
.gender-nam  { background: #e8f4fd; color: #2471a3; }
.gender-nu   { background: #fdeef4; color: #a93278; }
.gender-khac { background: #f0ebe4; color: #6b5c55; }

.td-actions {
  display: flex;
  gap: 0.4rem;
  justify-content: center;
}
.action-btn {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.75rem;
  transition: background 0.15s, color 0.15s;
}
.action-btn.edit   { background: #f0ebe4; color: #7c3d2d; }
.action-btn.edit:hover   { background: #7c3d2d; color: #fff; }
.action-btn.delete { background: #fdedec; color: #c0392b; }
.action-btn.delete:hover { background: #c0392b; color: #fff; }

/* ── Pagination ── */
.pagination {
  display: flex;
  justify-content: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}
.page-btn {
  min-width: 34px;
  height: 34px;
  border: 1.5px solid #e0d8d2;
  background: #fff;
  border-radius: 5px;
  font-size: 0.83rem;
  color: #4a3530;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.15s;
  padding: 0 0.5rem;
}
.page-btn:hover:not(:disabled) { border-color: #7c3d2d; color: #7c3d2d; }
.page-btn.active { background: #7c3d2d; color: #fff; border-color: #7c3d2d; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── Buttons ── */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: #7c3d2d;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.25rem;
  font-size: 0.875rem;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}
.btn-primary:hover:not(:disabled) { background: #5c2d1f; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: 1.5px solid #c9b5af;
  color: #4a3530;
  border-radius: 5px;
  padding: 0.55rem 1.25rem;
  font-size: 0.85rem;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-ghost:hover { border-color: #7c3d2d; color: #7c3d2d; }

.btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #c0392b;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0.55rem 1.25rem;
  font-size: 0.85rem;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-danger:hover:not(:disabled) { background: #922b21; }
.btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }

/* ── Modal ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(26, 18, 14, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1.5rem;
}
.modal-box {
  background: #faf8f5;
  border-radius: 10px;
  width: 100%;
  max-width: 460px;
  border: 1px solid #e8e0d8;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}
.modal-lg { max-width: 640px; }

.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 1.75rem 1.1rem;
  border-bottom: 1px solid #e8e0d8;
  flex-shrink: 0;
}
.modal-tag {
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  color: #7c3d2d;
  font-weight: 500;
  margin: 0 0 0.25rem;
}
.danger-tag { color: #c0392b; }
.modal-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
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
  flex-shrink: 0;
}
.modal-close:hover { color: #2c2420; }

.modal-body {
  padding: 1.5rem 1.75rem;
  overflow-y: auto;
}
.modal-desc {
  font-size: 0.9rem;
  color: #4a3530;
  line-height: 1.65;
  margin: 0 0 0.75rem;
}
.warn-text { color: #b94a2c; font-size: 0.84rem; }
.warn-text i { margin-right: 0.3rem; }

.modal-footer {
  padding: 1rem 1.75rem 1.5rem;
  border-top: 1px solid #e8e0d8;
  flex-shrink: 0;
}
.modal-footer-btns {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
.form-server-error {
  font-size: 0.82rem;
  color: #c0392b;
  background: #fdedec;
  border-radius: 5px;
  padding: 0.45rem 0.75rem;
  margin: 0 0 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

/* ── Form ── */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.form-full { grid-column: 1 / -1; }

.form-group { display: flex; flex-direction: column; gap: 0.35rem; }
.form-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: #4a3530;
  letter-spacing: 0.02em;
}
.req { color: #c0392b; }
.form-input {
  padding: 0.6rem 0.85rem;
  border: 1.5px solid #e0d8d2;
  border-radius: 6px;
  font-size: 0.875rem;
  font-family: 'DM Sans', sans-serif;
  color: #2c2420;
  background: #fff;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}
.form-input:focus { outline: none; border-color: #7c3d2d; }
.form-error { font-size: 0.78rem; color: #c0392b; margin: 0; }

.input-pass-wrap { position: relative; }
.input-pass-wrap .form-input { padding-right: 2.5rem; }
.pass-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9a8a84;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0;
}
.pass-toggle:hover { color: #4a3530; }

/* ── Toast ── */
.toast {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 2000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}
.toast.success { background: #eafaf1; color: #1e8a4a; border: 1px solid #a9dfbf; }
.toast.error   { background: #fdedec; color: #c0392b; border: 1px solid #f5b7b1; }

.toast-fade-enter-active, .toast-fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; transform: translateY(10px); }

/* ── Responsive ── */
@media (max-width: 640px) {
  .page-wrap { padding: 1rem; }
  .form-grid { grid-template-columns: 1fr; }
  .form-full { grid-column: 1; }
  .modal-body { padding: 1rem 1.25rem; }
  .modal-head { padding: 1rem 1.25rem 0.85rem; }
  .modal-footer { padding: 0.75rem 1.25rem 1.25rem; }
}
</style>