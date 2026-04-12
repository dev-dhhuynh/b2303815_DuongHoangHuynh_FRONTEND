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

body {
  font-family: var(--font-sans);
  background-color: var(--color-bg);
  color: var(--color-text);
  margin: 0;
  padding: 0;
}

.main-content {
  min-height: calc(100vh - 56px);
}
</style>