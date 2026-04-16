<template>
  <div class="page-wrap">

    <!-- Header -->
    <div class="page-header">
      <div>
        <p class="page-tag">✦ QUẢN LÝ</p>
        <h1 class="page-title">Nhân Viên</h1>
      </div>
      <button class="btn-primary" @click="openAdd">
        <i class="fas fa-plus"></i> Thêm nhân viên
      </button>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="search-wrap">
        <i class="fas fa-search search-icon"></i>
        <input
          v-model="search"
          class="search-input"
          placeholder="Tìm theo tên, MSNV, chức vụ..."
        />
        <button v-if="search" class="search-clear" @click="search = ''">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="filter-wrap">
        <select v-model="filterChucVu" class="filter-select">
          <option value="">Tất cả chức vụ</option>
          <option value="admin">Admin</option>
          <option value="thu_kho">Thủ kho</option>
          <option value="ke_toan">Kế toán</option>
          <option value="nhan_vien">Nhân viên</option>
        </select>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-bar">
      <div class="stat-chip">
        <span class="stat-num">{{ filtered.length }}</span>
        <span class="stat-label">kết quả</span>
      </div>
      <div class="stat-chip">
        <span class="stat-num">{{ list.length }}</span>
        <span class="stat-label">tổng nhân viên</span>
      </div>
      <div class="stat-chip">
        <span class="stat-num">{{ adminCount }}</span>
        <span class="stat-label">admin</span>
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
            <th>MSNV</th>
            <th>Họ tên</th>
            <th>Chức vụ / Quyền</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
            <th>Ngày tạo</th>
            <th style="text-align:center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filtered.length === 0">
            <td colspan="7" class="table-empty">
              <i class="fas fa-user-slash"></i>
              <p>Không tìm thấy nhân viên nào</p>
            </td>
          </tr>
          <tr v-for="nv in paginated" :key="nv._id" class="table-row">
            <td><span class="badge-id">{{ nv.MSNV }}</span></td>
            <td class="td-name">{{ nv.HoTenNV }}</td>
            <td>
              <span class="badge-role" :class="roleClass(nv.ChucVu)">
                <i :class="roleIcon(nv.ChucVu)"></i>
                {{ roleLabel(nv.ChucVu) }}
              </span>
            </td>
            <td class="td-muted">{{ nv.SoDienThoai || '—' }}</td>
            <td class="td-muted td-addr">{{ nv.DiaChi || '—' }}</td>
            <td class="td-muted">{{ formatDate(nv.createdAt) }}</td>
            <td class="td-actions">
              <button class="action-btn edit" @click="openEdit(nv)" title="Sửa">
                <i class="fas fa-pen"></i>
              </button>
              <button
                class="action-btn role"
                @click="openRole(nv)"
                title="Phân quyền"
              >
                <i class="fas fa-shield-alt"></i>
              </button>
              <button
                class="action-btn delete"
                @click="openDelete(nv)"
                title="Xóa"
                :disabled="nv._id === adminStore.admin?.id"
              >
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
        class="page-btn" :class="{ active: p === page }"
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
            <h3 class="modal-title">{{ isEdit ? 'Cập nhật nhân viên' : 'Thêm nhân viên' }}</h3>
          </div>
          <button class="modal-close" @click="closeForm"><i class="fas fa-times"></i></button>
        </div>

        <div class="modal-body">
          <div class="form-grid">

            <div class="form-group">
              <label class="form-label">MSNV <span class="req">*</span></label>
              <input
                v-model="form.MSNV"
                class="form-input"
                placeholder="NV001"
                :disabled="isEdit"
                :class="{ disabled: isEdit }"
              />
              <p v-if="errors.MSNV" class="form-error">{{ errors.MSNV }}</p>
            </div>

            <div class="form-group">
              <label class="form-label">Họ tên <span class="req">*</span></label>
              <input v-model="form.HoTenNV" class="form-input" placeholder="Nguyễn Văn An" />
              <p v-if="errors.HoTenNV" class="form-error">{{ errors.HoTenNV }}</p>
            </div>

            <div class="form-group">
              <label class="form-label">Số điện thoại</label>
              <input v-model="form.SoDienThoai" class="form-input" placeholder="0901234567" />
            </div>

            <div class="form-group">
              <label class="form-label">Chức vụ <span class="req">*</span></label>
              <select v-model="form.ChucVu" class="form-input">
                <option value="admin">Admin</option>
                <option value="thu_kho">Thủ kho</option>
                <option value="ke_toan">Kế toán</option>
                <option value="nhan_vien">Nhân viên</option>
              </select>
            </div>

            <div class="form-group form-full">
              <label class="form-label">Địa chỉ</label>
              <input v-model="form.DiaChi" class="form-input" placeholder="123 Đường ABC, Quận 1" />
            </div>

            <div class="form-group form-full">
              <label class="form-label">
                Mật khẩu
                <span class="req" v-if="!isEdit">*</span>
                <span class="optional" v-else">(để trống nếu không đổi)</span>
              </label>
              <div class="input-pass-wrap">
                <input
                  v-model="form.password"
                  class="form-input"
                  :type="showPass ? 'text' : 'password'"
                  :placeholder="isEdit ? 'Để trống nếu không đổi mật khẩu' : 'Tối thiểu 6 ký tự'"
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
              {{ submitting ? 'Đang lưu...' : (isEdit ? 'Lưu thay đổi' : 'Thêm nhân viên') }}
            </button>
          </div>
        </div>

      </div>
    </div>
  </Teleport>

  <!-- ── MODAL PHÂN QUYỀN ── -->
  <Teleport to="body">
    <div v-if="showRoleModal" class="modal-overlay" @click.self="showRoleModal = false">
      <div class="modal-box">

        <div class="modal-head">
          <div>
            <p class="modal-tag role-tag">✦ PHÂN QUYỀN</p>
            <h3 class="modal-title">Cấp quyền nhân viên</h3>
          </div>
          <button class="modal-close" @click="showRoleModal = false"><i class="fas fa-times"></i></button>
        </div>

        <div class="modal-body">
          <div class="role-target-info">
            <div class="role-avatar">
              <i class="fas fa-user-tie"></i>
            </div>
            <div>
              <p class="role-target-name">{{ roleTarget?.HoTenNV }}</p>
              <p class="role-target-msnv">MSNV: {{ roleTarget?.MSNV }}</p>
            </div>
          </div>

          <p class="role-section-label">Chọn chức vụ / quyền hạn</p>

          <div class="role-options">
            <label
              v-for="opt in roleOptions"
              :key="opt.value"
              class="role-option"
              :class="{ selected: roleForm.ChucVu === opt.value }"
            >
              <input type="radio" v-model="roleForm.ChucVu" :value="opt.value" hidden />
              <div class="role-option-icon" :class="opt.colorClass">
                <i :class="opt.icon"></i>
              </div>
              <div class="role-option-info">
                <p class="role-option-name">{{ opt.label }}</p>
                <p class="role-option-desc">{{ opt.desc }}</p>
              </div>
              <i v-if="roleForm.ChucVu === opt.value" class="fas fa-check-circle role-check"></i>
            </label>
          </div>
        </div>

        <div class="modal-footer">
          <p v-if="formError" class="form-server-error">
            <i class="fas fa-exclamation-circle"></i> {{ formError }}
          </p>
          <div class="modal-footer-btns">
            <button class="btn-ghost" @click="showRoleModal = false">Huỷ</button>
            <button class="btn-role" :disabled="submitting" @click="submitRole">
              <i :class="submitting ? 'fas fa-spinner fa-spin' : 'fas fa-shield-alt'"></i>
              {{ submitting ? 'Đang lưu...' : 'Cập nhật quyền' }}
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
            <h3 class="modal-title">Xóa nhân viên</h3>
          </div>
          <button class="modal-close" @click="showDeleteModal = false"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <p class="modal-desc">
            Bạn có chắc muốn xóa nhân viên
            <strong>{{ deleteTarget?.HoTenNV }}</strong>
            ({{ deleteTarget?.MSNV }})?
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
const list        = ref([])
const loading     = ref(false)
const search      = ref('')
const filterChucVu = ref('')
const page        = ref(1)
const PAGE_SIZE   = 10

