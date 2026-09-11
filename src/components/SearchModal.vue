<template>
  <!-- Backdrop -->
  <Transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center pt-16 px-4"
      @click.self="$emit('update:modelValue', false)"
    >
      <Transition name="slide-down">
        <div v-if="modelValue" class="w-full max-w-xl">
          <!-- Search Input -->
          <div class="relative">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              ref="searchInput"
              v-model="query"
              @keydown.escape="$emit('update:modelValue', false)"
              type="text"
              placeholder="Search cakes, pastries, desserts..."
              class="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-lg shadow-2xl transition-colors"
              autofocus
            />
            <button
              v-if="query"
              @click="query = ''"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Results -->
          <div v-if="query.length >= 2" class="mt-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden shadow-2xl max-h-96 overflow-y-auto">
            <div v-if="results.length === 0" class="p-6 text-center text-gray-400">
              <span class="text-3xl">🔍</span>
              <p class="mt-2 text-sm">No results for "<span class="text-white">{{ query }}</span>"</p>
            </div>
            <div v-else>
              <p class="px-4 pt-3 pb-1 text-xs text-gray-500 uppercase tracking-wide">{{ results.length }} results</p>
              <RouterLink
                v-for="product in results"
                :key="product.id"
                to="/menu"
                @click="selectProduct(product)"
                class="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-[#2A2A2A] last:border-0"
              >
                <img :src="product.image" :alt="product.name" class="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-white font-medium truncate">{{ product.name }}</p>
                  <p class="text-xs text-gray-400 capitalize">{{ product.category }}</p>
                </div>
                <span class="text-primary font-semibold text-sm flex-shrink-0">Rs. {{ product.price.toLocaleString() }}</span>
              </RouterLink>
            </div>
          </div>

          <!-- Quick Suggestions -->
          <div v-if="!query" class="mt-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 shadow-2xl">
            <p class="text-xs text-gray-500 uppercase tracking-wide mb-3">Popular Searches</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in popularSearches"
                :key="tag"
                @click="query = tag"
                class="text-xs px-3 py-1.5 rounded-full border border-[#2A2A2A] text-gray-400 hover:border-primary/40 hover:text-primary transition-all"
              >
                {{ tag }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { products } from '@/data/products'

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue'])

const query = ref('')
const searchInput = ref(null)

const results = computed(() => {
  if (query.value.length < 2) return []
  const q = query.value.toLowerCase()
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  ).slice(0, 8)
})

const popularSearches = ['Chocolate Cake', 'Red Velvet', 'Croissant', 'Tiramisu', 'Cheesecake', 'Macarons', 'Latte']

watch(() => props.modelValue, async (val) => {
  if (val) {
    await nextTick()
    searchInput.value?.focus()
    query.value = ''
  }
})

function selectProduct(product) {
  emit('update:modelValue', false)
  query.value = ''
}
</script>

