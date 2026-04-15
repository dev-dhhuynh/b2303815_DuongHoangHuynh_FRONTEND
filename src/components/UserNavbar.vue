<template>
  <nav class="navbar">
    <div class="nav-inner">

      <!-- Logo -->
      <router-link to="/" class="nav-logo">
        <i class="fas fa-book-open nav-logo-icon"></i>
        LibraTech
      </router-link>

      <!-- Main links -->
      <div class="nav-links">
        <router-link to="/" class="nav-link">Trang Chủ</router-link>
        <router-link to="/sach" class="nav-link">Danh Sách Sách</router-link>
        <router-link to="/about" class="nav-link">Giới Thiệu</router-link>
        <router-link to="/lien-he" class="nav-link">Liên Hệ</router-link>
        <router-link v-if="userStore.isLoggedIn" to="/lich-su-muon" class="nav-link">Sách Đã Mượn</router-link>
      </div>

      <!-- Actions -->
      <div class="nav-actions">

        <!-- Bell -->
        <div class="bell-wrap" v-if="userStore.isLoggedIn" ref="bellRef">
          <button class="icon-btn bell-btn" @click="toggleBell">
            <i class="fas fa-bell"></i>
            <span v-if="overdueBooks.length > 0" class="bell-badge">{{ overdueBooks.length }}</span>
          </button>
          <Transition name="dropdown-fade">
            <div v-if="bellOpen" class="bell-dropdown">
              <div class="bell-dropdown-header">
                <span class="bell-dropdown-title">🔔 Thông Báo</span>
                <span class="bell-dropdown-count" v-if="overdueBooks.length > 0">{{ overdueBooks.length }} sách quá hạn</span>
              </div>
              <div v-if="overdueBooks.length === 0" class="bell-empty">
                <i class="fas fa-check-circle"></i>
                <p>Không có thông báo!</p>
              </div>
              <div v-else class="bell-list">
                <div v-for="item in overdueBooks" :key="item._id" class="bell-item" @click="goToLichSu">
                  <div class="bell-item-icon"><i class="fas fa-exclamation-triangle"></i></div>
                  <div class="bell-item-info">
                    <p class="bell-item-title">{{ item.MaSach?.TenSach || 'Sách không xác định' }}</p>
                    <p class="bell-item-date">
                      Hạn trả: {{ formatDate(item.NgayTraDuKien) }}
                      <span class="bell-item-overdue">— quá {{ calcOverdueDays(item.NgayTraDuKien) }} ngày</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="bell-dropdown-footer" @click="goToLichSu">Xem lịch sử mượn →</div>
            </div>
          </Transition>
        </div>

        <!-- Search -->
        <button class="icon-btn" @click="toggleSearch">
          <i :class="searchOpen ? 'fas fa-times' : 'fas fa-search'"></i>
        </button>

        <!-- CHƯA ĐĂNG NHẬP: dropdown gom chung -->
        <template v-if="!userStore.isLoggedIn">
          <div class="nav-dropdown">
            <button class="btn-account btn-account--guest">
              <i class="fas fa-user-circle"></i>
              <span>Tài Khoản</span>
              <i class="fas fa-caret-down caret"></i>
            </button>
            <div class="dropdown-menu">
              <p class="dropdown-section-label">Chào mừng bạn</p>
              <router-link to="/register" class="dropdown-item">
                <i class="fas fa-user-plus"></i> Đăng Ký
              </router-link>
              <router-link to="/login" class="dropdown-item">
                <i class="fas fa-sign-in-alt"></i> Đăng Nhập
              </router-link>
              <div class="dropdown-divider"></div>
              <router-link to="/admin/login" class="dropdown-item dropdown-item--muted">
                <i class="fas fa-user-cog"></i> Đăng Nhập Admin
              </router-link>
            </div>
          </div>
        </template>

        <!-- ĐÃ ĐĂNG NHẬP: dropdown -->
        <div v-else class="nav-dropdown">
          <button class="btn-account">
            <i class="fas fa-user-circle"></i>
            <span>{{ displayName }}</span>
            <i class="fas fa-caret-down caret"></i>
          </button>
          <div class="dropdown-menu">
            <p class="dropdown-section-label">{{ displayName }}</p>
            <router-link to="/profile" class="dropdown-item">
              <i class="fas fa-id-card"></i> Hồ Sơ
            </router-link>
            <router-link to="/lich-su-muon" class="dropdown-item">
              <i class="fas fa-history"></i> Lịch Sử Mượn
            </router-link>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item dropdown-item--danger" @click.prevent="handleLogout">
              <i class="fas fa-sign-out-alt"></i> Đăng Xuất
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- Search bar -->
    <Transition name="search-slide">
      <div v-if="searchOpen" class="search-bar-wrapper" @keydown.esc="closeSearch">
        <div class="search-bar-inner">
          <i class="fas fa-search search-bar-icon"></i>
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            class="search-bar-input"
            placeholder="Tìm kiếm tên sách, tác giả..."
            @keydown.enter="doSearch"
          />
          <button v-if="searchQuery" class="search-clear-btn" @click="searchQuery = ''">
            <i class="fas fa-times"></i>
          </button>
          <button class="search-submit-btn" @click="doSearch">Tìm</button>
        </div>
      </div>
    </Transition>
  </nav>

  <!-- LOGOUT MODAL -->
  <Teleport to="body">
    <div v-if="showLogoutModal" class="modal-overlay" @click.self="closeLogoutModal">
      <div class="modal-box">
        <div class="modal-head">
          <div>
            <p class="modal-tag">✦ XÁC NHẬN</p>
            <h3 class="modal-title">Đăng Xuất</h3>
          </div>
          <button class="modal-close" @click="closeLogoutModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body-content">
          <p class="modal-desc">Bạn đang đăng nhập với tài khoản <strong>{{ displayName }}</strong>.</p>
          <p class="modal-desc" style="margin-bottom:0">Bạn có chắc chắn muốn đăng xuất không?</p>
        </div>
        <div class="modal-footer-btns">
          <button class="btn-ghost-sm" @click="closeLogoutModal">
            <i class="fas fa-times"></i> Huỷ
          </button>
          <button class="btn-confirm" @click="confirmLogout">
            <i class="fas fa-check"></i> Đăng Xuất
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'
import muonService from '../services/muonService'

