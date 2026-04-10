<template>
  <div class="book-carousel">
    <div class="carousel-container">

      <!-- Prev button -->
      <button
        v-if="currentPage > 0"
        @click="prevPage"
        class="carousel-nav-btn prev-btn"
        :disabled="loading"
        title="Xem sách trước"
      >
        <i class="fas fa-chevron-left"></i>
      </button>

      <!-- Books grid -->
      <div class="books-grid">
        <div v-for="book in visibleBooks" :key="book._id" class="book-item">
          <div class="carousel-book-card">

            <div class="book-image">
              <img
                v-if="book.HinhBia"
                :src="getImageUrl(book.HinhBia)"
                :alt="book.TenSach"
                @error="handleImageError"
              />
              <div v-else class="no-image">
                <i class="fas fa-book"></i>
              </div>
              <span class="avail-badge" :class="book.SoQuyen > 0 ? 'available' : 'unavailable'">
                {{ book.SoQuyen > 0 ? 'Có Sẵn' : 'Hết' }}
              </span>
            </div>

            <div class="book-info">
              <h6 class="book-title">{{ book.TenSach }}</h6>
              <p class="book-author">
                <i class="fas fa-user-edit"></i>
                {{ book.TacGia || 'Đang cập nhật' }}
              </p>
              <p class="book-price">{{ formatCurrency(book.DonGia) }}</p>
              <div class="book-actions">
                <router-link :to="'/sach/' + book._id" class="btn-detail">
                  <i class="fas fa-eye"></i> Chi Tiết
                </router-link>
                <button
                  @click="borrowBook(book)"
                  class="btn-borrow"
                  :disabled="!canBorrow(book)"
                  :title="getBorrowTooltip(book)"
                >
                  <i class="fas fa-hand-holding"></i> Mượn
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- View more card -->
        <div v-if="showViewMoreButton" class="book-item">
          <div class="view-more-card" @click="$emit('view-more')">
            <div class="view-more-content">
              <div class="view-more-icon"><i class="fas fa-arrow-right"></i></div>
              <h5>Xem Thêm Sách</h5>
              <p>Khám phá toàn bộ kho sách</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Next button -->
      <button
        v-if="hasNextPage"
        @click="nextPage"
        class="carousel-nav-btn next-btn"
        :disabled="loading"
        title="Xem sách tiếp theo"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <!-- Page indicators -->
    <div v-if="totalPages > 1" class="page-indicators">
      <div
        v-for="page in totalPages"
        :key="page"
        class="page-indicator"
        :class="{ active: page - 1 === currentPage }"
        @click="goToPage(page - 1)"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const props = defineProps({
  books:        { type: Array,  default: () => [] },
  title:        { type: String, default: 'Sách' },
  emptyMessage: { type: String, default: 'Chưa có sách nào' },
})

const emit = defineEmits(['view-more'])

const userStore = useUserStore()
const router = useRouter()

const currentPage = ref(0)
const booksPerPage = 5
const loading = ref(false)

const totalPages     = computed(() => Math.ceil(props.books.length / booksPerPage))
const hasNextPage    = computed(() => currentPage.value < totalPages.value - 1)
const visibleBooks   = computed(() => {
  const start = currentPage.value * booksPerPage
  return props.books.slice(start, start + booksPerPage)
})
const showViewMoreButton = computed(() =>
  currentPage.value === totalPages.value - 1 &&
  visibleBooks.value.length === booksPerPage
)

