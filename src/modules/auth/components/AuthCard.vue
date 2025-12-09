<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme.store'

/**
 * AuthCard - Container card for authentication pages
 * 
 * Usage:
 * <AuthCard title="Login" subtitle="Welcome back">
 *   <form>...</form>
 * </AuthCard>
 */

interface Props {
  title: string
  subtitle?: string
}

defineProps<Props>()

const themeStore = useThemeStore()
</script>

<template>
  <div class="auth-page">
    <!-- Theme toggle in corner -->
    <button
      @click="themeStore.toggleTheme"
      class="theme-toggle"
      :title="`Switch to ${themeStore.theme === 'light' ? 'dark' : 'light'} mode`"
    >
      <Sun v-if="themeStore.theme === 'dark'" class="toggle-icon" />
      <Moon v-else class="toggle-icon" />
    </button>

    <div class="auth-card">
      <h1 class="auth-title">{{ title }}</h1>
      <p v-if="subtitle" class="auth-subtitle">{{ subtitle }}</p>
      <slot />
    </div>
  </div>
</template>

<style scoped>
@reference "../../../assets/index.css";

.auth-page {
  @apply relative flex min-h-screen items-center justify-center p-4;
  @apply bg-background;
  @apply transition-colors;
}

.theme-toggle {
  @apply absolute top-4 right-4;
  @apply inline-flex h-10 w-10 items-center justify-center rounded-md;
  @apply text-muted-foreground;
  @apply hover:bg-accent hover:text-accent-foreground;
  @apply transition-colors;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring;
}

.toggle-icon {
  @apply h-5 w-5;
}

.auth-card {
  @apply w-full max-w-md rounded-lg p-6;
  @apply bg-card text-card-foreground;
  @apply border border-border shadow-sm;
}

.auth-title {
  @apply mb-2 text-center text-2xl font-semibold tracking-tight;
  @apply text-foreground;
}

.auth-subtitle {
  @apply mb-6 text-center text-sm;
  @apply text-muted-foreground;
}

/* When there's no subtitle, add margin to title */
.auth-title:last-of-type {
  @apply mb-6;
}
</style>

