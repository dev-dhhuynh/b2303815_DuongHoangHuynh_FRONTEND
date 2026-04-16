<template>
  <div class="manage-page">
    <div class="page-container">

      <!-- Header -->
      <div class="page-header">
        <div>
          <p class="page-eyebrow">✦ QUẢN TRỊ</p>
          <h1 class="page-title"><i class="fas fa-book"></i> Quản Lý Sách</h1>
          <p class="page-sub">Thêm, chỉnh sửa, xoá sách trong hệ thống</p>
        </div>
      </div>

      <!-- ADD BOOK FORM -->
      <div class="section-card mb-section">
        <div class="section-card-header">
          <h5 class="section-card-title">
            <i class="fas fa-plus-circle"></i> Thêm Sách Mới
          </h5>
        </div>
        <div class="section-card-body">
          <form @submit.prevent="addBook" enctype="multipart/form-data">
            <div class="form-grid">

              <div class="field">
                <label class="field-label">Mã sách</label>
                <input v-model="newBook.MaSach" class="field-input" placeholder="Tự động nếu để trống" />
              </div>

              <div class="field">
                <label class="field-label">Tên sách <span class="req">*</span></label>
                <input v-model="newBook.TenSach" class="field-input" placeholder="Tên sách" required />
              </div>

              <div class="field">
                <label class="field-label">Tác giả</label>
                <input v-model="newBook.TacGia" class="field-input" placeholder="Tác giả" />
              </div>

              <div class="field">
                <label class="field-label">Năm xuất bản</label>
                <input v-model="newBook.NamXuatBan" type="number" class="field-input" placeholder="VD: 2023" />
              </div>

              <div class="field">
                <label class="field-label">Đơn giá (VND)</label>
                <input v-model="newBook.DonGia" type="number" class="field-input" placeholder="VD: 85000" />
              </div>

              <div class="field">
                <label class="field-label">Số quyển <span class="req">*</span></label>
                <input v-model="newBook.SoQuyen" type="number" class="field-input" placeholder="Số quyển" required />
              </div>

              <div class="field">
                <label class="field-label">Nhà xuất bản</label>
                <select v-model="newBook.MaNXB" class="field-select">
                  <option value="">-- Chọn NXB --</option>
                  <option v-for="nxb in nxbList" :key="nxb._id" :value="nxb._id">{{ nxb.TenNXB }}</option>
                </select>
              </div>

              <div class="field field--full">
                <label class="field-label">Mô tả</label>
                <textarea v-model="newBook.MoTa" class="field-textarea" placeholder="Mô tả nội dung sách..." rows="3"></textarea>
              </div>

              <div class="field field--full">
                <label class="field-label">Ảnh bìa</label>
                <div class="upload-zone" @click="$refs.fileInput.click()">
                  <input type="file" @change="handleFileUpload" accept="image/*" ref="fileInput" style="display:none" />
                  <div v-if="!imagePreview" class="upload-placeholder">
                    <i class="fas fa-cloud-upload-alt upload-icon"></i>
                    <p>Nhấn để chọn ảnh bìa</p>
                    <span>JPEG, PNG — tối đa 5MB</span>
                  </div>
                  <img v-else :src="imagePreview" class="upload-preview" alt="Preview" />
                </div>
                <button v-if="imagePreview" type="button" class="btn-clear-img" @click.stop="clearImage">
                  <i class="fas fa-times"></i> Xoá ảnh
                </button>
              </div>

            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary" :disabled="addingBook">
                <span v-if="addingBook" class="spinner-sm"></span>
                <i v-else class="fas fa-plus"></i>
                {{ addingBook ? "Đang thêm..." : "Thêm Sách" }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- BOOK LIST -->
      <div class="section-card">
        <div class="section-card-header">
          <h5 class="section-card-title">
            <i class="fas fa-list"></i> Danh Sách Sách
            <span class="count-badge">{{ books.length }}</span>
          </h5>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="state-box">
          <div class="spinner"></div>
          <p>Đang tải danh sách sách...</p>
        </div>

        <!-- Empty -->
        <div v-else-if="books.length === 0" class="state-box">
          <i class="fas fa-book state-icon"></i>
          <h4>Không có sách nào</h4>
          <p>Hãy thêm sách mới vào hệ thống.</p>
        </div>

        <!-- Table -->
        <div v-else class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Ảnh bìa</th>
                <th>Mã sách</th>
                <th>Tên sách</th>
                <th>Tác giả</th>
                <th>Số quyển</th>
                <th>Năm XB</th>
                <th>Đơn giá</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in books" :key="book._id">
                <td>
                  <img v-if="book.HinhBia" :src="getImageUrl(book.HinhBia)" :alt="book.TenSach" class="book-thumb" />
                  <div v-else class="no-img"><i class="fas fa-image"></i></div>
                </td>
                <td><span class="td-code">{{ book.MaSach || '—' }}</span></td>
                <td>
                  <span class="td-main">{{ book.TenSach }}</span>
                  <span class="td-sub" v-if="book.MoTa">{{ book.MoTa.substring(0, 50) }}...</span>
                </td>
                <td class="td-muted">{{ book.TacGia || 'Đang cập nhật' }}</td>
                <td>
                  <span class="qty-badge" :class="book.SoQuyen > 0 ? 'qty--ok' : 'qty--out'">
                    {{ book.SoQuyen }}
                  </span>
                </td>
                <td class="td-muted">{{ book.NamXuatBan || 'N/A' }}</td>
                <td class="td-muted">{{ book.DonGia ? formatCurrency(book.DonGia) : 'N/A' }}</td>
                <td>
                  <div class="action-btns">
                    <button @click="editBook(book)" class="btn-edit" title="Chỉnh sửa">
                      <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button @click="removeBook(book._id)" class="btn-delete" :disabled="deletingBook === book._id" title="Xoá">
                      <span v-if="deletingBook === book._id" class="spinner-sm"></span>
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
      <div class="modal-box modal-box--lg">
        <div class="modal-head">
          <h5 class="modal-title"><i class="fas fa-edit"></i> Chỉnh Sửa Thông Tin Sách</h5>
          <button class="modal-close" @click="closeEditModal"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body-inner">
          <form @submit.prevent="saveBookEdit" enctype="multipart/form-data">

            <!-- Current image -->
            <div class="edit-current-img">
              <img v-if="editingBook.HinhBia" :src="getImageUrl(editingBook.HinhBia)" :alt="editingBook.TenSach" />
              <div v-else class="no-img-lg"><i class="fas fa-image"></i><span>Chưa có ảnh bìa</span></div>
            </div>

            <div class="form-grid">
              <div class="field">
                <label class="field-label">Mã sách</label>
                <input v-model="editingBook.MaSach" class="field-input field-input--disabled" disabled />
                <span class="field-hint">Mã sách không thể thay đổi</span>
              </div>

              <div class="field">
                <label class="field-label">Tên sách <span class="req">*</span></label>
                <input v-model="editingBook.TenSach" class="field-input" required />
              </div>

              <div class="field">
                <label class="field-label">Tác giả</label>
                <input v-model="editingBook.TacGia" class="field-input" />
              </div>

              <div class="field">
                <label class="field-label">Năm xuất bản</label>
                <input v-model="editingBook.NamXuatBan" type="number" class="field-input" />
              </div>

              <div class="field">
                <label class="field-label">Đơn giá (VND)</label>
                <input v-model="editingBook.DonGia" type="number" class="field-input" />
              </div>

              <div class="field">
                <label class="field-label">Số quyển <span class="req">*</span></label>
                <input v-model="editingBook.SoQuyen" type="number" class="field-input" required />
                <span class="field-hint" :class="editingBook.SoQuyen > 0 ? 'hint--ok' : 'hint--warn'">
                  {{ editingBook.SoQuyen > 0 ? '✓ Có sẵn để mượn' : '✗ Hết sách' }}
                </span>
              </div>

              <div class="field">
                <label class="field-label">Nhà xuất bản</label>
                <select v-model="editingBook.MaNXB" class="field-select">
                  <option value="">-- Chọn NXB --</option>
                  <option v-for="nxb in nxbList" :key="nxb._id" :value="nxb._id">{{ nxb.TenNXB }}</option>
                </select>
              </div>

              <div class="field field--full">
                <label class="field-label">Mô tả</label>
                <textarea v-model="editingBook.MoTa" class="field-textarea" rows="3"></textarea>
              </div>

              <div class="field field--full">
                <label class="field-label">Thay đổi ảnh bìa <span class="field-optional">(tuỳ chọn)</span></label>
                <div class="upload-zone upload-zone--sm" @click="$refs.editFileInput.click()">
                  <input type="file" @change="handleEditFileUpload" accept="image/*" ref="editFileInput" style="display:none" />
                  <div v-if="!editImagePreview" class="upload-placeholder">
                    <i class="fas fa-cloud-upload-alt upload-icon"></i>
                    <p>Nhấn để chọn ảnh mới</p>
                    <span>Để trống nếu giữ nguyên ảnh cũ</span>
                  </div>
                  <img v-else :src="editImagePreview" class="upload-preview" alt="Preview mới" />
                </div>
              </div>
            </div>

            <div class="info-note">
              <i class="fas fa-info-circle"></i>
              Thay đổi thông tin sách sẽ ảnh hưởng đến tất cả bản ghi liên quan.
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
          <h5 class="modal-title"><i class="fas fa-exclamation-triangle"></i> Xác Nhận Xoá Sách</h5>
          <button class="modal-close modal-close--light" @click="closeDeleteModal"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body-inner">
          <div class="delete-confirm-body">
            <div class="delete-icon-wrap">
              <i class="fas fa-trash-alt"></i>
            </div>
            <p class="delete-msg">
              Bạn có chắc chắn muốn xoá sách<br>
              <strong>"{{ deletingBookInfo?.TenSach || 'này' }}"</strong> không?
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
            <button type="button" class="btn-danger" @click="confirmDeleteBook" :disabled="!!deletingBook">
              <span v-if="deletingBook" class="spinner-sm spinner-sm--light"></span>
              <i v-else class="fas fa-trash"></i>
              {{ deletingBook ? "Đang xoá..." : "Xoá Sách" }}
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
import adminService from "../../services/adminService";
import { useRouter } from "vue-router";

const adminStore = useAdminStore();
const router = useRouter();

const books = ref([]);
const loading = ref(false);
const addingBook = ref(false);
const deletingBook = ref("");
const nxbList = ref([]);
const showDeleteModal = ref(false);
const deletingBookInfo = ref(null);
const deletingBookId = ref("");
const showEditModal = ref(false);
const savingEdit = ref(false);
const imagePreview = ref("");
const selectedFile = ref(null);
const fileInput = ref(null);
const editImagePreview = ref("");
const editSelectedFile = ref(null);
const editFileInput = ref(null);

const toast = ref({ show: false, type: "success", msg: "" });

const newBook = ref({ MaSach: "", TenSach: "", TacGia: "", NamXuatBan: "", DonGia: "", SoQuyen: "", MaNXB: "", MoTa: "" });
const editingBook = ref({ _id: "", MaSach: "", TenSach: "", TacGia: "", NamXuatBan: "", DonGia: "", SoQuyen: "", MaNXB: "", MoTa: "", HinhBia: "" });

const showToast = (type, msg) => {
  toast.value = { show: true, type, msg };
  setTimeout(() => { toast.value.show = false; }, 3000);
};

const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  return `${baseUrl}${imagePath}`;
};

