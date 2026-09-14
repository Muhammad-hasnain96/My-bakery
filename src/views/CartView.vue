<template>
  <div class="min-h-screen">
    <!-- Header -->
    <div class="bg-[#0A0A0A] border-b border-[#1E1E1E] py-10">
      <div class="container mx-auto px-4">
        <p class="text-primary text-xs uppercase tracking-widest font-semibold mb-1">Order</p>
        <h1 class="font-playfair text-4xl font-bold text-white">Your Cart</h1>
        <div class="gold-line mt-3"></div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-10">
      <!-- Empty Cart -->
      <div v-if="cartStore.items.length === 0" class="text-center py-24">
        <span class="text-7xl block mb-4">🛒</span>
        <h2 class="font-playfair text-2xl font-bold text-white mb-2">Your cart is empty</h2>
        <p class="text-gray-400 mb-8">Add some delicious items from our menu!</p>
        <RouterLink to="/menu" class="btn-primary px-8 py-4 rounded-2xl">
          Browse Menu
        </RouterLink>
      </div>

      <!-- Cart Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Cart Items + Checkout Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Items -->
          <div class="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
            <div class="px-5 py-4 border-b border-dark-border flex items-center justify-between">
              <h2 class="font-semibold text-white">
                Cart Items ({{ cartStore.totalItems }})
              </h2>
              <button
                @click="cartStore.clearCart()"
                class="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Clear all
              </button>
            </div>

            <div class="divide-y divide-dark-border">
              <div
                v-for="item in cartStore.items"
                :key="item.id"
                class="flex gap-4 p-4"
              >
                <img :src="item.image" :alt="item.name" class="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <h3 class="text-white font-semibold truncate">{{ item.name }}</h3>
                  <p class="text-gray-500 text-sm capitalize mb-2">{{ item.category }}</p>
                  <div class="flex items-center justify-between">
                    <!-- Qty -->
                    <div class="flex items-center gap-2">
                      <button
                        @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                        class="w-7 h-7 rounded-lg border border-dark-border text-gray-300 hover:text-primary hover:border-primary/40 transition-all flex items-center justify-center font-bold"
                      >−</button>
                      <span class="text-white font-semibold w-6 text-center">{{ item.quantity }}</span>
                      <button
                        @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                        class="w-7 h-7 rounded-lg border border-dark-border text-gray-300 hover:text-primary hover:border-primary/40 transition-all flex items-center justify-center font-bold"
                      >+</button>
                    </div>
                    <span class="text-primary font-bold">Rs. {{ (item.price * item.quantity).toLocaleString() }}</span>
                  </div>
                </div>
                <button
                  @click="cartStore.removeItem(item.id)"
                  class="self-start text-gray-600 hover:text-red-400 transition-colors p-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Checkout Form -->
          <div class="bg-dark-card border border-dark-border rounded-2xl p-5">
            <h2 class="font-semibold text-white mb-5 flex items-center gap-2">
              <span class="w-6 h-6 bg-primary text-[#0D0D0D] rounded-full flex items-center justify-center text-xs font-bold">2</span>
              Delivery Details
            </h2>

            <!-- Authentication Status Banner / Gate -->
            <div v-if="!authStore.isLoggedIn" class="mb-6 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <div class="flex items-center gap-2.5">
                  <span class="text-2xl">🔒</span>
                  <div>
                    <h3 class="font-bold text-white text-base">Login Required to Place Order</h3>
                    <p class="text-xs text-gray-300">You must be logged in to your account before placing your order.</p>
                  </div>
                </div>
                <span class="badge badge-gold text-[10px]">Required Step</span>
              </div>

              <div class="pt-2 flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  @click="openInlineLogin = true"
                  class="px-4 py-2.5 rounded-xl bg-primary text-[#0D0D0D] text-xs font-bold hover:bg-primary-light transition-all flex items-center gap-1.5"
                >
                  <span>🔑</span> Sign In to Order
                </button>
                <RouterLink
                  :to="{ path: '/login', query: { redirect: '/cart', mode: 'signup' } }"
                  class="px-4 py-2.5 rounded-xl border border-primary/40 text-primary text-xs font-semibold hover:border-primary transition-all flex items-center gap-1.5"
                >
                  <span>✨</span> Create New Account
                </RouterLink>
                <button
                  type="button"
                  @click="quickDemoLogin"
                  :disabled="isDemoLoading"
                  class="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all flex items-center gap-1.5"
                >
                  <span v-if="isDemoLoading" class="animate-spin">⏳</span>
                  <span v-else>⚡</span>
                  1-Click Demo (Sara Ahmed)
                </button>
              </div>
            </div>

            <!-- Logged In Customer Badge -->
            <div v-else class="mb-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  ✓
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <p class="text-xs font-bold text-white truncate">Ordering as: {{ authStore.user?.name }}</p>
                    <span class="badge badge-green text-[9px]">Logged In</span>
                  </div>
                  <p class="text-xs text-gray-400 truncate">{{ authStore.user?.email }} · {{ authStore.user?.phone || 'No phone set' }}</p>
                </div>
              </div>
              <button
                type="button"
                @click="authStore.logout()"
                class="text-xs text-gray-400 hover:text-red-400 underline transition-colors flex-shrink-0"
              >
                Switch Account
              </button>
            </div>

            <form @submit.prevent="placeOrder" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Full Name *</label>
                  <input v-model="form.name" type="text" required placeholder="Your name" class="input-dark" />
                </div>
                <div>
                  <label class="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Phone Number *</label>
                  <input v-model="form.phone" type="tel" required placeholder="0300-XXXXXXX" class="input-dark" />
                </div>
              </div>

              <!-- Delivery / Pickup Toggle -->
              <div>
                <label class="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Order Type *</label>
                <div class="flex gap-3">
                  <label
                    v-for="opt in ['Delivery', 'Pickup']"
                    :key="opt"
                    class="flex-1 flex items-center gap-2.5 cursor-pointer p-3 rounded-xl border transition-all"
                    :class="form.orderType === opt
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-dark-border text-gray-400 hover:border-primary/30'"
                  >
                    <input type="radio" :value="opt" v-model="form.orderType" class="sr-only" />
                    <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      :class="form.orderType === opt ? 'border-primary' : 'border-gray-500'">
                      <div v-if="form.orderType === opt" class="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    <span class="text-sm font-medium">{{ opt === 'Delivery' ? '🚀 Delivery' : '🏪 Pickup' }}</span>
                  </label>
                </div>
              </div>

              <!-- Selected Branch / Live GPS Card in Checkout -->
              <div class="bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl p-3.5 space-y-2.5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-primary text-base">🏪</span>
                    <span class="text-xs font-semibold uppercase tracking-wider text-gray-300">Fulfilling Kitchen</span>
                  </div>
                  <button
                    type="button"
                    @click="detectLocationForCart"
                    :disabled="locationStore.isLocating"
                    class="text-[11px] font-semibold text-primary hover:text-primary-light flex items-center gap-1.5 transition-colors"
                  >
                    <svg v-if="!locationStore.isLocating" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    </svg>
                    <span v-else class="animate-spin">⏳</span>
                    {{ locationStore.isLocating ? 'Locating...' : 'Use My Live Location' }}
                  </button>
                </div>

                <div v-if="locationStore.selectedBranch" class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-bold text-white">{{ locationStore.selectedBranch.name }}</p>
                    <p class="text-xs text-gray-400">{{ locationStore.selectedBranch.address }}</p>
                  </div>
                  <span v-if="locationStore.detectedDistance !== null" class="badge badge-green text-[10px] ml-2 flex-shrink-0">
                    {{ locationStore.detectedDistance }} km away
                  </span>
                </div>
                <div v-else>
                  <p class="text-xs text-amber-400">Please select your city or detect location to pick a branch.</p>
                </div>
              </div>

              <!-- City & Branch -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">City *</label>
                  <select v-model="form.city" @change="onCityChange" required class="input-dark">
                    <option value="">Select your city</option>
                    <option v-for="c in cities" :key="c">{{ c }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Branch *</label>
                  <select v-model="form.branchName" @change="onBranchChange" required class="input-dark">
                    <option value="">Select branch</option>
                    <option v-for="b in branchesForSelectedCity" :key="b.name" :value="b.name">
                      {{ b.name }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Address (if delivery) -->
              <div v-if="form.orderType === 'Delivery'">
                <div class="flex items-center justify-between mb-1.5">
                  <label class="block text-xs text-gray-400 uppercase tracking-wide">Delivery Address *</label>
                  <button
                    type="button"
                    @click="fillAddressWithGPS"
                    :disabled="locationStore.isLocating"
                    class="text-[11px] text-primary hover:text-primary-light flex items-center gap-1 font-medium transition-colors cursor-pointer"
                  >
                    <span>📍</span>
                    {{ locationStore.isLocating ? 'Detecting GPS...' : 'Auto-Fill My Exact Location' }}
                  </button>
                </div>
                <textarea
                  v-model="form.address"
                  @blur="handleAddressBlur"
                  required
                  rows="3"
                  placeholder="e.g. House #14, Street 3, Kohinoor City, Faisalabad (or click 'Auto-Fill My Exact Location' above)"
                  class="input-dark resize-none"
                ></textarea>
                <p v-if="form.address && locationStore.userCoordinates" class="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  <span>✓</span> Verified with GPS ({{ locationStore.userCoordinates.lat.toFixed(4) }}°N, {{ locationStore.userCoordinates.lng.toFixed(4) }}°E)
                </p>
              </div>

              <!-- 🛵 10 KM Delivery Zone Status Card -->
              <div
                class="rounded-xl p-3.5 border transition-all text-xs"
                :class="[
                  form.orderType === 'Pickup'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                    : currentDeliveryEligibility.eligible
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-red-500/15 border-red-500/40 text-red-300'
                ]"
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="space-y-1">
                    <div class="flex items-center gap-1.5 font-bold">
                      <span v-if="form.orderType === 'Pickup'">🏪 Store Pickup Selected</span>
                      <span v-else-if="currentDeliveryEligibility.eligible">🟢 Within 10 km Delivery Zone</span>
                      <span v-else>🚫 Delivery Unavailable (Outside 10 km Zone)</span>
                    </div>
                    <p class="text-[11px] opacity-90 leading-relaxed">
                      {{ currentDeliveryEligibility.message }}
                    </p>
                  </div>
                  <span
                    v-if="form.orderType === 'Delivery' && currentDeliveryEligibility.distanceKm !== null"
                    class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex-shrink-0"
                    :class="currentDeliveryEligibility.eligible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/30 text-red-200'"
                  >
                    {{ currentDeliveryEligibility.distanceKm }} km / 10 km max
                  </span>
                </div>

                <!-- 1-Click Action to switch to Pickup if outside 10 km delivery radius -->
                <div v-if="form.orderType === 'Delivery' && !currentDeliveryEligibility.eligible" class="mt-2.5 pt-2.5 border-t border-red-500/20 flex flex-wrap gap-2">
                  <button
                    type="button"
                    @click="form.orderType = 'Pickup'"
                    class="bg-amber-500 hover:bg-amber-400 text-black font-bold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>🏪</span> Switch to Store Pickup (Free)
                  </button>
                  <button
                    type="button"
                    @click="detectLocationForCart"
                    class="bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>📍</span> Re-check My Live Location
                  </button>
                </div>
              </div>

              <!-- Notes -->
              <div>
                <label class="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Special Instructions</label>
                <textarea v-model="form.notes" rows="2" placeholder="Any special requests..." class="input-dark resize-none"></textarea>
              </div>

              <!-- Payment Method -->
              <div>
                <label class="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Payment Method *</label>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <label
                    v-for="method in paymentMethods"
                    :key="method.id"
                    class="flex items-center gap-2 cursor-pointer p-3 rounded-xl border transition-all"
                    :class="form.payment === method.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-dark-border text-gray-400 hover:border-primary/30'"
                  >
                    <input type="radio" :value="method.id" v-model="form.payment" class="sr-only" />
                    <span class="text-lg">{{ method.icon }}</span>
                    <span class="text-xs font-medium">{{ method.name }}</span>
                  </label>
                </div>
              </div>

              <!-- Promo Code -->
              <div>
                <label class="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Promo Code</label>
                <div class="flex gap-2">
                  <input v-model="promoCode" type="text" placeholder="e.g. WELCOME20" class="input-dark flex-1 uppercase" />
                  <button
                    type="button"
                    @click="applyPromo"
                    class="px-4 py-3 rounded-xl border border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-[#0D0D0D] transition-all"
                  >
                    Apply
                  </button>
                </div>
                <p v-if="promoMessage" class="text-xs mt-1.5" :class="promoApplied ? 'text-emerald-400' : 'text-red-400'">
                  {{ promoMessage }}
                </p>
              </div>

              <!-- Hidden submit trigger -->
              <button type="submit" ref="submitBtn" class="sr-only">Submit</button>
            </form>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="space-y-4">
          <div class="bg-dark-card border border-dark-border rounded-2xl p-5 sticky top-24">
            <h2 class="font-semibold text-white mb-4 flex items-center gap-2">
              <span class="w-6 h-6 bg-primary text-[#0D0D0D] rounded-full flex items-center justify-center text-xs font-bold">3</span>
              Order Summary
            </h2>

            <!-- Items summary -->
            <div class="space-y-2 mb-4 pb-4 border-b border-dark-border">
              <div v-for="item in cartStore.items" :key="item.id" class="flex justify-between text-sm">
                <span class="text-gray-400 truncate mr-2">{{ item.name }} × {{ item.quantity }}</span>
                <span class="text-white flex-shrink-0">Rs. {{ (item.price * item.quantity).toLocaleString() }}</span>
              </div>
            </div>

            <!-- Totals -->
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-400">Subtotal</span>
                <span class="text-white">Rs. {{ cartStore.subtotal.toLocaleString() }}</span>
              </div>
              <div v-if="promoApplied" class="flex justify-between text-emerald-400">
                <span>Discount ({{ promoCode }})</span>
                <span>−Rs. {{ promoDiscount.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Delivery Fee</span>
                <span :class="cartStore.deliveryFee === 0 ? 'text-emerald-400' : 'text-white'">
                  {{ cartStore.deliveryFee === 0 ? 'FREE' : `Rs. ${cartStore.deliveryFee}` }}
                </span>
              </div>
              <div class="flex justify-between text-base font-bold border-t border-dark-border pt-3 mt-2">
                <span class="text-white">Total</span>
                <span class="text-primary">Rs. {{ grandTotal.toLocaleString() }}</span>
              </div>
            </div>

            <!-- Delivery time -->
            <div class="mt-4 bg-amber-400/10 border border-amber-400/20 rounded-xl px-4 py-3 text-xs text-amber-300 flex items-center gap-2">
              ⏱ Estimated delivery: <strong>45–60 minutes</strong>
            </div>

            <!-- Place Order / Login Required CTA -->
            <div v-if="!authStore.isLoggedIn" class="mt-4 space-y-2">
              <button
                type="button"
                @click="openInlineLogin = true"
                class="w-full bg-primary text-[#0D0D0D] font-bold py-4 rounded-2xl hover:bg-primary-light transition-all flex items-center justify-center gap-2 text-base shadow-lg shadow-primary/20 cursor-pointer"
              >
                <span>🔒</span>
                Login to Place Order
              </button>
              <p class="text-center text-xs text-amber-300/90 flex items-center justify-center gap-1">
                <span>⚡</span> Sign in or create account to complete checkout
              </p>
            </div>

            <div v-else class="mt-4">
              <button
                @click="placeOrder"
                :disabled="isOrdering || (form.orderType === 'Delivery' && !currentDeliveryEligibility.eligible)"
                class="w-full bg-primary text-[#0D0D0D] font-bold py-4 rounded-2xl hover:bg-primary-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base shadow-lg shadow-primary/20"
                :class="form.orderType === 'Delivery' && !currentDeliveryEligibility.eligible ? '!bg-red-500/20 !text-red-300 !border !border-red-500/40' : ''"
              >
                <span v-if="isOrdering" class="animate-spin">⏳</span>
                <span v-else-if="form.orderType === 'Delivery' && !currentDeliveryEligibility.eligible">🚫</span>
                <span v-else>🎉</span>
                {{
                  isOrdering
                    ? 'Placing Order...'
                    : (form.orderType === 'Delivery' && !currentDeliveryEligibility.eligible)
                      ? 'Delivery Unavailable (>10 km) — Switch to Pickup'
                      : `Place Order — Rs. ${grandTotal.toLocaleString()}`
                }}
              </button>
            </div>

            <p class="text-center text-xs text-gray-500 mt-2">
              🔒 Your order is secure and encrypted
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ INLINE QUICK LOGIN / REGISTER MODAL ═══════════════════════════════ -->
    <Transition name="fade">
      <div
        v-if="openInlineLogin"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="openInlineLogin = false"
      >
        <div class="absolute inset-0 bg-black/75 backdrop-blur-sm" @click="openInlineLogin = false"></div>

        <Transition name="scale">
          <div
            v-if="openInlineLogin"
            class="relative bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl w-full max-w-md shadow-2xl z-10 animate-slide-up overflow-hidden p-6"
          >
            <!-- Close button -->
            <button
              @click="openInlineLogin = false"
              class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            <!-- Modal Header -->
            <div class="text-center mb-6">
              <span class="text-3xl block mb-2">🎂</span>
              <h3 class="font-playfair text-2xl font-bold text-white">
                {{ modalMode === 'signup' ? 'Create Customer Account' : 'Customer Sign In' }}
              </h3>
              <p class="text-xs text-gray-400 mt-1">
                Log in to place your order, verify address & track delivery
              </p>
            </div>

            <!-- 1-Click Demo Login Banner -->
            <div class="mb-5 p-3 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-between gap-3">
              <div>
                <p class="text-xs font-bold text-primary">Fast 1-Click Testing</p>
                <p class="text-[11px] text-gray-400">Sara Ahmed (<span class="text-white font-mono">demo@bakery.pk</span>)</p>
              </div>
              <button
                type="button"
                @click="quickDemoLogin"
                :disabled="isDemoLoading"
                class="px-3 py-1.5 rounded-lg bg-primary text-[#0D0D0D] text-xs font-bold hover:bg-primary-light transition-all flex-shrink-0"
              >
                <span v-if="isDemoLoading" class="animate-spin">⏳</span>
                <span v-else>⚡ Demo In</span>
              </button>
            </div>

            <!-- Modal Tabs -->
            <div class="flex bg-[#111] rounded-xl p-1 mb-5">
              <button
                type="button"
                @click="modalMode = 'login'"
                class="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                :class="modalMode === 'login' ? 'bg-primary text-[#0D0D0D]' : 'text-gray-400 hover:text-white'"
              >Sign In</button>
              <button
                type="button"
                @click="modalMode = 'signup'"
                class="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                :class="modalMode === 'signup' ? 'bg-primary text-[#0D0D0D]' : 'text-gray-400 hover:text-white'"
              >Create Account</button>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleModalAuth" class="space-y-3.5">
              <div v-if="modalMode === 'signup'">
                <label class="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Full Name *</label>
                <input v-model="modalForm.name" type="text" required placeholder="Your full name" class="input-dark text-sm py-2.5" />
              </div>

              <div>
                <label class="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Email Address *</label>
                <input v-model="modalForm.email" type="email" required placeholder="your@email.com" class="input-dark text-sm py-2.5" />
              </div>

              <div v-if="modalMode === 'signup'">
                <label class="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Phone Number *</label>
                <input v-model="modalForm.phone" type="tel" required placeholder="0300-XXXXXXX" class="input-dark text-sm py-2.5" />
              </div>

              <div>
                <label class="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Password *</label>
                <input v-model="modalForm.password" type="password" required placeholder="Enter password" class="input-dark text-sm py-2.5" />
              </div>

              <!-- Error Message -->
              <p v-if="modalError" class="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                {{ modalError }}
              </p>

              <!-- Submit -->
              <button
                type="submit"
                :disabled="isModalLoading"
                class="w-full bg-primary text-[#0D0D0D] font-bold py-3 rounded-xl hover:bg-primary-light transition-all flex items-center justify-center gap-2 text-sm shadow-md"
              >
                <span v-if="isModalLoading" class="animate-spin">⏳</span>
                {{ isModalLoading ? 'Verifying...' : (modalMode === 'signup' ? 'Create Account & Proceed' : 'Sign In & Proceed') }}
              </button>
            </form>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- ═══ EMAIL OTP ORDER CONFIRMATION MODAL ══════════════════════════════ -->
    <Transition name="fade">
      <div
        v-if="showOtpModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="showOtpModal = false"
      >
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="showOtpModal = false"></div>

        <Transition name="scale">
          <div
            v-if="showOtpModal"
            class="relative bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl w-full max-w-md shadow-2xl z-10 animate-slide-up p-6 sm:p-8 text-center text-white"
          >
            <!-- Close button -->
            <button
              @click="showOtpModal = false"
              class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm cursor-pointer"
            >
              ✕
            </button>

            <!-- Icon & Header -->
            <div class="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
              ✉️
            </div>

            <h3 class="font-playfair text-2xl font-bold text-white mb-2">Order Confirmation Code</h3>
            <p class="text-xs text-gray-300 mb-1">
              We've sent a 6-digit confirmation code to:
            </p>
            <p class="text-sm font-bold text-primary mb-3 font-mono break-all">
              {{ authStore.user?.email }}
            </p>

            <!-- Live Email Sent Banner -->
            <div v-if="liveEmailSent" class="mb-4 p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center justify-center gap-2">
              <span>📬</span>
              <span><strong>Sent to your inbox!</strong> Check spam if not in inbox.</span>
            </div>

            <p class="text-[11px] text-gray-400 mb-5">
              Please enter the code below to confirm your order of <strong class="text-white">Rs. {{ grandTotal.toLocaleString() }}</strong>.
            </p>

            <!-- 6 Digit Input Boxes -->
            <div class="flex justify-center gap-2 sm:gap-2.5 mb-4" @paste="handleOtpPaste">
              <input
                v-for="(digit, idx) in otpDigits"
                :key="idx"
                :ref="el => { if (el) otpInputs[idx] = el }"
                v-model="otpDigits[idx]"
                type="text"
                inputmode="numeric"
                maxlength="1"
                pattern="[0-9]*"
                @input="handleOtpInput(idx, $event)"
                @keydown="handleOtpKeydown(idx, $event)"
                class="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold bg-[#111] border rounded-xl focus:outline-none transition-all"
                :class="otpDigits[idx] ? 'border-primary text-primary shadow-sm shadow-primary/20' : 'border-[#333] text-white focus:border-primary'"
              />
            </div>

            <!-- 1-Click Test Code Auto-Fill Chip -->
            <div v-if="otpTestCode" class="mb-4">
              <button
                type="button"
                @click="autoFillTestCode"
                class="text-[11px] bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 mx-auto font-medium cursor-pointer"
              >
                <span>⚡ Test Code: <strong class="font-mono">{{ otpTestCode }}</strong></span>
                <span class="underline text-[10px]">(Click to auto-fill)</span>
              </button>
            </div>

            <!-- Error Message -->
            <p v-if="otpError" class="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-2.5 mb-4">
              ⚠️ {{ otpError }}
            </p>

            <!-- Action Buttons -->
            <div class="space-y-2.5">
              <button
                type="button"
                @click="verifyAndPlaceOrder"
                :disabled="isVerifyingOtp || otpDigits.join('').length < 6"
                class="btn-primary w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span v-if="isVerifyingOtp" class="animate-spin">⏳</span>
                <span v-else>✓</span>
                <span>{{ isVerifyingOtp ? 'Confirming Order...' : 'Verify & Confirm Order' }}</span>
              </button>

              <!-- Resend Timer -->
              <div class="pt-2 text-xs">
                <button
                  v-if="resendCooldown <= 0"
                  type="button"
                  @click="sendEmailOtp"
                  :disabled="isSendingOtp"
                  class="text-gray-400 hover:text-primary transition-colors underline font-medium cursor-pointer"
                >
                  {{ isSendingOtp ? 'Sending new code...' : 'Resend Verification Code' }}
                </button>
                <span v-else class="text-gray-500">
                  Resend code in <strong class="text-primary">{{ resendCooldown }}s</strong>
                </span>
              </div>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useLocationStore, calculateDistanceKm, checkDeliveryEligibility, geocodeAddress, MAX_DELIVERY_RADIUS_KM } from '@/stores/location'
import { useAuthStore } from '@/stores/auth'
import { cities, branches } from '@/data/products'
import { API_BASE } from '@/lib/api'

const router = useRouter()
const cartStore = useCartStore()
const locationStore = useLocationStore()
const authStore = useAuthStore()

// Inline modal state
const openInlineLogin = ref(false)
const modalMode = ref('login') // 'login' | 'signup'
const isModalLoading = ref(false)
const isDemoLoading = ref(false)
const modalError = ref('')
const modalForm = ref({ name: '', email: '', phone: '', password: '' })

// Email OTP Confirmation Modal State
const showOtpModal = ref(false)
const isSendingOtp = ref(false)
const isVerifyingOtp = ref(false)
const otpError = ref('')
const otpDigits = ref(['', '', '', '', '', ''])
const otpInputs = ref([])
const otpTestCode = ref('')
const liveEmailSent = ref(false)
const resendCooldown = ref(0)
let resendTimer = null

const form = ref({
  name: authStore.user?.name || '',
  phone: authStore.user?.phone || '',
  orderType: 'Delivery',
  address: locationStore.deliveryAddress || '',
  city: locationStore.selectedCity || '',
  branchName: locationStore.selectedBranch ? locationStore.selectedBranch.name : '',
  notes: '',
  payment: 'cash',
})

// Auto-fill customer details when user logs in
watch(
  () => authStore.user,
  (newUser) => {
    if (newUser) {
      if (!form.value.name && newUser.name) form.value.name = newUser.name
      if (!form.value.phone && newUser.phone) form.value.phone = newUser.phone
    }
  },
  { immediate: true }
)

// Quick 1-Click Demo Login
async function quickDemoLogin() {
  isDemoLoading.value = true
  modalError.value = ''
  try {
    await authStore.loginAsDemo()
    openInlineLogin.value = false
    if (authStore.user) {
      if (authStore.user.name) form.value.name = authStore.user.name
      if (authStore.user.phone) form.value.phone = authStore.user.phone
    }
  } catch (err) {
    modalError.value = err.message || 'Demo login failed'
  } finally {
    isDemoLoading.value = false
  }
}

// Handle submit in modal
async function handleModalAuth() {
  modalError.value = ''
  isModalLoading.value = true
  try {
    if (modalMode.value === 'signup') {
      await authStore.registerUser({
        name: modalForm.value.name,
        email: modalForm.value.email,
        phone: modalForm.value.phone,
        password: modalForm.value.password,
      })
    } else {
      await authStore.loginUser({
        email: modalForm.value.email,
        password: modalForm.value.password,
      })
    }
    openInlineLogin.value = false
    if (authStore.user) {
      if (authStore.user.name) form.value.name = authStore.user.name
      if (authStore.user.phone) form.value.phone = authStore.user.phone
    }
  } catch (err) {
    modalError.value = err.message || 'Authentication failed'
  } finally {
    isModalLoading.value = false
  }
}

const branchesForSelectedCity = computed(() => {
  if (!form.value.city) return branches
  return branches.filter(b => b.city.toLowerCase() === form.value.city.toLowerCase())
})

const selectedBranchObj = computed(() => {
  if (form.value.branchName) {
    const found = branches.find(b => b.name === form.value.branchName)
    if (found) return found
  }
  return locationStore.selectedBranch || branches[0]
})

const currentDeliveryEligibility = computed(() => {
  if (form.value.orderType === 'Pickup') {
    return {
      eligible: true,
      reason: 'pickup',
      message: `Store pickup selected from ${selectedBranchObj.value?.name || 'our kitchen'}. Collect directly at the counter.`,
      distanceKm: locationStore.detectedDistance,
      maxRadiusKm: MAX_DELIVERY_RADIUS_KM,
    }
  }
  return checkDeliveryEligibility(selectedBranchObj.value, locationStore.userCoordinates, form.value.city)
})

// Sync when locationStore updates (e.g. from GPS auto-detect or reverse geocoding)
watch(
  () => locationStore.selectedBranch,
  (newBranch) => {
    if (newBranch) {
      form.value.city = newBranch.city
      form.value.branchName = newBranch.name
    }
  },
  { immediate: true }
)

watch(
  () => locationStore.deliveryAddress,
  (newAddr) => {
    if (newAddr && !form.value.address) {
      form.value.address = newAddr
    }
  },
  { immediate: true }
)

function onCityChange() {
  const branch = branches.find(b => b.city.toLowerCase() === form.value.city.toLowerCase())
  if (branch) {
    form.value.branchName = branch.name
    locationStore.setBranch(branch)
  }
}

function onBranchChange() {
  const branch = branches.find(b => b.name === form.value.branchName)
  if (branch) {
    locationStore.setBranch(branch)
  }
}

async function handleAddressBlur() {
  if (!form.value.address || form.value.address.trim().length < 4) return
  // If user coordinates aren't already set, geocode the entered address to check 10km radius
  if (!locationStore.userCoordinates) {
    const geo = await geocodeAddress(form.value.address, form.value.city)
    if (geo) {
      locationStore.userCoordinates = { lat: geo.lat, lng: geo.lng }
      if (selectedBranchObj.value?.coords) {
        const dist = Math.round(calculateDistanceKm(geo.lat, geo.lng, selectedBranchObj.value.coords.lat, selectedBranchObj.value.coords.lng) * 10) / 10
        locationStore.detectedDistance = dist
      }
    }
  }
}

async function detectLocationForCart() {
  try {
    const res = await locationStore.detectLiveLocation()
    if (res && res.branch) {
      form.value.city = res.branch.city
      form.value.branchName = res.branch.name
      if (res.deliveryAddress && !form.value.address) {
        form.value.address = res.deliveryAddress
      }
    }
  } catch (err) {
    console.error('Cart location detection error:', err)
  }
}

async function fillAddressWithGPS() {
  try {
    const res = await locationStore.detectLiveLocation()
    if (res && res.deliveryAddress) {
      form.value.address = res.deliveryAddress
      if (res.branch) {
        form.value.city = res.branch.city
        form.value.branchName = res.branch.name
      }
    }
  } catch (err) {
    alert('Could not access live GPS location. Please check browser location permissions.')
  }
}

const promoCode    = ref('')
const promoApplied = ref(false)
const promoDiscount= ref(0)
const promoMessage = ref('')
const isOrdering   = ref(false)

const paymentMethods = [
  { id: 'cash',    name: 'Cash on Delivery', icon: '💵' },
  { id: 'card',    name: 'Debit/Credit Card', icon: '💳' },
  { id: 'easypaisa', name: 'EasyPaisa',      icon: '📱' },
  { id: 'jazzcash',  name: 'JazzCash',       icon: '🟠' },
  { id: 'bank',    name: 'Bank Transfer',    icon: '🏦' },
]

const validCodes = {
  WELCOME20: 0.20,
  BAKERY10:  0.10,
  SAVE15:    0.15,
}

const grandTotal = computed(() =>
  Math.max(0, cartStore.total - promoDiscount.value)
)

function applyPromo() {
  const code = promoCode.value.toUpperCase().trim()
  const discount = validCodes[code]
  if (discount) {
    promoApplied.value = true
    promoDiscount.value = Math.round(cartStore.subtotal * discount)
    promoMessage.value = `✅ Code applied! You saved Rs. ${promoDiscount.value.toLocaleString()}`
  } else {
    promoApplied.value = false
    promoDiscount.value = 0
    promoMessage.value = '❌ Invalid or expired promo code'
  }
}

function handleOtpInput(idx, event) {
  const val = event.target.value
  otpDigits.value[idx] = val.slice(-1)
  if (val && idx < 5) {
    otpInputs.value[idx + 1]?.focus()
  }
}

function handleOtpKeydown(idx, event) {
  if (event.key === 'Backspace' && !otpDigits.value[idx] && idx > 0) {
    otpInputs.value[idx - 1]?.focus()
  }
}

function handleOtpPaste(event) {
  event.preventDefault()
  const pasted = (event.clipboardData || window.clipboardData).getData('text').trim()
  if (/^\d{6}$/.test(pasted)) {
    otpDigits.value = pasted.split('')
    otpInputs.value[5]?.focus()
  }
}

function autoFillTestCode() {
  if (otpTestCode.value) {
    otpDigits.value = otpTestCode.value.split('')
  }
}

function startResendCooldown() {
  resendCooldown.value = 30
  if (resendTimer) clearInterval(resendTimer)
  resendTimer = setInterval(() => {
    if (resendCooldown.value > 0) {
      resendCooldown.value--
    } else {
      clearInterval(resendTimer)
    }
  }, 1000)
}

async function sendEmailOtp() {
  isSendingOtp.value = true
  otpError.value = ''
  try {
    const res = await fetch(`${API_BASE}/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: authStore.user?.email,
        customerName: form.value.name,
        orderTotal: grandTotal.value,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || 'Failed to send verification code')
    }
    otpTestCode.value = data.testCode || ''
    liveEmailSent.value = Boolean(data.liveEmailSent)
    startResendCooldown()
  } catch (err) {
    otpError.value = err.message || 'Could not send verification code'
  } finally {
    isSendingOtp.value = false
  }
}

async function verifyAndPlaceOrder() {
  const code = otpDigits.value.join('')
  if (code.length < 6) {
    otpError.value = 'Please enter all 6 digits of the confirmation code.'
    return
  }

  isVerifyingOtp.value = true
  otpError.value = ''
  try {
    const res = await fetch(`${API_BASE}/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: authStore.user?.email,
        code,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || 'Invalid verification code')
    }

    // OTP successfully verified!
    showOtpModal.value = false
    executeFinalOrder()
  } catch (err) {
    otpError.value = err.message || 'Verification failed. Please check the code.'
  } finally {
    isVerifyingOtp.value = false
  }
}

function placeOrder() {
  if (!authStore.isLoggedIn) {
    openInlineLogin.value = true
    return
  }

  if (!form.value.name || !form.value.phone || !form.value.city || !form.value.payment) {
    alert('Please fill in all required fields!')
    return
  }
  if (form.value.orderType === 'Delivery') {
    if (!form.value.address) {
      alert('Please enter your delivery address!')
      return
    }

    // 10 KM Delivery Radius & Out of City Enforcement
    if (!currentDeliveryEligibility.value.eligible) {
      alert(`🚫 Delivery Unavailable:\n\n${currentDeliveryEligibility.value.message}\n\nPlease switch to "Store Pickup" or select a branch in your area.`)
      return
    }
  }

  // Open OTP verification modal & dispatch 6-digit code to customer email
  otpDigits.value = ['', '', '', '', '', '']
  otpError.value = ''
  showOtpModal.value = true
  sendEmailOtp()
}

function executeFinalOrder() {
  isOrdering.value = true

  // Save full order details for confirmation screen
  const orderData = {
    orderNumber: `MBK-${Math.floor(100000 + Math.random() * 900000)}`,
    customer: {
      name: form.value.name,
      email: authStore.user?.email || '',
      phone: form.value.phone,
      address: form.value.address,
      city: form.value.city,
    },
    orderType: form.value.orderType,
    fulfillingBranch: selectedBranchObj.value || { name: form.value.branchName, city: form.value.city },
    items: [...cartStore.items],
    subtotal: cartStore.subtotal,
    deliveryFee: cartStore.deliveryFee,
    discount: promoDiscount.value,
    total: grandTotal.value,
    paymentMethod: form.value.payment,
    distanceKm: currentDeliveryEligibility.value.distanceKm || locationStore.detectedDistance,
    date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }

  // Send to backend API and store in SQLite
  try {
    fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    }).catch(err => console.warn('Backend order recording:', err))
  } catch (err) {
    console.warn(err)
  }

  localStorage.setItem('lastOrder', JSON.stringify(orderData))

  setTimeout(() => {
    cartStore.clearCart()
    isOrdering.value = false
    router.push('/order-success')
  }, 1000)
}
</script>

