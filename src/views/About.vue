<template>
  <div class="page">

    <!-- HERO -->
    <section class="about-hero">
      <div class="hero-bg-text">LIBRATECH</div>
      <div class="about-hero-content">
        <p class="section-tag">✦ VỀ CHÚNG TÔI</p>
        <h1 class="page-title">Nơi Tri Thức<br>Được Chia Sẻ</h1>
        <p class="page-sub">
          LibraTech là hệ thống thư viện số hiện đại, nơi kết nối độc giả với
          kho tàng tri thức phong phú — từ văn học kinh điển đến khoa học kỹ thuật tiên tiến.
        </p>
      </div>
    </section>

    <!-- MISSION -->
    <section class="mission-section">
      <div class="mission-inner">
        <div class="mission-text">
          <p class="section-tag">✦ SỨ MỆNH</p>
          <h2 class="section-title">Tại Sao LibraTech?</h2>
          <p class="body-text">
            Chúng tôi tin rằng tri thức là tài sản chung của nhân loại. LibraTech
            được xây dựng với mục tiêu mang sách đến gần hơn với mọi người — xóa
            bỏ rào cản về địa lý và chi phí trong việc tiếp cận kiến thức.
          </p>
          <p class="body-text">
            Với hơn <strong>1,000 đầu sách</strong> được chọn lọc kỹ lưỡng từ
            nhiều lĩnh vực, chúng tôi cam kết mang đến trải nghiệm mượn sách
            đơn giản, nhanh chóng và tiện lợi nhất.
          </p>
        </div>
        <div class="mission-stats">
          <div class="mstat-card">
            <span class="mstat-num">1,000+</span>
            <span class="mstat-label">Đầu Sách</span>
          </div>
          <div class="mstat-card">
            <span class="mstat-num">500+</span>
            <span class="mstat-label">Độc Giả</span>
          </div>
          <div class="mstat-card">
            <span class="mstat-num">12</span>
            <span class="mstat-label">Thể Loại</span>
          </div>
          <div class="mstat-card">
            <span class="mstat-num">24/7</span>
            <span class="mstat-label">Hỗ Trợ</span>
          </div>
        </div>
      </div>
    </section>

    <!-- VALUES -->
    <section class="values-section">
      <div class="values-inner">
        <div class="values-header">
          <p class="section-tag light">✦ GIÁ TRỊ CỐT LÕI</p>
          <h2 class="values-title">Những Gì Chúng Tôi<br>Cam Kết</h2>
        </div>
        <div class="values-grid">
          <div class="value-card" v-for="v in values" :key="v.title">
            <div class="value-icon"><i :class="v.icon"></i></div>
            <h4>{{ v.title }}</h4>
            <p>{{ v.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- TEAM -->
    <section class="team-section">
      <div class="team-inner">
        <p class="section-tag">✦ ĐỘI NGŨ</p>
        <h2 class="section-title">Những Người Xây Dựng<br>LibraTech</h2>
        <div class="team-grid">
          <div class="team-card" v-for="member in team" :key="member.name">
            <div class="team-avatar">{{ member.initials }}</div>
            <h4 class="team-name">{{ member.name }}</h4>
            <p class="team-role">{{ member.role }}</p>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
const values = [
  { icon: 'fas fa-book-open',     title: 'Dễ Tiếp Cận',    desc: 'Mọi người đều có thể tìm và mượn sách chỉ với vài thao tác đơn giản, không cần phải đến thư viện.' },
  { icon: 'fas fa-shield-alt',    title: 'Đáng Tin Cậy',   desc: 'Hệ thống hoạt động ổn định, dữ liệu sách và thông tin độc giả được bảo mật tuyệt đối.' },
  { icon: 'fas fa-sync-alt',      title: 'Luôn Cập Nhật',  desc: 'Kho sách được bổ sung thường xuyên với những đầu sách mới nhất từ nhiều lĩnh vực khác nhau.' },
  { icon: 'fas fa-users',         title: 'Cộng Đồng',      desc: 'Xây dựng cộng đồng đọc sách sôi nổi, nơi tri thức được chia sẻ và lan tỏa rộng rãi.' },
]

const team = [
  { initials: 'LT', name: 'Duong Huynh',      role: 'Quản lý hệ thống' },
  { initials: 'NH', name: 'Duong Huynh',  role: 'Thủ thư trưởng' },
  { initials: 'TM', name: 'Duong Huynh',     role: 'Kỹ thuật viên' },
  { initials: 'PL', name: 'Duong Huynh',     role: 'Chăm sóc độc giả' },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

.page {
  font-family: 'DM Sans', sans-serif;
  background: #faf8f5;
  color: #2c2420;
  min-height: 100vh;
}

/* ── HERO ── */
.about-hero {
  max-width: 1280px;
  margin: 0 auto;
  padding: 5rem 2rem 4rem;
  position: relative;
  overflow: hidden;
}
.hero-bg-text {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Playfair Display', serif;
  font-size: 8rem;
  font-weight: 700;
  color: rgba(124, 61, 45, 0.04);
  white-space: nowrap;
  pointer-events: none;
  letter-spacing: 0.1em;
}
.about-hero-content { max-width: 620px; }
.section-tag {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: #7c3d2d;
  font-weight: 500;
  margin-bottom: 0.75rem;
}
.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 700;
  color: #1a120e;
  line-height: 1.12;
  margin: 0 0 1.25rem;
}
.page-sub {
  color: #6b5c55;
  font-size: 1rem;
  line-height: 1.75;
  max-width: 500px;
  margin: 0;
}

/* ── MISSION ── */
.mission-section {
  background: #f0ebe4;
  padding: 5rem 2rem;
}
.mission-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}
.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: #1a120e;
  margin: 0.4rem 0 1.25rem;
  line-height: 1.2;
}
.body-text {
  color: #6b5c55;
  font-size: 0.95rem;
  line-height: 1.8;
  margin: 0 0 1rem;
}
.mission-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.mstat-card {
  background: #fff;
  border: 1px solid #e8e0d8;
  border-radius: 8px;
  padding: 1.75rem 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  transition: transform 0.2s, box-shadow 0.2s;
}
.mstat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(44,36,32,0.08);
}
.mstat-num {
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  font-weight: 700;
  color: #7c3d2d;
  line-height: 1;
}
.mstat-label {
  font-size: 0.78rem;
  color: #9a8a84;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* ── VALUES ── */
.values-section {
  background: linear-gradient(135deg, #2c2420 0%, #4a3530 100%);
  padding: 5rem 2rem;
}
.values-inner { max-width: 1280px; margin: 0 auto; }
.values-header { text-align: center; margin-bottom: 3.5rem; }
.section-tag.light { color: #e8b89a; }
.values-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  font-weight: 700;
  color: #fff;
  margin: 0.4rem 0 0;
  line-height: 1.3;
}
.values-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}
.value-card {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 2rem 1.5rem;
  text-align: center;
  transition: background 0.2s, transform 0.2s;
}
.value-card:hover { background: rgba(255,255,255,0.1); transform: translateY(-4px); }
.value-icon {
  width: 52px; height: 52px;
  background: rgba(232,184,154,0.2);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1.25rem;
  font-size: 1.2rem;
  color: #e8b89a;
}
.value-card h4 {
  font-family: 'Playfair Display', serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.65rem;
}
.value-card p {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.6);
  line-height: 1.7;
  margin: 0;
}