const clearImage = () => { imagePreview.value = ""; selectedFile.value = null; if (fileInput.value) fileInput.value.value = ""; };

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  selectedFile.value = file;
  const reader = new FileReader();
  reader.onload = (ev) => { imagePreview.value = ev.target.result; };
  reader.readAsDataURL(file);
};

const handleEditFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  editSelectedFile.value = file;
  const reader = new FileReader();
  reader.onload = (ev) => { editImagePreview.value = ev.target.result; };
  reader.readAsDataURL(file);
};

const editBook = (book) => {
  let maNXBValue = "";
  if (book.MaNXB) {
    maNXBValue = typeof book.MaNXB === "object" ? book.MaNXB._id : book.MaNXB;
  }
  editingBook.value = { _id: book._id, MaSach: book.MaSach || "", TenSach: book.TenSach || "", TacGia: book.TacGia || "", NamXuatBan: book.NamXuatBan || "", DonGia: book.DonGia || "", SoQuyen: book.SoQuyen || 0, MaNXB: maNXBValue, MoTa: book.MoTa || "", HinhBia: book.HinhBia || "" };
  editImagePreview.value = "";
  editSelectedFile.value = null;
  if (editFileInput.value) editFileInput.value.value = "";
  showEditModal.value = true;
};

const closeEditModal = () => {
  if (savingEdit.value) return;
  showEditModal.value = false;
  editImagePreview.value = "";
  editSelectedFile.value = null;
};

