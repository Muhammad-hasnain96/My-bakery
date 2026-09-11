<template>
  <div class="min-h-screen bg-dark-bg text-gray-200 transition-colors duration-300 py-8 px-4 sm:px-6">
    <div class="container mx-auto max-w-7xl">

      <!-- ═══════════════════════════════════════════════════════════════════════════ -->
      <!-- 1. STAFF LOGIN SCREEN (IF NOT AUTHENTICATED AS STAFF)                      -->
      <!-- ═══════════════════════════════════════════════════════════════════════════ -->
      <div v-if="!authStore.isStaff" class="max-w-xl mx-auto my-12">
        <div class="bg-dark-card border border-dark-border rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div class="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

          <!-- Header -->
          <div class="text-center mb-8">
            <span class="text-4xl inline-block mb-3 animate-bounce">👨‍🍳</span>
            <h1 class="font-playfair text-3xl font-bold text-white mb-2">Branch CMS & Kitchen Portal</h1>
            <p class="text-xs text-gray-400">
              Role-Based Access Control (RBAC) system for Branch Managers & Executive Leadership.
            </p>
          </div>

          <!-- Error Alert -->
          <div v-if="loginError" class="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3.5 rounded-xl flex items-center gap-2">
            <span>⚠️</span>
            <span>{{ loginError }}</span>
          </div>

          <!-- Direct Login Form -->
          <form @submit.prevent="handleDirectLogin" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-300 mb-1.5">Staff Email Address</label>
              <input
                v-model="loginEmail"
                type="email"
                required
                placeholder="e.g. fsd@bakery.pk or admin@bakery.pk"
                class="input-dark w-full text-xs py-3"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 mb-1.5">Password</label>
              <input
                v-model="loginPassword"
                type="password"
                required
                placeholder="••••••••"
                class="input-dark w-full text-xs py-3"
              />
            </div>

            <button
              type="submit"
              :disabled="authStore.isAuthLoading"
              class="btn-primary w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 mt-2"
            >
              <span v-if="authStore.isAuthLoading" class="animate-spin">🔄</span>
              <span>Sign In to Branch Portal</span>
            </button>
          </form>

          <!-- Quick Test Roles 1-Click Login Strip -->
          <div class="mt-8 pt-6 border-t border-dark-border">
            <p class="text-[11px] uppercase tracking-wider font-bold text-primary mb-3 text-center">
              ⚡ One-Click Role Testing (Pre-Configured Accounts)
            </p>

            <div class="space-y-2">
              <button
                @click="quickLogin('admin@bakery.pk', 'admin123')"
                class="w-full text-left bg-[#1A1A1A] hover:bg-[#242424] border border-[#333] hover:border-primary/50 p-3 rounded-xl transition-all flex items-center justify-between"
              >
                <div class="flex items-center gap-2.5">
                  <span class="text-lg">👑</span>
                  <div>
                    <p class="text-xs font-bold text-white">Muhammad Hasnain (CEO)</p>
                    <p class="text-[10px] text-gray-400">Role: <span class="text-primary font-semibold">Superadmin</span> · All Branches Nationwide</p>
                  </div>
                </div>
                <span class="text-[11px] text-primary font-semibold">Login ➔</span>
              </button>

              <button
                @click="quickLogin('ahtisham@bakery.pk', 'ops123')"
                class="w-full text-left bg-[#1A1A1A] hover:bg-[#242424] border border-[#333] hover:border-primary/50 p-3 rounded-xl transition-all flex items-center justify-between"
              >
                <div class="flex items-center gap-2.5">
                  <span class="text-lg">💼</span>
                  <div>
                    <p class="text-xs font-bold text-white">Ahtisham Hussain (Operations)</p>
                    <p class="text-[10px] text-gray-400">Role: <span class="text-primary font-semibold">Superadmin / Executive</span></p>
                  </div>
                </div>
                <span class="text-[11px] text-primary font-semibold">Login ➔</span>
              </button>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  @click="quickLogin('fsd@bakery.pk', 'fsd123')"
                  class="text-left bg-[#1A1A1A] hover:bg-[#242424] border border-[#333] hover:border-primary/50 p-2.5 rounded-xl transition-all"
                >
                  <p class="text-xs font-bold text-amber-400">📍 Faisalabad Kitchen</p>
                  <p class="text-[10px] text-gray-400">Kohinoor City Branch</p>
                </button>

                <button
                  @click="quickLogin('lahore@bakery.pk', 'lhr123')"
                  class="text-left bg-[#1A1A1A] hover:bg-[#242424] border border-[#333] hover:border-primary/50 p-2.5 rounded-xl transition-all"
                >
                  <p class="text-xs font-bold text-amber-400">📍 Lahore Kitchen</p>
                  <p class="text-[10px] text-gray-400">Gulberg III Branch</p>
                </button>

                <button
                  @click="quickLogin('karachi@bakery.pk', 'khi123')"
                  class="text-left bg-[#1A1A1A] hover:bg-[#242424] border border-[#333] hover:border-primary/50 p-2.5 rounded-xl transition-all"
                >
                  <p class="text-xs font-bold text-amber-400">📍 Karachi Kitchen</p>
                  <p class="text-[10px] text-gray-400">Clifton Block 4 Branch</p>
                </button>

                <button
                  @click="quickLogin('islamabad@bakery.pk', 'isb123')"
                  class="text-left bg-[#1A1A1A] hover:bg-[#242424] border border-[#333] hover:border-primary/50 p-2.5 rounded-xl transition-all"
                >
                  <p class="text-xs font-bold text-amber-400">📍 Islamabad Kitchen</p>
                  <p class="text-[10px] text-gray-400">F-7 Markaz Branch</p>
                </button>
              </div>
            </div>

            <div class="mt-6 text-center">
              <RouterLink to="/" class="text-xs text-gray-400 hover:text-white transition-colors">
                ← Return to Customer Storefront
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════════════════════ -->
      <!-- 2. MAIN CMS PORTAL (STAFF AUTHENTICATED)                                   -->
      <!-- ═══════════════════════════════════════════════════════════════════════════ -->
      <div v-else class="space-y-6">

        <!-- Top Header & Role Indicator Bar -->
        <div class="bg-dark-card border border-dark-border rounded-3xl p-6 shadow-xl">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <!-- Title & User Info -->
            <div class="flex items-start sm:items-center gap-4">
              <div class="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-2xl flex-shrink-0">
                {{ authStore.isSuperAdmin ? '👑' : '👨‍🍳' }}
              </div>
              <div>
                <div class="flex items-center gap-2.5 flex-wrap">
                  <h1 class="font-playfair text-2xl font-bold text-white">
                    {{ authStore.isSuperAdmin ? 'Executive HQ & Multi-Branch CMS' : 'Branch Kitchen Portal' }}
                  </h1>
                  <span
                    class="badge text-[11px] font-bold"
                    :class="authStore.isSuperAdmin ? 'badge-gold' : 'badge-green'"
                  >
                    {{ authStore.isSuperAdmin ? 'Superadmin (Nationwide)' : 'Branch Manager' }}
                  </span>
                </div>
                <p class="text-xs text-gray-400 mt-1 flex items-center gap-2">
                  <span>Logged in as: <strong class="text-white">{{ authStore.user?.name }}</strong> ({{ authStore.user?.email }})</span>
                  <span class="text-gray-600">•</span>
                  <span v-if="authStore.isBranchManager" class="text-primary font-medium">
                    🔒 Assigned: {{ authStore.assignedBranchName }}
                  </span>
                  <span v-else class="text-emerald-400 font-medium">
                    🌐 Nationwide Full Access
                  </span>
                </p>
              </div>
            </div>

            <!-- Controls: Branch Switcher (for Superadmin), Chime Sound, Logout -->
            <div class="flex items-center gap-3 flex-wrap">
              <!-- Audio Alert Toggle -->
              <button
                @click="toggleAudioChime"
                class="flex items-center gap-2 text-xs px-3 py-2 rounded-xl border transition-all"
                :class="isAudioEnabled ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-dark-card border-dark-border text-gray-500'"
                :title="isAudioEnabled ? 'Incoming order sound alert enabled' : 'Incoming order sound alert muted'"
              >
                <span>{{ isAudioEnabled ? '🔔 Sound: ON' : '🔕 Sound: MUTED' }}</span>
              </button>

              <!-- Branch Selector (Unlocked for Superadmin, Locked for Branch Manager) -->
              <div class="flex items-center gap-2 bg-[#1A1A1A] border border-dark-border px-3 py-1.5 rounded-xl">
                <span class="text-xs text-gray-400">📍 Branch:</span>
                <select
                  v-if="authStore.isSuperAdmin"
                  v-model="activeBranchId"
                  @change="handleBranchChange"
                  class="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="all" class="bg-dark-card text-white">🌐 All Nationwide Branches</option>
                  <option
                    v-for="b in branches"
                    :key="b.id"
                    :value="b.id"
                    class="bg-dark-card text-white"
                  >
                    {{ b.city }} — {{ b.name.replace('My Bakery — ', '') }}
                  </option>
                </select>
                <span v-else class="text-xs font-bold text-primary">
                  {{ currentBranchName }} 🔒
                </span>
              </div>

              <!-- Switch Role / Logout -->
              <button
                @click="handleLogout"
                class="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 px-3 py-2 rounded-xl transition-all"
              >
                <span>🚪 Sign Out</span>
              </button>

              <!-- Storefront Link -->
              <RouterLink
                to="/"
                class="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white bg-dark-card hover:bg-white/5 border border-dark-border px-3 py-2 rounded-xl transition-all"
              >
                <span>🏪 View Shop</span>
              </RouterLink>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <div class="flex items-center gap-2 mt-6 pt-5 border-t border-dark-border overflow-x-auto no-scrollbar">
            <button
              @click="currentTab = 'orders'"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap"
              :class="currentTab === 'orders' ? 'bg-primary text-[#0D0D0D] shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'"
            >
              <span>👨‍🍳 Live Kitchen & Orders</span>
              <span class="bg-black/20 text-current text-[10px] px-2 py-0.5 rounded-full font-bold">
                {{ orders.length }}
              </span>
            </button>

            <button
              @click="currentTab = 'products'"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap"
              :class="currentTab === 'products' ? 'bg-primary text-[#0D0D0D] shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'"
            >
              <span>📦 Branch Products & Stock</span>
            </button>

            <button
              @click="currentTab = 'analytics'"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap"
              :class="currentTab === 'analytics' ? 'bg-primary text-[#0D0D0D] shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'"
            >
              <span>📊 Branch Analytics</span>
            </button>

            <button
              v-if="authStore.isSuperAdmin"
              @click="currentTab = 'staff'"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap"
              :class="currentTab === 'staff' ? 'bg-primary text-[#0D0D0D] shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'"
            >
              <span>👥 Staff & Branches Directory</span>
            </button>
          </div>
        </div>

        <!-- ═══════════════════════════════════════════════════════════════════════ -->
        <!-- TAB 1: LIVE KITCHEN & ORDER MANAGEMENT                                  -->
        <!-- ═══════════════════════════════════════════════════════════════════════ -->
        <div v-if="currentTab === 'orders'" class="space-y-6">

          <!-- Order Summary Metrics -->
          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
            <div class="bg-dark-card border border-dark-border rounded-2xl p-4">
              <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Orders</p>
              <p class="font-playfair text-2xl font-bold text-white mt-1">{{ orders.length }}</p>
            </div>
            <div class="bg-dark-card border border-dark-border rounded-2xl p-4">
              <p class="text-[10px] uppercase font-bold text-amber-400 tracking-wider">New / Received</p>
              <p class="font-playfair text-2xl font-bold text-amber-400 mt-1">
                {{ orders.filter(o => o.orderStatus === 'Received').length }}
              </p>
            </div>
            <div class="bg-dark-card border border-dark-border rounded-2xl p-4">
              <p class="text-[10px] uppercase font-bold text-orange-400 tracking-wider">Baking / In Kitchen</p>
              <p class="font-playfair text-2xl font-bold text-orange-400 mt-1">
                {{ orders.filter(o => o.orderStatus === 'Preparing').length }}
              </p>
            </div>
            <div class="bg-dark-card border border-dark-border rounded-2xl p-4">
              <p class="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Out with Rider</p>
              <p class="font-playfair text-2xl font-bold text-blue-400 mt-1">
                {{ orders.filter(o => o.orderStatus === 'Dispatched').length }}
              </p>
            </div>
            <div class="bg-dark-card border border-dark-border rounded-2xl p-4 col-span-2 sm:col-span-1">
              <p class="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Branch Revenue</p>
              <p class="font-playfair text-2xl font-bold text-primary mt-1">
                Rs. {{ totalRevenue.toLocaleString() }}
              </p>
            </div>
          </div>

          <!-- Order Search & Filters Toolbar -->
          <div class="bg-dark-card border border-dark-border rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <!-- Status Tabs -->
            <div class="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar">
              <button
                v-for="st in statusOptions"
                :key="st.value"
                @click="selectedStatusFilter = st.value; fetchOrders()"
                class="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
                :class="selectedStatusFilter === st.value ? 'bg-primary/20 text-primary border border-primary/40' : 'text-gray-400 hover:text-white'"
              >
                {{ st.label }}
              </button>
            </div>

            <!-- Search input & manual refresh -->
            <div class="flex items-center gap-3 w-full md:w-auto">
              <div class="relative flex-1 md:w-64">
                <input
                  v-model="searchQuery"
                  @input="fetchOrders"
                  type="text"
                  placeholder="Search order #, customer..."
                  class="input-dark w-full text-xs py-2 pl-8"
                />
                <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">🔍</span>
              </div>

              <button
                @click="fetchOrders"
                :disabled="isLoading"
                class="flex items-center gap-1.5 bg-dark-card hover:bg-white/5 border border-dark-border px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition-all flex-shrink-0"
              >
                <span :class="{ 'animate-spin': isLoading }">🔄</span>
                <span>Refresh</span>
              </button>
            </div>
          </div>

          <!-- Empty Orders Feed -->
          <div v-if="orders.length === 0 && !isLoading" class="text-center py-20 bg-dark-card border border-dark-border rounded-3xl">
            <span class="text-5xl block mb-3">📦</span>
            <h3 class="text-white font-bold text-lg mb-1">No orders found for this view</h3>
            <p class="text-gray-400 text-xs max-w-md mx-auto mb-4">
              {{ authStore.isBranchManager ? `Currently waiting for new orders at ${authStore.assignedBranchName}.` : 'No orders matched your branch and status filter.' }}
            </p>
          </div>

          <!-- Orders Grid / Feed -->
          <div v-else class="space-y-4">
            <div
              v-for="order in orders"
              :key="order.id"
              class="bg-dark-card border rounded-3xl p-5 sm:p-6 transition-all relative overflow-hidden"
              :class="statusBorderClass(order.orderStatus)"
            >
              <!-- Order Header -->
              <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-dark-border">
                <div class="flex items-start sm:items-center gap-3">
                  <span class="text-2xl">{{ order.orderType === 'Delivery' ? '🚀' : '🏪' }}</span>
                  <div>
                    <div class="flex items-center gap-2.5 flex-wrap">
                      <h3 class="font-bold text-white text-base tracking-wide">#{{ order.orderNumber }}</h3>
                      <span :class="statusBadgeClass(order.orderStatus)">{{ order.orderStatus }}</span>
                      <span class="badge" :class="order.paymentStatus === 'Paid' ? 'badge-green' : 'badge-gold'">
                        {{ order.paymentStatus }} ({{ order.paymentMethod }})
                      </span>
                    </div>
                    <p class="text-xs text-gray-400 mt-1">
                      Ordered at: <strong class="text-gray-300">{{ order.createdAt }}</strong> · Type: <strong class="text-white">{{ order.orderType }}</strong>
                      <span v-if="order.distanceKm" class="text-emerald-400 ml-2">({{ order.distanceKm }} km away)</span>
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <div class="text-right">
                    <p class="text-[11px] text-gray-400">Total Amount</p>
                    <p class="font-playfair text-xl font-bold text-primary">Rs. {{ order.total.toLocaleString() }}</p>
                  </div>

                  <!-- 1-Click Thermal Slip Button -->
                  <button
                    @click="openPrintTicket(order)"
                    class="flex items-center gap-1.5 bg-[#252525] hover:bg-[#303030] text-gray-200 hover:text-primary border border-[#444] px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    <span>🖨️</span>
                    <span>Box Slip</span>
                  </button>
                </div>
              </div>

              <!-- Order Body Details -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
                <!-- Customer Details -->
                <div class="space-y-1 bg-[#1A1A1A] p-3.5 rounded-2xl border border-[#262626]">
                  <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">👤 Customer & Address</p>
                  <p class="text-white font-bold text-sm">{{ order.customerName }}</p>
                  <p class="text-gray-300">📞 <a :href="'tel:' + order.customerPhone" class="hover:text-primary underline">{{ order.customerPhone }}</a></p>
                  <p class="text-primary mt-1 font-medium break-words">📍 {{ order.customerAddress || 'Pickup in Store' }}</p>
                  <p v-if="order.notes" class="text-amber-300 italic mt-1.5 bg-amber-500/10 border border-amber-500/20 p-1.5 rounded-lg">
                    💬 "{{ order.notes }}"
                  </p>
                </div>

                <!-- Kitchen & Branch -->
                <div class="space-y-1 bg-[#1A1A1A] p-3.5 rounded-2xl border border-[#262626]">
                  <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">🏪 Assigned Branch Kitchen</p>
                  <p class="text-white font-bold">{{ order.branchName }}</p>
                  <p class="text-gray-400">{{ order.branchAddress }}</p>
                  <p class="text-gray-500 mt-1">City: <span class="text-gray-300 font-semibold">{{ order.customerCity }}</span></p>
                </div>

                <!-- Ordered Items -->
                <div class="space-y-1.5 bg-[#1A1A1A] p-3.5 rounded-2xl border border-[#262626]">
                  <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">
                    🎂 Items Ordered ({{ order.items?.length }})
                  </p>
                  <div class="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                    <div
                      v-for="item in order.items"
                      :key="item.id"
                      class="flex justify-between items-center text-gray-300 pb-1 border-b border-[#2A2A2A] last:border-0"
                    >
                      <span class="truncate pr-2">
                        <strong class="text-primary font-bold">{{ item.quantity }}×</strong> {{ item.name }}
                      </span>
                      <span class="font-bold text-white flex-shrink-0">
                        Rs. {{ (item.price * item.quantity).toLocaleString() }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Kitchen Action Progression Bar -->
              <div class="mt-4 pt-3.5 border-t border-dark-border flex flex-wrap items-center justify-between gap-3">
                <span class="text-xs text-gray-400 flex items-center gap-1.5">
                  <span>⚡ Kitchen Workflow Actions:</span>
                </span>

                <div class="flex gap-2 flex-wrap">
                  <button
                    v-if="order.orderStatus === 'Received'"
                    @click="updateStatus(order.id, 'Preparing')"
                    class="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
                  >
                    <span>👨‍🍳 Start Baking / Prep</span>
                  </button>

                  <button
                    v-if="order.orderStatus === 'Preparing'"
                    @click="updateStatus(order.id, 'Dispatched')"
                    class="bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5"
                  >
                    <span>🚀 Handover to Rider</span>
                  </button>

                  <button
                    v-if="order.orderStatus === 'Dispatched'"
                    @click="updateStatus(order.id, 'Delivered', 'Paid')"
                    class="bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                  >
                    <span>✓ Complete & Delivered</span>
                  </button>

                  <button
                    v-if="order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled'"
                    @click="updateStatus(order.id, 'Cancelled')"
                    class="border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs px-3.5 py-2 rounded-xl transition-all"
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ═══════════════════════════════════════════════════════════════════════ -->
        <!-- TAB 2: BRANCH PRODUCTS & INVENTORY STOCK MANAGEMENT                      -->
        <!-- ═══════════════════════════════════════════════════════════════════════ -->
        <div v-if="currentTab === 'products'" class="space-y-6">
          <div class="bg-dark-card border border-dark-border rounded-3xl p-6 shadow-xl">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-dark-border">
              <div>
                <h2 class="font-playfair text-xl font-bold text-white">Branch Inventory & Stock Control</h2>
                <p class="text-xs text-gray-400 mt-1">
                  Managing availability for: <strong class="text-primary">{{ currentBranchName }}</strong>
                </p>
              </div>

              <div class="flex items-center gap-3 flex-wrap">
                <!-- Category Filter -->
                <select
                  v-model="selectedProductCategory"
                  @change="fetchAdminProducts"
                  class="bg-dark-card border border-dark-border text-white text-xs rounded-xl px-3 py-2"
                >
                  <option value="all">All Categories</option>
                  <option value="cakes">Cakes</option>
                  <option value="pastries">Pastries</option>
                  <option value="desserts">Desserts</option>
                  <option value="beverages">Beverages</option>
                  <option value="deals">Deals</option>
                </select>

                <!-- Superadmin Add Product -->
                <button
                  v-if="authStore.isSuperAdmin"
                  @click="openAddProductModal"
                  class="btn-primary text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 font-bold"
                >
                  <span>➕</span>
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            <!-- Product Stock Table / Grid -->
            <div class="mt-6 overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="border-b border-dark-border text-gray-400 uppercase text-[10px] tracking-wider">
                    <th class="py-3 px-4">Item</th>
                    <th class="py-3 px-4">Category</th>
                    <th class="py-3 px-4">Price</th>
                    <th class="py-3 px-4">Branch Status</th>
                    <th class="py-3 px-4 text-center">Availability Toggle</th>
                    <th v-if="authStore.isSuperAdmin" class="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-dark-border">
                  <tr
                    v-for="prod in adminProducts"
                    :key="prod.id"
                    class="hover:bg-white/[0.02] transition-colors"
                  >
                    <td class="py-3.5 px-4">
                      <div class="flex items-center gap-3">
                        <img
                          :src="prod.image"
                          :alt="prod.name"
                          class="w-10 h-10 rounded-xl object-cover border border-dark-border flex-shrink-0"
                        />
                        <div>
                          <p class="font-bold text-white">{{ prod.name }}</p>
                          <p class="text-[10px] text-gray-400 line-clamp-1 max-w-xs">{{ prod.description }}</p>
                        </div>
                      </div>
                    </td>

                    <td class="py-3.5 px-4 text-gray-300 capitalize font-medium">
                      {{ prod.category }}
                    </td>

                    <td class="py-3.5 px-4 font-bold text-primary">
                      Rs. {{ prod.price.toLocaleString() }}
                    </td>

                    <td class="py-3.5 px-4">
                      <span
                        class="badge text-[10px] font-bold"
                        :class="prod.isAvailable ? 'badge-green' : 'badge-red'"
                      >
                        {{ prod.isAvailable ? '● In Stock' : '✕ Sold Out Today' }}
                      </span>
                    </td>

                    <td class="py-3.5 px-4 text-center">
                      <button
                        @click="toggleProductStock(prod)"
                        :disabled="isTogglingStock === prod.id"
                        class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
                        :class="prod.isAvailable
                          ? 'bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30'
                          : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30'"
                      >
                        <span v-if="isTogglingStock === prod.id" class="animate-spin">🔄</span>
                        <span v-else>{{ prod.isAvailable ? 'Mark Sold Out' : 'Mark In Stock' }}</span>
                      </button>
                    </td>

                    <td v-if="authStore.isSuperAdmin" class="py-3.5 px-4 text-right space-x-2">
                      <button
                        @click="openEditProductModal(prod)"
                        class="text-gray-400 hover:text-primary transition-colors text-xs font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        @click="deleteProduct(prod.id)"
                        class="text-red-400 hover:text-red-300 transition-colors text-xs font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ═══════════════════════════════════════════════════════════════════════ -->
        <!-- TAB 3: BRANCH ANALYTICS & NATIONWIDE PERFORMANCE MATRIX                -->
        <!-- ═══════════════════════════════════════════════════════════════════════ -->
        <div v-if="currentTab === 'analytics'" class="space-y-6">
          <div class="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 shadow-xl">
            <h2 class="font-playfair text-2xl font-bold text-white mb-2">Branch Sales & Performance Matrix</h2>
            <p class="text-xs text-gray-400 mb-6">
              Real-time revenue metrics tracked per branch from SQLite database.
            </p>

            <!-- Superadmin Nationwide Comparison Table -->
            <div v-if="authStore.isSuperAdmin" class="mt-4">
              <h3 class="text-sm font-bold text-primary uppercase tracking-wider mb-3">
                🏆 City Branch Comparison Matrix
              </h3>
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                  <thead>
                    <tr class="border-b border-dark-border text-gray-400 uppercase text-[10px]">
                      <th class="py-3 px-4">Branch City</th>
                      <th class="py-3 px-4">Branch Name</th>
                      <th class="py-3 px-4">Completed Orders</th>
                      <th class="py-3 px-4">Total Revenue</th>
                      <th class="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-dark-border">
                    <tr
                      v-for="b in branches"
                      :key="b.id"
                      class="hover:bg-white/[0.02]"
                    >
                      <td class="py-3 px-4 font-bold text-white">
                        📍 {{ b.city }}
                      </td>
                      <td class="py-3 px-4 text-gray-300">
                        {{ b.name.replace('My Bakery — ', '') }}
                      </td>
                      <td class="py-3 px-4 font-semibold text-white">
                        {{ getBranchOrderCount(b.id) }} orders
                      </td>
                      <td class="py-3 px-4 font-bold text-primary">
                        Rs. {{ getBranchRevenue(b.id).toLocaleString() }}
                      </td>
                      <td class="py-3 px-4">
                        <span class="badge badge-green text-[10px]">Operational</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Single Branch Metrics -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div class="bg-[#1A1A1A] p-5 rounded-2xl border border-dark-border">
                <p class="text-xs text-gray-400">Total Filtered Revenue</p>
                <p class="font-playfair text-3xl font-bold text-primary mt-1">
                  Rs. {{ totalRevenue.toLocaleString() }}
                </p>
              </div>
              <div class="bg-[#1A1A1A] p-5 rounded-2xl border border-dark-border">
                <p class="text-xs text-gray-400">Average Order Value</p>
                <p class="font-playfair text-3xl font-bold text-white mt-1">
                  Rs. {{ orders.length ? Math.round(totalRevenue / (orders.length || 1)).toLocaleString() : 0 }}
                </p>
              </div>
              <div class="bg-[#1A1A1A] p-5 rounded-2xl border border-dark-border">
                <p class="text-xs text-gray-400">Delivery vs Pickup</p>
                <p class="text-sm font-bold text-emerald-400 mt-2">
                  🚀 Delivery: {{ orders.filter(o => o.orderType === 'Delivery').length }}
                  <span class="text-gray-500 mx-2">|</span>
                  🏪 Pickup: {{ orders.filter(o => o.orderType === 'Pickup').length }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- ═══════════════════════════════════════════════════════════════════════ -->
        <!-- TAB 4: STAFF & BRANCHES DIRECTORY (SUPERADMIN ONLY)                     -->
        <!-- ═══════════════════════════════════════════════════════════════════════ -->
        <div v-if="currentTab === 'staff' && authStore.isSuperAdmin" class="space-y-6">
          <div class="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 shadow-xl">
            <h2 class="font-playfair text-2xl font-bold text-white mb-2">Branch Staff & RBAC Permissions</h2>
            <p class="text-xs text-gray-400 mb-6">
              Official roster of Executive Leadership and City Branch Kitchen Managers.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="s in staffMembers"
                :key="s.id"
                class="bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl p-5 relative overflow-hidden"
              >
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold">
                    {{ s.name[0] }}
                  </div>
                  <div>
                    <h4 class="font-bold text-white text-sm">{{ s.name }}</h4>
                    <span class="badge text-[10px]" :class="s.role === 'superadmin' ? 'badge-gold' : 'badge-green'">
                      {{ s.role === 'superadmin' ? 'Superadmin' : 'Branch Manager' }}
                    </span>
                  </div>
                </div>

                <div class="text-xs text-gray-400 space-y-1 pt-2 border-t border-[#262626]">
                  <p>📧 <span class="text-gray-300 font-mono">{{ s.email }}</span></p>
                  <p>📞 <span class="text-gray-300">{{ s.phone }}</span></p>
                  <p>📍 <strong class="text-primary">{{ s.branchName || 'All Nationwide Branches' }}</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- ═══════════════════════════════════════════════════════════════════════════ -->
      <!-- 3. THERMAL BOX SLIP / KITCHEN PACKING TICKET MODAL                         -->
      <!-- ═══════════════════════════════════════════════════════════════════════════ -->
      <div
        v-if="ticketOrder"
        class="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static"
        @click.self="ticketOrder = null"
      >
        <div class="relative w-full max-w-[420px] my-auto flex flex-col max-h-[92vh] print:max-h-none print:w-full print:max-w-full shadow-2xl">
          
          <!-- Top Floating Action Toolbar (On-Screen Only, Never clipped) -->
          <div class="bg-[#1E1E1E] text-white px-4 py-3 rounded-t-2xl border border-[#333] border-b-0 flex items-center justify-between shadow-lg print:hidden flex-shrink-0">
            <div class="flex items-center gap-2">
              <span class="text-base">🖨️</span>
              <div>
                <p class="text-xs font-bold text-white">Kitchen Slip Preview</p>
                <p class="text-[10px] text-gray-400">Order #{{ ticketOrder.orderNumber }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="triggerPrint"
                class="bg-primary hover:bg-primary-light text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow"
              >
                <span>🖨️</span>
                <span>Print Slip</span>
              </button>
              <button
                @click="ticketOrder = null"
                class="w-7 h-7 flex items-center justify-center rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] text-gray-300 hover:text-white transition-all text-xs font-bold"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Printable Thermal Paper Container (Scrollable on screen, Full on Print) -->
          <div
            id="printable-slip"
            class="bg-[#FDFBF7] text-neutral-900 p-6 sm:p-7 font-mono text-xs border border-[#D5CEBF] print:border-0 print:shadow-none print:p-2 print:w-full rounded-b-2xl print:rounded-none overflow-y-auto max-h-[calc(92vh-54px)] print:max-h-none relative shadow-inner"
          >
            <!-- Header -->
            <div class="text-center border-b-2 border-dashed border-neutral-800 pb-4 mb-4">
              <h2 class="font-playfair text-2xl font-black uppercase tracking-widest text-neutral-900 leading-tight">MY BAKERY</h2>
              <p class="text-[10px] font-sans font-semibold tracking-wider text-neutral-600 uppercase mt-0.5">Premium Artisan Patisserie</p>
              <div class="mt-2 text-xs font-bold text-neutral-800">
                {{ ticketOrder.branchName }}
              </div>
              <p class="text-[10px] text-neutral-600 leading-normal">{{ ticketOrder.branchAddress }}</p>
              <div class="inline-block mt-2 px-3 py-0.5 border border-neutral-800 rounded text-[10px] font-bold uppercase tracking-wide bg-neutral-100">
                Kitchen Packing Slip
              </div>
            </div>

            <!-- Order Meta -->
            <div class="border-b border-dashed border-neutral-400 pb-3 mb-3 text-[11px] leading-relaxed">
              <div class="flex justify-between font-bold text-sm">
                <span>ORDER: #{{ ticketOrder.orderNumber }}</span>
                <span class="px-1.5 py-0.5 bg-neutral-900 text-white rounded text-[10px]">
                  {{ ticketOrder.orderType.toUpperCase() }}
                </span>
              </div>
              <div class="flex justify-between text-neutral-600 mt-1">
                <span>Date: {{ ticketOrder.createdAt }}</span>
                <span class="font-bold text-neutral-900">Payment: {{ ticketOrder.paymentStatus }}</span>
              </div>
            </div>

            <!-- Customer Info (Urdu + English full script support) -->
            <div class="border-b border-dashed border-neutral-400 pb-3 mb-3 bg-neutral-100/70 p-3 rounded-lg border border-neutral-200 text-[11px] space-y-1.5">
              <div class="flex items-start justify-between gap-2">
                <span class="font-bold text-neutral-600 uppercase text-[10px]">Customer:</span>
                <span class="font-bold text-neutral-900 text-right text-xs">{{ ticketOrder.customerName }}</span>
              </div>
              <div class="flex items-start justify-between gap-2">
                <span class="font-bold text-neutral-600 uppercase text-[10px]">Phone:</span>
                <span class="font-bold text-neutral-900">{{ ticketOrder.customerPhone }}</span>
              </div>
              <div class="flex items-start justify-between gap-2 pt-0.5">
                <span class="font-bold text-neutral-600 uppercase text-[10px] flex-shrink-0">Address:</span>
                <span class="text-right text-neutral-800 break-words leading-tight">{{ ticketOrder.customerAddress || 'Store Pickup' }}</span>
              </div>
              <div v-if="ticketOrder.distanceKm" class="text-[10px] text-right text-neutral-600">
                Distance: {{ ticketOrder.distanceKm }} km away
              </div>
              <div v-if="ticketOrder.notes" class="mt-2 pt-2 border-t border-neutral-200 text-neutral-800">
                <span class="font-bold uppercase text-[9px] text-neutral-600 block">Cake Note / Message:</span>
                <p class="italic font-sans text-xs mt-0.5 text-neutral-900 bg-white p-2 rounded border border-neutral-300">
                  "{{ ticketOrder.notes }}"
                </p>
              </div>
            </div>

            <!-- Items Table -->
            <div class="border-b-2 border-dashed border-neutral-800 pb-3 mb-3">
              <div class="flex justify-between font-bold border-b border-neutral-300 pb-1 mb-2 text-[11px] uppercase tracking-wider text-neutral-700">
                <span>Qty & Item</span>
                <span>Price</span>
              </div>
              <div
                v-for="item in ticketOrder.items"
                :key="item.id"
                class="flex justify-between items-center py-1.5 border-b border-neutral-200/60 last:border-0 text-xs"
              >
                <div class="pr-2 leading-tight">
                  <span class="font-black text-neutral-900">{{ item.quantity }}×</span>
                  <span class="text-neutral-800 ml-1 font-medium">{{ item.name }}</span>
                </div>
                <span class="font-bold text-neutral-900 flex-shrink-0">
                  Rs. {{ (item.price * item.quantity).toLocaleString() }}
                </span>
              </div>
            </div>

            <!-- Financial Summary -->
            <div class="space-y-1 text-right mb-4 text-xs">
              <div class="flex justify-between text-neutral-600">
                <span>Subtotal:</span>
                <span>Rs. {{ ticketOrder.subtotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-neutral-600">
                <span>Delivery Fee:</span>
                <span>Rs. {{ ticketOrder.deliveryFee.toLocaleString() }}</span>
              </div>
              <div v-if="ticketOrder.discount" class="flex justify-between text-red-600 font-bold">
                <span>Discount:</span>
                <span>-Rs. {{ ticketOrder.discount.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between font-black text-base pt-1.5 border-t-2 border-neutral-900 text-neutral-900">
                <span>TOTAL DUE:</span>
                <span>Rs. {{ ticketOrder.total.toLocaleString() }}</span>
              </div>
              <p class="text-[10px] font-bold text-left pt-1 text-neutral-700">
                Payment: {{ ticketOrder.paymentMethod.toUpperCase() }} ({{ ticketOrder.paymentStatus.toUpperCase() }})
              </p>
            </div>

            <!-- Footer Quality Check & Barcode -->
            <div class="text-center pt-3 border-t border-dashed border-neutral-800 text-[10px] text-neutral-600 space-y-1">
              <p class="font-bold text-neutral-900">✓ CHECKED & PACKED FRESH WITH CARE</p>
              <p class="text-[9px]">Please verify seal before receiving parcel</p>
              <div class="pt-2 font-mono tracking-widest text-xs font-bold text-neutral-800">
                *{{ ticketOrder.orderNumber }}*
              </div>
            </div>

            <!-- On-Screen Bottom Action Buttons (Hidden on Print) -->
            <div class="mt-5 pt-4 border-t border-neutral-200 flex gap-2 print:hidden">
              <button
                @click="triggerPrint"
                class="flex-1 bg-neutral-900 hover:bg-black text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>🖨️</span>
                <span>Print Box Slip</span>
              </button>
              <button
                @click="ticketOrder = null"
                class="border border-neutral-300 hover:bg-neutral-200 text-neutral-700 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════════════════════ -->
      <!-- 4. ADD / EDIT PRODUCT MODAL (SUPERADMIN ONLY)                              -->
      <!-- ═══════════════════════════════════════════════════════════════════════════ -->
      <div
        v-if="showProductModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        @click.self="showProductModal = false"
      >
        <div class="bg-dark-card border border-dark-border text-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
          <button
            @click="showProductModal = false"
            class="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            ✕
          </button>

          <h3 class="font-playfair text-xl font-bold mb-4">
            {{ editingProductId ? 'Edit Product Catalog' : 'Add New Bakery Product' }}
          </h3>

          <form @submit.prevent="saveProduct" class="space-y-4 text-xs">
            <div>
              <label class="block text-gray-300 font-semibold mb-1">Product Title</label>
              <input v-model="productForm.name" required type="text" class="input-dark w-full py-2.5" placeholder="e.g. Lotus Biscoff Cheesecake" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-gray-300 font-semibold mb-1">Category</label>
                <select v-model="productForm.category" class="input-dark w-full py-2.5">
                  <option value="cakes">Cakes</option>
                  <option value="pastries">Pastries</option>
                  <option value="desserts">Desserts</option>
                  <option value="beverages">Beverages</option>
                  <option value="deals">Deals</option>
                </select>
              </div>

              <div>
                <label class="block text-gray-300 font-semibold mb-1">Price (Rs.)</label>
                <input v-model.number="productForm.price" required type="number" class="input-dark w-full py-2.5" placeholder="2800" />
              </div>
            </div>

            <div>
              <label class="block text-gray-300 font-semibold mb-1">Image URL</label>
              <input v-model="productForm.image" type="url" class="input-dark w-full py-2.5" placeholder="https://images.unsplash.com/..." />
            </div>

            <div>
              <label class="block text-gray-300 font-semibold mb-1">Description</label>
              <textarea v-model="productForm.description" rows="2" class="input-dark w-full py-2" placeholder="Rich Belgian chocolate layers with crunchy hazelnut praline..."></textarea>
            </div>

            <div class="flex items-center gap-4 pt-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="productForm.isFeatured" type="checkbox" class="accent-primary" />
                <span>Featured Item</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="productForm.isBestSeller" type="checkbox" class="accent-primary" />
                <span>Best Seller</span>
              </label>
            </div>

            <div class="pt-4 border-t border-dark-border flex justify-end gap-2">
              <button
                type="button"
                @click="showProductModal = false"
                class="btn-outline py-2 px-4 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn-primary py-2 px-5 rounded-xl font-bold"
              >
                {{ editingProductId ? 'Save Changes' : 'Create Product' }}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLocationStore } from '@/stores/location'
import { branches } from '@/data/products'
import { API_BASE } from '@/lib/api'

const router = useRouter()
const authStore = useAuthStore()
const locationStore = useLocationStore()

// State
const currentTab = ref('orders')
const orders = ref([])
const adminProducts = ref([])
const staffMembers = ref([])
const stats = ref(null)

const isLoading = ref(false)
const isAudioEnabled = ref(true)
const lastKnownOrderCount = ref(0)
let pollInterval = null

// Filter States
const activeBranchId = ref('all')
const selectedStatusFilter = ref('')
const searchQuery = ref('')
const selectedProductCategory = ref('all')
const isTogglingStock = ref(null)

// Staff Login Form
const loginEmail = ref('')
const loginPassword = ref('')
const loginError = ref('')

// Print Box Slip
const ticketOrder = ref(null)

// Product Add / Edit Modal
const showProductModal = ref(false)
const editingProductId = ref(null)
const productForm = ref({
  name: '',
  category: 'cakes',
  price: 2500,
  originalPrice: null,
  image: '',
  description: '',
  isFeatured: false,
  isBestSeller: false,
  badge: '',
})

const statusOptions = [
  { label: 'All Orders', value: '' },
  { label: 'Received (New)', value: 'Received' },
  { label: 'Baking / Prep', value: 'Preparing' },
  { label: 'Dispatched', value: 'Dispatched' },
  { label: 'Delivered', value: 'Delivered' },
  { label: 'Cancelled', value: 'Cancelled' },
]

// Current active branch name label
const currentBranchName = computed(() => {
  if (authStore.isBranchManager) {
    return authStore.assignedBranchName || 'Assigned Branch Kitchen'
  }
  if (activeBranchId.value === 'all') {
    return 'All Nationwide Branches'
  }
  const found = branches.find(b => b.id === activeBranchId.value)
  return found ? found.name : 'All Nationwide Branches'
})

// Total Revenue for current view
const totalRevenue = computed(() => {
  return orders.value
    .filter(o => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0)
})

// Initialize Branch scope based on RBAC Role
function initBranchScope() {
  if (authStore.isBranchManager && authStore.assignedBranchId) {
    activeBranchId.value = authStore.assignedBranchId
  } else if (authStore.isSuperAdmin) {
    activeBranchId.value = 'all'
  }
}

// Play notification bell chime via Web Audio API (cross-browser synthesis)
function playChimeSound() {
  if (!isAudioEnabled.value) return
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()

    // First note
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
    gain1.gain.setValueAtTime(0.3, ctx.currentTime)
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(ctx.currentTime)
    osc1.stop(ctx.currentTime + 0.6)

    // Second harmonious note
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'triangle'
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.15) // A5
    gain2.gain.setValueAtTime(0.3, ctx.currentTime + 0.15)
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(ctx.currentTime + 0.15)
    osc2.stop(ctx.currentTime + 0.8)
  } catch (err) {
    console.warn('Audio chime notice:', err)
  }
}

function toggleAudioChime() {
  isAudioEnabled.value = !isAudioEnabled.value
  if (isAudioEnabled.value) {
    playChimeSound()
  }
}

// Fetch Orders with RBAC enforcement
async function fetchOrders() {
  isLoading.value = true
  try {
    const params = new URLSearchParams()

    // Branch isolation: Branch Manager can ONLY query their branch
    const branchToQuery = authStore.isBranchManager
      ? authStore.assignedBranchId
      : (activeBranchId.value !== 'all' ? activeBranchId.value : '')

    if (branchToQuery) params.append('branchId', branchToQuery)
    if (selectedStatusFilter.value) params.append('status', selectedStatusFilter.value)
    if (searchQuery.value.trim()) params.append('search', searchQuery.value.trim())

    const res = await fetch(`${API_BASE}/admin/orders?${params.toString()}`)
    if (res.ok) {
      const data = await res.json()
      // Detect newly arrived order and trigger audio chime!
      if (lastKnownOrderCount.value > 0 && data.length > lastKnownOrderCount.value) {
        playChimeSound()
      }
      lastKnownOrderCount.value = data.length
      orders.value = data
    }
  } catch (err) {
    console.error('Error fetching admin orders:', err)
  } finally {
    isLoading.value = false
  }
}

// Update Order Status in Kitchen
async function updateStatus(id, newStatus, paymentStatus = null) {
  try {
    const payload = { status: newStatus }
    if (paymentStatus) payload.paymentStatus = paymentStatus

    const res = await fetch(`${API_BASE}/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      fetchOrders()
    }
  } catch (err) {
    console.error('Error updating order status:', err)
  }
}

// Fetch Products with Branch Availability
async function fetchAdminProducts() {
  try {
    const branchToQuery = authStore.isBranchManager
      ? authStore.assignedBranchId
      : (activeBranchId.value !== 'all' ? activeBranchId.value : '')

    const params = new URLSearchParams()
    if (branchToQuery) params.append('branchId', branchToQuery)
    if (selectedProductCategory.value !== 'all') params.append('category', selectedProductCategory.value)

    const res = await fetch(`${API_BASE}/admin/products?${params.toString()}`)
    if (res.ok) {
      adminProducts.value = await res.json()
    }
  } catch (err) {
    console.error('Error fetching admin products:', err)
  }
}

// Toggle Stock for this branch
async function toggleProductStock(product) {
  isTogglingStock.value = product.id
  try {
    const branchTarget = authStore.isBranchManager
      ? authStore.assignedBranchId
      : (activeBranchId.value !== 'all' ? activeBranchId.value : 'fsd-kohinoor')

    const newStockState = !product.isAvailable

    const res = await fetch(`${API_BASE}/admin/products/${product.id}/branch-stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        branchId: branchTarget,
        isAvailable: newStockState,
        stockCount: newStockState ? 50 : 0,
      }),
    })

    if (res.ok) {
      product.isAvailable = newStockState
      // Also notify customer location store to refresh
      locationStore.fetchBranchProducts()
    }
  } catch (err) {
    console.error('Error toggling branch product stock:', err)
  } finally {
    isTogglingStock.value = null
  }
}

