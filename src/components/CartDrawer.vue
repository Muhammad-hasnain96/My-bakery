<template>
  <!-- Backdrop -->
  <Transition name="fade">
    <div
      v-if="cartStore.isCartOpen"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
      @click="cartStore.closeCart()"
    ></div>
  </Transition>

  <!-- Drawer -->
  <Transition name="slide-right">
    <div
      v-if="cartStore.isCartOpen"
      class="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#1A1A1A] border-l border-[#2A2A2A] z-50 flex flex-col shadow-2xl"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-[#2A2A2A] flex-shrink-0">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
          <h2 class="font-playfair text-lg font-bold text-white">Your Cart</h2>
          <span v-if="cartStore.totalItems > 0"
            class="bg-primary text-[#0D0D0D] text-xs font-bold px-2 py-0.5 rounded-full">
            {{ cartStore.totalItems }}
          </span>
        </div>
        <button
          @click="cartStore.closeCart()"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Cart Items -->
      <div class="flex-1 overflow-y-auto py-4 px-5 space-y-3">
        <!-- Empty State -->
        <div v-if="cartStore.items.length === 0" class="flex flex-col items-center justify-center h-full text-center py-16">
          <span class="text-6xl mb-4">🛒</span>
          <h3 class="font-playfair text-xl font-bold text-white mb-2">Your cart is empty</h3>
          <p class="text-gray-400 text-sm mb-6">Looks like you haven't added anything yet!</p>
          <button
            @click="cartStore.closeCart(); $router.push('/menu')"
            class="bg-primary text-[#0D0D0D] font-semibold px-6 py-3 rounded-xl hover:bg-primary-light transition-colors"
          >
            Browse Menu
          </button>
        </div>

        <!-- Items List -->
        <TransitionGroup name="slide-up" tag="div" class="space-y-3">
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="flex gap-3 bg-[#242424] rounded-xl p-3 border border-[#2E2E2E] group"
          >
            <!-- Image -->
            <img
              :src="item.image"
              :alt="item.name"
              class="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
            <!-- Details -->
            <div class="flex-1 min-w-0">
              <h4 class="text-white text-sm font-semibold truncate">{{ item.name }}</h4>
              <p class="text-primary text-sm font-bold mt-0.5">Rs. {{ (item.price * item.quantity).toLocaleString() }}</p>
              <p class="text-gray-500 text-xs">Rs. {{ item.price.toLocaleString() }} each</p>
              <!-- Qty Controls -->
              <div class="flex items-center gap-2 mt-2">
                <button
                  @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                  class="w-6 h-6 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-gray-300 hover:text-primary hover:border-primary/40 transition-all text-sm font-bold"
                >−</button>
                <span class="text-white text-sm font-semibold w-6 text-center">{{ item.quantity }}</span>
                <button
                  @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                  class="w-6 h-6 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-gray-300 hover:text-primary hover:border-primary/40 transition-all text-sm font-bold"
                >+</button>
              </div>
            </div>
            <!-- Remove -->
            <button
              @click="cartStore.removeItem(item.id)"
              class="self-start w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </TransitionGroup>
      </div>

      <!-- Footer -->
      <div v-if="cartStore.items.length > 0" class="border-t border-[#2A2A2A] p-5 flex-shrink-0 space-y-3">
        <!-- Delivery note -->
        <div v-if="cartStore.deliveryFee > 0" class="flex items-center gap-2 text-xs text-amber-400 bg-amber-400/10 rounded-lg px-3 py-2">
          <span>⚡</span>
          Add Rs. {{ (1500 - cartStore.subtotal).toLocaleString() }} more for free delivery!
        </div>
        <div v-else class="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-400/10 rounded-lg px-3 py-2">
          <span>✅</span>
          You've unlocked FREE delivery!
        </div>

        <!-- Totals -->
        <div class="space-y-2 text-sm">
          <div class="flex justify-between text-gray-400">
            <span>Subtotal</span>
            <span>Rs. {{ cartStore.subtotal.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-gray-400">
            <span>Delivery Fee</span>
            <span :class="cartStore.deliveryFee === 0 ? 'text-emerald-400 line-through' : ''">
              {{ cartStore.deliveryFee === 0 ? 'Free' : `Rs. ${cartStore.deliveryFee}` }}
            </span>
          </div>
          <div class="flex justify-between text-white font-bold text-base border-t border-[#2A2A2A] pt-2">
            <span>Total</span>
            <span class="text-primary">Rs. {{ cartStore.total.toLocaleString() }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <button
            @click="cartStore.clearCart()"
            class="flex-1 py-3 rounded-xl border border-[#2A2A2A] text-gray-400 hover:text-red-400 hover:border-red-500/30 text-sm font-medium transition-all"
          >
            Clear
          </button>
          <RouterLink
            to="/cart"
            @click="cartStore.closeCart()"
            class="flex-[2] py-3 rounded-xl bg-primary text-[#0D0D0D] font-bold text-sm text-center hover:bg-primary-light transition-colors"
          >
            Checkout → Rs. {{ cartStore.total.toLocaleString() }}
          </RouterLink>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const $router = useRouter()
</script>