const saveBookEdit = async () => {
  if (!editingBook.value.TenSach || !editingBook.value.SoQuyen) { showToast("error", "Vui lòng điền tên sách và số quyển"); return; }
  try {
    savingEdit.value = true;
    const formData = new FormData();
    ["TenSach", "TacGia", "NamXuatBan", "DonGia", "SoQuyen", "MaNXB", "MoTa"].forEach((f) => {
      if (editingBook.value[f] !== undefined && editingBook.value[f] !== null && editingBook.value[f] !== "") formData.append(f, editingBook.value[f]);
    });
    if (editSelectedFile.value) formData.append("HinhBia", editSelectedFile.value);
    const response = await fetch(`http://localhost:3000/api/sach/${editingBook.value._id}`, { method: "PUT", headers: { Authorization: `Bearer ${adminStore.token}` }, body: formData });
    if (!response.ok) { const err = await response.json(); throw new Error(err.message || "Lỗi khi cập nhật sách"); }
    showToast("success", "Đã cập nhật thông tin sách thành công!");
    closeEditModal();
    await loadBooks();
  } catch (error) {
    showToast("error", "Lỗi khi cập nhật: " + error.message);
  } finally {
    savingEdit.value = false;
  }
};

const loadBooks = async () => {
  try {
    loading.value = true;
    const response = await adminService.getAllBooks(adminStore.token);
    books.value = response;
  } catch (error) {
    if (error.message.includes("No admin token")) router.push("/admin/login");
    else showToast("error", "Lỗi khi tải danh sách sách: " + error.message);
  } finally {
    loading.value = false;
  }
};

