<template>
  <div class="page">

    <!-- HERO -->
    <section class="page-hero">
      <p class="section-tag">✦ LIÊN HỆ</p>
      <h1 class="page-title">Chúng Tôi Luôn<br>Lắng Nghe Bạn</h1>
      <p class="page-sub">Có thắc mắc hoặc cần hỗ trợ? Hãy liên hệ với chúng tôi</p>
    </section>

    <div class="contact-layout">

      <!-- LEFT: Info -->
      <aside class="contact-info">
        <div class="info-block" v-for="item in contactInfo" :key="item.label">
          <div class="info-icon"><i :class="item.icon"></i></div>
          <div>
            <p class="info-label">{{ item.label }}</p>
            <p class="info-value">{{ item.value }}</p>
          </div>
        </div>

        <div class="hours-card">
          <p class="section-tag" style="margin-bottom:0.75rem">✦ GIỜ MỞ CỬA</p>
          <div class="hours-row" v-for="h in hours" :key="h.day">
            <span class="hours-day">{{ h.day }}</span>
            <span class="hours-time" :class="{ closed: h.time === 'Đóng cửa' }">{{ h.time }}</span>
          </div>
        </div>
      </aside>

      <!-- RIGHT: Form -->
      <main class="contact-form-wrap">
        <div class="form-card">
          <p class="section-tag" style="margin-bottom:0.25rem">✦ GỬI TIN NHẮN</p>
          <h2 class="form-title">Nhắn Gửi Chúng Tôi</h2>

          <div v-if="submitted" class="success-msg">
            <i class="fas fa-check-circle"></i>
            Tin nhắn của bạn đã được gửi! Chúng tôi sẽ phản hồi trong vòng 24 giờ.
          </div>

          <form v-else @submit.prevent="submitForm">
            <div class="form-grid">
              <div class="form-field">
                <label>Họ và tên <span class="req">*</span></label>
                <input v-model="form.name" type="text" required placeholder="Nhập họ và tên" />
              </div>
              <div class="form-field">
                <label>Email <span class="req">*</span></label>
                <input v-model="form.email" type="email" required placeholder="email@example.com" />
              </div>
              <div class="form-field full">
                <label>Số điện thoại</label>
                <input v-model="form.phone" type="tel" placeholder="0xxxxxxxxx" />
              </div>
              <div class="form-field full">
                <label>Chủ đề <span class="req">*</span></label>
                <select v-model="form.subject" required>
                  <option value="" disabled>Chọn chủ đề...</option>
                  <option value="muon-sach">Hỏi về mượn sách</option>
                  <option value="tai-khoan">Vấn đề tài khoản</option>
                  <option value="sach-moi">Đề xuất sách mới</option>
                  <option value="boi-thuong">Vấn đề bồi thường</option>
                  <option value="khac">Khác</option>
                </select>
              </div>
              <div class="form-field full">
                <label>Nội dung <span class="req">*</span></label>
                <textarea v-model="form.message" required rows="5" placeholder="Nhập nội dung tin nhắn..."></textarea>
              </div>
            </div>

            <button type="submit" class="btn-submit" :disabled="sending">
              <i class="fas" :class="sending ? 'fa-spinner fa-spin' : 'fa-paper-plane'"></i>
              {{ sending ? 'Đang gửi...' : 'Gửi Tin Nhắn' }}
            </button>
          </form>
        </div>
      </main>

    </div>

    <!-- MAP PLACEHOLDER -->
    <div class="map-section">
      <div class="map-placeholder">
        <i class="fas fa-map-marker-alt"></i>
        <p>123 Đường Sách, Quận 1, TP. Hồ Chí Minh</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const submitted = ref(false)
const sending   = ref(false)

const form = ref({ name: '', email: '', phone: '', subject: '', message: '' })

const contactInfo = [
  { icon: 'fas fa-map-marker-alt', label: 'Địa chỉ',      value: '123 Đường Sách, Quận 1, TP. Hồ Chí Minh' },
  { icon: 'fas fa-phone-alt',      label: 'Điện thoại',   value: '(028) 1234 5678' },
  { icon: 'fas fa-envelope',       label: 'Email',         value: 'support@libratech.vn' },
  { icon: 'fas fa-headset',        label: 'Hỗ trợ',       value: 'Thứ 2 – Thứ 7, 8:00 – 17:00' },
]