const showFormModal   = ref(false)
const showRoleModal   = ref(false)
const showDeleteModal = ref(false)
const isEdit          = ref(false)
const submitting      = ref(false)
const showPass        = ref(false)
const deleteTarget    = ref(null)
const roleTarget      = ref(null)
const formError       = ref('')

const emptyForm = () => ({
  MSNV: '', HoTenNV: '', SoDienThoai: '',
  ChucVu: 'nhan_vien', DiaChi: '', password: ''
})
const form     = ref(emptyForm())
const roleForm = ref({ ChucVu: 'nhan_vien' })
const errors   = ref({})
const toast    = ref({ show: false, type: 'success', msg: '' })

// ── Role options ──
const roleOptions = [
  {
    value: 'admin',
    label: 'Admin',
    desc: 'Toàn quyền hệ thống: quản lý sách, nhân viên, độc giả, duyệt mượn',
    icon: 'fas fa-crown',
    colorClass: 'role-admin'
  },
  {
    value: 'thu_kho',
    label: 'Thủ kho',
    desc: 'Quản lý kho sách, duyệt mượn và trả sách',
    icon: 'fas fa-warehouse',
    colorClass: 'role-thukho'
  },
  {
    value: 'ke_toan',
    label: 'Kế toán',
    desc: 'Xem thống kê, báo cáo và lịch sử giao dịch',
    icon: 'fas fa-calculator',
    colorClass: 'role-ketoan'
  },
  {
    value: 'nhan_vien',
    label: 'Nhân viên',
    desc: 'Xem danh sách sách và độc giả, không có quyền chỉnh sửa',
    icon: 'fas fa-user',
    colorClass: 'role-nv'
  },
]

