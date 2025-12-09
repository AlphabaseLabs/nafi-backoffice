import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, Session } from '@supabase/supabase-js'
import { authApi } from '@modules/auth/api/auth.api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const initialized = ref(false)
  const loading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!session.value)

  // Actions
  async function initializeAuth() {
    if (initialized.value) return

    try {
      loading.value = true
      const currentSession = await authApi.getSession()

      if (currentSession) {
        session.value = currentSession
        const currentUser = await authApi.getUser()
        user.value = currentUser
      }

      // Listen to auth state changes
      authApi.onAuthStateChange((_event, newSession) => {
        session.value = (newSession as Session) ?? null
        user.value = (newSession as Session)?.user ?? null
      })

      initialized.value = true
    } catch (error) {
      console.error('Failed to initialize auth:', error)
    } finally {
      loading.value = false
    }
  }

  async function signIn(email: string, password: string) {
    try {
      loading.value = true
      const data = await authApi.signIn({ email, password })
      user.value = data.user
      session.value = data.session
      return data
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function signUp(email: string, password: string, fullName?: string) {
    try {
      loading.value = true
      const data = await authApi.signUp({ email, password, fullName })
      user.value = data.user
      session.value = data.session
      return data
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function signOut() {
    try {
      loading.value = true
      await authApi.signOut()
      user.value = null
      session.value = null
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function resetPassword(email: string) {
    try {
      loading.value = true
      await authApi.resetPasswordForEmail({ email })
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updatePassword(newPassword: string) {
    try {
      loading.value = true
      await authApi.updatePassword(newPassword)
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    user,
    session,
    initialized,
    loading,
    // Getters
    isAuthenticated,
    // Actions
    initializeAuth,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  }
})

