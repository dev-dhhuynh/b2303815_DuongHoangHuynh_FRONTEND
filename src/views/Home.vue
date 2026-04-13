<template>
  <div class="home-page">

    <!-- HERO -->
    <section class="hero">
      <div class="hero-bg-text">LIBRATECH</div>
      <div class="hero-content">
        <p class="hero-tag">
          <span class="tag-icon">✦</span> HỆ THỐNG THƯ VIỆN SỐ <span class="tag-icon">✦</span>
        </p>
        <h1 class="hero-title">Nơi Mỗi<br>Trang Sách<br>Kể Một Câu Chuyện</h1>
        <p class="hero-desc">
          Khám phá kho tri thức phong phú — sách văn học, khoa học, kỹ thuật
          được chọn lọc kỹ lưỡng. Lấy cảm hứng từ những trang sách cổ điển và
          tinh hoa tri thức nhân loại.
        </p>
        <div class="hero-btns">
          <router-link to="/sach" class="btn-primary-hero">Khám Phá Sách</router-link>
          <router-link to="/about" class="btn-ghost-hero">Về Chúng Tôi</router-link>
        </div>
      </div>
      <div class="hero-image">
        <img
          src="https://img6.thuthuatphanmem.vn/uploads/2022/04/15/anh-nen-ke-sach-dep-nhat_022005271.jpg"
          alt="Thư viện"
        />
        <div class="hero-image-badge">
          <span class="badge-num">{{ stats.totalBooks || 0 }}+</span>
          <span class="badge-lbl">Đầu Sách</span>
        </div>
      </div>
    </section>

    <!-- STATS -->
    <section class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-num">{{ stats.totalBooks || 0 }}</span>
          <span class="stat-label">Sách Trong Kho</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ stats.availableBooks || 0 }}</span>
          <span class="stat-label">Sách Có Sẵn</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ stats.totalReaders || 0 }}</span>
          <span class="stat-label">Độc Giả</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ stats.totalBorrows || 0 }}</span>
          <span class="stat-label">Lượt Mượn</span>
        </div>
      </div>
    </section>

    <!-- BOOK BANNER -->
    <div class="book-banner-wrapper" v-if="allBooks.length > 0">
      <div class="book-banner-label">✦ KHO SÁCH</div>
      <div class="book-banner-track-container">
        <div class="book-banner-track" ref="trackRef">
          <div
            class="book-banner-item"
            v-for="(book, i) in [...allBooks, ...allBooks]"
            :key="i"
            @click="goToBookList"
          >
            <img
              :src="book.HinhBia ? `http://localhost:3000${book.HinhBia}` : 'https://via.placeholder.com/80x110?text=No+Image'"
              :alt="book.TenSach"
            />
            <span class="book-banner-title">{{ book.TenSach }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- NEW BOOKS -->
    <section class="book-section">
      <div class="section-head">
        <div>
          <p class="section-tag">✦ BỘ SƯU TẬP</p>
          <h2 class="section-title">Sách Mới Cập Nhật</h2>
          <p class="section-sub">Những cuốn sách mới nhất được thêm vào hệ thống</p>
        </div>
        <button class="btn-viewmore" @click="goToBookList">Xem Tất Cả →</button>
      </div>

      <BookCarousel
        :books="newBooks"
        title="Sách Mới Cập Nhật"
        emptyMessage="Chưa có sách mới nào"
        @view-more="goToBookList"
      />
    </section>

    <!-- FEATURED BOOKS -->
    <section class="book-section featured-bg">
      <div class="section-head center">
        <div>
          <p class="section-tag">✦ NỔI BẬT</p>
          <h2 class="section-title">Sách Được Yêu Thích</h2>
          <p class="section-sub">Những cuốn sách được độc giả yêu thích nhất</p>
        </div>
        <button class="btn-viewmore" @click="goToBookList">Xem Tất Cả →</button>
      </div>

      <BookCarousel
        :books="featuredBooks"
        title="Sách Nổi Bật"
        emptyMessage="Chưa có sách nổi bật nào"
        @view-more="goToBookList"
      />
    </section>

    <!-- FEATURES -->
    <section class="features-section">
      <div class="features-header">
        <p class="section-tag light">✦ TIỆN ÍCH</p>
        <h2 class="features-title">Trải Nghiệm Mượn Sách<br>Đơn Giản & Tiện Lợi</h2>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-book-open"></i>
          </div>
          <h4>Mượn Sách Dễ Dàng</h4>
          <p>Chỉ vài click để mượn cuốn sách bạn yêu thích. Quy trình đơn giản, nhanh chóng.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-calendar-check"></i>
          </div>
          <h4>Quản Lý Thời Gian</h4>
          <p>Theo dõi lịch sử mượn và hạn trả sách một cách dễ dàng, không bao giờ quên hạn.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-headset"></i>
          </div>
          <h4>Hỗ Trợ 24/7</h4>
          <p>Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc của bạn bất kỳ lúc nào.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-search"></i>
          </div>
          <h4>Tìm Kiếm Thông Minh</h4>
          <p>Tra cứu sách theo tên, tác giả, thể loại với công cụ tìm kiếm thông minh, chính xác.</p>
        </div>
      </div>
    </section>

    <!-- FOOTER STRIP -->
    <footer class="footer-strip">
      <span class="footer-logo">LibraTech</span>
      <span class="footer-copy">© 2025 LibraTech. Quản lý tri thức – Kết nối tương lai.</span>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
import BookCarousel from "../components/BookCarousel.vue";
import sachService from "../services/sachService";
import statsService from "../services/statsService";

const userStore = useUserStore();
const router = useRouter();

const newBooks = ref([]);
const featuredBooks = ref([]);
const allBooks = ref([]);
const trackRef = ref(null);
const stats = ref({
  totalBooks: 0,
  availableBooks: 0,
  totalReaders: 0,
  totalBorrows: 0,
});
const loading = ref(false);

let animationId = null;
let scrollX = 0;

const startScroll = () => {
  const track = trackRef.value;
  if (!track) return;

  const totalWidth = track.scrollWidth / 2;

  const step = () => {
    scrollX += 0.5;
    if (scrollX >= totalWidth) scrollX = 0;
    track.style.transform = `translateX(-${scrollX}px)`;
    animationId = requestAnimationFrame(step);
  };

  animationId = requestAnimationFrame(step);
};

const loadHomeData = async () => {
  try {
    loading.value = true;
    const books = await sachService.getAll();

    allBooks.value = books;

    newBooks.value = [...books]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 15);

    // Chỉ lấy sách có isFeatured === true
    featuredBooks.value = [...books]
      .filter((book) => book.isFeatured === true)
      .slice(0, 15);

    try {
      const statsData = await statsService.getStats();
      stats.value = {
        totalBooks: statsData.totalBooks,
        availableBooks: statsData.availableBooks,
        totalReaders: statsData.totalReaders,
        totalBorrows: statsData.totalBorrows,
      };
    } catch {
      stats.value = {
        totalBooks: books.length,
        availableBooks: books.filter((b) => b.SoQuyen > 0).length,
        totalReaders: 0,
        totalBorrows: 0,
      };
    }

    setTimeout(() => startScroll(), 300);

  } catch (error) {
    console.error("Error loading home data:", error);
  } finally {
    loading.value = false;
  }
};

