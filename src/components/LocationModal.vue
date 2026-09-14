<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click.self="$emit('update:modelValue', false)"
    >
      <div class="absolute inset-0 bg-black/75 backdrop-blur-sm" @click="$emit('update:modelValue', false)"></div>

      <Transition name="scale">
        <div
          v-if="modelValue"
          class="relative bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl w-full max-w-lg shadow-2xl z-10 animate-slide-up overflow-hidden"
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-5 border-b border-[#2A2A2A]">
            <div>
              <h2 class="font-playfair text-xl font-bold text-white flex items-center gap-2">
                <span>📍</span> Select Your Location & Branch
              </h2>
              <p class="text-xs text-gray-400 mt-0.5">Choose your city or find the closest branch automatically</p>
            </div>
            <button
              @click="$emit('update:modelValue', false)"
              class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Live GPS Auto-Detect Button -->
          <div class="p-5 pb-2">
            <button
              @click="handleAutoDetect"
              :disabled="locationStore.isLocating"
              class="w-full relative overflow-hidden group bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/40 hover:border-primary p-4 rounded-xl text-left transition-all duration-300 flex items-center justify-between"
            >
              <div class="flex items-center gap-3.5">
                <div class="w-11 h-11 rounded-xl bg-primary text-[#0D0D0D] flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20 flex-shrink-0">
                  <svg v-if="!locationStore.isLocating" class="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span v-else class="text-sm font-bold animate-spin">⏳</span>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-white font-semibold text-sm group-hover:text-primary transition-colors">
                      {{ locationStore.isLocating ? 'Detecting Your GPS Location...' : 'Use My Live Location' }}
                    </h3>
                    <span class="badge badge-gold text-[9px]">Auto Select</span>
                  </div>
                  <p class="text-xs text-gray-400 mt-0.5">
                    Calculates distance & auto-picks the nearest branch in real-time
                  </p>
                </div>
              </div>
              <svg class="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>

            <!-- Status / Error message -->
            <p v-if="locationStore.locationError" class="mt-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2 flex items-center gap-1.5">
              <span>⚠️</span> {{ locationStore.locationError }}
            </p>

            <!-- Detected Branch Confirmation Banner & Delivery Destination -->
            <div
              v-if="locationStore.selectedBranch"
              class="mt-3 bg-[#242424] border border-[#2E2E2E] rounded-xl p-3 space-y-2"
            >
              <div class="flex items-center justify-between">
                <div class="min-w-0 flex-1 pr-2">
                  <div class="flex items-center gap-1.5">
                    <span class="text-xs">🏪</span>
                    <p class="text-[10px] uppercase font-bold text-primary tracking-wider">Fulfilling Branch</p>
                  </div>
                  <p class="text-sm font-semibold text-white truncate">{{ locationStore.selectedBranch.name }}</p>
                  <p class="text-xs text-gray-400 truncate">{{ locationStore.selectedBranch.address }}</p>
                </div>
                <div v-if="locationStore.detectedDistance !== null" class="text-right flex-shrink-0">
                  <span
                    class="badge text-[10px] font-bold"
                    :class="locationStore.detectedDistance <= 10 ? 'badge-green' : 'bg-red-500/20 text-red-300 border border-red-500/30'"
                  >
                    {{ locationStore.detectedDistance }} km
                    {{ locationStore.detectedDistance <= 10 ? '(Delivery & Pickup)' : '(Outside 10 km — Pickup Only)' }}
                  </span>
                </div>
              </div>

              <!-- Delivery Destination Pin -->
              <div v-if="locationStore.deliveryAddress" class="pt-2 border-t border-[#333] flex items-center gap-2 text-xs text-amber-300">
                <span class="text-sm">📍</span>
                <div class="min-w-0 flex-1">
                  <span class="text-[10px] uppercase tracking-wider text-gray-400 block font-medium">Your Delivery Location:</span>
                  <p class="truncate font-semibold text-white">{{ locationStore.deliveryAddress }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="px-5 py-2 flex items-center gap-3">
            <div class="flex-1 h-px bg-[#2A2A2A]"></div>
            <span class="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Or Select City</span>
            <div class="flex-1 h-px bg-[#2A2A2A]"></div>
          </div>

          <!-- City Grid -->
          <div class="p-5 pt-2 max-h-60 overflow-y-auto">
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <button
                v-for="city in availableCities"
                :key="city"
                @click="selectCity(city)"
                class="flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 text-xs font-medium"
                :class="locationStore.selectedCity.toLowerCase() === city.toLowerCase()
                  ? 'border-primary bg-primary/15 text-primary shadow-sm'
                  : 'border-[#2A2A2A] text-gray-300 hover:border-primary/40 hover:text-primary hover:bg-primary/5'"
              >
                <span class="text-xl">{{ cityEmojis[city] || '🏙️' }}</span>
                <span class="font-semibold">{{ city }}</span>
                <span v-if="city === 'Faisalabad'" class="badge badge-gold text-[8px] py-0 px-1.5">New Branch</span>
                <span v-else-if="locationStore.selectedCity.toLowerCase() === city.toLowerCase()" class="text-[9px] uppercase tracking-wide text-primary">Selected</span>
              </button>
            </div>
          </div>

          <!-- Footer note -->
          <div class="px-5 py-3.5 bg-[#141414] border-t border-[#2A2A2A]">
            <p class="text-xs text-gray-400 text-center flex items-center justify-center gap-1.5">
              <span class="text-primary font-bold">🛵</span>
              Delivery available within <strong>10 km radius</strong> of your local kitchen
            </p>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { cities } from '@/data/products'
import { useLocationStore } from '@/stores/location'

defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue', 'branchSelected'])

const locationStore = useLocationStore()

const availableCities = cities

const cityEmojis = {
  Lahore: '🏛️',
  Karachi: '🌊',
  Islamabad: '🌿',
  Rawalpindi: '🏙️',
  Faisalabad: '🏭',
  Multan: '☀️',
  Peshawar: '🏔️',
  Gujranwala: '🌾',
  Sialkot: '⚽',
  Quetta: '❄️',
}

async function handleAutoDetect() {
  try {
    const result = await locationStore.detectLiveLocation()
    if (result && result.branch) {
      localStorage.setItem('locationConfirmed', 'true')
      emit('branchSelected', {
        branch: result.branch,
        distanceKm: result.distanceKm,
        deliveryAddress: result.deliveryAddress,
        isAuto: true,
      })
      setTimeout(() => emit('update:modelValue', false), 800)
    }
  } catch (err) {
    console.error('Location detection failed:', err)
  }
}

function selectCity(city) {
  locationStore.setCity(city)
  localStorage.setItem('locationConfirmed', 'true')
  emit('branchSelected', {
    branch: locationStore.selectedBranch,
    city: city,
    isAuto: false,
  })
  setTimeout(() => emit('update:modelValue', false), 300)
}
</script>