// ── Fetch ──
const fetchAll = async () => {
  loading.value = true
  try {
    const res = await axios.get(`${API}/nhanvien`, { headers: authHeader() })
    list.value = res.data
  } catch (e) {
    showToast('error', 'Không tải được danh sách nhân viên')
  } finally {
    loading.value = false
  }
}

onMounted(fetchAll)

// ── Computed ──
const filtered = computed(() => {
  const q = search.value.toLowerCase().trim()
  return list.value.filter(nv => {
    const matchSearch = !q || (
      (nv.HoTenNV || '').toLowerCase().includes(q) ||
      (nv.MSNV    || '').toLowerCase().includes(q) ||
      (nv.ChucVu  || '').toLowerCase().includes(q) ||
      (nv.SoDienThoai || '').includes(q)
    )
    const matchRole = !filterChucVu.value || nv.ChucVu === filterChucVu.value
    return matchSearch && matchRole
  })
})

const totalPages = computed(() => Math.ceil(filtered.value.length / PAGE_SIZE))
const paginated  = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE
  return filtered.value.slice(start, start + PAGE_SIZE)
})
const adminCount = computed(() => list.value.filter(nv => nv.ChucVu === 'admin').length)

watch([search, filterChucVu], () => { page.value = 1 })

// ── Helpers ──
const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—'

const roleLabel = (v) => ({
  admin: 'Admin', thu_kho: 'Thủ kho',
  ke_toan: 'Kế toán', nhan_vien: 'Nhân viên'
}[v] || v)

const roleClass = (v) => ({
  admin: 'role-badge-admin', thu_kho: 'role-badge-thukho',
  ke_toan: 'role-badge-ketoan', nhan_vien: 'role-badge-nv'
}[v] || '')

const roleIcon = (v) => ({
  admin: 'fas fa-crown', thu_kho: 'fas fa-warehouse',
  ke_toan: 'fas fa-calculator', nhan_vien: 'fas fa-user'
}[v] || 'fas fa-user')

const showToast = (type, msg) => {
  toast.value = { show: true, type, msg }
  setTimeout(() => { toast.value.show = false }, 3000)
}

// ── Validate ──
const validate = () => {
  const e = {}
  if (!form.value.MSNV.trim())    e.MSNV    = 'Vui lòng nhập MSNV'
  if (!form.value.HoTenNV.trim()) e.HoTenNV = 'Vui lòng nhập họ tên'
  if (!isEdit.value) {
    if (!form.value.password)              e.password = 'Vui lòng nhập mật khẩu'
    else if (form.value.password.length < 6) e.password = 'Mật khẩu tối thiểu 6 ký tự'
  } else {
    if (form.value.password && form.value.password.length < 6)
      e.password = 'Mật khẩu tối thiểu 6 ký tự'
  }
  errors.value = e
  return Object.keys(e).length === 0
}

// ── Open modals ──
const openAdd = () => {
  isEdit.value = false
  form.value   = emptyForm()
  errors.value = {}
  formError.value = ''
  showPass.value  = false
  showFormModal.value = true
}

const openEdit = (nv) => {
  isEdit.value = true
  form.value = {
    _id:         nv._id,
    MSNV:        nv.MSNV        || '',
    HoTenNV:     nv.HoTenNV     || '',
    SoDienThoai: nv.SoDienThoai || '',
    ChucVu:      nv.ChucVu      || 'nhan_vien',
    DiaChi:      nv.DiaChi      || '',
    password:    ''
  }
  errors.value    = {}
  formError.value = ''
  showPass.value  = false
  showFormModal.value = true
}

const openRole = (nv) => {
  roleTarget.value = nv
  roleForm.value   = { ChucVu: nv.ChucVu || 'nhan_vien' }
  formError.value  = ''
  showRoleModal.value = true
}

const openDelete = (nv) => {
  deleteTarget.value  = nv
  showDeleteModal.value = true
}

const closeForm = () => { showFormModal.value = false }

