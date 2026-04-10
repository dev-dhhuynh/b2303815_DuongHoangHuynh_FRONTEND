<template>
  <nav class="admin-navbar">
    <div class="admin-nav-inner">

      <!-- Logo -->
      <router-link to="/admin/dashboard" class="admin-logo">
        <i class="fas fa-cogs admin-logo-icon"></i>
        Admin Panel
      </router-link>

      <!-- Main links -->
      <div class="admin-nav-links">
        <router-link to="/admin/dashboard" class="admin-nav-link">
          <i class="fas fa-tachometer-alt"></i> Dashboard
        </router-link>
        <router-link to="/admin/pending" class="admin-nav-link">
          <i class="fas fa-clock"></i> Chờ Duyệt
        </router-link>
        <router-link to="/admin/approved" class="admin-nav-link">
          <i class="fas fa-check-circle"></i> Đã Duyệt
        </router-link>
        <router-link to="/admin/manage-sach" class="admin-nav-link">
          <i class="fas fa-book"></i> Quản Lý Sách
        </router-link>
        <router-link to="/admin/borrow-all" class="admin-nav-link">
          <i class="fas fa-list"></i> Lịch Sử Mượn
        </router-link>
      </div>

      <!-- Account dropdown -->
      <div class="admin-nav-actions">
        <div class="admin-dropdown">
          <button class="admin-btn-account">
            <i class="fas fa-user-cog"></i>
            <span>{{ adminStore.isLoggedIn ? (adminStore.admin?.HoTenNV || 'Admin') : 'Admin' }}</span>
            <i class="fas fa-caret-down caret"></i>
          </button>

          <div class="admin-dropdown-menu">
            <!-- Chưa đăng nhập -->
            <template v-if="!adminStore.isLoggedIn">
              <p class="dropdown-section-label">Chưa đăng nhập</p>
              <router-link to="/admin/login" class="admin-dropdown-item">
                <i class="fas fa-sign-in-alt"></i> Đăng Nhập
              </router-link>
            </template>

            <!-- Đã đăng nhập -->
            <template v-else>
              <div class="dropdown-info">
                <p class="dropdown-section-label">Đang đăng nhập</p>
                <p class="dropdown-admin-name">{{ adminStore.admin?.HoTenNV || 'Admin' }}</p>
                <p class="dropdown-admin-id">MSNV: {{ adminStore.admin?.MSNV }}</p>
              </div>
              <div class="dropdown-divider"></div>
              <button class="admin-dropdown-item admin-dropdown-item--danger" @click="showLogoutConfirm">
                <i class="fas fa-exchange-alt"></i> Đăng Xuất
              </button>
            </template>
          </div>
        </div>
      </div>

    </div>
  </nav>

  <!-- LOGOUT MODAL -->
  <Teleport to="body">
    <div v-if="showLogoutModal" class="modal-overlay" @click.self="closeLogoutModal">
      <div class="modal-box">
        <div class="modal-head">
          <div>
            <p class="modal-tag">✦ XÁC NHẬN</p>
            <h3 class="modal-title">Đăng Xuất Admin</h3>
          </div>
          <button class="modal-close" @click="closeLogoutModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body-content">
          <p class="modal-desc">
            Bạn đang đăng nhập với tài khoản
            <strong>{{ adminStore.admin?.HoTenNV }}</strong>
            (MSNV: {{ adminStore.admin?.MSNV }}).
          </p>
          <p class="modal-desc" style="margin-bottom:0">
            Bạn có chắc chắn muốn đăng xuất không?
          </p>
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
import { ref } from 'vue'
import { useAdminStore } from '../stores/adminStore'
import { useRouter } from 'vue-router'

const adminStore = useAdminStore()
const router = useRouter()

const showLogoutModal = ref(false)

const showLogoutConfirm = () => { showLogoutModal.value = true }
const closeLogoutModal = () => { showLogoutModal.value = false }

const confirmLogout = () => {
  adminStore.logout()
  closeLogoutModal()
  router.push('/admin/login')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

/* ── NAVBAR ── */
.admin-navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #1a120e;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.admin-nav-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 2rem;
  gap: 1.5rem;
}

/* Logo */
.admin-logo {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #e8b89a;
  text-decoration: none;
  letter-spacing: 0.04em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}
