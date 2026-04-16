<template>
  <div id="app">
    <UserNavbar v-if="!$route.path.startsWith('/admin')" />
    <AdminNavbar v-else />
    <main class="main-content">
      <router-view />
    </main>
    <AiChatbox v-if="!$route.path.startsWith('/admin')" />
  </div>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "./stores/userStore";
import { useAdminStore } from "./stores/adminStore";
import UserNavbar from "./components/UserNavbar.vue";
import AdminNavbar from "./components/AdminNavbar.vue";
import AiChatbox from "./components/AiChatbox.vue";

const route = useRoute();
const userStore = useUserStore();
const adminStore = useAdminStore();

watch(
  () => route.path,
  () => {
    userStore.initialize();
    adminStore.initialize();
  }
);

onMounted(() => {
  userStore.initialize();
  adminStore.initialize();
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

:root {
  --color-brand:       #7c3d2d;
  --color-brand-dark:  #5c2d1f;
  --color-bg:          #faf8f5;
  --color-bg-alt:      #f0ebe4;
  --color-text:        #2c2420;
  --color-text-muted:  #6b5c55;
  --color-text-hint:   #9a8a84;
  --color-border:      #e8e0d8;
  --font-serif:        'Playfair Display', serif;
  --font-sans:         'DM Sans', sans-serif;
}

*, *::before, *::after {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

body {
  font-family: var(--font-sans);
  background-color: var(--color-bg);
  color: var(--color-text);
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  width: 100%;
}

/* ── Chuẩn hóa kích thước cho TẤT CẢ trang admin ── */
/* Áp dụng cho page-container, page-wrap, và cả Bootstrap container bên trong pending-page */
.page-container,
.page-wrap,
.pending-page > .container,
.pending-page > .page-container {
  max-width: 1280px !important;
  width: 100% !important;
  margin-left: auto !important;
  margin-right: auto !important;
  padding: 2rem !important;
  box-sizing: border-box !important;
}

/* Reset Bootstrap py-5 trên AdminPending */
.pending-page > .container.py-5,
.pending-page > .page-container.py-5 {
  padding-top: 2rem !important;
  padding-bottom: 2rem !important;
}

@media (max-width: 1024px) {
  .page-container,
  .page-wrap,
  .pending-page > .container,
  .pending-page > .page-container {
    padding: 1.5rem !important;
  }
}

@media (max-width: 640px) {
  .page-container,
  .page-wrap,
  .pending-page > .container,
  .pending-page > .page-container {
    padding: 1rem !important;
  }
}
</style>