const hours = [
  { day: 'Thứ 2 – Thứ 6', time: '8:00 – 17:00' },
  { day: 'Thứ 7',          time: '8:00 – 12:00' },
  { day: 'Chủ Nhật',       time: 'Đóng cửa' },
]

const submitForm = async () => {
  sending.value = true
  await new Promise(r => setTimeout(r, 1200))
  sending.value = false
  submitted.value = true
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

.page {
  font-family: 'DM Sans', sans-serif;
  background: #faf8f5;
  color: #2c2420;
  min-height: 100vh;
  padding-bottom: 0;
}

/* ── HERO ── */
.page-hero {
  max-width: 1280px;
  margin: 0 auto;
  padding: 4rem 2rem 3rem;
}
.section-tag {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: #7c3d2d;
  font-weight: 500;
  margin-bottom: 0.5rem;
}
.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.6rem;
  font-weight: 700;
  color: #1a120e;
  line-height: 1.12;
  margin: 0 0 0.5rem;
}
.page-sub { color: #9a8a84; font-size: 0.95rem; margin: 0; }

/* ── LAYOUT ── */
.contact-layout {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2.5rem;
  align-items: start;
}

/* ── INFO SIDEBAR ── */
.contact-info { display: flex; flex-direction: column; gap: 1.25rem; }

.info-block {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: #fff;
  border: 1px solid #e8e0d8;
  border-radius: 8px;
  padding: 1.1rem 1.25rem;
}
.info-icon {
  width: 38px; height: 38px;
  background: #f0ebe4;
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.9rem;
  color: #7c3d2d;
  flex-shrink: 0;
}
.info-label {
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9a8a84;
  margin: 0 0 0.2rem;
}
.info-value { font-size: 0.88rem; color: #2c2420; margin: 0; line-height: 1.5; }

.hours-card {
  background: #fff;
  border: 1px solid #e8e0d8;
  border-left: 4px solid #7c3d2d;
  border-radius: 8px;
  padding: 1.25rem 1.5rem;
}
.hours-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.45rem 0;
  border-bottom: 1px solid #f0ebe4;
  font-size: 0.86rem;
}
.hours-row:last-child { border-bottom: none; }
.hours-day { color: #6b5c55; }
.hours-time { font-weight: 500; color: #2c2420; }
.hours-time.closed { color: #b94a2c; }

/* ── FORM ── */
.form-card {
  background: #fff;
  border: 1px solid #e8e0d8;
  border-radius: 8px;
  padding: 2.5rem 2rem;
}
.form-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: #1a120e;
  margin: 0.25rem 0 1.75rem;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.1rem;
  margin-bottom: 1.5rem;
}
.form-field { display: flex; flex-direction: column; gap: 0.35rem; }
.form-field.full { grid-column: 1 / -1; }
.form-field label {
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #6b5c55;
  font-weight: 500;
}
.form-field input,
.form-field select,
.form-field textarea {
  padding: 0.65rem 0.9rem;
  background: #faf8f5;
  border: 1px solid #e8e0d8;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: 'DM Sans', sans-serif;
  color: #2c2420;
  outline: none;
  transition: border-color 0.2s;
}
.form-field input:focus,
.form-field select:focus,
.form-field textarea:focus { border-color: #7c3d2d; background: #fff; }
.form-field textarea { resize: vertical; }
.req { color: #b94a2c; }

.btn-submit {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #7c3d2d;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.85rem 2rem;
  font-size: 0.9rem;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  letter-spacing: 0.03em;
  transition: background 0.2s;
}
.btn-submit:hover:not(:disabled) { background: #5c2d1f; }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.success-msg {
  background: #f0f7f2;
  border: 1px solid #c8e6d0;
  border-left: 4px solid #2d6b3d;
  border-radius: 6px;
  padding: 1.25rem 1.5rem;
  color: #2d6b3d;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  line-height: 1.6;
}
.success-msg i { font-size: 1.2rem; flex-shrink: 0; }

/* ── MAP ── */
.map-section {
  background: #f0ebe4;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.map-placeholder {
  text-align: center;
  color: #9a8a84;
}
.map-placeholder i { font-size: 2rem; color: #7c3d2d; display: block; margin-bottom: 0.5rem; }
.map-placeholder p { font-size: 0.88rem; margin: 0; }

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .contact-layout { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .page-title { font-size: 1.9rem; }
  .form-grid  { grid-template-columns: 1fr; }
  .form-card  { padding: 1.5rem 1.25rem; }
}
</style>