const loadNXBList = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/nxb", { headers: { Authorization: `Bearer ${adminStore.token}` } });
    if (response.ok) nxbList.value = await response.json();
  } catch (error) { console.error("Error loading NXB:", error); }
};

const addBook = async () => {
  if (!newBook.value.TenSach || !newBook.value.SoQuyen) { showToast("error", "Vui lòng điền tên sách và số quyển"); return; }
  try {
    addingBook.value = true;
    const formData = new FormData();
    Object.keys(newBook.value).forEach((key) => { if (newBook.value[key] !== "") formData.append(key, newBook.value[key]); });
    if (selectedFile.value) formData.append("HinhBia", selectedFile.value);
    const response = await fetch("http://localhost:3000/api/sach", { method: "POST", headers: { Authorization: `Bearer ${adminStore.token}` }, body: formData });
    if (!response.ok) throw new Error("Lỗi khi thêm sách");
    showToast("success", "Thêm sách thành công!");
    newBook.value = { MaSach: "", TenSach: "", TacGia: "", NamXuatBan: "", DonGia: "", SoQuyen: "", MaNXB: "", MoTa: "" };
    clearImage();
    await loadBooks();
  } catch (error) {
    showToast("error", "Lỗi khi thêm sách: " + error.message);
  } finally {
    addingBook.value = false;
  }
};

const removeBook = (bookId) => {
  const book = books.value.find((b) => b._id === bookId);
  if (!book) return;
  deletingBookId.value = bookId;
  deletingBookInfo.value = { TenSach: book.TenSach, MaSach: book.MaSach };
  showDeleteModal.value = true;
};

const confirmDeleteBook = async () => {
  try {
    deletingBook.value = deletingBookId.value;
    await adminService.removeBook(adminStore.token, deletingBookId.value);
    closeDeleteModal();
    showToast("success", "Đã xoá sách thành công!");
    await loadBooks();
  } catch (error) {
    showToast("error", "Lỗi khi xoá sách: " + (error.response?.data?.message || error.message));
  } finally {
    deletingBook.value = "";
  }
};

const closeDeleteModal = () => {
  if (deletingBook.value) return;
  showDeleteModal.value = false;
  deletingBookId.value = "";
  deletingBookInfo.value = null;
};

const formatCurrency = (amount) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

