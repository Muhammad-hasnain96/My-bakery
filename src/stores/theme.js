import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // Read saved theme or default to 'dark'
  const savedTheme = localStorage.getItem('bakery-theme') || 'dark'
  const currentTheme = ref(savedTheme)

  function applyTheme(theme) {
    currentTheme.value = theme
    localStorage.setItem('bakery-theme', theme)
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.add('light')
      root.classList.remove('dark')
    } else {
      root.classList.add('dark')
      root.classList.remove('light')
    }
  }

  function toggleTheme() {
    applyTheme(currentTheme.value === 'dark' ? 'light' : 'dark')
  }

  // Initialize theme on start
  applyTheme(savedTheme)

  return {
    currentTheme,
    isDark: () => currentTheme.value === 'dark',
    toggleTheme,
    applyTheme,
  }
})

