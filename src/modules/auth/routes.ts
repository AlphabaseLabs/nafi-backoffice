import type { RouteRecordRaw } from 'vue-router'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth/signin',
    name: 'auth.signin',
    component: () => import('./pages/SignInPage.vue'),
    meta: {
      public: true,
      guestOnly: true,
    },
  },
  {
    path: '/auth/signup',
    name: 'auth.signup',
    component: () => import('./pages/SignUpPage.vue'),
    meta: {
      public: true,
      guestOnly: true,
    },
  },
  {
    path: '/auth/forgot-password',
    name: 'auth.forgot-password',
    component: () => import('./pages/ForgotPasswordPage.vue'),
    meta: {
      public: true,
      guestOnly: true,
    },
  },
]