// ── Submit thêm/sửa ──
const submitForm = async () => {
  if (!validate()) return
  submitting.value = true
  formError.value  = ''

  try {
    if (isEdit.value) {
      const payload = { ...form.value }
      delete payload._id
      if (!payload.password) delete payload.password   // không gửi password nếu để trống
      await axios.put(`${API}/nhanvien/${form.value._id}`, payload, { headers: authHeader() })
      showToast('success', 'Cập nhật nhân viên thành công')
    } else {
      await axios.post(`${API}/nhanvien`, form.value, { headers: authHeader() })
      showToast('success', 'Thêm nhân viên thành công')
    }
    closeForm()
    await fetchAll()
  } catch (e) {
    formError.value = e.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại'
  } finally {
    submitting.value = false
  }
}

// ── Submit phân quyền ──
const submitRole = async () => {
  submitting.value = true
  formError.value  = ''
  try {
    await axios.put(
      `${API}/nhanvien/${roleTarget.value._id}`,
      { ChucVu: roleForm.value.ChucVu },
      { headers: authHeader() }
    )
    showToast('success', `Đã cập nhật quyền → ${roleLabel(roleForm.value.ChucVu)}`)
    showRoleModal.value = false
    await fetchAll()
  } catch (e) {
    formError.value = e.response?.data?.message || 'Cập nhật quyền thất bại'
  } finally {
    submitting.value = false
  }
}

// ── Xóa ──
const confirmDelete = async () => {
  submitting.value = true
  try {
    await axios.delete(`${API}/nhanvien/${deleteTarget.value._id}`, { headers: authHeader() })
    showToast('success', 'Đã xóa nhân viên')
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
  flex-wrap: wrap;
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
.stat-num   { font-size: 1rem; font-weight: 700; color: #1a120e; }
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

/* Role badges in table */
.badge-role {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 10px;
}
.badge-role i { font-size: 0.65rem; }
.role-badge-admin   { background: #fef3cd; color: #856404; }
.role-badge-thukho  { background: #d1ecf1; color: #0c5460; }
.role-badge-ketoan  { background: #d4edda; color: #155724; }
.role-badge-nv      { background: #f0ebe4; color: #6b5c55; }

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
.action-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.action-btn.edit   { background: #f0ebe4; color: #7c3d2d; }
.action-btn.edit:hover   { background: #7c3d2d; color: #fff; }
.action-btn.role   { background: #fef3cd; color: #856404; }
.action-btn.role:hover   { background: #856404; color: #fff; }
.action-btn.delete { background: #fdedec; color: #c0392b; }
.action-btn.delete:hover:not(:disabled) { background: #c0392b; color: #fff; }

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

.btn-role {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #856404;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0.55rem 1.25rem;
  font-size: 0.85rem;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-role:hover:not(:disabled) { background: #614803; }
.btn-role:disabled { opacity: 0.6; cursor: not-allowed; }

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
.modal-lg { max-width: 600px; }

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
  text-transform: uppercase;
}
.danger-tag { color: #c0392b; }
.role-tag   { color: #856404; }

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
.optional {
  font-size: 0.75rem;
  color: #9a8a84;
  font-weight: 400;
  margin-left: 0.3rem;
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
.form-input.disabled { background: #f5f1ec; color: #9a8a84; cursor: not-allowed; }
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

/* ── Role modal ── */
.role-target-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f0ebe4;
  border-radius: 8px;
  padding: 0.85rem 1rem;
  margin-bottom: 1.25rem;
}
.role-avatar {
  width: 40px;
  height: 40px;
  background: #7c3d2d;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}
.role-target-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a120e;
  margin: 0 0 0.15rem;
}
.role-target-msnv {
  font-size: 0.78rem;
  color: #6b5c55;
  margin: 0;
}
.role-section-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #9a8a84;
  margin: 0 0 0.75rem;
}
.role-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.role-option {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  border: 1.5px solid #e8e0d8;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  background: #fff;
  position: relative;
}
.role-option:hover { border-color: #c9b5af; background: #faf8f5; }
.role-option.selected { border-color: #7c3d2d; background: #fff8f5; }

.role-option-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  flex-shrink: 0;
}
.role-admin   { background: #fef3cd; color: #856404; }
.role-thukho  { background: #d1ecf1; color: #0c5460; }
.role-ketoan  { background: #d4edda; color: #155724; }
.role-nv      { background: #f0ebe4; color: #6b5c55; }

.role-option-info { flex: 1; min-width: 0; }
.role-option-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a120e;
  margin: 0 0 0.15rem;
}
.role-option-desc {
  font-size: 0.78rem;
  color: #6b5c55;
  margin: 0;
  line-height: 1.4;
}
.role-check {
  color: #7c3d2d;
  font-size: 1rem;
  flex-shrink: 0;
}

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