// Fetch Admin Stats
async function fetchStats() {
  try {
    const res = await fetch(`${API_BASE}/admin/stats`)
    if (res.ok) {
      stats.value = await res.json()
    }
  } catch (err) {
    console.error('Error fetching stats:', err)
  }
}

// Fetch Staff Directory (Superadmin)
async function fetchStaff() {
  if (!authStore.isSuperAdmin) return
  try {
    const res = await fetch(`${API_BASE}/admin/staff`)
    if (res.ok) {
      staffMembers.value = await res.json()
    }
  } catch (err) {
    console.error('Error fetching staff directory:', err)
  }
}

function getBranchOrderCount(bId) {
  if (!stats.value?.branchBreakdown) return 0
  const found = stats.value.branchBreakdown.find(b => b.branchId === bId)
  return found ? found.orderCount : 0
}

function getBranchRevenue(bId) {
  if (!stats.value?.branchBreakdown) return 0
  const found = stats.value.branchBreakdown.find(b => b.branchId === bId)
  return found ? (found.revenue || 0) : 0
}

// Direct Staff Login
async function handleDirectLogin() {
  loginError.value = ''
  try {
    const res = await authStore.loginUser({
      email: loginEmail.value,
      password: loginPassword.value,
    })
    if (res.user.role === 'customer') {
      loginError.value = 'Access denied: Customer accounts cannot access the Staff Branch CMS. Please use a Staff account.'
      authStore.logout()
      return
    }
    initBranchScope()
    fetchOrders()
    fetchAdminProducts()
    fetchStats()
    fetchStaff()
  } catch (err) {
    loginError.value = err.message || 'Login failed'
  }
}

