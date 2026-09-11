<template>
  <div class="min-h-screen">
    <!-- Header -->
    <div class="bg-[#0A0A0A] border-b border-[#1E1E1E] py-10">
      <div class="container mx-auto px-4">
        <p class="text-primary text-xs uppercase tracking-widest font-semibold mb-1">Reach Us</p>
        <h1 class="font-playfair text-4xl font-bold text-white">Contact & Locations</h1>
        <div class="gold-line mt-3"></div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12 space-y-16">

      <!-- ── Contact Cards ────────────────────────────────────────────────── -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div v-for="info in contactCards" :key="info.title"
          class="bg-dark-card border border-dark-border rounded-2xl p-6 text-center hover:border-primary/40 transition-all group">
          <div class="w-14 h-14 mx-auto bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:bg-primary/20 transition-all">
            {{ info.icon }}
          </div>
          <h3 class="font-semibold text-white mb-1">{{ info.title }}</h3>
          <p class="text-gray-400 text-sm">{{ info.value }}</p>
          <a v-if="info.link" :href="info.link" class="text-primary text-xs mt-2 inline-block hover:underline">{{ info.linkText }}</a>
        </div>
      </div>

      <!-- ── City Filter & Branches ──────────────────────────────────────── -->
      <div>
        <!-- Header Actions: Title + GPS Auto-Detect Button -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <p class="text-primary text-xs uppercase tracking-widest font-semibold mb-1">Find Us</p>
            <h2 class="section-title">Our Branches</h2>
            <div class="gold-line mt-3"></div>
          </div>

          <button
            @click="handleLocateNearest"
            :disabled="locationStore.isLocating"
            class="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary border border-primary/30 text-primary hover:text-[#0D0D0D] px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 self-start sm:self-auto"
          >
            <svg v-if="!locationStore.isLocating" class="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span v-else class="animate-spin">⏳</span>
            {{ locationStore.isLocating ? 'Locating...' : 'Find Nearest Branch (Live GPS)' }}
          </button>
        </div>

        <!-- City Filter Tabs -->
        <div class="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-6">
          <button
            v-for="city in branchCities"
            :key="city"
            @click="activeCity = city"
            class="flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all"
            :class="activeCity === city
              ? 'bg-primary text-[#0D0D0D] font-semibold'
              : 'bg-dark-card border border-dark-border text-gray-400 hover:border-primary/40 hover:text-primary'"
          >
            {{ city }}
            <span v-if="city === 'Faisalabad'" class="ml-1 text-[10px] bg-amber-500 text-black px-1.5 py-0.2 rounded-full font-bold">NEW</span>
          </button>
        </div>

        <!-- Branch Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="branch in filteredBranches"
            :key="branch.name"
            class="bg-dark-card border rounded-2xl p-5 transition-all group flex flex-col justify-between"
            :class="locationStore.selectedBranch?.name === branch.name
              ? 'border-primary shadow-lg shadow-primary/10 ring-1 ring-primary/50'
              : 'border-dark-border hover:border-primary/40'"
          >
            <div>
              <div class="flex items-start justify-between mb-3">
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="font-semibold text-white leading-snug">{{ branch.name }}</h3>
                    <span v-if="locationStore.selectedBranch?.name === branch.name" class="badge badge-gold text-[9px]">Active</span>
                  </div>
                  <p v-if="branchDistance(branch) !== null" class="text-xs text-emerald-400 font-medium mt-0.5">
                    📍 {{ branchDistance(branch) }} km from your location
                  </p>
                </div>
                <span class="badge badge-green text-[10px] flex-shrink-0 ml-2">Open</span>
              </div>
              <div class="space-y-2.5 text-sm text-gray-400">
                <div class="flex items-start gap-2">
                  <span class="text-primary mt-0.5 flex-shrink-0">📍</span>
                  <span>{{ branch.address }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-primary flex-shrink-0">📞</span>
                  <a :href="`tel:${branch.phone}`" class="hover:text-primary transition-colors">{{ branch.phone }}</a>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-primary flex-shrink-0">⏰</span>
                  <span>{{ branch.hours }}</span>
                </div>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-dark-border/60 flex items-center gap-2">
              <button
                @click="selectBranch(branch)"
                class="flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all"
                :class="locationStore.selectedBranch?.name === branch.name
                  ? 'bg-primary text-[#0D0D0D]'
                  : 'bg-primary/10 text-primary hover:bg-primary hover:text-[#0D0D0D]'"
              >
                {{ locationStore.selectedBranch?.name === branch.name ? '✓ Selected' : 'Order Here' }}
              </button>
              <a
                :href="branch.mapUrl"
                target="_blank"
                rel="noopener"
                class="py-2 px-3 rounded-xl border border-dark-border text-gray-400 hover:border-primary/40 hover:text-primary text-xs transition-all flex items-center gap-1"
                title="Directions"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Maps
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Map Embed ──────────────────────────────────────────────────────── -->
      <div class="rounded-2xl overflow-hidden border border-dark-border h-72">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d435985.5282048986!2d74.01272695!3d31.52003635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190483e58107d9%3A0xc23abe6ccc7e2462!2sLahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1234567890"
          width="100%" height="100%" style="border:0; filter: invert(0.9) hue-rotate(180deg) saturate(0.5);"
          allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <!-- ── Contact Form ───────────────────────────────────────────────────── -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <p class="text-primary text-xs uppercase tracking-widest font-semibold mb-1">Get in Touch</p>
          <h2 class="section-title mb-2">Send Us a Message</h2>
          <div class="gold-line mt-3 mb-5"></div>
          <p class="text-gray-400 leading-relaxed mb-6">
            Have a question, a custom order inquiry, or feedback? We'd love to hear from you. Fill in the form and our team will get back to you within 24 hours.
          </p>
          <div class="space-y-3">
            <div v-for="h in highlights" :key="h" class="flex items-center gap-3 text-sm text-gray-300">
              <span class="text-primary">✓</span>
              {{ h }}
            </div>
          </div>
        </div>

        <div class="bg-dark-card border border-dark-border rounded-2xl p-6">
          <form @submit.prevent="sendMessage" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Name *</label>
                <input v-model="contactForm.name" type="text" required placeholder="Your name" class="input-dark" />
              </div>
              <div>
                <label class="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Email *</label>
                <input v-model="contactForm.email" type="email" required placeholder="your@email.com" class="input-dark" />
              </div>
            </div>
            <div>
              <label class="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Phone</label>
              <input v-model="contactForm.phone" type="tel" placeholder="0300-XXXXXXX" class="input-dark" />
            </div>
            <div>
              <label class="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Subject *</label>
              <select v-model="contactForm.subject" required class="input-dark">
                <option value="">Select a subject</option>
                <option>Custom Order Inquiry</option>
                <option>Delivery Issue</option>
                <option>General Question</option>
                <option>Feedback</option>
                <option>Corporate Order</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Message *</label>
              <textarea v-model="contactForm.message" required rows="4" placeholder="Tell us how we can help..." class="input-dark resize-none"></textarea>
            </div>
            <button type="submit" :disabled="messageSent" class="w-full btn-primary justify-center py-3 rounded-xl disabled:opacity-60">
              <span v-if="messageSent">✅ Message Sent!</span>
              <span v-else>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { branches } from '@/data/products'
import { useLocationStore, calculateDistanceKm } from '@/stores/location'

const router = useRouter()
const locationStore = useLocationStore()

const activeCity = ref(locationStore.selectedCity || 'Faisalabad')

const branchCities = [...new Set(branches.map(b => b.city))]
const filteredBranches = computed(() => branches.filter(b => b.city.toLowerCase() === activeCity.value.toLowerCase()))

watch(
  () => locationStore.selectedCity,
  (newCity) => {
    if (newCity) activeCity.value = newCity
  }
)

function branchDistance(branch) {
  if (!locationStore.userCoordinates || !branch.coords) return null
  const dist = calculateDistanceKm(
    locationStore.userCoordinates.lat,
    locationStore.userCoordinates.lng,
    branch.coords.lat,
    branch.coords.lng
  )
  return Math.round(dist * 10) / 10
}

async function handleLocateNearest() {
  try {
    const result = await locationStore.detectLiveLocation()
    if (result && result.branch) {
      activeCity.value = result.branch.city
    }
  } catch (err) {
    console.error('Failed to locate branch:', err)
  }
}

function selectBranch(branch) {
  locationStore.setBranch(branch)
  router.push('/menu')
}

const contactCards = [
  { icon: '📞', title: 'Call Us',    value: '0300-1234567', link: 'tel:03001234567', linkText: 'Tap to Call' },
  { icon: '✉️', title: 'Email Us',   value: 'hello@mybakery.pk', link: 'mailto:hello@mybakery.pk', linkText: 'Send Email' },
  { icon: '⏰', title: 'Open Hours', value: 'Daily 8 AM – 12 AM' },
]

const highlights = [
  'Custom cake orders within 48 hours',
  'Bulk / corporate orders available',
  'Delivery across Pakistan',
  'Responds within 24 hours',
]

const contactForm = ref({ name: '', email: '', phone: '', subject: '', message: '' })
const messageSent = ref(false)

function sendMessage() {
  messageSent.value = true
  setTimeout(() => messageSent.value = false, 4000)
  contactForm.value = { name: '', email: '', phone: '', subject: '', message: '' }
}
</script>

