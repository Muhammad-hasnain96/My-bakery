import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { API_BASE } from '@/lib/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const isAuthLoading = ref(false)
  const authError = ref('')

  const isLoggedIn = computed(() => !!user.value)
  const isSuperAdmin = computed(() => user.value?.role === 'superadmin')
  const isBranchManager = computed(() => user.value?.role === 'branch_manager')
  const isStaff = computed(() => isSuperAdmin.value || isBranchManager.value)
  const assignedBranchId = computed(() => user.value?.branchId || null)
  const assignedBranchName = computed(() => user.value?.branchName || null)

  function setUser(userData) {
    user.value = userData
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData))
    } else {
      localStorage.removeItem('user')
    }
  }

  // Direct login setter (for backwards compatibility)
  function login(userData) {
    setUser(userData)
  }

  // Login against backend SQLite API
  async function loginUser({ email, password }) {
    isAuthLoading.value = true
    authError.value = ''
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }
      setUser(data.user)
      return { success: true, user: data.user }
    } catch (err) {
      authError.value = err.message
      throw err
    } finally {
      isAuthLoading.value = false
    }
  }

  // Register against backend SQLite API
  async function registerUser({ name, email, phone, password }) {
    isAuthLoading.value = true
    authError.value = ''
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }
      setUser(data.user)
      return { success: true, user: data.user }
    } catch (err) {
      authError.value = err.message
      throw err
    } finally {
      isAuthLoading.value = false
    }
  }

  // Helper to log in as default demo user instantly
  async function loginAsDemo() {
    return loginUser({ email: 'demo@bakery.pk', password: 'password123' })
  }

  // Helper for quick staff logins (testing / demo)
  async function loginAsStaff(email, password) {
    return loginUser({ email, password })
  }

  function logout() {
    setUser(null)
  }

  return {
    user,
    isLoggedIn,
    isSuperAdmin,
    isBranchManager,
    isStaff,
    assignedBranchId,
    assignedBranchName,
    isAuthLoading,
    authError,
    login,
    setUser,
    loginUser,
    registerUser,
    loginAsDemo,
    loginAsStaff,
    logout,
  }
})

