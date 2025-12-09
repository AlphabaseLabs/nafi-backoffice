import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark'

export const useThemeStore = defineStore('theme', () => {
  // Get initial theme from localStorage or system preference
  const getInitialTheme = (): Theme => {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored) return stored

    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  }

  const theme = ref<Theme>(getInitialTheme())

  // Apply theme to document
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    if (newTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  // Watch for theme changes
  watch(
    theme,
    (newTheme) => {
      localStorage.setItem('theme', newTheme)
      applyTheme(newTheme)
    },
    { immediate: true }
  )

  // Toggle theme
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  // Set specific theme
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
  }

  return {
    theme,
    toggleTheme,
    setTheme,
  }
})

