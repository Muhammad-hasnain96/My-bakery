<template>
  <div
    class="relative bg-dark-card rounded-2xl overflow-hidden border border-[#2A2A2A] hover:border-primary/40 transition-all duration-300 group flex flex-col"
    :class="{ 'opacity-75': !isItemAvailable }"
  >
    <!-- Badge -->
    <div v-if="product.badge && isItemAvailable" class="absolute top-3 left-3 z-10">
      <span :class="product.badgeType || 'badge-gold'" class="badge text-[10px]">
        {{ product.badge }}
      </span>
    </div>

    <!-- Out of Stock Badge -->
    <div v-if="!isItemAvailable" class="absolute top-3 left-3 z-10">
      <span class="badge bg-red-600/90 text-white border border-red-500/50 text-[10px] font-bold shadow-lg">
        Sold Out Today
      </span>
    </div>

    <!-- Discount Badge -->
    <div v-if="product.originalPrice && isItemAvailable" class="absolute top-3 right-3 z-10">
      <span class="badge badge-red text-[10px]">
        -{{ discountPct }}%
      </span>
    </div>

    <!-- Image -->
    <div class="relative overflow-hidden h-48 bg-[#111]">
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        :class="{ 'grayscale-[40%]': !isItemAvailable }"
        loading="lazy"
        @error="imgError"
      />
      <!-- Hover overlay -->
      <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <button
          @click.stop="quickView"
          class="bg-white/90 text-dark-bg text-xs font-semibold px-4 py-2 rounded-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
        >
          Quick View
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 flex flex-col flex-1">
      <!-- Category -->
      <p class="text-[10px] uppercase tracking-widest text-gray-500 mb-1 font-medium">{{ categoryLabel }}</p>

      <!-- Name -->
      <h3 class="font-semibold text-white text-sm leading-snug mb-2 line-clamp-2 flex-1">{{ product.name }}</h3>

      <!-- Rating -->
      <div class="flex items-center gap-1.5 mb-3">
        <div class="flex gap-0.5">
          <span
            v-for="i in 5" :key="i"
            class="text-xs"
            :class="i <= Math.round(product.rating) ? 'text-primary' : 'text-gray-600'"
          >★</span>
        </div>
        <span class="text-xs text-gray-500">{{ product.rating }} ({{ product.reviews }})</span>
      </div>

      <!-- Price Row -->
      <div class="flex items-center justify-between">
        <div class="flex items-baseline gap-2">
          <span class="text-primary font-bold text-lg">Rs. {{ product.price.toLocaleString() }}</span>
          <span v-if="product.originalPrice" class="text-xs text-gray-500 line-through">
            Rs. {{ product.originalPrice.toLocaleString() }}
          </span>
        </div>
      </div>

      <!-- Add to Cart or Sold Out Button -->
      <button
        v-if="isItemAvailable"
        @click="addToCart"
        :disabled="addedToCart"
        class="mt-3 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2"
        :class="addedToCart
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          : 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-[#0D0D0D]'"
      >
        <svg v-if="!addedToCart" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        {{ addedToCart ? 'Added!' : 'Add to Cart' }}
      </button>

      <button
        v-else
        disabled
        class="mt-3 w-full py-2.5 rounded-xl text-xs font-semibold bg-gray-800 text-gray-500 border border-gray-700/50 cursor-not-allowed flex items-center justify-center gap-2"
      >
        <span>🚫</span> Sold Out at Branch
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'

const props = defineProps({
  product: { type: Object, required: true },
  inStock: { type: Boolean, default: true },
})

const isItemAvailable = computed(() => {
  return props.inStock && !props.product.outOfStock && props.product.isAvailable !== false
})

const emit = defineEmits(['quickView', 'added'])

const cartStore = useCartStore()
const addedToCart = ref(false)

const discountPct = computed(() => {
  if (!props.product.originalPrice) return 0
  return Math.round((1 - props.product.price / props.product.originalPrice) * 100)
})

const categoryLabel = computed(() => {
  const map = {
    cakes: 'Cakes',
    pastries: 'Pastries',
    desserts: 'Desserts',
    beverages: 'Beverages',
    custom: 'Custom Orders',
    deals: 'Deals',
  }
  return map[props.product.category] || props.product.category
})

function addToCart() {
  cartStore.addItem(props.product)
  addedToCart.value = true
  emit('added', props.product)
  setTimeout(() => { addedToCart.value = false }, 2000)
}

function quickView() {
  emit('quickView', props.product)
}

function imgError(e) {
  e.target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80'
}
</script>