/* ── TEAM ── */
.team-section {
  padding: 5rem 2rem;
  background: #faf8f5;
}
.team-inner { max-width: 1280px; margin: 0 auto; }
.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-top: 3rem;
}
.team-card {
  background: #fff;
  border: 1px solid #e8e0d8;
  border-radius: 8px;
  padding: 2rem 1.5rem;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}
.team-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(44,36,32,0.08); }
.team-avatar {
  width: 64px; height: 64px;
  background: #7c3d2d;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  margin: 0 auto 1rem;
  border: 3px solid #f0ebe4;
}
.team-name {
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  font-weight: 700;
  color: #1a120e;
  margin: 0 0 0.3rem;
}
.team-role {
  font-size: 0.82rem;
  color: #9a8a84;
  margin: 0;
}

/* ── RESPONSIVE ── */
@media (max-width: 1024px) {
  .values-grid { grid-template-columns: repeat(2, 1fr); }
  .team-grid   { grid-template-columns: repeat(2, 1fr); }
  .mission-inner { grid-template-columns: 1fr; gap: 2.5rem; }
}
@media (max-width: 640px) {
  .page-title  { font-size: 2rem; }
  .values-grid { grid-template-columns: 1fr; }
  .team-grid   { grid-template-columns: repeat(2, 1fr); }
  .mission-stats { grid-template-columns: repeat(2, 1fr); }
}
</style>