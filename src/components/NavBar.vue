<template>
  <!-- Announcement Bar -->
  <div class="bg-[#1A1A1A] border-b border-[#2A2A2A] py-2 text-center text-xs sm:text-sm text-gray-400">
    <div class="container mx-auto px-4 flex items-center justify-center gap-4 flex-wrap">
      <span>🎂 Free delivery on orders above <span class="text-primary font-semibold">Rs. 1,500</span></span>
      <span class="hidden sm:inline text-dark-border">|</span>
      <span class="hidden sm:inline">⏰ Open 8 AM – 12 AM Daily</span>
      <span class="hidden sm:inline text-dark-border">|</span>
      <span class="hidden md:inline">📞 0300-1234567</span>
    </div>
  </div>

  <!-- Main Navbar -->
  <nav class="sticky top-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-md border-b border-[#2A2A2A]">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16 gap-4">

        <!-- Logo -->
        <RouterLink to="/" class="flex-shrink-0 flex items-center gap-2 group">
          <span class="text-2xl">🎂</span>
          <span class="font-playfair text-xl font-bold text-primary group-hover:text-primary-light transition-colors">
            My Bakery
          </span>
        </RouterLink>

        <!-- Desktop Nav Links -->
        <div class="hidden lg:flex items-center gap-1">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            :class="isActive(link.path)
              ? 'text-primary bg-primary/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'"
          >
            {{ link.name }}
          </RouterLink>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center gap-2 sm:gap-3">

          <!-- City / Branch Selector (desktop) -->
          <button
            @click="$emit('openLocation')"
            class="hidden md:flex items-center gap-2 text-xs text-gray-300 hover:text-primary transition-colors border border-[#2A2A2A] hover:border-primary/40 rounded-xl px-3 py-2 bg-dark-card/70"
          >
            <!-- Pin icon -->
            <svg class="w-3.5 h-3.5 text-primary flex-shrink-0 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <div class="text-left leading-tight">
              <span class="block font-medium text-white max-w-[130px] truncate">
                {{ locationStore.selectedBranch ? locationStore.selectedBranch.name.replace('My Bakery — ', '') : (locationStore.selectedCity || 'Select Branch') }}
              </span>
              <span v-if="locationStore.detectedDistance !== null" class="block text-[10px] text-emerald-400">
                {{ locationStore.detectedDistance }} km away
              </span>
            </div>
            <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          <!-- Theme Toggle (Light / Dark) -->
          <button
            @click="themeStore.toggleTheme()"
            class="w-9 h-9 flex items-center justify-center rounded-xl border border-[#2A2A2A] hover:border-primary/40 text-gray-300 hover:text-primary transition-all"
            :title="themeStore.currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          >
            <!-- Sun icon when dark -->
            <svg v-if="themeStore.currentTheme === 'dark'" class="w-4 h-4 text-amber-400 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <!-- Moon icon when light -->
            <svg v-else class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <!-- Search -->
          <button
            @click="$emit('openSearch')"
            class="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-primary hover:bg-white/5 transition-all"
            title="Search"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>

          <!-- Cart -->
          <button
            @click="cartStore.toggleCart()"
            class="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-primary hover:bg-white/5 transition-all"
            title="Cart"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            <Transition name="scale">
              <span
                v-if="cartStore.totalItems > 0"
                class="absolute -top-1 -right-1 bg-primary text-[#0D0D0D] text-[10px] w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center font-bold leading-none px-0.5"
              >
                {{ cartStore.totalItems > 99 ? '99+' : cartStore.totalItems }}
              </span>
            </Transition>
          </button>

          <!-- Login / Profile -->
          <RouterLink
            v-if="!authStore.isLoggedIn"
            to="/login"
            class="hidden sm:flex items-center gap-1.5 bg-primary text-[#0D0D0D] text-sm font-semibold px-4 py-2 rounded-xl hover:bg-primary-light transition-colors"
          >
            Login
          </RouterLink>
          <div v-else class="relative hidden sm:block">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center gap-2 text-sm text-gray-300 hover:text-primary transition-colors border border-transparent hover:border-[#2A2A2A] rounded-xl px-2 py-1"
            >
              <div class="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-semibold text-xs">
                {{ authStore.user?.name?.[0]?.toUpperCase() || 'U' }}
              </div>
              <span class="text-xs text-white font-medium max-w-[90px] truncate hidden md:inline">{{ authStore.user?.name }}</span>
              <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-56 bg-dark-card border border-dark-border rounded-2xl shadow-2xl py-2 z-50 animate-slide-down"
            >
              <div class="px-4 py-3 border-b border-dark-border">
                <p class="text-xs font-bold text-white truncate">{{ authStore.user?.name }}</p>
                <p class="text-[11px] text-gray-400 truncate">{{ authStore.user?.email }}</p>
              </div>
              <div class="py-1">
                <RouterLink
                  to="/cart"
                  @click="showUserMenu = false"
                  class="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <span>🛒</span> My Cart & Checkout
                </RouterLink>
                <RouterLink
                  to="/admin"
                  @click="showUserMenu = false"
                  class="flex items-center justify-between px-4 py-2 text-xs text-primary font-bold hover:bg-white/5 transition-colors"
                >
                  <span class="flex items-center gap-2">
                    <span>{{ authStore.isSuperAdmin ? '👑' : '👨‍🍳' }}</span>
                    <span>Branch CMS & Orders</span>
                  </span>
                  <span class="badge text-[9px] py-0.5 px-1.5" :class="authStore.isSuperAdmin ? 'badge-gold' : 'badge-green'">
                    {{ authStore.isSuperAdmin ? 'Executive' : 'Kitchen' }}
                  </span>
                </RouterLink>
              </div>
              <div class="pt-1 border-t border-dark-border">
                <button
                  @click="authStore.logout(); showUserMenu = false"
                  class="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <span>🚪</span> Logout
                </button>
              </div>
            </div>
          </div>

          <!-- Mobile Menu Toggle -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-primary hover:bg-white/5 transition-all"
          >
            <svg v-if="!mobileMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition name="slide-down">
        <div v-if="mobileMenuOpen" class="lg:hidden border-t border-[#2A2A2A] py-4 space-y-1">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
            :class="isActive(link.path)
              ? 'text-primary bg-primary/10'
              : 'text-gray-400 hover:text-white hover:bg-white/5'"
          >
            <span>{{ link.icon }}</span>
            {{ link.name }}
          </RouterLink>

          <!-- Mobile Branch CMS Link -->
          <RouterLink
            to="/admin"
            @click="mobileMenuOpen = false"
            class="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
          >
            <div class="flex items-center gap-3">
              <span>👨‍🍳</span>
              <span>Branch CMS & Kitchen</span>
            </div>
            <span class="badge badge-gold text-[10px]">Staff Portal</span>
          </RouterLink>

          <!-- Mobile City / Branch Selector -->
          <button
            @click="$emit('openLocation'); mobileMenuOpen = false"
            class="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm text-gray-300 hover:text-primary hover:bg-white/5 transition-all"
          >
            <div class="flex items-center gap-3">
              <span>📍</span>
              <span class="truncate">
                {{ locationStore.selectedBranch ? locationStore.selectedBranch.name : (locationStore.selectedCity || 'Select Branch') }}
              </span>
            </div>
            <span v-if="locationStore.detectedDistance !== null" class="badge badge-green text-[10px]">
              {{ locationStore.detectedDistance }} km
            </span>
          </button>

          <!-- Mobile Theme Toggle -->
          <button
            @click="themeStore.toggleTheme()"
            class="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm text-gray-300 hover:text-primary hover:bg-white/5 transition-all"
          >
            <div class="flex items-center gap-3">
              <span>{{ themeStore.currentTheme === 'dark' ? '☀️' : '🌙' }}</span>
              <span>{{ themeStore.currentTheme === 'dark' ? 'Light Theme' : 'Dark Theme' }}</span>
            </div>
            <span class="text-xs text-primary font-semibold uppercase">{{ themeStore.currentTheme }}</span>
          </button>

          <!-- Mobile Login -->
          <div v-if="!authStore.isLoggedIn" class="pt-2 border-t border-[#2A2A2A]">
            <RouterLink
              to="/login"
              @click="mobileMenuOpen = false"
              class="block w-full text-center bg-primary text-[#0D0D0D] font-semibold py-3 rounded-xl hover:bg-primary-light transition-colors"
            >
              Login / Sign Up
            </RouterLink>
          </div>
          <div v-else class="pt-2 border-t border-[#2A2A2A]">
            <button
              @click="authStore.logout(); mobileMenuOpen = false"
              class="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useLocationStore } from '@/stores/location'
import { useThemeStore } from '@/stores/theme'

defineEmits(['openLocation', 'openSearch'])

const route = useRoute()
const cartStore = useCartStore()
const authStore = useAuthStore()
const locationStore = useLocationStore()
const themeStore = useThemeStore()

const mobileMenuOpen = ref(false)
const showUserMenu = ref(false)

const selectedCity = computed(() => localStorage.getItem('selectedCity') || '')

const navLinks = [
  { name: 'Home',    path: '/',        icon: '🏠' },
  { name: 'Menu',    path: '/menu',    icon: '🍽️' },
  { name: 'Deals',   path: '/deals',   icon: '🔥' },
  { name: 'About',   path: '/about',   icon: 'ℹ️' },
  { name: 'Contact', path: '/contact', icon: '📍' },
]

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