const userStore = useUserStore()
const router = useRouter()

const displayName = computed(() => {
  const parts = [userStore.user?.HoLot, userStore.user?.Ten].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : 'Người Dùng'
})

const showLogoutModal = ref(false)
const handleLogout = () => { showLogoutModal.value = true }
const closeLogoutModal = () => { showLogoutModal.value = false }
const confirmLogout = () => {
  userStore.logout()
  showLogoutModal.value = false
  router.push('/')
}

const searchOpen  = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)

const toggleSearch = async () => {
  searchOpen.value = !searchOpen.value
  if (searchOpen.value) { await nextTick(); searchInput.value?.focus() }
  else searchQuery.value = ''
}
const closeSearch = () => { searchOpen.value = false; searchQuery.value = '' }
const doSearch = () => {
  const q = searchQuery.value.trim()
  if (!q) return
  closeSearch()
  router.push({ path: '/sach', query: { q } })
}

const bellOpen     = ref(false)
const bellRef      = ref(null)
const overdueBooks = ref([])

const toggleBell = () => { bellOpen.value = !bellOpen.value }
const goToLichSu = () => { bellOpen.value = false; router.push('/lich-su-muon') }
const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—'
const calcOverdueDays = (d) => {
  if (!d) return 0
  return Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
}

const loadOverdueBooks = async () => {
  if (!userStore.isLoggedIn) return
  try {
    const all = await muonService.getUserBorrows()
    const now = new Date()
    overdueBooks.value = all.filter(i =>
      i.status === 'approved' && i.NgayTraDuKien && new Date(i.NgayTraDuKien) < now
    )
  } catch (e) { console.error(e) }
}

const handleClickOutside = (e) => {
  if (bellRef.value && !bellRef.value.contains(e.target)) bellOpen.value = false
}

watch(() => userStore.isLoggedIn, (val) => {
  if (val) loadOverdueBooks()
  else overdueBooks.value = []
})

onMounted(() => { loadOverdueBooks(); document.addEventListener('click', handleClickOutside) })
onBeforeUnmount(() => { document.removeEventListener('click', handleClickOutside) })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

