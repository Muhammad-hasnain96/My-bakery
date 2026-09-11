<template>
  <div class="min-h-screen theme-bg-page font-inter transition-colors duration-300">
    <!-- Navbar -->
    <NavBar
      @openLocation="showLocationModal = true"
      @openSearch="showSearchModal = true"
    />

    <!-- Cart Drawer (slides in from right) -->
    <CartDrawer />

    <!-- Location Modal -->
    <LocationModal v-model="showLocationModal" @branchSelected="onBranchSelected" />

    <!-- Search Modal -->
    <SearchModal v-model="showSearchModal" />

    <!-- Toast Notifications -->
    <Toast ref="toast" />

    <!-- Page Content -->
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>

    <!-- Footer -->
    <AppFooter />

    <!-- Scroll to Top -->
    <Transition name="fade">
      <button
        v-if="showScrollTop"
        @click="scrollTop"
        class="fixed bottom-6 left-6 z-30 w-10 h-10 bg-primary text-[#0D0D0D] rounded-xl shadow-lg flex items-center justify-center hover:bg-primary-light transition-all hover:scale-110"
        title="Back to top"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7"/>
        </svg>
      </button>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import NavBar        from '@/components/NavBar.vue'
import AppFooter     from '@/components/Footer.vue'
import CartDrawer    from '@/components/CartDrawer.vue'
import LocationModal from '@/components/LocationModal.vue'
import SearchModal   from '@/components/SearchModal.vue'
import Toast         from '@/components/Toast.vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

const showLocationModal = ref(false)
const showSearchModal   = ref(false)
const showScrollTop     = ref(false)
const toast             = ref(null)

// Show location modal immediately on initial visit to prompt delivery location & nearest branch
onMounted(() => {
  if (!localStorage.getItem('locationConfirmed')) {
    setTimeout(() => { showLocationModal.value = true }, 500)
  }

  window.addEventListener('open-location-modal', () => {
    showLocationModal.value = true
  })

  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('open-location-modal', () => {})
})

function handleScroll() {
  showScrollTop.value = window.scrollY > 400
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function onBranchSelected(payload) {
  showLocationModal.value = false
  if (payload.isAuto && payload.branch) {
    toast.value?.addToast({
      title: 'GPS Auto-Detected 🎯',
      message: `Nearest branch: ${payload.branch.name} (${payload.distanceKm} km away)`,
      type: 'success',
      icon: '📍',
      duration: 4500,
    })
  } else if (payload.city) {
    toast.value?.addToast({
      message: `Showing results for ${payload.city} 📍`,
      type: 'info',
      icon: '📍',
    })
  }
}
</script>