.admin-logo-icon { color: #7c3d2d; font-size: 1rem; }

/* Nav links */
.admin-nav-links {
  display: flex;
  align-items: center;
  gap: 0.15rem;
  flex: 1;
  justify-content: center;
}
.admin-nav-link {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 400;
  color: rgba(255,255,255,0.55);
  text-decoration: none;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.4rem 0.7rem;
  border-radius: 4px;
  transition: color 0.2s, background 0.2s;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  white-space: nowrap;
}
.admin-nav-link i { font-size: 0.72rem; opacity: 0.7; }
.admin-nav-link:hover { color: #fff; background: rgba(255,255,255,0.08); }
.admin-nav-link.router-link-active { color: #e8b89a; background: rgba(232,184,154,0.1); }

/* Actions */
.admin-nav-actions { flex-shrink: 0; }

/* Dropdown */
.admin-dropdown { position: relative; }
.admin-btn-account {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: rgba(124, 61, 45, 0.85);
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.45rem 1rem;
  font-size: 0.83rem;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  letter-spacing: 0.03em;
  transition: background 0.2s;
}
.admin-btn-account:hover { background: #7c3d2d; }
.admin-btn-account .caret { font-size: 0.7rem; opacity: 0.75; }

.admin-dropdown-menu {
  display: none;
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #fff;
  border: 1px solid #e8e0d8;
  border-radius: 8px;
  min-width: 200px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  padding: 0.5rem;
  z-index: 200;
}
.admin-dropdown:hover .admin-dropdown-menu,
.admin-dropdown:focus-within .admin-dropdown-menu { display: block; }

.dropdown-section-label {
  font-size: 0.72rem;
  color: #b0a09a;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.4rem 0.75rem 0.1rem;
  margin: 0;
  font-family: 'DM Sans', sans-serif;
}
.dropdown-info { padding: 0 0.25rem; }
.dropdown-admin-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #2c2420;
  padding: 0.1rem 0.75rem 0;
  margin: 0;
  font-family: 'DM Sans', sans-serif;
}
.dropdown-admin-id {
  font-size: 0.78rem;
  color: #9a8a84;
  padding: 0.1rem 0.75rem 0.4rem;
  margin: 0;
  font-family: 'DM Sans', sans-serif;
}
.dropdown-divider {
  height: 1px;
  background: #ede8e3;
  margin: 0.3rem 0.5rem;
}
.admin-dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.55rem 0.75rem;
  font-size: 0.87rem;
  color: #4a3530;
  text-decoration: none;
  border-radius: 5px;
  border: none;
  background: none;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: background 0.15s, color 0.15s;
  text-align: left;
}
.admin-dropdown-item i { font-size: 0.78rem; color: #9a8a84; width: 14px; }
.admin-dropdown-item:hover { background: #f5f1ec; color: #2c2420; }
.admin-dropdown-item--danger { color: #b94a2c; }
.admin-dropdown-item--danger:hover { background: #fff1ee; color: #8c2d12; }
.admin-dropdown-item--danger i { color: #b94a2c; }

/* ── MODAL ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(26, 18, 14, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1.5rem;
}
.modal-box {
  background: #faf8f5;
  border-radius: 8px;
  width: 100%;
  max-width: 440px;
  border: 1px solid #e8e0d8;
}
.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 1.75rem 1.1rem;
  border-bottom: 1px solid #e8e0d8;
}
.modal-tag {
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  color: #7c3d2d;
  font-weight: 500;
  margin: 0 0 0.25rem;
  font-family: 'DM Sans', sans-serif;
}
.modal-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a120e;
  margin: 0;
}
.modal-close {
  background: none;
  border: none;
  color: #9a8a84;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.2s;
}
.modal-close:hover { color: #2c2420; }
.modal-body-content {
  padding: 1.5rem 1.75rem;
}
.modal-desc {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  color: #4a3530;
  line-height: 1.65;
  margin: 0 0 0.75rem;
}
.modal-footer-btns {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.75rem 1.5rem;
  border-top: 1px solid #e8e0d8;
}
.btn-ghost-sm {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: 1.5px solid #c9b5af;
  color: #4a3530;
  border-radius: 4px;
  padding: 0.55rem 1.25rem;
  font-size: 0.85rem;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-ghost-sm:hover { border-color: #7c3d2d; color: #7c3d2d; }
.btn-confirm {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #7c3d2d;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.55rem 1.25rem;
  font-size: 0.85rem;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-confirm:hover { background: #5c2d1f; }

/* ── RESPONSIVE ── */
@media (max-width: 1024px) {
  .admin-nav-links { gap: 0; }
  .admin-nav-link { font-size: 0.75rem; padding: 0.4rem 0.5rem; }
}
@media (max-width: 768px) {
  .admin-nav-links { display: none; }
  .admin-nav-inner { padding: 0.85rem 1rem; }
}
</style>