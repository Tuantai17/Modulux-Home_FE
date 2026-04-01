<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_rgba(241,245,249,0.92)_38%,_rgba(226,232,240,0.86)_100%)] text-slate-900">
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-sm lg:hidden"
      @click="sidebarOpen = false"
    ></div>

    <aside
      class="fixed inset-y-0 left-0 z-40 flex w-[min(18.5rem,86vw)] flex-col border-r border-white/10 bg-linear-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.9)] transition-transform duration-200 lg:w-72 lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex h-20 items-center justify-between border-b border-white/10 px-6">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.34em] text-emerald-300/80">Admin</p>
          <h1 class="mt-2 text-xl font-semibold tracking-[0.04em] text-white">Modulux</h1>
        </div>
        <button
          type="button"
          class="rounded-xl border border-white/10 p-2 text-slate-400 transition hover:border-white/20 hover:text-white lg:hidden"
          @click="sidebarOpen = false"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="m6 6 12 12M18 6 6 18" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <div class="px-4 py-5">
        <div class="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm">
          <p class="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">Signed in</p>
          <p class="mt-3 text-sm font-semibold text-white">{{ currentUsername }}</p>
          <p class="mt-1 text-xs text-slate-400">Administrator</p>
        </div>
      </div>

      <nav class="flex-1 space-y-1.5 overflow-y-auto px-4 pb-4">
        <router-link
          v-for="item in navigationItems"
          :key="item.to"
          :to="item.to"
          class="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-white/6 hover:text-white"
          active-class="bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(52,211,153,0.25)]"
          @click="sidebarOpen = false"
        >
          <svg
            class="h-5 w-5 shrink-0 text-slate-500 transition group-hover:text-emerald-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path :d="item.icon" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="border-t border-white/10 p-4">
        <button
          type="button"
          class="flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-rose-300/30 hover:bg-rose-500/10 hover:text-white"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </aside>

    <div class="lg:pl-72">
      <header class="sticky top-0 z-20 border-b border-white/60 bg-white/78 backdrop-blur-xl">
        <div class="flex min-h-20 items-center justify-between gap-4 px-3 py-4 sm:px-6 lg:px-10">
          <div class="flex min-w-0 items-start gap-3 sm:items-center">
            <button
              type="button"
              class="rounded-2xl border border-slate-200 bg-white/80 p-2 text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-white lg:hidden"
              @click="sidebarOpen = true"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round" />
              </svg>
            </button>

            <div class="min-w-0">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Admin Panel</p>
              <h2 class="mt-2 break-words text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">{{ currentTitle }}</h2>
            </div>
          </div>
        </div>
      </header>

      <main class="px-3 py-5 sm:px-6 lg:px-10 lg:py-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const sidebarOpen = ref(false)

const navigationItems = [
  { to: '/admin', label: 'Dashboard', icon: 'M4 12.5 12 4l8 8.5M6.5 10.5V20h11V10.5' },
  { to: '/admin/navigation', label: 'Navigation', icon: 'M4 7h16M4 12h10M4 17h16' },
  { to: '/admin/pages', label: 'Pages', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6' },
  { to: '/admin/projects', label: 'Projects', icon: 'M4 7h16v10H4zM9 7V4h6v3' },
  { to: '/admin/blogs', label: 'Blogs', icon: 'M6 5.5h9A2.5 2.5 0 0 1 17.5 8v10.5H8.5A2.5 2.5 0 0 0 6 21V5.5Zm0 0A2.5 2.5 0 0 0 3.5 8v10.5' },
  { to: '/admin/videos', label: 'FQAs & Video', icon: 'M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z' },
  { to: '/admin/partners', label: 'Partners', icon: 'M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
  { to: '/admin/contacts', label: 'Enquiries', icon: 'M4 6.5h16v11H4zM4 8l8 5 8-5' },
  { to: '/admin/subscribers', label: 'Subscribers', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
  { to: '/admin/settings', label: 'Site Settings', icon: 'M10.5 4.5h3l.5 2.2a6.8 6.8 0 0 1 1.7.99l2.08-.83 1.5 2.6-1.6 1.56a6.79 6.79 0 0 1 0 1.96l1.6 1.56-1.5 2.6-2.08-.83a6.8 6.8 0 0 1-1.7.99l-.5 2.2h-3l-.5-2.2a6.8 6.8 0 0 1-1.7-.99l-2.08.83-1.5-2.6 1.6-1.56a6.79 6.79 0 0 1 0-1.96L4.72 9.46l1.5-2.6 2.08.83a6.8 6.8 0 0 1 1.7-.99l.5-2.2ZM12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z' },
]

const currentTitle = computed(() => route.meta?.title || route.name || 'Admin')
const currentUsername = computed(() => authStore.user?.username || 'admin')

function logout() {
  authStore.logout()
  router.push('/admin/login')
}

onMounted(() => {
  if (authStore.token && !authStore.user) {
    authStore.fetchUser()
  }
})
</script>
