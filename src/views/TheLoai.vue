<template>
  <div class="page">

    <!-- HERO -->
    <section class="page-hero">
      <p class="section-tag">✦ DANH MỤC</p>
      <h1 class="page-title">Thể Loại Sách</h1>
      <p class="page-sub">Khám phá kho sách theo từng chủ đề và lĩnh vực</p>
    </section>

    <!-- CATEGORIES GRID -->
    <section class="categories-section">
      <div class="categories-grid">
        <router-link
          v-for="cat in categories"
          :key="cat.slug"
          :to="'/sach?the-loai=' + cat.slug"
          class="cat-card"
        >
          <div class="cat-icon">
            <i :class="cat.icon"></i>
          </div>
          <h3 class="cat-name">{{ cat.name }}</h3>
          <p class="cat-desc">{{ cat.desc }}</p>
          <span class="cat-arrow"><i class="fas fa-arrow-right"></i></span>
        </router-link>
      </div>
    </section>

  </div>
</template>

<script setup>
const categories = [
  { slug: 'van-hoc',       name: 'Văn Học',         icon: 'fas fa-feather-alt', desc: 'Tiểu thuyết, truyện ngắn, thơ ca và tác phẩm văn học kinh điển' },
  { slug: 'khoa-hoc',      name: 'Khoa Học',         icon: 'fas fa-flask',       desc: 'Vật lý, hóa học, sinh học và các khám phá khoa học hiện đại' },
  { slug: 'ky-thuat',      name: 'Kỹ Thuật',         icon: 'fas fa-cogs',        desc: 'Công nghệ, lập trình, kỹ thuật và tin học ứng dụng' },
  { slug: 'lich-su',       name: 'Lịch Sử',          icon: 'fas fa-landmark',    desc: 'Lịch sử Việt Nam, thế giới và các nền văn minh nhân loại' },
  { slug: 'kinh-te',       name: 'Kinh Tế',          icon: 'fas fa-chart-line',  desc: 'Kinh tế học, tài chính, quản trị và khởi nghiệp' },
  { slug: 'tam-ly',        name: 'Tâm Lý',           icon: 'fas fa-brain',       desc: 'Tâm lý học, kỹ năng sống và phát triển bản thân' },
  { slug: 'thieu-nhi',     name: 'Thiếu Nhi',        icon: 'fas fa-star',        desc: 'Truyện tranh, sách giáo dục và câu chuyện dành cho trẻ em' },
  { slug: 'ngoai-ngu',     name: 'Ngoại Ngữ',        icon: 'fas fa-globe',       desc: 'Tiếng Anh, Nhật, Hàn, Trung và các ngôn ngữ thế giới' },
  { slug: 'nghe-thuat',    name: 'Nghệ Thuật',       icon: 'fas fa-palette',     desc: 'Hội họa, âm nhạc, điện ảnh và các loại hình nghệ thuật' },
  { slug: 'triet-hoc',     name: 'Triết Học',        icon: 'fas fa-infinity',    desc: 'Triết học Đông Tây, tư tưởng và các học thuyết lớn' },
  { slug: 'y-hoc',         name: 'Y Học',            icon: 'fas fa-heartbeat',   desc: 'Sức khỏe, dinh dưỡng, y học cổ truyền và hiện đại' },
  { slug: 'phap-luat',     name: 'Pháp Luật',        icon: 'fas fa-balance-scale', desc: 'Luật pháp, quyền công dân và các văn bản pháp luật' },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

.page {
  font-family: 'DM Sans', sans-serif;
  background: #faf8f5;
  color: #2c2420;
  min-height: 100vh;
  padding-bottom: 5rem;
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
  margin: 0 0 0.5rem;
}
.page-sub {
  color: #9a8a84;
  font-size: 0.95rem;
  margin: 0;
}

/* ── GRID ── */
.categories-section {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
}

/* ── CARD ── */
.cat-card {
  background: #fff;
  border: 1px solid #e8e0d8;
  border-radius: 8px;
  padding: 1.75rem 1.5rem;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  overflow: hidden;
}
.cat-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 4px; height: 100%;
  background: #7c3d2d;
  opacity: 0;
  transition: opacity 0.2s;
}
.cat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgba(44, 36, 32, 0.09);
  border-color: #c9b5af;
}
.cat-card:hover::before { opacity: 1; }

.cat-icon {
  width: 44px;
  height: 44px;
  background: #f0ebe4;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: #7c3d2d;
  margin-bottom: 0.25rem;
  transition: background 0.2s;
}
.cat-card:hover .cat-icon { background: #e8d8d0; }

.cat-name {
  font-family: 'Playfair Display', serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: #1a120e;
  margin: 0;
}
.cat-desc {
  font-size: 0.83rem;
  color: #9a8a84;
  line-height: 1.55;
  margin: 0;
  flex: 1;
}
.cat-arrow {
  font-size: 0.75rem;
  color: #c9b5af;
  margin-top: 0.5rem;
  transition: color 0.2s, transform 0.2s;
  display: inline-block;
}
.cat-card:hover .cat-arrow { color: #7c3d2d; transform: translateX(4px); }

@media (max-width: 640px) {
  .page-title { font-size: 1.9rem; }
  .categories-grid { grid-template-columns: 1fr 1fr; gap: 1rem; }
  .cat-card { padding: 1.25rem 1rem; }
}
</style>