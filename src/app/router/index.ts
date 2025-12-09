import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { authRoutes } from '@modules/auth/routes'
import { dashboardRoutes } from '@modules/dashboard/routes'

const routes: RouteRecordRaw[] = [...authRoutes, ...dashboardRoutes]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Global navigation guard for authentication
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Initialize auth if not already initialized
  if (!authStore.initialized) {
    await authStore.initializeAuth()
  }

  const requiresAuth = to.meta.requiresAuth === true
  const guestOnly = to.meta.guestOnly === true

  // Handle protected routes
  if (requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'auth.signin', query: { redirect: to.fullPath } })
  }

  // Handle guest-only routes (signin, signup, etc.)
  if (guestOnly && authStore.isAuthenticated) {
    return next({ name: 'dashboard.home' })
  }

  return next()
})

export default router
