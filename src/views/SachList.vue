<template>
  <div class="book-list-page">
    <div class="container py-5">

      <!-- Page Header -->
      <div class="page-header mb-5">
        <div class="header-left">
          <div class="header-icon"><i class="fas fa-book-open"></i></div>
          <div>
            <h1 class="page-title mb-0">Danh sách sách</h1>
            <p class="page-subtitle mb-0">Khám phá kho sách đa dạng của thư viện</p>
          </div>
        </div>

        <!-- Search -->
        <div class="search-wrap">
          <div class="search-box" :class="{ active: searchFocused || searchQuery }">
            <i class="fas fa-search search-icon"></i>
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="Tìm tên sách, tác giả..."
              @input="onSearchInput"
              @focus="searchFocused = true"
              @blur="searchFocused = false"
              @keyup.escape="clearSearch"
            />
            <button v-if="searchQuery" class="search-clear" @click="clearSearch">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="stats-bar mb-4" v-if="!loading && books.length > 0">
        <div class="stat-chip">
          <i class="fas fa-layer-group"></i>
          <span><strong>{{ books.length }}</strong> tổng số sách</span>
        </div>
        <div class="stat-chip available">
          <i class="fas fa-check-circle"></i>
          <span><strong>{{ availableBooksCount }}</strong> có sẵn</span>
        </div>
        <div class="stat-chip search" v-if="searchQuery">
          <i class="fas fa-filter"></i>
          <span><strong>{{ filteredBooks.length }}</strong> kết quả cho "{{ searchQuery }}"</span>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="state-wrap">
        <div class="spinner-ring mb-3"></div>
        <p class="text-muted fw-medium">Đang tải danh sách sách...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredBooks.length === 0" class="state-wrap">
        <div class="empty-icon mb-3">
          <i class="fas fa-search" v-if="searchQuery"></i>
          <i class="fas fa-inbox" v-else></i>
        </div>
        <h5 class="fw-semibold mb-1">
          {{ searchQuery ? 'Không tìm thấy kết quả' : 'Chưa có sách nào' }}
        </h5>
        <p class="text-muted mb-3">
          {{ searchQuery
            ? `Không có sách nào phù hợp với "${searchQuery}"`
            : 'Hiện chưa có sách nào trong hệ thống.' }}
        </p>
        <button v-if="searchQuery" @click="clearSearch" class="btn-reset">
          <i class="fas fa-undo me-2"></i>Xem tất cả sách
        </button>
      </div>

      <!-- Book Grid -->
      <div v-else class="book-grid">
        <BookCard
          v-for="book in filteredBooks"
          :key="book._id"
          :book="book"
          @bookBorrowed="handleBookBorrowed"
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import BookCard from "../components/BookCard.vue";
import sachService from "../services/sachService";
import { useUserStore } from "../stores/userStore";

const userStore   = useUserStore();
const books       = ref([]);
const loading     = ref(true);
const searchQuery = ref("");
const searchFocused = ref(false);

const loadBooks = async () => {
  try {
    loading.value = true;
    books.value = await sachService.getAll();
  } catch (error) {
    console.error("Error loading books:", error);
  } finally {
    loading.value = false;
  }
};

const onSearchInput = async () => {
  if (!searchQuery.value.trim()) { loadBooks(); return; }
  try {
    loading.value = true;
    books.value = await sachService.search(searchQuery.value);
  } catch (error) {
    console.error("Error searching books:", error);
  } finally {
    loading.value = false;
  }
};

const clearSearch = () => { searchQuery.value = ""; loadBooks(); };

const handleBookBorrowed = (bookId) => {
  const idx = books.value.findIndex((b) => b._id === bookId);
  if (idx !== -1) books.value[idx].SoQuyen -= 1;
};

const filteredBooks = computed(() => {
  if (!searchQuery.value.trim()) return books.value;
  const q = searchQuery.value.toLowerCase();
  return books.value.filter((b) =>
    b.TenSach?.toLowerCase().includes(q) ||
    b.TacGia?.toLowerCase().includes(q) ||
    b.MoTa?.toLowerCase().includes(q) ||
    b.MaNXB?.TenNXB?.toLowerCase().includes(q)
  );
});

const availableBooksCount = computed(() =>
  books.value.filter((b) => b.SoQuyen > 0).length
);

onMounted(() => loadBooks());
</script>

