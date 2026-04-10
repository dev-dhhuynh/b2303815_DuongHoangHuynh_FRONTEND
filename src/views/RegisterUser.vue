<template>
  <div class="register-page">
    <div class="register-split">

      <!-- Left Branding Panel -->
      <div class="brand-panel">
        <div class="brand-inner">
          <div class="brand-logo"><i class="fas fa-book-open"></i></div>
          <h1 class="brand-name">LibraTech</h1>
          <p class="brand-tagline">Tham gia cộng đồng đọc sách — tìm kiếm, mượn trả và khám phá tri thức mọi lúc mọi nơi.</p>
          <div class="brand-steps">
            <div class="step-item">
              <div class="step-num">1</div>
              <span>Tạo tài khoản miễn phí</span>
            </div>
            <div class="step-item">
              <div class="step-num">2</div>
              <span>Duyệt & mượn sách yêu thích</span>
            </div>
            <div class="step-item">
              <div class="step-num">3</div>
              <span>Trả sách & tiếp tục khám phá</span>
            </div>
          </div>
        </div>
        <div class="deco">
          <div class="dc dc1"></div>
          <div class="dc dc2"></div>
          <div class="dc dc3"></div>
        </div>
      </div>

      <!-- Right Form Panel -->
      <div class="form-panel">
        <div class="form-card">

          <!-- Header -->
          <div class="form-header">
            <div class="form-logo-mobile"><i class="fas fa-book-open me-2"></i>LibraTech</div>
            <h2 class="form-title">Tạo tài khoản mới</h2>
            <p class="form-subtitle">Điền thông tin bên dưới để bắt đầu</p>
          </div>

          <!-- Progress Steps -->
          <div class="progress-bar-wrap">
            <div class="progress-step" :class="{ active: step >= 1, done: step > 1 }">
              <div class="ps-dot"><i class="fas fa-user" v-if="step <= 1"></i><i class="fas fa-check" v-else></i></div>
              <span>Cơ bản</span>
            </div>
            <div class="progress-line" :class="{ done: step > 1 }"></div>
            <div class="progress-step" :class="{ active: step >= 2, done: step > 2 }">
              <div class="ps-dot"><i class="fas fa-lock" v-if="step <= 2"></i><i class="fas fa-check" v-else></i></div>
              <span>Bảo mật</span>
            </div>
            <div class="progress-line" :class="{ done: step > 2 }"></div>
            <div class="progress-step" :class="{ active: step >= 3 }">
              <div class="ps-dot"><i class="fas fa-id-card"></i></div>
              <span>Cá nhân</span>
            </div>
          </div>

          <!-- Error -->
          <Transition name="slide-down">
            <div v-if="errorMessage" class="error-alert">
              <i class="fas fa-exclamation-circle me-2"></i>{{ errorMessage }}
            </div>
          </Transition>

          <!-- Step 1: Basic Info -->
          <div v-if="step === 1" class="step-body">
            <div class="field-row">
              <div class="field-group" :class="{ focused: focused === 'holot', filled: formData.HoLot }">
                <label class="field-label">Họ <span class="req">*</span></label>
                <div class="field-wrap">
                  <i class="fas fa-user field-icon"></i>
                  <input v-model="formData.HoLot" type="text" class="field-input" placeholder="Nguyễn"
                    @focus="focused = 'holot'" @blur="focused = ''" />
                </div>
              </div>
              <div class="field-group" :class="{ focused: focused === 'ten', filled: formData.Ten }">
                <label class="field-label">Tên <span class="req">*</span></label>
                <div class="field-wrap">
                  <i class="fas fa-user field-icon"></i>
                  <input v-model="formData.Ten" type="text" class="field-input" placeholder="Văn A"
                    @focus="focused = 'ten'" @blur="focused = ''" />
                </div>
              </div>
            </div>

            <div class="field-group" :class="{ focused: focused === 'email', filled: formData.email }">
              <label class="field-label">Email <span class="req">*</span></label>
              <div class="field-wrap">
                <i class="fas fa-envelope field-icon"></i>
                <input v-model="formData.email" type="email" class="field-input" placeholder="email@example.com"
                  @focus="focused = 'email'" @blur="focused = ''" />
              </div>
            </div>

            <div class="field-group" :class="{ focused: focused === 'phone', filled: formData.DienThoai }">
              <label class="field-label">Số điện thoại <span class="req">*</span></label>
              <div class="field-wrap">
                <i class="fas fa-phone field-icon"></i>
                <input v-model="formData.DienThoai" type="tel" class="field-input" placeholder="0912 345 678"
                  @focus="focused = 'phone'" @blur="focused = ''" />
              </div>
            </div>

            <button class="btn-next" @click="goNext" :disabled="!step1Valid">
              Tiếp theo <i class="fas fa-arrow-right ms-2"></i>
            </button>
          </div>

          <!-- Step 2: Password -->
          <div v-if="step === 2" class="step-body">
            <div class="field-group" :class="{ focused: focused === 'pw', filled: formData.password }">
              <label class="field-label">Mật khẩu <span class="req">*</span></label>
              <div class="field-wrap">
                <i class="fas fa-lock field-icon"></i>
                <input v-model="formData.password" :type="showPw ? 'text' : 'password'" class="field-input"
                  placeholder="Ít nhất 6 ký tự" @focus="focused = 'pw'" @blur="focused = ''" />
                <button class="toggle-pw" @click="showPw = !showPw" type="button" tabindex="-1">
                  <i :class="showPw ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <!-- Password strength -->
              <div class="pw-strength" v-if="formData.password">
                <div class="pw-bars">
                  <div v-for="i in 4" :key="i" class="pw-bar" :class="{ active: passwordStrength >= i, [pwStrengthColor]: passwordStrength >= i }"></div>
                </div>
                <span class="pw-label" :class="pwStrengthColor">{{ pwStrengthLabel }}</span>
              </div>
            </div>

            <div class="field-group" :class="{ focused: focused === 'cpw', filled: confirmPassword, error: passwordMismatch }">
              <label class="field-label">Xác nhận mật khẩu <span class="req">*</span></label>
              <div class="field-wrap">
                <i class="fas fa-lock field-icon"></i>
                <input v-model="confirmPassword" :type="showCpw ? 'text' : 'password'" class="field-input"
                  placeholder="Nhập lại mật khẩu" @focus="focused = 'cpw'" @blur="focused = ''" />
                <button class="toggle-pw" @click="showCpw = !showCpw" type="button" tabindex="-1">
                  <i :class="showCpw ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <Transition name="slide-down">
                <p v-if="passwordMismatch" class="field-error">
                  <i class="fas fa-times-circle me-1"></i>Mật khẩu không khớp
                </p>
              </Transition>
            </div>

            <div class="step-nav">
              <button class="btn-back" @click="step--">
                <i class="fas fa-arrow-left me-2"></i>Quay lại
              </button>
              <button class="btn-next" @click="goNext" :disabled="!step2Valid">
                Tiếp theo <i class="fas fa-arrow-right ms-2"></i>
              </button>
            </div>
          </div>

          <!-- Step 3: Personal -->
          <div v-if="step === 3" class="step-body">
            <div class="field-row">
              <div class="field-group" :class="{ focused: focused === 'dob' }">
                <label class="field-label">Ngày sinh</label>
                <div class="field-wrap">
                  <i class="fas fa-calendar field-icon"></i>
                  <input v-model="formData.NgaySinh" type="date" class="field-input date-input"
                    @focus="focused = 'dob'" @blur="focused = ''" />
                </div>
              </div>

              <div class="field-group">
                <label class="field-label">Giới tính</label>
                <div class="gender-group">
                  <label v-for="opt in genderOptions" :key="opt.value" class="gender-option"
                    :class="{ selected: formData.Phai === opt.value }">
                    <input type="radio" v-model="formData.Phai" :value="opt.value" hidden />
                    <i :class="opt.icon"></i>
                    <span>{{ opt.label }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="field-group" :class="{ focused: focused === 'addr', filled: formData.DiaChi }">
              <label class="field-label">Địa chỉ</label>
              <div class="field-wrap textarea-wrap">
                <i class="fas fa-map-marker-alt field-icon" style="top:14px"></i>
                <textarea v-model="formData.DiaChi" class="field-input field-textarea" rows="2"
                  placeholder="Số nhà, đường, phường/xã, quận/huyện..."
                  @focus="focused = 'addr'" @blur="focused = ''"></textarea>
              </div>
            </div>

            <div class="step-nav">
              <button class="btn-back" @click="step--">
                <i class="fas fa-arrow-left me-2"></i>Quay lại
              </button>
              <button class="btn-submit" @click="register" :disabled="loading">
                <span v-if="loading" class="btn-spinner"></span>
                <i v-else class="fas fa-user-plus me-2"></i>
                {{ loading ? 'Đang tạo tài khoản...' : 'Hoàn tất đăng ký' }}
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div class="form-footer">
            <span class="text-muted">Đã có tài khoản?</span>
            <router-link to="/login" class="login-link">Đăng nhập ngay</router-link>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useUserStore } from "../stores/userStore";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router    = useRouter();
