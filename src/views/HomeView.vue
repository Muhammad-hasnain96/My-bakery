<template>
  <div>
    <!-- ═══ HERO BANNER ══════════════════════════════════════════════════════ -->
    <section class="relative h-[90vh] min-h-[520px] overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0">
        <img
          :src="slides[currentSlide].image"
          :alt="slides[currentSlide].title"
          class="w-full h-full object-cover transition-opacity duration-1000"
        />
        <!-- Gradient overlay -->
        <div class="absolute inset-0 hero-overlay-horizontal"></div>
        <div class="absolute inset-0 hero-overlay-vertical opacity-80"></div>
      </div>

      <!-- Content -->
      <div class="relative container mx-auto px-4 h-full flex items-center">
        <div class="max-w-2xl">
          <!-- Tag -->
          <div class="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-1.5 mb-6">
            <span class="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
            <span class="text-primary text-xs font-semibold uppercase tracking-widest">Fresh Today</span>
          </div>

          <!-- Title -->
          <Transition name="fade" mode="out-in">
            <h1 :key="currentSlide" class="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
              {{ slides[currentSlide].title }}
              <span class="text-primary italic block">{{ slides[currentSlide].subtitle }}</span>
            </h1>
          </Transition>

          <!-- Description -->
          <Transition name="fade" mode="out-in">
            <p :key="currentSlide" class="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
              {{ slides[currentSlide].description }}
            </p>
          </Transition>

          <!-- Accent text -->
          <p class="text-primary/60 text-sm font-medium mb-8 tracking-wide">
            ✨ {{ slides[currentSlide].accent }}
          </p>

          <!-- CTAs -->
          <div class="flex flex-wrap gap-4">
            <RouterLink to="/menu" class="btn-primary text-base px-8 py-4 rounded-2xl shadow-lg shadow-primary/20">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              {{ slides[currentSlide].cta }}
            </RouterLink>
            <RouterLink to="/about" class="btn-outline text-base px-8 py-4 rounded-2xl">
              Our Story
            </RouterLink>
          </div>

          <!-- Stats -->
          <div class="flex gap-8 mt-10">
            <div v-for="stat in stats" :key="stat.label" class="text-center">
              <p class="font-playfair text-2xl font-bold text-primary">{{ stat.value }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ stat.label }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Slide Controls -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        <button
          v-for="(slide, i) in slides"
          :key="i"
          @click="goToSlide(i)"
          class="h-1.5 rounded-full transition-all duration-300"
          :class="currentSlide === i ? 'w-8 bg-primary' : 'w-3 bg-white/30 hover:bg-white/60'"
        ></button>
      </div>

      <!-- Prev / Next -->
      <button @click="prevSlide" class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-all">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <button @click="nextSlide" class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-all">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </button>
    </section>

    <!-- ═══ HOW IT WORKS ══════════════════════════════════════════════════════ -->
    <section class="py-14 bg-[#111]">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div v-for="step in howItWorks" :key="step.step" class="flex flex-col items-center gap-3">
            <div class="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-3xl">
              {{ step.icon }}
            </div>
            <div class="w-8 h-0.5 bg-primary/40 rounded-full"></div>
            <div>
              <span class="text-[10px] text-primary uppercase tracking-widest font-semibold">Step {{ step.step }}</span>
              <h3 class="text-white font-semibold mt-1">{{ step.title }}</h3>
              <p class="text-gray-400 text-sm mt-1">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ CATEGORIES ════════════════════════════════════════════════════════ -->
    <section class="py-16 container mx-auto px-4">
      <div class="flex items-center justify-between mb-8">
        <div>
          <p class="text-primary text-xs uppercase tracking-widest font-semibold mb-1">Explore</p>
          <h2 class="section-title">Browse by Category</h2>
          <div class="gold-line mt-3"></div>
        </div>
        <RouterLink to="/menu" class="text-sm text-primary hover:text-primary-light transition-colors flex items-center gap-1 font-medium">
          View All <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </RouterLink>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <RouterLink
          v-for="cat in categories.filter(c => c.id !== 'all')"
          :key="cat.id"
          :to="`/menu`"
          class="group relative rounded-2xl overflow-hidden aspect-square"
        >
          <img :src="cat.image" :alt="cat.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div class="absolute inset-0 flex flex-col items-center justify-end pb-4 text-center">
            <span class="text-2xl mb-1">{{ cat.icon }}</span>
            <p class="keep-white text-sm font-semibold">{{ cat.name }}</p>
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- ═══ FEATURED PRODUCTS ═════════════════════════════════════════════════ -->
    <section class="py-16 bg-[#0A0A0A]">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <div>
            <p class="text-primary text-xs uppercase tracking-widest font-semibold mb-1">Handpicked</p>
            <h2 class="section-title">Featured Items</h2>
            <div class="gold-line mt-3"></div>
          </div>
          <RouterLink to="/menu" class="text-sm text-primary hover:text-primary-light transition-colors flex items-center gap-1 font-medium">
            View All <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </RouterLink>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
            @added="onProductAdded"
          />
        </div>
      </div>
    </section>

    <!-- ═══ PROMO BANNER ═══════════════════════════════════════════════════════ -->
    <section class="py-0">
      <div class="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400&q=80"
          alt="Special Offer"
          class="w-full h-80 object-cover"
        />
        <div class="absolute inset-0 hero-overlay-horizontal flex items-center">
          <div class="container mx-auto px-4">
            <div class="max-w-lg">
              <span class="badge badge-red mb-4 inline-block">Limited Time Offer 🔥</span>
              <h2 class="font-playfair text-4xl font-bold text-white mb-3">
                Get 20% Off Your<br/><span class="text-primary">First Order!</span>
              </h2>
              <p class="text-gray-300 mb-6 text-lg">Use code <span class="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">WELCOME20</span> at checkout</p>
              <RouterLink to="/menu" class="btn-primary px-8 py-4 rounded-2xl">
                Claim Offer 🎉
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ BEST SELLERS ════════════════════════════════════════════════════════ -->
    <section class="py-16 container mx-auto px-4">
      <div class="flex items-center justify-between mb-8">
        <div>
          <p class="text-primary text-xs uppercase tracking-widest font-semibold mb-1">Customer Favourites</p>
          <h2 class="section-title">Best Sellers</h2>
          <div class="gold-line mt-3"></div>
        </div>
        <RouterLink to="/menu" class="text-sm text-primary hover:text-primary-light transition-colors flex items-center gap-1 font-medium">
          View All <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </RouterLink>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        <ProductCard
          v-for="product in bestSellers"
          :key="product.id"
          :product="product"
          @added="onProductAdded"
        />
      </div>
    </section>

    <!-- ═══ SECOND PROMO ════════════════════════════════════════════════════════ -->
    <section class="py-16 bg-[#0A0A0A]">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Custom Cakes CTA -->
          <div class="relative rounded-2xl overflow-hidden h-56 md:h-64">
            <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=700&q=80" alt="Custom Cakes" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black/60 flex flex-col items-start justify-end p-6">
              <span class="badge badge-gold mb-2">Custom Orders</span>
              <h3 class="font-playfair text-2xl font-bold keep-white mb-1">Build Your Dream Cake</h3>
              <p class="keep-white opacity-90 text-sm mb-4">Custom cakes for any occasion, made to your exact vision.</p>
              <RouterLink to="/menu" class="bg-white text-[#0D0D0D] text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-colors">
                Order Custom
              </RouterLink>
            </div>
          </div>
          <!-- Pastries CTA -->
          <div class="relative rounded-2xl overflow-hidden h-56 md:h-64">
            <img src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=700&q=80" alt="Fresh Pastries" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black/60 flex flex-col items-start justify-end p-6">
              <span class="badge badge-green mb-2">Baked Fresh Daily</span>
              <h3 class="font-playfair text-2xl font-bold keep-white mb-1">Fresh Pastries Every Morning</h3>
              <p class="keep-white opacity-90 text-sm mb-4">Croissants, macarons, eclairs — baked fresh each morning.</p>
              <RouterLink to="/menu" class="bg-white text-[#0D0D0D] text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-colors">
                View Pastries
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ TESTIMONIALS (DYNAMIC & ANIMATED) ══════════════════════════════════ -->
    <section class="py-20 overflow-hidden relative">
      <!-- Success Toast for New Review -->
      <Transition name="fade">
        <div
          v-if="reviewSuccessToast"
          class="fixed bottom-6 right-6 z-50 bg-emerald-500 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up"
        >
          <span class="text-xl">🎉</span>
          <div>
            <p class="font-bold text-sm">Thank You for Your Review!</p>
            <p class="text-xs text-white/90">Your review is now live on our dynamic customer feed.</p>
          </div>
        </div>
      </Transition>

      <!-- Section Header -->
      <div class="container mx-auto px-4 mb-8">
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div class="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-3.5 py-1.5 mb-3">
              <span class="text-amber-400">★ ★ ★ ★ ★</span>
              <span class="text-xs font-semibold text-primary">4.9/5 Rating from 50K+ Customers</span>
            </div>
            <h2 class="section-title">What People Say</h2>
            <div class="gold-line mt-2"></div>
            <p class="text-gray-400 text-sm mt-2 max-w-lg">
              Live feedback and reviews from cake lovers across Lahore, Karachi, Islamabad, Faisalabad & Rawalpindi.
            </p>
          </div>

          <!-- Controls: City Filter + Animation Play/Pause + Mode Toggle + Write Review -->
          <div class="flex flex-wrap items-center gap-2.5">
            <!-- Play / Pause Toggle -->
            <button
              @click="isMarqueePaused = !isMarqueePaused"
              class="px-3.5 py-2 rounded-xl border border-dark-border bg-dark-card hover:border-primary/40 text-xs text-gray-300 hover:text-primary transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              :title="isMarqueePaused ? 'Resume Animation' : 'Pause Animation'"
            >
              <span>{{ isMarqueePaused ? '▶️ Resume Flow' : '⏸️ Pause Flow' }}</span>
            </button>

            <!-- Mode Switcher (Stream / Slider) -->
            <div class="bg-dark-card border border-dark-border rounded-xl p-1 flex items-center gap-1 shadow-sm">
              <button
                @click="viewMode = 'marquee'"
                class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                :class="viewMode === 'marquee' ? 'bg-primary text-[#0D0D0D] font-bold shadow' : 'text-gray-400 hover:text-white'"
              >
                🌊 Animated Wall
              </button>
              <button
                @click="viewMode = 'carousel'"
                class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                :class="viewMode === 'carousel' ? 'bg-primary text-[#0D0D0D] font-bold shadow' : 'text-gray-400 hover:text-white'"
              >
                🎠 Spotlight Slider
              </button>
            </div>

            <!-- Write a Review Button -->
            <button
              @click="openReviewModal"
              class="btn-primary text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <span>✍️</span> Write Review
            </button>
          </div>
        </div>

        <!-- City Filter Pills -->
        <div class="flex items-center gap-2 mt-6 overflow-x-auto pb-2 no-scrollbar">
          <button
            v-for="city in ['All', 'Faisalabad', 'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi']"
            :key="city"
            @click="selectedReviewCity = city"
            class="px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer"
            :class="selectedReviewCity.toLowerCase() === city.toLowerCase()
              ? 'bg-primary text-[#0D0D0D] font-bold shadow-md shadow-primary/20'
              : 'bg-dark-card border border-dark-border text-gray-400 hover:text-white hover:border-primary/40'"
          >
            {{ city === 'Faisalabad' ? '📍 Faisalabad (Kohinoor)' : city }}
          </button>
        </div>
      </div>

      <!-- Edge Gradient Masks for Smooth Flowing Fades -->
      <div class="pointer-events-none absolute left-0 top-40 bottom-0 w-16 sm:w-36 z-10 bg-gradient-to-r from-[--bg-page] to-transparent"></div>
      <div class="pointer-events-none absolute right-0 top-40 bottom-0 w-16 sm:w-36 z-10 bg-gradient-to-l from-[--bg-page] to-transparent"></div>

      <!-- VIEW MODE 1: DUAL-TRACK DYNAMIC CONTINUOUS MARQUEE STREAM -->
      <div v-if="viewMode === 'marquee'" class="space-y-5 py-2">
        <!-- Track 1 (Flows Left) -->
        <div class="overflow-hidden marquee-mask">
          <div
            class="animate-marquee-left flex gap-5 py-2"
            :class="{ 'marquee-paused': isMarqueePaused }"
          >
            <div
              v-for="(t, idx) in marqueeTrack1"
              :key="`track1-${t.id}-${idx}`"
              class="w-[320px] sm:w-[380px] flex-shrink-0 bg-dark-card border border-dark-border rounded-2xl p-5 hover:border-primary/60 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 relative group cursor-default"
            >
              <!-- Top Row: Stars + Verified Badge + Quote Mark -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-1">
                  <span v-for="i in 5" :key="i" class="text-sm text-primary">★</span>
                  <span class="text-xs text-primary font-bold ml-1.5">{{ t.rating }}.0</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span v-if="t.verified" class="badge badge-green text-[9px] py-0.5">Verified</span>
                  <span class="text-2xl text-primary/25 font-serif leading-none select-none">“</span>
                </div>
              </div>

              <!-- Product Tag -->
              <p v-if="t.product" class="text-[11px] text-amber-400 font-medium mb-2 flex items-center gap-1">
                <span>🎂</span> {{ t.product }}
              </p>

              <!-- Review Text -->
              <p class="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3 group-hover:line-clamp-none transition-all">
                "{{ t.review }}"
              </p>

              <!-- Customer Footnote -->
              <div class="flex items-center justify-between pt-3 border-t border-dark-border/60">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-primary/30 to-primary/10 border border-primary/40 flex items-center justify-center text-primary font-bold text-xs">
                    {{ t.avatar }}
                  </div>
                  <div>
                    <p class="text-white text-xs font-semibold">{{ t.name }}</p>
                    <p class="text-gray-500 text-[10px]">{{ t.branch || t.city }}</p>
                  </div>
                </div>
                <span class="text-[10px] text-gray-500">{{ t.date }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Track 2 (Flows Right) -->
        <div class="overflow-hidden marquee-mask">
          <div
            class="animate-marquee-right flex gap-5 py-2"
            :class="{ 'marquee-paused': isMarqueePaused }"
          >
            <div
              v-for="(t, idx) in marqueeTrack2"
              :key="`track2-${t.id}-${idx}`"
              class="w-[320px] sm:w-[380px] flex-shrink-0 bg-dark-card border border-dark-border rounded-2xl p-5 hover:border-primary/60 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 relative group cursor-default"
            >
              <!-- Top Row: Stars + Verified Badge + Quote Mark -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-1">
                  <span v-for="i in 5" :key="i" class="text-sm text-primary">★</span>
                  <span class="text-xs text-primary font-bold ml-1.5">{{ t.rating }}.0</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span v-if="t.verified" class="badge badge-green text-[9px] py-0.5">Verified</span>
                  <span class="text-2xl text-primary/25 font-serif leading-none select-none">“</span>
                </div>
              </div>

              <!-- Product Tag -->
              <p v-if="t.product" class="text-[11px] text-amber-400 font-medium mb-2 flex items-center gap-1">
                <span>🎂</span> {{ t.product }}
              </p>

              <!-- Review Text -->
              <p class="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3 group-hover:line-clamp-none transition-all">
                "{{ t.review }}"
              </p>

              <!-- Customer Footnote -->
              <div class="flex items-center justify-between pt-3 border-t border-dark-border/60">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-primary/30 to-primary/10 border border-primary/40 flex items-center justify-center text-primary font-bold text-xs">
                    {{ t.avatar }}
                  </div>
                  <div>
                    <p class="text-white text-xs font-semibold">{{ t.name }}</p>
                    <p class="text-gray-500 text-[10px]">{{ t.branch || t.city }}</p>
                  </div>
                </div>
                <span class="text-[10px] text-gray-500">{{ t.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- VIEW MODE 2: INTERACTIVE SPOTLIGHT CAROUSEL SLIDER -->
      <div v-else class="container mx-auto px-4 py-4">
        <div class="max-w-3xl mx-auto relative bg-dark-card border border-dark-border rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-1.5">
              <span v-for="i in 5" :key="i" class="text-lg text-primary">★</span>
              <span class="badge badge-gold text-xs ml-2">5.0 Star Experience</span>
            </div>
            <span class="text-5xl text-primary/25 font-serif leading-none select-none">“</span>
          </div>

          <Transition name="fade" mode="out-in">
            <div :key="carouselIndex" class="space-y-4">
              <p v-if="currentCarouselReview.product" class="text-xs text-amber-400 uppercase font-bold tracking-wider">
                🎂 {{ currentCarouselReview.product }}
              </p>
              <blockquote class="font-playfair text-xl sm:text-2xl text-white italic leading-relaxed">
                "{{ currentCarouselReview.review }}"
              </blockquote>
              <div class="flex items-center justify-between pt-6 border-t border-dark-border">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-base">
                    {{ currentCarouselReview.avatar }}
                  </div>
                  <div>
                    <h4 class="font-bold text-white text-base">{{ currentCarouselReview.name }}</h4>
                    <p class="text-xs text-gray-400">{{ currentCarouselReview.branch || currentCarouselReview.city }} · {{ currentCarouselReview.date }}</p>
                  </div>
                </div>
                <span class="badge badge-green text-xs">Verified Customer</span>
              </div>
            </div>
          </Transition>

          <!-- Carousel Controls: Prev / Dots / Next -->
          <div class="flex items-center justify-between mt-8 pt-4">
            <button
              @click="prevCarousel"
              class="w-10 h-10 rounded-full border border-dark-border hover:border-primary/50 text-white flex items-center justify-center hover:bg-primary/10 transition-all cursor-pointer"
            >
              ←
            </button>
            <div class="flex items-center gap-1.5">
              <button
                v-for="(r, i) in filteredReviews.slice(0, 8)"
                :key="i"
                @click="carouselIndex = i"
                class="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
                :class="carouselIndex === i ? 'w-6 bg-primary' : 'w-2 bg-dark-border hover:bg-gray-500'"
              ></button>
            </div>
            <button
              @click="nextCarousel"
              class="w-10 h-10 rounded-full border border-dark-border hover:border-primary/50 text-white flex items-center justify-center hover:bg-primary/10 transition-all cursor-pointer"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ WRITE A REVIEW MODAL ═══════════════════════════════════════════════ -->
    <Transition name="fade">
      <div
        v-if="isReviewModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="isReviewModalOpen = false"
      >
        <div class="absolute inset-0 bg-black/75 backdrop-blur-sm" @click="isReviewModalOpen = false"></div>

        <Transition name="scale">
          <div
            v-if="isReviewModalOpen"
            class="relative bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl w-full max-w-md shadow-2xl z-10 animate-slide-up overflow-hidden p-6"
          >
            <button
              @click="isReviewModalOpen = false"
              class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              ✕
            </button>
            <div class="text-center mb-5">
              <span class="text-3xl block mb-1">⭐</span>
              <h3 class="font-playfair text-xl font-bold text-white">Share Your Sweet Experience</h3>
              <p class="text-xs text-gray-400 mt-1">Your feedback helps us bake with even more love</p>
            </div>

            <form @submit.prevent="submitReview" class="space-y-4">
              <!-- Star Rating Selector -->
              <div>
                <label class="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Your Rating *</label>
                <div class="flex items-center justify-center gap-2 p-2 rounded-xl bg-[#141414] border border-dark-border">
                  <button
                    v-for="star in 5"
                    :key="star"
                    type="button"
                    @click="reviewForm.rating = star"
                    class="text-2xl transition-transform hover:scale-125 cursor-pointer"
                    :class="star <= reviewForm.rating ? 'text-primary' : 'text-gray-600'"
                  >
                    ★
                  </button>
                  <span class="text-xs text-primary font-bold ml-2">{{ reviewForm.rating }} of 5</span>
                </div>
              </div>

              <!-- Name & City -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Your Name *</label>
                  <input v-model="reviewForm.name" type="text" required placeholder="e.g. Bilal" class="input-dark text-xs py-2.5" />
                </div>
                <div>
                  <label class="block text-xs text-gray-400 mb-1 uppercase tracking-wide">City *</label>
                  <select v-model="reviewForm.city" class="input-dark text-xs py-2.5">
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                  </select>
                </div>
              </div>

              <!-- Product Ordered -->
              <div>
                <label class="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Product / Cake (Optional)</label>
                <input v-model="reviewForm.product" type="text" placeholder="e.g. Lotus Biscoff Cake" class="input-dark text-xs py-2.5" />
              </div>

              <!-- Review Message -->
              <div>
                <label class="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Your Review *</label>
                <textarea
                  v-model="reviewForm.review"
                  required
                  rows="3"
                  placeholder="How was the taste, freshness, and delivery?"
                  class="input-dark text-xs resize-none"
                ></textarea>
              </div>

              <!-- Submit -->
              <button
                type="submit"
                class="w-full bg-primary text-[#0D0D0D] font-bold py-3 rounded-xl hover:bg-primary-light transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
              >
                Post Review 🎉
              </button>
            </form>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- ═══ APP DOWNLOAD ════════════════════════════════════════════════════════ -->
    <section class="py-16 app-banner-bg border-y border-[#2A2A2A]">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <p class="text-primary text-xs uppercase tracking-widest font-semibold mb-2">Mobile App</p>
            <h2 class="font-playfair text-4xl font-bold text-white mb-4">
              Order Faster with<br/><span class="text-primary">Our App</span>
            </h2>
            <p class="text-gray-400 text-lg mb-6 max-w-md">
              Get exclusive app-only deals, track your order in real time, and enjoy a seamless ordering experience.
            </p>
            <div class="flex flex-wrap gap-3">
              <a href="#" class="flex items-center gap-3 app-badge-btn rounded-2xl px-5 py-3 hover:opacity-90 transition-opacity">
                <span class="text-3xl">🍎</span>
                <div>
                  <p class="text-[10px] font-medium opacity-70">Download on the</p>
                  <p class="font-bold text-sm">App Store</p>
                </div>
              </a>
              <a href="#" class="flex items-center gap-3 app-badge-btn rounded-2xl px-5 py-3 hover:opacity-90 transition-opacity">
                <span class="text-3xl">▶</span>
                <div>
                  <p class="text-[10px] font-medium opacity-70">Get it on</p>
                  <p class="font-bold text-sm">Google Play</p>
                </div>
              </a>
            </div>
            <!-- App perks -->
            <div class="flex flex-wrap gap-4 mt-5">
              <div v-for="perk in appPerks" :key="perk" class="flex items-center gap-2 text-sm text-gray-400">
                <span class="text-primary">✓</span>
                {{ perk }}
              </div>
            </div>
          </div>
          <div class="relative w-64 flex-shrink-0 hidden md:block">
            <div class="w-64 h-80 bg-[#1A1A1A] border border-[#2A2A2A] rounded-[2.5rem] overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80" class="w-full h-full object-cover opacity-40" />
              <div class="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <span class="text-5xl mb-3">🎂</span>
                <p class="font-playfair text-xl font-bold text-white">My Bakery</p>
                <p class="text-gray-400 text-xs mt-1">Premium Bakery App</p>
                <div class="mt-4 bg-primary text-[#0D0D0D] font-bold text-xs px-4 py-2 rounded-full">
                  Order Now
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import { categories, heroSlides, testimonials } from '@/data/products'
import { useCartStore } from '@/stores/cart'
import { useLocationStore } from '@/stores/location'

const cartStore = useCartStore()
const locationStore = useLocationStore()

// Hero Slides
const slides = heroSlides
const currentSlide = ref(0)
let slideTimer = null

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}
function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}
function goToSlide(i) {
  currentSlide.value = i
  resetTimer()
}
function resetTimer() {
  clearInterval(slideTimer)
  slideTimer = setInterval(nextSlide, 5000)
}

onMounted(() => {
  slideTimer = setInterval(nextSlide, 5000)
  carouselTimer = setInterval(() => {
    if (viewMode.value === 'carousel') {
      nextCarousel()
    }
  }, 4500)
})

onUnmounted(() => {
  clearInterval(slideTimer)
  clearInterval(carouselTimer)
})

const stats = [
  { value: '50K+',  label: 'Happy Customers' },
  { value: '200+',  label: 'Menu Items' },
  { value: '4.9★',  label: 'App Rating' },
]

const howItWorks = [
  { step: 1, icon: '🍰', title: 'Browse Menu',   desc: 'Explore our wide range of cakes, pastries & more' },
  { step: 2, icon: '🛒', title: 'Add to Cart',   desc: 'Choose your items and customise your order' },
  { step: 3, icon: '🚀', title: 'Fast Delivery', desc: 'We deliver fresh to your door in 45–60 minutes' },
]

const appPerks = ['Exclusive app deals', 'Real-time tracking', 'Easy reorders', 'Loyalty rewards']

// Filter products based on selected branch availability
const featuredProducts = computed(() => locationStore.branchProducts.filter(p => p.isFeatured).slice(0, 8))
const bestSellers      = computed(() => locationStore.branchProducts.filter(p => p.isBestSeller).slice(0, 8))

function onProductAdded(product) {
  // Cart drawer opens automatically via store toggle
}

// ─── Dynamic & Animated Testimonials State ──────────────────
const savedUserReviews = JSON.parse(localStorage.getItem('bakery_user_reviews') || '[]')
const allReviews = ref([...savedUserReviews, ...testimonials])

const selectedReviewCity = ref('All')
const viewMode = ref('marquee') // 'marquee' | 'carousel'
const isMarqueePaused = ref(false)

const filteredReviews = computed(() => {
  if (selectedReviewCity.value.toLowerCase() === 'all') {
    return allReviews.value
  }
  return allReviews.value.filter(
    (t) => t.city.toLowerCase() === selectedReviewCity.value.toLowerCase()
  )
})

// Duplicate reviews so the horizontal marquee has zero gaps during infinite loop
const marqueeTrack1 = computed(() => {
  const list = filteredReviews.value
  if (!list.length) return []
  const base = list.filter((_, i) => i % 2 === 0)
  const source = base.length >= 2 ? base : list
  return [...source, ...source, ...source, ...source]
})

const marqueeTrack2 = computed(() => {
  const list = filteredReviews.value
  if (!list.length) return []
  const base = list.filter((_, i) => i % 2 !== 0)
  const source = base.length >= 2 ? base : list
  return [...source, ...source, ...source, ...source]
})

// Spotlight Carousel Slider
const carouselIndex = ref(0)
let carouselTimer = null

const currentCarouselReview = computed(() => {
  const list = filteredReviews.value
  if (!list.length) return allReviews.value[0] || {}
  return list[carouselIndex.value % list.length]
})

function nextCarousel() {
  const len = filteredReviews.value.length || 1
  carouselIndex.value = (carouselIndex.value + 1) % len
}

function prevCarousel() {
  const len = filteredReviews.value.length || 1
  carouselIndex.value = (carouselIndex.value - 1 + len) % len
}

// Write a Review Modal State & Submit
const isReviewModalOpen = ref(false)
const reviewSuccessToast = ref(false)
const reviewForm = ref({
  name: '',
  city: 'Faisalabad',
  product: '',
  rating: 5,
  review: '',
})

function openReviewModal() {
  isReviewModalOpen.value = true
}

function submitReview() {
  if (!reviewForm.value.name || !reviewForm.value.review) return

  const initials = reviewForm.value.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'CU'

  const newReview = {
    id: Date.now(),
    name: reviewForm.value.name,
    city: reviewForm.value.city,
    branch: reviewForm.value.city === 'Faisalabad' ? 'Kohinoor City' : `${reviewForm.value.city} Branch`,
    rating: Number(reviewForm.value.rating) || 5,
    product: reviewForm.value.product || 'Fresh Artisan Delight',
    review: reviewForm.value.review,
    avatar: initials,
    date: 'Just now',
    verified: true,
  }

  allReviews.value.unshift(newReview)

  // Persist in localStorage
  const stored = JSON.parse(localStorage.getItem('bakery_user_reviews') || '[]')
  stored.unshift(newReview)
  localStorage.setItem('bakery_user_reviews', JSON.stringify(stored))

  // Reset form & trigger celebration toast
  reviewForm.value = {
    name: '',
    city: 'Faisalabad',
    product: '',
    rating: 5,
    review: '',
  }
  isReviewModalOpen.value = false
  reviewSuccessToast.value = true
  setTimeout(() => {
    reviewSuccessToast.value = false
  }, 4000)
}
</script>

