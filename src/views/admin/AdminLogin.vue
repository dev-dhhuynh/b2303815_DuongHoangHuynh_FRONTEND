<template>
  <div class="login-page">

    <!-- Left panel -->
    <div class="left-panel">
      <div class="left-inner">
        <div class="brand">
          <i class="fas fa-book-open brand-icon"></i>
          <span class="brand-name">LibraTech</span>
        </div>
        <div class="left-content">
          <p class="left-eyebrow">✦ HỆ THỐNG QUẢN TRỊ</p>
          <h1 class="left-title">Cổng Quản Trị<br>Thư Viện</h1>
          <p class="left-desc">
            Dành riêng cho nhân viên thư viện. Quản lý sách, duyệt yêu cầu
            mượn và theo dõi hoạt động toàn hệ thống.
          </p>
          <div class="left-features">
            <div class="feature-item">
              <div class="feature-dot"></div>
              <span>Duyệt yêu cầu mượn sách</span>
            </div>
            <div class="feature-item">
              <div class="feature-dot"></div>
              <span>Quản lý kho sách</span>
            </div>
            <div class="feature-item">
              <div class="feature-dot"></div>
              <span>Theo dõi lịch sử mượn trả</span>
            </div>
          </div>
        </div>
        <p class="left-footer">© 2025 LibraTech. Quản lý tri thức – Kết nối tương lai.</p>
      </div>
    </div>

    <!-- Right panel -->
    <div class="right-panel">
      <div class="form-box">

        <div class="form-header">
          <div class="lock-icon">
            <i class="fas fa-lock"></i>
          </div>
          <h2 class="form-title">Đăng Nhập Admin</h2>
          <p class="form-sub">Nhập thông tin nhân viên để tiếp tục</p>
        </div>

        <!-- Error -->
        <div v-if="errorMsg" class="error-alert">
          <i class="fas fa-exclamation-circle"></i>
          {{ errorMsg }}
        </div>

        <form @submit.prevent="login" class="form-body">

          <div class="field">
            <label class="field-label">Mã số nhân viên (MSNV)</label>
            <div class="input-wrap">
              <i class="fas fa-id-card input-icon"></i>
              <input
                v-model="msnv"
                type="text"
                class="field-input"
                placeholder="Nhập MSNV của bạn"
                required
                autocomplete="username"
              />
            </div>
          </div>

          <div class="field">
            <label class="field-label">Mật khẩu</label>
            <div class="input-wrap">
              <i class="fas fa-lock input-icon"></i>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="field-input"
                placeholder="Nhập mật khẩu"
                required
                autocomplete="current-password"
              />
              <button
                type="button"
                class="toggle-pw"
                @click="showPassword = !showPassword"
                tabindex="-1"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <button type="submit" class="btn-login" :disabled="loading">
            <span v-if="loading" class="spinner-sm"></span>
            <i v-else class="fas fa-sign-in-alt"></i>
            {{ loading ? "Đang đăng nhập..." : "Đăng Nhập" }}
          </button>

        </form>

        <div class="form-footer">
          <i class="fas fa-shield-alt"></i>
          Chỉ dành cho nhân viên thư viện được cấp quyền
        </div>

        <div class="back-link-wrap">
          <router-link to="/login" class="back-link">
            <i class="fas fa-arrow-left"></i> Về trang đăng nhập người dùng
          </router-link>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAdminStore } from "../../stores/adminStore";
import { useRouter } from "vue-router";

const msnv = ref("");
const password = ref("");
const loading = ref(false);
const errorMsg = ref("");
const showPassword = ref(false);
const adminStore = useAdminStore();
const router = useRouter();