.navbar {
  position: sticky; top: 0; z-index: 100;
  background: rgba(250, 248, 245, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #e8e0d8;
}
.nav-inner {
  max-width: 1280px; margin: 0 auto;
  display: flex; align-items: center;
  padding: 0.85rem 2rem; gap: 2rem;
}
.nav-logo {
  font-family: 'Playfair Display', serif; font-size: 1.45rem; font-weight: 700;
  color: #2c2420; text-decoration: none; letter-spacing: 0.02em;
  display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0;
}
.nav-logo-icon { color: #7c3d2d; font-size: 1.1rem; }

.nav-links {
  display: flex; align-items: center; gap: 0.15rem;
  flex: 1;
}
.nav-link {
  font-size: 0.82rem; font-weight: 400; color: #6b5c55; text-decoration: none;
  letter-spacing: 0.06em; text-transform: uppercase; padding: 0.4rem 0.85rem;
  border-radius: 4px; transition: color 0.2s, background 0.2s;
  font-family: 'DM Sans', sans-serif; white-space: nowrap;
}
.nav-link:hover, .nav-link.router-link-exact-active {
  color: #7c3d2d; background: rgba(124,61,45,0.06);
}

.nav-actions { display: flex; align-items: center; gap: 0.4rem; flex-shrink: 0; margin-left: auto; }
.icon-btn {
  background: none; border: none; color: #6b5c55; font-size: 1rem;
  cursor: pointer; padding: 0.45rem 0.5rem; border-radius: 4px;
  transition: color 0.2s, background 0.2s;
}
.icon-btn:hover { color: #2c2420; background: rgba(44,36,32,0.06); }

/* Bell */
.bell-wrap { position: relative; }
.bell-btn { position: relative; }
.bell-badge {
  position: absolute; top: 2px; right: 2px;
  background: #e74c3c; color: #fff; font-size: 0.6rem; font-weight: 700;
  width: 16px; height: 16px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}
.bell-dropdown {
  position: absolute; top: calc(100% + 10px); right: 0; width: 320px;
  background: #fff; border: 1px solid #e8e0d8; border-radius: 12px;
  box-shadow: 0 8px 32px rgba(44,36,32,0.15); z-index: 300; overflow: hidden;
}
.bell-dropdown-header { display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1rem; border-bottom: 1px solid #e8e0d8; background: #faf8f5; }
.bell-dropdown-title { font-size: 0.88rem; font-weight: 600; color: #2c2420; font-family: 'DM Sans', sans-serif; }
.bell-dropdown-count { font-size: 0.75rem; background: #fdedec; color: #e74c3c; padding: 2px 8px; border-radius: 10px; font-weight: 600; }
.bell-empty { padding: 2rem 1rem; text-align: center; color: #9a8a84; }
.bell-empty i { font-size: 2rem; color: #27ae60; margin-bottom: 0.5rem; display: block; }
.bell-empty p { font-size: 0.85rem; margin: 0; }
.bell-list { max-height: 280px; overflow-y: auto; }
.bell-item { display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.85rem 1rem; border-bottom: 1px solid #f5f1ec; cursor: pointer; transition: background 0.15s; }
.bell-item:hover { background: #fff8f6; }
.bell-item:last-child { border-bottom: none; }
.bell-item-icon { width: 32px; height: 32px; background: #fdedec; color: #e74c3c; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; flex-shrink: 0; }
.bell-item-info { flex: 1; min-width: 0; }
.bell-item-title { font-size: 0.85rem; font-weight: 600; color: #2c2420; margin: 0 0 0.2rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bell-item-date { font-size: 0.75rem; color: #9a8a84; margin: 0; }
.bell-item-overdue { color: #e74c3c; font-weight: 600; }
.bell-dropdown-footer { padding: 0.75rem 1rem; text-align: center; font-size: 0.82rem; color: #7c3d2d; font-weight: 500; cursor: pointer; border-top: 1px solid #e8e0d8; background: #faf8f5; transition: background 0.15s; }
.bell-dropdown-footer:hover { background: #f0ebe4; }
.dropdown-fade-enter-active, .dropdown-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.dropdown-fade-enter-from, .dropdown-fade-leave-to { opacity: 0; transform: translateY(-6px); }

/* Account dropdown */
.nav-dropdown { position: relative; }
.btn-account {
  display: flex; align-items: center; gap: 0.45rem;
  background: #7c3d2d; color: #fff; border: none; border-radius: 4px;
  padding: 0.45rem 1rem; font-size: 0.83rem; font-weight: 500;
  font-family: 'DM Sans', sans-serif; cursor: pointer; transition: background 0.2s;
  white-space: nowrap; max-width: 200px;
}
.btn-account--guest {
  background: none; border: 1.5px solid #7c3d2d; color: #7c3d2d;
}
.btn-account--guest:hover { background: #7c3d2d; color: #fff; }
.btn-account span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.btn-account:not(.btn-account--guest):hover { background: #5c2d1f; }
.btn-account .caret { font-size: 0.7rem; opacity: 0.8; flex-shrink: 0; }
.dropdown-menu {
  display: none; position: absolute; top: calc(100% + 8px); right: 0;
  background: #fff; border: 1px solid #e8e0d8; border-radius: 8px;
  min-width: 190px; box-shadow: 0 8px 24px rgba(44,36,32,0.12);
  padding: 0.5rem; z-index: 200;
}
.nav-dropdown:hover .dropdown-menu,
.nav-dropdown:focus-within .dropdown-menu { display: block; }
.dropdown-section-label { font-size: 0.75rem; color: #b0a09a; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.4rem 0.75rem 0.25rem; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dropdown-item { display: flex; align-items: center; gap: 0.6rem; width: 100%; padding: 0.55rem 0.75rem; font-size: 0.87rem; color: #4a3530; text-decoration: none; border-radius: 5px; border: none; background: none; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.15s, color 0.15s; text-align: left; }
.dropdown-item i { font-size: 0.8rem; color: #9a8a84; width: 14px; }
.dropdown-item:hover { background: #f5f1ec; color: #2c2420; }
.dropdown-item--danger { color: #b94a2c; }
.dropdown-item--danger i { color: #b94a2c; }
.dropdown-item--danger:hover { background: #fff1ee; color: #8c2d12; }
.dropdown-item--muted { color: #9a8a84; }
.dropdown-item--muted i { color: #b0a09a; }
.dropdown-divider { height: 1px; background: #ede8e3; margin: 0.4rem 0.5rem; }

/* Search */
.search-bar-wrapper { border-top: 1px solid #e8e0d8; background: #fff; padding: 0.75rem 2rem; }
.search-bar-inner { max-width: 1280px; margin: 0 auto; display: flex; align-items: center; gap: 0.6rem; background: #f5f1ec; border: 1.5px solid #ddd5cd; border-radius: 6px; padding: 0 0.75rem; transition: border-color 0.2s; }
.search-bar-inner:focus-within { border-color: #7c3d2d; background: #fff; }
.search-bar-icon { color: #9a8a84; font-size: 0.9rem; flex-shrink: 0; }
.search-bar-input { flex: 1; border: none; background: transparent; padding: 0.6rem 0; font-size: 0.9rem; font-family: 'DM Sans', sans-serif; color: #2c2420; outline: none; }
.search-bar-input::placeholder { color: #b0a09a; }
.search-clear-btn { background: none; border: none; color: #b0a09a; cursor: pointer; padding: 0.25rem; font-size: 0.8rem; }
.search-clear-btn:hover { color: #4a3530; }
.search-submit-btn { background: #7c3d2d; color: #fff; border: none; border-radius: 4px; padding: 0.4rem 1rem; font-size: 0.82rem; font-family: 'DM Sans', sans-serif; font-weight: 500; cursor: pointer; transition: background 0.2s; flex-shrink: 0; margin: 0.3rem 0; }
.search-submit-btn:hover { background: #5c2d1f; }
.search-slide-enter-active, .search-slide-leave-active { transition: max-height 0.25s ease, opacity 0.2s ease; overflow: hidden; max-height: 80px; }
.search-slide-enter-from, .search-slide-leave-to { max-height: 0; opacity: 0; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(26,18,14,0.55); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1.5rem; }
.modal-box { background: #faf8f5; border-radius: 8px; width: 100%; max-width: 420px; border: 1px solid #e8e0d8; }
.modal-head { display: flex; justify-content: space-between; align-items: flex-start; padding: 1.5rem 1.75rem 1.1rem; border-bottom: 1px solid #e8e0d8; }
.modal-tag { font-size: 0.7rem; letter-spacing: 0.18em; color: #7c3d2d; font-weight: 500; margin: 0 0 0.25rem; }
.modal-title { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700; color: #1a120e; margin: 0; }
.modal-close { background: none; border: none; color: #9a8a84; font-size: 1rem; cursor: pointer; padding: 0.25rem; }
.modal-close:hover { color: #2c2420; }
.modal-body-content { padding: 1.5rem 1.75rem; }
.modal-desc { font-family: 'DM Sans', sans-serif; font-size: 0.9rem; color: #4a3530; line-height: 1.65; margin: 0 0 0.75rem; }
.modal-footer-btns { display: flex; justify-content: flex-end; gap: 0.75rem; padding: 1rem 1.75rem 1.5rem; border-top: 1px solid #e8e0d8; }
.btn-ghost-sm { display: flex; align-items: center; gap: 0.4rem; background: none; border: 1.5px solid #c9b5af; color: #4a3530; border-radius: 4px; padding: 0.55rem 1.25rem; font-size: 0.85rem; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s; }
.btn-ghost-sm:hover { border-color: #7c3d2d; color: #7c3d2d; }
.btn-confirm { display: flex; align-items: center; gap: 0.4rem; background: #7c3d2d; color: #fff; border: none; border-radius: 4px; padding: 0.55rem 1.25rem; font-size: 0.85rem; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: background 0.2s; }
.btn-confirm:hover { background: #5c2d1f; }

@media (max-width: 1024px) {
  .nav-link { font-size: 0.78rem; padding: 0.4rem 0.6rem; }
}
@media (max-width: 768px) {
  .nav-links { display: none; }
  .nav-inner { padding: 0.85rem 1rem; }
  .search-bar-wrapper { padding: 0.65rem 1rem; }
  .bell-dropdown { width: 280px; right: -60px; }
}
</style>