<style scoped>
/* ── Tokens ─────────────────────────────────────────── */
.book-list-page {
  --brand:       #8B3A3A;
  --brand-dark:  #6B2C2C;
  --brand-light: #FDF0F0;
  --success:     #27AE60;
  --success-bg:  #EAFAF1;
  --text:        #1A1A2E;
  --text-muted:  #6C757D;
  --border:      #E8E8F0;
  --surface:     #FFFFFF;
  --bg:          #F5F4F2;
  --radius:      12px;
  --shadow:      0 2px 16px rgba(0,0,0,.07);
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: var(--bg);
  min-height: 100vh;
}

/* ── Page Header ─────────────────────────────────────── */
.page-header {
  display: flex; align-items: center; justify-content: space-between;
  gap: 1.5rem; flex-wrap: wrap;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--border);
}
.header-left { display: flex; align-items: center; gap: 1rem; }

.header-icon {
  width: 52px; height: 52px; flex-shrink: 0;
  background: var(--brand); color: #fff;
  border-radius: var(--radius);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.3rem;
  box-shadow: 0 4px 12px rgba(139,58,58,.3);
}
.page-title   { font-size: 1.75rem; font-weight: 700; color: var(--text); letter-spacing: -.5px; }
.page-subtitle { color: var(--text-muted); font-size: .9rem; }

/* ── Search ──────────────────────────────────────────── */
.search-wrap { flex-shrink: 0; }

.search-box {
  display: flex; align-items: center; gap: 0;
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: 50px;
  padding: 0 16px;
  width: 300px;
  transition: border-color .2s, box-shadow .2s;
}
.search-box.active {
  border-color: var(--brand);
  box-shadow: 0 0 0 3px rgba(139,58,58,.1);
}
.search-icon  { color: var(--text-muted); font-size: .85rem; flex-shrink: 0; transition: color .2s; }
.search-box.active .search-icon { color: var(--brand); }

.search-input {
  flex: 1; border: none; background: transparent;
  padding: 10px 10px; font-size: .9rem; color: var(--text);
  outline: none;
}
.search-input::placeholder { color: #C0C0C8; }

.search-clear {
  background: none; border: none; padding: 4px;
  color: var(--text-muted); cursor: pointer;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: .8rem; transition: color .2s, background .2s;
}
.search-clear:hover { color: var(--brand); background: var(--brand-light); }

/* ── Stats Bar ───────────────────────────────────────── */
.stats-bar {
  display: flex; align-items: center; gap: .75rem; flex-wrap: wrap;
}
.stat-chip {
  display: inline-flex; align-items: center; gap: 7px;
  background: var(--surface); border: 1px solid var(--border);
  padding: 6px 14px; border-radius: 20px;
  font-size: .82rem; color: var(--text-muted);
}
.stat-chip i { font-size: .8rem; }
.stat-chip strong { color: var(--text); }
.stat-chip.available { background: var(--success-bg); border-color: #A9DFBF; color: #1E8449; }
.stat-chip.available strong { color: var(--success); }
.stat-chip.search { background: var(--brand-light); border-color: #F5C6C6; color: var(--brand); }
.stat-chip.search strong { color: var(--brand); }

/* ── Loading / Empty ─────────────────────────────────── */
.state-wrap {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); box-shadow: var(--shadow);
  text-align: center; padding: 4rem 2rem;
}
.spinner-ring {
  width: 44px; height: 44px; margin: 0 auto;
  border: 3px solid var(--border); border-top-color: var(--brand);
  border-radius: 50%; animation: spin .8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.empty-icon {
  width: 72px; height: 72px; margin: 0 auto;
  background: var(--brand-light); color: var(--brand);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.8rem;
}
.btn-reset {
  display: inline-flex; align-items: center;
  padding: 9px 22px; border-radius: 8px; border: none;
  background: var(--brand); color: #fff;
  font-size: .88rem; font-weight: 600; cursor: pointer;
  transition: background .2s;
}
.btn-reset:hover { background: var(--brand-dark); }

/* ── Book Grid ───────────────────────────────────────── */
.book-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

@media (max-width: 1200px) { .book-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 900px)  { .book-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 576px)  {
  .book-grid { grid-template-columns: 1fr; }
  .page-header { flex-direction: column; align-items: flex-start; }
  .search-box { width: 100%; }
  .search-wrap { width: 100%; }
}
</style>