async function login() {
  try {
    loading.value = true;
    errorMsg.value = "";

    const result = await adminStore.login(msnv.value, password.value);

    await new Promise((resolve) => setTimeout(resolve, 100));
    router.push("/admin/dashboard");
  } catch (error) {
    errorMsg.value =
      "Đăng nhập thất bại: " + (error.response?.data?.message || error.message);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

/* ── LAYOUT ── */
.login-page {
  font-family: 'DM Sans', sans-serif;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}

/* ── LEFT PANEL ── */
.left-panel {
  background: #1a120e;
  display: flex;
  align-items: stretch;
  position: relative;
  overflow: hidden;
}
.left-panel::before {
  content: 'LIBRATECH';
  position: absolute;
  bottom: -2rem;
  left: -1rem;
  font-family: 'Playfair Display', serif;
  font-size: 8rem;
  font-weight: 700;
  color: rgba(255,255,255,0.03);
  letter-spacing: 0.05em;
  white-space: nowrap;
  pointer-events: none;
}
.left-inner {
  display: flex;
  flex-direction: column;
  padding: 3rem;
  width: 100%;
  position: relative;
  z-index: 1;
}
.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: auto;
}
.brand-icon {
  color: #e8b89a;
  font-size: 1.2rem;
}
.brand-name {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.02em;
}
.left-content {
  padding: 3rem 0;
}
.left-eyebrow {
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  color: #e8b89a;
  font-weight: 500;
  margin: 0 0 1rem;
}
.left-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.6rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
  margin: 0 0 1.25rem;
}
.left-desc {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.55);
  line-height: 1.75;
  margin: 0 0 2rem;
  max-width: 340px;
}
.left-features {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.87rem;
  color: rgba(255,255,255,0.7);
}
.feature-dot {
  width: 6px; height: 6px;
  background: #e8b89a;
  border-radius: 50%;
  flex-shrink: 0;
}
.left-footer {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.25);
  margin: 0;
}

/* ── RIGHT PANEL ── */
.right-panel {
  background: #faf8f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
}
.form-box {
  width: 100%;
  max-width: 400px;
}

/* ── FORM HEADER ── */
.form-header {
  text-align: center;
  margin-bottom: 2rem;
}
.lock-icon {
  width: 56px; height: 56px;
  background: #f8f0ec;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: #7c3d2d;
  margin: 0 auto 1.25rem;
}
.form-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a120e;
  margin: 0 0 0.4rem;
}
.form-sub {
  font-size: 0.87rem;
  color: #9a8a84;
  margin: 0;
}

/* ── ERROR ── */
.error-alert {
  background: #fff1ee;
  border: 1px solid #f0c4b8;
  border-left: 4px solid #c0522a;
  border-radius: 8px;
  padding: 0.85rem 1rem;
  color: #7c3d2d;
  font-size: 0.87rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
}

/* ── FORM FIELDS ── */
.form-body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}
.field-label {
  font-size: 0.83rem;
  font-weight: 500;
  color: #4a3530;
  letter-spacing: 0.02em;
}
.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.input-icon {
  position: absolute;
  left: 1rem;
  color: #b0a09a;
  font-size: 0.9rem;
  pointer-events: none;
}
.field-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1.5px solid #e8e0d8;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: 'DM Sans', sans-serif;
  color: #1a120e;
  background: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}
.field-input::placeholder { color: #c9b5af; }
.field-input:focus {
  border-color: #7c3d2d;
  box-shadow: 0 0 0 3px rgba(124, 61, 45, 0.08);
}
.toggle-pw {
  position: absolute;
  right: 0.9rem;
  background: none;
  border: none;
  color: #b0a09a;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.2s;
}
.toggle-pw:hover { color: #4a3530; }

/* ── SUBMIT ── */
.btn-login {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.85rem;
  background: #1a120e;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.93rem;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  letter-spacing: 0.03em;
  transition: background 0.2s, transform 0.15s;
  margin-top: 0.25rem;
}
.btn-login:hover:not(:disabled) {
  background: #7c3d2d;
  transform: translateY(-1px);
}
.btn-login:disabled { opacity: 0.65; cursor: not-allowed; }
.spinner-sm {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── FOOTER ── */
.form-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  color: #b0a09a;
  text-align: center;
  margin-bottom: 1.25rem;
}
.form-footer i { color: #7c3d2d; font-size: 0.75rem; }
.back-link-wrap { text-align: center; }
.back-link {
  font-size: 0.83rem;
  color: #7c3d2d;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: gap 0.2s;
}
.back-link:hover { gap: 0.6rem; }

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .login-page { grid-template-columns: 1fr; }
  .left-panel { display: none; }
  .right-panel { padding: 3rem 1.5rem; min-height: 100vh; }
}
</style>