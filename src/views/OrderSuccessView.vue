<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-16">
    <div class="w-full max-w-xl text-center">
      <!-- Success Icon -->
      <div class="relative w-24 h-24 mx-auto mb-6">
        <div class="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center animate-pulse">
          <svg class="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <span class="absolute -top-1 -right-1 text-3xl animate-bounce">🎉</span>
      </div>

      <h1 class="font-playfair text-3xl md:text-4xl font-bold text-white mb-2">Order Confirmed!</h1>
      <p class="text-gray-400 text-sm md:text-base mb-4">
        Thank you <strong class="text-white">{{ lastOrder?.customer?.name || 'Customer' }}</strong>! Your fresh bakery order has been placed.
      </p>

      <!-- Order Number & Placed Time -->
      <div class="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-5 py-2 mb-6">
        <span class="text-xs text-gray-400">Order Code:</span>
        <span class="font-bold text-primary text-sm tracking-wider">MBK-{{ lastOrder?.orderNumber || orderNumber }}</span>
        <span class="text-gray-600">|</span>
        <span class="text-xs text-gray-400">{{ lastOrder?.date || 'Just now' }}</span>
      </div>

      <!-- Fulfilling Branch & Delivery Destination Card -->
      <div class="bg-dark-card border border-dark-border rounded-2xl p-5 text-left mb-6 shadow-xl space-y-3.5">
        <div class="flex items-center justify-between pb-3 border-b border-dark-border">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl">🏪</span>
            <div>
              <span class="text-[10px] uppercase font-bold text-primary tracking-wider block">Fulfilling Kitchen</span>
              <p class="text-sm font-bold text-white">{{ lastOrder?.fulfillingBranch?.name || 'Nearest Branch' }}</p>
              <p class="text-xs text-gray-400">{{ lastOrder?.fulfillingBranch?.address }}</p>
            </div>
          </div>
          <span v-if="lastOrder?.distanceKm !== null && lastOrder?.distanceKm !== undefined" class="badge badge-green text-[10px]">
            {{ lastOrder?.distanceKm }} km away
          </span>
        </div>

        <div class="flex items-start gap-2.5">
          <span class="text-xl text-primary mt-0.5">📍</span>
          <div class="flex-1 min-w-0">
            <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Delivering To</span>
            <p class="text-xs md:text-sm text-white font-medium break-words">
              {{ lastOrder?.customer?.address || 'Your Selected Location' }}
            </p>
            <p class="text-xs text-gray-400 mt-0.5">Phone: {{ lastOrder?.customer?.phone }}</p>
          </div>
        </div>
      </div>

      <!-- Live Order Progress Tracker -->
      <div class="bg-dark-card border border-dark-border rounded-2xl p-5 text-left space-y-3.5 mb-6 shadow-xl">
        <div class="flex items-center justify-between border-b border-dark-border pb-2.5">
          <h3 class="font-semibold text-white text-sm">Live Kitchen Tracker</h3>
          <span class="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live
          </span>
        </div>
        <div v-for="step in orderSteps" :key="step.label" class="flex items-center gap-3">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            :class="step.done ? 'bg-emerald-500/20 text-emerald-400' : 'bg-dark-hover text-gray-500'"
          >
            {{ step.icon }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs md:text-sm font-semibold" :class="step.done ? 'text-white' : 'text-gray-500'">{{ step.label }}</p>
            <p class="text-[11px] text-gray-400">{{ step.time }}</p>
          </div>
          <span v-if="step.done" class="badge badge-green text-[9px]">Completed</span>
          <span v-else class="text-[10px] text-amber-400 font-medium">In Progress</span>
        </div>
      </div>

      <!-- ETA Card -->
      <div class="bg-amber-400/10 border border-amber-400/20 rounded-xl px-5 py-3.5 mb-6 text-xs md:text-sm text-amber-300 flex items-center justify-center gap-2">
        <span class="text-lg">⏱</span>
        <span>Estimated Delivery Time: <strong>45–60 minutes</strong></span>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-3 mb-6">
        <RouterLink to="/" class="flex-1 bg-primary text-[#0D0D0D] font-bold py-3.5 rounded-xl hover:bg-primary-light transition-colors text-center text-sm">
          🏠 Back to Home
        </RouterLink>
        <RouterLink to="/menu" class="flex-1 border border-primary text-primary font-bold py-3.5 rounded-xl hover:bg-primary hover:text-[#0D0D0D] transition-colors text-center text-sm">
          🍰 Order More from This Branch
        </RouterLink>
      </div>

      <p class="text-gray-500 text-xs">
        Need assistance? Call our nearest bakery branch at
        <strong class="text-gray-300">{{ lastOrder?.fulfillingBranch?.phone || '0300-1234567' }}</strong> 🎂
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const orderNumber = ref(Math.floor(100000 + Math.random() * 900000))
const lastOrder = ref(null)

onMounted(() => {
  const saved = localStorage.getItem('lastOrder')
  if (saved) {
    try {
      lastOrder.value = JSON.parse(saved)
    } catch (e) {
      console.error(e)
    }
  }
})

const orderSteps = [
  { icon: '✓', label: 'Order Confirmed',   time: 'Received by kitchen',   done: true },
  { icon: '👨‍🍳', label: 'Baking & Packing',  time: 'In oven & prep',       done: true },
  { icon: '🚀', label: 'Out for Delivery',  time: 'Rider on route',       done: false },
  { icon: '🏠', label: 'Delivered',          time: 'Est. in 45-60 mins',   done: false },
]
</script>
