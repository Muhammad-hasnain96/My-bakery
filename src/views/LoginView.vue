<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-20">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <RouterLink to="/" class="inline-flex items-center gap-2 mb-2">
          <span class="text-3xl">🎂</span>
          <span class="font-playfair text-2xl font-bold text-primary">My Bakery</span>
        </RouterLink>
        <h1 class="font-playfair text-3xl font-bold text-white mt-4">
          {{ isSignup ? 'Create Account' : 'Welcome Back' }}
        </h1>
        <p class="text-gray-400 text-sm mt-1">
          {{ isSignup ? 'Join My Bakery for exclusive deals & faster checkout' : 'Login to continue your sweet journey' }}
        </p>
      </div>

      <!-- Card -->
      <div class="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-2xl">
        <!-- Checkout Redirect Notice Banner -->
        <div v-if="route.query.redirect === '/cart'" class="mb-5 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 flex items-start gap-3">
          <span class="text-xl">🛒</span>
          <div>
            <p class="text-xs font-bold text-amber-300 uppercase tracking-wider">Login Required for Checkout</p>
            <p class="text-xs text-gray-300 mt-0.5">Please sign in or create an account to proceed with your order and delivery address.</p>
          </div>
        </div>

        <!-- 1-Click Quick Demo Login Button -->
        <div class="mb-5 p-3 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-bold text-primary">Need a quick test?</p>
            <p class="text-[11px] text-gray-400">Log in as demo customer: <span class="text-white font-mono">demo@bakery.pk</span></p>
          </div>
          <button
            type="button"
            @click="fillAndLoginDemo"
            :disabled="isLoading"
            class="px-3 py-1.5 rounded-lg bg-primary text-[#0D0D0D] text-xs font-bold hover:bg-primary-light transition-all flex-shrink-0"
          >
            ⚡ Demo Login
          </button>
        </div>

        <!-- Tabs -->
        <div class="flex bg-[#111] rounded-xl p-1 mb-6">
          <button
            @click="isSignup = false"
            class="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
            :class="!isSignup ? 'bg-primary text-[#0D0D0D]' : 'text-gray-400 hover:text-white'"
          >Login</button>
          <button
            @click="isSignup = true"
            class="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
            :class="isSignup ? 'bg-primary text-[#0D0D0D]' : 'text-gray-400 hover:text-white'"
          >Sign Up</button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div v-if="isSignup">
            <label class="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Full Name *</label>
            <input v-model="form.name" type="text" required placeholder="Your full name" class="input-dark" />
          </div>

          <div>
            <label class="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Email *</label>
            <input v-model="form.email" type="email" required placeholder="your@email.com" class="input-dark" />
          </div>

          <div v-if="isSignup">
            <label class="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Phone Number *</label>
            <input v-model="form.phone" type="tel" required placeholder="0300-XXXXXXX" class="input-dark" />
          </div>

          <div>
            <label class="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Password *</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                :minlength="isSignup ? 6 : 1"
                placeholder="Enter password"
                class="input-dark pr-12"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <!-- Confirm password -->
          <div v-if="isSignup">
            <label class="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Confirm Password *</label>
            <input v-model="form.confirmPassword" type="password" required placeholder="Re-enter password" class="input-dark" />
            <p v-if="form.confirmPassword && form.password !== form.confirmPassword" class="text-red-400 text-xs mt-1">Passwords don't match</p>
          </div>

          <!-- Forgot Password -->
          <div v-if="!isSignup" class="text-right">
            <a href="#" class="text-xs text-primary hover:underline">Forgot password?</a>
          </div>

          <!-- Error message -->
          <p v-if="error" class="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
            {{ error }}
          </p>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-primary text-[#0D0D0D] font-bold py-3.5 rounded-xl hover:bg-primary-light transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <span v-if="isLoading" class="animate-spin">⏳</span>
            {{ isLoading ? 'Please wait...' : (isSignup ? 'Create Account & Continue' : 'Login & Continue') }}
          </button>

          <!-- Divider -->
          <div class="relative flex items-center gap-3">
            <div class="flex-1 h-px bg-dark-border"></div>
            <span class="text-xs text-gray-500">or continue with</span>
            <div class="flex-1 h-px bg-dark-border"></div>
          </div>

          <!-- Social Login -->
          <div class="grid grid-cols-2 gap-3">
            <button type="button" @click="handleSocialLogin('Google')" class="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dark-border text-gray-300 hover:border-primary/40 hover:text-primary text-sm transition-all">
              <span>🔵</span> Google
            </button>
            <button type="button" @click="handleSocialLogin('Facebook')" class="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dark-border text-gray-300 hover:border-primary/40 hover:text-primary text-sm transition-all">
              <span>📘</span> Facebook
            </button>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <p class="text-center text-xs text-gray-500 mt-5">
        By continuing you agree to our
        <a href="#" class="text-primary hover:underline">Terms of Service</a> &
        <a href="#" class="text-primary hover:underline">Privacy Policy</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isSignup     = ref(false)
const showPassword = ref(false)
const isLoading    = ref(false)
const error        = ref('')

const form = ref({ name: '', email: '', phone: '', password: '', confirmPassword: '' })

onMounted(() => {
  if (route.query.mode === 'signup') {
    isSignup.value = true
  }
})

async function fillAndLoginDemo() {
  form.value.email = 'demo@bakery.pk'
  form.value.password = 'password123'
  isSignup.value = false
  await handleSubmit()
}

function handleSocialLogin(provider) {
  authStore.login({
    name: `User via ${provider}`,
    email: `customer@${provider.toLowerCase()}.com`,
    phone: '0300-1234567',
  })
  const target = route.query.redirect || '/'
  router.push(target)
}

async function handleSubmit() {
  error.value = ''
  if (isSignup.value && form.value.password !== form.value.confirmPassword) {
    error.value = 'Passwords do not match.'
    return
  }
  isLoading.value = true

  try {
    if (isSignup.value) {
      await authStore.registerUser({
        name: form.value.name,
        email: form.value.email,
        phone: form.value.phone,
        password: form.value.password,
      })
    } else {
      await authStore.loginUser({
        email: form.value.email,
        password: form.value.password,
      })
    }
    const target = route.query.redirect || '/'
    router.push(target)
  } catch (err) {
    error.value = err.message || 'Authentication failed. Please check your credentials.'
  } finally {
    isLoading.value = false
  }
}
</script>