onMounted(() => { loadBooks(); loadNXBList(); });
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
.field { display: flex; flex-direction: column; gap: 0.4rem; }
.field--full { grid-column: 1 / -1; }
.field-label { font-size: 0.83rem; font-weight: 500; color: #4a3530; }
.req { color: #b94a2c; margin-left: 2px; }
.field-optional { font-weight: 400; color: #b0a09a; font-size: 0.8rem; }
.field-input, .field-select, .field-textarea {
  border: 1.5px solid #e8e0d8; border-radius: 8px; padding: 0.65rem 0.9rem;
  font-size: 0.88rem; font-family: 'DM Sans', sans-serif; color: #1a120e;
  background: #fff; outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
}
.field-input::placeholder, .field-textarea::placeholder { color: #c9b5af; }
.field-input:focus, .field-select:focus, .field-textarea:focus { border-color: #7c3d2d; box-shadow: 0 0 0 3px rgba(124,61,45,0.08); }
.field-input--disabled { background: #f5f1ec; color: #9a8a84; cursor: not-allowed; }
.field-textarea { resize: vertical; }
.field-hint { font-size: 0.78rem; color: #9a8a84; }
.hint--ok { color: #2d6a3f; }
.hint--warn { color: #b94a2c; }

/* ── UPLOAD ZONE ── */
.upload-zone {
  border: 2px dashed #e8e0d8; border-radius: 10px; padding: 1.5rem;
  cursor: pointer; text-align: center; transition: border-color 0.2s, background 0.2s;
  min-height: 130px; display: flex; align-items: center; justify-content: center;
}
.upload-zone:hover { border-color: #7c3d2d; background: #fdf9f7; }
.upload-zone--sm { min-height: 100px; padding: 1rem; }
.upload-placeholder p { font-size: 0.87rem; color: #6b5c55; margin: 0.4rem 0 0.2rem; }
.upload-placeholder span { font-size: 0.77rem; color: #b0a09a; }
.upload-icon { font-size: 1.8rem; color: #c9b5af; }
.upload-preview { max-height: 160px; border-radius: 8px; object-fit: cover; }
.btn-clear-img { background: none; border: none; color: #b94a2c; font-size: 0.82rem; cursor: pointer; padding: 0.25rem 0; margin-top: 0.4rem; display: flex; align-items: center; gap: 0.3rem; transition: color 0.2s; }
.btn-clear-img:hover { color: #7c1f0c; }

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
.book-thumb { width: 44px; height: 60px; object-fit: cover; border-radius: 5px; display: block; }
.no-img { width: 44px; height: 60px; background: #f5f1ec; border-radius: 5px; display: flex; align-items: center; justify-content: center; color: #c9b5af; font-size: 1rem; }
.td-code { font-family: monospace; font-size: 0.82rem; color: #6b5c55; }
.td-main { display: block; font-weight: 500; color: #1a120e; }
.td-sub { display: block; font-size: 0.78rem; color: #9a8a84; margin-top: 2px; }
.td-muted { color: #6b5c55; }
.qty-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
.qty--ok { background: #eaf5ec; color: #2d6a3f; }
.qty--out { background: #fff1ee; color: #b94a2c; }
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
.modal-box--lg { max-width: 680px; }
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

/* Edit modal extras */
.edit-current-img { text-align: center; margin-bottom: 1.5rem; }
.edit-current-img img { max-height: 180px; border-radius: 8px; object-fit: cover; }
.no-img-lg { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 2rem; background: #f5f1ec; border-radius: 8px; color: #b0a09a; font-size: 0.85rem; }
.no-img-lg i { font-size: 2rem; }
.info-note { background: #fdf9f7; border: 1px solid #e8e0d8; border-left: 3px solid #7c3d2d; border-radius: 6px; padding: 0.75rem 1rem; font-size: 0.84rem; color: #6b5c55; margin-top: 1rem; display: flex; align-items: flex-start; gap: 0.5rem; }
.info-note i { color: #7c3d2d; margin-top: 1px; flex-shrink: 0; }

/* Delete modal extras */
.delete-confirm-body { text-align: center; padding: 1rem 0; }
.delete-icon-wrap { width: 60px; height: 60px; background: #fff1ee; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 1.5rem; color: #b94a2c; }
.delete-msg { font-size: 0.95rem; color: #2c2420; line-height: 1.6; margin: 0 0 0.75rem; }
.delete-msg strong { color: #1a120e; }
.delete-warn { font-size: 0.83rem; color: #b94a2c; margin: 0; display: flex; align-items: center; justify-content: center; gap: 0.4rem; }

/* ── TOAST ── */
.toast-bar {
  position: fixed; bottom: 2rem; right: 2rem;
  padding: 0.85rem 1.25rem; border-radius: 10px;
  font-size: 0.87rem; font-weight: 500;
  display: flex; align-items: center; gap: 0.6rem;
  z-index: 9999; box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  max-width: 360px;
}
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
  .field--full { grid-column: 1; }
  .data-table th, .data-table td { padding: 0.7rem 0.85rem; }
  .modal-overlay { align-items: flex-end; padding: 0; }
  .modal-box { border-radius: 16px 16px 0 0; max-height: 95vh; }
}
</style>