// Quick 1-Click Role Login
async function quickLogin(email, password) {
  loginEmail.value = email
  loginPassword.value = password
  await handleDirectLogin()
}

function handleLogout() {
  authStore.logout()
  orders.value = []
}

function handleBranchChange() {
  fetchOrders()
  fetchAdminProducts()
}

// Print Box Ticket
function openPrintTicket(order) {
  ticketOrder.value = order
}

function triggerPrint() {
  window.print()
}

// Superadmin Product Management
function openAddProductModal() {
  editingProductId.value = null
  productForm.value = {
    name: '',
    category: 'cakes',
    price: 2500,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
    description: '',
    isFeatured: false,
    isBestSeller: false,
    badge: 'Popular',
  }
  showProductModal.value = true
}

function openEditProductModal(prod) {
  editingProductId.value = prod.id
  productForm.value = {
    name: prod.name,
    category: prod.category,
    price: prod.price,
    originalPrice: prod.originalPrice || null,
    image: prod.image,
    description: prod.description || '',
    isFeatured: prod.isFeatured,
    isBestSeller: prod.isBestSeller,
    badge: prod.badge || '',
  }
  showProductModal.value = true
}

async function saveProduct() {
  try {
    const url = editingProductId.value
      ? `${API_BASE}/admin/products/${editingProductId.value}`
      : `${API_BASE}/admin/products`

    const method = editingProductId.value ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productForm.value),
    })

    if (res.ok) {
      showProductModal.value = false
      fetchAdminProducts()
    }
  } catch (err) {
    console.error('Error saving product:', err)
  }
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to remove this product from catalog?')) return
  try {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      fetchAdminProducts()
    }
  } catch (err) {
    console.error('Error deleting product:', err)
  }
}

