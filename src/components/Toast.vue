<template>
  <div class="fixed bottom-6 right-6 z-[60] flex flex-col gap-2 pointer-events-none">
    <TransitionGroup name="slide-up" tag="div" class="flex flex-col gap-2">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border max-w-xs"
        :class="toastClass(toast.type)"
      >
        <span class="text-lg flex-shrink-0">{{ toast.icon }}</span>
        <div class="flex-1 min-w-0">
          <p v-if="toast.title" class="text-xs font-bold uppercase tracking-wide opacity-70">{{ toast.title }}</p>
          <p class="text-sm font-medium">{{ toast.message }}</p>
        </div>
        <button
          @click="removeToast(toast.id)"
          class="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const toasts = ref([])
let counter = 0

function toastClass(type) {
  const map = {
    success: 'bg-emerald-900/90 border-emerald-500/40 text-emerald-100 backdrop-blur-sm',
    error:   'bg-red-900/90 border-red-500/40 text-red-100 backdrop-blur-sm',
    info:    'bg-[#1A1A1A]/95 border-primary/40 text-white backdrop-blur-sm',
    warning: 'bg-amber-900/90 border-amber-500/40 text-amber-100 backdrop-blur-sm',
  }
  return map[type] || map.info
}

function addToast({ message, type = 'info', title = '', icon = '', duration = 3000 }) {
  const id = ++counter
  const icons = { success: '✅', error: '❌', info: '🛒', warning: '⚠️' }
  toasts.value.push({ id, message, type, title, icon: icon || icons[type] || '📢' })
  setTimeout(() => removeToast(id), duration)
}

function removeToast(id) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

defineExpose({ addToast })
</script>

