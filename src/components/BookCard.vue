<template>
  <div class="book-card" :class="{ 'book-card--unavailable': book.SoQuyen <= 0 }">

    <!-- Cover Image -->
    <div class="book-cover-wrap">
      <img
        v-if="book.HinhBia"
        :src="getImageUrl(book.HinhBia)"
        :alt="book.TenSach"
        class="book-cover"
        @error="handleImageError"
      />
      <div v-else class="book-cover-placeholder">
        <i class="fas fa-book"></i>
      </div>

      <!-- Availability badge -->
      <span class="availability-badge" :class="book.SoQuyen > 0 ? 'available' : 'unavailable'">
        {{ book.SoQuyen > 0 ? 'Có Sẵn' : 'Hết Sách' }}
      </span>
    </div>

    <!-- Body -->
    <div class="book-body">
      <p class="book-code">{{ book.MaSach || '—' }}</p>
      <h3 class="book-title">{{ book.TenSach }}</h3>
      <p class="book-author">
        <i class="fas fa-user-edit"></i>
        {{ book.TacGia || 'Đang cập nhật' }}
      </p>

      <div class="book-meta">
        <span v-if="book.MaNXB?.TenNXB" class="meta-item">
          <i class="fas fa-building"></i> {{ book.MaNXB.TenNXB }}
        </span>
        <span v-if="book.NamXuatBan" class="meta-item">
          <i class="fas fa-calendar-alt"></i> {{ book.NamXuatBan }}
        </span>
      </div>

      <p class="book-price">{{ formatCurrency(book.DonGia) }}</p>

      <!-- Actions -->
      <div class="book-actions">
        <router-link :to="'/sach/' + book._id" class="btn-detail">
          <i class="fas fa-eye"></i> Chi Tiết
        </router-link>
        <button
          class="btn-borrow"
          @click="borrowBook"
          :disabled="!canBorrow || loadingBorrow"
          :title="borrowTooltip"
        >
          <i class="fas" :class="loadingBorrow ? 'fa-spinner fa-spin' : 'fa-hand-holding'"></i>
          Mượn
        </button>
      </div>

      <!-- Borrow message -->
      <div v-if="borrowMessage" class="borrow-msg" :class="borrowMsgType">
        <i :class="borrowMessageIcon"></i> {{ borrowMessage }}
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import muonService from '../services/muonService'

const props = defineProps({ book: Object })
const emit = defineEmits(['bookBorrowed'])

const router = useRouter()
const userStore = useUserStore()

const loadingBorrow = ref(false)
const borrowMessage = ref('')
const borrowMsgType = ref('')
const borrowMessageIcon = ref('')

const canBorrow = computed(() => userStore.isLoggedIn && props.book?.SoQuyen > 0)

const borrowTooltip = computed(() => {
  if (!userStore.isLoggedIn) return 'Vui lòng đăng nhập để mượn sách'
  if (props.book?.SoQuyen <= 0) return 'Sách đã hết'
  return 'Mượn sách này'
})

const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http')) return imagePath
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  return `${baseUrl}${imagePath}`
}

const formatCurrency = (amount) => {
  if (!amount) return 'Miễn phí'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

const borrowBook = async () => {
  if (!userStore.isLoggedIn) { router.push('/login'); return }
  if (!props.book || props.book.SoQuyen <= 0) {
    showBorrowMessage('Sách hiện không có sẵn để mượn', 'warning', 'fa-exclamation-triangle')
    return
  }
  try {
    loadingBorrow.value = true
    borrowMessage.value = ''
    await muonService.requestBorrow({
      MaSach: props.book._id,
      NgayTraDuKien: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    })
    showBorrowMessage('Yêu cầu mượn đã gửi! Vui lòng chờ admin duyệt.', 'success', 'fa-check-circle')
    emit('bookBorrowed', props.book._id)
  } catch (error) {
    showBorrowMessage(
      error.response?.data?.message || 'Mượn sách thất bại. Vui lòng thử lại.',
      'danger', 'fa-exclamation-circle'
    )
  } finally {
    loadingBorrow.value = false
  }
}

const showBorrowMessage = (message, type, icon) => {
  borrowMessage.value = message
  borrowMsgType.value = type
  borrowMessageIcon.value = `fas ${icon}`
  setTimeout(() => { borrowMessage.value = '' }, 5000)
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
  event.target.onerror = null
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

.book-card {
  font-family: 'DM Sans', sans-serif;
  background: #fff;
  border: 1px solid #e8e0d8;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
}
.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(44, 36, 32, 0.1);
}
.book-card--unavailable { opacity: 0.82; }

/* Cover */
.book-cover-wrap {
  position: relative;
  height: 210px;
  background: #f0ebe4;
  overflow: hidden;
  flex-shrink: 0;
}
.book-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}
.book-card:hover .book-cover { transform: scale(1.04); }
.book-cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #c9b5af;
}

.availability-badge {
  position: absolute;
  top: 0.65rem;
  right: 0.65rem;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 0.25rem 0.6rem;
  border-radius: 3px;
}
.availability-badge.available {
  background: rgba(45, 107, 61, 0.9);
  color: #fff;
}
.availability-badge.unavailable {
  background: rgba(185, 74, 44, 0.9);
  color: #fff;
}

/* Body */
.book-body {
  padding: 1.1rem 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.book-code {
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #b0a09a;
  margin: 0 0 0.4rem;
}
.book-title {
  font-family: 'Playfair Display', serif;
  font-size: 0.98rem;
  font-weight: 700;
  color: #1a120e;
  margin: 0 0 0.4rem;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.65rem;
}
.book-author {
  font-size: 0.82rem;
  color: #9a8a84;
  margin: 0 0 0.6rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}
.book-author i { font-size: 0.72rem; }

.book-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}
.meta-item {
  font-size: 0.75rem;
  color: #9a8a84;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.meta-item i { font-size: 0.68rem; }

.book-price {
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  font-weight: 700;
  color: #7c3d2d;
  margin: 0 0 1rem;
}

/* Actions */
.book-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: auto;
}
.btn-detail {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  border: 1.5px solid #c9b5af;
  color: #4a3530;
  border-radius: 4px;
  padding: 0.5rem 0.5rem;
  font-size: 0.82rem;
  font-family: 'DM Sans', sans-serif;
  text-decoration: none;
  transition: all 0.2s;
  letter-spacing: 0.02em;
}
.btn-detail:hover { border-color: #7c3d2d; color: #7c3d2d; }
.btn-detail i { font-size: 0.75rem; }

.btn-borrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  background: #7c3d2d;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 0.5rem;
  font-size: 0.82rem;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: background 0.2s;
  letter-spacing: 0.02em;
}
.btn-borrow:hover:not(:disabled) { background: #5c2d1f; }
.btn-borrow:disabled {
  background: #c9b5af;
  cursor: not-allowed;
}
.btn-borrow i { font-size: 0.75rem; }

/* Borrow message */
.borrow-msg {
  margin-top: 0.75rem;
  padding: 0.55rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  line-height: 1.45;
}
.borrow-msg.success { background: #f0f7f2; color: #2d6b3d; border-left: 3px solid #2d6b3d; }
.borrow-msg.warning { background: #fff8ec; color: #9a6b00; border-left: 3px solid #9a6b00; }
.borrow-msg.danger  { background: #fff1ee; color: #b94a2c; border-left: 3px solid #b94a2c; }
</style>