// Style helpers
function statusBadgeClass(status) {
  const map = {
    Received: 'badge badge-gold',
    Preparing: 'badge bg-amber-500 text-black',
    Dispatched: 'badge bg-blue-500 text-white',
    Delivered: 'badge badge-green',
    Cancelled: 'badge badge-red',
  }
  return map[status] || 'badge badge-gold'
}

function statusBorderClass(status) {
  const map = {
    Received: 'border-primary/50 shadow-lg shadow-primary/5',
    Preparing: 'border-amber-500/50',
    Dispatched: 'border-blue-500/50',
    Delivered: 'border-emerald-500/40 opacity-85',
    Cancelled: 'border-red-500/30 opacity-60',
  }
  return map[status] || 'border-dark-border'
}

onMounted(() => {
  initBranchScope()
  if (authStore.isStaff) {
    fetchOrders()
    fetchAdminProducts()
    fetchStats()
    fetchStaff()
    // Live KDS Polling every 5 seconds
    pollInterval = setInterval(fetchOrders, 5000)
  }
})

watch(() => authStore.isStaff, (isStaff) => {
  if (isStaff) {
    initBranchScope()
    fetchOrders()
    fetchAdminProducts()
    fetchStats()
    fetchStaff()
    if (!pollInterval) {
      pollInterval = setInterval(fetchOrders, 5000)
    }
  } else {
    if (pollInterval) clearInterval(pollInterval)
  }
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})
</script>

<style scoped>
/* Custom receipt scrollbar on screen */
#printable-slip::-webkit-scrollbar {
  width: 6px;
}
#printable-slip::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}
#printable-slip::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
#printable-slip::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.35);
}

@media print {
  /* Hide all background and UI elements */
  body * {
    visibility: hidden;
  }
  #printable-slip,
  #printable-slip * {
    visibility: visible;
  }
  #printable-slip {
    position: fixed;
    left: 0;
    top: 0;
    width: 80mm;
    margin: 0;
    padding: 8px 12px !important;
    background: white !important;
    color: black !important;
    border: none !important;
    box-shadow: none !important;
    max-height: none !important;
    overflow: visible !important;
    border-radius: 0 !important;
  }
  .print\:hidden {
    display: none !important;
  }
}
</style>

