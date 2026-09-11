<template>
  <div class="min-h-screen">
    <!-- Page Header with Active Branch Badge -->
    <div class="bg-[#0A0A0A] border-b border-[#1E1E1E] py-8">
      <div class="container mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p class="text-primary text-xs uppercase tracking-widest font-semibold mb-1">Explore</p>
          <h1 class="font-playfair text-3xl md:text-4xl font-bold text-white">Our Menu</h1>
          <div class="gold-line mt-2"></div>
        </div>

        <!-- Branch Indicator & Switcher -->
        <div class="bg-dark-card border border-[#2E2E2E] rounded-2xl p-3.5 flex items-center justify-between sm:justify-start gap-4 shadow-lg">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-xl flex-shrink-0">
              🏪
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] uppercase font-bold text-primary tracking-wider">Serving From</span>
                <span v-if="locationStore.detectedDistance !== null" class="badge badge-green text-[9px]">
                  {{ locationStore.detectedDistance }} km away
                </span>
              </div>
              <p class="text-sm font-bold text-white">
                {{ locationStore.selectedBranch?.name || 'All Branches' }}
              </p>
            </div>
          </div>
          <button
            @click="openLocationPicker"
            class="text-xs text-primary hover:text-primary-light font-semibold border border-primary/30 hover:border-primary px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
          >
            Change
          </button>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="flex gap-8">
        <!-- ── Sidebar (desktop) ─────────────────────────────────────────── -->
        <aside class="hidden lg:block w-56 flex-shrink-0 sticky top-24 self-start">
          <div class="bg-dark-card border border-dark-border rounded-2xl p-4">
            <h3 class="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
              </svg>
              Filter
            </h3>
            <div class="space-y-1">
              <button
                v-for="cat in allCategories"
                :key="cat.id"
                @click="activeCategory = cat.id"
                class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
                :class="activeCategory === cat.id
                  ? 'bg-primary/15 text-primary font-semibold border border-primary/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'"
              >
                <span>{{ cat.icon }}</span>
                <span class="flex-1 text-left">{{ cat.name }}</span>
                <span class="text-xs opacity-60">{{ categoryCount(cat.id) }}</span>
              </button>
            </div>

            <!-- Sort -->
            <div class="mt-5 pt-4 border-t border-dark-border">
              <p class="text-xs text-gray-500 uppercase tracking-wide mb-2">Sort by</p>
              <select
                v-model="sortBy"
                class="w-full bg-dark-hover border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </aside>

        <!-- ── Main Content ──────────────────────────────────────────────── -->
        <div class="flex-1 min-w-0">
          <!-- Mobile Category Tabs -->
          <div class="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-6 lg:hidden -mx-4 px-4">
            <button
              v-for="cat in allCategories"
              :key="cat.id"
              @click="activeCategory = cat.id"
              class="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap"
              :class="activeCategory === cat.id
                ? 'bg-primary text-[#0D0D0D] font-semibold'
                : 'bg-dark-card border border-dark-border text-gray-400 hover:border-primary/40 hover:text-primary'"
            >
              <span>{{ cat.icon }}</span>
              {{ cat.name }}
            </button>
          </div>

          <!-- Search Bar -->
          <div class="relative mb-6">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search menu..."
              class="input-dark pl-11"
            />
          </div>

          <!-- Active Filters -->
          <div v-if="activeCategory !== 'all' || searchQuery" class="flex items-center gap-2 mb-5 flex-wrap">
            <span class="text-xs text-gray-500">Filters:</span>
            <span v-if="activeCategory !== 'all'" class="flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary text-xs px-3 py-1.5 rounded-full font-medium">
              {{ allCategories.find(c => c.id === activeCategory)?.name }}
              <button @click="activeCategory = 'all'" class="hover:text-white">✕</button>
            </span>
            <span v-if="searchQuery" class="flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary text-xs px-3 py-1.5 rounded-full font-medium">
              "{{ searchQuery }}"
              <button @click="searchQuery = ''" class="hover:text-white">✕</button>
            </span>
          </div>

          <!-- Empty State -->
          <div v-if="filteredProducts.length === 0" class="text-center py-20">
            <span class="text-5xl">🔍</span>
            <h3 class="font-playfair text-xl font-bold text-white mt-4 mb-2">No items found</h3>
            <p class="text-gray-400 mb-6">Try adjusting your filters or search query</p>
            <button
              @click="activeCategory = 'all'; searchQuery = ''"
              class="btn-outline"
            >Clear Filters</button>
          </div>

          <!-- Product Grid -->
          <div v-else class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            <ProductCard
              v-for="product in filteredProducts"
              :key="product.id"
              :product="product"
              @added="onAdded"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import { categories } from '@/data/products'
import { useCartStore } from '@/stores/cart'
import { useLocationStore } from '@/stores/location'

const cartStore = useCartStore()
const locationStore = useLocationStore()

const activeCategory = ref('all')
const searchQuery    = ref('')
const sortBy         = ref('default')

const allCategories = categories

function categoryCount(catId) {
  if (catId === 'all') return locationStore.branchProducts.length
  return locationStore.branchProducts.filter(p => p.category === catId).length
}

const filteredProducts = computed(() => {
  // Filter products by currently selected branch's inventory
  let list = locationStore.branchProducts.slice()

  // Category filter
  if (activeCategory.value !== 'all') {
    list = list.filter(p => p.category === activeCategory.value)
  }

  // Search filter
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    )
  }

  // Sort
  if (sortBy.value === 'price-asc')  list = [...list].sort((a, b) => a.price - b.price)
  if (sortBy.value === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
  if (sortBy.value === 'rating')     list = [...list].sort((a, b) => b.rating - a.rating)
  if (sortBy.value === 'popular')    list = [...list].sort((a, b) => b.reviews - a.reviews)

  return list
})

function onAdded(product) {
  cartStore.openCart()
}

function openLocationPicker() {
  window.dispatchEvent(new CustomEvent('open-location-modal'))
}
</script>

