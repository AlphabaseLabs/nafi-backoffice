<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme.store'

const themeStore = useThemeStore()
</script>

<template>
  <button
    @click="themeStore.toggleTheme"
    class="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    :title="`Switch to ${themeStore.theme === 'light' ? 'dark' : 'light'} mode`"
  >
    <Sun v-if="themeStore.theme === 'dark'" class="h-4 w-4" />
    <Moon v-else class="h-4 w-4" />
  </button>
</template>

