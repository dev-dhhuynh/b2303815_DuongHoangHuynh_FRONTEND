<template>
  <div class="login-page">
    <div class="login-split">

      <!-- Left Panel: Branding -->
      <div class="brand-panel">
        <div class="brand-panel-inner">
          <div class="brand-logo">
            <i class="fas fa-book-open"></i>
          </div>
          <h1 class="brand-name">LibraTech</h1>
          <p class="brand-tagline">Thư viện trực tuyến hiện đại — tra cứu, mượn & quản lý sách dễ dàng.</p>
          <div class="brand-features">
            <div class="feature-item">
              <i class="fas fa-search"></i>
              <span>Tìm kiếm hàng nghìn đầu sách</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-bookmark"></i>
              <span>Mượn trả nhanh chóng</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-bell"></i>
              <span>Nhận nhắc nhở tự động</span>
            </div>
          </div>
        </div>
        <div class="brand-decoration">
          <div class="deco-circle c1"></div>
          <div class="deco-circle c2"></div>
          <div class="deco-circle c3"></div>
        </div>
      </div>

      <!-- Right Panel: Form -->
      <div class="form-panel">
        <div class="form-card">
          <!-- Header -->
          <div class="form-header">
            <div class="form-logo-mobile">
              <i class="fas fa-book-open me-2"></i>LibraTech
            </div>
            <h2 class="form-title">Chào mừng trở lại!</h2>
            <p class="form-subtitle">Đăng nhập để tiếp tục sử dụng thư viện</p>
          </div>

          <!-- Error Alert -->
          <Transition name="slide-down">
            <div v-if="errorMessage" class="error-alert">
              <i class="fas fa-exclamation-circle me-2"></i>
              {{ errorMessage }}
            </div>
          </Transition>

          <!-- Form Fields -->
          <div class="form-body">
            <div class="field-group" :class="{ focused: focusedField === 'email', filled: email }">
              <label class="field-label">Email</label>
              <div class="field-input-wrap">
                <i class="fas fa-envelope field-icon"></i>
                <input
                  v-model="email"
                  type="email"
                  class="field-input"
                  placeholder="email@example.com"
                  autocomplete="email"
                  @focus="focusedField = 'email'"
                  @blur="focusedField = ''"
                  @keyup.enter="focusPassword"
                  ref="emailRef"
                />
              </div>
            </div>

            <div class="field-group" :class="{ focused: focusedField === 'password', filled: password }">
              <label class="field-label">Mật khẩu</label>
              <div class="field-input-wrap">
                <i class="fas fa-lock field-icon"></i>
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="field-input"
                  placeholder="Nhập mật khẩu"
                  autocomplete="current-password"
                  @focus="focusedField = 'password'"
                  @blur="focusedField = ''"
                  @keyup.enter="login"
                  ref="passwordRef"
                />
                <button class="toggle-pw" @click="showPassword = !showPassword" tabindex="-1" type="button">
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>

            <div class="form-options">
              <label class="remember-me">
                <input type="checkbox" v-model="rememberMe" />
                <span class="checkmark"></span>
                Ghi nhớ đăng nhập
              </label>
              <a href="#" class="forgot-link">Quên mật khẩu?</a>
            </div>

            <button
              class="btn-login"
              @click="login"
              :disabled="loading || !email || !password"
              :class="{ loading }"
            >
              <span v-if="loading" class="btn-spinner"></span>
              <i v-else class="fas fa-sign-in-alt me-2"></i>
              {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
            </button>
          </div>

          <!-- Footer -->
          <div class="form-footer">
            <span class="text-muted">Chưa có tài khoản?</span>
            <router-link to="/register" class="register-link">Đăng ký ngay</router-link>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "../stores/userStore";
import { useRouter } from "vue-router";

const email       = ref("");
const password    = ref("");
const rememberMe  = ref(false);
const loading     = ref(false);
const errorMessage = ref("");
const showPassword = ref(false);
const focusedField = ref("");

const emailRef    = ref(null);
const passwordRef = ref(null);

const userStore = useUserStore();
const router    = useRouter();

const focusPassword = () => passwordRef.value?.focus();

async function login() {
  if (!email.value || !password.value) return;

  errorMessage.value = "";
  loading.value = true;

  try {
    await userStore.login(email.value, password.value);
    router.push("/");
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message ||
      "Email hoặc mật khẩu không đúng. Vui lòng thử lại.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* ── Tokens ─────────────────────────────────────────── */
.login-page {
  --brand:       #8B3A3A;
  --brand-dark:  #6B2C2C;
  --brand-light: #FDF0F0;
  --accent:      #C0392B;
  --text:        #1A1A2E;
  --text-muted:  #6C757D;
  --border:      #E4E4EE;
  --surface:     #FFFFFF;
  --radius:      12px;
  --shadow:      0 8px 40px rgba(0,0,0,.12);
  font-family: 'Segoe UI', system-ui, sans-serif;
  min-height: 100vh;
  background: #F5F4F2;
}

/* ── Split Layout ────────────────────────────────────── */
.login-split {
  display: flex;
  min-height: 100vh;
}

/* ── Brand Panel ────────────────────────────────────── */
.brand-panel {
  flex: 1;
  background: var(--brand);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.brand-panel-inner {
  position: relative; z-index: 2;
  color: #fff;
  max-width: 360px;
}

.brand-logo {
  width: 72px; height: 72px;
  background: rgba(255,255,255,.15);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255,255,255,.2);
}

.brand-name {
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 0.75rem;
}

.brand-tagline {
  font-size: 1rem;
  opacity: 0.8;
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.brand-features { display: flex; flex-direction: column; gap: 1rem; }

.feature-item {
  display: flex; align-items: center; gap: 12px;
  background: rgba(255,255,255,.1);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255,255,255,.15);
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.9rem;
}
.feature-item i { font-size: 1rem; opacity: 0.9; }

/* Decorative circles */
.brand-decoration { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
.deco-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.08);
}
.c1 { width: 340px; height: 340px; bottom: -80px; right: -80px; }
.c2 { width: 200px; height: 200px; top: -60px; right: 40px; }
.c3 { width: 120px; height: 120px; top: 50%; left: -40px; transform: translateY(-50%); }

/* ── Form Panel ─────────────────────────────────────── */
.form-panel {
  width: 480px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #F5F4F2;
}

.form-card {
  background: var(--surface);
  border-radius: 20px;
  padding: 2.5rem;
  width: 100%;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}

/* ── Form Header ────────────────────────────────────── */
.form-logo-mobile {
  display: none;
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--brand);
  margin-bottom: 1.5rem;
}

.form-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.5px;
  margin-bottom: 0.35rem;
}

