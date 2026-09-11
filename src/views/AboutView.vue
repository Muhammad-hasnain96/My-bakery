<template>
  <div class="min-h-screen">
    <!-- Hero -->
    <div class="relative h-80 overflow-hidden">
      <img src="https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=1400&q=80" class="w-full h-full object-cover" />
      <div class="absolute inset-0 hero-overlay-vertical flex items-end">
        <div class="container mx-auto px-4 pb-10">
          <p class="text-primary text-xs uppercase tracking-widest font-semibold mb-1">Who We Are</p>
          <h1 class="font-playfair text-5xl font-bold text-white">Our Story</h1>
          <div class="gold-line mt-3"></div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-14 space-y-20">

      <!-- Story -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div>
          <p class="text-primary text-xs uppercase tracking-widest font-semibold mb-3">Est. 2010</p>
          <h2 class="font-playfair text-4xl font-bold text-white mb-4">
            Baked with Passion,<br/><span class="text-primary italic">Served with Love</span>
          </h2>
          <div class="gold-line mb-5"></div>
          <div class="space-y-4 text-gray-300 leading-relaxed">
            <p>
              My Bakery was founded in 2010 with a simple dream: to bring premium-quality, artisan baked goods to every home in Pakistan. What started as a small kitchen in Lahore has grown into a beloved brand with branches across the country.
            </p>
            <p>
              Every cake is hand-crafted by our award-winning pastry chefs, using only the finest ingredients sourced locally and internationally. From our signature Chocolate Truffle Cake to our custom wedding tiers, each creation is made with uncompromising love and skill.
            </p>
            <p>
              Today, with over 50,000 happy customers and 7 branches across Pakistan, we continue to honour that original vision — one slice at a time.
            </p>
          </div>
          <div class="flex flex-wrap gap-4 mt-8">
            <RouterLink to="/menu" class="btn-primary px-8 py-4 rounded-2xl">Explore Menu</RouterLink>
            <RouterLink to="/contact" class="btn-outline px-8 py-4 rounded-2xl">Contact Us</RouterLink>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80" class="rounded-2xl h-52 w-full object-cover col-span-2" />
          <img src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80" class="rounded-2xl h-40 w-full object-cover" />
          <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80" class="rounded-2xl h-40 w-full object-cover" />
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-5">
        <div v-for="stat in stats" :key="stat.label"
          class="bg-dark-card border border-dark-border rounded-2xl p-5 text-center hover:border-primary/40 transition-all group">
          <span class="text-3xl block mb-2">{{ stat.icon }}</span>
          <p class="font-playfair text-3xl font-bold text-primary">{{ stat.value }}</p>
          <p class="text-gray-400 text-sm mt-1">{{ stat.label }}</p>
        </div>
      </div>

      <!-- Values -->
      <div>
        <div class="text-center mb-10">
          <p class="text-primary text-xs uppercase tracking-widest font-semibold mb-1">What Drives Us</p>
          <h2 class="section-title">Our Values</h2>
          <div class="gold-line mt-3 mx-auto"></div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div v-for="val in values" :key="val.title"
            class="bg-dark-card border border-dark-border rounded-2xl p-5 hover:border-primary/40 transition-all">
            <div class="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-xl mb-4">
              {{ val.icon }}
            </div>
            <h3 class="font-semibold text-white mb-2">{{ val.title }}</h3>
            <p class="text-gray-400 text-sm leading-relaxed">{{ val.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Team & Leadership -->
      <div>
        <div class="text-center mb-12">
          <p class="text-primary text-xs uppercase tracking-widest font-semibold mb-1">Our Leadership & Chefs</p>
          <h2 class="section-title">The People Behind the Magic</h2>
          <div class="gold-line mt-3 mx-auto"></div>
          <p class="text-gray-400 text-sm mt-3 max-w-xl mx-auto">
            Driven by visionary leadership and master artisan pastry craftsmanship across Pakistan.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="member in team"
            :key="member.name"
            class="bg-dark-card border border-dark-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 group flex flex-col shadow-xl hover:-translate-y-1"
          >
            <!-- Member Photo -->
            <div class="h-72 sm:h-80 overflow-hidden relative bg-[#141414]">
              <img
                :src="member.image"
                :alt="member.name"
                class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/70 via-transparent to-transparent opacity-60"></div>
              <!-- Role Badge -->
              <div v-if="member.badge" class="absolute top-3 left-3 z-10">
                <span class="badge badge-gold text-[10px] font-bold shadow-md">
                  {{ member.badge }}
                </span>
              </div>
            </div>

            <!-- Member Info -->
            <div class="p-5 flex flex-col flex-1 text-center">
              <h3 class="font-playfair text-lg font-bold text-white mb-1">{{ member.name }}</h3>
              <p class="text-primary text-xs font-semibold uppercase tracking-wider mb-2">{{ member.role }}</p>
              <div class="w-8 h-0.5 bg-primary/30 mx-auto mb-3"></div>
              <p class="text-gray-400 text-xs leading-relaxed flex-1">{{ member.bio }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="relative rounded-3xl overflow-hidden">
        <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400&q=80" class="w-full h-64 object-cover" />
        <div class="absolute inset-0 bg-[#0D0D0D]/80 flex flex-col items-center justify-center text-center px-6">
          <h2 class="font-playfair text-4xl font-bold text-white mb-3">Ready to Indulge?</h2>
          <p class="text-gray-300 mb-6">Explore our full menu and order fresh today</p>
          <RouterLink to="/menu" class="btn-primary px-10 py-4 rounded-2xl">
            Order Now 🎂
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ceoImg from '@/assets/images/team/muhammad-hasnain.jpg'
import opsImg from '@/assets/images/team/ahtisham-hussain.jpg'

const stats = [
  { icon: '😊', value: '50K+',  label: 'Happy Customers' },
  { icon: '🏪', value: '7',     label: 'Branches' },
  { icon: '🎂', value: '200+',  label: 'Menu Items' },
  { icon: '⭐', value: '4.9',   label: 'Average Rating' },
]

const values = [
  { icon: '🏆', title: 'Premium Quality',   desc: 'We use only the finest ingredients — Belgian chocolate, imported cream, and local seasonal fruits.' },
  { icon: '💛', title: 'Made with Love',    desc: 'Every single item is hand-crafted with care and passion by our expert pastry chefs.' },
  { icon: '⚡', title: 'Fast Delivery',     desc: 'We deliver fresh, on time, across all our delivery zones — usually within 45–60 minutes.' },
  { icon: '🎨', title: 'Custom Creations',  desc: 'Your vision, our expertise. We bring your dream cake to life for any occasion.' },
]

const team = [
  {
    name: 'Muhammad Hasnain',
    role: 'CEO & Founder',
    badge: 'CEO & Founder',
    image: ceoImg,
    bio: 'Visionary entrepreneur and founder of My Bakery, inspiring culinary excellence and expansion across Pakistan.',
  },
  {
    name: 'Ahtisham Hussain',
    role: 'Operation Manager',
    badge: 'Operations',
    image: opsImg,
    bio: 'Directs logistics, nationwide kitchen operations, and ensures every artisan order is delivered in under 60 minutes.',
  },
  {
    name: 'Chef Fatima',
    role: 'Head Pastry Chef',
    badge: 'Master Chef',
    image: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf7?w=400&q=80',
    bio: '15 years of culinary expertise crafting signature sponge cakes, fine French tarts, and Belgian truffles.',
  },
  {
    name: 'Ali Raza',
    role: 'Lead Cake Designer',
    badge: 'Design',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    bio: 'Master cake sculptor specializing in custom multi-tier wedding cakes and bespoke artisan creations.',
  },
]
</script>

