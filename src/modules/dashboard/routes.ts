import type { RouteRecordRaw } from 'vue-router'

export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard.home',
    component: () => import('./pages/HomePage.vue'),
    meta: {
      requiresAuth: true,
    },
  },
]