const goToBookList = () => router.push("/sach");

onMounted(() => loadHomeData());
onBeforeUnmount(() => {
  if (animationId) cancelAnimationFrame(animationId);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

/* ── ROOT ── */
.home-page {
  font-family: 'DM Sans', sans-serif;
  background: #faf8f5;
  color: #2c2420;
  min-height: 100vh;
}

/* ── HERO ── */
.hero {
  max-width: 1280px;
  margin: 0 auto;
  padding: 5rem 2rem 4rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 4rem;
  position: relative;
  overflow: hidden;
}
.hero-bg-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Playfair Display', serif;
  font-size: 9rem;
  font-weight: 700;
  color: rgba(124, 61, 45, 0.04);
  white-space: nowrap;
  pointer-events: none;
  letter-spacing: 0.1em;
}
.hero-tag {
  font-size: 0.78rem;
  letter-spacing: 0.2em;
  color: #7c3d2d;
  font-weight: 500;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.tag-icon { font-size: 0.6rem; }
.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 3.8rem;
  font-weight: 700;
  line-height: 1.12;
  color: #1a120e;
  margin: 0 0 1.5rem;
}
.hero-desc {
  color: #6b5c55;
  font-size: 0.97rem;
  line-height: 1.75;
  max-width: 420px;
  margin-bottom: 2.5rem;
}
.hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
.btn-primary-hero {
  background: #7c3d2d;
  color: #fff;
  padding: 0.85rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.03em;
  transition: background 0.2s, transform 0.15s;
}
.btn-primary-hero:hover { background: #5c2d1f; transform: translateY(-1px); }
.btn-ghost-hero {
  border: 1.5px solid #c9b5af;
  color: #4a3530;
  padding: 0.85rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 0.03em;
  transition: border-color 0.2s, color 0.2s;
}
.btn-ghost-hero:hover { border-color: #7c3d2d; color: #7c3d2d; }

.hero-image { position: relative; }
.hero-image img {
  width: 100%;
  height: 420px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
}
.hero-image-badge {
  position: absolute;
  bottom: -1.5rem;
  left: -1.5rem;
  background: #7c3d2d;
  color: #fff;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8px 24px rgba(124, 61, 45, 0.3);
}
.badge-num {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
}
.badge-lbl {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  opacity: 0.85;
  margin-top: 0.25rem;
}

/* ── STATS ── */
.stats-section {
  background: #f0ebe4;
  padding: 3.5rem 2rem;
  margin-top: 3rem;
}
.stats-grid {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}
.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #e8e0d8;
  transition: transform 0.2s, box-shadow 0.2s;
}
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(44, 36, 32, 0.08);
}
.stat-num {
  font-family: 'Playfair Display', serif;
  font-size: 2.8rem;
  font-weight: 700;
  color: #7c3d2d;
  line-height: 1;
}
.stat-label {
  font-size: 0.82rem;
  color: #9a8a84;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-top: 0.5rem;
}

/* ── BOOK BANNER ── */
.book-banner-wrapper {
  background: #2c2420;
  padding: 1rem 0;
  margin-top: 2.5rem;
  overflow: hidden;
  position: relative;
}
.book-banner-label {
  text-align: center;
  font-size: 0.7rem;
  letter-spacing: 0.25em;
  color: #e8b89a;
  margin-bottom: 0.75rem;
  font-weight: 500;
}
.book-banner-track-container {
  overflow: hidden;
  width: 100%;
}
.book-banner-track {
  display: flex;
  gap: 1.5rem;
  width: max-content;
  will-change: transform;
}
.book-banner-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.2s;
}
.book-banner-item:hover { transform: translateY(-4px); }
.book-banner-item img {
  width: 70px;
  height: 95px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  border: 1px solid rgba(255,255,255,0.1);
}
.book-banner-title {
  font-size: 0.65rem;
  color: rgba(255,255,255,0.6);
  text-align: center;
  max-width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── BOOK SECTIONS ── */
.book-section {
  max-width: 1280px;
  margin: 0 auto;
  padding: 4rem 2rem;
}
.featured-bg {
  background: #f5f1ec;
  max-width: 100%;
  padding-left: calc((100% - 1280px) / 2 + 2rem);
  padding-right: calc((100% - 1280px) / 2 + 2rem);
}
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

/* ✅ Căn giữa cho phần Sách Được Yêu Thích */
.section-head.center {
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.section-head.center .btn-viewmore {
  margin-top: 0.5rem;
}

.section-tag {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: #7c3d2d;
  font-weight: 500;
  margin-bottom: 0.5rem;
}
.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: #1a120e;
  margin: 0 0 0.25rem;
}
.section-sub {
  color: #9a8a84;
  font-size: 0.88rem;
  margin: 0;
}
.btn-viewmore {
  background: none;
  border: 1.5px solid #c9b5af;
  color: #4a3530;
  padding: 0.6rem 1.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  letter-spacing: 0.03em;
  transition: all 0.2s;
  white-space: nowrap;
}
.btn-viewmore:hover { border-color: #7c3d2d; color: #7c3d2d; }

/* ── FEATURES ── */
.features-section {
  background: linear-gradient(135deg, #2c2420 0%, #4a3530 100%);
  padding: 5rem 2rem;
  color: #fff;
}
.features-header {
  max-width: 1280px;
  margin: 0 auto 3.5rem;
  text-align: center;
}
.section-tag.light { color: #e8b89a; }
.features-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.4rem;
  font-weight: 700;
  color: #fff;
  margin: 0.5rem 0 0;
  line-height: 1.3;
}
.features-grid {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}
.feature-card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 2rem 1.5rem;
  text-align: center;
  transition: background 0.2s, transform 0.2s;
}
.feature-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-4px);
}
.feature-icon {
  width: 52px;
  height: 52px;
  background: rgba(232, 184, 154, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  font-size: 1.25rem;
  color: #e8b89a;
}
.feature-card h4 {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 0.75rem;
  color: #fff;
}
.feature-card p {
  font-size: 0.87rem;
  color: rgba(255, 255, 255, 0.62);
  line-height: 1.7;
  margin: 0;
}

/* ── FOOTER ── */
.footer-strip {
  background: #1a120e;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.footer-logo {
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: #e8b89a;
  letter-spacing: 0.05em;
}
.footer-copy {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
}

/* ── RESPONSIVE ── */
@media (max-width: 1024px) {
  .hero { grid-template-columns: 1fr; gap: 3rem; padding: 3rem 1.5rem; }
  .hero-bg-text { display: none; }
  .hero-title { font-size: 2.8rem; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .features-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .hero-title { font-size: 2.2rem; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .features-grid { grid-template-columns: 1fr; }
  .hero-image img { height: 260px; }
  .section-head { flex-direction: column; align-items: flex-start; }
}
</style>