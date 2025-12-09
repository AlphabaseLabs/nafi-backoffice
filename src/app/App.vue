<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useThemeStore } from '@/stores/theme.store'

// Initialize theme store - this applies the theme class to <html> on app load
useThemeStore()
</script>

<template>
  <RouterView />
</template>
