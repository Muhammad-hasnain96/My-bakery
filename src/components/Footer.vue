<template>
  <footer class="bg-[#0A0A0A] border-t border-[#1E1E1E]">
    <!-- Newsletter Strip -->
    <div class="bg-primary/10 border-b border-primary/20 py-6">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 class="font-playfair text-lg font-bold text-white">Get Exclusive Deals & Updates 🎉</h3>
            <p class="text-sm text-gray-400 mt-0.5">Subscribe to our newsletter for offers and new arrivals.</p>
          </div>
          <form @submit.prevent="subscribeNewsletter" class="flex gap-2 w-full md:w-auto">
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              class="flex-1 md:w-64 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
            />
            <button
              type="submit"
              class="bg-primary text-[#0D0D0D] font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-light transition-colors text-sm flex-shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Main Footer Content -->
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        <!-- Brand Column -->
        <div class="sm:col-span-2 lg:col-span-1">
          <RouterLink to="/" class="flex items-center gap-2 mb-4">
            <span class="text-3xl">🎂</span>
            <span class="font-playfair text-2xl font-bold text-primary">My Bakery</span>
          </RouterLink>
          <p class="text-gray-400 text-sm leading-relaxed mb-5">
            Premium cakes, pastries & desserts crafted with love and delivered fresh to your doorstep across Pakistan.
          </p>
          <!-- Social Links -->
          <div class="flex gap-3">
            <a v-for="social in socials" :key="social.name"
              :href="social.url" target="_blank" rel="noopener"
              class="w-9 h-9 rounded-xl flex items-center justify-center border border-[#2A2A2A] text-gray-400 hover:text-primary hover:border-primary/50 transition-all"
              :title="social.name"
            >
              <span class="text-base">{{ social.icon }}</span>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="font-semibold text-white mb-4 flex items-center gap-2">
            <span class="w-1 h-4 bg-primary rounded-full"></span>
            Quick Links
          </h4>
          <ul class="space-y-2.5">
            <li v-for="link in quickLinks" :key="link.path">
              <RouterLink
                :to="link.path"
                class="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-2"
              >
                <svg class="w-3 h-3 text-primary/60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
                {{ link.name }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Categories -->
        <div>
          <h4 class="font-semibold text-white mb-4 flex items-center gap-2">
            <span class="w-1 h-4 bg-primary rounded-full"></span>
            Our Menu
          </h4>
          <ul class="space-y-2.5">
            <li v-for="cat in menuCategories" :key="cat">
              <RouterLink
                to="/menu"
                class="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-2"
              >
                <svg class="w-3 h-3 text-primary/60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
                {{ cat }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h4 class="font-semibold text-white mb-4 flex items-center gap-2">
            <span class="w-1 h-4 bg-primary rounded-full"></span>
            Contact Us
          </h4>
          <ul class="space-y-3">
            <li v-for="info in contactInfo" :key="info.label" class="flex items-start gap-3">
              <span class="text-lg flex-shrink-0 mt-0.5">{{ info.icon }}</span>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide mb-0.5">{{ info.label }}</p>
                <p class="text-sm text-gray-300">{{ info.value }}</p>
              </div>
            </li>
          </ul>
          <!-- App Badges -->
          <div class="mt-5 space-y-2">
            <p class="text-xs text-gray-500 uppercase tracking-wide">Download App</p>
            <div class="flex gap-2 flex-wrap">
              <a href="#" class="flex items-center gap-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2 hover:border-primary/40 transition-all group">
                <span class="text-lg">🍎</span>
                <div>
                  <p class="text-[10px] text-gray-500">Download on</p>
                  <p class="text-xs font-semibold text-white">App Store</p>
                </div>
              </a>
              <a href="#" class="flex items-center gap-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2 hover:border-primary/40 transition-all group">
                <span class="text-lg">🤖</span>
                <div>
                  <p class="text-[10px] text-gray-500">Get it on</p>
                  <p class="text-xs font-semibold text-white">Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-[#1E1E1E] py-5">
      <div class="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <p>© {{ currentYear }} My Bakery. All rights reserved.</p>
        <div class="flex gap-4">
          <a href="#" class="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" class="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" class="hover:text-primary transition-colors">Refund Policy</a>
        </div>
        <p class="flex items-center gap-1">Made with <span class="text-red-500">❤️</span> in Pakistan</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed } from 'vue'

const email = ref('')
const currentYear = computed(() => new Date().getFullYear())

function subscribeNewsletter() {
  if (email.value) {
    alert(`✅ Thank you for subscribing! We'll send updates to ${email.value}`)
    email.value = ''
  }
}

const socials = [
  { name: 'Facebook',  icon: 'f', url: 'https://facebook.com' },
  { name: 'Instagram', icon: '📸', url: 'https://instagram.com' },
  { name: 'Twitter',   icon: '𝕏', url: 'https://twitter.com' },
  { name: 'TikTok',    icon: '🎵', url: 'https://tiktok.com' },
]

const quickLinks = [
  { name: 'Home',           path: '/' },
  { name: 'Menu',           path: '/menu' },
  { name: 'Deals',          path: '/deals' },
  { name: 'About Us',       path: '/about' },
  { name: 'Contact',        path: '/contact' },
  { name: 'Kitchen Admin',  path: '/admin' },
]

const menuCategories = [
  'Cakes', 'Pastries', 'Desserts', 'Beverages', 'Custom Orders',
]

const contactInfo = [
  { icon: '📞', label: 'Phone',   value: '0300-1234567' },
  { icon: '✉️', label: 'Email',   value: 'hello@mybakery.pk' },
  { icon: '📍', label: 'Address', value: 'Lahore, Karachi, Islamabad' },
  { icon: '⏰', label: 'Hours',   value: 'Daily 8 AM – 12 AM' },
]
</script>