const loading   = ref(false);
const errorMessage = ref("");
const step      = ref(1);
const focused   = ref("");
const showPw    = ref(false);
const showCpw   = ref(false);
const confirmPassword = ref("");

const formData = ref({
  HoLot: "", Ten: "", email: "", password: "",
  DienThoai: "", NgaySinh: "", Phai: "Nam", DiaChi: "",
});

const genderOptions = [
  { value: "Nam",  label: "Nam",  icon: "fas fa-mars"  },
  { value: "Nu",   label: "Nữ",   icon: "fas fa-venus" },
  { value: "Khac", label: "Khác", icon: "fas fa-genderless" },
];

const passwordMismatch = computed(() =>
  formData.value.password && confirmPassword.value &&
  formData.value.password !== confirmPassword.value
);

const passwordStrength = computed(() => {
  const pw = formData.value.password;
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 6)  s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw) || /[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
});

const pwStrengthColor = computed(() => {
  return ['', 'weak', 'fair', 'good', 'strong'][passwordStrength.value] || '';
});

const pwStrengthLabel = computed(() => {
  return ['', 'Yếu', 'Trung bình', 'Tốt', 'Rất mạnh'][passwordStrength.value] || '';
});

const step1Valid = computed(() =>
  formData.value.HoLot && formData.value.Ten &&
  formData.value.email && formData.value.DienThoai
);