const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http')) return imagePath
  return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${imagePath}`
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
  event.target.onerror = null
}

const formatCurrency = (amount) => {
  if (!amount) return 'Miễn phí'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

const canBorrow = (book) => userStore.isLoggedIn && book?.SoQuyen > 0

const getBorrowTooltip = (book) => {
  if (!userStore.isLoggedIn) return 'Vui lòng đăng nhập để mượn sách'
  if (book?.SoQuyen <= 0) return 'Sách đã hết'
  return 'Mượn sách này'
}

const borrowBook = (book) => {
  if (!userStore.isLoggedIn) { router.push('/login'); return }
  router.push(`/sach/${book._id}`)
}

const nextPage = () => { if (currentPage.value < totalPages.value - 1) currentPage.value++ }
const prevPage = () => { if (currentPage.value > 0) currentPage.value-- }
const goToPage = (page) => { if (page >= 0 && page < totalPages.value) currentPage.value = page }

onMounted(() => { currentPage.value = 0 })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

.book-carousel {
  font-family: 'DM Sans', sans-serif;
  position: relative;
  padding: 0.5rem 0 1rem;
}

/* ── CONTAINER ── */
.carousel-container {
  display: flex;
  align-items: center;
  position: relative;
  min-height: 320px;
}

/* ── NAV BUTTONS ── */
.carousel-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid #e8e0d8;
  background: #fff;
  color: #7c3d2d;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(44, 36, 32, 0.1);
}
.carousel-nav-btn:hover:not(:disabled) {
  background: #7c3d2d;
  color: #fff;
  border-color: #7c3d2d;
  transform: translateY(-50%) scale(1.05);
}
.carousel-nav-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.prev-btn { left: -20px; }
.next-btn { right: -20px; }

/* ── GRID ── */
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 1.25rem;
  width: 100%;
  padding: 0.25rem 0.5rem;
}

.book-item {
  animation: fadeUp 0.4s ease forwards;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── BOOK CARD ── */
.carousel-book-card {
  background: #fff;
  border: 1px solid #e8e0d8;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
}
.carousel-book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 28px rgba(44, 36, 32, 0.1);
}

/* Cover */
.book-image {
  position: relative;
  height: 175px;
  background: #f0ebe4;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.book-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}
.carousel-book-card:hover .book-image img { transform: scale(1.04); }
.no-image {
  font-size: 2rem;
  color: #c9b5af;
}

.avail-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
}
.avail-badge.available   { background: rgba(45,107,61,0.88);  color: #fff; }
.avail-badge.unavailable { background: rgba(185,74,44,0.88);  color: #fff; }

/* Info */
.book-info {
  padding: 0.9rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.book-title {
  font-family: 'Playfair Display', serif;
  font-size: 0.88rem;
  font-weight: 700;
  color: #1a120e;
  line-height: 1.35;
  margin: 0 0 0.35rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.35rem;
}
.book-author {
  font-size: 0.76rem;
  color: #9a8a84;
  margin: 0 0 0.4rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.book-author i { font-size: 0.68rem; flex-shrink: 0; }
.book-price {
  font-family: 'Playfair Display', serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: #7c3d2d;
  margin: 0 0 0.85rem;
}

/* Action buttons */
.book-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.4rem;
  margin-top: auto;
}
.btn-detail {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  border: 1.5px solid #c9b5af;
  color: #4a3530;
  border-radius: 4px;
  padding: 0.4rem 0.3rem;
  font-size: 0.75rem;
  font-family: 'DM Sans', sans-serif;
  text-decoration: none;
  transition: all 0.2s;
}
.btn-detail:hover { border-color: #7c3d2d; color: #7c3d2d; }
.btn-detail i { font-size: 0.68rem; }

.btn-borrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  background: #7c3d2d;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.3rem;
  font-size: 0.75rem;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-borrow:hover:not(:disabled) { background: #5c2d1f; }
.btn-borrow:disabled { background: #c9b5af; cursor: not-allowed; }
.btn-borrow i { font-size: 0.68rem; }

/* ── VIEW MORE CARD ── */
.view-more-card {
  background: linear-gradient(135deg, #2c2420 0%, #4a3530 100%);
  border-radius: 8px;
  height: 100%;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #3a2820;
}
.view-more-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 28px rgba(44, 36, 32, 0.25);
}
.view-more-content {
  text-align: center;
  color: #fff;
  padding: 2rem 1.5rem;
}
.view-more-icon {
  width: 52px;
  height: 52px;
  background: rgba(232, 184, 154, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.1rem;
  font-size: 1.1rem;
  color: #e8b89a;
}
.view-more-content h5 {
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 0.4rem;
  color: #fff;
}
.view-more-content p {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.55);
  margin: 0;
}

/* ── PAGE INDICATORS ── */
.page-indicators {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}
.page-indicator {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #c9b5af;
  cursor: pointer;
  transition: all 0.2s;
}
.page-indicator:hover  { background: #9a8a84; }
.page-indicator.active { background: #7c3d2d; transform: scale(1.3); }

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .carousel-nav-btn { width: 30px; height: 30px; font-size: 0.72rem; }
  .prev-btn { left: -14px; }
  .next-btn { right: -14px; }
  .books-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; }
  .book-image { height: 145px; }
  .book-actions { grid-template-columns: 1fr; }
}
</style>