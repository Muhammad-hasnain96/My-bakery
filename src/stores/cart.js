import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref(JSON.parse(localStorage.getItem('cart') || '[]'))
  const isCartOpen = ref(false)

  // ─── Computed ─────────────────────────────────────────────────────────────
  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  const deliveryFee = computed(() => (subtotal.value >= 1500 ? 0 : 150))

  const total = computed(() => subtotal.value + deliveryFee.value)

  // ─── Actions ──────────────────────────────────────────────────────────────
  function addItem(product, qty = 1) {
    const existing = items.value.find(i => i.id === product.id)
    if (existing) {
      existing.quantity += qty
    } else {
      items.value.push({ ...product, quantity: qty })
    }
    saveCart()
  }

  function removeItem(productId) {
    items.value = items.value.filter(i => i.id !== productId)
    saveCart()
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    const item = items.value.find(i => i.id === productId)
    if (item) {
      item.quantity = quantity
      saveCart()
    }
  }

  function clearCart() {
    items.value = []
    saveCart()
  }

  function toggleCart() {
    isCartOpen.value = !isCartOpen.value
  }

  function openCart() {
    isCartOpen.value = true
  }

  function closeCart() {
    isCartOpen.value = false
  }

  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  return {
    items,
    isCartOpen,
    totalItems,
    subtotal,
    deliveryFee,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
  }
})

