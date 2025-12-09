<script setup lang="ts">
/**
 * AuthButton - Primary action button for auth forms
 * 
 * Usage:
 * <AuthButton :loading="isLoading">Log in</AuthButton>
 */

interface Props {
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'submit',
  loading: false,
  disabled: false,
})
</script>

<template>
  <button
    :type="type"
    :disabled="loading || disabled"
    class="auth-button"
  >
    <span v-if="loading" class="loading-spinner" />
    <slot />
  </button>
</template>

<style scoped>
@reference "../../../assets/index.css";

.auth-button {
  @apply w-full rounded-lg py-2.5;
  @apply text-sm font-medium;
  @apply bg-primary text-primary-foreground;
  @apply transition-colors;
  @apply hover:bg-primary/90;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2;
  @apply disabled:pointer-events-none disabled:opacity-50;
  @apply inline-flex items-center justify-center gap-2;
}

.loading-spinner {
  @apply h-4 w-4 animate-spin rounded-full;
  @apply border-2 border-current border-t-transparent;
}
</style>