.form-subtitle {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: 1.75rem;
}

/* ── Error Alert ────────────────────────────────────── */
.error-alert {
  background: #FDEDEC;
  border: 1px solid #F5B7B1;
  border-left: 4px solid var(--accent);
  color: #922B21;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.88rem;
  margin-bottom: 1.25rem;
}

/* ── Fields ─────────────────────────────────────────── */
.form-body { display: flex; flex-direction: column; gap: 1.1rem; }

.field-group { display: flex; flex-direction: column; gap: 6px; }

.field-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: color 0.2s;
}
.field-group.focused .field-label { color: var(--brand); }

.field-input-wrap {
  position: relative;
  display: flex; align-items: center;
}

.field-icon {
  position: absolute; left: 14px;
  color: var(--text-muted);
  font-size: 0.9rem;
  pointer-events: none;
  transition: color 0.2s;
}
.field-group.focused .field-icon { color: var(--brand); }

.field-input {
  width: 100%;
  padding: 11px 14px 11px 40px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-size: 0.92rem;
  color: var(--text);
  background: #FAFAFA;
  outline: none;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
}
.field-input::placeholder { color: #C0C0C8; }
.field-input:focus {
  border-color: var(--brand);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(139,58,58,.1);
}

.toggle-pw {
  position: absolute; right: 12px;
  background: none; border: none;
  color: var(--text-muted); cursor: pointer;
  padding: 4px; border-radius: 4px;
  font-size: 0.9rem;
  transition: color 0.2s;
}
.toggle-pw:hover { color: var(--brand); }

/* ── Form Options ───────────────────────────────────── */
.form-options {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: -0.25rem;
}

.remember-me {
  display: flex; align-items: center; gap: 8px;
  font-size: 0.85rem; color: var(--text-muted);
  cursor: pointer; user-select: none;
}
.remember-me input[type="checkbox"] { display: none; }
.checkmark {
  width: 18px; height: 18px;
  border: 1.5px solid var(--border);
  border-radius: 5px;
  display: flex; align-items: center; justify-content: center;
  background: #fff;
  transition: all 0.2s;
  flex-shrink: 0;
}
.remember-me input:checked + .checkmark {
  background: var(--brand);
  border-color: var(--brand);
}
.remember-me input:checked + .checkmark::after {
  content: '';
  display: block;
  width: 4px; height: 8px;
  border: 2px solid #fff;
  border-top: none; border-left: none;
  transform: rotate(45deg) translateY(-1px);
}

.forgot-link {
  font-size: 0.85rem;
  color: var(--brand);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}
.forgot-link:hover { color: var(--brand-dark); text-decoration: underline; }

/* ── Login Button ───────────────────────────────────── */
.btn-login {
  margin-top: 0.5rem;
  width: 100%; padding: 13px;
  background: var(--brand);
  color: #fff;
  border: none; border-radius: 10px;
  font-size: 0.95rem; font-weight: 600;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  gap: 8px;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 4px 14px rgba(139,58,58,.3);
}
.btn-login:hover:not(:disabled) {
  background: var(--brand-dark);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(139,58,58,.4);
}
.btn-login:active:not(:disabled) { transform: translateY(0); }
.btn-login:disabled { opacity: 0.6; cursor: not-allowed; box-shadow: none; }

.btn-spinner {
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Form Footer ────────────────────────────────────── */
.form-footer {
  display: flex; align-items: center; justify-content: center;
  gap: 8px;
  margin-top: 1.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
  font-size: 0.88rem;
}

.register-link {
  color: var(--brand);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}
.register-link:hover { color: var(--brand-dark); text-decoration: underline; }

/* ── Transition ─────────────────────────────────────── */
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.3s ease; }
.slide-down-enter-from { opacity: 0; transform: translateY(-8px); }
.slide-down-leave-to   { opacity: 0; transform: translateY(-8px); }

/* ── Responsive ─────────────────────────────────────── */
@media (max-width: 768px) {
  .brand-panel { display: none; }
  .form-panel  { width: 100%; padding: 1.5rem; background: var(--brand); }
  .form-card   { border-radius: 16px; }
  .form-logo-mobile { display: block; }
}
</style>