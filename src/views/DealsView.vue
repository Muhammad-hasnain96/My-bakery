<template>
  <div class="min-h-screen">
    <!-- Header -->
    <div class="bg-[#0A0A0A] border-b border-[#1E1E1E] py-10">
      <div class="container mx-auto px-4">
        <p class="text-primary text-xs uppercase tracking-widest font-semibold mb-1">Save More</p>
        <h1 class="font-playfair text-4xl font-bold text-white">Today's Deals 🔥</h1>
        <div class="gold-line mt-3"></div>
        <p class="text-gray-400 mt-3">Exclusive limited-time offers — updated daily!</p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12">
      <!-- Promo Banner -->
      <div class="relative rounded-2xl overflow-hidden mb-10 h-48">
        <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1400&q=80" class="w-full h-full object-cover" />
        <div class="absolute inset-0 hero-overlay-horizontal flex items-center px-8">
          <div>
            <p class="text-primary text-xs uppercase tracking-widest font-semibold mb-1">Limited Offer</p>
            <h2 class="font-playfair text-3xl font-bold text-white mb-2">Up to 30% Off Selected Items</h2>
            <p class="text-gray-300 text-sm">Use code <span class="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">SAVE15</span> for extra savings</p>
          </div>
        </div>
      </div>

      <!-- Deals Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        <ProductCard
          v-for="product in dealProducts"
          :key="product.id"
          :product="product"
          @added="() => {}"
        />
      </div>

      <!-- Empty state -->
      <div v-if="dealProducts.length === 0" class="text-center py-20">
        <span class="text-5xl">🔥</span>
        <h3 class="font-playfair text-xl font-bold text-white mt-4 mb-2">No deals right now</h3>
        <p class="text-gray-400">Check back soon for exclusive offers!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import { products } from '@/data/products'

const dealProducts = computed(() =>
  products.filter(p => p.isDeal || p.originalPrice)
)
</script>

