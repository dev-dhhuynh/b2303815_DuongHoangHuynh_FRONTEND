<template>
  <div class="manage-page">
    <div class="page-container">

      <!-- Header -->
      <div class="page-header">
        <div>
          <p class="page-eyebrow">✦ QUẢN TRỊ</p>
          <h1 class="page-title"><i class="fas fa-building"></i> Quản Lý Nhà Xuất Bản</h1>
          <p class="page-sub">Thêm, chỉnh sửa, xoá nhà xuất bản trong hệ thống</p>
        </div>
      </div>

      <!-- ADD NXB FORM -->
      <div class="section-card mb-section">
        <div class="section-card-header">
          <h5 class="section-card-title">
            <i class="fas fa-plus-circle"></i> Thêm Nhà Xuất Bản Mới
          </h5>
        </div>
        <div class="section-card-body">
          <form @submit.prevent="addNXB">
            <div class="form-grid">

              <div class="field">
                <label class="field-label">Tên nhà xuất bản <span class="req">*</span></label>
                <input v-model="newNXB.TenNXB" class="field-input" placeholder="VD: NXB Trẻ" required />
              </div>

              <div class="field">
                <label class="field-label">Địa chỉ</label>
                <input v-model="newNXB.DiaChi" class="field-input" placeholder="Địa chỉ NXB" />
              </div>

            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary" :disabled="addingNXB">
                <span v-if="addingNXB" class="spinner-sm"></span>
                <i v-else class="fas fa-plus"></i>
                {{ addingNXB ? "Đang thêm..." : "Thêm Nhà Xuất Bản" }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- NXB LIST -->
      <div class="section-card">
        <div class="section-card-header">
          <h5 class="section-card-title">
            <i class="fas fa-list"></i> Danh Sách Nhà Xuất Bản
            <span class="count-badge">{{ nxbList.length }}</span>
          </h5>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="state-box">
          <div class="spinner"></div>
          <p>Đang tải danh sách nhà xuất bản...</p>
        </div>

        <!-- Empty -->
        <div v-else-if="nxbList.length === 0" class="state-box">
          <i class="fas fa-building state-icon"></i>
          <h4>Không có nhà xuất bản nào</h4>
          <p>Hãy thêm nhà xuất bản mới vào hệ thống.</p>
        </div>

        <!-- Table -->
        <div v-else class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên nhà xuất bản</th>
                <th>Địa chỉ</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(nxb, index) in nxbList" :key="nxb._id">
                <td><span class="td-code">{{ index + 1 }}</span></td>
                <td><span class="td-main">{{ nxb.TenNXB }}</span></td>
                <td class="td-muted">{{ nxb.DiaChi || '—' }}</td>
                <td>
                  <div class="action-btns">
                    <button @click="editNXB(nxb)" class="btn-edit" title="Chỉnh sửa">
                      <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button @click="removeNXB(nxb._id)" class="btn-delete" :disabled="deletingNXB === nxb._id" title="Xoá">
                      <span v-if="deletingNXB === nxb._id" class="spinner-sm"></span>
                      <i v-else class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>

  <!-- EDIT MODAL -->
  <Teleport to="body">
    <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-box modal-box--sm">
        <div class="modal-head">
          <h5 class="modal-title"><i class="fas fa-edit"></i> Chỉnh Sửa Nhà Xuất Bản</h5>
          <button class="modal-close" @click="closeEditModal"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body-inner">
          <form @submit.prevent="saveNXBEdit">
            <div class="form-grid form-grid--single">

              <div class="field">
                <label class="field-label">Tên nhà xuất bản <span class="req">*</span></label>
                <input v-model="editingNXB.TenNXB" class="field-input" required />
              </div>

              <div class="field">
                <label class="field-label">Địa chỉ</label>
                <input v-model="editingNXB.DiaChi" class="field-input" placeholder="Địa chỉ NXB" />
              </div>

            </div>

            <div class="modal-footer-inner">
              <button type="button" class="btn-ghost" @click="closeEditModal">
                <i class="fas fa-times"></i> Huỷ
              </button>
              <button type="submit" class="btn-primary" :disabled="savingEdit">
                <span v-if="savingEdit" class="spinner-sm"></span>
                <i v-else class="fas fa-save"></i>
                {{ savingEdit ? "Đang lưu..." : "Lưu Thay Đổi" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- DELETE MODAL -->
  <Teleport to="body">
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
      <div class="modal-box modal-box--sm">
        <div class="modal-head modal-head--danger">
          <h5 class="modal-title"><i class="fas fa-exclamation-triangle"></i> Xác Nhận Xoá</h5>
          <button class="modal-close modal-close--light" @click="closeDeleteModal"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body-inner">
          <div class="delete-confirm-body">
            <div class="delete-icon-wrap">
              <i class="fas fa-trash-alt"></i>
            </div>
            <p class="delete-msg">
              Bạn có chắc chắn muốn xoá nhà xuất bản<br>
              <strong>"{{ deletingNXBInfo?.TenNXB || 'này' }}"</strong> không?
            </p>
            <p class="delete-warn">
              <i class="fas fa-exclamation-circle"></i>
              Hành động này không thể hoàn tác!
            </p>
          </div>
          <div class="modal-footer-inner">
            <button type="button" class="btn-ghost" @click="closeDeleteModal">
              <i class="fas fa-times"></i> Huỷ
            </button>
            <button type="button" class="btn-danger" @click="confirmDeleteNXB" :disabled="!!deletingNXB">
              <span v-if="deletingNXB" class="spinner-sm spinner-sm--light"></span>
              <i v-else class="fas fa-trash"></i>
              {{ deletingNXB ? "Đang xoá..." : "Xoá" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- TOAST -->
  <Teleport to="body">
    <transition name="toast">
      <div v-if="toast.show" class="toast-bar" :class="'toast-bar--' + toast.type">
        <i :class="toast.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
        {{ toast.msg }}
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAdminStore } from "../../stores/adminStore";
import { useRouter } from "vue-router";

const adminStore = useAdminStore();
const router = useRouter();

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const nxbList        = ref([]);
const loading        = ref(false);
const addingNXB      = ref(false);
const deletingNXB    = ref("");
const deletingNXBId  = ref("");
const deletingNXBInfo = ref(null);
const showDeleteModal = ref(false);
const showEditModal   = ref(false);
const savingEdit      = ref(false);

const toast = ref({ show: false, type: "success", msg: "" });

const newNXB = ref({ TenNXB: "", DiaChi: "" });
const editingNXB = ref({ _id: "", TenNXB: "", DiaChi: "" });

const showToast = (type, msg) => {
  toast.value = { show: true, type, msg };
  setTimeout(() => { toast.value.show = false; }, 3000);
};

// ── Load NXB ──
const loadNXBList = async () => {
  try {
    loading.value = true;
    const res = await fetch(`${BASE_URL}/api/nxb`, {
      headers: { Authorization: `Bearer ${adminStore.token}` },
    });
    if (!res.ok) throw new Error("Lỗi khi tải danh sách");
    nxbList.value = await res.json();
  } catch (error) {
    showToast("error", "Lỗi khi tải danh sách NXB: " + error.message);
  } finally {
    loading.value = false;
  }
};

// ── Add NXB ──
const addNXB = async () => {
  if (!newNXB.value.TenNXB.trim()) {
    showToast("error", "Vui lòng nhập tên nhà xuất bản");
    return;
  }
  try {
    addingNXB.value = true;
    const res = await fetch(`${BASE_URL}/api/nxb`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminStore.token}`,
      },
      body: JSON.stringify(newNXB.value),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Lỗi khi thêm NXB");
    }
    showToast("success", "Thêm nhà xuất bản thành công!");
    newNXB.value = { TenNXB: "", DiaChi: "" };
    await loadNXBList();
  } catch (error) {
    showToast("error", "Lỗi: " + error.message);
  } finally {
    addingNXB.value = false;
  }
};

// ── Edit NXB ──
const editNXB = (nxb) => {
  editingNXB.value = { _id: nxb._id, TenNXB: nxb.TenNXB || "", DiaChi: nxb.DiaChi || "" };
  showEditModal.value = true;
};

const closeEditModal = () => {
  if (savingEdit.value) return;
  showEditModal.value = false;
};

const saveNXBEdit = async () => {
  if (!editingNXB.value.TenNXB.trim()) {
    showToast("error", "Vui lòng nhập tên nhà xuất bản");
    return;
  }
  try {
    savingEdit.value = true;
    const res = await fetch(`${BASE_URL}/api/nxb/${editingNXB.value._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminStore.token}`,
      },
      body: JSON.stringify({ TenNXB: editingNXB.value.TenNXB, DiaChi: editingNXB.value.DiaChi }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Lỗi khi cập nhật");
    }
    showToast("success", "Đã cập nhật nhà xuất bản thành công!");
    closeEditModal();
    await loadNXBList();
  } catch (error) {
    showToast("error", "Lỗi khi cập nhật: " + error.message);
  } finally {
    savingEdit.value = false;
  }
};

// ── Delete NXB ──
const removeNXB = (id) => {
  const nxb = nxbList.value.find((n) => n._id === id);
  if (!nxb) return;
  deletingNXBId.value = id;
  deletingNXBInfo.value = { TenNXB: nxb.TenNXB };
  showDeleteModal.value = true;
};

const confirmDeleteNXB = async () => {
  try {
    deletingNXB.value = deletingNXBId.value;
    const res = await fetch(`${BASE_URL}/api/nxb/${deletingNXBId.value}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminStore.token}` },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Lỗi khi xoá");
    }
    closeDeleteModal();
    showToast("success", "Đã xoá nhà xuất bản thành công!");
    await loadNXBList();
  } catch (error) {
    showToast("error", "Lỗi khi xoá: " + error.message);
  } finally {
    deletingNXB.value = "";
  }
};

const closeDeleteModal = () => {
  if (deletingNXB.value) return;
  showDeleteModal.value = false;
  deletingNXBId.value = "";
  deletingNXBInfo.value = null;
};

onMounted(() => {
  adminStore.initialize();
  if (!adminStore.isLoggedIn) {
    router.push("/admin/login");
    return;
  }
  loadNXBList();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

/* ── PAGE ── */
.manage-page {
  font-family: 'DM Sans', sans-serif;
  background: #f7f7f5;
  min-height: 100vh;
  padding: 2rem 0;
}
.page-container { max-width: 1280px; margin: 0 auto; padding: 2rem; }
.mb-section { margin-bottom: 2rem; }

/* ── HEADER ── */
.page-eyebrow { font-size: 0.75rem; letter-spacing: 0.2em; color: #7c3d2d; font-weight: 500; margin: 0 0 0.4rem; }
.page-title { font-family: 'Playfair Display', serif; font-size: 1.9rem; font-weight: 700; color: #1a120e; margin: 0 0 0.3rem; display: flex; align-items: center; gap: 0.6rem; }
.page-title i { color: #7c3d2d; font-size: 1.5rem; }
.page-sub { color: #9a8a84; font-size: 0.9rem; margin: 0 0 2rem; }

/* ── SECTION CARD ── */
.section-card { background: #fff; border: 1px solid #ece8e3; border-radius: 14px; overflow: hidden; }
.section-card-header { background: #faf8f5; border-bottom: 1px solid #ece8e3; padding: 1.1rem 1.75rem; }
.section-card-title { font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 700; color: #1a120e; margin: 0; display: flex; align-items: center; gap: 0.5rem; }
.section-card-title i { color: #7c3d2d; }
.count-badge { background: #7c3d2d; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 500; padding: 0.12rem 0.55rem; border-radius: 20px; }
.section-card-body { padding: 1.75rem; }

/* ── FORM GRID ── */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; }
.form-grid--single { grid-template-columns: 1fr; }
.field { display: flex; flex-direction: column; gap: 0.4rem; }
.field-label { font-size: 0.83rem; font-weight: 500; color: #4a3530; }
.req { color: #b94a2c; margin-left: 2px; }
.field-input {
  border: 1.5px solid #e8e0d8; border-radius: 8px; padding: 0.65rem 0.9rem;
  font-size: 0.88rem; font-family: 'DM Sans', sans-serif; color: #1a120e;
  background: #fff; outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%; box-sizing: border-box;
}
.field-input::placeholder { color: #c9b5af; }
.field-input:focus { border-color: #7c3d2d; box-shadow: 0 0 0 3px rgba(124,61,45,0.08); }

.form-actions { margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid #f0ebe4; }

/* ── STATES ── */
.state-box { text-align: center; padding: 4rem 2rem; color: #9a8a84; }
.state-icon { font-size: 2.5rem; margin-bottom: 1rem; display: block; }
.state-box h4 { color: #4a3530; font-size: 1.1rem; margin-bottom: 0.4rem; }
.state-box p { font-size: 0.88rem; margin: 0; }
.spinner { width: 34px; height: 34px; border: 3px solid #e8e0d8; border-top-color: #7c3d2d; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── TABLE ── */
.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.87rem; }
.data-table thead tr { border-bottom: 2px solid #ede8e3; }
.data-table th { padding: 0.85rem 1.1rem; text-align: left; font-size: 0.76rem; font-weight: 600; color: #7c3d2d; letter-spacing: 0.07em; text-transform: uppercase; white-space: nowrap; background: #faf8f5; }
.data-table tbody tr { border-bottom: 1px solid #f0ebe4; transition: background 0.15s; }
.data-table tbody tr:last-child { border-bottom: none; }
.data-table tbody tr:hover { background: #fdf9f7; }
.data-table td { padding: 0.85rem 1.1rem; vertical-align: middle; color: #2c2420; }
.td-code { font-family: monospace; font-size: 0.82rem; color: #6b5c55; }
.td-main { display: block; font-weight: 500; color: #1a120e; }
.td-muted { color: #6b5c55; }
.action-btns { display: flex; gap: 0.5rem; align-items: center; }
.btn-edit { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.85rem; background: #f5f1ec; border: 1.5px solid #d4c4bc; color: #4a3530; border-radius: 6px; font-size: 0.82rem; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s; }
.btn-edit:hover { background: #7c3d2d; border-color: #7c3d2d; color: #fff; }
.btn-delete { display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; background: #fff1ee; border: 1.5px solid #f0c4b8; color: #b94a2c; border-radius: 6px; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
.btn-delete:hover:not(:disabled) { background: #b94a2c; border-color: #b94a2c; color: #fff; }
.btn-delete:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── BUTTONS ── */
.btn-primary { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.7rem 1.75rem; background: #1a120e; color: #fff; border: none; border-radius: 8px; font-size: 0.9rem; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: background 0.2s, transform 0.15s; }
.btn-primary:hover:not(:disabled) { background: #7c3d2d; transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-ghost { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.7rem 1.5rem; background: none; border: 1.5px solid #d4c4bc; color: #4a3530; border-radius: 8px; font-size: 0.88rem; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s; }
.btn-ghost:hover { border-color: #7c3d2d; color: #7c3d2d; }
.btn-danger { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.7rem 1.5rem; background: #b94a2c; color: #fff; border: none; border-radius: 8px; font-size: 0.88rem; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: background 0.2s; }
.btn-danger:hover:not(:disabled) { background: #8c2d12; }
.btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }

/* ── MODAL ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(26,18,14,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; backdrop-filter: blur(2px); }
.modal-box { background: #fff; border-radius: 16px; width: 100%; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; }
.modal-box--sm { max-width: 440px; }
.modal-head { display: flex; align-items: center; justify-content: space-between; padding: 1.1rem 1.5rem; border-bottom: 1px solid #ece8e3; background: #faf8f5; flex-shrink: 0; }
.modal-head--danger { background: #fff1ee; border-bottom-color: #f0c4b8; }
.modal-title { font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 700; color: #1a120e; margin: 0; display: flex; align-items: center; gap: 0.5rem; }
.modal-title i { color: #7c3d2d; }
.modal-head--danger .modal-title i { color: #b94a2c; }
.modal-close { background: none; border: none; color: #9a8a84; font-size: 1rem; cursor: pointer; padding: 0.25rem; border-radius: 4px; transition: color 0.2s; }
.modal-close:hover { color: #1a120e; }
.modal-close--light:hover { color: #b94a2c; }
.modal-body-inner { overflow-y: auto; padding: 1.5rem; flex: 1; }
.modal-footer-inner { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid #f0ebe4; }

/* Delete modal */
.delete-confirm-body { text-align: center; padding: 1rem 0; }
.delete-icon-wrap { width: 60px; height: 60px; background: #fff1ee; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 1.5rem; color: #b94a2c; }
.delete-msg { font-size: 0.95rem; color: #2c2420; line-height: 1.6; margin: 0 0 0.75rem; }
.delete-msg strong { color: #1a120e; }
.delete-warn { font-size: 0.83rem; color: #b94a2c; margin: 0; display: flex; align-items: center; justify-content: center; gap: 0.4rem; }

/* ── TOAST ── */
.toast-bar { position: fixed; bottom: 2rem; right: 2rem; padding: 0.85rem 1.25rem; border-radius: 10px; font-size: 0.87rem; font-weight: 500; display: flex; align-items: center; gap: 0.6rem; z-index: 9999; box-shadow: 0 8px 24px rgba(0,0,0,0.15); max-width: 360px; }
.toast-bar--success { background: #1a120e; color: #fff; }
.toast-bar--error { background: #b94a2c; color: #fff; }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(1rem); }

/* ── SPINNER ── */
.spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block; }

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .page-container { padding: 0 1rem; }
  .form-grid { grid-template-columns: 1fr; }
  .modal-overlay { align-items: flex-end; padding: 0; }
  .modal-box { border-radius: 16px 16px 0 0; max-height: 95vh; }
}
</style>