const step2Valid = computed(() =>
  formData.value.password.length >= 6 &&
  confirmPassword.value && !passwordMismatch.value
);

const goNext = () => {
  errorMessage.value = "";
  step.value++;
};

async function register() {
  loading.value = true;
  errorMessage.value = "";
  try {
    await userStore.register(formData.value);
    router.push("/");
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* ── Tokens ─────────────────────────────────────────── */
.register-page {
  --brand:       #8B3A3A;
  --brand-dark:  #6B2C2C;
  --brand-light: #FDF0F0;
  --success:     #27AE60;
  --text:        #1A1A2E;
  --text-muted:  #6C757D;
  --border:      #E4E4EE;
  --surface:     #FFFFFF;
  --bg:          #F5F4F2;
  --radius:      12px;
  --shadow:      0 8px 40px rgba(0,0,0,.12);
  font-family: 'Segoe UI', system-ui, sans-serif;
  min-height: 100vh;
  background: var(--bg);
}

/* ── Layout ──────────────────────────────────────────── */
.register-split { display: flex; min-height: 100vh; }

/* ── Brand Panel ─────────────────────────────────────── */
.brand-panel {
  flex: 1; background: var(--brand);
  position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  padding: 3rem;
}
.brand-inner { position: relative; z-index: 2; color: #fff; max-width: 360px; }

.brand-logo {
  width: 72px; height: 72px; margin-bottom: 1.5rem;
  background: rgba(255,255,255,.15); backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,.2);
  border-radius: 20px;
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem;
}
.brand-name    { font-size: 2.5rem; font-weight: 800; letter-spacing: -1px; margin-bottom: .75rem; }
.brand-tagline { font-size: 1rem; opacity: .8; line-height: 1.6; margin-bottom: 2.5rem; }

.brand-steps   { display: flex; flex-direction: column; gap: .85rem; }
.step-item {
  display: flex; align-items: center; gap: 12px;
  background: rgba(255,255,255,.1); backdrop-filter: blur(4px);
  border: 1px solid rgba(255,255,255,.15);
  padding: 11px 16px; border-radius: 10px; font-size: .9rem;
}
.step-num {
  width: 26px; height: 26px; flex-shrink: 0;
  background: rgba(255,255,255,.25); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: .78rem; font-weight: 700;
}

/* deco circles */
.deco { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
.dc   { position: absolute; border-radius: 50%; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.08); }
.dc1  { width: 340px; height: 340px; bottom: -80px; right: -80px; }
.dc2  { width: 200px; height: 200px; top: -60px; right: 40px; }
.dc3  { width: 120px; height: 120px; top: 50%; left: -40px; transform: translateY(-50%); }

/* ── Form Panel ──────────────────────────────────────── */
.form-panel {
  width: 520px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  padding: 2rem; background: var(--bg);
  overflow-y: auto;
}
.form-card {
  background: var(--surface); border-radius: 20px; padding: 2.25rem 2.5rem;
  width: 100%; box-shadow: var(--shadow); border: 1px solid var(--border);
}

/* ── Form Header ─────────────────────────────────────── */
.form-logo-mobile { display: none; font-size: 1.3rem; font-weight: 800; color: var(--brand); margin-bottom: 1.5rem; }
.form-title   { font-size: 1.55rem; font-weight: 700; color: var(--text); letter-spacing: -.5px; margin-bottom: .3rem; }
.form-subtitle { color: var(--text-muted); font-size: .9rem; margin-bottom: 1.5rem; }

/* ── Progress Steps ──────────────────────────────────── */
.progress-bar-wrap {
  display: flex; align-items: center; margin-bottom: 1.75rem;
}
.progress-step {
  display: flex; flex-direction: column; align-items: center; gap: 5px;
  flex-shrink: 0;
}
.ps-dot {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--border); color: var(--text-muted);
  display: flex; align-items: center; justify-content: center;
  font-size: .85rem; font-weight: 600;
  transition: all .3s ease;
}
.progress-step span { font-size: .72rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: .4px; }
.progress-step.active .ps-dot { background: var(--brand); color: #fff; box-shadow: 0 3px 10px rgba(139,58,58,.35); }
.progress-step.active span    { color: var(--brand); }
.progress-step.done   .ps-dot { background: var(--success); color: #fff; }
.progress-step.done   span    { color: var(--success); }

.progress-line {
  flex: 1; height: 2px; background: var(--border); margin: 0 8px;
  position: relative; bottom: 10px;
  transition: background .3s ease;
}
.progress-line.done { background: var(--success); }

/* ── Error Alert ─────────────────────────────────────── */
.error-alert {
  background: #FDEDEC; border: 1px solid #F5B7B1;
  border-left: 4px solid #C0392B; color: #922B21;
  padding: 10px 14px; border-radius: 8px; font-size: .88rem; margin-bottom: 1.25rem;
}

/* ── Step Body ───────────────────────────────────────── */
.step-body { display: flex; flex-direction: column; gap: 1.1rem; }
.field-row { display: flex; gap: 1rem; }
.field-row .field-group { flex: 1; }

/* ── Fields ──────────────────────────────────────────── */
.field-group { display: flex; flex-direction: column; gap: 5px; }
.field-label { font-size: .78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: .5px; transition: color .2s; }
.req         { color: #E74C3C; }
.field-group.focused .field-label { color: var(--brand); }
.field-group.error   .field-label { color: #E74C3C; }

.field-wrap  { position: relative; display: flex; align-items: center; }
.textarea-wrap { align-items: flex-start; }
.field-icon  { position: absolute; left: 14px; color: var(--text-muted); font-size: .88rem; pointer-events: none; transition: color .2s; }
.field-group.focused .field-icon { color: var(--brand); }
.field-group.error   .field-icon { color: #E74C3C; }

.field-input {
  width: 100%; padding: 11px 14px 11px 40px;
  border: 1.5px solid var(--border); border-radius: 10px;
  font-size: .9rem; color: var(--text); background: #FAFAFA;
  outline: none; transition: border-color .2s, box-shadow .2s, background .2s;
  font-family: inherit;
}
.field-input::placeholder { color: #C0C0C8; }
.field-input:focus { border-color: var(--brand); background: #fff; box-shadow: 0 0 0 3px rgba(139,58,58,.1); }
.field-group.error .field-input { border-color: #E74C3C; }
.field-group.error .field-input:focus { box-shadow: 0 0 0 3px rgba(231,76,60,.1); }

.field-textarea { resize: none; padding-top: 12px; line-height: 1.5; }
.date-input     { color-scheme: light; }
.toggle-pw      { position: absolute; right: 12px; background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; border-radius: 4px; font-size: .9rem; transition: color .2s; }
.toggle-pw:hover { color: var(--brand); }

.field-error { color: #E74C3C; font-size: .8rem; margin-top: 2px; margin-bottom: 0; }

/* ── Password Strength ───────────────────────────────── */
.pw-strength { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
.pw-bars     { display: flex; gap: 4px; }
.pw-bar      { width: 36px; height: 4px; background: var(--border); border-radius: 2px; transition: background .3s; }
.pw-bar.active.weak   { background: #E74C3C; }
.pw-bar.active.fair   { background: #F39C12; }
.pw-bar.active.good   { background: #3498DB; }
.pw-bar.active.strong { background: var(--success); }
.pw-label { font-size: .75rem; font-weight: 600; }
.pw-label.weak   { color: #E74C3C; }
.pw-label.fair   { color: #F39C12; }
.pw-label.good   { color: #3498DB; }
.pw-label.strong { color: var(--success); }

/* ── Gender Selector ─────────────────────────────────── */
.gender-group  { display: flex; gap: .5rem; }
.gender-option {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
  padding: 9px 8px; border: 1.5px solid var(--border); border-radius: 9px;
  cursor: pointer; font-size: .85rem; color: var(--text-muted);
  transition: all .2s; user-select: none;
  background: #FAFAFA;
}
.gender-option:hover   { border-color: var(--brand); color: var(--brand); background: var(--brand-light); }
.gender-option.selected { border-color: var(--brand); color: var(--brand); background: var(--brand-light); font-weight: 600; }

/* ── Navigation Buttons ──────────────────────────────── */
.step-nav { display: flex; gap: .75rem; margin-top: .25rem; }

.btn-next, .btn-submit {
  flex: 1; padding: 12px; border: none; border-radius: 10px;
  font-size: .92rem; font-weight: 600; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all .2s;
}
.btn-next {
  background: var(--brand); color: #fff;
  box-shadow: 0 4px 14px rgba(139,58,58,.3);
}
.btn-next:hover:not(:disabled) { background: var(--brand-dark); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(139,58,58,.4); }
.btn-next:disabled { opacity: .55; cursor: not-allowed; box-shadow: none; transform: none; }

.btn-submit {
  background: var(--success); color: #fff;
  box-shadow: 0 4px 14px rgba(39,174,96,.3);
}
.btn-submit:hover:not(:disabled) { background: #229954; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(39,174,96,.4); }
.btn-submit:disabled { opacity: .6; cursor: not-allowed; box-shadow: none; transform: none; }

.btn-back {
  padding: 12px 20px; border: 1.5px solid var(--border); border-radius: 10px;
  background: var(--surface); color: var(--text-muted);
  font-size: .9rem; font-weight: 500; cursor: pointer;
  display: flex; align-items: center;
  transition: all .2s;
}
.btn-back:hover { background: var(--border); color: var(--text); }

.btn-spinner {
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,.4); border-top-color: #fff;
  border-radius: 50%; animation: spin .75s linear infinite; flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Form Footer ─────────────────────────────────────── */
.form-footer {
  display: flex; align-items: center; justify-content: center;
  gap: 8px; margin-top: 1.75rem; padding-top: 1.5rem;
  border-top: 1px solid var(--border); font-size: .88rem;
}
.login-link { color: var(--brand); text-decoration: none; font-weight: 600; transition: color .2s; }
.login-link:hover { color: var(--brand-dark); text-decoration: underline; }

/* ── Transitions ─────────────────────────────────────── */
.slide-down-enter-active, .slide-down-leave-active { transition: all .3s ease; }
.slide-down-enter-from, .slide-down-leave-to       { opacity: 0; transform: translateY(-8px); }

/* ── Responsive ──────────────────────────────────────── */
@media (max-width: 768px) {
  .brand-panel { display: none; }
  .form-panel  { width: 100%; padding: 1.25rem; background: var(--brand); }
  .form-card   { border-radius: 16px; padding: 1.75rem 1.5rem; }
  .form-logo-mobile { display: block; }
  .field-row   { flex-direction: column; }
}
</style>